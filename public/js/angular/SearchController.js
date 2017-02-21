var App;
(function (App) {
    var SearchController = (function () {
        function SearchController($state, $stateParams, searchService) {
            console.log('Search Controller has loaded...');
            this.stateService = $state;
            this.stateParamsService = $stateParams;
            this.searchService = searchService;
        }
        SearchController.prototype.read = function (_id) {
            var _this = this;
            this.searchService.read(_id)
                .success(function (response) {
                if (_id) {
                    _this.individual = response;
                    console.log('- Individual pokemon loaded by id: ' + _id);
                    console.log('Response: ', response);
                }
                else {
                    _this.list = response.result;
                    console.log('ID: ', _id);
                    console.log('- Pokemon list have been loaded ', _this.list);
                    console.log('Response: ', response.result);
                }
            })
                .error(function (response) {
                console.error('Unable to read pokemon data: ', response);
            });
        };
        SearchController.prototype.goToPage = function (route, data) {
            console.log('Here is the route data...', route, data);
            this.stateService.go(route, data);
        };
        return SearchController;
    }());
    SearchController.$inject = ['$state', '$stateParams', 'SearchService'];
    App.SearchController = SearchController;
})(App || (App = {}));
