'use strict';

import { APIContracts as ApiContracts } from 'authorizenet';
import { APIControllers as ApiControllers } from 'authorizenet';
import { apiLoginKey, transactionKey } from '../constants.js';

function getSubscription(subscriptionId, callback) {
  var merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(apiLoginKey);
  merchantAuthenticationType.setTransactionKey(transactionKey);

  var getRequest = new ApiContracts.ARBGetSubscriptionRequest();
  getRequest.setMerchantAuthentication(merchantAuthenticationType);
  getRequest.setSubscriptionId(subscriptionId);

  console.log(JSON.stringify(getRequest.getJSON(), null, 2));

  var ctrl = new ApiControllers.ARBGetSubscriptionController(
    getRequest.getJSON()
  );

  ctrl.execute(function () {
    var apiResponse = ctrl.getResponse();

    var response = new ApiContracts.ARBGetSubscriptionResponse(apiResponse);

    console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (
        response.getMessages().getResultCode() ==
        ApiContracts.MessageTypeEnum.OK
      ) {
        console.log(
          'Subscription Name : ' + response.getSubscription().getName()
        );
        console.log(
          'Message Code : ' + response.getMessages().getMessage()[0].getCode()
        );
        console.log(
          'Message Text : ' + response.getMessages().getMessage()[0].getText()
        );
      } else {
        console.log('Result Code: ' + response.getMessages().getResultCode());
        console.log(
          'Error Code: ' + response.getMessages().getMessage()[0].getCode()
        );
        console.log(
          'Error message: ' + response.getMessages().getMessage()[0].getText()
        );
      }
    } else {
      console.log('Null Response.');
    }

    callback(response);
  });
}

if (require.main === module) {
  getSubscription('4058648', function () {
    console.log('getSubscription call complete.');
  });
}

const _getSubscription = getSubscription;
export { _getSubscription as getSubscription };
