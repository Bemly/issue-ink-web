type user = {
  login: string,
  avatar_url: string,
  html_url: string,
}

type label = {
  id: int,
  name: string,
  description: option<string>,
  color: string,
}

type issue = {
  number: int,
  title: string,
  body: option<string>,
  state: string,
  html_url: string,
  user: user,
  labels: array<label>,
  comments: int,
  created_at: string,
  updated_at: string,
}

type comment = {
  id: int,
  user: user,
  body: string,
  created_at: string,
  updated_at: string,
  html_url: string,
}

type response = {ok: bool, status: int}

@val external fetch: (string, {..}) => promise<response> = "fetch"
@send external json: response => promise<JSON.t> = "json"

let baseUrl = "https://api.github.com"

let headers = () => {
  let base = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": Config.apiVersion,
  }
  if Config.accessToken == "" {
    base
  } else {
    Object.assign(base, {"Authorization": `Bearer ${Config.accessToken}`})
  }
}

let decodeUser = (obj: dict<JSON.t>): user => {
  login: obj->Dict.get("login")->Option.getOrThrow->JSON.Decode.string->Option.getOrThrow,
  avatar_url: obj->Dict.get("avatar_url")->Option.getOrThrow->JSON.Decode.string->Option.getOrThrow,
  html_url: obj->Dict.get("html_url")->Option.getOrThrow->JSON.Decode.string->Option.getOrThrow,
}

let decodeLabel = (obj: dict<JSON.t>): label => {
  id: obj
  ->Dict.get("id")
  ->Option.getOrThrow
  ->JSON.Decode.float
  ->Option.getOrThrow
  ->Belt.Float.toInt,
  name: obj->Dict.get("name")->Option.getOrThrow->JSON.Decode.string->Option.getOrThrow,
  description: obj->Dict.get("description")->Option.flatMap(_, JSON.Decode.string),
  color: obj->Dict.get("color")->Option.getOrThrow->JSON.Decode.string->Option.getOrThrow,
}

let decodeIssue = (json: JSON.t): option<issue> => {
  switch JSON.Decode.object(json) {
  | None => None
  | Some(obj) => {
      let getStr = key => obj->Dict.get(key)->Option.flatMap(_, JSON.Decode.string)
      let getStrExn = key => getStr(key)->Option.getOrThrow
      let getInt = key =>
        obj
        ->Dict.get(key)
        ->Option.flatMap(_, JSON.Decode.float)
        ->Option.map(_, Belt.Float.toInt)

      // Skip pull requests
      if obj->Dict.get("pull_request")->Option.isSome {
        None
      } else {
        let user =
          obj
          ->Dict.get("user")
          ->Option.flatMap(_, JSON.Decode.object)
          ->Option.getOrThrow
          ->decodeUser
        let labels = switch obj->Dict.get("labels") {
        | Some(arr) =>
          arr
          ->JSON.Decode.array
          ->Option.getOr([])
          ->Array.filterMap(l => l->JSON.Decode.object->Option.map(_, decodeLabel))
        | None => []
        }

        Some({
          number: getInt("number")->Option.getOrThrow,
          title: getStrExn("title"),
          body: getStr("body"),
          state: getStrExn("state"),
          html_url: getStrExn("html_url"),
          user,
          labels,
          comments: getInt("comments")->Option.getOr(0),
          created_at: getStrExn("created_at"),
          updated_at: getStrExn("updated_at"),
        })
      }
    }
  }
}

let decodeComment = (json: JSON.t): option<comment> => {
  switch JSON.Decode.object(json) {
  | None => None
  | Some(obj) => {
      let getStr = key => obj->Dict.get(key)->Option.flatMap(_, JSON.Decode.string)
      let getStrExn = key => getStr(key)->Option.getOrThrow
      let getInt = key =>
        obj
        ->Dict.get(key)
        ->Option.flatMap(_, JSON.Decode.float)
        ->Option.map(_, Belt.Float.toInt)

      let user =
        obj->Dict.get("user")->Option.flatMap(_, JSON.Decode.object)->Option.getOrThrow->decodeUser

      Some({
        id: getInt("id")->Option.getOrThrow,
        user,
        body: getStrExn("body"),
        created_at: getStrExn("created_at"),
        updated_at: getStrExn("updated_at"),
        html_url: getStrExn("html_url"),
      })
    }
  }
}

let fetchJson = async (url: string): option<JSON.t> => {
  try {
    let resp = await fetch(url, {"headers": headers()})
    if resp.ok {
      Some(await json(resp))
    } else {
      Console.error2("GitHub API error:", resp.status)
      None
    }
  } catch {
  | _ => {
      Console.error("Fetch failed for: " ++ url)
      None
    }
  }
}

let getIssues = async (~page: int, ~perPage: int, ~labels: option<string>=?): array<issue> => {
  let labelParam = switch labels {
  | Some(l) => `&labels=${encodeURIComponent(l)}`
  | None => ""
  }
  let url = `${baseUrl}/repos/${Config.owner}/${Config.repo}/issues?state=all&per_page=${Belt.Int.toString(
      perPage,
    )}&page=${Belt.Int.toString(page)}${labelParam}`
  switch await fetchJson(url) {
  | Some(json) =>
    json
    ->JSON.Decode.array
    ->Option.getOr([])
    ->Array.filterMap(decodeIssue)
  | None => []
  }
}

let getIssue = async (number: int): option<issue> => {
  let url = `${baseUrl}/repos/${Config.owner}/${Config.repo}/issues/${Belt.Int.toString(number)}`
  switch await fetchJson(url) {
  | Some(json) => decodeIssue(json)
  | None => None
  }
}

let getComments = async (issueNumber: int): array<comment> => {
  let url = `${baseUrl}/repos/${Config.owner}/${Config.repo}/issues/${Belt.Int.toString(
      issueNumber,
    )}/comments`
  switch await fetchJson(url) {
  | Some(json) =>
    json
    ->JSON.Decode.array
    ->Option.getOr([])
    ->Array.filterMap(decodeComment)
  | None => []
  }
}

let getLabels = async (): array<label> => {
  let url = `${baseUrl}/repos/${Config.owner}/${Config.repo}/labels`
  switch await fetchJson(url) {
  | Some(json) =>
    json
    ->JSON.Decode.array
    ->Option.getOr([])
    ->Array.filterMap(l => l->JSON.Decode.object->Option.map(_, decodeLabel))
  | None => []
  }
}

@val external encodeURIComponent: string => string = "encodeURIComponent"
