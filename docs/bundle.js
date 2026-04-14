// src/Config.mjs
var owner = "Bemly";
var repo = "Web-IssueInk";
var accessToken = "";
var apiVersion = "2022-11-28";
var perPage = 10;
var siteTitle = "IssueInk";

// src/DomHelpers.mjs
function setTitle(_title) {
  return document.title = _title;
}
function getLocationHash() {
  return window.location.hash;
}
function setLocationHash(_hash) {
  return window.location.hash = _hash;
}

// node_modules/@rescript/runtime/lib/es6/Primitive_option.js
function some(x) {
  if (x === void 0) {
    return {
      BS_PRIVATE_NESTED_SOME_NONE: 0
    };
  } else if (x !== null && x.BS_PRIVATE_NESTED_SOME_NONE !== void 0) {
    return {
      BS_PRIVATE_NESTED_SOME_NONE: x.BS_PRIVATE_NESTED_SOME_NONE + 1 | 0
    };
  } else {
    return x;
  }
}
function valFromOption(x) {
  if (x === null || x.BS_PRIVATE_NESTED_SOME_NONE === void 0) {
    return x;
  }
  let depth = x.BS_PRIVATE_NESTED_SOME_NONE;
  if (depth === 0) {
    return;
  } else {
    return {
      BS_PRIVATE_NESTED_SOME_NONE: depth - 1 | 0
    };
  }
}

// node_modules/@rescript/runtime/lib/es6/Stdlib_Array.js
function filterMap(a, f) {
  let l = a.length;
  let r = new Array(l);
  let j = 0;
  for (let i = 0; i < l; ++i) {
    let v = a[i];
    let v$1 = f(v);
    if (v$1 !== void 0) {
      r[j] = valFromOption(v$1);
      j = j + 1 | 0;
    }
  }
  r.length = j;
  return r;
}

// node_modules/@rescript/runtime/lib/es6/Stdlib_Int.js
function fromString(x, radix) {
  let maybeInt = radix !== void 0 ? parseInt(x, radix) : parseInt(x);
  if (Number.isNaN(maybeInt) || maybeInt > 2147483647 || maybeInt < -2147483648) {
    return;
  } else {
    return maybeInt | 0;
  }
}

// src/Router.mjs
function parseHash(hash) {
  let cleanHash = hash.replace("#", "");
  let parts = cleanHash.split("/").filter((p) => p !== "");
  let len = parts.length;
  if (len >= 4) {
    return "NotFound";
  }
  switch (len) {
    case 0:
      return {
        TAG: "PostList",
        _0: 1
      };
    case 1:
      let match = parts[0];
      if (match === "labels") {
        return "Labels";
      } else {
        return "NotFound";
      }
    case 2:
      let match$1 = parts[0];
      switch (match$1) {
        case "labels":
          let name = parts[1];
          return {
            TAG: "LabelFilter",
            _0: name,
            _1: 1
          };
        case "page":
          let pageStr = parts[1];
          let p = fromString(pageStr, void 0);
          if (p !== void 0) {
            return {
              TAG: "PostList",
              _0: p
            };
          } else {
            return {
              TAG: "PostList",
              _0: 1
            };
          }
        default:
          return "NotFound";
      }
    case 3:
      let match$2 = parts[0];
      if (match$2 !== "post") {
        return "NotFound";
      }
      let postType = parts[1];
      let numberStr = parts[2];
      let n = fromString(numberStr, void 0);
      if (n !== void 0) {
        return {
          TAG: "PostDetail",
          _0: postType,
          _1: n
        };
      } else {
        return "NotFound";
      }
  }
}
var currentRoute = {
  contents: {
    TAG: "PostList",
    _0: 1
  }
};
function routeToString(route) {
  if (typeof route !== "object") {
    if (route === "Labels") {
      return "#/labels";
    } else {
      return "#/";
    }
  }
  switch (route.TAG) {
    case "PostList":
      let p = route._0;
      if (p !== 1) {
        return "#/page/" + String(p);
      } else {
        return "#/";
      }
    case "PostDetail":
      return "#/post/" + route._0 + "/" + String(route._1);
    case "LabelFilter":
      let p$1 = route._1;
      let name = route._0;
      if (p$1 !== 1) {
        return "#/labels/" + name + "/page/" + String(p$1);
      } else {
        return "#/labels/" + name;
      }
  }
}
function navigate(route) {
  return setLocationHash(routeToString(route));
}
function init(handler) {
  let handleHashChange = () => {
    let hash = getLocationHash();
    let route = parseHash(hash);
    currentRoute.contents = route;
    handler(route);
  };
  window.addEventListener("hashchange", handleHashChange);
  handleHashChange();
}

