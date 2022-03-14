import core from '@actions/core'
import github from '@actions/github'

export async function run() {
  const client = github.getOctokit(process.env.GITHUB_TOKEN, {
    baseUrl: process.env.INPUT_GITHUBBASEURL,
  })

  const contextPullRequest = github.context.payload.pull_request;
  if (!contextPullRequest) {
    throw new Error(
      "This action can only be used in `pull_request` or `pull_request_target`."
    )
  }

  const owner = contextPullRequest.base.user.login
  const repo = contextPullRequest.base.repo.name

  const {data: pullRequest} = await client.rest.pulls.get({
    owner,
    repo,
    pull_number: contextPullRequest.number
  })

  const isWip = /^\[WIP\]\s/.test(pullRequest.title)

  await client.request('POST /repos/:owner/:repo/statuses/:sha', {
    owner,
    repo,
    sha: pullRequest.head.sha,
    state: isWip ? 'pending' : 'success',
    target_url: 'https://github.com/shiipou/pr-is-wip-action',
    description: isWip ? 'This PR is marked as "WIP".' : 'This PR is marked as "Ready to review".',
    context: 'pr-is-wip-action'
  });

  core.setOutput("isWip", `${isWip}`);
}
