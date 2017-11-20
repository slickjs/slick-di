# Slick-DI

slick-di is a [`Ioc`-container](https://en.wikipedia.org/wiki/Inversion_of_control) and a constructor based [`dependency-injector`](https://en.wikipedia.org/wiki/Dependency_injection)

Usage:

```javascript
// ES5
function MyClass(service) {
    this.service = service;
}

MyClass.inject = [MyService];

// Babel decorators
@inject(MyService)
class MyClass{
    constructor(service) {}
}

```
## Typescript

Typescript needs `experimentalDecorators` to be eanbled, if used in conjuntion with decorators (which is recommended)
For autoinjection to work, you'll need to enable `emitDecoratorMetadata` also. 

```typescript

class MyService {
    say(what:string) {
        console.log("MyService says: " + what);
    }
}

@autoinject // You'll needs to enable 
// or 
//@inject(MyService)
class MyClass  {
    constructor(
        public service: MyService
    )
}


const myClass = container.get<MyClass>(MyClass);



```


## Container API

The container has to main 2 methods. A method for registering a factory method, and a method for getting and executing that factory

### Container#registerHandle(key:any, value:(IActivator) => any)

You can use any type key. 
The values must be a function which takes an arguments, and return a value

```javascript

const MyKey = Symbol.for("MyKey")

container.registerHandle(MyKey, (activator) => {
    return "Hello, World!";
});


console.log("Equal", container.get(MyKey) === 'Hello, World!');
```

There are som convienent methods for common scenarios

```javascript

const MyKey = Symbol.for("MyKey");

// Register a value 
ioc.registerInstance("CONSTANT", "Some Constant");
/* Same as
ioc.registerHandler('CONSTANT', () => 'Some Constant');
*/


// A Transient 
ioc.registerTransient("constructor", function () {
    console.log('hello, world', this);
});
/* Same as
ioc.registerHandler("constructor", (activator) => { 
    return activator.invoke(function () {
        console.log('hello, world', this)
    }
}));*/

// A Singleton
ioc.regiserSingleton('singleton', function () {
    console.log('hello, from singleton', this)
})
/* Same as
var singleton
ioc.registerHandler('singleton', function (activator) {
    if (!singleton) return activator.invoke(function () {
        console.log('hello, from singleton this);
    });
    return singleton;
});

*/

```

### Container#get<T>(key:any, checkParent?:boolean): T 

You can get a value from the container, by its key.
If the key does not exists, the container will try to resolve the value.

When resolving a function value, the dependency injector will resolve the function parameters, and inject those, when activating the function. How the function is activated, is controlled by and IActivator (which defaults to ClassActivator). 

 Because the `get` will try to resolve a key, which does not exists, you don't have direct control how the key (value) is registered with the container. You can control that, by a `Registration` class which you attached a meta property.  Common registrations already exists, and can be used with decorators (`@transient` and `@singleton`)
 You can also control hov the function/class is acivated by decorating with proper decorator (`@instanceActivator`, `@factory`).

The dependency injector uses a `IDependencyResolver` for resolving dependencies.  The `IDenpencyResolver` can be controlled be decorating the target with `@dependencyResolve`



```javascript

let constant = container.get('CONSTANT');
// constant  === 'Some constant';

```




## Advanced


### Custom Activators


### Custom Resovlers


### Custom Registration