var myNinjaApp = angular.module('myNinjaApp', ['ngRoute']); //in square brackets you can add dependencies

myNinjaApp.config(['$routeProvider', function($routeProvider) {
  // configuration goes here - this is where you would typically set up routes
  $routeProvider
    .when('/', {
      templateUrl: 'views/Home.html',
      controller: 'NinjaController'
    })
    .when('/directory', {
      templateUrl: 'views/ListNinja.html',
      controller: 'NinjaController'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);
// First custom directive: Rule as if name tags is "random" and "ninja" and "testing" -> Name of directive is "randomNinjaTesting"
// E is Element, A is Attribute, C is Class, M is Comment
myNinjaApp.directive('randomNinjaTesting', [function(){
    return {
        restrict: 'E',
        scope: {
            ninjas: '=',
            title: '='
        },
        //template is used to define the html of the directive
        template: '<div ng-transclude></div><br><img ng-src="{{ninjas[random].image}}" style="width:100px;"/>',
        transclude: true, //transclude is used to pass the content of the element to the directive
        // replace: true,
        controller: function($scope){ //controller is used to add some logic to the directive
            $scope.random = Math.floor(Math.random() * 4);
        }
    };
}]);

myNinjaApp.run(function() {
  // initialization code goes here - this is where you would typically set up your root scope
});   

// $scope and $http are services provided by AngularJS to make it easier to work with data and make HTTP requests respectively 
myNinjaApp.controller('NinjaController', ['$scope','$http',function($scope,$http) {
    $scope.message = "Hey, I'm working!";
    
    $scope.addNinja = function() {
        $scope.ninjas.push(
            {
                name: $scope.newNinja.name,
                belt: $scope.newNinja.belt,
                rate: parseInt($scope.newNinja.rate)
            }
        );
        $scope.newNinja.name = "";
        $scope.newNinja.belt = "";
        $scope.newNinja.rate = "";
    };
    $http.get('Data/JSON_Ex.json').then(function(response){
        $scope.ninjas = response.data;
    });

}]);

