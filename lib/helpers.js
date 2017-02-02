"use strict";
const common_1 = require("./common");
require("reflect-metadata");
exports.emptyParameters = Object.freeze([]);
const paramRegEx = /function[^(]*\(([^)]*)\)/i;
function getFunctionParameters(fn, cache = true) {
    //let params = <string[]>Metadata.getOwn(Metadata.paramTypes, fn)
    let params = Reflect.getOwnMetadata(common_1.MetaKeys.paramTypes, fn);
    if (!params) {
        let match = fn.toString().match(paramRegEx);
        if (match) {
            params = match[1].replace(/\W+/, ' ').split(' ').map(x => x.replace(',', '').trim())
                .filter(m => m !== '');
            if (cache)
                Reflect.defineMetadata(common_1.MetaKeys.paramTypes, params, fn);
        }
    }
    return params || [];
}
exports.getFunctionParameters = getFunctionParameters;
