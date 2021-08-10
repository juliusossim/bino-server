import { responseInfo } from '../../helpers/common';
import { HTTP_CREATED, HTTP_SERVER_ERROR } from '../../helpers/httpCodes';
import db from '../../models';

// eslint-disable-next-line no-unused-vars
const { Farm: FarmEnterprise, BankInformation, ClientsGeoInfo } = db;

export const createFarmer = async (userData, FarmInfo) => {
  const {
    businessName,
    productionPractice,
    farmSize,
    products,
    location,
    address,
    city,
    lga,
    state,
    country,
    metadata,
  } = FarmInfo;

  try {
    // Create Profile
    // Create Farm(s)
    // Create Bank Account Details
    // Return Account information

    const newLocation = {
      type: 'farm',
      profileId: userData.profileId,
      longitude: location.lat,
      latitude: location.lng,
      address,
      city,
      lga,
      state,
      country,
    };

    const newFarmLocation = await ClientsGeoInfo.create(newLocation);

    const newFarmer = await FarmEnterprise.create({
      userId: userData.id,
      profileId: userData.profileId,
      geoInfoId: newFarmLocation.id,
      businessName,
      size: farmSize,
      productionPractice,
      products: JSON.stringify(products),
      metadata: JSON.stringify(metadata),
    });

    const farmInfo = { farmerId: newFarmer.id };

    return responseInfo(HTTP_CREATED, 'success', farmInfo, 'Successful');
  } catch (err) {
    if (err) {
      console.log(err);
      return responseInfo(
        HTTP_SERVER_ERROR,
        'error',
        null,
        'A server error occured!'
      );
    }
  }
};

export const addFarmProjection = async (userData, projectionDetails) => {
  const {
    farmSize,
    projectedCapacity,
    harvestPeriod,
    projectedSupportedYield,
    projectedYield,
    supportNeed,
  } = projectionDetails;

  try {

    const newProjection = {
      profileId: userData.profileId,
      farmSize,
      harvestStart: harvestPeriod.startDate,
      harvestEnd: harvestPeriod.endDate,
      projectedCapacity,
      projectedSupportedYield,
      projectedYield,
      supportNeed,
    };

    await FarmEnterprise.update(newProjection, {
      where: { profileId: userData.profileId },
    });

    const farmInfo = {};

    return responseInfo(HTTP_CREATED, 'success', farmInfo, 'Successful');
  } catch (err) {
    if (err) {
      console.log(err);
      return responseInfo(
        HTTP_SERVER_ERROR,
        'error',
        null,
        'A server error occured!'
      );
    }
  }
};

export const addBankInfo = async (userData, bankInformation) => {
  try {
    // Create Profile
    // Create Farm(s)
    // Create Bank Account Details
    // Return Account information

    const bankInfo = { ...bankInformation, profileId: userData.profileId };

    await BankInformation.create(bankInfo);

    const farmInfo = {};

    return responseInfo(HTTP_CREATED, 'success', farmInfo, 'Successful');
  } catch (err) {
    if (err) {
      console.log(err);
      return responseInfo(
        HTTP_SERVER_ERROR,
        'error',
        null,
        'A server error occured!'
      );
    }
  }
};
