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
            function ($scope, data) {
            }])
        .controller('CarouselCtrl', ['$scope',
            function ($scope) {
                $scope.myInterval = 5000;
            }])
        .controller('PortfolioCtrl', ['$scope', '$modal', 'data',
            function ($scope, $modal, data) {

                var imageLocations = [];
                for (var gn in data.groups) {
                    for (var i in data.groups[gn].items) {
                        imageLocations.push(data.groups[gn].items[i].preview);
                    }
                }
                $scope.$emit('preloadImages', imageLocations);

                $scope.groups = data.groups;
                $scope.currentItem = data.groups[0].items[1];
                $scope.openItemDetailsModal = function (item) {
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
                var imageLocations = [];

                var thumbnails = [];
                for (var i in routes) {
                    if (routes[i].thumbnail) {
                        thumbnails.push({href: '#' + i, label: routes[i].label, thumbnail: routes[i].thumbnail});
                        imageLocations.push(routes[i].thumbnail);
                    }
                }
                imageLocations.push(imgPath + data.techList.img); // TODO
                $scope.$emit('preloadImages', imageLocations);
                $scope.thumbnails = thumbnails;
                $scope.techListData = data.techList;
            }])
        .controller('DocCtrl', ['$scope', '$modal', 'data', 'preloader',
            function ($scope, $modal, data, preloader) {
                $scope.groups = data.groups;

                var imageLocations = [];
                for (var gn in data.groups) {
                    for (var i in data.groups[gn].docs) {
                        imageLocations.push(data.groups[gn].docs[i].img);
                    }
                }
                $scope.$emit('preloadImages', imageLocations);

                $scope.openDocDetailsModal = function (doc) {
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
        .controller('MainCtrl', ['$scope', '$log', 'preloader',
            function ($scope, $log, preloader) {
                $scope.$on("$routeChangeSuccess", function () {
                    setTimeout(function() {
                        $(window).scrollTop(0);  
                    }, 0);
                });
                $scope.loading = 'isLoaded';
                $scope.percentLoaded = 100;
                var preloadedImages = [];
                $scope.$on('preloadImages', function (event, _imageLocations) {
                    var imageLocations = [];
                    for (var i in _imageLocations)
                        if (preloadedImages.indexOf(_imageLocations[i]) === -1)
                            imageLocations.push(_imageLocations[i]);
                    // Preload the images; then, update display when returned.
                    if (imageLocations.length > 0) {
                        $scope.loading = 'isLoading';
                        $scope.percentLoaded = 0;
                        preloader.preloadImages(imageLocations).then(
                                function handleResolve(imageLocations) {
                                    // Loading was successful.
                                    $scope.loading = 'isLoaded';
                                    for (var i in imageLocations)
                                        preloadedImages.push(imageLocations[i]);
                                },
                                function handleReject(imageLocation) {
                                    // Loading failed on at least one image.
                                    /*$scope.isLoading = false;
                                    $scope.isSuccessful = false;*/
                                    // TODO
                                    $scope.loading = 'isLoaded';
                                },
                                function handleNotify(event) {
                                    $scope.percentLoaded = event.percent;
                                }
                        );
                    }
                });
                $log.info(welcomeMsg);
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
        .controller('techlistCtrl', ["$scope", "$element", "$attrs", 
            function ($scope, $element, $attrs) {
                var r = [];
                for (var i = 0; i < $scope.techListData.count; i++)
                    r.push(i);
                $scope.techListData.r = r;
                $scope.getSpriteStyle = function (n) {
                    return {'background-position': '0 ' + (n * $scope.techListData.size) + 'px;'};
                };
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
                            var modalInstance = $modal.open({
                                templateUrl: 'contactsModalContent.html'
                                , controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                                        var imageUrl = 'http://main-ip.ru/captcha.php';
                                        $scope.imageUrl = imageUrl;
                                        $scope.reloadCAPTCHA = function () {
                                            $scope.imageUrl = imageUrl + "?r=" + Date.now();
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
                                left = 0;
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

// http://www.bennadel.com/blog/2597-preloading-images-in-angularjs-with-promises.htm
app.factory(
        "preloader",
        function ($q, $rootScope) {
            // I manage the preloading of image objects. Accepts an array of image URLs.
            function Preloader(imageLocations) {
                // I am the image SRC values to preload.
                this.imageLocations = imageLocations;
                // As the images load, we'll need to keep track of the load/error
                // counts when announing the progress on the loading.
                this.imageCount = this.imageLocations.length;
                this.loadCount = 0;
                this.errorCount = 0;
                // I am the possible states that the preloader can be in.
                this.states = {
                    PENDING: 1,
                    LOADING: 2,
                    RESOLVED: 3,
                    REJECTED: 4
                };
                // I keep track of the current state of the preloader.
                this.state = this.states.PENDING;
                // When loading the images, a promise will be returned to indicate
                // when the loading has completed (and / or progressed).
                this.deferred = $q.defer();
                this.promise = this.deferred.promise;
            }
            // STATIC METHODS.
            // I reload the given images [Array] and return a promise. The promise
            // will be resolved with the array of image locations.
            Preloader.preloadImages = function (imageLocations) {
                var preloader = new Preloader(imageLocations);
                return(preloader.load());
            };
            // INSTANCE METHODS.
            Preloader.prototype = {
                // Best practice for "instnceof" operator.
                constructor: Preloader,
                // PUBLIC METHODS.
                // I determine if the preloader has started loading images yet.
                isInitiated: function isInitiated() {
                    return(this.state !== this.states.PENDING);
                },
                // I determine if the preloader has failed to load all of the images.
                isRejected: function isRejected() {
                    return(this.state === this.states.REJECTED);
                },
                // I determine if the preloader has successfully loaded all of the images.
                isResolved: function isResolved() {
                    return(this.state === this.states.RESOLVED);
                },
                // I initiate the preload of the images. Returns a promise.
                load: function load() {
                    // If the images are already loading, return the existing promise.
                    if (this.isInitiated()) {
                        return(this.promise);
                    }
                    this.state = this.states.LOADING;
                    for (var i = 0; i < this.imageCount; i++) {
                        this.loadImageLocation(this.imageLocations[ i ]);
                    }
                    // Return the deferred promise for the load event.
                    return(this.promise);
                },
                // PRIVATE METHODS.
                // I handle the load-failure of the given image location.
                handleImageError: function handleImageError(imageLocation) {
                    this.errorCount++;
                    // If the preload action has already failed, ignore further action.
                    if (this.isRejected()) {
                        return;
                    }
                    this.state = this.states.REJECTED;
                    this.deferred.reject(imageLocation);
                },
                // I handle the load-success of the given image location.
                handleImageLoad: function handleImageLoad(imageLocation) {
                    this.loadCount++;
                    // If the preload action has already failed, ignore further action.
                    if (this.isRejected()) {
                        return;
                    }
                    // Notify the progress of the overall deferred. This is different
                    // than Resolving the deferred - you can call notify many times
                    // before the ultimate resolution (or rejection) of the deferred.
                    this.deferred.notify({
                        percent: Math.ceil(this.loadCount / this.imageCount * 100),
                        imageLocation: imageLocation
                    });
                    // If all of the images have loaded, we can resolve the deferred
                    // value that we returned to the calling context.
                    if (this.loadCount === this.imageCount) {
                        this.state = this.states.RESOLVED;
                        this.deferred.resolve(this.imageLocations);
                    }
                },
                // I load the given image location and then wire the load / error
                // events back into the preloader instance.
                // --
                // NOTE: The load/error events trigger a $digest.
                loadImageLocation: function loadImageLocation(imageLocation) {
                    var preloader = this;
                    // When it comes to creating the image object, it is critical that
                    // we bind the event handlers BEFORE we actually set the image
                    // source. Failure to do so will prevent the events from proper
                    // triggering in some browsers.
                    var image = $(new Image())
                            .load(
                                    function (event) {
                                        // Since the load event is asynchronous, we have to
                                        // tell AngularJS that something changed.
                                        $rootScope.$apply(
                                                function () {
                                                    preloader.handleImageLoad(event.target.src);
                                                    // Clean up object reference to help with the
                                                    // garbage collection in the closure.
                                                    preloader = image = event = null;
                                                }
                                        );
                                    }
                            )
                            .error(
                                    function (event) {
                                        // Since the load event is asynchronous, we have to
                                        // tell AngularJS that something changed.
                                        $rootScope.$apply(
                                                function () {
                                                    preloader.handleImageError(event.target.src);
                                                    // Clean up object reference to help with the
                                                    // garbage collection in the closure.
                                                    preloader = image = event = null;
                                                }
                                        );
                                    }
                            )
                            .prop("src", imageLocation)
                            ;
                }
            };
            // Return the factory instance.
            return(Preloader);
        }
);

var welcomeMsg = "\
-------------------------------------------------------------------------------------------------\n\
-------------------------------------------------------------------------------------------------\n\
\n\
                            .-') _     .-')           .-') _   ('-.   .-') _\n\
                           (  OO) )   ( OO ).        ( OO ) )_(  OO) (  OO) )\n\
            ,----.    .---./     '._ (_)---\\_)   ,--./ ,--,'(,------./     '._\n\
           '  .-./-')/_   ||'--...__)/    _ |    |   \\ |  |\\ |  .---'|'--...__)\n\
           |  |_( O- )|   |'--.  .--'\\  :` `.    |    \\|  | )|  |    '--.  .--'\n\
           |  | .--, \\|   |   |  |    '..`''.)   |  .     |/(|  '--.    |  |\n\
          (|  | '. (_/|   |   |  |   .-._)   \\   |  |\\    |  |  .--'    |  |\n\
           |  '--'  | |   |   |  |   \\       /.-.|  | \\   |  |  `---.   |  |\n\
            `------'  `---'   `--'    `-----' `-'`--'  `--'  `------'   `--'\n\
\n\
   __    _   _\n\
  ( /   /   //                   _/_                      /                                   /\n\
   / / /_  // _, __ _ _ _   _    /  __   _ _ _   __  ,   /_  __ _ _ _   _   ,_   __,  _,  _  /\n\
  (_/_/(/_(/_(__(_)/ / / /_(/_  (__(_)  / / / /_/ (_/_  / /_(_)/ / / /_(/__/|_)_(_/(_(_)_(/_'\n\
                                                   /                       /|         /|   o\n\
                                                  '                       (/         (/\n\
\n\
-------------------------------------------------------------------------------------------------\n\
-------------------------------------------------------------------------------------------------\n\
";
