(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["di"] = factory();
	else
		root["di"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var container_1 = __webpack_require__(1);
	exports.Container = container_1.Container;
	exports.DIBadKeyError = container_1.DIBadKeyError;
	var errors_1 = __webpack_require__(3);
	exports.DIAggregateError = errors_1.DIAggregateError;
	exports.DIError = errors_1.DIError;
	__export(__webpack_require__(6));
	__export(__webpack_require__(4));
	__export(__webpack_require__(5));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	const common_1 = __webpack_require__(2);
	const errors_1 = __webpack_require__(3);
	const activators_1 = __webpack_require__(4);
	const resolvers_1 = __webpack_require__(5);
	//import * as Debug from 'debug';
	//const debug = Debug("di");
	var counter = 0;
	function genid() {
	    return ++counter + "";
	}
	class DIBadKeyError extends errors_1.DIError {
	    constructor(message) {
	        super(message);
	        this.name = 'BadKeyError';
	        this.message = "key not registered with container";
	    }
	}
	exports.DIBadKeyError = DIBadKeyError;
	class Container {
	    constructor(info) {
	        this.entries = new Map();
	        this.constructionInfo = info || new Map();
	        this.id = genid();
	    }
	    get root() {
	        let root = this,
	            tmp = root;
	        while (tmp) {
	            tmp = root.parent;
	            if (tmp) root = tmp;
	        }
	        return root;
	    }
	    /**
	     * Inspects the container to determine if a particular key has been registred.
	    *
	    * @method hasHandler
	    * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
	    * @param {Boolean} [checkParent=false] Indicates whether or not to check the parent container hierarchy.
	    * @return {Boolean} Returns true if the key has been registred; false otherwise.
	    */
	    hasHandler(key, checkParent = false) {
	        if (key === null || key === undefined) {
	            throw new DIBadKeyError();
	        }
	        return this.entries.has(key) || checkParent && this.parent && this.parent.hasHandler(key, checkParent);
	    }
	    /**
	    * Registers a type (constructor function) by inspecting its registration annotations. If none are found, then the default singleton registration is used.
	    *
	    * @method autoRegister
	    * @param {Function} fn The constructor function to use when the dependency needs to be instantiated.
	    * @param {Object} [key] The key that identifies the dependency at resolution time; usually a constructor function.
	    */
	    autoRegister(fn, key, targetKey) {
	        var registration;
	        if (fn === null || fn === undefined) {
	            throw new DIBadKeyError('no key');
	        }
	        if (typeof fn === 'function') {
	            registration = Reflect.get(fn, common_1.MetaKeys.registration, targetKey); // Metadata.get(Metadata.registration, fn, targetKey);
	            if (registration !== undefined) {
	                registration.register(this, key || fn, fn);
	            } else {
	                this.registerSingleton(key || fn, fn, targetKey);
	            }
	        } else {
	            this.registerInstance(fn, fn);
	        }
	    }
	    /**
	    * Unregisters based on key.
	    *
	    * @method unregister
	    * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
	    */
	    unregister(key) {
	        //debug('%s: Unregister key: %s', this.id, key);
	        this.entries.delete(key);
	    }
	    /**
	    * Resolves a single instance based on the provided key.
	    *
	    * @method get
	    * @param {Object} key The key that identifies the object to resolve.
	    * @return {Object} Returns the resolved instance.
	    */
	    get(key, targetKey) {
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
	        if (this.parent && this.parent.hasHandler(key)) {
	            //debug("%s: found key '%s' on parent", this.id, key);
	            return this.parent.get(key, targetKey);
	        }
	        // No point in registrering a string
	        if (typeof key === 'string') {
	            throw errors_1.createError('DIResolveError', 'no component registered for key: ' + key);
	        }
	        this.autoRegister(key, targetKey);
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
	    getAll(key) {
	        var entry;
	        if (key === null || key === undefined) {
	            throw new DIBadKeyError();
	        }
	        entry = this.entries.get(key);
	        if (entry !== undefined) {
	            return entry.map(x => x(this));
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
	    createChild() {
	        let childContainer = new Container(this.constructionInfo);
	        childContainer.parent = this;
	        //debug("%s: Create child container: %s", this.id, childContainer.id);
	        return childContainer;
	    }
	    /**
	     * Resolve dependencies for the given function
	     * @method resolveDependencies
	     * @param {Function} fn
	     * @return {Array<any>}
	     */
	    resolveDependencies(fn, targetKey) {
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
	                message += ` The argument at index ${i} (key:${keys[i]}) could not be satisfied.`;
	            }
	            //debug('resolve error %s', e)
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
	    invoke(fn, deps, targetKey) {
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
	            //debug("%s: invoking '%s', with dependencies:", this.id, fn.name, info.keys);
	            return info.activator.invoke(fn, args, targetKey, keys);
	        } catch (e) {
	            var activatingText = info.activator instanceof activators_1.ClassActivator ? 'instantiating' : 'invoking';
	            var message = `Error ${activatingText} ${fn.name}.`;
	            //debug('invoke error %s', e)
	            message += ' Check the inner error for details.';
	            throw errors_1.createError("DIInvokeError", message, e);
	        }
	    }
	    registerInstance(key, instance) {
	        //debug("%s: Register instance %s", this.id, key);
	        this.registerHandler(key, _ => instance);
	    }
	    registerTransient(key, fn, targetKey) {
	        //debug("%s: Register transient %s", this.id, key);
	        this.registerHandler(key, x => x.invoke(fn, null, targetKey));
	    }
	    registerSingleton(key, fn, targetKey) {
	        //debug("%s: Register singleton %s", this.id, key);
	        var singleton;
	        this.registerHandler(key, x => singleton || (singleton = x.invoke(fn, null, targetKey)));
	    }
	    registerHandler(key, handler) {
	        this._getOrCreateEntry(key).push(handler);
	    }
	    _getOrCreateEntry(key) {
	        var entry;
	        if (key === null || key === undefined) {
	            throw new errors_1.DIError('key cannot be null or undefined.  (Are you trying to inject something that doesn\'t exist with DI?)');
	        }
	        entry = this.entries.get(key);
	        if (entry === undefined) {
	            entry = [];
	            this.entries.set(key, entry);
	        }
	        return entry;
	    }
	    _getOrCreateConstructionSet(fn, targetKey) {
	        var info = this.constructionInfo.get(fn);
	        if (info === undefined) {
	            info = this._createConstructionSet(fn, targetKey);
	            this.constructionInfo.set(fn, info);
	        }
	        return info;
	    }
	    _createConstructionSet(fn, targetKey) {
	        let info = {
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
	}
	exports.Container = Container;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	exports.MetaKeys = {
	    registration: Symbol.for('di:registration'),
	    instanceActivator: Symbol.for('di:instance-activator'),
	    dependencyResolver: Symbol.for('di:dependency-resolver'),
	    paramTypes: 'design:paramtypes',
	    properties: 'design:properties'
	};
	exports.emptyParameters = Object.freeze([]);
	const paramRegEx = /function[^(]*\(([^)]*)\)/i;
	function getFunctionParameters(fn, cache = true) {
	    let params = Reflect.getOwnMetadata(exports.MetaKeys.paramTypes, fn);
	    if (!params) {
	        let match = fn.toString().match(paramRegEx);
	        if (match) {
	            params = match[1].replace(/\W+/, ' ').split(' ').map(x => x.replace(',', '').trim()).filter(m => m !== '');
	            if (cache) Reflect.defineMetadata(exports.MetaKeys.paramTypes, params, fn);
	        }
	    }
	    return params || [];
	}
	exports.getFunctionParameters = getFunctionParameters;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	class DIError extends Error {
	    constructor(message) {
	        super(message);
	        this.message = message;
	    }
	    toString() {
	        return `[${this.name}: ${this.message}]`;
	    }
	}
	exports.DIError = DIError;
	class DIAggregateError extends DIError {
	    constructor(message, errors) {
	        super(message);
	        this.error = errors;
	    }
	    toString() {
	        if (this.error == null) {
	            return `[${this.name}: ${this.message}]`;
	        } else {
	            return String.prototype.toString.call(this.error);
	        }
	    }
	}
	exports.DIAggregateError = DIAggregateError;
	function createError(name, message, error) {
	    let e;
	    if (error) {
	        e = new DIAggregateError(message, error);
	    } else {
	        e = new DIError(message);
	    }
	    e.name = name;
	    return e;
	}
	exports.createError = createError;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	/**
	* Used to instantiate a class.
	*
	* @class ClassActivator
	* @constructor
	*/

	class ClassActivator {
	    invoke(fn, args) {
	        return Reflect.construct(fn, args);
	    }
	}
	ClassActivator.instance = new ClassActivator();
	exports.ClassActivator = ClassActivator;
	/**
	* Used to invoke a factory method.
	*
	* @class FactoryActivator
	* @constructor
	*/
	class FactoryActivator {
	    invoke(fn, args) {
	        return fn.apply(undefined, args);
	    }
	}
	FactoryActivator.instance = new FactoryActivator();
	exports.FactoryActivator = FactoryActivator;
	class AsyncClassActivator {
	    invoke(fn, args) {
	        return Promise.all(args).then(args => {
	            return Reflect.construct(fn, args);
	        });
	    }
	}
	AsyncClassActivator.instance = new AsyncClassActivator();
	exports.AsyncClassActivator = AsyncClassActivator;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	/**
	* An abstract resolver used to allow functions/classes to specify custom dependency resolution logic.
	*
	* @class Resolver
	* @constructor
	*/

	class Resolver {}
	exports.Resolver = Resolver;
	/**
	* Used to allow functions/classes to specify lazy resolution logic.
	*
	* @class Lazy
	* @constructor
	* @extends Resolver
	* @param {Object} key The key to lazily resolve.
	*/
	class Lazy extends Resolver {
	    constructor(key) {
	        super();
	        this.key = key;
	    }
	    /**
	    * Called by the container to lazily resolve the dependency into a lazy locator function.
	    *
	    * @method get
	    * @param {Container} container The container to resolve from.
	    * @return {Function} Returns a function which can be invoked at a later time to obtain the actual dependency.
	    */
	    get(container) {
	        return () => {
	            return container.get(this.key);
	        };
	    }
	    /**
	    * Creates a Lazy Resolver for the supplied key.
	    *
	    * @method of
	    * @static
	    * @param {Object} key The key to lazily resolve.
	    * @return {Lazy} Returns an insance of Lazy for the key.
	    */
	    static of(key) {
	        return new Lazy(key);
	    }
	}
	exports.Lazy = Lazy;
	/**
	* Used to allow functions/classes to specify resolution of all matches to a key.
	*
	* @class All
	* @constructor
	* @extends Resolver
	* @param {Object} key The key to lazily resolve all matches for.
	*/
	class All extends Resolver {
	    constructor(key) {
	        super();
	        this.key = key;
	    }
	    /**
	    * Called by the container to resolve all matching dependencies as an array of instances.
	    *
	    * @method get
	    * @param {Container} container The container to resolve from.
	    * @return {Object[]} Returns an array of all matching instances.
	    */
	    get(container) {
	        return container.getAll(this.key);
	    }
	    /**
	    * Creates an All Resolver for the supplied key.
	    *
	    * @method of
	    * @static
	    * @param {Object} key The key to resolve all instances for.
	    * @return {All} Returns an insance of All for the key.
	    */
	    static of(key) {
	        return new All(key);
	    }
	}
	exports.All = All;
	/**
	* Used to allow functions/classes to specify an optional dependency, which will be resolved only if already registred with the container.
	*
	* @class Optional
	* @constructor
	* @extends Resolver
	* @param {Object} key The key to optionally resolve for.
	* @param {Boolean} [checkParent=false] Indicates whether or not the parent container hierarchy should be checked.
	*/
	class Optional extends Resolver {
	    constructor(key, checkParent = false) {
	        super();
	        this.key = key;
	        this.checkParent = checkParent;
	    }
	    /**
	    * Called by the container to provide optional resolution of the key.
	    *
	    * @method get
	    * @param {Container} container The container to resolve from.
	    * @return {Object} Returns the instance if found; otherwise null.
	    */
	    get(container) {
	        if (container.hasHandler(this.key, this.checkParent)) {
	            return container.get(this.key);
	        }
	        return null;
	    }
	    /**
	    * Creates an Optional Resolver for the supplied key.
	    *
	    * @method of
	    * @static
	    * @param {Object} key The key to optionally resolve for.
	    * @param {Boolean} [checkParent=false] Indicates whether or not the parent container hierarchy should be checked.
	    * @return {Optional} Returns an insance of Optional for the key.
	    */
	    static of(key, checkParent = false) {
	        return new Optional(key, checkParent);
	    }
	}
	exports.Optional = Optional;
	/**
	* Used to inject the dependency from the parent container instead of the current one.
	*
	* @class Parent
	* @constructor
	* @extends Resolver
	* @param {Object} key The key to resolve from the parent container.
	*/
	class Parent extends Resolver {
	    constructor(key) {
	        super();
	        this.key = key;
	    }
	    /**
	    * Called by the container to load the dependency from the parent container
	    *
	    * @method get
	    * @param {Container} container The container to resolve the parent from.
	    * @return {Function} Returns the matching instance from the parent container
	    */
	    get(container) {
	        return container.parent ? container.parent.get(this.key) : null;
	    }
	    /**
	    * Creates a Parent Resolver for the supplied key.
	    *
	    * @method of
	    * @static
	    * @param {Object} key The key to resolve.
	    * @return {Parent} Returns an insance of Parent for the key.
	    */
	    static of(key) {
	        return new Parent(key);
	    }
	}
	exports.Parent = Parent;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	const common_1 = __webpack_require__(2);
	const registers_1 = __webpack_require__(7);
	const activators_1 = __webpack_require__(4);
	/**
	 * Auto inject dependencies.
	 */
	function autoinject(target) {
	    target.inject = Reflect.getOwnMetadata(common_1.MetaKeys.paramTypes, target) || common_1.emptyParameters;
	}
	exports.autoinject = autoinject;
	function inject(...rest) {
	    return function (target) {
	        target.inject = rest;
	    };
	}
	exports.inject = inject;
	function registration(value, targetKey) {
	    return function (target) {
	        Reflect.defineMetadata(common_1.MetaKeys.registration, value, target, targetKey);
	    };
	}
	exports.registration = registration;
	function transient(key, targetKey) {
	    return registration(new registers_1.TransientRegistration(key), targetKey);
	}
	exports.transient = transient;
	function singleton(keyOrRegisterInChild, registerInChild = false, targetKey) {
	    return registration(new registers_1.SingletonRegistration(keyOrRegisterInChild, registerInChild), targetKey);
	}
	exports.singleton = singleton;
	function instanceActivator(value, targetKey) {
	    return function (target) {
	        Reflect.defineMetadata(common_1.MetaKeys.instanceActivator, value, target, targetKey);
	    };
	}
	exports.instanceActivator = instanceActivator;
	function factory() {
	    return instanceActivator(activators_1.FactoryActivator.instance);
	}
	exports.factory = factory;
	function dependencyResolve(value, targetKey) {
	    return function (target) {
	        Reflect.defineMetadata(common_1.MetaKeys.dependencyResolver, value, target, targetKey);
	    };
	}
	exports.dependencyResolve = dependencyResolve;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	/**
	* Used to allow functions/classes to indicate that they should be registered as transients with the container.
	*
	* @class TransientRegistration
	* @constructor
	* @param {Object} [key] The key to register as.
	*/

	class TransientRegistration {
	    constructor(key) {
	        this.key = key;
	    }
	    /**
	    * Called by the container to register the annotated function/class as transient.
	    *
	    * @method register
	    * @param {Container} container The container to register with.
	    * @param {Object} key The key to register as.
	    * @param {Object} fn The function to register (target of the annotation).
	    */
	    register(container, key, fn) {
	        container.registerTransient(this.key || key, fn);
	    }
	}
	exports.TransientRegistration = TransientRegistration;
	/**
	* Used to allow functions/classes to indicate that they should be registered as singletons with the container.
	*
	* @class SingletonRegistration
	* @constructor
	* @param {Object} [key] The key to register as.
	*/
	class SingletonRegistration {
	    constructor(keyOrRegisterInChild, registerInChild = false) {
	        if (typeof keyOrRegisterInChild === 'boolean') {
	            this.registerInChild = keyOrRegisterInChild;
	        } else {
	            this.key = keyOrRegisterInChild;
	            this.registerInChild = registerInChild;
	        }
	    }
	    /**
	    * Called by the container to register the annotated function/class as a singleton.
	    *
	    * @method register
	    * @param {Container} container The container to register with.
	    * @param {Object} key The key to register as.
	    * @param {Object} fn The function to register (target of the annotation).
	    */
	    register(container, key, fn) {
	        var destination = this.registerInChild ? container : container.root;
	        destination.registerSingleton(this.key || key, fn);
	    }
	}
	exports.SingletonRegistration = SingletonRegistration;

/***/ }
/******/ ])
});
;