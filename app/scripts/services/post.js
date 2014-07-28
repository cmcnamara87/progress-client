'use strict';

angular.module('progressClientApp')
    .factory('Post', function(Restangular, $rootScope) {

        var Post = Restangular.service('posts');

        Post.getFeed = function() {
            return Restangular.one('me').all('following').all('posts').getList();
        };

        Restangular.extendModel('posts', function(post) {
            post.isLiked = false;
            post.isOwner = false;
            var stopListening = $rootScope.$watch('currentUser', function(currentUser) {
                // var newlyLoggedIn = currentUser && !old;
                if(currentUser) {
                    var like = _.findWhere(post.likes, {'userId': $rootScope.currentUser.id});
                    if(like) {
                        post.isLiked = true;
                    }
                    if(post.userId === currentUser.id) {
                        post.isOwner = true;
                    }
                    stopListening();
                }
            });

            post.delete = function() {
                Restangular.one('me').one('posts', post.id).remove();
            };
            
            post.toggleLike = function() {
                var likeTemp = {};
                if($rootScope.currentUser) {
                    likeTemp.userId = $rootScope.currentUser.id;
                    likeTemp.user = $rootScope.currentUser;
                }
                post.isLiked = true;
                post.likes.push(likeTemp);
                Restangular.one('me').one('posts', post.id).all('likes').post().then(function(like) {
                    _.extend(likeTemp, like);
                }, function() {
                });
            };
            return post;
        });

        return Post;
    });