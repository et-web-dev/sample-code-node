'use strict';

import { APIContracts as ApiContracts } from 'authorizenet';
import { assert } from 'chai';

import { authorizeCreditCard as _authorizeCreditCard, chargeCreditCard as _chargeCreditCard, capturePreviouslyAuthorizedAmount as _capturePreviouslyAuthorizedAmount, captureFundsAuthorizedThroughAnotherChannel as _captureFundsAuthorizedThroughAnotherChannel, refundTransaction as _refundTransaction, voidTransaction as _voidTransaction, updateSplitTenderGroup as _updateSplitTenderGroup, debitBankAccount as _debitBankAccount, creditBankAccount as _creditBankAccount, chargeCustomerProfile as _chargeCustomerProfile, chargeTokenizedCreditCard as _chargeTokenizedCreditCard } from './PaymentTransactions';
import { createSubscription as _createSubscription, cancelSubscription as _cancelSubscription, createSubscriptionFromCustomerProfile as _createSubscriptionFromCustomerProfile, getListOfSubscriptions as _getListOfSubscriptions, getSubscriptionStatus as _getSubscriptionStatus, getSubscription as _getSubscription, updateSubscription as _updateSubscription } from './RecurringBilling';
import { getBatchStatistics as _getBatchStatistics, getSettledBatchList as _getSettledBatchList, getTransactionDetails as _getTransactionDetails, getTransactionList as _getTransactionList, getTransactionListForCustomer as _getTransactionListForCustomer, getUnsettledTransactionList as _getUnsettledTransactionList } from './TransactionReporting';
import { createVisaSrcTransaction as _createVisaSrcTransaction, decryptVisaSrcData as _decryptVisaSrcData } from './VisaCheckout';
import { authorizationOnly as _authorizationOnly, authorizationAndCapture as _authorizationAndCapture, authorizationOnlyContinued as _authorizationOnlyContinued, authorizationAndCaptureContinued as _authorizationAndCaptureContinued, priorAuthorizationCapture as _priorAuthorizationCapture, paypalVoid as _paypalVoid, getDetails as _getDetails, credit as _credit } from './PayPalExpressCheckout';
//var ApplePayTransactionsModule = require('./ApplePayTransactions');
import { createCustomerProfile as _createCustomerProfile, createCustomerPaymentProfile as _createCustomerPaymentProfile, getCustomerProfile as _getCustomerProfile, createCustomerProfileFromTransaction as _createCustomerProfileFromTransaction, getCustomerPaymentProfile as _getCustomerPaymentProfile, getCustomerPaymentProfileList as _getCustomerPaymentProfileList, createCustomerShippingAddress as _createCustomerShippingAddress, deleteCustomerPaymentProfile as _deleteCustomerPaymentProfile, deleteCustomerProfile as _deleteCustomerProfile, deleteCustomerShippingAddress as _deleteCustomerShippingAddress, getCustomerProfileIds as _getCustomerProfileIds, getCustomerShippingAddress as _getCustomerShippingAddress, getHostedProfilePage as _getHostedProfilePage, updateCustomerPaymentProfile as _updateCustomerPaymentProfile, updateCustomerProfile as _updateCustomerProfile, updateCustomerShippingAddress as _updateCustomerShippingAddress, validateCustomerPaymentProfile as _validateCustomerPaymentProfile } from './CustomerProfiles';
var filterTestMethod = process.argv[2]

class TestRunner {
	validateResponse(response){
		if(response == null){
			return false;
		}

		if(response.getMessages().getResultCode() != ApiContracts.MessageTypeEnum.OK){
			return false;
		}

		return true;
	}

	authorizeCreditCard(validateFunctionCallback){
		_authorizeCreditCard(validateFunctionCallback);
	}

	chargeCreditCard(validateFunctionCallback){
		_chargeCreditCard(validateFunctionCallback);
	}

	capturePreviouslyAuthorizedAmount(validateFunctionCallback){
		_authorizeCreditCard(function(response){
			_capturePreviouslyAuthorizedAmount(response.getTransactionResponse().getTransId(), 
					validateFunctionCallback);
		});
	}

