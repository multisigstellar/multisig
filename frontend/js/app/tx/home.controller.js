var multisig = angular.module('multisig');
var testNetwork = "https://horizon-testnet.stellar.org";
var liveNetwork = "https://horizon.stellar.org";
StellarSDK.Network.usePublicNetwork();
var server = new StellarSdk.Server(liveNetwork);

multisig.controller('homeController', function($scope, $state, $http, $rootScope, Multisig, randomString) {
		
	$scope.txList = [];
	$scope.userData = {};
	$scope.txError = [];
	$scope.srcAcct = "";
	$scope.responseData = {};
	$scope.operations = [{'operationCount' : 1}];

	$scope.init = function() {
		
		Multisig.getTxList(0)
			.success(function(data) {
				console.log(data);
				$scope.txList = data.content.tx;
				
	    })
			.error(function(data) {
				console.log(data);
			});


	};


	$scope.getTx = function (txTag) {
		$state.go('tx', {tx_tag: txTag});
	};


	$scope.showOperation = function (opType, formType) {
		if (opType == formType) {
			return true;
		} else{
			return false;
		};
	};

});
