'use strict';

import { APIContracts as ApiContracts } from 'authorizenet';
import { APIControllers as ApiControllers } from 'authorizenet';
import { Constants as SDKConstants } from 'authorizenet';
import utils from '../utils.js';
import { apiLoginKey, transactionKey } from '../constants.js';

function approveOrDeclineHeldTransaction(refTransId, callback) {
  var merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(apiLoginKey);
  merchantAuthenticationType.setTransactionKey(transactionKey);

  var transactionRequestType = new ApiContracts.HeldTransactionRequestType();
  transactionRequestType.setAction(ApiContracts.AfdsTransactionEnum.APPROVE);
  transactionRequestType.setRefTransId(refTransId);

  var updateRequest = new ApiContracts.UpdateHeldTransactionRequest();
  updateRequest.setMerchantAuthentication(merchantAuthenticationType);
  updateRequest.setHeldTransactionRequest(transactionRequestType);

  //pretty print request
  console.log(JSON.stringify(updateRequest.getJSON(), null, 2));

  var ctrl = new ApiControllers.UpdateHeldTransactionController(
    updateRequest.getJSON()
  );
  //Defaults to sandbox
  //ctrl.setEnvironment(SDKConstants.endpoint.production);

  ctrl.execute(function () {
    var apiResponse = ctrl.getResponse();

    var response = new ApiContracts.UpdateHeldTransactionResponse(apiResponse);

    //pretty print response
    console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (
        response.getMessages().getResultCode() ==
        ApiContracts.MessageTypeEnum.OK
      ) {
        if (response.getTransactionResponse().getMessages() != null) {
          console.log(
            'Successfully updated transaction with Transaction ID: ' +
              response.getTransactionResponse().getTransId()
          );
          console.log(
            'Response Code: ' +
              response.getTransactionResponse().getResponseCode()
          );
          console.log(
            'Message Code: ' +
              response
                .getTransactionResponse()
                .getMessages()
                .getMessage()[0]
                .getCode()
          );
          console.log(
            'Description: ' +
              response
                .getTransactionResponse()
                .getMessages()
                .getMessage()[0]
                .getDescription()
          );
        } else {
          console.log('Failed Transaction.');
          if (response.getTransactionResponse().getErrors() != null) {
            console.log(
              'Error Code: ' +
                response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorCode()
            );
            console.log(
              'Error message: ' +
                response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorText()
            );
          }
        }
      } else {
        console.log('Failed Transaction. ');
        if (
          response.getTransactionResponse() != null &&
          response.getTransactionResponse().getErrors() != null
        ) {
          console.log(
            'Error Code: ' +
              response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorCode()
          );
          console.log(
            'Error message: ' +
              response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorText()
          );
        } else {
          console.log(
            'Error Code: ' + response.getMessages().getMessage()[0].getCode()
          );
          console.log(
            'Error message: ' + response.getMessages().getMessage()[0].getText()
          );
        }
      }
    } else {
      console.log('Null Response.');
    }

    callback(response);
  });
}

if (require.main === module) {
  updateHeldTransaction('60012148643', function () {
    console.log('updateHeldTransaction call complete.');
  });
}

export const updateHeldTransaction = updateHeldTransaction;
