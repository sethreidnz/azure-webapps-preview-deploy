import { createSlot, deleteSlot, getSlot, getWebApp } from './webapps';
import { faker } from '@faker-js/faker';

const mockGetWebApps = jest.fn();
const mockBeginCreateOrUpdateSlotAndWait = jest.fn();
const mockGetSlot = jest.fn();
const mockDeleteSlot = jest.fn();
jest.mock('./client', () => {
  return {
    getWebAppClient: () => ({
      webApps: {
        get: mockGetWebApps,
        beginCreateOrUpdateSlotAndWait: mockBeginCreateOrUpdateSlotAndWait,
        getSlot: mockGetSlot,
        deleteSlot: mockDeleteSlot,
      },
    }),
  };
});

describe('getWebApp()', () => {
  test('should call webapps.get with correct parameters', async () => {
    // arrange
    const subscriptionId = faker.datatype.uuid();
    const resourceGroupName = faker.lorem.slug();
    const webAppName = faker.lorem.slug();

    // act
    await getWebApp(subscriptionId, resourceGroupName, webAppName);

    // assert
    expect(mockGetWebApps).toHaveBeenCalledWith(resourceGroupName, webAppName);
  });

  test('given webApps.get returns a value should return that value', async () => {
    // arrange
    const subscriptionId = faker.datatype.uuid();
    const resourceGroupName = faker.lorem.slug();
    const webAppName = faker.lorem.slug();
    const getResponse = {};
    mockGetWebApps.mockResolvedValue(getResponse);

    // act
    const result = await getWebApp(
      subscriptionId,
      resourceGroupName,
      webAppName
    );

    // assert
    expect(result).toBe(getResponse);
  });

  test('given webApps.get returns and error with status=404 should return undefined', async () => {
    // arrange
    const subscriptionId = faker.datatype.uuid();
    const resourceGroupName = faker.lorem.slug();
    const webAppName = faker.lorem.slug();
    mockGetWebApps.mockRejectedValue({ statusCode: 404 });

    // act
    const result = await getWebApp(
      subscriptionId,
      resourceGroupName,
      webAppName
    );

    // assert
    expect(result).toBeUndefined();
  });

  test('given webApps.get returns and error with status=500 should throw', async () => {
    // arrange
    const subscriptionId = faker.datatype.uuid();
    const resourceGroupName = faker.lorem.slug();
    const webAppName = faker.lorem.slug();
    const error = { statusCode: 500, message: 'some error occured' };
    mockGetWebApps.mockRejectedValue(error);

    // act
    const act = async () =>
      await getWebApp(subscriptionId, resourceGroupName, webAppName);

    // assert
    await expect(act()).rejects.toThrow(
      `Failed to get web app. StatusCode=${error.statusCode} message=${error.message}`
    );
  });
});

