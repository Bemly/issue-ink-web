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

let renderComment = (user: GithubApi.user, body: string, createdAt: string): DomHelpers.element => {
  let commentDiv = DomHelpers.createElement("div")
  commentDiv->DomHelpers.setClassName("comment")

  let commentHeader = DomHelpers.createElement("div")
  commentHeader->DomHelpers.setClassName("comment-header")

  let commentAvatar = DomHelpers.createElement("img")
  commentAvatar->DomHelpers.setAttribute("src", user.avatar_url)
  commentAvatar->DomHelpers.setAttribute("alt", user.login)
  commentAvatar->DomHelpers.setClassName("comment-avatar")
  commentHeader->DomHelpers.appendChild(commentAvatar)

  let commentAuthor = DomHelpers.createElement("a")
  commentAuthor->DomHelpers.setTextContent(user.login)
  commentAuthor->DomHelpers.setAttribute("href", user.html_url)
  commentAuthor->DomHelpers.setAttribute("target", "_blank")
  commentAuthor->DomHelpers.setClassName("comment-author")
  commentHeader->DomHelpers.appendChild(commentAuthor)

  let commentDate = DomHelpers.createElement("span")
  commentDate->DomHelpers.setTextContent(formatDate(createdAt))
  commentDate->DomHelpers.setClassName("comment-date")
  commentHeader->DomHelpers.appendChild(commentDate)

  commentDiv->DomHelpers.appendChild(commentHeader)

  let commentBody = DomHelpers.createElement("div")
  commentBody->DomHelpers.setClassName("comment-body markdown-body")
  commentBody->DomHelpers.setInnerHTML(Marked.parse(body))
  commentDiv->DomHelpers.appendChild(commentBody)

  commentDiv
}

