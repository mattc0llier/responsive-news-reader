// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"index.js":[function(require,module,exports) {
// elements avilable on page
var mainNode = document.querySelector("main");
var switchLanguageButton = document.querySelector("#switch-languages");
var loadNextPageButton = document.querySelector("#load-next-page");
var submitSearchButton = document.querySelector("#search-button");
var formNode = document.querySelector("footer form");
var searchInput = document.querySelector("#search-field");
var searchResults = document.querySelector(".search-results");

// Breaking out API object to display
function displayDataOnPage(newsStories) {
  //console.log(newsStories);
  var articlesArr = newsStories.articles;
  var articleKeys = Object.keys(articlesArr[0]);
  //console.log(articleKeys);
  articlesArr.forEach(function (article) {
    //  console.log(article.title);
    //  trigger the creation of a story for each node
    createStory(article);
  });
}
// Show if error with API call
function displayErrorToUser(error) {
  createStory(error);
}

//Create story componenets
var createTitle = function createTitle(title, url) {
  return "<a href=\"" + url + "\"><h2>" + title + "</h2></a>";
};
var createImg = function createImg(image) {
  return "<img src=\"" + image + "\">";
};
var createDescription = function createDescription(description) {
  return "<p>" + description + "</p>";
};
var createTimeCountry = function createTimeCountry(time, country) {
  var currentDateTime = Date.now();
  //console.log(time);
  var jsTime = new Date(time);

  var articleTimestamp = jsTime.getTime();
  timeDifference = currentDateTime - articleTimestamp;
  //console.log(timeDifference);
  time = timeDifference / 1000 / 60 / 60 / 24;
  //console.log(time);
  return "<p>" + time.toFixed(0) + " days ago | " + country + "</p>";
};
//Assemble story componenets
var createStory = function createStory(article) {
  var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "story";

  var node = document.createElement("div");
  var storyHTML = "<div class=\"article-img\"><a href=\"" + article.url + "\">" + createImg(article.urlToImage) + "</a></div><div class=\"article-text\">" + createTitle(article.title, article.url) + "\n  " + createDescription(article.description) + createTimeCountry(article.publishedAt, article.country) + "</div>";
  node.className = className;
  node.innerHTML = storyHTML;
  mainNode.appendChild(node);
  //console.log(storyHTML);
};

// Global variabel defaults to pass into API.
var language = "en";
var searchTerm = "";
var pageSize = 10;

// fetch news api
var loadAPI = function loadAPI(language, searchTerm, pageSize) {
  mainNode.innerHTML = "";
  console.log(language, searchTerm, pageSize);
  fetch("https://newsapi.org/v2/everything?q=" + searchTerm + "&pageSize=" + pageSize + "&language=" + language + "&sortBy=popularity&domains=bbc.co.uk,lemonde.fr,guardian.com,nytimes.com,sina.com.cn&apiKey=ca8681b5ce9447468962c7f40280c85f").then(function (response) {
    return response.json();
  }).then(function (body) {
    displayDataOnPage(body);
  }).catch(function (error) {
    displayErrorToUser(error);
  });
};

//// Features that happen on event listen

//Switch the language
switchLanguageButton.addEventListener("click", function (event) {
  //console.log(event);
  //console.log(language);
  //console.log(typeof language);
  if (language === "en") {
    language = "fr";
  } else if (language === "fr") {
    language = "en";
  }

  //console.log(language);
  loadAPI(language, searchTerm, pageSize);
});

// load in 10 more results
loadNextPageButton.addEventListener("click", function (event) {
  //console.log(event);
  //console.log(pageSize);
  pageSize = pageSize + 10;
  loadAPI(language, searchTerm, pageSize);
});

// submit a search query to the API
submitSearchButton.addEventListener("sumbit", function (event) {
  console.log("form submitted");
  console.log(event.target);
  searchText = searchInput.value;
  console.log(searchText);
  // let searchResut = searchInput;
  searchTerm = searchText;
  loadAPI(language, searchTerm, pageSize);
});

loadAPI(language, searchTerm, pageSize);
},{}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '50313' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/responsive-news-reader.a140e609.map