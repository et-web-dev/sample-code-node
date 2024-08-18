'use strict';

import { APIContracts as ApiContracts } from 'authorizenet';
import { APIControllers as ApiControllers } from 'authorizenet';
import { getRandomString } from '../utils.js';
import { apiLoginKey, transactionKey } from '../constants.js';

function createCustomerProfile(callback) {

	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(apiLoginKey);
	merchantAuthenticationType.setTransactionKey(transactionKey);

	//var creditCard = new ApiContracts.CreditCardType();
	//creditCard.setCardNumber('4242424242424242');
	//creditCard.setExpirationDate('0835');

    var opaqueData = new ApiContracts.OpaqueDataType();
    opaqueData.setDataDescriptor('COMMON.ACCEPT.INAPP.PAYMENT');
	opaqueData.setDataValue('9471473703523049405001');

	var paymentType = new ApiContracts.PaymentType();
	paymentType.setOpaqueData(opaqueData);

	var customerPaymentProfileType = new ApiContracts.CustomerPaymentProfileType();
	customerPaymentProfileType.setCustomerType(ApiContracts.CustomerTypeEnum.INDIVIDUAL);
	customerPaymentProfileType.setPayment(paymentType);

	var paymentProfilesList = [];
	paymentProfilesList.push(customerPaymentProfileType);

	var customerProfileType = new ApiContracts.CustomerProfileType();
	customerProfileType.setMerchantCustomerId('M_' + getRandomString('cust'));
	customerProfileType.setDescription('Profile description here');
	customerProfileType.setEmail(getRandomString('cust')+'@anet.net');
	customerProfileType.setPaymentProfiles(paymentProfilesList);

	var createRequest = new ApiContracts.CreateCustomerProfileRequest();
	createRequest.setProfile(customerProfileType);
	createRequest.setValidationMode(ApiContracts.ValidationModeEnum.TESTMODE);
	createRequest.setMerchantAuthentication(merchantAuthenticationType);

	//pretty print request
	//console.log(JSON.stringify(createRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.CreateCustomerProfileController(createRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.CreateCustomerProfileResponse(apiResponse);

		//pretty print response
		//console.log(JSON.stringify(response, null, 2));

		if(response != null) 
		{
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK)
			{
				console.log('Successfully created a customer profile with id: ' + response.getCustomerProfileId());
			}
			else
			{
				console.log('Result Code: ' + response.getMessages().getResultCode());
				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
			}
		}
		else
		{
			console.log('Null response received');
		}

		callback(response);
	});
}

if (require.main === module) {
	createCustomerProfile(function(){
		console.log('createCustomerProfile call complete.');
	});
}

const _createCustomerProfile = createCustomerProfile;
export { _createCustomerProfile as createCustomerProfile };