/**
 * Copyright (c) 2024 Bemly_
 * Licensed under the Mozilla Public License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Octokit } from "https://esm.sh/octokit";
import { ACCESS_TOKEN, VerCtrl, REPO, OWNER } from "../config.js";

// 创建API实例
const octokit = ACCESS_TOKEN === "" ? new Octokit() : new Octokit({
    auth: ACCESS_TOKEN
});





// 变态获取个数 get list => cost 1 point
// export let data = await octokit.request(`GET /repos/${OWNER}/${REPO}/issues?per_page=1&state=all`, VerCtrl)
//     .then(res => res.data[0].number)
//     .catch(err => console.error(SERVNAME+err));


// export let data = await octokit.request(`GET /repos/${OWNER}/${REPO}/issues/44`, VerCtrl);
// export let data = await octokit.request(`GET /repos/${OWNER}/${REPO}/issues/44/comments`, VerCtrl);
// export let data = await octokit.request(`GET /repos/${OWNER}/${REPO}/issues/44`, VerCtrl);
// export let data = await octokit.request(`GET /repos/${OWNER}/${REPO}/issues/44`, VerCtrl);
export let data = await octokit.request(`GET /repos/${OWNER}/${REPO}/issues?per_page=10&state=all&page=300`, VerCtrl);


