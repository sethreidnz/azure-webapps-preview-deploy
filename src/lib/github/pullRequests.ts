import { getGithubClient } from './client';

export type GetGithubPullRequestCommentParams = {
  githubToken: string;
  repository: string;
  owner: string;
  pullNumber: number;
};

export const getPullRequest = ({
  githubToken,
  repository,
  owner,
  pullNumber,
}: GetGithubPullRequestCommentParams) => {
  const client = getGithubClient(githubToken);
  return client.pulls.get({
    owner: owner,
    repo: repository,
    pull_number: pullNumber,
  });
};
