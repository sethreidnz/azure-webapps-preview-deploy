import { faker } from '@faker-js/faker';
import {
  getWebAppClient,
  getResourceManagementClient,
  getBlobServiceClient,
} from './client';
import { WebSiteManagementClient } from '@azure/arm-appservice';
import { DefaultAzureCredential } from '@azure/identity';
import { ResourceManagementClient } from '@azure/arm-resources';
import { BlobServiceClient } from '@azure/storage-blob';

const DefaultAzureCredentialMock = jest.mocked(DefaultAzureCredential);
jest.mock('@azure/identity', () => ({
  DefaultAzureCredential: jest.fn(),
}));

const WebSiteManagementClientMock = jest.mocked(WebSiteManagementClient);
jest.mock('@azure/arm-appservice', () => ({
  WebSiteManagementClient: jest.fn(),
}));

const ResourceManagementClientMock = jest.mocked(ResourceManagementClient);
jest.mock('@azure/arm-resources', () => ({
  ResourceManagementClient: jest.fn(),
}));

const BlobServiceClientMock = jest.mocked(BlobServiceClient);
jest.mock('@azure/storage-blob', () => ({
  BlobServiceClient: jest.fn(),
}));

describe('getWebAppClient()', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('azure environment variables', () => {
    test('given AZURE_CLIENT_ID environment variable is not set should throw error', () => {
      // arrange
      process.env.AZURE_CLIENT_ID = undefined;
      const subscriptionId = faker.datatype.uuid();

      // act
      const act = () => getWebAppClient(subscriptionId);

      // assert
      expect(act).toThrow();
    });

    test('given AZURE_TENANT_ID environment variable is not set should throw error', () => {
      // arrange
      process.env.AZURE_TENANT_ID = undefined;
      const subscriptionId = faker.datatype.uuid();

      // act
      const act = () => getWebAppClient(subscriptionId);

      // assert
      expect(act).toThrow();
    });

    test('given AZURE_CLIENT_SECRET environment variable is not set should throw error', () => {
      // arrange
      process.env.AZURE_CLIENT_SECRET = undefined;
      const subscriptionId = faker.datatype.uuid();

      // act
      const act = () => getWebAppClient(subscriptionId);

      // assert
      expect(act).toThrow();
    });

    test('given all the environment variable are set should not throw', () => {
      // arrange
      process.env.AZURE_CLIENT_ID = faker.datatype.uuid();
      process.env.AZURE_TENANT_ID = faker.datatype.uuid();
      process.env.AZURE_CLIENT_SECRET = faker.datatype.uuid();
      const subscriptionId = faker.datatype.uuid();

      // act
      const act = () => getWebAppClient(subscriptionId);

      // assert
      expect(act).not.toThrow();
    });
  });

  describe('given environment variables are set correctly', () => {
    beforeEach(() => {
      process.env.AZURE_CLIENT_ID = faker.datatype.uuid();
      process.env.AZURE_TENANT_ID = faker.datatype.uuid();
      process.env.AZURE_CLIENT_SECRET = faker.datatype.uuid();
    });

    test('should call DefaultAzureCredential', () => {
      // arrange
      const subscriptionId = faker.datatype.uuid();

      // act
      getWebAppClient(subscriptionId);

      // assert
      expect(DefaultAzureCredentialMock).toHaveBeenCalled();
    });

    test('should call WebSiteManagementClient with returned credentials and supplied subscription id', () => {
      // arrange
      const subscriptionId = faker.datatype.uuid();
      const expectedCredentials = { subscriptionId: subscriptionId };
      DefaultAzureCredentialMock.mockImplementation(
        () => expectedCredentials as unknown as DefaultAzureCredential
      );

      // act
      getWebAppClient(subscriptionId);

      // assert
      expect(WebSiteManagementClientMock).toHaveBeenCalledWith(
        expectedCredentials,
        subscriptionId
      );
    });

    test('should return client returned by WebSiteManagementClient', () => {
      // arrange
      const subscriptionId = faker.datatype.uuid();
      DefaultAzureCredentialMock.mockImplementation(
        () =>
          ({
            subscriptionId: subscriptionId,
          } as unknown as DefaultAzureCredential)
      );
      const expectedClient = { subscriptionId: subscriptionId };
      WebSiteManagementClientMock.mockImplementation(
        () => expectedClient as unknown as WebSiteManagementClient
      );

      // act
      const client = getWebAppClient(subscriptionId);

      // assert
      expect(client).toBe(expectedClient);
    });

    test('given a second call to getWebAppClient should not make another call to DefaultAzureCredential', () => {
      // arrange
      const subscriptionId = faker.datatype.uuid();
      const expectedCredentials = { subscriptionId: subscriptionId };
      DefaultAzureCredentialMock.mockImplementation(
        () => expectedCredentials as unknown as DefaultAzureCredential
      );

      // act
      getWebAppClient(subscriptionId);
      getWebAppClient(subscriptionId);

      // assert
      expect(DefaultAzureCredentialMock).not.toHaveBeenCalledTimes(1);
    });
  });
});