describe('createSlot()', () => {
  test('should call webApps.getWebAppClient with correct values', async () => {
    // arrange
    const subscriptionId = faker.datatype.uuid();
    const resourceGroupName = faker.lorem.slug();
    const webAppName = faker.lorem.slug();
    const slotName = faker.lorem.slug();
    const getWebAppResponse = { location: faker.lorem.slug() };
    mockGetWebApps.mockResolvedValue(getWebAppResponse);

    // act
    await createSlot(subscriptionId, resourceGroupName, webAppName, slotName);

    // assert
    expect(mockGetWebApps).toHaveBeenCalledWith(resourceGroupName, webAppName);
  });

  test('should call webApps.beginCreateOrUpdateSlotAndWait with correct values', async () => {
    // arrange
    const subscriptionId = faker.datatype.uuid();
    const resourceGroupName = faker.lorem.slug();
    const webAppName = faker.lorem.slug();
    const slotName = faker.lorem.slug();
    const getWebAppResponse = { location: faker.lorem.slug() };
    mockGetWebApps.mockResolvedValue(getWebAppResponse);

    // act
    await createSlot(subscriptionId, resourceGroupName, webAppName, slotName);

    // assert
    expect(mockBeginCreateOrUpdateSlotAndWait).toHaveBeenCalledWith(
      resourceGroupName,
      webAppName,
      slotName,
      { location: getWebAppResponse.location }
    );
  });

  test('if successful should return the response from webApps.beginCreateOrUpdateSlotAndWait', async () => {
    // arrange
    const subscriptionId = faker.datatype.uuid();
    const resourceGroupName = faker.lorem.slug();
    const webAppName = faker.lorem.slug();
    const slotName = faker.lorem.slug();
    const getWebAppResponse = { location: faker.lorem.slug() };
    mockGetWebApps.mockResolvedValue(getWebAppResponse);
    const createSlotResponse = { location: faker.lorem.slug() };
    mockBeginCreateOrUpdateSlotAndWait.mockResolvedValue(createSlotResponse);

    // act
    const result = await createSlot(
      subscriptionId,
      resourceGroupName,
      webAppName,
      slotName
    );

    // assert
    expect(result).toBe(createSlotResponse);
  });

  test("given web app doesn't exist should throw error", async () => {
    // arrange
    const subscriptionId = faker.datatype.uuid();
    const resourceGroupName = faker.lorem.slug();
    const webAppName = faker.lorem.slug();
    const slotName = faker.lorem.slug();
    mockGetWebApps.mockRejectedValue({ statusCode: 404 });

    // act
    const act = async () =>
      await createSlot(subscriptionId, resourceGroupName, webAppName, slotName);

    // assert
    await expect(act()).rejects.toThrow(
      `Could not find web app. subscriptionId: ${subscriptionId}, resourceGroupName: ${resourceGroupName}, webAppName: ${webAppName}`
    );
  });
});

describe('getSlot()', () => {
  test('given call to client.webApps.getSlot return 404 should return undefined', async () => {
    // arrange
    const subscriptionId = faker.datatype.uuid();
    const resourceGroupName = faker.lorem.slug();
    const webAppName = faker.lorem.slug();
    const slotName = faker.lorem.slug();
    mockGetSlot.mockRejectedValue({ statusCode: 404 });

    // act
    const result = await getSlot(
      subscriptionId,
      resourceGroupName,
      webAppName,
      slotName
    );

    // assert
    expect(result).toBeUndefined();
  });

  test('given call to client.webApps.getSlot fails', async () => {
    // arrange
    const subscriptionId = faker.datatype.uuid();
    const resourceGroupName = faker.lorem.slug();
    const webAppName = faker.lorem.slug();
    const slotName = faker.lorem.slug();
    mockGetSlot.mockRejectedValue({});

    // act
    const act = async () =>
      await getSlot(subscriptionId, resourceGroupName, webAppName, slotName);

    // assert
    await expect(act).rejects.toThrow();
  });
});

describe('deleteSlot()', () => {
  test('given call to client.webApps.deleteSlot succeeds should not throw', async () => {
    // arrange
    const subscriptionId = faker.datatype.uuid();
    const resourceGroupName = faker.lorem.slug();
    const webAppName = faker.lorem.slug();
    const slotName = faker.lorem.slug();
    mockDeleteSlot.mockRejectedValue({});

    // act
    const act = async () =>
      await deleteSlot(subscriptionId, resourceGroupName, webAppName, slotName);

    // assert
    await expect(act).rejects.toThrow();
  });

  test('given call to client.webApps.deleteSlot fails', async () => {
    // arrange
    const subscriptionId = faker.datatype.uuid();
    const resourceGroupName = faker.lorem.slug();
    const webAppName = faker.lorem.slug();
    const slotName = faker.lorem.slug();
    mockDeleteSlot.mockResolvedValue({});
    // act
    const act = async () =>
      await deleteSlot(subscriptionId, resourceGroupName, webAppName, slotName);
    // assert
    expect(act).not.toThrow();
  });
});
