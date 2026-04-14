let formatDate = (_dateStr: string): string => {
  %raw(`new Date(_dateStr).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })`)
}

let getLabelTextColor = (_color: string): string => {
  %raw(`
    (function() {
      var hex = _color;
      var r = parseInt(hex.substr(0,2), 16);
      var g = parseInt(hex.substr(2,2), 16);
      var b = parseInt(hex.substr(4,2), 16);
      var luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
      return luminance > 0.5 ? "#333" : "#fff";
    })()
  `)
}

let render = async (container: DomHelpers.element, ~issueNumber: int) => {
  container->DomHelpers.setInnerHTML("")

  let loading = DomHelpers.createElement("div")
  loading->DomHelpers.setClassName("loading")
  loading->DomHelpers.setTextContent("Loading post...")
  container->DomHelpers.appendChild(loading)

  // Fetch issue and comments in parallel
  let issuePromise = GithubApi.getIssue(issueNumber)
  let commentsPromise = GithubApi.getComments(issueNumber)
  let issueResult = await issuePromise
  let commentsResult = await commentsPromise

  container->DomHelpers.setInnerHTML("")

  let backLink = DomHelpers.createElement("a")
  backLink->DomHelpers.setTextContent("< Back to posts")
  backLink->DomHelpers.setAttribute("href", Router.routeToString(PostList(1)))
  backLink->DomHelpers.setClassName("back-link")
  container->DomHelpers.appendChild(backLink)

  switch issueResult {
  | None => {
      let error = DomHelpers.createElement("div")
      error->DomHelpers.setClassName("error-state")
      error->DomHelpers.setTextContent("Post not found.")
      container->DomHelpers.appendChild(error)
    }
  | Some(issue) => {
      let article = DomHelpers.createElement("article")
      article->DomHelpers.setClassName("post-detail")

      // Header
      let header = DomHelpers.createElement("header")
      header->DomHelpers.setClassName("post-header")

      let title = DomHelpers.createElement("h1")
      title->DomHelpers.setTextContent(issue.title)
      title->DomHelpers.setClassName("post-title")
      header->DomHelpers.appendChild(title)

      // Meta
      let meta = DomHelpers.createElement("div")
      meta->DomHelpers.setClassName("post-meta")

      let authorInfo = DomHelpers.createElement("div")
      authorInfo->DomHelpers.setClassName("author-info")

      let avatar = DomHelpers.createElement("img")
      avatar->DomHelpers.setAttribute("src", issue.user.avatar_url)
      avatar->DomHelpers.setAttribute("alt", issue.user.login)
      avatar->DomHelpers.setClassName("avatar")
      authorInfo->DomHelpers.appendChild(avatar)

      let authorName = DomHelpers.createElement("a")
      authorName->DomHelpers.setTextContent(issue.user.login)
      authorName->DomHelpers.setAttribute("href", issue.user.html_url)
      authorName->DomHelpers.setAttribute("target", "_blank")
      authorName->DomHelpers.setClassName("author-name")
      authorInfo->DomHelpers.appendChild(authorName)

      meta->DomHelpers.appendChild(authorInfo)

      let dateInfo = DomHelpers.createElement("span")
      dateInfo->DomHelpers.setTextContent(formatDate(issue.created_at))
      dateInfo->DomHelpers.setClassName("post-date")
      meta->DomHelpers.appendChild(dateInfo)

      header->DomHelpers.appendChild(meta)

      // Labels
      if Array.length(issue.labels) > 0 {
        let labelsDiv = DomHelpers.createElement("div")
        labelsDiv->DomHelpers.setClassName("post-labels")
        issue.labels->Array.forEach(label => {
          let pill = DomHelpers.createElement("a")
          pill->DomHelpers.setTextContent(label.name)
          pill->DomHelpers.setClassName("label-pill")
          pill->DomHelpers.setAttribute(
            "href",
            Router.routeToString(LabelFilter(label.name, 1)),
          )
          let textLight = getLabelTextColor(label.color)
          pill->DomHelpers.setStyle(
            "background-color: #" ++ label.color ++ "; color: " ++ textLight,
          )
          labelsDiv->DomHelpers.appendChild(pill)
        })
        header->DomHelpers.appendChild(labelsDiv)
      }

      article->DomHelpers.appendChild(header)

      // Body
      let bodyDiv = DomHelpers.createElement("div")
      bodyDiv->DomHelpers.setClassName("post-body markdown-body")
      let bodyHtml = switch issue.body {
      | Some(text) => Marked.parse(text)
      | None => "<p><em>No content</em></p>"
      }
      bodyDiv->DomHelpers.setInnerHTML(bodyHtml)
      article->DomHelpers.appendChild(bodyDiv)

      // Comments section
      let commentsSection = DomHelpers.createElement("section")
      commentsSection->DomHelpers.setClassName("comments-section")

      let commentsTitle = DomHelpers.createElement("h2")
      commentsTitle->DomHelpers.setTextContent(
        Belt.Int.toString(Array.length(commentsResult)) ++ " Comments",
      )
      commentsTitle->DomHelpers.setClassName("comments-title")
      commentsSection->DomHelpers.appendChild(commentsTitle)

      commentsResult->Array.forEach(comment => {
        let commentDiv = DomHelpers.createElement("div")
        commentDiv->DomHelpers.setClassName("comment")

        let commentHeader = DomHelpers.createElement("div")
        commentHeader->DomHelpers.setClassName("comment-header")

        let commentAvatar = DomHelpers.createElement("img")
        commentAvatar->DomHelpers.setAttribute("src", comment.user.avatar_url)
        commentAvatar->DomHelpers.setAttribute("alt", comment.user.login)
        commentAvatar->DomHelpers.setClassName("comment-avatar")
        commentHeader->DomHelpers.appendChild(commentAvatar)

        let commentAuthor = DomHelpers.createElement("a")
        commentAuthor->DomHelpers.setTextContent(comment.user.login)
        commentAuthor->DomHelpers.setAttribute("href", comment.user.html_url)
        commentAuthor->DomHelpers.setAttribute("target", "_blank")
        commentAuthor->DomHelpers.setClassName("comment-author")
        commentHeader->DomHelpers.appendChild(commentAuthor)

        let commentDate = DomHelpers.createElement("span")
        commentDate->DomHelpers.setTextContent(formatDate(comment.created_at))
        commentDate->DomHelpers.setClassName("comment-date")
        commentHeader->DomHelpers.appendChild(commentDate)

        commentDiv->DomHelpers.appendChild(commentHeader)

        let commentBody = DomHelpers.createElement("div")
        commentBody->DomHelpers.setClassName("comment-body markdown-body")
        commentBody->DomHelpers.setInnerHTML(Marked.parse(comment.body))
        commentDiv->DomHelpers.appendChild(commentBody)

        commentsSection->DomHelpers.appendChild(commentDiv)
      })

      article->DomHelpers.appendChild(commentsSection)

      // Link to GitHub
      let githubLink = DomHelpers.createElement("a")
      githubLink->DomHelpers.setTextContent("View on GitHub")
      githubLink->DomHelpers.setAttribute("href", issue.html_url)
      githubLink->DomHelpers.setAttribute("target", "_blank")
      githubLink->DomHelpers.setClassName("github-link")
      article->DomHelpers.appendChild(githubLink)

      container->DomHelpers.appendChild(article)
    }
  }

  DomHelpers.scrollTo(0, 0)
}