// node_modules/@rescript/runtime/lib/es6/Stdlib_JSON.js
function bool(json) {
  if (typeof json === "boolean") {
    return json;
  }
}
function $$null(json) {
  if (json === null) {
    return null;
  }
}
function string(json) {
  if (typeof json === "string") {
    return json;
  }
}
function float(json) {
  if (typeof json === "number") {
    return json;
  }
}
function object(json) {
  if (typeof json === "object" && json !== null && !Array.isArray(json)) {
    return json;
  }
}
function array(json) {
  if (Array.isArray(json)) {
    return json;
  }
}
var Decode = {
  bool,
  $$null,
  string,
  float,
  object,
  array
};

// node_modules/@rescript/runtime/lib/es6/Stdlib_JsError.js
function panic(msg) {
  throw new Error(`Panic! ` + msg);
}

// node_modules/@rescript/runtime/lib/es6/Stdlib_Option.js
function getOrThrow(x, message) {
  if (x !== void 0) {
    return valFromOption(x);
  } else {
    return panic(message !== void 0 ? message : "Option.getOrThrow called for None value");
  }
}
function map(opt, f) {
  if (opt !== void 0) {
    return some(f(valFromOption(opt)));
  }
}
function flatMap(opt, f) {
  if (opt !== void 0) {
    return f(valFromOption(opt));
  }
}
function getOr(opt, $$default) {
  if (opt !== void 0) {
    return valFromOption(opt);
  } else {
    return $$default;
  }
}
function isSome(x) {
  return x !== void 0;
}

