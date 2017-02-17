(function(){
	'use strict';

	angular.module('myApp.About', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
	  $routeProvider
	  .when('/about', {
	    templateUrl: 'modules/about/views/index.html',
	    controller: 'AboutController'
	  })
	  ;
	}])
	.controller('AboutController', AboutController)
	;

	function AboutController($scope, $http, $window){
        
        //Leave this function to set the active tab on the Menu
        $scope.isActive = function (viewLocation) { 
            return $location.path().indexOf(viewLocation) == 0;
        };
        
	}
    
	AboutController['$inject'] = ['$scope', '$http', '$window'];

}());