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

/**
 *
 * @type {string} ACCESS_TOKEN - Personal access tokens，使用5000points/h的高端授权捏
 *           All of these requests count towards your personal rate limit of 5,000 requests per hour.
 *           The primary rate limit for unauthenticated requests is 60 requests per hour.
 *           '' = without token / use unauthenticated request / 1分钟1个API的速度
 *           '<token>' = with token / use yourself authenticated request / 1分钟83个用户的响应速度（bushi
 * @type {string} OWNER - 用户名
 * @type {string} REPO - 仓库名
 * @type {Object} VerCtrl - 使用API的版本，用作github api的头部 ruanya!
 */

export const VerCtrl = {headers: { 'X-GitHub-Api-Version': '2022-11-28' }};
export const ACCESS_TOKEN = '';
// 这是我的榜样 练习场（
// export const OWNER = 'isaaxite';
// export const REPO = 'blog';
export const OWNER = 'Bemly';
export const REPO = 'Web-IssueInk';
export const SERVNAME = '[issueink-core]';
