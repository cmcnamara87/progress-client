"use strict";angular.module("progressClientApp",["ngCookies","ngSanitize","ui.router","restangular","angularMoment","cgBusy","http-auth-interceptor","ui.bootstrap"]).value("cgBusyDefaults",{message:"Loading"}).run(["$rootScope","$modal","User","authService","Restangular",function(a,b,c,d,e){a.$on("event:auth-loginRequired",function(){var a=b.open({templateUrl:"views/login-modal.html",controller:["$scope","$modalInstance",function(a,b){console.log("got to here!"),a.login=function(a){e.all("users").login(a).then(function(){b.close(),d.loginConfirmed()})}}]});a.result.then(function(){},function(){})})}]).config(["$stateProvider","$urlRouterProvider","RestangularProvider",function(a,b,c){console.log("host name",document.location.hostname),c.setBaseUrl("127.0.0.1"===document.location.hostname||"localhost"===document.location.hostname?"api/index.php":"http://ec2-54-206-66-123.ap-southeast-2.compute.amazonaws.com/progress/api/index.php"),c.addElementTransformer("users",!0,function(a){return a.addRestangularMethod("login","post","login"),a}),c.setDefaultHttpFields({withCredentials:!0}),b.otherwise("/me/feed"),a.state("me",{url:"/me","abstract":!0,template:"<ui-view></ui-view>"}).state("me.feed",{url:"/feed",controller:"FeedCtrl",templateUrl:"views/feed.html"}).state("home",{url:"/",controller:"FeedCtrl",templateUrl:"views/feed.html"}).state("user",{"abstract":!0,url:"/users/:userId",template:"<ui-view></ui-view>"}).state("user.projects",{url:"/projects",resolve:{projects:["Restangular","$stateParams",function(a,b){return a.one("users",b.userId).all("projects").getList()}]},controller:"ProjectsCtrl",templateUrl:"views/projects.html"}).state("user.project",{url:"/projects/:projectId",resolve:{project:["Restangular","$stateParams",function(a,b){return a.one("users",b.userId).one("projects",b.projectId).get()}],posts:["Restangular","$stateParams",function(a,b){return a.one("users",b.userId).one("projects",b.projectId).all("posts").getList()}]},controller:"ProjectCtrl",templateUrl:"views/project.html"})}]),angular.module("progressClientApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("progressClientApp").controller("ProjectsCtrl",["$scope","projects",function(a,b){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"],a.projects=b}]),angular.module("progressClientApp").controller("ProjectCtrl",["$scope","project","posts",function(a,b,c){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"],a.project=b,a.posts=c}]),angular.module("progressClientApp").controller("FeedCtrl",["$scope","Restangular","Post","User",function(a,b,c,d){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"],console.log("hello world?"),a.posts=c.getFeed(),a.online=d.getOnline()}]),angular.module("progressClientApp").directive("post",function(){return{templateUrl:"views/post.html",restrict:"E",controller:["Restangular","$scope",function(a,b){b.like=function(b){console.log("post is",b);var c={};b.likes.push(c),a.one("me").one("posts",b.id).all("likes").post().then(function(a){_.extend(c,a)})}}],link:function(){}}}),angular.module("progressClientApp").factory("User",["Restangular",function(a){var b=a.service("users");return b.getOnline=function(){return a.one("me").all("following").all("online").getList()},a.extendModel("users",function(a){return a}),b}]),angular.module("progressClientApp").factory("Post",["Restangular",function(a){var b=a.service("posts");return b.getFeed=function(){return a.one("me").all("following").all("posts").getList()},a.extendModel("posts",function(b){return b.toggleLike=function(){var c={};b.likes.push(c),a.one("me").one("posts",b.id).all("likes").post().then(function(a){_.extend(c,a)},function(){})},b}),b}]);