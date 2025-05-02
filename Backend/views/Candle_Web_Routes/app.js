function myFunction() {
    document.getElementById("demo").innerHTML = "Paragraph changed.";
  };
  var app = angular.module('myNinjaApp', []);
app.controller('NinjaController', function($scope) {
    $scope.firstName = "John 2";
    $scope.lastName = "Doe";
});

