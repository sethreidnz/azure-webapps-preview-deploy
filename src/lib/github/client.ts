import { Octokit } from '@octokit/rest';

let client: Octokit | undefined;
export const getGithubClient = (githubToken: string) => {
  if (!githubToken) {
    throw new Error(
      'Could not create github client. Must provide a githubToken parameter.'
    );
  }

  if (!client) {
    client = new Octokit({
      auth: githubToken,
    });
  }
  return client;
};