// src/GithubApi.mjs
var baseUrl = "https://api.github.com";
function headers() {
  let base = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": apiVersion
  };
  if (accessToken === "") {
    return base;
  } else {
    return Object.assign(base, {
      Authorization: `Bearer ` + accessToken
    });
  }
}
function decodeUser(obj) {
  return {
    login: getOrThrow(Decode.string(getOrThrow(obj["login"], void 0)), void 0),
    avatar_url: getOrThrow(Decode.string(getOrThrow(obj["avatar_url"], void 0)), void 0),
    html_url: getOrThrow(Decode.string(getOrThrow(obj["html_url"], void 0)), void 0)
  };
}
function decodeLabel(obj) {
  let __x = obj["description"];
  return {
    id: getOrThrow(Decode.float(getOrThrow(obj["id"], void 0)), void 0) | 0,
    name: getOrThrow(Decode.string(getOrThrow(obj["name"], void 0)), void 0),
    description: flatMap(__x, Decode.string),
    color: getOrThrow(Decode.string(getOrThrow(obj["color"], void 0)), void 0)
  };
}
function decodeIssue(json) {
  let obj = Decode.object(json);
  if (obj === void 0) {
    return;
  }
  let getStr = (key) => {
    let __x2 = obj[key];
    return flatMap(__x2, Decode.string);
  };
  let getInt = (key) => {
    let __x2 = obj[key];
    let __x$1 = flatMap(__x2, Decode.float);
    return map(__x$1, (prim) => prim | 0);
  };
  if (isSome(obj["pull_request"])) {
    return;
  }
  let __x = obj["user"];
  let user = decodeUser(getOrThrow(flatMap(__x, Decode.object), void 0));
  let arr = obj["labels"];
  let labels = arr !== void 0 ? filterMap(getOr(Decode.array(arr), []), (l) => map(Decode.object(l), decodeLabel)) : [];
  return {
    number: getOrThrow(getInt("number"), void 0),
    title: getOrThrow(getStr("title"), void 0),
    body: getStr("body"),
    state: getOrThrow(getStr("state"), void 0),
    html_url: getOrThrow(getStr("html_url"), void 0),
    user,
    labels,
    comments: getOr(getInt("comments"), 0),
    created_at: getOrThrow(getStr("created_at"), void 0),
    updated_at: getOrThrow(getStr("updated_at"), void 0)
  };
}
function decodeComment(json) {
  let obj = Decode.object(json);
  if (obj === void 0) {
    return;
  }
  let getStr = (key) => {
    let __x2 = obj[key];
    return flatMap(__x2, Decode.string);
  };
  let getInt = (key) => {
    let __x2 = obj[key];
    let __x$1 = flatMap(__x2, Decode.float);
    return map(__x$1, (prim) => prim | 0);
  };
  let __x = obj["user"];
  let user = decodeUser(getOrThrow(flatMap(__x, Decode.object), void 0));
  return {
    id: getOrThrow(getInt("id"), void 0),
    user,
    body: getOrThrow(getStr("body"), void 0),
    created_at: getOrThrow(getStr("created_at"), void 0),
    updated_at: getOrThrow(getStr("updated_at"), void 0),
    html_url: getOrThrow(getStr("html_url"), void 0)
  };
}
async function fetchJson(url) {
  try {
    let resp = await fetch(url, {
      headers: headers()
    });
    if (resp.ok) {
      return await resp.json();
    } else {
      console.error("GitHub API error:", resp.status);
      return;
    }
  } catch (exn) {
    console.error("Fetch failed for: " + url);
    return;
  }
}
async function getIssues(page, perPage2, labels) {
  let labelParam = labels !== void 0 ? `&labels=` + encodeURIComponent(labels) : "";
  let url = baseUrl + `/repos/` + owner + `/` + repo + `/issues?state=all&per_page=` + String(perPage2) + `&page=` + String(page) + labelParam;
  let json = await fetchJson(url);
  if (json !== void 0) {
    return filterMap(getOr(Decode.array(json), []), decodeIssue);
  } else {
    return [];
  }
}
async function getIssue(number) {
  let url = baseUrl + `/repos/` + owner + `/` + repo + `/issues/` + String(number);
  let json = await fetchJson(url);
  if (json !== void 0) {
    return decodeIssue(json);
  }
}
async function getComments(issueNumber) {
  let url = baseUrl + `/repos/` + owner + `/` + repo + `/issues/` + String(issueNumber) + `/comments`;
  let json = await fetchJson(url);
  if (json !== void 0) {
    return filterMap(getOr(Decode.array(json), []), decodeComment);
  } else {
    return [];
  }
}
async function getLabels() {
  let url = baseUrl + `/repos/` + owner + `/` + repo + `/labels`;
  let json = await fetchJson(url);
  if (json !== void 0) {
    return filterMap(getOr(Decode.array(json), []), (l) => map(Decode.object(l), decodeLabel));
  } else {
    return [];
  }
}
function decodeDiscussionCategory(obj) {
  let getStr = (key) => {
    let __x = obj[key];
    return flatMap(__x, Decode.string);
  };
  return {
    name: getOr(getStr("name"), ""),
    slug: getOr(getStr("slug"), ""),
    emoji: getStr("emoji"),
    description: getStr("description")
  };
}
function decodeDiscussion(json) {
  let obj = Decode.object(json);
  if (obj === void 0) {
    return;
  }
  let getStr = (key) => {
    let __x2 = obj[key];
    return flatMap(__x2, Decode.string);
  };
  let getInt = (key) => {
    let __x2 = obj[key];
    let __x$12 = flatMap(__x2, Decode.float);
    return map(__x$12, (prim) => prim | 0);
  };
  let __x = obj["user"];
  let user = decodeUser(getOrThrow(flatMap(__x, Decode.object), void 0));
  let __x$1 = obj["category"];
  let category = decodeDiscussionCategory(getOrThrow(flatMap(__x$1, Decode.object), void 0));
  return {
    number: getOrThrow(getInt("number"), void 0),
    title: getOrThrow(getStr("title"), void 0),
    body: getStr("body"),
    html_url: getOrThrow(getStr("html_url"), void 0),
    user,
    comments: getOr(getInt("comments"), 0),
    created_at: getOrThrow(getStr("created_at"), void 0),
    updated_at: getOrThrow(getStr("updated_at"), void 0),
    category
  };
}
function decodeDiscussionComment(json) {
  let obj = Decode.object(json);
  if (obj === void 0) {
    return;
  }
  let getStr = (key) => {
    let __x2 = obj[key];
    return flatMap(__x2, Decode.string);
  };
  let getInt = (key) => {
    let __x2 = obj[key];
    let __x$1 = flatMap(__x2, Decode.float);
    return map(__x$1, (prim) => prim | 0);
  };
  let __x = obj["user"];
  let user = decodeUser(getOrThrow(flatMap(__x, Decode.object), void 0));
  return {
    id: getOrThrow(getInt("id"), void 0),
    user,
    body: getOrThrow(getStr("body"), void 0),
    created_at: getOrThrow(getStr("created_at"), void 0),
    updated_at: getOrThrow(getStr("updated_at"), void 0),
    html_url: getOrThrow(getStr("html_url"), void 0)
  };
}
async function getDiscussions(page, perPage2) {
  let url = baseUrl + `/repos/` + owner + `/` + repo + `/discussions?per_page=` + String(perPage2) + `&page=` + String(page);
  let json = await fetchJson(url);
  if (json !== void 0) {
    return filterMap(getOr(Decode.array(json), []), decodeDiscussion);
  } else {
    return [];
  }
}
async function getDiscussion(number) {
  let url = baseUrl + `/repos/` + owner + `/` + repo + `/discussions/` + String(number);
  let json = await fetchJson(url);
  if (json !== void 0) {
    return decodeDiscussion(json);
  }
}
async function getDiscussionComments(discussionNumber) {
  let url = baseUrl + `/repos/` + owner + `/` + repo + `/discussions/` + String(discussionNumber) + `/comments`;
  let json = await fetchJson(url);
  if (json !== void 0) {
    return filterMap(getOr(Decode.array(json), []), decodeDiscussionComment);
  } else {
    return [];
  }
}
async function getPosts(page, perPage2, labels) {
  let issuesPromise = getIssues(page, perPage2, labels);
  let discussionsPromise = getDiscussions(page, perPage2);
  let issues = await issuesPromise;
  let discussions = await discussionsPromise;
  let issuePosts = issues.map((i) => ({
    TAG: "IssuePost",
    _0: i
  }));
  let discussionPosts = discussions.map((d) => ({
    TAG: "DiscussionPost",
    _0: d
  }));
  let all = issuePosts.concat(discussionPosts);
  all.sort((a, b) => {
    const getDate = (p) => p.TAG === "IssuePost" ? p._0.created_at : p._0.created_at;
    return new Date(getDate(b)) - new Date(getDate(a));
  });
  return all;
}

