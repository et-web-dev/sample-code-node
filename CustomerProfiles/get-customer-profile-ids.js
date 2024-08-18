'use strict';

import { APIContracts as ApiContracts } from 'authorizenet';
import { APIControllers as ApiControllers } from 'authorizenet';
import { apiLoginKey, transactionKey } from '../constants.js';

function getCustomerProfileIds(callback) {
  var merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(apiLoginKey);
  merchantAuthenticationType.setTransactionKey(transactionKey);

  var getRequest = new ApiContracts.GetCustomerProfileIdsRequest();
  getRequest.setMerchantAuthentication(merchantAuthenticationType);

  //pretty print request
  //console.log(JSON.stringify(getRequest.getJSON(), null, 2));

  var ctrl = new ApiControllers.GetCustomerProfileIdsController(
    getRequest.getJSON()
  );

  ctrl.execute(function () {
    var apiResponse = ctrl.getResponse();

    var response = new ApiContracts.GetCustomerProfileIdsResponse(apiResponse);

    //pretty print response
    //console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (
        response.getMessages().getResultCode() ==
        ApiContracts.MessageTypeEnum.OK
      ) {
        console.log('List of Customer profile Ids : ');
        var profileIds = response.getIds().getNumericString();
        for (var i = 0; i < profileIds.length; i++) {
          console.log(profileIds[i].toString());
        }
      } else {
        //console.log('Result Code: ' + response.getMessages().getResultCode());
        console.log(
          'Error Code: ' + response.getMessages().getMessage()[0].getCode()
        );
        console.log(
          'Error message: ' + response.getMessages().getMessage()[0].getText()
        );
      }
    } else {
      console.log('Null response received');
    }

    callback(response);
  });
}

if (require.main === module) {
  getCustomerProfileIds(function () {
    console.log('getCustomerProfileIds call complete.');
  });
}

const _getCustomerProfileIds = getCustomerProfileIds;
export { _getCustomerProfileIds as getCustomerProfileIds };
