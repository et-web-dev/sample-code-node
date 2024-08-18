'use strict';

import { APIContracts as ApiContracts } from 'authorizenet';
import { APIControllers as ApiControllers } from 'authorizenet';
import { apiLoginKey, transactionKey } from '../constants.js';

function getBatchStatistics(batchId, callback) {
  var merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(apiLoginKey);
  merchantAuthenticationType.setTransactionKey(transactionKey);

  var getRequest = new ApiContracts.GetBatchStatisticsRequest();
  getRequest.setMerchantAuthentication(merchantAuthenticationType);
  getRequest.setBatchId(batchId);

  console.log(JSON.stringify(getRequest.getJSON(), null, 2));

  var ctrl = new ApiControllers.GetBatchStatisticsController(
    getRequest.getJSON()
  );

  ctrl.execute(function () {
    var apiResponse = ctrl.getResponse();

    var response = new ApiContracts.GetBatchStatisticsResponse(apiResponse);

    console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (
        response.getMessages().getResultCode() ==
        ApiContracts.MessageTypeEnum.OK
      ) {
        if (response.getBatch() != null) {
          console.log('Batch Id : ' + response.getBatch().getBatchId());
          console.log(
            'Batch Settlement State : ' +
              response.getBatch().getSettlementState()
          );
          console.log(
            'Batch Payment Method : ' + response.getBatch().getPaymentMethod()
          );
          var statistics = response.getBatch().getStatistics().getStatistic();
          for (var i = 0; i < statistics.length; i++) {
            console.log('Account Type : ' + statistics[i].getAccountType());
            console.log('Charge Amount : ' + statistics[i].getChargeAmount());
            console.log('Refund Amount : ' + statistics[i].getRefundAmount());
            console.log('Decline Count : ' + statistics[i].getDeclineCount());
          }
        }

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
  getBatchStatistics('4300033', function () {
    console.log('getBatchStatistics call complete.');
  });
}

const _getBatchStatistics = getBatchStatistics;
export { _getBatchStatistics as getBatchStatistics };
