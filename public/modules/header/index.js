(function(){
	'use strict';

	angular.module('myApp.Header', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
	  $routeProvider
	  .when('/header', {
	    templateUrl: 'modules/header/views/index.html',
	    controller: 'HeaderController'
	  })
	  ;
	}])
	.controller('HeaderController', HeaderController)
	;

	function HeaderController($scope, $http, $window){
        
        $scope.init = function() {
            console.log("Entro a cont");
	
			var connectionsCloudHostname = 'apps.na.collabserv.com'; // Change this as required

			if ($('#connections-banner').length > 0) {
			  $('head').append(
			    '<link rel="stylesheet" href="//' + connectionsCloudHostname + '/theming/theme/css/3" type="text/css" />' +
			    '<script src="//' + connectionsCloudHostname + '/navbar/banner/partner/connections-banner?oneui=3"><\/script>'
			  );
			}

        };
        
        //Leave this function to set the active tab on the Menu
        $scope.isActive = function (viewLocation) { 
            return $location.path().indexOf(viewLocation) == 0;
        };
        
	}
    
	HeaderController['$inject'] = ['$scope', '$http', '$window'];

}());