let render = async (container: DomHelpers.element, ~postType: string, ~number: int) => {
  container->DomHelpers.setInnerHTML("")

  let loading = DomHelpers.createElement("div")
  loading->DomHelpers.setClassName("loading")
  loading->DomHelpers.setTextContent("Loading post...")
  container->DomHelpers.appendChild(loading)

  let backLink = DomHelpers.createElement("a")
  backLink->DomHelpers.setTextContent("< Back to posts")
  backLink->DomHelpers.setAttribute("href", Router.routeToString(PostList(1)))
  backLink->DomHelpers.setClassName("back-link")

  if postType == "issue" {
    let issuePromise = GithubApi.getIssue(number)
    let commentsPromise = GithubApi.getComments(number)
    let issueResult = await issuePromise
    let commentsResult = await commentsPromise

    container->DomHelpers.setInnerHTML("")
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

        let header = DomHelpers.createElement("header")
        header->DomHelpers.setClassName("post-header")

        let title = DomHelpers.createElement("h1")
        title->DomHelpers.setTextContent(issue.title)
        title->DomHelpers.setClassName("post-title")
        header->DomHelpers.appendChild(title)

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

        let bodyDiv = DomHelpers.createElement("div")
        bodyDiv->DomHelpers.setClassName("post-body markdown-body")
        let bodyHtml = switch issue.body {
        | Some(text) => Marked.parse(text)
        | None => "<p><em>No content</em></p>"
        }
        bodyDiv->DomHelpers.setInnerHTML(bodyHtml)
        article->DomHelpers.appendChild(bodyDiv)

        // Comments
        let commentsSection = DomHelpers.createElement("section")
        commentsSection->DomHelpers.setClassName("comments-section")

        let commentsTitle = DomHelpers.createElement("h2")
        commentsTitle->DomHelpers.setTextContent(
          Belt.Int.toString(Array.length(commentsResult)) ++ " Comments",
        )
        commentsTitle->DomHelpers.setClassName("comments-title")
        commentsSection->DomHelpers.appendChild(commentsTitle)

        commentsResult->Array.forEach(comment => {
          commentsSection->DomHelpers.appendChild(
            renderComment(comment.user, comment.body, comment.created_at),
          )
        })

        article->DomHelpers.appendChild(commentsSection)

        let githubLink = DomHelpers.createElement("a")
        githubLink->DomHelpers.setTextContent("View on GitHub")
        githubLink->DomHelpers.setAttribute("href", issue.html_url)
        githubLink->DomHelpers.setAttribute("target", "_blank")
        githubLink->DomHelpers.setClassName("github-link")
        article->DomHelpers.appendChild(githubLink)

        container->DomHelpers.appendChild(article)
      }
    }
  } else {
    // Discussion
    let discussionPromise = GithubApi.getDiscussion(number)
    let commentsPromise = GithubApi.getDiscussionComments(number)
    let discussionResult = await discussionPromise
    let commentsResult = await commentsPromise

    container->DomHelpers.setInnerHTML("")
    container->DomHelpers.appendChild(backLink)

    switch discussionResult {
    | None => {
        let error = DomHelpers.createElement("div")
        error->DomHelpers.setClassName("error-state")
        error->DomHelpers.setTextContent("Discussion not found.")
        container->DomHelpers.appendChild(error)
      }
    | Some(discussion) => {
        let article = DomHelpers.createElement("article")
        article->DomHelpers.setClassName("post-detail")

        let header = DomHelpers.createElement("header")
        header->DomHelpers.setClassName("post-header")

        let title = DomHelpers.createElement("h1")
        title->DomHelpers.setTextContent(discussion.title)
        title->DomHelpers.setClassName("post-title")
        header->DomHelpers.appendChild(title)

        let meta = DomHelpers.createElement("div")
        meta->DomHelpers.setClassName("post-meta")

        let authorInfo = DomHelpers.createElement("div")
        authorInfo->DomHelpers.setClassName("author-info")

        let avatar = DomHelpers.createElement("img")
        avatar->DomHelpers.setAttribute("src", discussion.user.avatar_url)
        avatar->DomHelpers.setAttribute("alt", discussion.user.login)
        avatar->DomHelpers.setClassName("avatar")
        authorInfo->DomHelpers.appendChild(avatar)

        let authorName = DomHelpers.createElement("a")
        authorName->DomHelpers.setTextContent(discussion.user.login)
        authorName->DomHelpers.setAttribute("href", discussion.user.html_url)
        authorName->DomHelpers.setAttribute("target", "_blank")
        authorName->DomHelpers.setClassName("author-name")
        authorInfo->DomHelpers.appendChild(authorName)

        meta->DomHelpers.appendChild(authorInfo)

        let dateInfo = DomHelpers.createElement("span")
        dateInfo->DomHelpers.setTextContent(formatDate(discussion.created_at))
        dateInfo->DomHelpers.setClassName("post-date")
        meta->DomHelpers.appendChild(dateInfo)

        header->DomHelpers.appendChild(meta)

        // Category badge
        let catDiv = DomHelpers.createElement("div")
        catDiv->DomHelpers.setClassName("post-labels")
        let catPill = DomHelpers.createElement("span")
        let emoji = switch discussion.category.emoji {
        | Some(e) => e ++ " "
        | None => ""
        }
        catPill->DomHelpers.setTextContent(emoji ++ discussion.category.name)
        catPill->DomHelpers.setClassName("label-pill")
        catPill->DomHelpers.setStyle("background-color: #6e40c9; color: #fff")
        catDiv->DomHelpers.appendChild(catPill)
        header->DomHelpers.appendChild(catDiv)

        article->DomHelpers.appendChild(header)

        let bodyDiv = DomHelpers.createElement("div")
        bodyDiv->DomHelpers.setClassName("post-body markdown-body")
        let bodyHtml = switch discussion.body {
        | Some(text) => Marked.parse(text)
        | None => "<p><em>No content</em></p>"
        }
        bodyDiv->DomHelpers.setInnerHTML(bodyHtml)
        article->DomHelpers.appendChild(bodyDiv)

        // Comments
        let commentsSection = DomHelpers.createElement("section")
        commentsSection->DomHelpers.setClassName("comments-section")

        let commentsTitle = DomHelpers.createElement("h2")
        commentsTitle->DomHelpers.setTextContent(
          Belt.Int.toString(Array.length(commentsResult)) ++ " Comments",
        )
        commentsTitle->DomHelpers.setClassName("comments-title")
        commentsSection->DomHelpers.appendChild(commentsTitle)

        commentsResult->Array.forEach(comment => {
          commentsSection->DomHelpers.appendChild(
            renderComment(comment.user, comment.body, comment.created_at),
          )
        })

        article->DomHelpers.appendChild(commentsSection)

        let githubLink = DomHelpers.createElement("a")
        githubLink->DomHelpers.setTextContent("View on GitHub")
        githubLink->DomHelpers.setAttribute("href", discussion.html_url)
        githubLink->DomHelpers.setAttribute("target", "_blank")
        githubLink->DomHelpers.setClassName("github-link")
        article->DomHelpers.appendChild(githubLink)

        container->DomHelpers.appendChild(article)
      }
    }
  }

  DomHelpers.scrollTo(0, 0)
}
