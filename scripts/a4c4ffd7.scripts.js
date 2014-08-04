"use strict";angular.module("progressClientApp",["ngCookies","ngSanitize","ui.router","restangular","angularMoment","cgBusy","http-auth-interceptor","ui.bootstrap"]).value("cgBusyDefaults",{message:"Loading"}).run(["$rootScope","$modal","User","authService","Restangular",function(a,b,c,d,e){a.User=c,a.$on("event:auth-loginRequired",function(){var c=b.open({templateUrl:"views/login-modal.html",controller:["$scope","$modalInstance",function(a,b){console.log("got to here!"),a.login=function(a){e.all("users").login(a).then(function(a){b.close(a)})}}]});c.result.then(function(b){a.currentUser=b,d.loginConfirmed()},function(){})})}]).config(["$stateProvider","$urlRouterProvider","RestangularProvider",function(a,b,c){console.log("host name",document.location.hostname),c.setBaseUrl("127.0.0.1"===document.location.hostname||"localhost"===document.location.hostname?"api/index.php":"http://ec2-54-206-66-123.ap-southeast-2.compute.amazonaws.com/progress/api/index.php"),c.addElementTransformer("users",!0,function(a){return a.addRestangularMethod("login","post","login"),a}),c.setDefaultHeaders({"Content-Type":void 0}),c.setDefaultHttpFields({withCredentials:!0}),b.otherwise("/"),a.state("me",{url:"/me","abstract":!0,template:"<ui-view></ui-view>"}).state("me.feed",{url:"/feed",resolve:{user:["Restangular","$rootScope",function(a,b){return a.one("me").one("user").get().then(function(a){b.currentUser=a})}]},controller:"FeedCtrl",templateUrl:"views/feed.html"}).state("home",{url:"/",controller:"FeedCtrl",templateUrl:"views/feed.html"}).state("register",{url:"/register",controller:"RegisterCtrl",templateUrl:"views/register.html"}).state("user",{"abstract":!0,url:"/users/:userId",template:"<ui-view></ui-view>"}).state("user.projects",{url:"/projects",resolve:{projects:["Restangular","$stateParams",function(a,b){return a.one("users",b.userId).all("projects").getList()}]},controller:"ProjectsCtrl",templateUrl:"views/projects.html"}).state("user.project",{url:"/projects/:projectId",resolve:{project:["Restangular","$stateParams",function(a,b){return a.one("users",b.userId).one("projects",b.projectId).get()}],posts:["Restangular","$stateParams",function(a,b){return a.one("users",b.userId).one("projects",b.projectId).all("posts").getList()}]},controller:"ProjectCtrl",templateUrl:"views/project.html"})}]),angular.module("progressClientApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("progressClientApp").controller("ProjectsCtrl",["$scope","projects",function(a,b){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"],a.projects=b}]),angular.module("progressClientApp").controller("ProjectCtrl",["$scope","project","posts",function(a,b,c){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"],a.project=b,a.posts=c}]),angular.module("progressClientApp").controller("FeedCtrl",["$scope","Restangular","Post","User",function(a,b,c,d){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"],console.log("hello world?"),a.posts=c.getFeed(),a.online=d.getOnline()}]),angular.module("progressClientApp").directive("post",function(){return{templateUrl:"views/post.html",restrict:"E",link:function(){}}}),angular.module("progressClientApp").factory("User",["Restangular","$rootScope",function(a,b){var c=a.service("users");return c.getOnline=function(){return a.one("me").all("following").all("online").getList()},c.logout=function(){a.all("users").all("logout").post(),b.currentUser=null},a.extendModel("users",function(a){return a}),c}]),angular.module("progressClientApp").factory("Post",["Restangular","$rootScope",function(a,b){var c=a.service("posts");return c.getFeed=function(){return a.one("me").all("following").all("posts").getList()},a.extendModel("posts",function(c){c.comments=c.comments||[],_.each(c.comments,function(a){a.user.color="#"+Math.floor(16777215*Math.random()).toString(16)}),c.isLiked=!1,c.isOwner=!1;var d=b.$watch("currentUser",function(a){if(a){var e=_.findWhere(c.likes,{userId:b.currentUser.id});e&&(c.isLiked=!0),c.userId===a.id&&(c.isOwner=!0),d()}});return c.delete=function(){a.one("me").one("posts",c.id).remove()},c.addComment=function(d){a.one("me").one("posts",c.id).all("comments").post(d).then(function(a){_.extend(d,a)}),b.currentUser&&(d.user=b.currentUser),c.comments.push(d),c.$comment={}},c.toggleLike=function(){var d={};b.currentUser&&(d.userId=b.currentUser.id,d.user=b.currentUser),c.isLiked=!0,c.likes.push(d),a.one("me").one("posts",c.id).all("likes").post().then(function(a){_.extend(d,a)},function(){})},c}),c}]),angular.module("progressClientApp").controller("RegisterCtrl",["$scope","Restangular","$rootScope","$state",function(a,b,c,d){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"],a.register=function(a){b.all("users").all("register").post(a).then(function(a){c.currentUser=a,d.go("me.feed")})}}]);