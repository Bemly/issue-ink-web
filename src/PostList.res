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

let postTitle = (post: GithubApi.post): string => {
  switch post {
  | IssuePost(issue) => issue.title
  | DiscussionPost(discussion) => discussion.title
  }
}

let postBody = (post: GithubApi.post): option<string> => {
  switch post {
  | IssuePost(issue) => issue.body
  | DiscussionPost(discussion) => discussion.body
  }
}

let postCreatedAt = (post: GithubApi.post): string => {
  switch post {
  | IssuePost(issue) => issue.created_at
  | DiscussionPost(discussion) => discussion.created_at
  }
}

let postUser = (post: GithubApi.post): GithubApi.user => {
  switch post {
  | IssuePost(issue) => issue.user
  | DiscussionPost(discussion) => discussion.user
  }
}

let postComments = (post: GithubApi.post): int => {
  switch post {
  | IssuePost(issue) => issue.comments
  | DiscussionPost(discussion) => discussion.comments
  }
}

let postRoute = (post: GithubApi.post): Router.route => {
  switch post {
  | IssuePost(issue) => PostDetail("issue", issue.number)
  | DiscussionPost(discussion) => PostDetail("discussion", discussion.number)
  }
}

let postTypeBadge = (post: GithubApi.post): option<string> => {
  switch post {
  | IssuePost(_) => None
  | DiscussionPost(d) => Some(d.category.name)
  }
}

let renderPostCard = (post: GithubApi.post): DomHelpers.element => {
  let card = DomHelpers.createElement("article")
  card->DomHelpers.setClassName("post-card")

  // Title
  let titleLink = DomHelpers.createElement("a")
  titleLink->DomHelpers.setTextContent(postTitle(post))
  titleLink->DomHelpers.setAttribute("href", Router.routeToString(postRoute(post)))
  titleLink->DomHelpers.setClassName("post-card-title")
  card->DomHelpers.appendChild(titleLink)

  // Meta info
  let meta = DomHelpers.createElement("div")
  meta->DomHelpers.setClassName("post-card-meta")

  let dateSpan = DomHelpers.createElement("span")
  dateSpan->DomHelpers.setTextContent(formatDate(postCreatedAt(post)))
  dateSpan->DomHelpers.setClassName("post-card-date")
  meta->DomHelpers.appendChild(dateSpan)

  let authorSpan = DomHelpers.createElement("span")
  authorSpan->DomHelpers.setTextContent("by " ++ postUser(post).login)
  authorSpan->DomHelpers.setClassName("post-card-author")
  meta->DomHelpers.appendChild(authorSpan)

  let commentsSpan = DomHelpers.createElement("span")
  commentsSpan->DomHelpers.setTextContent(
    Belt.Int.toString(postComments(post)) ++ " comments",
  )
  commentsSpan->DomHelpers.setClassName("post-card-comments")
  meta->DomHelpers.appendChild(commentsSpan)

  card->DomHelpers.appendChild(meta)

  // Badges: labels for issues, category for discussions
  let badgesDiv = DomHelpers.createElement("div")
  badgesDiv->DomHelpers.setClassName("post-card-labels")
  let hasBadges = ref(false)

  // Type badge
  switch postTypeBadge(post) {
  | Some(catName) => {
      let pill = DomHelpers.createElement("span")
      pill->DomHelpers.setTextContent(catName)
      pill->DomHelpers.setClassName("label-pill small")
      pill->DomHelpers.setStyle("background-color: #6e40c9; color: #fff")
      badgesDiv->DomHelpers.appendChild(pill)
      hasBadges := true
    }
  | None => ()
  }

  // Labels (issues only)
  switch post {
  | IssuePost(issue) =>
    issue.labels->Array.forEach(label => {
      let pill = DomHelpers.createElement("span")
      pill->DomHelpers.setTextContent(label.name)
      pill->DomHelpers.setClassName("label-pill small")
      pill->DomHelpers.setStyle("background-color: #" ++ label.color)
      badgesDiv->DomHelpers.appendChild(pill)
      hasBadges := true
    })
  | DiscussionPost(_) => ()
  }

  if hasBadges.contents {
    card->DomHelpers.appendChild(badgesDiv)
  }

  // Excerpt
  let excerpt = DomHelpers.createElement("p")
  excerpt->DomHelpers.setTextContent(makeExcerpt(postBody(post)))
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

  let posts = await GithubApi.getPosts(~page, ~perPage=Config.perPage, ~labels=?filterLabel)

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
      posts
    } else {
      posts->Array.filter(post => {
        String.toLowerCase(postTitle(post))->String.includes(searchFilter->String.toLowerCase)
      })
    }

  if Array.length(filtered) == 0 {
    let empty = DomHelpers.createElement("div")
    empty->DomHelpers.setClassName("empty-state")
    empty->DomHelpers.setTextContent("No posts found.")
    container->DomHelpers.appendChild(empty)
  } else {
    filtered->Array.forEach(post => {
      container->DomHelpers.appendChild(renderPostCard(post))
    })
  }

  let hasMore = Array.length(posts) == Config.perPage
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