// src/Sidebar.mjs
function getLabelTextColor(_color) {
  return (function() {
    var hex = _color;
    var r = parseInt(hex.substr(0, 2), 16);
    var g = parseInt(hex.substr(2, 2), 16);
    var b = parseInt(hex.substr(4, 2), 16);
    var luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#333" : "#fff";
  })();
}
async function render(container, searchFilter2, onSearch, onLabelClick) {
  let aside = document.createElement("aside");
  aside.className = "sidebar";
  let aboutSection = document.createElement("div");
  aboutSection.className = "sidebar-section";
  let aboutTitle = document.createElement("h3");
  aboutTitle.textContent = "About";
  aboutSection.appendChild(aboutTitle);
  let aboutText = document.createElement("p");
  aboutText.textContent = "A blog powered by GitHub Issues. " + siteTitle + " turns your repository's issues into a clean, readable blog.";
  aboutSection.appendChild(aboutText);
  aside.appendChild(aboutSection);
  let searchSection = document.createElement("div");
  searchSection.className = "sidebar-section";
  let searchTitle = document.createElement("h3");
  searchTitle.textContent = "Search";
  searchSection.appendChild(searchTitle);
  let searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Filter posts by title...";
  searchInput.className = "search-input";
  searchInput.oninput = (param) => {
    let rawVal = searchInput.value;
    searchFilter2.contents = rawVal;
    onSearch(rawVal);
  };
  searchSection.appendChild(searchInput);
  aside.appendChild(searchSection);
  let labelsSection = document.createElement("div");
  labelsSection.className = "sidebar-section";
  let labelsTitle = document.createElement("h3");
  labelsTitle.textContent = "Labels";
  labelsSection.appendChild(labelsTitle);
  let labelsContainer = document.createElement("div");
  labelsContainer.className = "labels-container";
  labelsSection.appendChild(labelsContainer);
  let labels = await getLabels();
  labels.forEach((label) => {
    let pill = document.createElement("a");
    pill.textContent = label.name;
    pill.className = "label-pill";
    pill.setAttribute("href", routeToString({
      TAG: "LabelFilter",
      _0: label.name,
      _1: 1
    }));
    let textLight = getLabelTextColor(label.color);
    pill["style.cssText"] = "background-color: #" + label.color + "; color: " + textLight;
    pill.onclick = (_e) => onLabelClick(label.name);
    labelsContainer.appendChild(pill);
  });
  aside.appendChild(labelsSection);
  let linksSection = document.createElement("div");
  linksSection.className = "sidebar-section";
  let linksTitle = document.createElement("h3");
  linksTitle.textContent = "Links";
  linksSection.appendChild(linksTitle);
  let repoLink = document.createElement("a");
  repoLink.textContent = "GitHub Repository";
  repoLink.setAttribute("href", "https://github.com/" + owner + "/" + repo);
  repoLink.setAttribute("target", "_blank");
  repoLink.className = "sidebar-link";
  linksSection.appendChild(repoLink);
  aside.appendChild(linksSection);
  container.appendChild(aside);
}

