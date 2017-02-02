
export const MetaKeys = {
    registration: Symbol.for('di:registration'),
    instanceActivator: Symbol.for('di:instance-activator'),
    dependencyResolver: Symbol.for('di:dependency-resolver'),
    paramTypes: 'design:paramtypes',
    properties: 'design:properties'
}

export var emptyParameters = Object.freeze([]);


const paramRegEx = /function[^(]*\(([^)]*)\)/i;

export function getFunctionParameters(fn: Function, cache: boolean = true): string[] {
    let params = Reflect.getOwnMetadata(MetaKeys.paramTypes, fn);
    if (!params) {
        let match = fn.toString().match(paramRegEx)
        if (match) {
            params = match[1].replace(/\W+/, ' ').split(' ').map(x => x.replace(',', '').trim())
                .filter(m => m !== '')
            if (cache)
                Reflect.defineMetadata(MetaKeys.paramTypes, params, fn);
        }
    }

    return params || [];
}

export interface IHandlerFunc {
    (c: IActivator): any
}

export interface IActivator {
    invoke(fn: Function, args?: any[], targetKey?: string): any
}

export interface IDependencyResolver {
    resolveDependencies(fn: Function, targetKey?: string): any[]
}

export interface IContainer {
    parent?: IContainer;
    root?: IContainer;
    get(key: any): any
    getAll(key: any): any[];
    hasHandler(key: any, parent: boolean): boolean;
    registerTransient(key: any, fn: Function, targetKey?: string);
    registerSingleton(key: any, fn: Function, targetKey?: string);
    registerInstance(key: any, instance: any);
}