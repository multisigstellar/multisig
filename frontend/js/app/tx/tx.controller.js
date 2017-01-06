var multisig = angular.module('multisig');
var testNetwork = "https://horizon-testnet.stellar.org";
var liveNetwork = "https://horizon.stellar.org";

var server = new StellarSdk.Server(testNetwork);

multisig.controller('txController', function($scope, $state, $stateParams, $http, $rootScope, Multisig, randomString) {
		
	$scope.txObj = {};
	$scope.txEnvelope = {};
	$scope.txData = {};
	$scope.txError = [];
	$scope.srcAcct = "";
	$scope.responseData = {};
	$scope.signersObj = [{'operationCount' : 1}];
	$scope.searchStatus = 'Searching...';

	$scope.init = function() {
		console.log("sP", $stateParams);
		$scope.txTag = $stateParams.tx_tag;
		

		Multisig.getTx($scope.txTag)
			.success(function(data) {
				console.log(data);
				$scope.txObj = data.content.tx;
				$scope.txEnvelope = new StellarSdk.Transaction($scope.txObj.tx_xdr);
				$scope.txData.tx_id = data.content.tx.id;
			})
			.error(function(data) {
				console.log(data);
				$scope.searchStatus = 'No record found';
			});

	};



	$scope.signTx = function () {
		// change from xdr to tx builder object,
		// get key pair from each seed
		// sign tx with seed
		// change back to xdr
		
		var txBlock = new StellarSdk.Transaction($scope.txObj.tx_xdr);
		console.log("tx txBlock", txBlock);
		
		// Add operations
		$scope.signersObj.forEach(function(ops) {
			console.log("ops: ",ops);

			var keypair = StellarSdk.Keypair.fromSeed(ops.seed);
			console.log("keypair", keypair);
			txBlock.sign(keypair);
			$scope.txData.signer = keypair.accountId();
		});

		console.log("tx txBlock", txBlock);		
		$scope.txEnvelope = txBlock;
		var txString = txBlock.toEnvelope().toXDR().toString("base64");
		console.log("txString", txString);
		$scope.txObj.tx_xdr = txString;
		$scope.txData.tx_xdr = txString;
		// Save to DB incase others need to sign
		
		
		
		Multisig.signTx($scope.txData)
			.success(function(data) {
				console.log(data);
				var params = {
												tx_tag: $scope.txObj.tx_tag
											};
				$state.go('tx', params , {reload: true});
				
	    })
			.error(function(data) {
				console.log(data);
			});

	};

	$scope.submitTx = function () {
		
		var txBlock = new StellarSdk.Transaction($scope.txObj.tx_xdr);
		console.log("tx txBlock", txBlock);
		
		// submit Transaction
		server.submitTransaction(txBlock)
			.then(function(result) {
						console.log('Success! Results:', result);
						Multisig.submitTx($scope.txObj.tx_tag)
							.success(function(data) {
								console.log(data);
								var params = {
																tx_tag: $scope.txObj.tx_tag
															};
								$state.go('tx', params , {reload: true});
								
					    })
							.error(function(data) {
								console.log(data);
							});
	      })
	      .catch(function(error) {
	        console.error('Something went wrong at the end\n', error);
	        
	      });


	};	

	$scope.createAsset = function (assetType, assetCode, assetIssuer) {
		if (assetType == 0) {
			return StellarSdk.Asset.native();
		}else{

			return new StellarSdk.Asset(assetCode, assetIssuer);

		}

	};

	$scope.showMemo = function (memoType) {
		if (memoType === 'none') {
			return false;
		} else{
			return true;
		}
		
	};


	$scope.showOperation = function (opType, formType) {
		if (opType == formType) {
			return true;
		} else{
			return false;
		};
	};

	$scope.showAsset = function (assetType) {
		if (assetType == 4 || assetType == 12) {
			return true;
		} else{
			return false;
		};
	};

	$scope.addSignature = function () {
		var operationNo = $scope.signersObj.length+1;
		var newOps = {'operationCount': operationNo};
		$scope.signersObj.push(newOps);
		
		console.log("Ops: ", $scope.signersObj);
	};	

	$scope.removeOperation = function (index) {
		console.log("index", index);
		console.log("TX Data: ", $scope.txData);
		console.log("Ops: ", $scope.operations);
    $scope.operations.splice(index,1);

	};	

});