describe('getResourceManagementClient()', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('azure environment variables', () => {
    test('given AZURE_CLIENT_ID environment variable is not set should throw error', () => {
      // arrange
      process.env.AZURE_CLIENT_ID = undefined;
      const subscriptionId = faker.datatype.uuid();

      // act
      const act = () => getResourceManagementClient(subscriptionId);

      // assert
      expect(act).toThrow();
    });

    test('given AZURE_TENANT_ID environment variable is not set should throw error', () => {
      // arrange
      process.env.AZURE_TENANT_ID = undefined;
      const subscriptionId = faker.datatype.uuid();

      // act
      const act = () => getResourceManagementClient(subscriptionId);

      // assert
      expect(act).toThrow();
    });

    test('given AZURE_CLIENT_SECRET environment variable is not set should throw error', () => {
      // arrange
      process.env.AZURE_CLIENT_SECRET = undefined;
      const subscriptionId = faker.datatype.uuid();

      // act
      const act = () => getResourceManagementClient(subscriptionId);

      // assert
      expect(act).toThrow();
    });

    test('given all the environment variable are set should not throw', () => {
      // arrange
      process.env.AZURE_CLIENT_ID = faker.datatype.uuid();
      process.env.AZURE_TENANT_ID = faker.datatype.uuid();
      process.env.AZURE_CLIENT_SECRET = faker.datatype.uuid();
      const subscriptionId = faker.datatype.uuid();

      // act
      const act = () => getResourceManagementClient(subscriptionId);

      // assert
      expect(act).not.toThrow();
    });
  });

  describe('given environment variables are set correctly', () => {
    beforeEach(() => {
      process.env.AZURE_CLIENT_ID = faker.datatype.uuid();
      process.env.AZURE_TENANT_ID = faker.datatype.uuid();
      process.env.AZURE_CLIENT_SECRET = faker.datatype.uuid();
    });

    test('should call DefaultAzureCredential', () => {
      // arrange
      const subscriptionId = faker.datatype.uuid();

      // act
      getResourceManagementClient(subscriptionId);

      // assert
      expect(DefaultAzureCredentialMock).toHaveBeenCalled();
    });

    test('should call WebSiteManagementClient with returned credentials and supplied subscription id', () => {
      // arrange
      const subscriptionId = faker.datatype.uuid();
      const expectedCredentials = { subscriptionId: subscriptionId };
      DefaultAzureCredentialMock.mockImplementation(
        () => expectedCredentials as unknown as DefaultAzureCredential
      );

      // act
      getResourceManagementClient(subscriptionId);

      // assert
      expect(ResourceManagementClientMock).toHaveBeenCalledWith(
        expectedCredentials,
        subscriptionId
      );
    });

    test('should return client returned by WebSiteManagementClient', () => {
      // arrange
      const subscriptionId = faker.datatype.uuid();
      DefaultAzureCredentialMock.mockImplementation(
        () =>
          ({
            subscriptionId: subscriptionId,
          } as unknown as DefaultAzureCredential)
      );
      const expectedClient = { subscriptionId: subscriptionId };
      ResourceManagementClientMock.mockImplementation(
        () => expectedClient as unknown as ResourceManagementClient
      );

      // act
      const client = getResourceManagementClient(subscriptionId);

      // assert
      expect(client).toBe(expectedClient);
    });

    test('given a second call to getWebAppClient should not make another call to DefaultAzureCredential', () => {
      // arrange
      const subscriptionId = faker.datatype.uuid();
      const expectedCredentials = { subscriptionId: subscriptionId };
      DefaultAzureCredentialMock.mockImplementation(
        () => expectedCredentials as unknown as DefaultAzureCredential
      );

      // act
      getResourceManagementClient(subscriptionId);
      getResourceManagementClient(subscriptionId);

      // assert
      expect(DefaultAzureCredentialMock).not.toHaveBeenCalledTimes(1);
    });
  });
});

