import { IHandlerFunc, IActivator, IDependencyResolver, IContainer } from './common';
import { DIError } from './errors';
export interface ConstructionInfo {
    activator: IActivator;
    keys?: string[];
    dependencyResolver?: IDependencyResolver;
}
export declare class DIBadKeyError extends DIError {
    name: string;
    message: string;
    constructor(message?: string);
}
export declare class Container implements IActivator, IContainer, IDependencyResolver {
    private entries;
    private constructionInfo;
    readonly parent?: Container;
    readonly id: string;
    constructor(info?: Map<Function, ConstructionInfo>, parent?: Container);
    readonly root: IContainer;
    makeGlobal(): void;
    /**
    * Inspects the container to determine if a particular key has been registred.
    *
    * @method hasHandler
    * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
    * @param {Boolean} [checkParent=false] Indicates whether or not to check the parent container hierarchy.
    * @return {Boolean} Returns true if the key has been registred; false otherwise.
    */
    hasHandler(key: any, checkParent?: boolean): boolean;
    /**
    * Registers a type (constructor function) by inspecting its registration annotations. If none are found, then the default transient registration is used.
    *
    * @method autoRegister
    * @param {Function} fn The constructor function to use when the dependency needs to be instantiated.
    * @param {Object} [key] The key that identifies the dependency at resolution time; usually a constructor function.
    */
    autoRegister(fn: any, key?: any, targetKey?: string, resolveIn?: IContainer): void;
    /**
    * Unregisters based on key.
    *
    * @method unregister
    * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
    */
    unregister(key: any): void;
    /**
    * Resolves a single instance based on the provided key.
    * If the key is not found, the container will try to auto resolve it.
    *
    * @method get
    * @param {Object} key The key that identifies the object to resolve.
    * @return {Object} Returns the resolved instance.
    */
    get<T>(key: any, targetKey?: string, resolveIn?: IContainer): T;
    /**
    * Resolves all instance registered under the provided key.
    *
    * @method getAll
    * @param {Object} key The key that identifies the objects to resolve.
    * @return {Object[]} Returns an array of the resolved instances.
    */
    getAll(key: any): any[];
    /**
    * Creates a new dependency injection container whose parent is the current container.
    *
    * @method createChild
    * @return {Container} Returns a new container instance parented to this.
    */
    createChild(): IContainer;
    /**
     * Resolve dependencies for the given function
     * @method resolveDependencies
     * @param {Function} fn
     * @return {Array<any>}
     */
    resolveDependencies(fn: Function, targetKey?: string): any[];
    /**
    * Invokes a function, recursively resolving its dependencies.
    *
    * @method invoke
    * @param {Function} fn The function to invoke with the auto-resolved dependencies.
    * @param {any[]} [deps] Additional function dependencies to use during invocation.
    * @return {Object} Returns the instance resulting from calling the function.
    */
    invoke(fn: Function, deps?: any[], targetKey?: string): any;
    registerInstance(key: any, instance: any): void;
    registerTransient(key: any, fn: Function, targetKey?: string): void;
    registerSingleton(key: any, fn: Function, targetKey?: string): void;
    registerHandler(key: any, handler: IHandlerFunc): void;
    protected _getOrCreateEntry(key: string): IHandlerFunc[];
    protected _getOrCreateConstructionSet(fn: Function, targetKey: string): ConstructionInfo;
    private _createConstructionSet(fn, targetKey);
}
export declare namespace Container {
    function makeGlobal(container: Container): void;
    function global(): Container;
}
