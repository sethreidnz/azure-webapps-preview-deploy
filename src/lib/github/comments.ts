import { getGithubClient } from './client';

export type CreateGithubIssueCommentParams = {
  githubToken: string;
  repository: string;
  owner: string;
  issueNumber: number;
  body: string;
};
export const createComment = async ({
  githubToken,
  repository,
  owner,
  issueNumber,
  body,
}: CreateGithubIssueCommentParams) => {
  const client = getGithubClient(githubToken);
  return client.issues.createComment({
    owner: owner,
    repo: repository,
    issue_number: issueNumber,
    body,
  });
};

export type UpdateGithubIssueCommentParams = {
  githubToken: string;
  repository: string;
  owner: string;
  commentId: number;
  body: string;
};
export const updateComment = async ({
  githubToken,
  repository,
  owner,
  commentId,
  body,
}: UpdateGithubIssueCommentParams) => {
  const client = getGithubClient(githubToken);
  return client.issues.updateComment({
    owner: owner,
    repo: repository,
    comment_id: commentId,
    body,
  });
};

export type GetGithubCommentParams = {
  githubToken: string;
  repository: string;
  owner: string;
  issueNumber: number;
};
export const getComments = async ({
  githubToken,
  repository,
  owner,
  issueNumber,
}: GetGithubCommentParams) => {
  const client = getGithubClient(githubToken);
  const result = await client.issues.listComments({
    owner: owner,
    repo: repository,
    issue_number: issueNumber,
  });
  return result;
};

export type GetGithubCommentByUserParams = {
  githubToken: string;
  repository: string;
  owner: string;
  issueNumber: number;
  user: string;
};
export const getCommentByUser = async ({
  githubToken,
  repository,
  owner,
  issueNumber,
  user,
}: GetGithubCommentByUserParams) => {
  const client = getGithubClient(githubToken);
  for await (const { data: comments } of client.paginate.iterator(
    client.rest.issues.listComments,
    {
      owner: owner,
      repo: repository,
      issue_number: issueNumber,
    }
  )) {
    const comment = comments.find((comment) => comment.user?.login === user);
    if (comment) return comment;
  }
};

export const upsertComment = async ({
  githubToken,
  repository,
  owner,
  issueNumber,
  body,
  user,
}: {
  githubToken: string;
  repository: string;
  owner: string;
  issueNumber: number;
  body: string;
  user: string;
}) => {
  const existingComment = await getCommentByUser({
    githubToken,
    repository,
    owner,
    issueNumber,
    user,
  });
  if (existingComment) {
    await updateComment({
      githubToken,
      repository,
      owner,
      commentId: existingComment.id,
      body,
    });
  } else {
    await createComment({
      githubToken,
      repository,
      owner,
      issueNumber,
      body,
    });
  }
};
