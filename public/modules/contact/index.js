(function(){
	'use strict';

	angular.module('myApp.Contact', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
        $routeProvider
	    .when('/contact/:user_id', {
	       templateUrl: 'modules/contact/views/index.html',
	       controller: 'ContactController',
        })
        ;
	}])
	.controller('ContactController', ContactController)
    .factory('ContactService', ContactService)
	;
    
    function ContactController($scope, $http, $window, $routeParams, ContactService){
        
        ContactService.getContactBasicInfo($routeParams.user_id)
        .success(function(data){
            console.log('Basic Info: ', data);
            $scope.info = data;
        }).error(function(status){
            console.log('Se presentó un error al iniciar sesión ' + status);
        });
        
        function widgetsController($scope, $route) {
            $scope.$route = $route;
        }
	}
    
    function ContactService($http){
        var contactService = {};
        
        contactService.getContactBasicInfo = function(user_id) {
            return $http.get('/api/v1/activityStream/contact/' + user_id)
            .success(function(data) {
                return data;
            }).error(function(status){
                alert(status);
            });
        };
        
        return contactService;
    }

	ContactController['$inject'] = ['$scope', '$http', '$window', '$routeParams', 'ContactService'];
    ContactService['$inject'] = ['$http'];

}());