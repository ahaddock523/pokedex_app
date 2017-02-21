var App;
(function (App) {
    var app = angular.module('App');
    var SearchService = (function () {
        function SearchService($httpService) {
            this.httpService = $httpService;
        }
        SearchService.prototype.read = function (_id) {
            var url = '/pokemon';
            if (_id) {
                url = url + '/' + _id;
            }
            var promise = this.httpService({
                url: url,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {}
            });
            return promise;
        };
        SearchService.prototype.search = function () {
            var url = "/pokemon/search";
            var promise = this.httpService({
                url: url,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {}
            });
            return promise;
        };
        return SearchService;
    }());
    SearchService.$inject = ['$http'];
    App.SearchService = SearchService;
    app.service('SearchService', SearchService);
})(App || (App = {}));
