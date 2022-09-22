import { faker } from '@faker-js/faker';
import { createComment, getComments, updateComment } from './comments';
import { getGithubClient } from './client';

const mockGetGithubClient = jest.mocked(getGithubClient);
const mockCreateComment = jest.fn();
const mockListComments = jest.fn();
const mockGetComment = jest.fn();
const mockUpdateComment = jest.fn();
jest.mock('./client', () => {
  return {
    getGithubClient: jest.fn().mockImplementation(() => ({
      issues: {
        createComment: mockCreateComment,
        updateComment: mockUpdateComment,
        get: mockGetComment,
        listComments: mockListComments,
      },
    })),
  };
});

describe('createComment()', () => {
  beforeEach(() => {
    mockCreateComment.mockReset();
  });
  test('should pass correct parameters to getGithubClient()', async () => {
    // arrange
    const githubToken = faker.datatype.uuid();
    const repository = faker.lorem.slug();
    const owner = faker.lorem.slug();
    const issueNumber = faker.datatype.number();
    const body = faker.lorem.sentence();

    // act
    await createComment({
      githubToken,
      repository,
      owner,
      issueNumber,
      body,
    });

    // assert
    expect(mockGetGithubClient).toHaveBeenCalledWith(githubToken);
  });

  test('should pass correct parameters to client.issues.createComment()', async () => {
    // arrange
    const githubToken = faker.datatype.uuid();
    const repository = faker.lorem.slug();
    const owner = faker.lorem.slug();
    const issueNumber = faker.datatype.number();
    const body = faker.lorem.sentence();

    // act
    await createComment({
      githubToken,
      repository,
      owner,
      issueNumber,
      body,
    });

    // assert
    expect(mockCreateComment).toHaveBeenCalledWith({
      owner,
      repo: repository,
      issue_number: issueNumber,
      body,
    });
  });

  test('should return value from successful call to client.issues.createComment()', async () => {
    // arrange
    const githubToken = faker.datatype.uuid();
    const repository = faker.lorem.slug();
    const owner = faker.lorem.slug();
    const issueNumber = faker.datatype.number();
    const body = faker.lorem.sentence();
    const githubResponse = {};
    mockCreateComment.mockResolvedValue(githubResponse);

    // act
    const result = await createComment({
      githubToken,
      repository,
      owner,
      issueNumber,
      body,
    });

    // assert
    expect(result).toBe(githubResponse);
  });
});

describe('updateComment()', () => {
  beforeEach(() => {
    mockCreateComment.mockReset();
  });
  test('should pass correct parameters to getGithubClient()', async () => {
    // arrange
    const githubToken = faker.datatype.uuid();
    const repository = faker.lorem.slug();
    const owner = faker.lorem.slug();
    const commentId = faker.datatype.number();
    const body = faker.lorem.sentence();

    // act
    await updateComment({
      githubToken,
      repository,
      owner,
      commentId,
      body,
    });

    // assert
    expect(mockGetGithubClient).toHaveBeenCalledWith(githubToken);
  });

  test('should pass correct parameters to client.issues.createComment()', async () => {
    // arrange
    const githubToken = faker.datatype.uuid();
    const repository = faker.lorem.slug();
    const owner = faker.lorem.slug();
    const commentId = faker.datatype.number();
    const body = faker.lorem.sentence();

    // act
    await updateComment({
      githubToken,
      repository,
      owner,
      commentId,
      body,
    });

    // assert
    expect(mockUpdateComment).toHaveBeenCalledWith({
      owner,
      repo: repository,
      comment_id: commentId,
      body,
    });
  });

  test('should return value from successful call to client.issues.createComment()', async () => {
    // arrange
    // arrange
    const githubToken = faker.datatype.uuid();
    const repository = faker.lorem.slug();
    const owner = faker.lorem.slug();
    const commentId = faker.datatype.number();
    const body = faker.lorem.sentence();
    const githubResponse = { someValue: 'something' };
    mockUpdateComment.mockResolvedValue(githubResponse);

    // act
    const result = await updateComment({
      githubToken,
      repository,
      owner,
      commentId,
      body,
    });

    // assert
    expect(result).toBe(githubResponse);
  });
});

describe('getComments()', () => {
  beforeEach(() => {
    mockCreateComment.mockReset();
  });
  test('should pass correct parameters to getGithubClient()', async () => {
    // arrange
    const githubToken = faker.datatype.uuid();
    const repository = faker.lorem.slug();
    const owner = faker.lorem.slug();
    const issueNumber = faker.datatype.number();

    // act
    await getComments({
      githubToken,
      repository,
      owner,
      issueNumber,
    });

    // assert
    expect(mockGetGithubClient).toHaveBeenCalledWith(githubToken);
  });

  test('should pass correct parameters to client.issues.listComments()', async () => {
    // arrange
    const githubToken = faker.datatype.uuid();
    const repository = faker.lorem.slug();
    const owner = faker.lorem.slug();
    const issueNumber = faker.datatype.number();
    const body = faker.lorem.sentence();

    // act
    await createComment({
      githubToken,
      repository,
      owner,
      issueNumber,
      body,
    });

    // assert
    expect(mockCreateComment).toHaveBeenCalledWith({
      owner,
      repo: repository,
      issue_number: issueNumber,
      body,
    });
  });

  test('should return value from successful call to client.issues.listComments()', async () => {
    // arrange
    const githubToken = faker.datatype.uuid();
    const repository = faker.lorem.slug();
    const owner = faker.lorem.slug();
    const issueNumber = faker.datatype.number();
    const body = faker.lorem.sentence();
    const githubResponse = [{ id: 1 }, { id: 2 }];
    mockCreateComment.mockResolvedValue(githubResponse);

    // act
    const result = await createComment({
      githubToken,
      repository,
      owner,
      issueNumber,
      body,
    });

    // assert
    expect(result).toBe(githubResponse);
  });
});
