'use strict';

import { APIContracts as ApiContracts } from 'authorizenet';
import { APIControllers as ApiControllers } from 'authorizenet';
import { apiLoginKey, transactionKey } from '../constants.js';

function updateSplitTenderGroup(callback) {
  var merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(apiLoginKey);
  merchantAuthenticationType.setTransactionKey(transactionKey);

  var updateRequest = new ApiContracts.UpdateSplitTenderGroupRequest();
  updateRequest.setMerchantAuthentication(merchantAuthenticationType);
  updateRequest.setSplitTenderId('115901');
  updateRequest.setSplitTenderStatus(ApiContracts.SplitTenderStatusEnum.VOIDED);

  //pretty print request
  console.log(JSON.stringify(updateRequest.getJSON(), null, 2));

  var ctrl = new ApiControllers.UpdateSplitTenderGroupController(
    updateRequest.getJSON()
  );

  ctrl.execute(function () {
    var apiResponse = ctrl.getResponse();

    var response = new ApiContracts.UpdateSplitTenderGroupResponse(apiResponse);

    //pretty print response
    console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (
        response.getMessages().getResultCode() ==
        ApiContracts.MessageTypeEnum.OK
      ) {
        console.log(
          'Text: ' + response.getMessages().getMessage()[0].getText()
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
  updateSplitTenderGroup(function () {
    console.log('updatedSplitTenderGroup call complete.');
  });
}

const _updateSplitTenderGroup = updateSplitTenderGroup;
export { _updateSplitTenderGroup as updateSplitTenderGroup };
