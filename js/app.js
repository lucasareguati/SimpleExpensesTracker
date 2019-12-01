var app = angular.module("expensesApp", ['ngRoute']);

app.config(function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl: 'views/expenses.html',
        controller: 'ExpensesViewController'
    })
    .when('/expenses', {
        templateUrl: 'views/expenses.html',
        controller: 'ExpensesViewController'
    })
    .when('/expenses/new', {
        templateUrl: 'views/expenseForm.html',
        controller: 'ExpenseViewController'
    })
    .when('/expenses/edit/:id', {
        templateUrl: 'views/expenseForm.html',
        controller: 'ExpenseViewController'
    })

    .otherwise({
        redirectTo: '/'
    });
});

app.controller('HomeViewController', ['$scope', function($scope){
    $scope.appTittle = "Expenses controller Tracker";
    }
]);

app.factory('Expenses', function(){
    var service = {};
    service.entries = [
        {id:1, description: 'food' , amount: 10, date:'2014-10-01'},
        {id:2, description: 'tickets', amount:11, date: '2014-03-13' },
        {id:3, description: 'food', amount: 12, date: '2014-09-23'},
        {id:4, description: 'phone credit', amount: 13, date: '2014-3-19' },
        {id:5, description: 'bills', amount: 13, date: '2014-05-14'},
        {id:6, description: 'food', amount: 15, date: '2014-09-14'},
    ];

    service.getNewId = function(){
        if(service.newId){
            service.newId++;
            return service.newId;
        }else{
            var entryMaxId = _.max(service.entries, function(entry){
                return entry.id;
            });
        }
        service.newId = entryMaxId.id + 1;
        return service.newId;
    }

    service.remove = function(entry){
        service.entries = _.reject(service.entries, function(element){return entry.id == element.id});
    }

    service.getById = function(id) {

        return _.find(service.entries, function(entry){
            return entry.id == id;
        })
    }

    service.save = function(entry) {
        var toUpdate = service.getById(entry.id);

        if(toUpdate){
            _.extend(toUpdate, entry);

        }else{
            entry.id = service.getNewId();
            service.entries.push(entry);
        }

    }


    return service;
});

app.controller('ExpensesViewController', ['$scope','Expenses', function($scope, Expenses){

    $scope.expenses = Expenses.entries;
}]);


app.controller('ExpenseViewController', ['$scope', '$routeParams', '$location', 'Expenses', function($scope, $routeParams, $location,Expenses){
    //$scope.someText = 'The world is round. ID: ' + $routeParams.id + 'and the first entry: ' + Expenses.entries[$routeParams.id];

    if(!$routeParams.id) {
        $scope.expense = {date: new Date()};
    
    } else {
        $scope.expense = _.clone(Expenses.getById($routeParams.id));
    }

    $scope.remove = function(expense){
        Expenses.remove(expense);
        
    }

    $scope.save = function(){

        Expenses.save($scope.expense);
        $location.path('/');
    }


}]);