	captureFundsAuthorizedThroughAnotherChannel(validateFunctionCallback){
		_captureFundsAuthorizedThroughAnotherChannel(validateFunctionCallback);
	}

	refundTransaction(validateFunctionCallback){
		_authorizeCreditCard(function(response){
			_capturePreviouslyAuthorizedAmount(response.getTransactionResponse().getTransId(),
				function(captureResponse){
					_refundTransaction(captureResponse.getTransactionResponse().getTransId(), validateFunctionCallback);
				});
		});
	}

	voidTransaction(validateFunctionCallback){
		_authorizeCreditCard(function(response){
			_voidTransaction(response.getTransactionResponse().getTransId(), validateFunctionCallback);
		});
	}

	updateSplitTenderGroup(validateFunctionCallback){
		_updateSplitTenderGroup(validateFunctionCallback);
	}

	debitBankAccount(validateFunctionCallback){
		_debitBankAccount(validateFunctionCallback);
	}

	creditBankAccount(validateFunctionCallback){
		_debitBankAccount(function(response){
			_creditBankAccount(response.getTransactionResponse().getTransId(), validateFunctionCallback);
		});
	}

	chargeCustomerProfile(validateFunctionCallback){
		_createCustomerProfile(function(response){
			_createCustomerPaymentProfile(response.getCustomerProfileId(), function(paymentProfileResponse){
				_chargeCustomerProfile(response.getCustomerProfileId(), paymentProfileResponse.getCustomerPaymentProfileId(), validateFunctionCallback);
			});
		});
	}

	chargeTokenizedCreditCard(validateFunctionCallback){
		_chargeTokenizedCreditCard(validateFunctionCallback);
	}

	cancelSubscription(validateFunctionCallback){
		_createSubscription(function(response){
			_cancelSubscription(response.getSubscriptionId(), validateFunctionCallback);
		});
	}

	createSubscriptionFromCustomerProfile(validateFunctionCallback){
		/* CustomerProfilesModule.createCustomerProfile(function(response){
			CustomerProfilesModule.createCustomerPaymentProfile(response.getCustomerProfileId(), function(paymentProfileResponse){
				CustomerProfilesModule.createCustomerShippingAddress(response.getCustomerProfileId(), function(shippingResponse){
					RecurringBillingModule.createSubscriptionFromCustomerProfile(response.getCustomerProfileId(), paymentProfileResponse.getCustomerPaymentProfileId(), shippingResponse.getCustomerAddressId(), validateFunctionCallback);
				});
			});
		}); */
		
		_getCustomerProfile("1929176981", function(profileResponse) {
			_createSubscriptionFromCustomerProfile(profileResponse.profile.customerProfileId, profileResponse.profile.paymentProfiles[0].customerPaymentProfileId, profileResponse.profile.shipToList[0].customerAddressId, validateFunctionCallback);
		});
		
	}

	createSubscription(validateFunctionCallback){
		_createSubscription(validateFunctionCallback);
	}

	getListOfSubscriptions(validateFunctionCallback){
		_getListOfSubscriptions(validateFunctionCallback);
	}

	getSubscriptionStatus(validateFunctionCallback){
		_createSubscription(function(response){
			_getSubscriptionStatus(response.getSubscriptionId(), validateFunctionCallback);
		});
	}

	getSubscription(validateFunctionCallback){
		_createSubscription(function(response){
			_getSubscription(response.getSubscriptionId(), validateFunctionCallback);
		});
	}

	updateSubscription(validateFunctionCallback){
		_createSubscription(function(response){
			_updateSubscription(response.getSubscriptionId(), validateFunctionCallback);
		});
	}

	getBatchStatistics(validateFunctionCallback){
		_getBatchStatistics('4594221', validateFunctionCallback);
	}

	getSettledBatchList(validateFunctionCallback){
		_getSettledBatchList(validateFunctionCallback);
	}

	getTransactionDetails(validateFunctionCallback){
		_authorizeCreditCard(function(response){
			_getTransactionDetails(response.getTransactionResponse().getTransId(), validateFunctionCallback);
		});
	}

