var multisig = angular.module('multisig');
var testNetwork = "https://horizon-testnet.stellar.org";
var liveNetwork = "https://horizon.stellar.org";
StellarSdk.Network.usePublicNetwork();
var server = new StellarSdk.Server(liveNetwork);

multisig.controller('addSignerController', function($scope, $state, $stateParams, $http, $rootScope, Multisig, randomString) {
		
	$scope.signersData = {};
	$scope.userData = {};
	$scope.txError = [];
	$scope.srcAcct = "";
	$scope.responseData = {};
	$scope.signers = [];

	$scope.init = function() {
		console.log("stateParams", $stateParams);
		$scope.txData = $stateParams.txData;
		$scope.txEnvelope = new StellarSdk.Transaction($scope.txData.txString);
		$scope.signers.push({'counter': 1, 'accountId': $scope.txData.srcAcct, 'email': $scope.txData.email });
		console.log("Signers: ", $scope.signers);
	};


	$scope.saveSigners = function () {
		// Save tx and signers in database
		
		Multisig.saveTx($stateParams.txData)
			.success(function(data) {
				console.log(data);
				$scope.signersData.tx_id = data.content.tx.id;
				
				$scope.signersData.signers = $scope.signers;
				Multisig.saveSigners($scope.signersData)
					.success(function(data) {
						console.log(data);
						$state.go('tx', {'tx_tag': $scope.txData.txTag});
						})
					.error(function(data) {
						console.log(data);
					});

	    })
			.error(function(data) {
				console.log(data);
			});
			
	};

	$scope.addEntry = function () {
		var operationNo = $scope.signers.length+1;
		var newOps = {'counter': operationNo};
		$scope.signers.push(newOps);
		console.log("TX Data: ", $scope.txData);
		console.log("Signers: ", $scope.signers);
	};	

	$scope.removeEntry = function (index) {
		console.log("index", index);
		console.log("TX Data: ", $scope.txData);
		console.log("Ops: ", $scope.signers);
    $scope.signers.splice(index,1);

	};	

});