// src/Pagination.mjs
function render2(container, currentPage, hasMore, onPageChange) {
  let nav = document.createElement("nav");
  nav.className = "pagination";
  let makeButton = (label, page, activeOpt, disabledOpt) => {
    let active = activeOpt !== void 0 ? activeOpt : false;
    let disabled = disabledOpt !== void 0 ? disabledOpt : false;
    let btn = document.createElement("button");
    btn.textContent = label;
    btn.className = active ? "pagination-btn active" : disabled ? "pagination-btn disabled" : "pagination-btn";
    if (!disabled && !active) {
      btn.onclick = () => onPageChange(page);
    }
    if (disabled) {
      btn.setAttribute("disabled", "true");
    }
    nav.appendChild(btn);
  };
  if (currentPage > 1) {
    makeButton("< Prev", currentPage - 1 | 0, void 0, void 0);
  } else {
    makeButton("< Prev", 1, void 0, true);
  }
  let info = document.createElement("span");
  info.textContent = ` Page ` + String(currentPage) + ` `;
  info.className = "pagination-info";
  nav.appendChild(info);
  if (hasMore) {
    makeButton("Next >", currentPage + 1 | 0, void 0, void 0);
  } else {
    makeButton("Next >", currentPage, void 0, true);
  }
  container.appendChild(nav);
}

// src/PostList.mjs
function formatDate(_dateStr) {
  return new Date(_dateStr).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
}
function makeExcerpt(body) {
  if (body === void 0) {
    return "No content";
  }
  let len = body.length;
  if (len > 150) {
    return body.slice(0, 150) + "...";
  } else {
    return body;
  }
}
function postCreatedAt(post) {
  if (post.TAG === "IssuePost") {
    return post._0.created_at;
  } else {
    return post._0.created_at;
  }
}
function postUser(post) {
  if (post.TAG === "IssuePost") {
    return post._0.user;
  } else {
    return post._0.user;
  }
}
function postComments(post) {
  if (post.TAG === "IssuePost") {
    return post._0.comments;
  } else {
    return post._0.comments;
  }
}
function postRoute(post) {
  if (post.TAG === "IssuePost") {
    return {
      TAG: "PostDetail",
      _0: "issue",
      _1: post._0.number
    };
  } else {
    return {
      TAG: "PostDetail",
      _0: "discussion",
      _1: post._0.number
    };
  }
}
function postTypeBadge(post) {
  if (post.TAG === "IssuePost") {
    return;
  } else {
    return post._0.category.name;
  }
}
function renderPostCard(post) {
  let card = document.createElement("article");
  card.className = "post-card";
  let titleLink = document.createElement("a");
  titleLink.textContent = post._0.title;
  titleLink.setAttribute("href", routeToString(postRoute(post)));
  titleLink.className = "post-card-title";
  card.appendChild(titleLink);
  let meta = document.createElement("div");
  meta.className = "post-card-meta";
  let dateSpan = document.createElement("span");
  dateSpan.textContent = formatDate(postCreatedAt(post));
  dateSpan.className = "post-card-date";
  meta.appendChild(dateSpan);
  let authorSpan = document.createElement("span");
  authorSpan.textContent = "by " + postUser(post).login;
  authorSpan.className = "post-card-author";
  meta.appendChild(authorSpan);
  let commentsSpan = document.createElement("span");
  commentsSpan.textContent = String(postComments(post)) + " comments";
  commentsSpan.className = "post-card-comments";
  meta.appendChild(commentsSpan);
  card.appendChild(meta);
  let badgesDiv = document.createElement("div");
  badgesDiv.className = "post-card-labels";
  let hasBadges = {
    contents: false
  };
  let catName = postTypeBadge(post);
  if (catName !== void 0) {
    let pill = document.createElement("span");
    pill.textContent = catName;
    pill.className = "label-pill small";
    pill["style.cssText"] = "background-color: #6e40c9; color: #fff";
    badgesDiv.appendChild(pill);
    hasBadges.contents = true;
  }
  if (post.TAG === "IssuePost") {
    post._0.labels.forEach((label) => {
      let pill = document.createElement("span");
      pill.textContent = label.name;
      pill.className = "label-pill small";
      pill["style.cssText"] = "background-color: #" + label.color;
      badgesDiv.appendChild(pill);
      hasBadges.contents = true;
    });
  }
  if (hasBadges.contents) {
    card.appendChild(badgesDiv);
  }
  let excerpt = document.createElement("p");
  excerpt.textContent = makeExcerpt(post._0.body);
  excerpt.className = "post-card-excerpt";
  card.appendChild(excerpt);
  return card;
}
async function render3(container, page, filterLabel, searchFilter2) {
  container.innerHTML = "";
  let loading = document.createElement("div");
  loading.className = "loading";
  loading.textContent = "Loading posts...";
  container.appendChild(loading);
  let posts = await getPosts(page, perPage, filterLabel);
  container.innerHTML = "";
  let title = document.createElement("h1");
  title.className = "page-title";
  if (filterLabel !== void 0) {
    title.textContent = 'Posts tagged "' + filterLabel + '"';
  } else {
    title.textContent = "Posts";
  }
  container.appendChild(title);
  let filtered = searchFilter2 === "" ? posts : posts.filter((post) => post._0.title.toLowerCase().includes(searchFilter2.toLowerCase()));
  if (filtered.length === 0) {
    let empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No posts found.";
    container.appendChild(empty);
  } else {
    filtered.forEach((post) => {
      container.appendChild(renderPostCard(post));
    });
  }
  let hasMore = posts.length === perPage;
  render2(container, page, hasMore, (p) => navigate(filterLabel !== void 0 ? {
    TAG: "LabelFilter",
    _0: filterLabel,
    _1: p
  } : {
    TAG: "PostList",
    _0: p
  }));
  window.scrollTo(0, 0);
}

