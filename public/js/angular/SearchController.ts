namespace App {
    export class SearchController {
        static $inject = ['$state', '$stateParams', 'SearchService'];

        private stateService;
        private stateParamsService;
        private searchService;

        public list;
        public individual;
        public searchResult;

        constructor($state: angular.ui.IStateProvider, $stateParams: angular.ui.IStateParamsService, searchService: App.SearchService) {
            console.log('Search Controller has loaded...');

            this.stateService = $state;
            this.stateParamsService = $stateParams;
            this.searchService = searchService;

            if(this.stateParamsService.id) {
                this.read(this.stateParamsService.id);
            }
        }

        public read (_id) {
            this.searchService.read(_id)
            .success((response)=>{
                if (_id) {
                    this.individual = response;
                    console.log('- Individual pokemon loaded by id: ' + _id);
                    console.log('Response: ', response);
                }
                else {
                    this.list = response.result;
                    console.log('ID: ', _id);
                    console.log('- Pokemon list have been loaded ', this.list);
                    console.log('Response: ', response.result);
                }
            })
            .error((response)=> {
                console.error('Unable to read pokemon data: ', response)
            })
        }

        public goToPage(route, data) {
            console.log('Here is the route data...', route, data);
            this.stateService.go(route, data);
        }

        public search (name) {
            console.log(name);
            this.searchService.search(name)
            .success((response)=>{
                console.log('Pokemon found by name! ' + name);
                console.log('Response: ', response);
                this.searchResult = response;
            })
            .error((response)=>{
                console.error('Unable to find pokemon by name.')
            });
        }
    }
}
