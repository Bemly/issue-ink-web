type route =
  | PostList(int) // page number
  | PostDetail(int) // issue number
  | Labels
  | LabelFilter(string, int) // label name + page
  | NotFound

let parseHash = (hash: string): route => {
  let cleanHash = hash->String.replace("#", "")
  let parts =
    cleanHash
    ->String.split("/")
    ->Array.filter(p => p != "")

  switch parts {
  | [] => PostList(1)
  | ["post", numberStr] =>
    switch Int.fromString(numberStr) {
    | Some(n) => PostDetail(n)
    | None => NotFound
    }
  | ["labels"] => Labels
  | ["labels", name] => LabelFilter(name, 1)
  | ["page", pageStr] =>
    switch Int.fromString(pageStr) {
    | Some(p) => PostList(p)
    | None => PostList(1)
    }
  | _ => NotFound
  }
}

let currentRoute = ref(PostList(1))

let routeToString = (route: route): string => {
  switch route {
  | PostList(1) => "#/"
  | PostList(p) => `#/page/${Belt.Int.toString(p)}`
  | PostDetail(n) => `#/post/${Belt.Int.toString(n)}`
  | Labels => "#/labels"
  | LabelFilter(name, 1) => `#/labels/${name}`
  | LabelFilter(name, p) => `#/labels/${name}/page/${Belt.Int.toString(p)}`
  | NotFound => "#/"
  }
}

let navigate = (route: route) => {
  DomHelpers.setLocationHash(routeToString(route))
}

let init = (handler: route => unit) => {
  let handleHashChange = () => {
    let hash = DomHelpers.getLocationHash()
    let route = parseHash(hash)
    currentRoute := route
    handler(route)
  }

  DomHelpers.addWindowEventListener("hashchange", handleHashChange)
  // Handle initial load
  handleHashChange()
}