	getTransactionList(validateFunctionCallback){
		_getTransactionList('4594221', validateFunctionCallback);
	}
	
	getTransactionListForCustomer(validateFunctionCallback){
		_getTransactionListForCustomer('1811474252', validateFunctionCallback);
		
	}

	getUnsettledTransactionList(validateFunctionCallback){
		_getUnsettledTransactionList(validateFunctionCallback);
	}

	createVisaSrcTransaction(validateFunctionCallback){
		_createVisaSrcTransaction(validateFunctionCallback);
	}

	decryptVisaSrcData(validateFunctionCallback){
		_decryptVisaSrcData(validateFunctionCallback);
	}

	authorizationOnly(validateFunctionCallback){
		_authorizationOnly(validateFunctionCallback);
	}

	authorizationAndCapture(validateFunctionCallback){
		_authorizationAndCapture(validateFunctionCallback);
	}

	authorizationOnlyContinued(validateFunctionCallback){
		_authorizationOnly(function(response){
			_authorizationOnlyContinued(response.getTransactionResponse().getTransId(), validateFunctionCallback);
		});
	}

	authorizationAndCaptureContinued(validateFunctionCallback){
		_authorizationAndCapture(function(response){
			_authorizationAndCaptureContinued(response.getTransactionResponse().getTransId(), validateFunctionCallback);
		});
	}

	priorAuthorizationCapture(validateFunctionCallback){
		_authorizationAndCapture(function(response){
			_priorAuthorizationCapture(response.getTransactionResponse().getTransId(), validateFunctionCallback);
		});
	}

	paypalVoid(validateFunctionCallback){
		_authorizationAndCapture(function(response){
			_paypalVoid(response.getTransactionResponse().getTransId(), validateFunctionCallback);
		});
	}

	getDetails(validateFunctionCallback){
		_authorizationAndCapture(function(response){
			_getDetails(response.getTransactionResponse().getTransId(), validateFunctionCallback);
		});
	}

	credit(validateFunctionCallback){
		_authorizationAndCapture(function(response){
			_credit(response.getTransactionResponse().getTransId(), validateFunctionCallback);
		});
	}

	createApplePayTransaction(validateFunctionCallback){
		ApplePayTransactionsModule.createApplePayTransaction(validateFunctionCallback);
	}

	createCustomerProfile(validateFunctionCallback){
		_createCustomerProfile(validateFunctionCallback);
	}

	createCustomerPaymentProfile(validateFunctionCallback){
		_createCustomerProfile(function(response){
			_createCustomerPaymentProfile(response.getCustomerProfileId(), validateFunctionCallback);
		});
	}

	createCustomerProfileFromTransaction(validateFunctionCallback){
		_authorizeCreditCard(function(response){
			_createCustomerProfileFromTransaction(response.getTransactionResponse().getTransId(), validateFunctionCallback);
		});
	}

	getCustomerProfile(validateFunctionCallback){
		_createCustomerProfile(function(response){
			_getCustomerProfile(response.getCustomerProfileId(), validateFunctionCallback);
		});
	}

	getCustomerPaymentProfile(validateFunctionCallback){
		_createCustomerProfile(function(response){
			_createCustomerPaymentProfile(response.getCustomerProfileId(), function(paymentProfileResponse){
				_getCustomerPaymentProfile(response.getCustomerProfileId(), paymentProfileResponse.getCustomerPaymentProfileId(), validateFunctionCallback);
			});
		});
	}

	getCustomerPaymentProfileList(validateFunctionCallback){
		_getCustomerPaymentProfileList(validateFunctionCallback);
	}
	
	createCustomerShippingAddress(validateFunctionCallback){
		_createCustomerProfile(function(response){
			_createCustomerShippingAddress(response.getCustomerProfileId(), validateFunctionCallback);
		});
	}

