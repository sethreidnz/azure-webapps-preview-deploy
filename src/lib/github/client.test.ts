import { faker } from '@faker-js/faker';
import { Octokit } from '@octokit/rest';
import { getGithubClient } from './client';

const OctokitMock = jest.mocked(Octokit);
jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn().mockImplementation(() => {
    return {};
  }),
}));

describe('getGithubClient()', () => {
  beforeEach(() => {
    OctokitMock.mockReset();
  });
  test('given githubToken is not provided should throw error', () => {
    // arrange
    const githubToken = undefined;

    // act
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const act = () => getGithubClient(githubToken!);

    // assert
    expect(act).toThrow(
      'Could not create github client. Must provide a githubToken parameter.'
    );
  });

  test('should pass correct parameters to Octokit client', () => {
    // arrange
    const githubToken = faker.datatype.uuid();

    // act
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    getGithubClient(githubToken!);

    // assert
    expect(OctokitMock).toHaveBeenCalledWith({ auth: githubToken });
  });
});
