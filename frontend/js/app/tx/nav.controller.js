var multisig = angular.module('multisig');
var testNetwork = "https://horizon-testnet.stellar.org";
var liveNetwork = "https://horizon.stellar.org";

var server = new StellarSdk.Server(testNetwork);

multisig.controller('navController', function($scope, $state, $stateParams, $http, $rootScope, Multisig, randomString) {
		
	$scope.qs = "";
	
	$scope.init = function() {
		
	};

	$scope.search = function() {
		if ($scope.qs.length > 15) {

			var params = {
										tx_tag: $scope.qs,
									};
		$state.go('tx', params);
		

		} else{
			alert("Invalid Tag");
		}
	};



});