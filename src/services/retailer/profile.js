import { responseInfo } from '../../helpers/common';
import { HTTP_CREATED, HTTP_SERVER_ERROR } from '../../helpers/httpCodes';
import db from '../../models';

// eslint-disable-next-line no-unused-vars
const { ClientsGeoInfo, RetailEnterprice } = db;

export const createRetailer = async (userData, accountInfo) => {
  const {
    businessName,
    organisationType,
    location,
    address,
    city,
    lga,
    state,
    country,
    metadata,
  } = accountInfo;

  try {
    // Create Profile
    // Create Bank Account Details
    // Return Account information

    const newLocation = {
      type: 'retail-enterprise',
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

    const newRetailer = await RetailEnterprice.create({
      userId: userData.id,
      profileId: userData.profileId,
      geoInfoId: newFarmLocation.id,
      businessName,
      organisationType,
      metadata: JSON.stringify(metadata),
    });

    const retailerInfo = { retailerId: newRetailer.id };

    return responseInfo(HTTP_CREATED, 'success', retailerInfo, 'Successful');
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

export const addRetailProjection = async (userData, projectionDetails) => {
  try {
    await RetailEnterprice.update(
      { metadata: JSON.stringify(projectionDetails) },
      {
        where: { profileId: userData.profileId },
      }
    );

    const Info = {};

    return responseInfo(HTTP_CREATED, 'success', Info, 'Successful');
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
