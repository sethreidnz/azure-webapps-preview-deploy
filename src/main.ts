import * as core from '@actions/core'
import * as github from '@actions/github'
import {
  previewDeploy,
  RepositoryType,
  cleanupPreviewDeployment
} from './lib/previewDeploy'

enum Inputs {
  GithubToken = 'githubToken',
  SubscriptionId = 'subscriptionId',
  ResourceGroup = 'resourceGroup',
  WebAppName = 'webAppName',
  StorageAccount = 'storageAccount',
  StorageContainer = 'storageContainer',
  DeployPackagePath = 'deployPackagePath',
  Cleanup = 'cleanup'
}

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput(Inputs.GithubToken)
    const subscriptionId = core.getInput(Inputs.SubscriptionId)
    const resourceGroupName = core.getInput(Inputs.ResourceGroup)
    const webAppName = core.getInput(Inputs.WebAppName)
    const storageAccount = core.getInput(Inputs.StorageAccount)
    const storageContainer = core.getInput(Inputs.StorageContainer)
    const deployPackagePath = core.getInput(Inputs.DeployPackagePath)
    const cleanup = core.getInput(Inputs.Cleanup)
    const context = github.context
    const pullRequestId = context.issue.number
    const repository = context.repo.repo
    const owner = context.repo.owner
    const githubEvent = context.eventName
    const action = context.payload.action

    if (githubEvent !== 'pull_request') {
      throw new Error('This action must run in the context of a pull-request.')
    }

    if (cleanup || action === 'closed') {
      core.info(`Cleaning up preview deployment for: \n\n
        subscriptionId=${subscriptionId}
        resourceGroupName=${subscriptionId}
        webAppName=${subscriptionId}
        pullRequestId=${pullRequestId}
      `)
      await cleanupPreviewDeployment({
        subscriptionId,
        resourceGroupName,
        webAppName,
        pullRequestId
      })
    } else {
      core.info(`Creating preview deployment: \n\n
        subscriptionId=${subscriptionId}
        resourceGroupName=${subscriptionId}
        webAppName=${subscriptionId}
        pullRequestId=${pullRequestId}
        deployPackagePath=${deployPackagePath}
        storageAccount=${storageAccount}
        storageContainer=${storageContainer}
      `)
      await previewDeploy({
        subscriptionId,
        resourceGroupName,
        webAppName,
        pullRequestId,
        deployPackagePath,
        repository: {
          accessToken: githubToken,
          type: RepositoryType.Github,
          name: repository,
          owner: owner,
          commentUser: 'github-actions[bot]'
        },
        storageAccount: {
          accountName: storageAccount,
          storageContainer
        }
      })
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
