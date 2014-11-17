var viewsPath = 'views/';
var dataObjTypes = {DIR: 'DIR', FILE: 'FILE'};
var dataObjViews = {LIST: 'LIST'};
var dataObj = {
    type: dataObjTypes.DIR,
    view: dataObjViews.LIST,
    childs: [],
    content: {title: '/'}
};

var templates = {
    main:{
        controller: "MainPageCtrl",
        templateUrl: viewsPath + 'main.html'
    }
    ,portfolio:{
        controller: "PortfolioPageCtrl",
        templateUrl: viewsPath + 'portfolio.html'
    }
};


var mainMenuItems = [
                    {label: "Главная", link: "#/"}
                    ,{label: "Примеры работ", link: "#/1"}
                    ,{label: "Резюме", link: "#/2"}
                    ,{label: "Дипломы", link: "#/3"}
                ];
                
var app = angular.module('mainModule', ['ngRoute'])
        .config(['$routeProvider', function($routeProvider) {
                /*$routeProvider.otherwise({
                    templateUrl: viewsPath + 'page.html',
                    controller: 'MyRouterCtrl'
                });*/
                $routeProvider.when("/:page",{
                    templateUrl: function(pathParms){
                        console.log("pathParms:" , pathParms);
                        return viewsPath + 'page.html';
                    },
                    controller: 'MyRouterCtrl'
                });
            }])
        .controller('MainCtrl', ['$scope', '$rootScope', '$log', '$location', '$http',
            function($scope, $rootScope, $log, $location, $http) {
                $scope.loc = $location.path();
                
                $http.get('./js/data.json').success(function(appData) {  
                    $scope.appData = appData;  
                    $log.info("appData:" + appData);
                    $rootScope.appData = appData;
                });
                
                $rootScope.$on("$locationChangeSuccess", function() {
                    $scope.loc = $location.path();
                    $log.info("location changing to:" + $scope.loc);
                });
            }])
        .controller('MainMenu', ['$scope', '$rootScope', '$log', '$location',
            function($scope, $rootScope, $log, $location) {
                $scope.mainMenuItems = mainMenuItems;
                $scope.isActive = function (viewLocation) {
                    return viewLocation === "#"+$location.path();
                };
            }])
        .controller('MyRouterCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
                $scope.location = $location.path();
        
        
        
            }])
        .directive('myList', function() {
            return {
                restrict: 'EA',
                templateUrl: viewsPath + 'list.html'
            };
        })
        .directive('directiveName', function() {
            return {
                link: function($scope, element, attrs) {
                    $scope.$watch(attrs.directiveName, function(value) {
                        element.html('test: ' + value);
                    });
                }
            };
        })
        .directive('mrouter', function() {
            return {
                templateUrl: viewsPath + 'router.html'
                /*link: function($scope, element, attrs) {
                 $scope.$watch('loc', function(value) {
                 if (value === '/page') {
                 element.html('<div page-directive></div>');
                 } else if (value === '/dir') {
                 element.html('<div dir-directive></div>');
                 } else {
                 element.html('ERROR!');
                 }
                 });
                 }*/
            }
            ;
        })
        .directive('pageDirective', function() {
            return {
                link: function($scope, element, attrs) {
                    element.html('page');
                }
            };
        })
        .directive('dirDirective', function() {
            return {
                link: function($scope, element, attrs) {
                    element.html('dir');
                }
            };
        });
;

