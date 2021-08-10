import { v4 } from 'uuid';
import { responseInfo } from '../../helpers/common';
import {
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_OK,
  HTTP_SERVER_ERROR,
} from '../../helpers/httpCodes';
import db from '../../models';

// eslint-disable-next-line no-unused-vars
const {
  Farm: FarmEnterprise,
  FarmerOffer,
  CollectionLog,
  CollectionCenter,
  ClientsGeoInfo,
} = db;

export const generateCollectionRequest = async (userData, requestData) => {
  const { products, supplyDate } = requestData;

  try {
    const farmer = await FarmEnterprise.findOne({
      where: { profileId: userData.profileId },
    });

    if (!farmer)
      return responseInfo(
        HTTP_BAD_REQUEST,
        'error',
        null,
        'Please create your farm profile before you can send a collection request'
      );

    const offerDetails = {
      refCode: v4(),
      farmerId: farmer.id,
      supplyDate: supplyDate,
      collectionCenterId: 1,
      status: 'PENDING',
    };

    const offer = await FarmerOffer.create(offerDetails);

    const proposedProducts = products.map((product) => {
      return {
        offerId: offer.id,
        productId: product.productId,
        quantitySupplied: product.quantity,
      };
    });

    await CollectionLog.bulkCreate(proposedProducts);

    return responseInfo(
      HTTP_CREATED,
      'success',
      null,
      'We have recieved your offer! We will get back to you shorty.'
    );
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

export const getFarmersCollectionRequests = async (userData) => {
  try {
    const requests = await FarmerOffer.findAll({
      where: {
        farmerId: userData.profileId,
      },
      include: [
        {
          model: CollectionLog,
          as: 'products',
          attributes: ['id', 'productId', 'quantitySupplied'],
        },
        {
          model: CollectionCenter,
          as: 'collectionCenter',
        },
      ],
    });

    return responseInfo(HTTP_OK, 'success', requests);
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
