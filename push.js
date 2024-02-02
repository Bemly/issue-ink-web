var gogogo = code => fetch("https://github.com/login/oauth/access_token?client_id=eaa7fedee07299f28436&client_secret=ea3e19035292dd20527f26819a9448f1f05c40b7&code=" + code)
    .then(data => console.log(data))
    .catch(err => console.error(err));