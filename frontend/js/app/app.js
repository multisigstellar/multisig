
var app = angular.module('multisig', 
                        [ 
                          'ui.router',
                          'angularRandomString',
                          'jsonFormatter',
                          'multisigService'
                          

                        ]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $provide) {

 
	$urlRouterProvider.otherwise('/');

	$stateProvider
    .state('home', {
      url: '/',
      views:{
          
        'pgContainer' : {
          templateUrl: 'frontend/js/app/tx/home.controller.html',
          controller: 'homeController'
        },
            
      },
      data: {
        requireLogin: false
      }
    })
		.state('create', {
			url: '/create',
      views:{
          
        'pgContainer' : {
          templateUrl: 'frontend/js/app/tx/create.controller.html',
      	  controller: 'createController'
      	},
      			
      },
      data: {
        requireLogin: false
      }
		})
    .state('addsigners',{
      url: '/addsigners',
      params: {
        txData: null,
        tx_tag: null,
        tx_xdr: null,
        
      },
      views: {
        'pgContainer': {
          templateUrl: 'frontend/js/app/signers/addsigner.controller.html',
          controller: 'addSignerController'
        }
      },
      data:{
        requireLogin: false
      }
    })    
    .state('tx',{
      url: '/tx/:tx_tag',
      views: {
        'pgContainer': {
          templateUrl: 'frontend/js/app/tx/tx.controller.html',
          controller: 'txController'
        }
      },
      data:{
        requireLogin: false
      }
    })
    .state('sign',{
      url: '/sign/:tx_tag',
      views: {
        'pgContainer': {
          templateUrl: 'frontend/js/app/tx/sign.controller.html',
          controller: 'signController'
        }
      },
      data:{
        requireLogin: false
      }
    });

  $locationProvider.html5Mode(true);
  

});

app.run(function ($rootScope, $state ) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

    $rootScope.siteURL = 'https://multisigstellar.github.io/multisig/';
    
  });

  $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams) {

    window.scrollTo(0, 0);

});


});
