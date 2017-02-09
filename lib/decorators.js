"use strict";

var common_1 = require("./common");
var registers_1 = require("./registers");
var activators_1 = require("./activators");
/**
 * Auto inject dependencies.
 */
function autoinject(target) {
    target.inject = Reflect.getOwnMetadata(common_1.MetaKeys.paramTypes, target) || common_1.emptyParameters;
}
exports.autoinject = autoinject;
function inject() {
    for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
        rest[_key] = arguments[_key];
    }

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
function singleton(keyOrRegisterInChild) {
    var registerInChild = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var targetKey = arguments[2];

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