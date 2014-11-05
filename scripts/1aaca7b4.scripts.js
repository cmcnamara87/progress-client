"use strict";angular.module("progressClientApp",["ngCookies","ngSanitize","ui.router","restangular","angularMoment","cgBusy","http-auth-interceptor","ui.bootstrap","angular-loading-bar","monospaced.elastic","angularFileUpload","angulartics","angulartics.google.analytics","bernhardposselt.enhancetext"]).value("cgBusyDefaults",{message:"Loading"}).value("downloadUrl","https://github.com/cmcnamara87/progress-mac/releases/download/v0.20/Progress.zip").run(["$rootScope","$modal","User","authService","Restangular","downloadUrl","$stateParams","notificationService","$analytics",function(a,b,c,d,e,f,g,h,i){a.User=c,a.downloadUrl=f,a.notificationService=h,a.$stateParams=g,a.$on("event:auth-loginRequired",function(){var c=b.open({templateUrl:"views/login-modal.html",controller:["$scope","$modalInstance",function(a,b){a.login=function(a){i.eventTrack("user-login",{category:"user"}),e.all("users").login(a).then(function(a){h.loadNotifications(),ga("set","userId",a.id),b.close(a)})}}]});c.result.then(function(b){a.currentUser=b,d.loginConfirmed()},function(){})}),c.getLoggedIn().then(function(a){a&&h.loadNotifications()})}]).config(["$stateProvider","$urlRouterProvider","enhanceTextFilterProvider","RestangularProvider","$analyticsProvider",function(a,b,c,d,e){console.log("host name",document.location.hostname),c.setOptions({embeddedYoutubeWidth:"auto",embeddedYoutubeHeight:"auto"}),e.virtualPageviews(!0),d.setBaseUrl("127.0.0.1"===document.location.hostname||"localhost"===document.location.hostname?"api":"http://ec2-54-206-66-123.ap-southeast-2.compute.amazonaws.com/progress/api/index.php"),d.addElementTransformer("users",!0,function(a){return a.addRestangularMethod("login","post","login"),a}),d.setDefaultHeaders({"Content-Type":void 0}),d.setDefaultHttpFields({withCredentials:!0}),b.otherwise("/"),a.state("home",{url:"/",resolve:{user:["User",function(a){return a.getLoggedIn()}]},controller:["$state","user",function(a,b){console.log("root page",b),a.go(b?"me.feed":"landing")}]}).state("me",{url:"/me","abstract":!0,template:"<ui-view></ui-view>"}).state("me.feed",{url:"/feed",resolve:{user:["Restangular","$rootScope","notificationService",function(a,b,c){return a.one("me").one("user").get().then(function(a){return b.currentUser=a,c.loadNotifications(),a})}]},controller:"FeedCtrl",templateUrl:"views/feed.html"}).state("landing",{url:"/landing",templateUrl:"views/landing.html"}).state("gettingStarted",{url:"/getting-started",templateUrl:"views/getting-started.html"}).state("intro",{url:"/intro",templateUrl:"views/intro.html"}).state("register",{url:"/register",controller:"RegisterCtrl",templateUrl:"views/register.html"}).state("user",{"abstract":!0,url:"/users/:userId",template:"<ui-view></ui-view>"}).state("user.projects",{url:"/projects",resolve:{projects:["Restangular","$stateParams",function(a,b){return a.one("users",b.userId).all("projects").getList()}],user:["Restangular","$stateParams",function(a,b){return a.one("users",b.userId).get()}]},controller:"ProjectsCtrl",templateUrl:"views/projects.html"}).state("post",{url:"/posts/:postId",resolve:{post:["Restangular","$stateParams",function(a,b){return a.one("posts",b.postId).get()}]},controller:"SinglePostCtrl",templateUrl:"views/singlepost.html"}).state("user.project",{url:"/projects/:projectId?timelapse",resolve:{project:["Restangular","$stateParams",function(a,b){return a.one("users",b.userId).one("projects",b.projectId).get()}],posts:["Restangular","$stateParams",function(a,b){return a.one("users",b.userId).one("projects",b.projectId).all("posts").getList()}]},controller:"ProjectCtrl",templateUrl:"views/project.html"}).state("user.diary",{url:"/diary/:projectId?timelapse",resolve:{project:["Restangular","$stateParams",function(a,b){return a.one("users",b.userId).one("projects",b.projectId).get()}],posts:["Restangular","$stateParams",function(a,b){return a.one("users",b.userId).one("projects",b.projectId).all("posts").getList()}]},controller:"DiaryCtrl",templateUrl:"views/diary.html"})}]),angular.module("progressClientApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("progressClientApp").controller("ProjectsCtrl",["$scope","projects","user",function(a,b,c){var d=a;d.projects=b,d.user=c}]),angular.module("progressClientApp").controller("ProjectCtrl",["$scope","$interval","project","posts",function(a,b,c,d){function e(){a.timelapsePostIndex=0}a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"],a.project=c,a.posts=d,console.log("posts",d),a.postsWithImages=_.filter(d,function(a){return"SCREENSHOT_COLLECTION"===a.type}).reverse(),a.timelapsePostIndex=0,a.timelapsePost=a.postsWithImages[a.timelapsePostIndex++]||null,a.restart=e,b(function(){if(a.timelapsePostIndex!==a.postsWithImages.length){var b=a.timelapsePostIndex++%a.postsWithImages.length;a.timelapsePost=a.postsWithImages[b]}},500)}]),angular.module("progressClientApp").controller("FeedCtrl",["$scope","Restangular","Post","User","$rootScope","$log","$upload",function(a,b,c,d,e,f,g){function h(){j(),k().then(function(){l()}),i()}function i(){b.one("me").all("following").all("leaderboard").getList().then(function(a){p.leaderboard=_.reject(a,function(a){return 0===a.seconds})})}function j(){return c.getFeed().then(function(a){p.posts=a})}function k(){return d.getOnline().then(function(a){if(p.online=a,e.currentUser){var b=_.findWhere(p.online,{id:e.currentUser.id});b&&(p.activeProject=b.activeProject)}})}function l(){b.one("me").all("following").getList().then(function(a){p.offline=_.reject(a,function(a){return _.find(p.online,function(b){return b.id===a.id})})})}function m(a,c){if(c&&c.length)return f.debug("image update!"),void n(a,c);p.newPostText="";var d={text:a,user:e.currentUser,project:p.activeProject,type:"TEXT",created:1e3*(new Date).getTime()};p.posts.unshift(d),b.one("me").all("posts").post({text:a}).then(function(a){angular.copy(a,d)})}function n(b,c){c&&c.length||f.error("No files given");var d=p.files[0],e="";e="127.0.0.1"===document.location.hostname||"localhost"===document.location.hostname?"api":"http://ec2-54-206-66-123.ap-southeast-2.compute.amazonaws.com/progress/api/index.php",a.upload=g.upload({url:e+"/me/projects/"+p.activeProject.id+"/screenshots",withCredentials:!0,data:{text:b},file:d}).progress(function(a){f.debug("percent: "+parseInt(100*a.loaded/a.total))}).success(function(){j()}),p.files=null,p.newPostText=""}function o(a){p.files=a}var p=a;p.posts=null,p.online=null,p.activeProject=null,p.postUpdate=m,p.onFileSelect=o,p.newPostText="",p.files=null,h()}]),angular.module("progressClientApp").directive("post",function(){return{templateUrl:"views/post.html",restrict:"E",link:function(){}}}),angular.module("progressClientApp").factory("User",["Restangular","$rootScope","$analytics",function(a,b,c){var d=a.service("users");return d.getOnline=function(){return a.one("me").all("following").all("online").getList()},d.getLoggedIn=function(){return a.one("session").one("user").get().then(function(a){return a.id?(b.currentUser=a,a):null})},d.logout=function(){c.eventTrack("user-logout",{category:"user"}),a.all("users").all("logout").post(),b.currentUser=null},a.extendModel("users",function(a){return a}),d}]),angular.module("progressClientApp").factory("Post",["Restangular","$rootScope","$log","$analytics",function(a,b,c,d){var e=a.service("posts");return e.getFeed=function(){return c.debug("getting feed"),a.one("me").all("following").all("posts").getList()},a.extendModel("posts",function(e){c.debug("wrapping post"),e.comments=e.comments||[],_.each(e.comments,function(a){a.user=a.user||{},a.user.color="#"+Math.floor(16777215*Math.random()).toString(16)}),e.isLiked=!1,e.isOwner=!1;var f=b.$watch("currentUser",function(a){if(a){var c=_.findWhere(e.likes,{userId:b.currentUser.id});c&&(e.isLiked=!0),e.userId===a.id&&(e.isOwner=!0),f()}});return e.delete=function(b){if(d.eventTrack("post-delete",{category:"post"}),a.one("me").one("posts",e.id).remove(),b){var c=b.indexOf(e);b.splice(c,1)}},e.addComment=function(c){d.eventTrack("comment-add",{category:"comment"}),a.one("me").one("posts",e.id).all("comments").post(c).then(function(a){_.extend(c,a)}),b.currentUser&&(c.user=b.currentUser),e.comments.push(c),e.$comment={}},e.toggleLike=function(){d.eventTrack("post-like",{category:"post"});var c={};b.currentUser&&(c.userId=b.currentUser.id,c.user=b.currentUser),e.isLiked=!0,e.likes.push(c),a.one("me").one("posts",e.id).all("likes").post().then(function(a){_.extend(c,a)},function(){})},e}),e}]),angular.module("progressClientApp").controller("RegisterCtrl",["$scope","Restangular","$rootScope","$state",function(a,b,c,d){a.isRegistering=!1,a.register=function(e){a.isRegistering=!0,b.all("users").all("register").post(e).then(function(a){c.currentUser=a,d.go("intro")})}}]),angular.module("progressClientApp").controller("DiaryCtrl",["$scope","$filter","project","posts","Restangular","User",function(a,b,c,d){var e=a;e.entires=null,e.project=c,e.posts=d,_.each(c.directories,function(a){console.log("directories");var b=a.path.split("/");a.folderName=b[b.length-1]}),e.posts=_.filter(d,function(a){return"SCREENSHOT_COLLECTION"===a.type||"TEXT"===a.type||"STARTED_WORKING"===a.type}).reverse(),_.each(e.posts,function(a){a.date=b("date")(1e3*a.created,"fullDate")});var f=_.groupBy(e.posts,"date");f=_.map(f,function(a){return{date:a[0].date,created:a[0].created,entries:a}}),_.each(f,function(a){a.entries=_.reject(a.entries,{type:"STARTED_WORKING"})}),e.dates=_.sortBy(f,"created").reverse()}]),angular.module("progressClientApp").factory("Notification",["Restangular","$rootScope","$log","$analytics",function(a,b,c,d){function e(){return c.debug("Getting notifications"),a.one("me").all("notifications").getList()}var f=a.service("notifications");return f.getNotifications=e,a.extendModel("notifications",function(a){return a.markAsRead=function(){a.isread=1,a.save(),c.debug("Marking as read",a),d.eventTrack("notification-mark-as-read",{category:"notification"}),b.notificationService.notifications=_.without(b.notificationService.notifications,a)},a}),f}]),angular.module("progressClientApp").factory("notificationService",["Restangular","Notification","$analytics",function(a,b,c){function d(){b.getNotifications().then(function(a){f.notifications=a})}function e(){c.eventTrack("notification-mark-all-as-read"),_.each(f.notifications,function(a){a.markAsRead()})}var f={notifications:[],loadNotifications:d,markAllAsRead:e};return f}]),angular.module("progressClientApp").controller("SinglePostCtrl",["$scope","post",function(a,b){a.post=b}]);
