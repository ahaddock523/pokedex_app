var App;
(function (App) {
    var app = angular.module('App', ['ui.router']);
    app.config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('home', {
                url: '/',
                template: 'This is the angular home page'
            })
                .state('about', {
                url: '/about',
                template: 'This is the angular about page'
            })
                .state('contact', {
                url: '/contact',
                template: 'This is the angular contact page'
            });
        }
    ]);
})(App || (App = {}));
