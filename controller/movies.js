/**
* Initialize an Angular app.
*/
var myApp = angular.module('movies-search');

// Remaining todo. Create a service. Put all REST Calls here.
// Call this methods from controller to get Movies.
// var movieServices = angular.services( , function())
myApp.service('movies-search-REST', ['$http', function($http) {

    // Search Movies Database for given search term.
    this.search = function (searchTerm, successCallBack, errorCallback) {
        $http.get('http://api-public.guidebox.com/v2/search?type=movie&field=title&query='+searchTerm+'&api_key=8341b6a997ff697ff06785ecc82069922f4f32d8').then(successCallBack, errorCallback);
    };
}]);

/**
* Controller for Movies Search Module.
*/
myApp.controller('MoviesController',['$scope', '$rootScope','$http','$location','$routeParams', '$timeout', 'movies-search-REST', function($scope,$rootScope,$http,$location,$routeParams,$timeout,moviesSearchREST){

    // Not Found variable to keep a track if none movies matched or found.
    $rootScope.not_found = false;

    // Call for get collection of movies.
    $scope.getMovies = function(){

        $http.get('http://api-public.guidebox.com/v2/movies/?limit=96&api_key=8341b6a997ff697ff06785ecc82069922f4f32d8').then(successCallback, errorCallback);

        function successCallback(response){
            //success code
            $rootScope.movies=response.data;
            console.log($scope.movies);
        }
        function errorCallback(error){
            //error code
            throw error;
        }
    };

    // Call for get a single selected movie.
    $scope.getMovie = function(){
      var id =$routeParams.id;

      $http.get('http://api-public.guidebox.com/v2/movies/'+id+'?api_key=8341b6a997ff697ff06785ecc82069922f4f32d8').then(successCallback, errorCallback);
        
        function successCallback(response){
    		//success code
           $rootScope.movie=response.data;
           console.log($scope.movie);
        }
        
        function errorCallback(error){
        	//error code
        	throw error;
        }

    };


    // Call for search method.
    $scope.search = function(searchterm) {
        if(searchterm){
            moviesSearchREST.search($scope.searchterm, moviesSearchSuccessCallback, moviesSearchErrorCallback);
        }
        else
        {
            $scope.getMovies();
        }
    };
    
    var moviesSearchSuccessCallback = function moviesSearchSuccessCallback(response){

        // console.log('Search Result::', response.data);
        if(response.data.results === 0) {
            $rootScope.movies = response.data;
        } else {
            var result = [];
            angular.forEach(response.data.results, function(item){
                console.log("Inside foreach.");
                if(item.title.toLowerCase().indexOf($scope.searchterm.toLowerCase()) !== -1){
                    console.log("Match performed.");
                    result.push(item);
                }
            });
            $rootScope.movies.results=result;
        }
    };

    var moviesSearchErrorCallback = function moviesSearchErrorCallback(error){
        //error code
        throw error;
    };
}]);