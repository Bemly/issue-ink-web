type element = Dom.element

@val @scope("document")
external createElement: string => element = "createElement"

@val @scope("document")
external getElementById: string => option<element> = "getElementById"

@val @scope("document")
external querySelector: string => option<element> = "querySelector"

@val @scope("document")
external body: element = "body"

@val @scope("document")
external setTitle: string => unit = "title"

@send external appendChild: (element, element) => unit = "appendChild"

@send external removeChild: (element, element) => unit = "removeChild"

@send external setAttribute: (element, string, string) => unit = "setAttribute"

@send external addClass: (element, string) => unit = "add"
// classList.add binding

@val @scope("document")
external querySelectorAll: string => array<element> = "querySelectorAll"

@set external setInnerHTML: (element, string) => unit = "innerHTML"

@get external getInnerHTML: element => string = "innerHTML"

@set external setTextContent: (element, string) => unit = "textContent"

@set external setOnClick: (element, unit => unit) => unit = "onclick"

@set external setOnInput: (element, Dom.event => unit) => unit = "oninput"

@set external setOnChange: (element, Dom.event => unit) => unit = "onchange"

@set external setId: (element, string) => unit = "id"

@set external setHref: (element, string) => unit = "href"

@set external setClassName: (element, string) => unit = "className"

@set external setPlaceholder: (element, string) => unit = "placeholder"

@set external setType: (element, string) => unit = "type"

@set external setStyle: (element, string) => unit = "style.cssText"

@send external addEventListener: (element, string, unit => unit) => unit = "addEventListener"

@val @scope("window")
external addWindowEventListener: (string, unit => unit) => unit = "addEventListener"

@val @scope("window")
external getLocationHash: unit => string = "location.hash"

@val @scope("window")
external setLocationHash: string => unit = "location.hash"

@val @scope("window")
external getLocationPathname: unit => string = "location.pathname"

@val @scope("window")
external scrollTo: (int, int) => unit = "scrollTo"

@val external setTimeout: (unit => unit, int) => float = "setTimeout"
