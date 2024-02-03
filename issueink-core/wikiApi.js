// gollum wiki -> webhook -> issue -> action -> pages! :>
// TODO: 咕咕咕
import { REPO, OWNER } from "../config.js";

// 2023 ! v3-api out-date-up
function getWikiPage(name, repo, file) {
    fetch(`https://github.com/${name}/${repo}/${file}`, {mode: 'cors'})
        .then(data => data.text())
        .then(data => {
            const parser = new DOMParser();
            const dataEl = parser.parseFromString(data, "text/html");
            const el = dataEl.querySelector(".wiki-body > .markdown-body")
            $.html(".content", el.innerHTML)
        })
}
getPage(OWNER, REPO, "wiki")