import { faker } from '@faker-js/faker';
import { getPullRequest } from './pullRequests';
import { getGithubClient } from './client';

const mockGetGithubClient = jest.mocked(getGithubClient);
const mockGetPullRequest = jest.fn();
jest.mock('./client', () => {
  return {
    getGithubClient: jest.fn().mockImplementation(() => ({
      pulls: {
        get: mockGetPullRequest,
      },
    })),
  };
});

describe('getPullRequest()', () => {
  beforeEach(() => {
    mockGetPullRequest.mockReset();
  });
  test('should pass correct parameters to getGithubClient()', async () => {
    // arrange
    const githubToken = faker.datatype.uuid();
    const repository = faker.lorem.slug();
    const owner = faker.lorem.slug();
    const pullNumber = faker.datatype.number();

    // act
    await getPullRequest({
      githubToken,
      repository,
      owner,
      pullNumber,
    });

    // assert
    expect(mockGetGithubClient).toHaveBeenCalledWith(githubToken);
  });

  test('should pass correct parameters to client.issues.createComment()', async () => {
    // arrange
    const githubToken = faker.datatype.uuid();
    const repository = faker.lorem.slug();
    const owner = faker.lorem.slug();
    const pullNumber = faker.datatype.number();

    // act
    await getPullRequest({
      githubToken,
      repository,
      owner,
      pullNumber,
    });

    // assert
    expect(mockGetPullRequest).toHaveBeenCalledWith({
      owner,
      repo: repository,
      pull_number: pullNumber,
    });
  });

  test('should return value from successful call to client.issues.createComment()', async () => {
    // arrange
    const githubToken = faker.datatype.uuid();
    const repository = faker.lorem.slug();
    const owner = faker.lorem.slug();
    const pullNumber = faker.datatype.number();
    const githubResponse = {};
    mockGetPullRequest.mockResolvedValue(githubResponse);

    // act
    const result = await getPullRequest({
      githubToken,
      repository,
      owner,
      pullNumber,
    });

    // assert
    expect(result).toBe(githubResponse);
  });
});
