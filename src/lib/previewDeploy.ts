import {uploadFile} from './azure/storage'
import {deleteSlot, deployToSlot} from './azure/webapps'
import {upsertComment} from './github/comments'

export type PreviewDeployParams = {
  subscriptionId: string
  resourceGroupName: string
  webAppName: string
  pullRequestId: string | number
  deployPackagePath: string
  repository: GithubRepositoryConfig
  storageAccount: {
    accountName: string
    storageContainer: string
  }
}
export enum RepositoryType {
  Github = 'Github'
}
export type RepositoryConfig = {
  type: RepositoryType
}
export type GithubRepositoryConfig = RepositoryConfig & {
  accessToken: string
  name: string
  owner: string
  commentUser: string
}
export const previewDeploy = async ({
  subscriptionId,
  resourceGroupName,
  webAppName,
  pullRequestId,
  deployPackagePath,
  repository,
  storageAccount
}: PreviewDeployParams) => {
  const slotName = getSlotName(pullRequestId)
  console.log(
    `Starting preview deployment of pr='${pullRequestId}' to webapp='${webAppName}' slot='${slotName}'.`
  )
  await upsertComment({
    githubToken: repository.accessToken,
    repository: repository.name,
    owner: repository.owner,
    issueNumber: +pullRequestId,
    body: `Deploying latest changes to preview slot.`,
    user: repository.commentUser
  })
  const packageUri = await uploadFile(
    storageAccount.accountName,
    storageAccount.storageContainer,
    deployPackagePath,
    `${pullRequestId}.zip`
  )
  const hostname = await deployToSlot({
    subscriptionId,
    resourceGroupName,
    deploymentName: `preview-deploy-${slotName}`,
    webAppName,
    slotName,
    packageUri
  })
  await upsertComment({
    githubToken: repository.accessToken,
    repository: repository.name,
    owner: repository.owner,
    issueNumber: +pullRequestId,
    body: `Deployed to preview-url: [https://${hostname}](https://${hostname})`,
    user: repository.commentUser
  })
  console.log(
    `Finished preview deployment of pr='${pullRequestId}' to webapp='${webAppName}' slot='${slotName}'.`
  )
  return hostname
}

export const cleanupPreviewDeployment = async ({
  subscriptionId,
  resourceGroupName,
  webAppName,
  pullRequestId
}: {
  subscriptionId: string
  resourceGroupName: string
  webAppName: string
  pullRequestId: string | number
}) => {
  const slotName = getSlotName(pullRequestId)
  console.log(
    `Starting cleanup of preview deployment of pr='${pullRequestId}' to webapp='${webAppName}' slot='${slotName}'.`
  )
  await deleteSlot(subscriptionId, resourceGroupName, webAppName, slotName)

  console.log(
    `Finished cleanup of  preview deployment of pr='${pullRequestId}' to webapp='${webAppName}' slot='${slotName}'.`
  )
}

const getSlotName = (pullRequestId: string | number) => {
  return `pr-${pullRequestId}`
}
