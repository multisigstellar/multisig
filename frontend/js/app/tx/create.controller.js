var multisig = angular.module('multisig');
var testNetwork = "https://horizon-testnet.stellar.org";
var liveNetwork = "https://horizon.stellar.org";
StellarSdK.Network.usePublicNetwork();
var server = new StellarSdk.Server(liveNetwork);

multisig.controller('createController', function($scope, $state, $http, $rootScope, Multisig, randomString) {
		
	$scope.txData = {};
	$scope.formError = 0;
	$scope.userData = {};
	$scope.txError = [];
	$scope.srcAcct = "";
	$scope.responseData = {};
	$scope.operations = [{'operationCount' : 1}];
	$scope.regex = '\\d+';

	$scope.init = function() {
		$scope.txData.txTag = randomString(16);
		$scope.txData.txString = "11";
	};

	$scope.getSeqNo = function(acct_id) {
		if (StellarSdk.Keypair.isValidPublicKey(acct_id)) {
			server.loadAccount(acct_id)
			.then(function(acct) {
				
        $scope.txData.seqNo = acct.sequenceNumber();
        $scope.srcAcct = acct;
        $scope.$apply();

        console.log("acct", acct);
        console.log("ACCT", $scope.srcAcct);
        console.log("seqNo", $scope.txData.seqNo);
        
        
      })
      .catch(Error, function(error) {
      
        console.log('An error occurred', error);
        $scope.txError.push(error.message);
        return null;
        
      });
		} else{
			alert("Invalid Account ID");
		}

		

	};

	$scope.buildTx = function () {
		
		
		var txBlock = new StellarSdk.TransactionBuilder($scope.srcAcct);
		console.log("tx txBlock", txBlock);

		// Add operations
		$scope.operations.forEach(function(ops) {
			console.log("ops: ",ops);
			switch(ops.operationType){
				case "0":
					txBlock = txBlock.addOperation(StellarSdk.Operation.createAccount({
			            destination: ops.destAcct,
			            startingBalance: ops.startingBalance.toString(),
			            source: ops.srcAcct | ''
       		}));
					console.log("txBlock in ops0", txBlock);
				break;

				case "1":
					var asset = $scope.createAsset(ops.assetType, ops.assetCode, ops.assetIssuer);
					txBlock = txBlock.addOperation(StellarSdk.Operation.payment({
                            destination: ops.destAcct,
                            asset: asset,
                            amount: ops.amount.toString(),
                            source: ops.srcAcct || ''
                          }));
					console.log("txBlock in ops1", txBlock);
				break;

				case "2":
					var srcAsset = $scope.createAsset(ops.srcAssetType, ops.srcAssetCode, ops.srcAssetIssuer);
					var destAsset = $scope.createAsset(ops.destAssetType, ops.destAssetCode, ops.destAssetIssuer);
					txBlock = txBlock.addOperation(StellarSdk.Operation.pathPayment({
														sendAsset: srcAsset,
														sendMax: ops.maxAmount.toString(),
														destination: ops.destAcct,
														destAsset: destAsset,
                            destAmount: ops.destAmount.toString(),
                            source: ops.srcAcct || ''
                          }));
					console.log("txBlock in ops2", txBlock);
				break;

				case "3":
					var selling = $scope.createAsset(ops.sellAssetType, ops.sellAssetCode, ops.sellAssetIssuer);
					var buying = $scope.createAsset(ops.buyAssetType, ops.buyAssetCode, ops.buyAssetIssuer);
					txBlock = txBlock.addOperation(StellarSdk.Operation.manageOffer({
														selling: selling,
														buying: buying,
														amount: ops.amount.toString(),
														price: ops.price.toString(),
														offerId: ops.offerId || '',
														source: ops.srcAcct || ''
                          }));
					console.log("txBlock in ops3", txBlock);
				break;				
				case "4":
					var selling = $scope.createAsset(ops.sellAssetType, ops.sellAssetCode, ops.sellAssetIssuer);
					var buying = $scope.createAsset(ops.buyAssetType, ops.buyAssetCode, ops.buyAssetIssuer);
					txBlock = txBlock.addOperation(StellarSdk.Operation.createPassiveOffer({
														selling: selling,
														buying: buying,
														amount: ops.amount.toString(),
														price: ops.price.toString(),
														source: ops.srcAcct | ''
                          }));
					console.log("txBlock in ops4", txBlock);
				break;	
				case "5":
					var clearFlags = 0;
					if (ops.clearFlags) {
						if (ops.clearFlags.authReq) {
							clearFlags += ops.clearFlags.authReq;
						}
						if (ops.clearFlags.authRev) {
							clearFlags += ops.clearFlags.authRev;
						}
						if (ops.clearFlags.authIm) {
							clearFlags += ops.clearFlags.authIm;
						}
					};
					var setFlags = 0;
					if (ops.setFlags) {
						if (ops.setFlags.authReq) {
							setFlags += ops.setFlags.authReq;
						}
						if (ops.setFlags.authRev) {
							setFlags += ops.setFlags.authRev;
						}
						if (ops.setFlags.authIm) {
							setFlags += ops.setFlags.authIm;
						}
					};
					
					if (clearFlags > 0) {
						ops.clearFlags = clearFlags;
					}

					if (setFlags > 0) {
						ops.setFlags = setFlags;
					}

					// ops.setFlags = 1;
					console.log("ops", ops);

					var options = {
														inflationDest: ops.inflationDest,
														clearFlags: clearFlags,
														setFlags: setFlags,
														masterWeight: ops.masterWeight,
														lowThreshold: ops.lowThreshold,
														medThreshold: ops.medThreshold,
														highThreshold: ops.highThreshold,
														signer: {pubKey: ops.signerId, weight: ops.weight},
														homeDomain: ops.homeDomain,
														source: ops.srcAcct
                        };
					console.log("ops2", options);
					txBlock = txBlock.addOperation(StellarSdk.Operation.setOptions(ops));
					console.log("txBlock in ops5", txBlock);
				break;							

				case "6":
					var asset = $scope.createAsset(ops.assetType, ops.assetCode, ops.assetIssuer);
					txBlock = txBlock.addOperation(StellarSdk.Operation.changeTrust({
                            asset: asset,
                            limit: ops.limit.toString(),
                            source: ops.srcAcct || ''
                          }));
					console.log("txBlock in ops6", txBlock);
				break;

				case "7":
					
					txBlock = txBlock.addOperation(StellarSdk.Operation.allowTrust({
														trustor: ops.trustor,
                            assetCode: ops.assetCode,
                            authorize: ops.authorize,
                            source: ops.srcAcct || ''
                          }));
					console.log("txBlock in ops7", txBlock);
				break;

				case "8":
					var asset = $scope.createAsset(ops.assetType, ops.assetCode, ops.assetIssuer);
					txBlock = txBlock.addOperation(StellarSdk.Operation.accountMerge({
														destination: ops.destAcct,
                            source: ops.srcAcct || ''
                          }));
					console.log("txBlock in ops8", txBlock);
				break;


				default:
					console.log("txBlock in default", txBlock);
				;

			}
		});

		// Add memo
		switch($scope.txData.memoType)
		{
			case 'text':
				txBlock = txBlock.addMemo(StellarSdk.Memo.text($scope.txData.memo));
			break;
			case 'id':
				txBlock = txBlock.addMemo(StellarSdk.Memo.id($scope.txData.memo));
			break;
			case 'hash':
				txBlock = txBlock.addMemo(StellarSdk.Memo.hash($scope.txData.memo));
			break;
			case 'return':
				txBlock = txBlock.addMemo(StellarSdk.Memo.returnHash($scope.txData.memo));
			break;
			default:;
		}
	
		txString = txBlock.build().toEnvelope().toXDR().toString("base64");
		console.log("txString", txString);

		$scope.userData.email = $scope.txData.email;
		$scope.userData.srcAcct = $scope.txData.srcAcct;
		$scope.txData.txString = txString;

		var params = {			
										txData: $scope.txData,
										tx_tag: $scope.txData.txTag,
										tx_xdr: txString,
										
									};
		$state.go('addsigners', params , {location: false});
		
	

	};

	$scope.createAsset = function (assetType, assetCode, assetIssuer) {
		if (assetType == 0) {
			return StellarSdk.Asset.native();
		}else{

			return new StellarSdk.Asset(assetCode, assetIssuer);

		}

	};

	$scope.isValidKey = function (id) {
		
		if (StellarSdk.Keypair.isValidPublicKey(id)) {
			return true;
		} else{
			$scope.formError = 1;
			return false;
		};
		


		
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

	$scope.addOperation = function () {
		var operationNo = $scope.operations.length+1;
		var newOps = {'operationCount': operationNo};
		$scope.operations.push(newOps);
		console.log("TX Data: ", $scope.txData);
		console.log("Ops: ", $scope.operations);
	};	

	$scope.removeOperation = function (index) {
		console.log("index", index);
		console.log("TX Data: ", $scope.txData);
		console.log("Ops: ", $scope.operations);
    $scope.operations.splice(index,1);

	};	

});
