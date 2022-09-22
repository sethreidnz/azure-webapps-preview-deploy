import previewDeployTemplate from './previewDeploy.template.json'
import {getResourceManagementClient, getWebAppClient} from './client'

export const getWebApp = async (
  subscriptionId: string,
  resourceGroupName: string,
  webAppName: string
) => {
  try {
    const client = getWebAppClient(subscriptionId)
    return await client.webApps.get(resourceGroupName, webAppName)
  } catch (error: any) {
    if (error?.statusCode === 404) {
      return undefined
    } else {
      throw new Error(
        `Failed to get web app. StatusCode=${error.statusCode} message=${error.message}`
      )
    }
  }
}

export const startSlot = async (
  subscriptionId: string,
  resourceGroupName: string,
  webAppName: string,
  slotName: string
) => {
  try {
    const client = getWebAppClient(subscriptionId)
    return await client.webApps.startSlot(
      resourceGroupName,
      webAppName,
      slotName
    )
  } catch (error: any) {
    if (error?.statusCode === 404) {
      return undefined
    } else {
      throw new Error(
        `Failed to start web app. StatusCode=${error.statusCode} message=${error.message}`
      )
    }
  }
}

export const stopSlot = async (
  subscriptionId: string,
  resourceGroupName: string,
  webAppName: string,
  slotName: string
) => {
  try {
    const client = getWebAppClient(subscriptionId)
    return await client.webApps.stopSlot(
      resourceGroupName,
      webAppName,
      slotName
    )
  } catch (error: any) {
    if (error?.statusCode === 404) {
      return undefined
    } else {
      throw new Error(
        `Failed to start web app. StatusCode=${error.statusCode} message=${error.message}`
      )
    }
  }
}

export const createSlot = async (
  subscriptionId: string,
  resourceGroupName: string,
  webAppName: string,
  slotName: string
) => {
  const client = getWebAppClient(subscriptionId)
  const site = await getWebApp(subscriptionId, resourceGroupName, webAppName)
  if (!site) {
    throw new Error(
      `Could not find web app. subscriptionId: ${subscriptionId}, resourceGroupName: ${resourceGroupName}, webAppName: ${webAppName}`
    )
  }
  return await client.webApps.beginCreateOrUpdateSlotAndWait(
    resourceGroupName,
    webAppName,
    slotName,
    {
      location: site.location
    }
  )
}

export const getSlot = async (
  subscriptionId: string,
  resourceGroupName: string,
  webAppName: string,
  slotName: string
) => {
  try {
    const client = getWebAppClient(subscriptionId)
    return await client.webApps.getSlot(resourceGroupName, webAppName, slotName)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.statusCode === 404) {
      return undefined
    } else {
      throw new Error(
        `Failed to get web app slot. StatusCode=${error.statusCode} message=${error.message}`
      )
    }
  }
}

export const deleteSlot = async (
  subscriptionId: string,
  resourceGroupName: string,
  webAppName: string,
  slotName: string
) => {
  try {
    const client = getWebAppClient(subscriptionId)
    return await client.webApps.deleteSlot(
      resourceGroupName,
      webAppName,
      slotName
    )
  } catch (error: any) {
    throw new Error(
      `Failed to get delete web app slot. StatusCode=${error.statusCode} message=${error.message}`
    )
  }
}

export const deployToSlot = async (params: {
  subscriptionId: string
  resourceGroupName: string
  deploymentName: string
  webAppName: string
  slotName: string
  packageUri: string
}) => {
  try {
    const {
      subscriptionId,
      resourceGroupName,
      deploymentName,
      webAppName,
      slotName,
      packageUri
    } = params
    const site = await getWebApp(subscriptionId, resourceGroupName, webAppName)
    if (!site) {
      throw new Error(
        `Could not deploy to slot because web app doesn't exist. Params: \n\n ${JSON.stringify(
          params
        )}`
      )
    }
    const client = getResourceManagementClient(subscriptionId)
    await stopSlot(subscriptionId, resourceGroupName, webAppName, slotName)
    const result = await client.deployments.beginCreateOrUpdateAndWait(
      resourceGroupName,
      deploymentName,
      {
        properties: {
          mode: 'Incremental',
          template: previewDeployTemplate,
          parameters: {
            appService_Name: {value: webAppName},
            appService_slot: {value: slotName},
            packageUri: {value: packageUri}
          }
        }
      }
    )
    await startSlot(subscriptionId, resourceGroupName, webAppName, slotName)
    const outputs = result.properties?.outputs as DeployToSlotOutputs
    if (!outputs.hostname?.value) {
      throw Error('Host name not returned by ARM deployment.')
    }
    return outputs.hostname.value
  } catch (error: any) {
    throw new Error(
      `Failed to deploy app package. StatusCode=${error.statusCode} message=${error.message}`
    )
  }
}

type DeployToSlotOutputs = {
  hostname: {
    value: string
  }
}
