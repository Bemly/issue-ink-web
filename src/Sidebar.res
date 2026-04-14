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

@get external getInputValue: DomHelpers.element => string = "value"

let render = async (
  container: DomHelpers.element,
  ~searchFilter: ref<string>,
  ~onSearch: string => unit,
  ~onLabelClick: string => unit,
) => {
  let aside = DomHelpers.createElement("aside")
  aside->DomHelpers.setClassName("sidebar")

  // About section
  let aboutSection = DomHelpers.createElement("div")
  aboutSection->DomHelpers.setClassName("sidebar-section")
  let aboutTitle = DomHelpers.createElement("h3")
  aboutTitle->DomHelpers.setTextContent("About")
  aboutSection->DomHelpers.appendChild(aboutTitle)
  let aboutText = DomHelpers.createElement("p")
  aboutText->DomHelpers.setTextContent(
    "A blog powered by GitHub Issues. "
    ++ Config.siteTitle
    ++ " turns your repository's issues into a clean, readable blog.",
  )
  aboutSection->DomHelpers.appendChild(aboutText)
  aside->DomHelpers.appendChild(aboutSection)

  // Search section
  let searchSection = DomHelpers.createElement("div")
  searchSection->DomHelpers.setClassName("sidebar-section")
  let searchTitle = DomHelpers.createElement("h3")
  searchTitle->DomHelpers.setTextContent("Search")
  searchSection->DomHelpers.appendChild(searchTitle)
  let searchInput = DomHelpers.createElement("input")
  searchInput->DomHelpers.setType("text")
  searchInput->DomHelpers.setPlaceholder("Filter posts by title...")
  searchInput->DomHelpers.setClassName("search-input")
  searchInput->DomHelpers.setOnInput(_ => {
    let rawVal = getInputValue(searchInput)
    searchFilter := rawVal
    onSearch(rawVal)
  })
  searchSection->DomHelpers.appendChild(searchInput)
  aside->DomHelpers.appendChild(searchSection)

  // Labels section
  let labelsSection = DomHelpers.createElement("div")
  labelsSection->DomHelpers.setClassName("sidebar-section")
  let labelsTitle = DomHelpers.createElement("h3")
  labelsTitle->DomHelpers.setTextContent("Labels")
  labelsSection->DomHelpers.appendChild(labelsTitle)

  let labelsContainer = DomHelpers.createElement("div")
  labelsContainer->DomHelpers.setClassName("labels-container")
  labelsSection->DomHelpers.appendChild(labelsContainer)

  let labels = await GithubApi.getLabels()
  labels->Array.forEach(label => {
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
    pill->DomHelpers.setOnClick(_e => {
      onLabelClick(label.name)
    })
    labelsContainer->DomHelpers.appendChild(pill)
  })

  aside->DomHelpers.appendChild(labelsSection)

  // Links section
  let linksSection = DomHelpers.createElement("div")
  linksSection->DomHelpers.setClassName("sidebar-section")
  let linksTitle = DomHelpers.createElement("h3")
  linksTitle->DomHelpers.setTextContent("Links")
  linksSection->DomHelpers.appendChild(linksTitle)

  let repoLink = DomHelpers.createElement("a")
  repoLink->DomHelpers.setTextContent("GitHub Repository")
  repoLink->DomHelpers.setAttribute(
    "href",
    "https://github.com/" ++ Config.owner ++ "/" ++ Config.repo,
  )
  repoLink->DomHelpers.setAttribute("target", "_blank")
  repoLink->DomHelpers.setClassName("sidebar-link")
  linksSection->DomHelpers.appendChild(repoLink)

  aside->DomHelpers.appendChild(linksSection)

  container->DomHelpers.appendChild(aside)
}
