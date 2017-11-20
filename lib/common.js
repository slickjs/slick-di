"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaKeys = {
    registration: Symbol.for('di:registration'),
    instanceActivator: Symbol.for('di:instance-activator'),
    dependencyResolver: Symbol.for('di:dependency-resolver'),
    paramTypes: 'design:paramtypes',
    properties: 'design:properties' // This should match, what tsc is emitting
};
exports.emptyParameters = Object.freeze([]);
var paramRegEx = /function[^(]*\(([^)]*)\)/i;
function getFunctionParameters(fn) {
    var cache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var params = Reflect.getOwnMetadata(exports.MetaKeys.paramTypes, fn);
    if (!params) {
        var match = fn.toString().match(paramRegEx);
        if (match) {
            params = match[1].replace(/\W+/, ' ').split(' ').map(function (x) {
                return x.replace(',', '').trim();
            }).filter(function (m) {
                return m !== '';
            });
            if (cache) Reflect.defineMetadata(exports.MetaKeys.paramTypes, params, fn);
        }
    }
    return params || [];
}
exports.getFunctionParameters = getFunctionParameters;