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
			var index = o.works.indexOf(work);
			if(index > -1){
				o.works.splice(index,1);
			}
		});
	};

	o.incrementPriority = function(work){
		return $http.put('/works/'+work._id+'/increment').success(function(data){
			work.priority += 1;
		});
	};

	o.decrementPriority = function(work){
		if(work.priority > 0){
			return $http.put('/works/'+work._id+'/decrement').success(function(data){
				work.priority -= 1;
			});
		}
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
	};
	$scope.incrementPriority = function(work){
		if(work){
			workFactory.incrementPriority(work);
		}
	};
	$scope.decrementPriority = function(work){
		if(work){
			workFactory.decrementPriority(work);
		}
	}
}]);