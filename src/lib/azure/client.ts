import { WebSiteManagementClient } from '@azure/arm-appservice';
import { ResourceManagementClient } from '@azure/arm-resources';
import { BlobServiceClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';

// eslint-disable-next-line func-style
function validateEnvironmentVariables() {
  if (process.env.AZURE_CLIENT_ID == null) {
    throw new Error(
      'Could not authenticate with Azure. You must set the environment variable AZURE_CLIENT_ID.'
    );
  }
  if (process.env.AZURE_TENANT_ID == null) {
    throw new Error(
      'Could not authenticate with Azure. You must set the environment variable AZURE_TENANT_ID.'
    );
  }
  if (process.env.AZURE_CLIENT_SECRET == null) {
    throw new Error(
      'Could not authenticate with Azure. You must set the environment variable AZURE_CLIENT_SECRET.'
    );
  }
}

let webAppClient: WebSiteManagementClient | undefined;
export const getWebAppClient = (subscriptionId: string) => {
  validateEnvironmentVariables();
  if (!webAppClient || webAppClient.subscriptionId !== subscriptionId) {
    const credential = new DefaultAzureCredential();
    webAppClient = new WebSiteManagementClient(credential, subscriptionId);
  }
  return webAppClient;
};

let resourceManagementClient: ResourceManagementClient | undefined;
export const getResourceManagementClient = (subscriptionId: string) => {
  validateEnvironmentVariables();
  if (
    !resourceManagementClient ||
    resourceManagementClient.subscriptionId !== subscriptionId
  ) {
    const credential = new DefaultAzureCredential();
    resourceManagementClient = new ResourceManagementClient(
      credential,
      subscriptionId
    );
  }
  return resourceManagementClient;
};

let blobServiceClient: BlobServiceClient | undefined;
export const getBlobServiceClient = (accountName: string) => {
  validateEnvironmentVariables();
  if (!blobServiceClient || blobServiceClient.accountName !== accountName) {
    const credential = new DefaultAzureCredential();
    blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credential
    );
  }
  return blobServiceClient;
};
