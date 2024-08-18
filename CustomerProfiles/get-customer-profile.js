'use strict';

import { APIContracts as ApiContracts } from 'authorizenet';
import { APIControllers as ApiControllers } from 'authorizenet';
import { apiLoginKey, transactionKey } from '../constants.js';

function getCustomerProfile(customerProfileId, callback) {
  var merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(apiLoginKey);
  merchantAuthenticationType.setTransactionKey(transactionKey);

  var getRequest = new ApiContracts.GetCustomerProfileRequest();
  getRequest.setCustomerProfileId(customerProfileId);
  getRequest.setMerchantAuthentication(merchantAuthenticationType);

  //pretty print request
  console.log(JSON.stringify(getRequest.getJSON(), null, 2));

  var ctrl = new ApiControllers.GetCustomerProfileController(
    getRequest.getJSON()
  );

  ctrl.execute(function () {
    var apiResponse = ctrl.getResponse();

    var response = new ApiContracts.GetCustomerProfileResponse(apiResponse);

    //pretty print response
    console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (
        response.getMessages().getResultCode() ==
        ApiContracts.MessageTypeEnum.OK
      ) {
        console.log(
          'Customer profile ID : ' +
            response.getProfile().getCustomerProfileId()
        );
        console.log('Customer Email : ' + response.getProfile().getEmail());
        console.log('Description : ' + response.getProfile().getDescription());
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
  getCustomerProfile('1929176981', function () {
    console.log('getCustomerProfile call complete.');
  });
}

const _getCustomerProfile = getCustomerProfile;
export { _getCustomerProfile as getCustomerProfile };
