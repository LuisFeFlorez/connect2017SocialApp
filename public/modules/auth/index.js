(function(){
	'use strict';

	angular.module('authService', ['ngRoute'])
    
    .factory('Auth', function($http, $q, $window, AuthToken) {
        
        var authFactory = {};
        
        authFactory.login = function(code) {
            return $http.post('/api/v1/auth', {
                code: code
            })
            .success(function(data) {
                AuthToken.setToken(data);
                return data;
            });
        };
        
        authFactory.logout = function() {
            AuthToken.setToken();
        };
        
        authFactory.isLoggedIn = function() {
            if (AuthToken.getToken())
                return true;
            else
                return false;
        };
        
        return authFactory;
    })
    .factory('AuthToken', function($window) {
        
        var authTokenFactory = {};
        
        authTokenFactory.getToken = function() {
            return $window.localStorage.getItem('token');
        };
        
        authTokenFactory.setToken = function(token) {
            if (token){
                $window.localStorage.setItem('token', token);
            } else {
                $window.localStorage.removeItem('token');
            }
        };
        
        return authTokenFactory;
    })
    .factory('AuthInterceptor', function($q, $window, $location, AuthToken) {
        
        var interceptorFactory = {};
        
        interceptorFactory.request = function(config) {
            
            var token = AuthToken.getToken();
            
            if (token)
                config.headers['x-access-token'] = token;
            
            return config;
        };
        
        interceptorFactory.responseError = function(response) {
            
            console.log("ResponseError", response);
            
            if (response.status == 401) {
                AuthToken.setToken();
                $location.path('/about');
            }
            
            return $q.reject(response);
            
        };
        
        return interceptorFactory;
    });
}());