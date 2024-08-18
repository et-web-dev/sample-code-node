'use strict';

import { APIContracts as ApiContracts } from 'authorizenet';
import { APIControllers as ApiControllers } from 'authorizenet';
import { getRandomString } from '../utils.js';
import { apiLoginKey, transactionKey } from '../constants.js';

function updateSubscription(subscriptionId, callback) {
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(apiLoginKey);
	merchantAuthenticationType.setTransactionKey(transactionKey);

	var orderType = new ApiContracts.OrderType();
	orderType.setInvoiceNumber(getRandomString('Inv:')); 
	orderType.setDescription(getRandomString('Description'));

	var arbSubscriptionType = new ApiContracts.ARBSubscriptionType();
	arbSubscriptionType.setOrder(orderType);

	var updateRequest = new ApiContracts.ARBUpdateSubscriptionRequest();
	updateRequest.setMerchantAuthentication(merchantAuthenticationType);
	updateRequest.setSubscriptionId(subscriptionId);
	updateRequest.setSubscription(arbSubscriptionType);

	console.log(JSON.stringify(updateRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.ARBUpdateSubscriptionController(updateRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.ARBUpdateSubscriptionResponse(apiResponse);

		console.log(JSON.stringify(response, null, 2));

		if(response != null){
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
				console.log('Message Code : ' + response.getMessages().getMessage()[0].getCode());
				console.log('Message Text : ' + response.getMessages().getMessage()[0].getText());
			}
			else{
				console.log('Result Code: ' + response.getMessages().getResultCode());
				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
			}
		}
		else{
			console.log('Null Response.');
		}
		
		callback(response);
	});
}

if (require.main === module) {
	updateSubscription('4058648', function(){
		console.log('getSubscription call complete.');
	});
}

const _updateSubscription = updateSubscription;
export { _updateSubscription as updateSubscription };