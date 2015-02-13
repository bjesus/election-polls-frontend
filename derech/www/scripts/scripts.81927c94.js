"use strict";angular.module("electionPollsApp",["ngResource","ngRoute","restangular","d3"]).factory("superCache",["$cacheFactory",function(a){return a("super-cache")}]).factory("pollView",function(){return{view:null}}).config(["$routeProvider","RestangularProvider",function(a,b){a.when("/",{templateUrl:"views/splash.html",controller:"SplashController",resolve:{information:["Restangular",function(a){return a.oneUrl("polls-summary.json","http://mail.v15.org.il/storage/polls-summary.json").get().then(function(a){return a},function(){return[]})}],pollData:["Restangular",function(a){return a.all("polls.json").getList().then(function(a){return a},function(){return[]})}],partyData:["Restangular",function(a){return a.all("parties.json").getList().then(function(a){return a},function(){return[]})}]}}).when("/parties",{templateUrl:"views/main.html",controller:"MainController",resolve:{pollData:["Restangular",function(a){return a.all("polls.json").getList().then(function(a){return a},function(){return[]})}],partyData:["Restangular",function(a){return a.all("parties.json").getList().then(function(a){return a},function(){return[]})}]}}).when("/about",{templateUrl:"views/about.html"}).when("/parties/:id",{templateUrl:"views/party.html",controller:"PartyController",resolve:{partyResults:["Restangular","$route",function(a,b){return a.service("parties").one(b.current.params.id+".json").get().then(function(a){return a},function(){return[]})}]}}).otherwise({redirectTo:"/"}),b.setBaseUrl("https://v15electionpolls.herokuapp.com"),b.setDefaultHttpFields({cache:!0})}]),angular.module("d3",[]).factory("d3Service",["$document","$q","$rootScope",function(a,b,c){function d(){c.$apply(function(){e.resolve(window.d3)})}var e=b.defer(),f=a[0].createElement("script");f.type="text/javascript",f.async=!0,f.src="bower_components/d3/d3.js",f.onreadystatechange=function(){"complete"===this.readyState&&d()},f.onload=d;var g=a[0].getElementsByTagName("body")[0];return g.appendChild(f),{d3:function(){return e.promise}}}]),angular.module("electionPollsApp").service("pollService",[function(){var a=[14,15,16,19],b=[17,18],c=[20,21],d=[22,23],e=[24,25,26];this.addAveragePoll=function(a){var b={source:"ממוצע",results:this.averageResults(a.slice(0,7))};return a.unshift(b),a},this.averageResults=function(a){var b={};_.each(a,function(a){_.each(a.results,function(a){_.isUndefined(b[a.party_id])&&(b[a.party_id]={party_id:a.party_id,mandates:0}),b[a.party_id].mandates+=a.mandates})});var c=a.length;return _.sortBy(_.map(b,function(a){return{party_id:a.party_id,mandates:parseInt(a.mandates/c)}}),function(a){return a.mandates}).reverse()},this.getPieData=function(f){var g=[{chunk:"right",heb:"ימין",mandates:0},{chunk:"center",heb:"מרכז",mandates:0},{chunk:"religious",heb:"חרדים",mandates:0},{chunk:"left",heb:"שמאל",mandates:0},{chunk:"arabs",heb:"ערבים",mandates:0}];return _.each(f.results,function(f){_.contains(a,parseInt(f.party_id))&&(g[0].mandates+=f.mandates),_.contains(b,parseInt(f.party_id))&&(g[1].mandates+=f.mandates),_.contains(c,parseInt(f.party_id))&&(g[2].mandates+=f.mandates),_.contains(d,parseInt(f.party_id))&&(g[3].mandates+=f.mandates),_.contains(e,parseInt(f.party_id))&&(g[4].mandates+=f.mandates)}),g}}]),angular.module("electionPollsApp").directive("pollBarChart",["$rootScope","$location","d3Service",function(a,b,c){return{restrict:"EA",link:function(d){function e(c){a.$apply(function(){b.path("/parties/"+c)})}c.d3().then(function(){d.$watch("selectedPoll",function(a){c3.generate({bindto:"#main-chart-container",data:{columns:[[a.source].concat(_.map(a.results,"mandates"))],type:"bar",onclick:function(b){var c=a.results[b.index].party_id;e(c)},color:function(b,c){return c.id?d.partyColor(a.results[c.index].party_id):void 0},labels:!0},bar:{width:{ratio:.5}},axis:{x:{type:"category",categories:_.map(a.results,function(a){return d.partyName(a.party_id)})},y:{show:!1}},grid:{y:{show:!0}},legend:{show:!1},tooltip:{show:!1},padding:{left:20,right:20,top:30},onresized:f});setTimeout(function(){f()},400)})});var f=function(){setTimeout(function(){d3.selectAll("#main-chart-container .c3-text").attr("y",250)},0)}}}}]),angular.module("electionPollsApp").directive("mobilePollBarChart",["$rootScope","$location","d3Service",function(a,b,c){return{restrict:"EA",link:function(d){function e(c){a.$apply(function(){b.path("/parties/"+c)})}c.d3().then(function(){d.$watch("selectedPoll",function(a){c3.generate({bindto:"#main-chart-container-mobile",data:{columns:[[a.source].concat(_.map(a.results,"mandates"))],type:"bar",onclick:function(b){var c=a.results[b.index].party_id;e(c)},color:function(b,c){return c.id?d.partyColor(a.results[c.index].party_id):void 0},labels:!0},bar:{width:{ratio:.8}},tooltip:{show:!1},axis:{rotated:!0,x:{type:"category",categories:_.map(a.results,function(a){return d.partyName(a.party_id)})},y:{show:!1}},legend:{show:!1},padding:{left:100,right:30,top:15}})})})}}}]),angular.module("electionPollsApp").directive("pieChart",[function(){return{restrict:"EA",link:function(a){a.$watch("pieData",function(a){var b={};_.map(a,function(a){b[a.chunk]=a.heb});c3.generate({bindto:"#pie-chart-container",data:{columns:_.map(a,function(a){return[a.chunk,a.mandates]}),type:"donut",colors:{left:"#1f3a93",right:"#96281b",center:"#8e44ad",religious:"#d35400",arabs:"#26a65b"},names:b},donut:{label:{format:function(a){return a}}},tooltip:{show:!1},legend:{position:"bottom"},padding:{top:0}})})}}}]),angular.module("electionPollsApp").directive("partyBarChart",["d3Service",function(a){return{restrict:"EA",link:function(b){a.d3().then(function(){{var a=_.sortBy(b.partyResults.results.slice(0,10),function(a){return Date.parse(a.poll.date)});c3.generate({bindto:"#party-chart-container",data:{columns:[[b.partyResults.name].concat(_.map(a,"mandates"))],type:"bar",color:function(){return b.partyResults.color},labels:!0},bar:{width:{ratio:.5}},axis:{x:{type:"category",categories:_.map(a,function(a){function b(a,b){for(var c=a+"";c.length<b;)c="0"+c;return c}var c=new Date(a.poll.date),d=c.getDate(),e=c.getMonth()+1;return b(d,2)+"/"+e})},y:{show:!1}},grid:{y:{show:!0}},legend:{show:!1},tooltip:{show:!1},padding:{left:10,right:10,top:30,bottom:50},onresized:c})}setTimeout(function(){c()},400)});var c=function(){setTimeout(function(){d3.selectAll("#party-chart-container .c3-text").attr("y",190)},0)}}}}]),angular.module("electionPollsApp").directive("mobilePartyBarChart",["d3Service",function(a){return{restrict:"EA",link:function(b){a.d3().then(function(){{var a=_.sortBy(b.partyResults.results.slice(0,10),function(a){return Date.parse(a.poll.date)});c3.generate({bindto:"#party-chart-container-mobile",data:{columns:[[b.partyResults.name].concat(_.map(a,"mandates"))],type:"bar",color:function(){return b.partyResults.color},labels:!0},bar:{radius:14,width:{ratio:.5}},axis:{rotated:!0,x:{type:"category",categories:_.map(a,function(a){function b(a,b){for(var c=a+"";c.length<b;)c="0"+c;return c}var c=new Date(a.poll.date),d=c.getDate(),e=c.getMonth()+1;return b(d,2)+"/"+e})},y:{show:!1}},grid:{y:{show:!0}},legend:{show:!1},tooltip:{show:!1},padding:{left:60,right:30,top:10,bottom:50}})}})}}}]),angular.module("electionPollsApp").directive("pollSelect",["$document",function(a){return{link:function(b,c){var d=function(b){f(b)&&(angular.element("#poll-list").removeClass("collapsed"),a.bind("click",e))},e=function(b){f(b)||(angular.element("#poll-list").addClass("collapsed"),a.unbind("click",e))},f=function(a){return c[0]==a.target||"selected-poll"==a.target.id};c.on("click",d),a.bind("click",e)}}}]),angular.module("electionPollsApp").controller("AppController",["$scope",function(a){a.pollView=null}]),angular.module("electionPollsApp").controller("MainController",["$scope","pollData","partyData","pollService","pollView",function(a,b,c,d,e){a.pollData=d.addAveragePoll(b),a.selectedPoll=a.pollData[0],a.pollView=void 0==e?"bar":e.view,a.partyData=c,a.pieData=[],a.$watch("selectedPoll",function(b){a.pieData=d.getPieData(b)}),a.selectPoll=function(b){a.selectedPoll=b},a.partyName=function(b){return _.findWhere(a.partyData,{id:b}).name},a.partyColor=function(b){return _.findWhere(a.partyData,{id:b}).color},a.partyImage=function(b){return _.findWhere(a.partyData,{id:b}).image},a.navigateToPartyPage=function(a){alert(a)},a.togglePollView=function(){a.pollView="bar"==a.pollView?"pie":"bar"},a.shareOnFacebook=function(){FB.ui({method:"share",href:window.location.href},function(){})}}]),angular.module("electionPollsApp").controller("PartyController",["$scope","partyResults",function(a,b){a.partyResults=b}]),angular.module("electionPollsApp").controller("SplashController",["$scope","$sce","$location","information","pollView",function(a,b,c,d,e){a.msg=b.trustAsHtml(d.msg.text),a.go=function(a,b){e.view=b,c.path(a)}}]);