var app = angular.module("todo", ["ui.router"]);

app.config(['$stateProvider', 
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){
		$stateProvider.
		state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'workController',
			resolve: {
				postPromise: ['workFactory', function(workFactory){
					return workFactory.getAll();
				}]
			}
		});
		$urlRouterProvider.otherwise('home');
	}]);

app.factory("workFactory", ['$http', function($http){
	var o = {
		works : []
	};

	o.getAll = function() {
		return $http.get('/works').success(function(data){
			angular.copy(data, o.works);
		});
	};

	o.createWork = function(work){
		return $http.post('/works', work).success(function(data){
			o.works.push(data);
		});
	};

	o.removeWork = function(work){
		return $http.post('/works/'+work._id+'/remove').success(function(data){
			var index = o.works.indexOf(o.works.find(function(element){
				return element._id === data._id;
			}));
			if(index > -1){
				o.works.splice(index,1);
			}
		});
	}

	return o;
}]);

app.controller("workController",["$scope", "workFactory",function($scope, workFactory){
	$scope.works = workFactory.works;
	$scope.currentWork = "";
	$scope.addWork = function(){
		if(this.currentWork){
			workFactory.createWork({work:this.currentWork});
			$scope.currentWork = "";
		}
	};
	$scope.removeWork = function(work){
		if(work){
			workFactory.removeWork(work);
		}
	}
}]);