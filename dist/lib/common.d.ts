export declare const MetaKeys: {
    registration: symbol;
    instanceActivator: symbol;
    dependencyResolver: symbol;
    paramTypes: string;
    properties: string;
};
export declare var emptyParameters: ReadonlyArray<any>;
export declare function getFunctionParameters(fn: Function, cache?: boolean): string[];
export interface IHandlerFunc {
    (c: IActivator): any;
}
export interface IActivator {
    invoke(fn: Function, args?: any[], targetKey?: string): any;
}
export interface IDependencyResolver {
    resolveDependencies(fn: Function, targetKey?: string): any[];
}
export interface IContainer {
    parent?: IContainer;
    root?: IContainer;
    get(key: any): any;
    getAll(key: any): any[];
    hasHandler(key: any, parent: boolean): boolean;
    registerTransient(key: any, fn: Function, targetKey?: string): any;
    registerSingleton(key: any, fn: Function, targetKey?: string): any;
}