// src/PostDetail.mjs
import * as Marked from "marked";
function formatDate2(_dateStr) {
  return new Date(_dateStr).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function getLabelTextColor2(_color) {
  return (function() {
    var hex = _color;
    var r = parseInt(hex.substr(0, 2), 16);
    var g = parseInt(hex.substr(2, 2), 16);
    var b = parseInt(hex.substr(4, 2), 16);
    var luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#333" : "#fff";
  })();
}
function renderComment(user, body, createdAt) {
  let commentDiv = document.createElement("div");
  commentDiv.className = "comment";
  let commentHeader = document.createElement("div");
  commentHeader.className = "comment-header";
  let commentAvatar = document.createElement("img");
  commentAvatar.setAttribute("src", user.avatar_url);
  commentAvatar.setAttribute("alt", user.login);
  commentAvatar.className = "comment-avatar";
  commentHeader.appendChild(commentAvatar);
  let commentAuthor = document.createElement("a");
  commentAuthor.textContent = user.login;
  commentAuthor.setAttribute("href", user.html_url);
  commentAuthor.setAttribute("target", "_blank");
  commentAuthor.className = "comment-author";
  commentHeader.appendChild(commentAuthor);
  let commentDate = document.createElement("span");
  commentDate.textContent = formatDate2(createdAt);
  commentDate.className = "comment-date";
  commentHeader.appendChild(commentDate);
  commentDiv.appendChild(commentHeader);
  let commentBody = document.createElement("div");
  commentBody.className = "comment-body markdown-body";
  commentBody.innerHTML = Marked.parse(body);
  commentDiv.appendChild(commentBody);
  return commentDiv;
}
async function render4(container, postType, number) {
  container.innerHTML = "";
  let loading = document.createElement("div");
  loading.className = "loading";
  loading.textContent = "Loading post...";
  container.appendChild(loading);
  let backLink = document.createElement("a");
  backLink.textContent = "< Back to posts";
  backLink.setAttribute("href", routeToString({
    TAG: "PostList",
    _0: 1
  }));
  backLink.className = "back-link";
  if (postType === "issue") {
    let issuePromise = getIssue(number);
    let commentsPromise = getComments(number);
    let issueResult = await issuePromise;
    let commentsResult = await commentsPromise;
    container.innerHTML = "";
    container.appendChild(backLink);
    if (issueResult !== void 0) {
      let article = document.createElement("article");
      article.className = "post-detail";
      let header = document.createElement("header");
      header.className = "post-header";
      let title = document.createElement("h1");
      title.textContent = issueResult.title;
      title.className = "post-title";
      header.appendChild(title);
      let meta = document.createElement("div");
      meta.className = "post-meta";
      let authorInfo = document.createElement("div");
      authorInfo.className = "author-info";
      let avatar = document.createElement("img");
      avatar.setAttribute("src", issueResult.user.avatar_url);
      avatar.setAttribute("alt", issueResult.user.login);
      avatar.className = "avatar";
      authorInfo.appendChild(avatar);
      let authorName = document.createElement("a");
      authorName.textContent = issueResult.user.login;
      authorName.setAttribute("href", issueResult.user.html_url);
      authorName.setAttribute("target", "_blank");
      authorName.className = "author-name";
      authorInfo.appendChild(authorName);
      meta.appendChild(authorInfo);
      let dateInfo = document.createElement("span");
      dateInfo.textContent = formatDate2(issueResult.created_at);
      dateInfo.className = "post-date";
      meta.appendChild(dateInfo);
      header.appendChild(meta);
      if (issueResult.labels.length !== 0) {
        let labelsDiv = document.createElement("div");
        labelsDiv.className = "post-labels";
        issueResult.labels.forEach((label) => {
          let pill = document.createElement("a");
          pill.textContent = label.name;
          pill.className = "label-pill";
          pill.setAttribute("href", routeToString({
            TAG: "LabelFilter",
            _0: label.name,
            _1: 1
          }));
          let textLight = getLabelTextColor2(label.color);
          pill["style.cssText"] = "background-color: #" + label.color + "; color: " + textLight;
          labelsDiv.appendChild(pill);
        });
        header.appendChild(labelsDiv);
      }
      article.appendChild(header);
      let bodyDiv = document.createElement("div");
      bodyDiv.className = "post-body markdown-body";
      let text = issueResult.body;
      let bodyHtml = text !== void 0 ? Marked.parse(text) : "<p><em>No content</em></p>";
      bodyDiv.innerHTML = bodyHtml;
      article.appendChild(bodyDiv);
      let commentsSection = document.createElement("section");
      commentsSection.className = "comments-section";
      let commentsTitle = document.createElement("h2");
      commentsTitle.textContent = String(commentsResult.length) + " Comments";
      commentsTitle.className = "comments-title";
      commentsSection.appendChild(commentsTitle);
      commentsResult.forEach((comment) => {
        commentsSection.appendChild(renderComment(comment.user, comment.body, comment.created_at));
      });
      article.appendChild(commentsSection);
      let githubLink = document.createElement("a");
      githubLink.textContent = "View on GitHub";
      githubLink.setAttribute("href", issueResult.html_url);
      githubLink.setAttribute("target", "_blank");
      githubLink.className = "github-link";
      article.appendChild(githubLink);
      container.appendChild(article);
    } else {
      let error = document.createElement("div");
      error.className = "error-state";
      error.textContent = "Post not found.";
      container.appendChild(error);
    }
  } else {
    let discussionPromise = getDiscussion(number);
    let commentsPromise$1 = getDiscussionComments(number);
    let discussionResult = await discussionPromise;
    let commentsResult$1 = await commentsPromise$1;
    container.innerHTML = "";
    container.appendChild(backLink);
    if (discussionResult !== void 0) {
      let article$1 = document.createElement("article");
      article$1.className = "post-detail";
      let header$1 = document.createElement("header");
      header$1.className = "post-header";
      let title$1 = document.createElement("h1");
      title$1.textContent = discussionResult.title;
      title$1.className = "post-title";
      header$1.appendChild(title$1);
      let meta$1 = document.createElement("div");
      meta$1.className = "post-meta";
      let authorInfo$1 = document.createElement("div");
      authorInfo$1.className = "author-info";
      let avatar$1 = document.createElement("img");
      avatar$1.setAttribute("src", discussionResult.user.avatar_url);
      avatar$1.setAttribute("alt", discussionResult.user.login);
      avatar$1.className = "avatar";
      authorInfo$1.appendChild(avatar$1);
      let authorName$1 = document.createElement("a");
      authorName$1.textContent = discussionResult.user.login;
      authorName$1.setAttribute("href", discussionResult.user.html_url);
      authorName$1.setAttribute("target", "_blank");
      authorName$1.className = "author-name";
      authorInfo$1.appendChild(authorName$1);
      meta$1.appendChild(authorInfo$1);
      let dateInfo$1 = document.createElement("span");
      dateInfo$1.textContent = formatDate2(discussionResult.created_at);
      dateInfo$1.className = "post-date";
      meta$1.appendChild(dateInfo$1);
      header$1.appendChild(meta$1);
      let catDiv = document.createElement("div");
      catDiv.className = "post-labels";
      let catPill = document.createElement("span");
      let e = discussionResult.category.emoji;
      let emoji = e !== void 0 ? e + " " : "";
      catPill.textContent = emoji + discussionResult.category.name;
      catPill.className = "label-pill";
      catPill["style.cssText"] = "background-color: #6e40c9; color: #fff";
      catDiv.appendChild(catPill);
      header$1.appendChild(catDiv);
      article$1.appendChild(header$1);
      let bodyDiv$1 = document.createElement("div");
      bodyDiv$1.className = "post-body markdown-body";
      let text$1 = discussionResult.body;
      let bodyHtml$1 = text$1 !== void 0 ? Marked.parse(text$1) : "<p><em>No content</em></p>";
      bodyDiv$1.innerHTML = bodyHtml$1;
      article$1.appendChild(bodyDiv$1);
      let commentsSection$1 = document.createElement("section");
      commentsSection$1.className = "comments-section";
      let commentsTitle$1 = document.createElement("h2");
      commentsTitle$1.textContent = String(commentsResult$1.length) + " Comments";
      commentsTitle$1.className = "comments-title";
      commentsSection$1.appendChild(commentsTitle$1);
      commentsResult$1.forEach((comment) => {
        commentsSection$1.appendChild(renderComment(comment.user, comment.body, comment.created_at));
      });
      article$1.appendChild(commentsSection$1);
      let githubLink$1 = document.createElement("a");
      githubLink$1.textContent = "View on GitHub";
      githubLink$1.setAttribute("href", discussionResult.html_url);
      githubLink$1.setAttribute("target", "_blank");
      githubLink$1.className = "github-link";
      article$1.appendChild(githubLink$1);
      container.appendChild(article$1);
    } else {
      let error$1 = document.createElement("div");
      error$1.className = "error-state";
      error$1.textContent = "Discussion not found.";
      container.appendChild(error$1);
    }
  }
  window.scrollTo(0, 0);
}

// src/App.mjs
function getMainContainer() {
  let el = document.getElementById("app");
  if (el !== void 0) {
    return valFromOption(el);
  }
  let el$1 = document.createElement("div");
  el$1.id = "app";
  document.body.appendChild(el$1);
  return el$1;
}
var searchFilter = {
  contents: ""
};
var currentLabel = {
  contents: void 0
};
async function handleRoute(route) {
  let container = getMainContainer();
  container.innerHTML = "";
  let layout = document.createElement("div");
  layout.className = "layout";
  container.appendChild(layout);
  let sidebarContainer = document.createElement("div");
  layout.appendChild(sidebarContainer);
  let main = document.createElement("main");
  main.className = "main-content";
  layout.appendChild(main);
  await render(sidebarContainer, searchFilter, (param) => {
    let page = currentRoute.contents;
    if (typeof page !== "object") {
      return;
    }
    switch (page.TAG) {
      case "PostList":
        render3(main, page._0, void 0, searchFilter.contents);
        return;
      case "LabelFilter":
        render3(main, page._1, page._0, searchFilter.contents);
        return;
      default:
        return;
    }
  }, (name) => navigate({
    TAG: "LabelFilter",
    _0: name,
    _1: 1
  }));
  if (typeof route !== "object") {
    if (route === "Labels") {
      render3(main, 1, void 0, "");
      return;
    }
    let error = document.createElement("div");
    error.className = "error-state";
    error.textContent = "404 - Page not found";
    main.appendChild(error);
    return;
  } else {
    switch (route.TAG) {
      case "PostList":
        render3(main, route._0, void 0, searchFilter.contents);
        return;
      case "PostDetail":
        render4(main, route._0, route._1);
        return;
      case "LabelFilter":
        render3(main, route._1, route._0, searchFilter.contents);
        return;
    }
  }
}
setTitle(siteTitle);
init((route) => {
  handleRoute(route);
});
export {
  currentLabel,
  getMainContainer,
  handleRoute,
  searchFilter
};
