// Multisig Service

var api = angular.module('multisigService', []);

var baseUrl = 'http://localhost:8888/';
api.factory('Multisig', function($http) {

    return {

        
        saveUser : function(userData) {
            console.log(userData);
            return $http({
                method: 'POST',
                url: baseUrl+'saveuser',
                headers: { 'Content-Type' : 'application/x-www-form-urlencoded'},
                data: $.param(userData)
            });
        },

        saveTx : function(txData) {
            console.log(txData);
            return $http({
                method: 'POST',
                url: baseUrl+'savetx',
                headers: { 'Content-Type' : 'application/x-www-form-urlencoded'},
                data: $.param(txData)
            });
        }, 
        signTx : function(txData) {
            console.log(txData);
            return $http({
                method: 'POST',
                url: baseUrl+'signtx',
                headers: { 'Content-Type' : 'application/x-www-form-urlencoded'},
                data: $.param(txData)
            });
        },                
        saveSigners : function(userData) {
            //console.log(userData);
            return $http({
                method: 'POST',
                url: baseUrl+'savesigners',
                headers: { 'Content-Type' : 'application/x-www-form-urlencoded'},
                data: $.param(userData)
            });
        },

        getTx : function(txTag) {
            return $http.get(baseUrl+'gettx/'+txTag);
        },

        submitTx : function(txTag) {
            return $http.get(baseUrl+'submittx/'+txTag);
        },         

        getTxList : function(limit) {
            return $http.get(baseUrl+'gettxlist/'+limit);
        },  

    };

});
