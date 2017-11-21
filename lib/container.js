"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var errors_1 = require("./errors");
var activators_1 = require("./activators");
var resolvers_1 = require("./resolvers");
var counter = 0;
function genid() {
    return ++counter + "";
}

var DIBadKeyError = function (_errors_1$DIError) {
    _inherits(DIBadKeyError, _errors_1$DIError);

    function DIBadKeyError(message) {
        _classCallCheck(this, DIBadKeyError);

        var _this = _possibleConstructorReturn(this, (DIBadKeyError.__proto__ || Object.getPrototypeOf(DIBadKeyError)).call(this, message));

        _this.name = 'BadKeyError';
        _this.message = "key not registered with container";
        return _this;
    }

    return DIBadKeyError;
}(errors_1.DIError);

exports.DIBadKeyError = DIBadKeyError;

var Container = function () {
    function Container(info, parent) {
        _classCallCheck(this, Container);

        this.entries = new Map();
        this.constructionInfo = info || new Map();
        this.id = genid();
        this.parent = parent;
    }

    _createClass(Container, [{
        key: "makeGlobal",
        value: function makeGlobal() {
            Container.makeGlobal(this);
        }
        /**
        * Inspects the container to determine if a particular key has been registred.
        *
        * @method hasHandler
        * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
        * @param {Boolean} [checkParent=false] Indicates whether or not to check the parent container hierarchy.
        * @return {Boolean} Returns true if the key has been registred; false otherwise.
        */

    }, {
        key: "hasHandler",
        value: function hasHandler(key) {
            var checkParent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (key === null || key === undefined) {
                throw new DIBadKeyError();
            }
            return this.entries.has(key) || checkParent && this.parent && this.parent.hasHandler(key, checkParent);
        }
        /**
        * Registers a type (constructor function) by inspecting its registration annotations. If none are found, then the default transient registration is used.
        *
        * @method autoRegister
        * @param {Function} fn The constructor function to use when the dependency needs to be instantiated.
        * @param {Object} [key] The key that identifies the dependency at resolution time; usually a constructor function.
        */

    }, {
        key: "autoRegister",
        value: function autoRegister(fn, key, targetKey, resolveIn) {
            var registration;
            var container = resolveIn || this;
            if (fn === null || fn === undefined) {
                throw new DIBadKeyError('no key');
            }
            if (typeof fn === 'function') {
                registration = Reflect.getOwnMetadata(common_1.MetaKeys.registration, fn, targetKey); // Metadata.get(Metadata.registration, fn, targetKey);
                if (registration !== undefined) {
                    registration.register(container, key || fn, fn);
                } else {
                    container.registerTransient(key || fn, fn, targetKey);
                }
            } else {
                container.registerInstance(fn, fn);
            }
        }
        /**
        * Unregisters based on key.
        *
        * @method unregister
        * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
        */

    }, {
        key: "unregister",
        value: function unregister(key) {
            //debug('%s: Unregister key: %s', this.id, key);
            this.entries.delete(key);
        }
        /**
        * Resolves a single instance based on the provided key.
        * If the key is not found, the container will try to auto resolve it.
        *
        * @method get
        * @param {Object} key The key that identifies the object to resolve.
        * @return {Object} Returns the resolved instance.
        */

    }, {
        key: "get",
        value: function get(key, targetKey, resolveIn) {
            //debug("%s: Get %s, target: %s", this.id, String(key), targetKey);
            var entry;
            if (key === null || key === undefined) {
                throw new DIBadKeyError();
            }
            if (key === Container) {
                return this;
            }
            if (key instanceof resolvers_1.Resolver) {
                return key.get(this);
            }
            entry = this.entries.get(key);
            if (entry !== undefined) {
                return entry[0](this);
            }
            if (this.parent && this.parent.hasHandler(key, true)) {
                //debug("%s: found key '%s' on parent", this.id, key);
                return this.parent.get(key, targetKey, resolveIn);
            }
            // No point in auto registrering a string or symbol or number
            if (typeof key === 'string' || (typeof key === "undefined" ? "undefined" : _typeof(key)) === 'symbol' || typeof key === 'number') {
                throw errors_1.createError('DIResolveError', 'no component registered for key: ' + String(key));
            }
            this.autoRegister(key, null, targetKey, resolveIn);
            entry = this.entries.get(key);
            return entry[0](this);
        }
        /**
        * Resolves all instance registered under the provided key.
        *
        * @method getAll
        * @param {Object} key The key that identifies the objects to resolve.
        * @return {Object[]} Returns an array of the resolved instances.
        */

    }, {
        key: "getAll",
        value: function getAll(key) {
            var _this2 = this;

            var entry;
            if (key === null || key === undefined) {
                throw new DIBadKeyError();
            }
            entry = this.entries.get(key);
            if (entry !== undefined) {
                return entry.map(function (x) {
                    return x(_this2);
                });
            }
            if (this.parent) {
                return this.parent.getAll(key);
            }
            return [];
        }
        /**
        * Creates a new dependency injection container whose parent is the current container.
        *
        * @method createChild
        * @return {Container} Returns a new container instance parented to this.
        */

    }, {
        key: "createChild",
        value: function createChild() {
            var childContainer = new Container(this.constructionInfo, this);
            //debug("%s: Create child container: %s", this.id, childContainer.id);
            return childContainer;
        }
        /**
         * Resolve dependencies for the given function
         * @method resolveDependencies
         * @param {Function} fn
         * @return {Array<any>}
         */

    }, {
        key: "resolveDependencies",
        value: function resolveDependencies(fn, targetKey) {
            //debug("%s: Resolve dependencies for: %j", this.id, fn.name);
            var info = this._getOrCreateConstructionSet(fn, targetKey),
                keys = info.keys,
                args = new Array(keys.length);
            var i, ii;
            try {
                for (i = 0, ii = keys.length; i < ii; ++i) {
                    args[i] = this.get(keys[i]);
                }
            } catch (e) {
                var message = "Error";
                if (i < ii) {
                    message += " The argument at index " + i + " (key:" + keys[i] + ") could not be satisfied.";
                }
                throw errors_1.createError("DependencyError", message, e);
            }
            return args;
        }
        /**
        * Invokes a function, recursively resolving its dependencies.
        *
        * @method invoke
        * @param {Function} fn The function to invoke with the auto-resolved dependencies.
        * @param {any[]} [deps] Additional function dependencies to use during invocation.
        * @return {Object} Returns the instance resulting from calling the function.
        */

    }, {
        key: "invoke",
        value: function invoke(fn, deps, targetKey) {
            var info = this._getOrCreateConstructionSet(fn, targetKey);
            try {
                var keys, args;
                if (info.dependencyResolver) {
                    args = info.dependencyResolver.resolveDependencies(fn);
                } else {
                    args = this.resolveDependencies(fn, targetKey);
                }
                if (deps !== undefined && Array.isArray(deps)) {
                    args = args.concat(deps);
                }
                return info.activator.invoke(fn, args, targetKey, keys);
            } catch (e) {
                var activatingText = info.activator instanceof activators_1.ClassActivator ? 'instantiating' : 'invoking';
                var message = "Error " + activatingText + " " + fn.name + ".";
                message += ' Check the inner error for details.';
                throw errors_1.createError("DIInvokeError", message, e);
            }
        }
    }, {
        key: "registerInstance",
        value: function registerInstance(key, instance) {
            //debug("%s: Register instance %s", this.id, key);
            this.registerHandler(key, function (_) {
                return instance;
            });
        }
    }, {
        key: "registerTransient",
        value: function registerTransient(key, fn, targetKey) {
            //debug("%s: Register transient %s", this.id, key);
            this.registerHandler(key, function (x) {
                return x.invoke(fn, null, targetKey);
            });
        }
    }, {
        key: "registerSingleton",
        value: function registerSingleton(key, fn, targetKey) {
            //debug("%s: Register singleton %s", this.id, key);
            var singleton;
            this.registerHandler(key, function (x) {
                return singleton || (singleton = x.invoke(fn, null, targetKey));
            });
        }
    }, {
        key: "registerHandler",
        value: function registerHandler(key, handler) {
            this._getOrCreateEntry(key).push(handler);
        }
    }, {
        key: "_getOrCreateEntry",
        value: function _getOrCreateEntry(key) {
            if (key === null || key === undefined) {
                throw new errors_1.DIError('key cannot be null or undefined.  (Are you trying to inject something that doesn\'t exist with DI?)');
            }
            var entry = this.entries.get(key);
            if (entry === undefined) {
                entry = [];
                this.entries.set(key, entry);
            }
            return entry;
        }
    }, {
        key: "_getOrCreateConstructionSet",
        value: function _getOrCreateConstructionSet(fn, targetKey) {
            var info = this.constructionInfo.get(fn);
            if (info === undefined) {
                info = this._createConstructionSet(fn, targetKey);
                this.constructionInfo.set(fn, info);
            }
            return info;
        }
    }, {
        key: "_createConstructionSet",
        value: function _createConstructionSet(fn, targetKey) {
            var info = {
                activator: Reflect.getOwnMetadata(common_1.MetaKeys.instanceActivator, fn, targetKey) || activators_1.ClassActivator.instance,
                dependencyResolver: Reflect.getOwnMetadata(common_1.MetaKeys.dependencyResolver, fn, targetKey) || this
            };
            if (fn.inject !== undefined) {
                if (typeof fn.inject === 'function') {
                    info.keys = fn.inject();
                } else {
                    info.keys = fn.inject;
                }
                return info;
            }
            info.keys = Reflect.getOwnMetadata(common_1.MetaKeys.paramTypes, fn, targetKey) || common_1.getFunctionParameters(fn, true) || common_1.emptyParameters;
            return info;
        }
    }, {
        key: "root",
        get: function get() {
            var root = this,
                tmp = root;
            while (tmp) {
                tmp = root.parent;
                if (tmp) root = tmp;
            }
            return root;
        }
    }]);

    return Container;
}();

exports.Container = Container;
(function (Container) {
    var _global;
    function makeGlobal(container) {
        _global = container;
    }
    Container.makeGlobal = makeGlobal;
    function global() {
        return _global;
    }
    Container.global = global;
})(Container = exports.Container || (exports.Container = {}));