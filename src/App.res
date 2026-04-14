let getMainContainer = (): DomHelpers.element => {
  switch DomHelpers.getElementById("app") {
  | Some(el) => el
  | None => {
      let el = DomHelpers.createElement("div")
      el->DomHelpers.setId("app")
      DomHelpers.body->DomHelpers.appendChild(el)
      el
    }
  }
}

let searchFilter = ref("")
let currentLabel: ref<option<string>> = ref(None)

let handleRoute = async (route: Router.route) => {
  let container = getMainContainer()

  // Build layout: sidebar + main
  container->DomHelpers.setInnerHTML("")

  let layout = DomHelpers.createElement("div")
  layout->DomHelpers.setClassName("layout")
  container->DomHelpers.appendChild(layout)

  // Render sidebar first
  let sidebarContainer = DomHelpers.createElement("div")
  layout->DomHelpers.appendChild(sidebarContainer)

  let main = DomHelpers.createElement("main")
  main->DomHelpers.setClassName("main-content")
  layout->DomHelpers.appendChild(main)

  await Sidebar.render(
    sidebarContainer,
    ~searchFilter,
    ~onSearch=_ => {
      // Re-render current page with new search filter
      switch Router.currentRoute.contents {
      | PostList(page) =>
        let _ = PostList.render(main, ~page, ~searchFilter=searchFilter.contents)
      | LabelFilter(label, page) =>
        let _ = PostList.render(
          main,
          ~page,
          ~filterLabel=label,
          ~searchFilter=searchFilter.contents,
        )
      | _ => ()
      }
    },
    ~onLabelClick=name => {
      Router.navigate(LabelFilter(name, 1))
    },
  )

  // Render page content
  switch route {
  | PostList(page) =>
    let _ = PostList.render(main, ~page, ~searchFilter=searchFilter.contents)
  | PostDetail(number) =>
    let _ = PostDetail.render(main, ~issueNumber=number)
  | Labels =>
    let _ = PostList.render(main, ~page=1, ~searchFilter="")
  | LabelFilter(name, page) =>
    let _ = PostList.render(
      main,
      ~page,
      ~filterLabel=name,
      ~searchFilter=searchFilter.contents,
    )
  | NotFound => {
      let error = DomHelpers.createElement("div")
      error->DomHelpers.setClassName("error-state")
      error->DomHelpers.setTextContent("404 - Page not found")
      main->DomHelpers.appendChild(error)
    }
  }
}

// Start the app
let () = {
  DomHelpers.setTitle(Config.siteTitle)
  Router.init(route => {
    let _ = handleRoute(route)
  })
}