describe('getBlobServiceClient()', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('azure environment variables', () => {
    test('given AZURE_CLIENT_ID environment variable is not set should throw error', () => {
      // arrange
      process.env.AZURE_CLIENT_ID = undefined;
      const accountName = faker.lorem.word();

      // act
      const act = () => getBlobServiceClient(accountName);

      // assert
      expect(act).toThrow();
    });

    test('given AZURE_TENANT_ID environment variable is not set should throw error', () => {
      // arrange
      process.env.AZURE_TENANT_ID = undefined;
      const accountName = faker.lorem.word();

      // act
      const act = () => getBlobServiceClient(accountName);

      // assert
      expect(act).toThrow();
    });

    test('given AZURE_CLIENT_SECRET environment variable is not set should throw error', () => {
      // arrange
      process.env.AZURE_CLIENT_SECRET = undefined;
      const accountName = faker.lorem.word();

      // act
      const act = () => getBlobServiceClient(accountName);

      // assert
      expect(act).toThrow();
    });
  });

  describe('given environment variables are set correctly', () => {
    beforeEach(() => {
      process.env.AZURE_CLIENT_ID = faker.datatype.uuid();
      process.env.AZURE_TENANT_ID = faker.datatype.uuid();
      process.env.AZURE_CLIENT_SECRET = faker.datatype.uuid();
    });

    test('should call DefaultAzureCredential', () => {
      // arrange
      const accountName = faker.lorem.word();

      // act
      getBlobServiceClient(accountName);

      // assert
      expect(DefaultAzureCredentialMock).toHaveBeenCalled();
    });

    test('should call WebSiteManagementClient with returned credentials and supplied subscription id', () => {
      // arrange
      const accountName = faker.lorem.word();
      const expectedCredentials = { accountName };
      DefaultAzureCredentialMock.mockImplementation(
        () => expectedCredentials as unknown as DefaultAzureCredential
      );

      // act
      getBlobServiceClient(accountName);

      // assert
      expect(BlobServiceClientMock).toHaveBeenCalledWith(
        `https://${accountName}.blob.core.windows.net`,
        expectedCredentials
      );
    });

    test('should return client returned by WebSiteManagementClient', () => {
      // arrange
      const accountName = faker.lorem.word();
      const expectedClient = { accountName };
      DefaultAzureCredentialMock.mockImplementation(
        () => expectedClient as unknown as DefaultAzureCredential
      );
      BlobServiceClientMock.mockImplementation(
        () => expectedClient as unknown as BlobServiceClient
      );

      // act
      const client = getBlobServiceClient(accountName);

      // assert
      expect(client).toBe(expectedClient);
    });

    test('given a second call to getWebAppClient should not make another call to DefaultAzureCredential', () => {
      // arrange
      const accountName = faker.lorem.word();
      const expectedCredentials = { accountName };
      DefaultAzureCredentialMock.mockImplementation(
        () => expectedCredentials as unknown as DefaultAzureCredential
      );

      // act
      getResourceManagementClient(accountName);
      getResourceManagementClient(accountName);

      // assert
      expect(DefaultAzureCredentialMock).not.toHaveBeenCalledTimes(1);
    });
  });
});
