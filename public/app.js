'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'authService',
    'myApp.view1',
    'myApp.view2',
    'myApp.version',
    'myApp.Stream',
    'myApp.About',
    'myApp.Contact',
    'myApp.Header',
    'btford.markdown',
    'angularMoment'
]).
config(['$locationProvider', '$routeProvider', '$httpProvider', function($locationProvider, $routeProvider, $httpProvider) {
    
    $httpProvider.interceptors.push('AuthInterceptor');
    
    //$locationProvider.hashPrefix('!');

    $routeProvider
    .when('/auth/ibm-connections-cloud/callback', {
        templateUrl: "view1/view1.html",
	    controller: "CallbackCtrl"
    })
    .when('/auth', {
        templateUrl: "view1/view1.html",
        controller: "AuthCtrl"
    })
    .when('/logout', {
        templateUrl: "view1/view1.html",
        controller: "LogoutCtrl"
    })
    .otherwise({
        redirectTo: "/about"
    });

}])
.controller("MainCtrl", ['$window', '$scope', '$location', 'Auth',

    function($window, $scope, $location, Auth) {

    }
                         
])
.controller("AuthCtrl", ['$window',
    function($window) {
        console.log("VA A LOGEAR");
        $window.location.href = 'https://apps.na.collabserv.com/manage/oauth2/authorize?callback_uri=' +
                        encodeURIComponent('https://misocialapp.mybluemix.net/#/auth/ibm-connections-cloud/callback') +
                        '&client_id=<client_id>&response_type=code';
    }
])
.controller("CallbackCtrl", ['$routeParams', '$location', 'Auth',
    function($routeParams, $location, Auth){        
        Auth.login($routeParams.code)
        .success(function(){
            $location.path('/blogs');
        }).error(function(status){
            alert('Se presentó un error al iniciar sesión ' + status);
        });
    }
])
.controller("HeaderCtrl", ['$scope','$routeParams', '$location',
    function($scope, $routeParams, $location){        
        $scope.isActive = function (viewLocation) { 
            return $location.path().indexOf(viewLocation) == 0;
        };
    }
])
.controller("LogoutCtrl", ['$scope','$routeParams', '$location', 'Auth',
    function($scope, $routeParams, $location, Auth){        
        Auth.logout();
        $location.path('/about');
    }
])
.run(function($rootScope, $window, $location, Auth){
    
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        console.log("Cambiando Ruta");
        if (!Auth.isLoggedIn()) {
            $rootScope.isUserLoggedIn = false;
            if ($location.path() != '/auth/ibm-connections-cloud/callback' && $location.path() != '' && $location.path() != '/about') {
                $location.path('/auth');
            } 
        } else {
            $rootScope.isUserLoggedIn = true;
        }
  });
 
  $rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
  });
    
});
