var gogogo = code => fetch("https://github.com/login/oauth/access_token?client_id=eaa7fedee07299f28436&client_secret=ea3e19035292dd20527f26819a9448f1f05c40b7&code=" + code)
    .then(data => console.log(data))
    .catch(err => console.error(err));

// 废弃代码 有空删除 注意把env删除
fetch("https://api.example.com/postData", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        key1: "value1",
        key2: "value2",
    }),
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error:", error));
// 7c819a17523df16b5b32



window.location.href='https://github.com/login/oauth/authorize?client_id=eaa7fedee07299f28436&state=bemly';

// POST请求的数据
const postData = {
    client_id: 'eaa7fedee07299f28436',
    client_secret: 'ea3e19035292dd20527f26819a9448f1f05c40b7',
    code: '9ee3edbca3d84203f2ae'
};
// https://github.com/login/oauth/access_token?client_id=eaa7fedee07299f28436&client_secret=ea3e19035292dd20527f26819a9448f1f05c40b7&code=8d16daefee33a4c7f543&redirect_uri=https%3A%2F%2Fbemly.moe
// 构建请求选项
const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
        // 在这里可以添加其他的请求头信息
    },
    body: JSON.stringify(postData)
};

fetch('https://github.com/login/oauth/access_token', requestOptions)
    .then(response => response.json())
    .then(data => {
        console.log('POST请求成功:', data);
    })
    .catch(error => {
        console.error('POST请求失败:', error);
    });

import { Octokit, App } from "https://esm.sh/octokit";
import { createTokenAuth } from "https://esm.sh/@octokit/auth-token";
console.log("Hello, %s", createTokenAuth);
let data = await fetch("https://github.com/login/oauth/authorize?client_id=eaa7fedee07299f28436")
    .then(response => response.json())
    .catch(error => console.error("Error:", error));
console.info(data)


// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: `personal-access-token123` });

// Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
const {
    data: { login },
} = await octokit.rest.users.getAuthenticated();

// jsonp 被 nosniff禁惹
function foo(response) {
    var meta = response.meta;
    var data = response.data;
    console.log(meta);
    console.log(data);
}

var script = document.createElement('script');
// script.src = 'https://api.github.com/repos/isaaxite/blog/issues/309?callback=foo';
// script.src = 'https://github.com/login/oauth/authorize?client_id=eaa7fedee07299f28436&state=bemly';

document.getElementsByTagName('head')[0].appendChild(script);

let abc = fetch('https://api.github.com/repos/isaaxite/blog/issues/309').then(data=>{
    let bbb = data.json();
    console.log(data);
    console.log(bbb);
});
// Octokit.js
// https://github.com/octokit/core.js#readme