var imgPath = 'img/';

var routes = {
    "/": {label: "Главная", data: "data/index.json", template: "views/index.html", controller: "IndexCtrl"}
    , "/portfolio": {label: "Портфолио", data: "data/portfolio.json", template: "views/portfolio.html", controller: "PortfolioCtrl", thumbnail: imgPath + 'portfolio.png'}
    , "/resume": {label: "Резюме", data: "data/resume.json", template: "views/resume.html", controller: "ResumeCtrl", thumbnail: imgPath + 'resume.png'}
    , "/doc": {label: "Документы", data: "data/doc.json", template: "views/doc.html", controller: "DocCtrl", thumbnail: imgPath + 'doc.png'}
};

var app = angular.module('mainModule', ['ngRoute', 'ui.bootstrap'])
        .config(['$routeProvider', function ($routeProvider) {
                for (var i in routes) {
                    $routeProvider.when(i, {
                        templateUrl: routes[i].template
                        , controller: routes[i].controller
                        , resolve: {
                            data: (function (url) {
                                return function (dataService) {
                                    return dataService.getData(url);
                                };
                            })(routes[i].data)
                        }
                    });
                }
                $routeProvider.otherwise({
                    redirectTo: '/'
                });
            }])
        .controller('ResumeCtrl', ['$scope', 'data',
            function ($scope, data) { }])
        .controller('CarouselCtrl', ['$scope',   
            function ($scope) {
                $scope.myInterval = 5000;
            }])
        .controller('PortfolioCtrl', ['$scope', '$modal', 'data',
            function ($scope, $modal, data) {
                $scope.groups = data.groups;
                $scope.currentItem = data.groups[0].items[1];
                $scope.openItemDetailsModal = function (item) {
                    //$log.info("openDetailsModal");
                    var modalInstance = $modal.open({
                        templateUrl: 'itemDetailsModalContent.html'
                        , size: 'lg'
                        , controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                                $scope.currentItem = item;
                                $scope.cancel = function () {
                                    $modalInstance.dismiss('cancel');
                                };
                            }]
                    });
                };
            }])
        .controller('IndexCtrl', ['$scope', 'data',
            function ($scope, data) {
                var thumbnails = [];
                for (var i in routes) {
                    if (routes[i].thumbnail) {
                        thumbnails.push({href: '#' + i, label: routes[i].label, thumbnail: routes[i].thumbnail});
                    }
                }
                $scope.thumbnails = thumbnails;
                $scope.techListData = data.techList;
            }])
        .controller('DocCtrl', ['$scope', '$modal', 'data',
            function ($scope, $modal, data) {
                $scope.groups = data.groups;
                for (var gn in data.groups) {
                    for (var i in data.groups[gn].docs) {
                        preloadImg(data.groups[gn].docs[i].img);
                    }
                }

                $scope.openDocDetailsModal = function (doc) {
                    //$log.info("openDocDetailsModal");
                    var modalInstance = $modal.open({
                        templateUrl: 'docDetailsModalContent.html'
                        , size: 'lg'
                        , controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                                $scope.currentDoc = doc;
                                $scope.cancel = function () {
                                    $modalInstance.dismiss('cancel');
                                };
                            }]
                    });
                };
            }])
        .controller('MainCtrl', ['$scope', '$routeParams', '$rootScope', '$location', '$http', '$modal',
            function ($scope, $routeParams, $rootScope, $location, $http, $modal) {
                $scope.loaded = false;
                $rootScope.$on("$routeChangeStart", function (event, next, current) {
                    $scope.loading = true;
                });
                $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
                    $scope.loading = false;
                });
                $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
                    alert("ROUTE CHANGE ERROR: " + rejection);
                    $scope.loading = false;
                });
                for (var i in routes) {
                    if (routes[i].thumbnail)
                        preloadImg(routes[i].thumbnail);
                }
                $scope.$on('$viewContentLoaded', function () {
                    $scope.loaded = true;
                });
            }])
        .controller('MainMenu', ['$scope', '$rootScope', '$location',
            function ($scope, $rootScope, $location) {
                var mainMenuItems = [];
                for (var i in routes) {
                    mainMenuItems.push({
                        link: "#" + i,
                        label: routes[i].label,
                        icon: routes[i].thumbnail
                    });
                }
                $scope.mainMenuItems = mainMenuItems;
                $scope.isActive = function (link) {
                    return link === "#" + $location.path();
                };
            }])
        .controller('MyRouterCtrl', ['$scope', '$routeParams', '$location', function ($scope, $routeParams, $location) {
                $scope.location = $location.path();
            }])
        .controller('techlistCtrl', ["$scope", "$element", "$attrs", "$log",
            function ($scope, $element, $attrs, $log) {
                //$log.info($attrs.count);
                var r = [];
                for (var i = 0; i < $scope.techListData.count; i++)
                    r.push(i);
                $scope.techListData.r = r;
                $scope.getSpriteStyle = function (n) {
                    return {'background-position': '0 ' + (n * $scope.techListData.size) + 'px;'};
                };
                //$log.info($scope);
            }
        ])
        .directive('techlist', function () {
            return {
                restrict: 'E',
                templateUrl: 'views/techList.html',
                replace: true,
                scope: {},
                link: function ($scope, element, attrs) {
                    $scope.count = attrs.count;
                    $scope.size = attrs.size;
                    $scope.src = imgPath + attrs.img;
                    var r = [];
                    for (var i = 0; i < attrs.count; i++)
                        r.push(i);
                    $scope.r = r;
                    $scope.getSpriteStyle = function (n) {
                        return {
                            width: $scope.size + 'px',
                            height: $scope.size + 'px',
                            backgroundPosition: (-n * $scope.size) + 'px 0'
                        };
                    };
                }
            };
        })
        .directive('contacts', ['$modal', function ($modal) {
                return {
                    restrict: 'E',
                    templateUrl: 'views/contacts.html',
                    replace: true,
                    scope: {},
                    link: function ($scope, element, attrs) {
                        $scope.openContactsModal = function () {
                            //$log.info("openContactsModal");
                            var modalInstance = $modal.open({
                                templateUrl: 'contactsModalContent.html'
                                , controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                                        var imageUrl = 'http://main-ip.ru/captcha.php';
                                        $scope.imageUrl = imageUrl;
                                        $scope.reloadCAPTCHA = function () {
                                            $scope.imageUrl = imageUrl + "?r=" + Date.now();
                                            //console.log(arguments, this);
                                        };
                                        $scope.cancel = function () {
                                            $modalInstance.dismiss('cancel');
                                        };
                                    }]
                            });
                        };
                    }
                };
            }])
        .directive('glider', function () {
            return {
                restrict: 'E',
                template: '<div class="glider"></div> ',
                replace: true,
                link: function ($scope, element, attrs) {
                    var frames = 4;
                    var frame = 0;
                    var startTop = 40;
                    var startLeft = 40;
                    var top = startTop;
                    var left = startLeft;
                    $(element).css({'left': left, 'top': top});
                    var i = setInterval(function () {
                        frame++;
                        if (frame >= frames) {
                            frame = 0;
                            if (left >= $(document).width() - 6)
                                left = startLeft;
                            $(element).css({'left': left += 2});
                        } else
                        if (frame === 2) {
                            top += 2;
                            if (top >= $(document).height() - 6)
                                top = startTop;
                            $(element).css({'top': top});
                        }
                        $(element).css({'background-position': -6 * frame});
                    }, 300);
                }
            };
        })
        .directive('fixmodal', function () {
            var scrollWidth = getScrollWidth();
            return {
                restrict: 'E',
                template: "\
                    <style>\
                        .modal-open main,\
                        .modal-open .footer,\
                        .modal-open nav {\\n\
                            -webkit-transition:all linear 0s;\
                            transition:all linear 0s;\
                            padding-right: " + scrollWidth + "px;\
                        }\
                        .modal-open #mailMeBtn {\
                            margin-right: " + scrollWidth + "px;\
                        }\
                    </style>",
                replace: true
            };
        });


app.factory("dataService", ['$q', '$http', '$timeout', function ($q, $http, $timeout) {
        return {
            getData: function (url) {
                var d = $q.defer();
                //$timeout(function () { // TODO: remove it
                    $http.get(url).
                            success(function (data, status, headers, config) {
                                d.resolve(data);
                            }).
                            error(function (data, status, headers, config) {
                                d.reject('http error');
                            });
                //}, 100);
                return d.promise;
            }
        };
    }]);

var loadedImages = [];
function preloadImg(path) {
    console.log(path);
    if (loadedImages.indexOf(path) === -1) {
        console.log(path);
        loadedImages.push(path);
        var newImage = new Image();
        newImage.src = path;
    }
}

/* fix смещения контента при появлении модального окна */
function getScrollWidth() {
    var div = document.createElement('div');
    div.style.overflowY = 'scroll';
    div.style.width = '50px';
    div.style.height = '50px';
    div.style.visibility = 'hidden';
    document.body.appendChild(div);
    var scrollWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
    return scrollWidth;
}