"use strict";
/**
* Used to instantiate a class.
*
* @class ClassActivator
* @constructor
*/

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClassActivator = function () {
    function ClassActivator() {
        _classCallCheck(this, ClassActivator);
    }

    _createClass(ClassActivator, [{
        key: "invoke",
        value: function invoke(fn, args) {
            return Reflect.construct(fn, args);
        }
    }]);

    return ClassActivator;
}();

ClassActivator.instance = new ClassActivator();
exports.ClassActivator = ClassActivator;
/**
* Used to invoke a factory method.
*
* @class FactoryActivator
* @constructor
*/

var FactoryActivator = function () {
    function FactoryActivator() {
        _classCallCheck(this, FactoryActivator);
    }

    _createClass(FactoryActivator, [{
        key: "invoke",
        value: function invoke(fn, args) {
            return fn.apply(undefined, args);
        }
    }]);

    return FactoryActivator;
}();

FactoryActivator.instance = new FactoryActivator();
exports.FactoryActivator = FactoryActivator;

var AsyncClassActivator = function () {
    function AsyncClassActivator() {
        _classCallCheck(this, AsyncClassActivator);
    }

    _createClass(AsyncClassActivator, [{
        key: "invoke",
        value: function invoke(fn, args) {
            return Promise.all(args).then(function (args) {
                return Reflect.construct(fn, args);
            });
        }
    }]);

    return AsyncClassActivator;
}();

AsyncClassActivator.instance = new AsyncClassActivator();
exports.AsyncClassActivator = AsyncClassActivator;