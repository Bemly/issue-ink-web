/**
 * Copyright (c) 2024 Bemly_
 * Licensed under the Mozilla Public License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.mozilla.org/MPL/2.0/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { marked } from 'https://esm.sh/marked';
import { getIssues,getIssue,getIssuesCount,getAllIssues,getComments } from "./issueApi.js";

// get get get 还有get 全部get(
let issue_set = await getIssues({per_page:5});
let issue_data_set = [], index = 0;
for (const issue of issue_set.data) {
    let issue_data = (await getIssue(issue.number)).data;
    issue_data_set[index] = document.createElement('div');
    issue_data_set[index].id = `data${index}`;
    document.body.appendChild(issue_data_set[index]);
    document.getElementById(`data${index++}`).innerHTML =
        marked.parse(issue_data.body);
}