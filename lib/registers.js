"use strict";
/**
* Used to allow functions/classes to indicate that they should be registered as transients with the container.
*
* @class TransientRegistration
* @constructor
* @param {Object} [key] The key to register as.
*/

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TransientRegistration = function () {
    function TransientRegistration(key) {
        _classCallCheck(this, TransientRegistration);

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


    _createClass(TransientRegistration, [{
        key: "register",
        value: function register(container, key, fn) {
            container.registerTransient(this.key || key, fn);
        }
    }]);

    return TransientRegistration;
}();

exports.TransientRegistration = TransientRegistration;
/**
* Used to allow functions/classes to indicate that they should be registered as singletons with the container.
*
* @class SingletonRegistration
* @constructor
* @param {Object} [key] The key to register as.
*/

var SingletonRegistration = function () {
    function SingletonRegistration(keyOrRegisterInChild) {
        var registerInChild = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _classCallCheck(this, SingletonRegistration);

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


    _createClass(SingletonRegistration, [{
        key: "register",
        value: function register(container, key, fn) {
            var destination = this.registerInChild ? container : container.root;
            destination.registerSingleton(this.key || key, fn);
        }
    }]);

    return SingletonRegistration;
}();

exports.SingletonRegistration = SingletonRegistration;