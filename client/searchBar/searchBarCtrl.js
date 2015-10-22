angular.module('ctu').controller('searchBarCtrl', function($scope, questionService) {

	$scope.getQuestion = getQuestion;

	function getQuestion() {
		questionService.getQuestion().then(function (data) {
			$scope.Questions = data;
		})
	}
});