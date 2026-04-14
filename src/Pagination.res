let render = (container: DomHelpers.element, ~currentPage: int, ~hasMore: bool, ~onPageChange: int => unit) => {
  let nav = DomHelpers.createElement("nav")
  nav->DomHelpers.setClassName("pagination")

  let makeButton = (label: string, page: int, ~active: bool=false, ~disabled: bool=false) => {
    let btn = DomHelpers.createElement("button")
    btn->DomHelpers.setTextContent(label)
    btn->DomHelpers.setClassName(
      if active {
        "pagination-btn active"
      } else if disabled {
        "pagination-btn disabled"
      } else {
        "pagination-btn"
      }
    )
    if !disabled && !active {
      btn->DomHelpers.setOnClick(() => onPageChange(page))
    }
    if disabled {
      btn->DomHelpers.setAttribute("disabled", "true")
    }
    nav->DomHelpers.appendChild(btn)
  }

  if currentPage > 1 {
    makeButton("< Prev", currentPage - 1)
  } else {
    makeButton("< Prev", 1, ~disabled=true)
  }

  // Current page indicator
  let info = DomHelpers.createElement("span")
  info->DomHelpers.setTextContent(` Page ${Belt.Int.toString(currentPage)} `)
  info->DomHelpers.setClassName("pagination-info")
  nav->DomHelpers.appendChild(info)

  if hasMore {
    makeButton("Next >", currentPage + 1)
  } else {
    makeButton("Next >", currentPage, ~disabled=true)
  }

  container->DomHelpers.appendChild(nav)
}
