let formatDate = (_dateStr: string): string => {
  %raw(`new Date(_dateStr).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })`)
}

let makeExcerpt = (body: option<string>): string => {
  switch body {
  | Some(text) => {
      let len = String.length(text)
      if len > 150 {
        String.slice(text, ~start=0, ~end=150) ++ "..."
      } else {
        text
      }
    }
  | None => "No content"
  }
}

let renderIssueCard = (issue: GithubApi.issue): DomHelpers.element => {
  let card = DomHelpers.createElement("article")
  card->DomHelpers.setClassName("post-card")

  // Title
  let titleLink = DomHelpers.createElement("a")
  titleLink->DomHelpers.setTextContent(issue.title)
  titleLink->DomHelpers.setAttribute(
    "href",
    Router.routeToString(PostDetail(issue.number)),
  )
  titleLink->DomHelpers.setClassName("post-card-title")
  card->DomHelpers.appendChild(titleLink)

  // Meta info
  let meta = DomHelpers.createElement("div")
  meta->DomHelpers.setClassName("post-card-meta")

  let dateSpan = DomHelpers.createElement("span")
  dateSpan->DomHelpers.setTextContent(formatDate(issue.created_at))
  dateSpan->DomHelpers.setClassName("post-card-date")
  meta->DomHelpers.appendChild(dateSpan)

  let authorSpan = DomHelpers.createElement("span")
  authorSpan->DomHelpers.setTextContent("by " ++ issue.user.login)
  authorSpan->DomHelpers.setClassName("post-card-author")
  meta->DomHelpers.appendChild(authorSpan)

  let commentsSpan = DomHelpers.createElement("span")
  commentsSpan->DomHelpers.setTextContent(
    Belt.Int.toString(issue.comments) ++ " comments",
  )
  commentsSpan->DomHelpers.setClassName("post-card-comments")
  meta->DomHelpers.appendChild(commentsSpan)

  card->DomHelpers.appendChild(meta)

  // Labels
  if Array.length(issue.labels) > 0 {
    let labelsDiv = DomHelpers.createElement("div")
    labelsDiv->DomHelpers.setClassName("post-card-labels")
    issue.labels->Array.forEach(label => {
      let pill = DomHelpers.createElement("span")
      pill->DomHelpers.setTextContent(label.name)
      pill->DomHelpers.setClassName("label-pill small")
      pill->DomHelpers.setStyle("background-color: #" ++ label.color)
      labelsDiv->DomHelpers.appendChild(pill)
    })
    card->DomHelpers.appendChild(labelsDiv)
  }

  // Excerpt
  let excerpt = DomHelpers.createElement("p")
  excerpt->DomHelpers.setTextContent(makeExcerpt(issue.body))
  excerpt->DomHelpers.setClassName("post-card-excerpt")
  card->DomHelpers.appendChild(excerpt)

  card
}

let render = async (
  container: DomHelpers.element,
  ~page: int,
  ~filterLabel: option<string>=?,
  ~searchFilter: string,
) => {
  container->DomHelpers.setInnerHTML("")

  let loading = DomHelpers.createElement("div")
  loading->DomHelpers.setClassName("loading")
  loading->DomHelpers.setTextContent("Loading posts...")
  container->DomHelpers.appendChild(loading)

  let issues = await GithubApi.getIssues(~page, ~perPage=Config.perPage, ~labels=?filterLabel)

  container->DomHelpers.setInnerHTML("")

  let title = DomHelpers.createElement("h1")
  title->DomHelpers.setClassName("page-title")
  switch filterLabel {
  | Some(l) => title->DomHelpers.setTextContent("Posts tagged \"" ++ l ++ "\"")
  | None => title->DomHelpers.setTextContent("Posts")
  }
  container->DomHelpers.appendChild(title)

  let filtered =
    if searchFilter == "" {
      issues
    } else {
      issues->Array.filter(issue => {
        String.toLowerCase(issue.title)->String.includes(searchFilter->String.toLowerCase)
      })
    }

  if Array.length(filtered) == 0 {
    let empty = DomHelpers.createElement("div")
    empty->DomHelpers.setClassName("empty-state")
    empty->DomHelpers.setTextContent("No posts found.")
    container->DomHelpers.appendChild(empty)
  } else {
    filtered->Array.forEach(issue => {
      container->DomHelpers.appendChild(renderIssueCard(issue))
    })
  }

  let hasMore = Array.length(issues) == Config.perPage
  Pagination.render(
    container,
    ~currentPage=page,
    ~hasMore,
    ~onPageChange=p =>
      Router.navigate(
        switch filterLabel {
        | Some(l) => LabelFilter(l, p)
        | None => PostList(p)
        },
      ),
  )

  DomHelpers.scrollTo(0, 0)
}
