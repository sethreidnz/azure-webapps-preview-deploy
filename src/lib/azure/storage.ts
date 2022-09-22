import fs from 'fs/promises';
import { getBlobServiceClient } from './client';

export async function uploadFile(
  accountName: string,
  containerName: string,
  filePath: string,
  fileName: string
) {
  const file = await fs.readFile(filePath);
  const stats = await fs.stat(filePath);
  const client = getBlobServiceClient(accountName);
  const containerClient = client.getContainerClient(containerName);
  const blobClient = containerClient.getBlockBlobClient(fileName);
  await blobClient.upload(file, stats.size);
  return blobClient.url;
}