	deleteCustomerPaymentProfile(validateFunctionCallback){
		_createCustomerProfile(function(response){
			_createCustomerPaymentProfile(response.getCustomerProfileId(), function(paymentProfileResponse){
				_deleteCustomerPaymentProfile(response.getCustomerProfileId(), paymentProfileResponse.getCustomerPaymentProfileId(), validateFunctionCallback);
			});
		});
	}

	deleteCustomerProfile(validateFunctionCallback){
		_createCustomerProfile(function(response){
			_deleteCustomerProfile(response.getCustomerProfileId(), validateFunctionCallback);
		});
	}

	deleteCustomerShippingAddress(validateFunctionCallback){
		_createCustomerProfile(function(response){
			_createCustomerShippingAddress(response.getCustomerProfileId(), function(shippingResponse){
				_deleteCustomerShippingAddress(response.getCustomerProfileId(), shippingResponse.getCustomerAddressId(), validateFunctionCallback);
			});
		});
	}

	getCustomerProfileIds(validateFunctionCallback){
		_getCustomerProfileIds(validateFunctionCallback);
	}

	getCustomerShippingAddress(validateFunctionCallback){
		_createCustomerProfile(function(response){
			_createCustomerShippingAddress(response.getCustomerProfileId(), function(shippingResponse){
				_getCustomerShippingAddress(response.getCustomerProfileId(), shippingResponse.getCustomerAddressId(), validateFunctionCallback);
			});
		});
	}

	getHostedProfilePage(validateFunctionCallback){
		_createCustomerProfile(function(response){
			_getHostedProfilePage(response.getCustomerProfileId(), validateFunctionCallback);
		});
	}

	updateCustomerPaymentProfile(validateFunctionCallback){
		_createCustomerProfile(function(response){
			_createCustomerPaymentProfile(response.getCustomerProfileId(), function(paymentProfileResponse){
				_updateCustomerPaymentProfile(response.getCustomerProfileId(), paymentProfileResponse.getCustomerPaymentProfileId(), validateFunctionCallback);
			});
		});
	}

	updateCustomerProfile(validateFunctionCallback){
		_createCustomerProfile(function(response){
			_updateCustomerProfile(response.getCustomerProfileId(), validateFunctionCallback);
		});
	}

	updateCustomerShippingAddress(validateFunctionCallback){
		_createCustomerProfile(function(response){
			_createCustomerShippingAddress(response.getCustomerProfileId(), function(shippingResponse){
				_updateCustomerShippingAddress(response.getCustomerProfileId(), shippingResponse.getCustomerAddressId(), validateFunctionCallback);
			});
		});
	}

	validateCustomerPaymentProfile(validateFunctionCallback){
		_createCustomerProfile(function(response){
			_createCustomerPaymentProfile(response.getCustomerProfileId(), function(paymentProfileResponse){
				_validateCustomerPaymentProfile(response.getCustomerProfileId(), paymentProfileResponse.getCustomerPaymentProfileId(), validateFunctionCallback);
			});
		});
	}

	callTestMethod(testMethodName, validateFunctionCallback){
		return this[testMethodName](validateFunctionCallback);
	}

	testAllSamples(){
		var lineReader = require('readline').createInterface({
			input: require('fs').createReadStream('./list_of_sample_codes.txt')
		});

		var testRunnerObject = this;

		lineReader.on('line', function (line) {
			var sample = line.split(',');
			var apiName = sample[0];
			var shouldApiRun = sample[1].trim()[0];

			if(shouldApiRun == '1'){
				if (filterTestMethod && apiName !== filterTestMethod) return
				console.log('\n************************ Running : ' + apiName + ' ************************\n');
				testRunnerObject.callTestMethod(apiName, function(response) {
					console.log('\n************************ Testing : ' + apiName + ' ************************\n');
					assert.isTrue(testRunnerObject.validateResponse(response));
					/*
					if(!testRunnerObject.validateResponse(response)){
						console.log('Error in running ' + apiName + '. Stopped test runner.');
						return;
					}
					*/
				});
				
				console.log('\n************************ Ending : ' + apiName + ' ************************\n');
			}
		});
	}
}

var testRunner  = new TestRunner();
testRunner.testAllSamples();
