'use strict';

import { APIContracts as ApiContracts } from 'authorizenet';
import { APIControllers as ApiControllers } from 'authorizenet';
import { apiLoginKey, transactionKey } from '../constants.js';

function updateCustomerProfile(customerProfileId, callback) {
  var merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(apiLoginKey);
  merchantAuthenticationType.setTransactionKey(transactionKey);

  var customerDataForUpdate = new ApiContracts.CustomerProfileExType();
  customerDataForUpdate.setMerchantCustomerId('custId123');
  customerDataForUpdate.setDescription('some description');
  customerDataForUpdate.setEmail('newaddress@example.com');
  customerDataForUpdate.setCustomerProfileId(customerProfileId);

  var updateRequest = new ApiContracts.UpdateCustomerProfileRequest();
  updateRequest.setMerchantAuthentication(merchantAuthenticationType);
  updateRequest.setProfile(customerDataForUpdate);

  //console.log(JSON.stringify(updateRequest.getJSON(), null, 2));

  var ctrl = new ApiControllers.UpdateCustomerProfileController(
    updateRequest.getJSON()
  );

  ctrl.execute(function () {
    var apiResponse = ctrl.getResponse();

    var response = new ApiContracts.UpdateCustomerProfileResponse(apiResponse);

    //pretty print response
    //console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (
        response.getMessages().getResultCode() ==
        ApiContracts.MessageTypeEnum.OK
      ) {
        console.log(
          'Successfully updated a customer profile with id: ' +
            customerProfileId
        );
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
  updateCustomerProfile('1929176981', function () {
    console.log('updateCustomerProfile call complete.');
  });
}

const _updateCustomerProfile = updateCustomerProfile;
export { _updateCustomerProfile as updateCustomerProfile };
