namespace App {
    let app = angular.module('App', ['ui.router']);

    app.config(['$stateProvider',
        ($stateProvider: angular.ui.IStateProvider)=>{
            $stateProvider
                .state('home', {
                    url:'/',
                    templateUrl:'/templates/partials/home.html'
                })
                .state('about', {
                    url:'/about',
                    template:'This is the angular about page'
                })
                .state('search', {
                    url:'/search',
                    templateUrl:'/templates/partials/search.html',
                    controller: App.SearchController,
                    controllerAs: 'searchController'
                })
                .state('view', {
                    url:'/view/:id',
                    templateUrl:'/templates/partials/view.html',
                    controller: App.SearchController,
                    controllerAs: 'searchController'
                })
            ;
        }
    ])
}
