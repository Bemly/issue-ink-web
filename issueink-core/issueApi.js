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
import { Octokit } from "https://esm.sh/octokit";
import { ACCESS_TOKEN, VerCtrl, REPO, OWNER } from "../config.js";

// 创建API实例
const octokit = ACCESS_TOKEN === "" ? new Octokit() : new Octokit({
    auth: ACCESS_TOKEN
});

/**
 * 获取问题(文章)列表
 *
 * @since 2024-02-03
 * @author bemly_
 *
 * @param {string} [arg.milestone] - int|*|none 筛选里程碑，可用来区分项目
 * @param {string} [arg.state = 'all'] - open|close|all 筛选是否解决的问题
 * @param {string} [arg.assignee] - none|user 筛选分配给指定用户的问题
 * @param {string} [arg.creator] - 筛选创建问题的用户
 * @param {string} [arg.mentioned] - 筛选问题中被艾特的用户
 * @param {string} [arg.labels] - 筛选标签，可以分类文章使用
 * @param {string} [arg.sort] - created|updated|comments 按创建/更新/评论时间排序
 * @param {string} [arg.direction] - asc|desc 顺逆排序
 * @param {string} [arg.since] - YYYY-MM-DDTHH:MM:SSZ 筛选此时间段
 * @param {int} [arg.per_page = 30] - 返回个数 1-100
 * @param {int} [arg.page = 1] - issue ID
 *
 * @return {Object} data - ./simple/getIssues.json
 * @link https://docs.github.com/zh/rest/issues/issues?apiVersion=2022-11-28
 */
export let getIssues = arg =>
    octokit.request(`GET /repos/${OWNER}/${REPO}/issues`, {
        ...arg, state: 'all', ...VerCtrl
    }).then(data => data).catch(err => console.error(err));

/**
 * 不建议使用，获取问题(文章)列表
 *
 * @since 2024-02-03
 * @author bemly_
 *
 * @return {Promise<(value: number) => CSSUnitValue>}
 */
export let getIssuesCount = async () =>
    (await getIssues({per_page: 1})).data[0].number;

/**
 * 暴力获取全部的问题(文章)列表
 * 没有优化，全是感情，慎用
 *
 * @since 2024-02-04
 * @author bemly_
 *
 * @return {Array}
 */
export let getAllIssues = async () => {
    // for ()
    let resIssues = (await getIssues({per_page: 100})).data;
    let i = 1;
    while (i) {
        let stepIssue = (await getIssues({per_page: 100, page: ++i})).data;
        resIssues = [...resIssues, ...stepIssue];
        if (stepIssue.length < 100) break;
        console.log(resIssues.length);
    }
    return resIssues;
}

/**
 * 获取问题(文章)详情
 *
 * @since 2024-02-03
 * @author bemly_
 *
 * @param {int} ISSUE_NUMBER - 问题编号
 *
 * @return {Object} data - ./simple/getIssue.json
 * @link https://docs.github.com/zh/rest/reference/issues#get-an-issue
 */
export let getIssue = ISSUE_NUMBER =>
    octokit.request(`GET /repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}`, VerCtrl)
        .then(data => data).catch(err => console.error(err));

// TODO: 还不知道评论区的API 官方REST API没给，如果之后获取超过再加
/**
 * 获取问题(文章)评论区
 *
 * @since 2024-02-03
 * @author bemly_
 *
 * @param {int} ISSUE_NUMBER - 问题编号
 *
 * @return {Object} data - ./simple/getComments.json
 */
export let getComments = ISSUE_NUMBER =>
    octokit.request(`GET /repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}/comments`, VerCtrl)
        .then(data => data).catch(err => console.error(err));

// 下面的东西gpt同类生成的指导，直接略过吧，手动github修改ruanya~
// 下列操作必须使用token！
// ACCESS_TOKEN !== ""
// 因为CORS JSON-P/nosniff相关原因，下面这部分请使用后端服务器构建！
// 前端授权 会 暴露token！

// 使用OAUTH APP鉴权，纯前端授权也会暴露Client secret！
// 要么后端数据库 要么自动化脚本跑bot QaQ
/**
 * TODO: 更新问题
 *
 * @since 2024-02-03
 * @author bemly_
 *
 * @param {string} OWNER - 用户名
 * @param {string} REPO - 仓库名
 * @param {int} ISSUE_NUMBER - 问题编号
 * @param {string} [accept = "application/vnd.github+json"] - 接受的媒体类型
 *
 * @param {object} body - 请求正文
 * @param {string} [body.title] - 问题标题
 * @param {string} [body.body] - 问题内容
 * @param {string} [body.assignee] - 分配给问题的用户名
 * @param {string} [body.state] - 问题状态，可以是 "open" 或 "closed"
 * @param {string} [body.state_reason] - 状态更改的原因，可以是 "completed", "not_planned", "reopened", 或 null
 * @param {int|string|null} [body.milestone] - 里程碑的编号，使用 null 删除当前里程碑
 * @param {array} [body.labels] - 与问题关联的标签数组
 * @param {array} [body.assignees] - 分配给问题的用户数组
 *
 * @link https://docs.github.com/zh/rest/reference/issues#update-an-issue
 */
const updateIssueAPI = "PATCH /repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}?accept=${accept || 'application/vnd.github+json'}";

/**
 * TODO: 锁定问题
 *
 * 适用于 GitHub Apps
 *
 * Users with push access can lock an issue or pull request's conversation.
 * 具有推送访问权限的用户可以锁定问题或拉取请求的对话。
 *
 * Note that, if you choose not to pass any parameters, you'll need to set Content-Length to zero when calling out to this endpoint.
 * For more information, see "HTTP method."
 * 请注意，如果您选择不传递任何参数，则在调用此端点时需要将Content-Length设置为零。
 * 有关详细信息，请参阅“HTTP方法。“
 *
 * @since 2024-02-03
 * @author bemly_
 * @license MPL-2.0
 *
 * @param {string} OWNER - 用户名
 * @param {string} REPO - 仓库名
 * @param {int} ISSUE_NUMBER - 问题编号
 * @param {string} lock_reason - 锁定问题或拉取请求会话的原因
 *   可以是以下选项之一: off-topic, too heated, resolved, spam
 * @param {string} [accept = "application/vnd.github+json"] - 接受的媒体类型
 *
 * @link https://docs.github.com/zh/rest/reference/issues#lock-an-issue
 */
const lockIssueAPI = "PUT /repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}/lock?accept=${accept || 'application/vnd.github+json'}";

/**
 * TODO: 解锁问题
 *
 * 适用于 GitHub Apps
 *
 * Users with push access can unlock an issue's conversation.
 * 具有推送访问权限的用户可以解锁问题的对话。
 *
 * @since 2024-02-03
 * @author bemly_
 * @license MPL-2.0
 *
 * @param {string} OWNER - 用户名
 * @param {string} REPO - 仓库名
 * @param {int} ISSUE_NUMBER - 问题编号
 * @param {string} [accept = "application/vnd.github+json"] - 接受的媒体类型
 *
 * @link https://docs.github.com/zh/rest/reference/issues#unlock-an-issue
 */
const unlockIssueAPI = "DELETE /repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}/lock?accept=${accept || 'application/vnd.github+json'}";

