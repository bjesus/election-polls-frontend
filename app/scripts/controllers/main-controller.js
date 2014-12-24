'use strict';

/**
 * @ngdoc function
 * @name electionPollsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the electionPollsApp
 */
angular.module('electionPollsApp')
  .controller('MainController', function ($scope,pollData,partyData,pollService,$route) {
  	$scope.pollData = pollService.addAveragePoll(pollData);
  	$scope.selectedPoll = $scope.pollData[0];
  	$scope.partyData = partyData

	  $scope.partyName = function(p_id) {
	  	return _.findWhere($scope.partyData, {id: p_id}).name;
	  }; 

	  $scope.partyImage = function(p_id) {
	  	return _.findWhere($scope.partyData, {id: p_id}).image;
	  }; 

	  $scope.navigateToPartyPage = function (party_id) {
      alert(party_id);
    };  	
	});