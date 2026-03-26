const RUNTIME_PUBLIC_PATH = "server/chunks/[turbopack]_runtime.js";
const RELATIVE_ROOT_PATH = "..";
const ASSET_PREFIX = "/";
const WORKER_FORWARDED_GLOBALS = ["NEXT_DEPLOYMENT_ID","NEXT_CLIENT_ASSET_SUFFIX"];
// Apply forwarded globals from workerData if running in a worker thread
if (typeof require !== 'undefined') {
    try {
        const { workerData } = require('worker_threads');
        if (workerData?.__turbopack_globals__) {
            Object.assign(globalThis, workerData.__turbopack_globals__);
            // Remove internal data so it's not visible to user code
            delete workerData.__turbopack_globals__;
        }
    } catch (_) {
        // Not in a worker thread context, ignore
    }
}
/**
 * This file contains runtime types and functions that are shared between all
 * TurboPack ECMAScript runtimes.
 *
 * It will be prepended to the runtime code of each runtime.
 */ /* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="./runtime-types.d.ts" />
/**
 * Describes why a module was instantiated.
 * Shared between browser and Node.js runtimes.
 */ var SourceType = /*#__PURE__*/ function(SourceType) {
    /**
   * The module was instantiated because it was included in an evaluated chunk's
   * runtime.
   * SourceData is a ChunkPath.
   */ SourceType[SourceType["Runtime"] = 0] = "Runtime";
    /**
   * The module was instantiated because a parent module imported it.
   * SourceData is a ModuleId.
   */ SourceType[SourceType["Parent"] = 1] = "Parent";
    /**
   * The module was instantiated because it was included in a chunk's hot module
   * update.
   * SourceData is an array of ModuleIds or undefined.
   */ SourceType[SourceType["Update"] = 2] = "Update";
    return SourceType;
}(SourceType || {});
/**
 * Flag indicating which module object type to create when a module is merged. Set to `true`
 * by each runtime that uses ModuleWithDirection (browser dev-base.ts, nodejs dev-base.ts,
 * nodejs build-base.ts). Browser production (build-base.ts) leaves it as `false` since it
 * uses plain Module objects.
 */ let createModuleWithDirectionFlag = false;
const REEXPORTED_OBJECTS = new WeakMap();
/**
 * Constructs the `__turbopack_context__` object for a module.
 */ function Context(module, exports) {
    this.m = module;
    // We need to store this here instead of accessing it from the module object to:
    // 1. Make it available to factories directly, since we rewrite `this` to
    //    `__turbopack_context__.e` in CJS modules.
    // 2. Support async modules which rewrite `module.exports` to a promise, so we
    //    can still access the original exports object from functions like
    //    `esmExport`
    // Ideally we could find a new approach for async modules and drop this property altogether.
    this.e = exports;
}
const contextPrototype = Context.prototype;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const toStringTag = typeof Symbol !== 'undefined' && Symbol.toStringTag;
function defineProp(obj, name, options) {
    if (!hasOwnProperty.call(obj, name)) Object.defineProperty(obj, name, options);
}
function getOverwrittenModule(moduleCache, id) {
    let module = moduleCache[id];
    if (!module) {
        if (createModuleWithDirectionFlag) {
            // set in development modes for hmr support
            module = createModuleWithDirection(id);
        } else {
            module = createModuleObject(id);
        }
        moduleCache[id] = module;
    }
    return module;
}
/**
 * Creates the module object. Only done here to ensure all module objects have the same shape.
 */ function createModuleObject(id) {
    return {
        exports: {},
        error: undefined,
        id,
        namespaceObject: undefined
    };
}
function createModuleWithDirection(id) {
    return {
        exports: {},
        error: undefined,
        id,
        namespaceObject: undefined,
        parents: [],
        children: []
    };
}
const BindingTag_Value = 0;
/**
 * Adds the getters to the exports object.
 */ function esm(exports, bindings) {
    defineProp(exports, '__esModule', {
        value: true
    });
    if (toStringTag) defineProp(exports, toStringTag, {
        value: 'Module'
    });
    let i = 0;
    while(i < bindings.length){
        const propName = bindings[i++];
        const tagOrFunction = bindings[i++];
        if (typeof tagOrFunction === 'number') {
            if (tagOrFunction === BindingTag_Value) {
                defineProp(exports, propName, {
                    value: bindings[i++],
                    enumerable: true,
                    writable: false
                });
            } else {
                throw new Error(`unexpected tag: ${tagOrFunction}`);
            }
        } else {
            const getterFn = tagOrFunction;
            if (typeof bindings[i] === 'function') {
                const setterFn = bindings[i++];
                defineProp(exports, propName, {
                    get: getterFn,
                    set: setterFn,
                    enumerable: true
                });
            } else {
                defineProp(exports, propName, {
                    get: getterFn,
                    enumerable: true
                });
            }
        }
    }
    Object.seal(exports);
}
/**
 * Makes the module an ESM with exports
 */ function esmExport(bindings, id) {
    let module;
    let exports;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
        exports = module.exports;
    } else {
        module = this.m;
        exports = this.e;
    }
    module.namespaceObject = exports;
    esm(exports, bindings);
}
contextPrototype.s = esmExport;
function ensureDynamicExports(module, exports) {
    let reexportedObjects = REEXPORTED_OBJECTS.get(module);
    if (!reexportedObjects) {
        REEXPORTED_OBJECTS.set(module, reexportedObjects = []);
        module.exports = module.namespaceObject = new Proxy(exports, {
            get (target, prop) {
                if (hasOwnProperty.call(target, prop) || prop === 'default' || prop === '__esModule') {
                    return Reflect.get(target, prop);
                }
                for (const obj of reexportedObjects){
                    const value = Reflect.get(obj, prop);
                    if (value !== undefined) return value;
                }
                return undefined;
            },
            ownKeys (target) {
                const keys = Reflect.ownKeys(target);
                for (const obj of reexportedObjects){
                    for (const key of Reflect.ownKeys(obj)){
                        if (key !== 'default' && !keys.includes(key)) keys.push(key);
                    }
                }
                return keys;
            }
        });
    }
    return reexportedObjects;
}
/**
 * Dynamically exports properties from an object
 */ function dynamicExport(object, id) {
    let module;
    let exports;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
        exports = module.exports;
    } else {
        module = this.m;
        exports = this.e;
    }
    const reexportedObjects = ensureDynamicExports(module, exports);
    if (typeof object === 'object' && object !== null) {
        reexportedObjects.push(object);
    }
}
contextPrototype.j = dynamicExport;
function exportValue(value, id) {
    let module;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
    } else {
        module = this.m;
    }
    module.exports = value;
}
contextPrototype.v = exportValue;
function exportNamespace(namespace, id) {
    let module;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
    } else {
        module = this.m;
    }
    module.exports = module.namespaceObject = namespace;
}
contextPrototype.n = exportNamespace;
function createGetter(obj, key) {
    return ()=>obj[key];
}
/**
 * @returns prototype of the object
 */ const getProto = Object.getPrototypeOf ? (obj)=>Object.getPrototypeOf(obj) : (obj)=>obj.__proto__;
/** Prototypes that are not expanded for exports */ const LEAF_PROTOTYPES = [
    null,
    getProto({}),
    getProto([]),
    getProto(getProto)
];
/**
 * @param raw
 * @param ns
 * @param allowExportDefault
 *   * `false`: will have the raw module as default export
 *   * `true`: will have the default property as default export
 */ function interopEsm(raw, ns, allowExportDefault) {
    const bindings = [];
    let defaultLocation = -1;
    for(let current = raw; (typeof current === 'object' || typeof current === 'function') && !LEAF_PROTOTYPES.includes(current); current = getProto(current)){
        for (const key of Object.getOwnPropertyNames(current)){
            bindings.push(key, createGetter(raw, key));
            if (defaultLocation === -1 && key === 'default') {
                defaultLocation = bindings.length - 1;
            }
        }
    }
    // this is not really correct
    // we should set the `default` getter if the imported module is a `.cjs file`
    if (!(allowExportDefault && defaultLocation >= 0)) {
        // Replace the binding with one for the namespace itself in order to preserve iteration order.
        if (defaultLocation >= 0) {
            // Replace the getter with the value
            bindings.splice(defaultLocation, 1, BindingTag_Value, raw);
        } else {
            bindings.push('default', BindingTag_Value, raw);
        }
    }
    esm(ns, bindings);
    return ns;
}
function createNS(raw) {
    if (typeof raw === 'function') {
        return function(...args) {
            return raw.apply(this, args);
        };
    } else {
        return Object.create(null);
    }
}
function esmImport(id) {
    const module = getOrInstantiateModuleFromParent(id, this.m);
    // any ES module has to have `module.namespaceObject` defined.
    if (module.namespaceObject) return module.namespaceObject;
    // only ESM can be an async module, so we don't need to worry about exports being a promise here.
    const raw = module.exports;
    return module.namespaceObject = interopEsm(raw, createNS(raw), raw && raw.__esModule);
}
contextPrototype.i = esmImport;
function asyncLoader(moduleId) {
    const loader = this.r(moduleId);
    return loader(esmImport.bind(this));
}
contextPrototype.A = asyncLoader;
// Add a simple runtime require so that environments without one can still pass
// `typeof require` CommonJS checks so that exports are correctly registered.
const runtimeRequire = // @ts-ignore
typeof require === 'function' ? require : function require1() {
    throw new Error('Unexpected use of runtime require');
};
contextPrototype.t = runtimeRequire;
function commonJsRequire(id) {
    return getOrInstantiateModuleFromParent(id, this.m).exports;
}
contextPrototype.r = commonJsRequire;
/**
 * Remove fragments and query parameters since they are never part of the context map keys
 *
 * This matches how we parse patterns at resolving time.  Arguably we should only do this for
 * strings passed to `import` but the resolve does it for `import` and `require` and so we do
 * here as well.
 */ function parseRequest(request) {
    // Per the URI spec fragments can contain `?` characters, so we should trim it off first
    // https://datatracker.ietf.org/doc/html/rfc3986#section-3.5
    const hashIndex = request.indexOf('#');
    if (hashIndex !== -1) {
        request = request.substring(0, hashIndex);
    }
    const queryIndex = request.indexOf('?');
    if (queryIndex !== -1) {
        request = request.substring(0, queryIndex);
    }
    return request;
}
/**
 * `require.context` and require/import expression runtime.
 */ function moduleContext(map) {
    function moduleContext(id) {
        id = parseRequest(id);
        if (hasOwnProperty.call(map, id)) {
            return map[id].module();
        }
        const e = new Error(`Cannot find module '${id}'`);
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    }
    moduleContext.keys = ()=>{
        return Object.keys(map);
    };
    moduleContext.resolve = (id)=>{
        id = parseRequest(id);
        if (hasOwnProperty.call(map, id)) {
            return map[id].id();
        }
        const e = new Error(`Cannot find module '${id}'`);
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    };
    moduleContext.import = async (id)=>{
        return await moduleContext(id);
    };
    return moduleContext;
}
contextPrototype.f = moduleContext;
/**
 * Returns the path of a chunk defined by its data.
 */ function getChunkPath(chunkData) {
    return typeof chunkData === 'string' ? chunkData : chunkData.path;
}
function isPromise(maybePromise) {
    return maybePromise != null && typeof maybePromise === 'object' && 'then' in maybePromise && typeof maybePromise.then === 'function';
}
function isAsyncModuleExt(obj) {
    return turbopackQueues in obj;
}
function createPromise() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej)=>{
        reject = rej;
        resolve = res;
    });
    return {
        promise,
        resolve: resolve,
        reject: reject
    };
}
// Load the CompressedmoduleFactories of a chunk into the `moduleFactories` Map.
// The CompressedModuleFactories format is
// - 1 or more module ids
// - a module factory function
// So walking this is a little complex but the flat structure is also fast to
// traverse, we can use `typeof` operators to distinguish the two cases.
function installCompressedModuleFactories(chunkModules, offset, moduleFactories, newModuleId) {
    let i = offset;
    while(i < chunkModules.length){
        let end = i + 1;
        // Find our factory function
        while(end < chunkModules.length && typeof chunkModules[end] !== 'function'){
            end++;
        }
        if (end === chunkModules.length) {
            throw new Error('malformed chunk format, expected a factory function');
        }
        // Install the factory for each module ID that doesn't already have one.
        // When some IDs in this group already have a factory, reuse that existing
        // group factory for the missing IDs to keep all IDs in the group consistent.
        // Otherwise, install the factory from this chunk.
        const moduleFactoryFn = chunkModules[end];
        let existingGroupFactory = undefined;
        for(let j = i; j < end; j++){
            const id = chunkModules[j];
            const existingFactory = moduleFactories.get(id);
            if (existingFactory) {
                existingGroupFactory = existingFactory;
                break;
            }
        }
        const factoryToInstall = existingGroupFactory ?? moduleFactoryFn;
        let didInstallFactory = false;
        for(let j = i; j < end; j++){
            const id = chunkModules[j];
            if (!moduleFactories.has(id)) {
                if (!didInstallFactory) {
                    if (factoryToInstall === moduleFactoryFn) {
                        applyModuleFactoryName(moduleFactoryFn);
                    }
                    didInstallFactory = true;
                }
                moduleFactories.set(id, factoryToInstall);
                newModuleId?.(id);
            }
        }
        i = end + 1; // end is pointing at the last factory advance to the next id or the end of the array.
    }
}
// everything below is adapted from webpack
// https://github.com/webpack/webpack/blob/6be4065ade1e252c1d8dcba4af0f43e32af1bdc1/lib/runtime/AsyncModuleRuntimeModule.js#L13
const turbopackQueues = Symbol('turbopack queues');
const turbopackExports = Symbol('turbopack exports');
const turbopackError = Symbol('turbopack error');
function resolveQueue(queue) {
    if (queue && queue.status !== 1) {
        queue.status = 1;
        queue.forEach((fn)=>fn.queueCount--);
        queue.forEach((fn)=>fn.queueCount-- ? fn.queueCount++ : fn());
    }
}
function wrapDeps(deps) {
    return deps.map((dep)=>{
        if (dep !== null && typeof dep === 'object') {
            if (isAsyncModuleExt(dep)) return dep;
            if (isPromise(dep)) {
                const queue = Object.assign([], {
                    status: 0
                });
                const obj = {
                    [turbopackExports]: {},
                    [turbopackQueues]: (fn)=>fn(queue)
                };
                dep.then((res)=>{
                    obj[turbopackExports] = res;
                    resolveQueue(queue);
                }, (err)=>{
                    obj[turbopackError] = err;
                    resolveQueue(queue);
                });
                return obj;
            }
        }
        return {
            [turbopackExports]: dep,
            [turbopackQueues]: ()=>{}
        };
    });
}
function asyncModule(body, hasAwait) {
    const module = this.m;
    const queue = hasAwait ? Object.assign([], {
        status: -1
    }) : undefined;
    const depQueues = new Set();
    const { resolve, reject, promise: rawPromise } = createPromise();
    const promise = Object.assign(rawPromise, {
        [turbopackExports]: module.exports,
        [turbopackQueues]: (fn)=>{
            queue && fn(queue);
            depQueues.forEach(fn);
            promise['catch'](()=>{});
        }
    });
    const attributes = {
        get () {
            return promise;
        },
        set (v) {
            // Calling `esmExport` leads to this.
            if (v !== promise) {
                promise[turbopackExports] = v;
            }
        }
    };
    Object.defineProperty(module, 'exports', attributes);
    Object.defineProperty(module, 'namespaceObject', attributes);
    function handleAsyncDependencies(deps) {
        const currentDeps = wrapDeps(deps);
        const getResult = ()=>currentDeps.map((d)=>{
                if (d[turbopackError]) throw d[turbopackError];
                return d[turbopackExports];
            });
        const { promise, resolve } = createPromise();
        const fn = Object.assign(()=>resolve(getResult), {
            queueCount: 0
        });
        function fnQueue(q) {
            if (q !== queue && !depQueues.has(q)) {
                depQueues.add(q);
                if (q && q.status === 0) {
                    fn.queueCount++;
                    q.push(fn);
                }
            }
        }
        currentDeps.map((dep)=>dep[turbopackQueues](fnQueue));
        return fn.queueCount ? promise : getResult();
    }
    function asyncResult(err) {
        if (err) {
            reject(promise[turbopackError] = err);
        } else {
            resolve(promise[turbopackExports]);
        }
        resolveQueue(queue);
    }
    body(handleAsyncDependencies, asyncResult);
    if (queue && queue.status === -1) {
        queue.status = 0;
    }
}
contextPrototype.a = asyncModule;
/**
 * A pseudo "fake" URL object to resolve to its relative path.
 *
 * When UrlRewriteBehavior is set to relative, calls to the `new URL()` will construct url without base using this
 * runtime function to generate context-agnostic urls between different rendering context, i.e ssr / client to avoid
 * hydration mismatch.
 *
 * This is based on webpack's existing implementation:
 * https://github.com/webpack/webpack/blob/87660921808566ef3b8796f8df61bd79fc026108/lib/runtime/RelativeUrlRuntimeModule.js
 */ const relativeURL = function relativeURL(inputUrl) {
    const realUrl = new URL(inputUrl, 'x:/');
    const values = {};
    for(const key in realUrl)values[key] = realUrl[key];
    values.href = inputUrl;
    values.pathname = inputUrl.replace(/[?#].*/, '');
    values.origin = values.protocol = '';
    values.toString = values.toJSON = (..._args)=>inputUrl;
    for(const key in values)Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        value: values[key]
    });
};
relativeURL.prototype = URL.prototype;
contextPrototype.U = relativeURL;
/**
 * Utility function to ensure all variants of an enum are handled.
 */ function invariant(never, computeMessage) {
    throw new Error(`Invariant: ${computeMessage(never)}`);
}
/**
 * Constructs an error message for when a module factory is not available.
 */ function factoryNotAvailableMessage(moduleId, sourceType, sourceData) {
    let instantiationReason;
    switch(sourceType){
        case 0:
            instantiationReason = `as a runtime entry of chunk ${sourceData}`;
            break;
        case 1:
            instantiationReason = `because it was required from module ${sourceData}`;
            break;
        case 2:
            instantiationReason = 'because of an HMR update';
            break;
        default:
            invariant(sourceType, (sourceType)=>`Unknown source type: ${sourceType}`);
    }
    return `Module ${moduleId} was instantiated ${instantiationReason}, but the module factory is not available.`;
}
/**
 * A stub function to make `require` available but non-functional in ESM.
 */ function requireStub(_moduleId) {
    throw new Error('dynamic usage of require is not supported');
}
contextPrototype.z = requireStub;
// Make `globalThis` available to the module in a way that cannot be shadowed by a local variable.
contextPrototype.g = globalThis;
function applyModuleFactoryName(factory) {
    // Give the module factory a nice name to improve stack traces.
    Object.defineProperty(factory, 'name', {
        value: 'module evaluation'
    });
}
/// <reference path="../shared/runtime/runtime-utils.ts" />
/// A 'base' utilities to support runtime can have externals.
/// Currently this is for node.js / edge runtime both.
/// If a fn requires node.js specific behavior, it should be placed in `node-external-utils` instead.
async function externalImport(id) {
    let raw;
    try {
        switch (id) {
  case "next/dist/compiled/@vercel/og/index.node.js":
    raw = await import("next/dist/compiled/@vercel/og/index.edge.js");
    break;
  default:
    raw = await import(id);
};
    } catch (err) {
        // TODO(alexkirsz) This can happen when a client-side module tries to load
        // an external module we don't provide a shim for (e.g. querystring, url).
        // For now, we fail semi-silently, but in the future this should be a
        // compilation error.
        throw new Error(`Failed to load external module ${id}: ${err}`);
    }
    if (raw && raw.__esModule && raw.default && 'default' in raw.default) {
        return interopEsm(raw.default, createNS(raw), true);
    }
    return raw;
}
contextPrototype.y = externalImport;
function externalRequire(id, thunk, esm = false) {
    let raw;
    try {
        raw = thunk();
    } catch (err) {
        // TODO(alexkirsz) This can happen when a client-side module tries to load
        // an external module we don't provide a shim for (e.g. querystring, url).
        // For now, we fail semi-silently, but in the future this should be a
        // compilation error.
        throw new Error(`Failed to load external module ${id}: ${err}`);
    }
    if (!esm || raw.__esModule) {
        return raw;
    }
    return interopEsm(raw, createNS(raw), true);
}
externalRequire.resolve = (id, options)=>{
    return require.resolve(id, options);
};
contextPrototype.x = externalRequire;
/* eslint-disable @typescript-eslint/no-unused-vars */ const path = require('path');
const relativePathToRuntimeRoot = path.relative(RUNTIME_PUBLIC_PATH, '.');
// Compute the relative path to the `distDir`.
const relativePathToDistRoot = path.join(relativePathToRuntimeRoot, RELATIVE_ROOT_PATH);
const RUNTIME_ROOT = path.resolve(__filename, relativePathToRuntimeRoot);
// Compute the absolute path to the root, by stripping distDir from the absolute path to this file.
const ABSOLUTE_ROOT = path.resolve(__filename, relativePathToDistRoot);
/**
 * Returns an absolute path to the given module path.
 * Module path should be relative, either path to a file or a directory.
 *
 * This fn allows to calculate an absolute path for some global static values, such as
 * `__dirname` or `import.meta.url` that Turbopack will not embeds in compile time.
 * See ImportMetaBinding::code_generation for the usage.
 */ function resolveAbsolutePath(modulePath) {
    if (modulePath) {
        return path.join(ABSOLUTE_ROOT, modulePath);
    }
    return ABSOLUTE_ROOT;
}
Context.prototype.P = resolveAbsolutePath;
/* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="../shared/runtime/runtime-utils.ts" />
function readWebAssemblyAsResponse(path) {
    const { createReadStream } = require('fs');
    const { Readable } = require('stream');
    const stream = createReadStream(path);
    // @ts-ignore unfortunately there's a slight type mismatch with the stream.
    return new Response(Readable.toWeb(stream), {
        headers: {
            'content-type': 'application/wasm'
        }
    });
}
async function compileWebAssemblyFromPath(path) {
    const response = readWebAssemblyAsResponse(path);
    return await WebAssembly.compileStreaming(response);
}
async function instantiateWebAssemblyFromPath(path, importsObj) {
    const response = readWebAssemblyAsResponse(path);
    const { instance } = await WebAssembly.instantiateStreaming(response, importsObj);
    return instance.exports;
}
/* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="../../shared/runtime/runtime-utils.ts" />
/// <reference path="../../shared-node/base-externals-utils.ts" />
/// <reference path="../../shared-node/node-externals-utils.ts" />
/// <reference path="../../shared-node/node-wasm-utils.ts" />
/// <reference path="./nodejs-globals.d.ts" />
/**
 * Base Node.js runtime shared between production and development.
 * Contains chunk loading, module caching, and other non-HMR functionality.
 */ process.env.TURBOPACK = '1';
const url = require('url');
const moduleFactories = new Map();
const moduleCache = Object.create(null);
/**
 * Returns an absolute path to the given module's id.
 */ function resolvePathFromModule(moduleId) {
    const exported = this.r(moduleId);
    const exportedPath = exported?.default ?? exported;
    if (typeof exportedPath !== 'string') {
        return exported;
    }
    const strippedAssetPrefix = exportedPath.slice(ASSET_PREFIX.length);
    const resolved = path.resolve(RUNTIME_ROOT, strippedAssetPrefix);
    return url.pathToFileURL(resolved).href;
}
/**
 * Exports a URL value. No suffix is added in Node.js runtime.
 */ function exportUrl(urlValue, id) {
    exportValue.call(this, urlValue, id);
}
function loadRuntimeChunk(sourcePath, chunkData) {
    if (typeof chunkData === 'string') {
        loadRuntimeChunkPath(sourcePath, chunkData);
    } else {
        loadRuntimeChunkPath(sourcePath, chunkData.path);
    }
}
const loadedChunks = new Set();
const unsupportedLoadChunk = Promise.resolve(undefined);
const loadedChunk = Promise.resolve(undefined);
const chunkCache = new Map();
function clearChunkCache() {
    chunkCache.clear();
    loadedChunks.clear();
}
function loadRuntimeChunkPath(sourcePath, chunkPath) {
    if (!isJs(chunkPath)) {
        // We only support loading JS chunks in Node.js.
        // This branch can be hit when trying to load a CSS chunk.
        return;
    }
    if (loadedChunks.has(chunkPath)) {
        return;
    }
    try {
        const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
        const chunkModules = requireChunk(chunkPath);
        installCompressedModuleFactories(chunkModules, 0, moduleFactories);
        loadedChunks.add(chunkPath);
    } catch (cause) {
        let errorMessage = `Failed to load chunk ${chunkPath}`;
        if (sourcePath) {
            errorMessage += ` from runtime for chunk ${sourcePath}`;
        }
        const error = new Error(errorMessage, {
            cause
        });
        error.name = 'ChunkLoadError';
        throw error;
    }
}
function loadChunkAsync(chunkData) {
    const chunkPath = typeof chunkData === 'string' ? chunkData : chunkData.path;
    if (!isJs(chunkPath)) {
        // We only support loading JS chunks in Node.js.
        // This branch can be hit when trying to load a CSS chunk.
        return unsupportedLoadChunk;
    }
    let entry = chunkCache.get(chunkPath);
    if (entry === undefined) {
        try {
            // resolve to an absolute path to simplify `require` handling
            const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
            // TODO: consider switching to `import()` to enable concurrent chunk loading and async file io
            // However this is incompatible with hot reloading (since `import` doesn't use the require cache)
            const chunkModules = requireChunk(chunkPath);
            installCompressedModuleFactories(chunkModules, 0, moduleFactories);
            entry = loadedChunk;
        } catch (cause) {
            const errorMessage = `Failed to load chunk ${chunkPath} from module ${this.m.id}`;
            const error = new Error(errorMessage, {
                cause
            });
            error.name = 'ChunkLoadError';
            // Cache the failure promise, future requests will also get this same rejection
            entry = Promise.reject(error);
        }
        chunkCache.set(chunkPath, entry);
    }
    // TODO: Return an instrumented Promise that React can use instead of relying on referential equality.
    return entry;
}
contextPrototype.l = loadChunkAsync;
function loadChunkAsyncByUrl(chunkUrl) {
    const path1 = url.fileURLToPath(new URL(chunkUrl, RUNTIME_ROOT));
    return loadChunkAsync.call(this, path1);
}
contextPrototype.L = loadChunkAsyncByUrl;
function loadWebAssembly(chunkPath, _edgeModule, imports) {
    const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
    return instantiateWebAssemblyFromPath(resolved, imports);
}
contextPrototype.w = loadWebAssembly;
function loadWebAssemblyModule(chunkPath, _edgeModule) {
    const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
    return compileWebAssemblyFromPath(resolved);
}
contextPrototype.u = loadWebAssemblyModule;
/**
 * Creates a Node.js worker thread by instantiating the given WorkerConstructor
 * with the appropriate path and options, including forwarded globals.
 *
 * @param WorkerConstructor The Worker constructor from worker_threads
 * @param workerPath Path to the worker entry chunk
 * @param workerOptions options to pass to the Worker constructor (optional)
 */ function createWorker(WorkerConstructor, workerPath, workerOptions) {
    // Build the forwarded globals object
    const forwardedGlobals = {};
    for (const name of WORKER_FORWARDED_GLOBALS){
        forwardedGlobals[name] = globalThis[name];
    }
    // Merge workerData with forwarded globals
    const existingWorkerData = workerOptions?.workerData || {};
    const options = {
        ...workerOptions,
        workerData: {
            ...typeof existingWorkerData === 'object' ? existingWorkerData : {},
            __turbopack_globals__: forwardedGlobals
        }
    };
    return new WorkerConstructor(workerPath, options);
}
const regexJsUrl = /\.js(?:\?[^#]*)?(?:#.*)?$/;
/**
 * Checks if a given path/URL ends with .js, optionally followed by ?query or #fragment.
 */ function isJs(chunkUrlOrPath) {
    return regexJsUrl.test(chunkUrlOrPath);
}
/* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="./runtime-base.ts" />
/**
 * Production Node.js runtime.
 * Uses ModuleWithDirection and simple module instantiation without HMR support.
 */ // moduleCache and moduleFactories are declared in runtime-base.ts
// this is read in runtime-utils.ts so it creates a module with direction for hmr
createModuleWithDirectionFlag = true;
const nodeContextPrototype = Context.prototype;
nodeContextPrototype.q = exportUrl;
nodeContextPrototype.M = moduleFactories;
// Cast moduleCache to ModuleWithDirection for production mode
nodeContextPrototype.c = moduleCache;
nodeContextPrototype.R = resolvePathFromModule;
nodeContextPrototype.b = createWorker;
nodeContextPrototype.C = clearChunkCache;
function instantiateModule(id, sourceType, sourceData) {
    const moduleFactory = moduleFactories.get(id);
    if (typeof moduleFactory !== 'function') {
        // This can happen if modules incorrectly handle HMR disposes/updates,
        // e.g. when they keep a `setTimeout` around which still executes old code
        // and contains e.g. a `require("something")` call.
        throw new Error(factoryNotAvailableMessage(id, sourceType, sourceData));
    }
    const module1 = createModuleWithDirection(id);
    const exports = module1.exports;
    moduleCache[id] = module1;
    const context = new Context(module1, exports);
    // NOTE(alexkirsz) This can fail when the module encounters a runtime error.
    try {
        moduleFactory(context, module1, exports);
    } catch (error) {
        module1.error = error;
        throw error;
    }
    ;
    module1.loaded = true;
    if (module1.namespaceObject && module1.exports !== module1.namespaceObject) {
        // in case of a circular dependency: cjs1 -> esm2 -> cjs1
        interopEsm(module1.exports, module1.namespaceObject);
    }
    return module1;
}
/**
 * Retrieves a module from the cache, or instantiate it if it is not cached.
 */ // @ts-ignore
function getOrInstantiateModuleFromParent(id, sourceModule) {
    const module1 = moduleCache[id];
    if (module1) {
        if (module1.error) {
            throw module1.error;
        }
        return module1;
    }
    return instantiateModule(id, SourceType.Parent, sourceModule.id);
}
/**
 * Instantiates a runtime module.
 */ function instantiateRuntimeModule(chunkPath, moduleId) {
    return instantiateModule(moduleId, SourceType.Runtime, chunkPath);
}
/**
 * Retrieves a module from the cache, or instantiate it as a runtime module if it is not cached.
 */ // @ts-ignore TypeScript doesn't separate this module space from the browser runtime
function getOrInstantiateRuntimeModule(chunkPath, moduleId) {
    const module1 = moduleCache[moduleId];
    if (module1) {
        if (module1.error) {
            throw module1.error;
        }
        return module1;
    }
    return instantiateRuntimeModule(chunkPath, moduleId);
}
module.exports = (sourcePath)=>({
        m: (id)=>getOrInstantiateRuntimeModule(sourcePath, id),
        c: (chunkData)=>loadRuntimeChunk(sourcePath, chunkData)
    });


//# sourceMappingURL=%5Bturbopack%5D_runtime.js.map

  function requireChunk(chunkPath) {
    switch(chunkPath) {
      case "server/chunks/ssr/[root-of-the-server]__0.zquoa._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0.zquoa._.js");
      case "server/chunks/ssr/[root-of-the-server]__0bd0tfh._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0bd0tfh._.js");
      case "server/chunks/ssr/[root-of-the-server]__0v6ud4p._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0v6ud4p._.js");
      case "server/chunks/ssr/[root-of-the-server]__0wibafp._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0wibafp._.js");
      case "server/chunks/ssr/[root-of-the-server]__0z2-47e._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0z2-47e._.js");
      case "server/chunks/ssr/[turbopack]_runtime.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[turbopack]_runtime.js");
      case "server/chunks/ssr/_0mnshrt._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_0mnshrt._.js");
      case "server/chunks/ssr/_0~hzpmo._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_0~hzpmo._.js");
      case "server/chunks/ssr/_next-internal_server_app__not-found_page_actions_0eq97pa.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app__not-found_page_actions_0eq97pa.js");
      case "server/chunks/ssr/node_modules_09w7yel._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_09w7yel._.js");
      case "server/chunks/ssr/node_modules_next_0w2y7fz._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_0w2y7fz._.js");
      case "server/chunks/ssr/node_modules_next_dist_0h9llsw._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_0h9llsw._.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_0inhx6q._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_0inhx6q._.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_builtin_forbidden_0ghu-f7.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_forbidden_0ghu-f7.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_builtin_unauthorized_0cjv-23.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_unauthorized_0cjv-23.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0m-ur85.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0m-ur85.js");
      case "server/chunks/ssr/[root-of-the-server]__0e35a.l._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0e35a.l._.js");
      case "server/chunks/ssr/[root-of-the-server]__10xgshr._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__10xgshr._.js");
      case "server/chunks/ssr/_next-internal_server_app__global-error_page_actions_0k77kol.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app__global-error_page_actions_0k77kol.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_builtin_global-error_0lgvd_..js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_global-error_0lgvd_..js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0rc3ul_.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0rc3ul_.js");
      case "server/chunks/ssr/[root-of-the-server]__06zxsan._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__06zxsan._.js");
      case "server/chunks/ssr/_0np-310._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_0np-310._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_dashboard_page_actions_0ubxwqt.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_dashboard_page_actions_0ubxwqt.js");
      case "server/chunks/ssr/node_modules_next_dist_11tr3f-._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_11tr3f-._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0f1biw7.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0f1biw7.js");
      case "server/chunks/ssr/[root-of-the-server]__0rjfgyc._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0rjfgyc._.js");
      case "server/chunks/ssr/_0kywqia._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_0kywqia._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_monitoring_page_actions_13o.w_r.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_monitoring_page_actions_13o.w_r.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_04xgaqb.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_04xgaqb.js");
      case "server/chunks/ssr/[root-of-the-server]__0~i1o3h._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0~i1o3h._.js");
      case "server/chunks/ssr/_0-i-j-e._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_0-i-j-e._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_notifications_page_actions_0q-4ek5.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_notifications_page_actions_0q-4ek5.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0a4cobi.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0a4cobi.js");
      case "server/chunks/ssr/[root-of-the-server]__0~q7m-r._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0~q7m-r._.js");
      case "server/chunks/ssr/_0jq.uu1._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_0jq.uu1._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_profile_page_actions_11~9g5e.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_profile_page_actions_11~9g5e.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0ji03q6.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0ji03q6.js");
      case "server/chunks/ssr/[root-of-the-server]__11lyn4l._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__11lyn4l._.js");
      case "server/chunks/ssr/_0tllw~o._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_0tllw~o._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_reports_page_actions_0t04ce4.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_reports_page_actions_0t04ce4.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_001e568.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_001e568.js");
      case "server/chunks/ssr/[root-of-the-server]__0iajqpd._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0iajqpd._.js");
      case "server/chunks/ssr/_096k.lh._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_096k.lh._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_settings_page_actions_0-dqp6i.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_settings_page_actions_0-dqp6i.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0rvn-js.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0rvn-js.js");
      case "server/chunks/ssr/[root-of-the-server]__0ny_ct9._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0ny_ct9._.js");
      case "server/chunks/ssr/_0jea8_h._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_0jea8_h._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_statistics_page_actions_11g7bpg.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_statistics_page_actions_11g7bpg.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_12.zeqr.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_12.zeqr.js");
      case "server/chunks/ssr/[root-of-the-server]__1168r5w._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1168r5w._.js");
      case "server/chunks/ssr/_0wxs.0z._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_0wxs.0z._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_submissions_[id]_page_actions_0x-1_-1.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_submissions_[id]_page_actions_0x-1_-1.js");
      case "server/chunks/ssr/app_admin_submissions_[id]_page_tsx_11m37a4._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/app_admin_submissions_[id]_page_tsx_11m37a4._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0ome6h9.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0ome6h9.js");
      case "server/chunks/ssr/[root-of-the-server]__0kye6ho._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0kye6ho._.js");
      case "server/chunks/ssr/_0gttqu1._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_0gttqu1._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_submissions_page_actions_0x-dh~v.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_submissions_page_actions_0x-dh~v.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_01eqg0q.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_01eqg0q.js");
      case "server/chunks/ssr/[root-of-the-server]__0gy6-hi._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0gy6-hi._.js");
      case "server/chunks/ssr/_11t0z_4._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_11t0z_4._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_users_[id]_page_actions_0w32es1.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_users_[id]_page_actions_0w32es1.js");
      case "server/chunks/ssr/app_admin_users_[id]_page_tsx_110v35e._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/app_admin_users_[id]_page_tsx_110v35e._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_016608e.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_016608e.js");
      case "server/chunks/ssr/[root-of-the-server]__03m23ac._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__03m23ac._.js");
      case "server/chunks/ssr/_122r~uo._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_122r~uo._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_users_page_actions_0wjsuuo.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_users_page_actions_0wjsuuo.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_02xhj.r.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_02xhj.r.js");
      case "server/chunks/ssr/[root-of-the-server]__0~a4i.k._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0~a4i.k._.js");
      case "server/chunks/ssr/_0cg6-m-._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_0cg6-m-._.js");
      case "server/chunks/ssr/_next-internal_server_app_admin_verification-requests_page_actions_115mztd.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_admin_verification-requests_page_actions_115mztd.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0_.xzze.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0_.xzze.js");
      case "server/chunks/0zjb_server_app_api_admin_users_[id]_verification_route_actions_01p_f8s.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/0zjb_server_app_api_admin_users_[id]_verification_route_actions_01p_f8s.js");
      case "server/chunks/[root-of-the-server]__0ckcpsh._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0ckcpsh._.js");
      case "server/chunks/[root-of-the-server]__0o6xnf8._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0o6xnf8._.js");
      case "server/chunks/[turbopack]_runtime.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/[turbopack]_runtime.js");
      case "server/chunks/[root-of-the-server]__03k-1o0._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__03k-1o0._.js");
      case "server/chunks/_next-internal_server_app_api_auth_login_route_actions_0zukc38.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_auth_login_route_actions_0zukc38.js");
      case "server/chunks/[root-of-the-server]__0v~uuuo._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0v~uuuo._.js");
      case "server/chunks/_next-internal_server_app_api_auth_logout_route_actions_0fm~3ij.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_auth_logout_route_actions_0fm~3ij.js");
      case "server/chunks/[root-of-the-server]__0y~8__7._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0y~8__7._.js");
      case "server/chunks/_next-internal_server_app_api_auth_me_route_actions_0q2btsk.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_auth_me_route_actions_0q2btsk.js");
      case "server/chunks/[root-of-the-server]__05koq4~._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__05koq4~._.js");
      case "server/chunks/_next-internal_server_app_api_auth_register_route_actions_096_y_i.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_auth_register_route_actions_096_y_i.js");
      case "server/chunks/[root-of-the-server]__0x-5yhk._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0x-5yhk._.js");
      case "server/chunks/_next-internal_server_app_api_auth_reset-password-direct_route_actions_0tr92hx.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_auth_reset-password-direct_route_actions_0tr92hx.js");
      case "server/chunks/[root-of-the-server]__0svi2u8._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0svi2u8._.js");
      case "server/chunks/_next-internal_server_app_api_auth_verify-email_route_actions_0y0eghp.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_auth_verify-email_route_actions_0y0eghp.js");
      case "server/chunks/ssr/[root-of-the-server]__02y_q9z._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__02y_q9z._.js");
      case "server/chunks/ssr/_next-internal_server_app_faq_page_actions_03t0wwz.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_faq_page_actions_03t0wwz.js");
      case "server/chunks/ssr/node_modules_05x423r._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_05x423r._.js");
      case "server/chunks/ssr/node_modules_@swc_helpers_cjs__interop_require_default_cjs_11~q6fv._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_@swc_helpers_cjs__interop_require_default_cjs_11~q6fv._.js");
      case "server/chunks/ssr/node_modules_next_dist_07tmvkr._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_07tmvkr._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_00kjh7..js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_00kjh7..js");
      case "server/chunks/ssr/[root-of-the-server]__11n7lri._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__11n7lri._.js");
      case "server/chunks/ssr/_12ydlkt._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_12ydlkt._.js");
      case "server/chunks/ssr/_next-internal_server_app_forgot-password_page_actions_13i8n7b.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_forgot-password_page_actions_13i8n7b.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_01o60bn.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_01o60bn.js");
      case "server/chunks/ssr/[root-of-the-server]__0e5lw5k._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0e5lw5k._.js");
      case "server/chunks/ssr/_next-internal_server_app_help_page_actions_02i~glj.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_help_page_actions_02i~glj.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_10rvgmc.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_10rvgmc.js");
      case "server/chunks/ssr/[root-of-the-server]__0-35p28._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0-35p28._.js");
      case "server/chunks/ssr/_next-internal_server_app_instructions_page_actions_134sb6~.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_instructions_page_actions_134sb6~.js");
      case "server/chunks/ssr/app_instructions_page_tsx_0glec8b._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/app_instructions_page_tsx_0glec8b._.js");
      case "server/chunks/ssr/node_modules_0-q9vbs._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_0-q9vbs._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0lg5ul9.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0lg5ul9.js");
      case "server/chunks/ssr/[root-of-the-server]__089om2q._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__089om2q._.js");
      case "server/chunks/ssr/_0hjbu-5._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_0hjbu-5._.js");
      case "server/chunks/ssr/_next-internal_server_app_login_page_actions_02kefem.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_login_page_actions_02kefem.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0dtmr2_.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0dtmr2_.js");
      case "server/chunks/ssr/[root-of-the-server]__0nj7us1._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0nj7us1._.js");
      case "server/chunks/ssr/_next-internal_server_app_page_actions_09-gtaw.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_page_actions_09-gtaw.js");
      case "server/chunks/ssr/app_page_tsx_0z2ix_c._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/app_page_tsx_0z2ix_c._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0yygy7n.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0yygy7n.js");
      case "server/chunks/ssr/[root-of-the-server]__065qnn-._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__065qnn-._.js");
      case "server/chunks/ssr/_next-internal_server_app_privacy_page_actions_0ktvgrj.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_privacy_page_actions_0ktvgrj.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0u3y2l2.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0u3y2l2.js");
      case "server/chunks/ssr/[root-of-the-server]__0mah.8i._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0mah.8i._.js");
      case "server/chunks/ssr/_11p.hi5._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_11p.hi5._.js");
      case "server/chunks/ssr/_next-internal_server_app_register_page_actions_0zq7ka0.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_register_page_actions_0zq7ka0.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0lq-rgt.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0lq-rgt.js");
      case "server/chunks/ssr/[root-of-the-server]__0ke6n7e._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0ke6n7e._.js");
      case "server/chunks/ssr/_0i1vxp5._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_0i1vxp5._.js");
      case "server/chunks/ssr/_next-internal_server_app_researcher_dashboard_page_actions_01z-m34.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_researcher_dashboard_page_actions_01z-m34.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0.gwcpy.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0.gwcpy.js");
      case "server/chunks/ssr/[root-of-the-server]__0l6fjoa._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0l6fjoa._.js");
      case "server/chunks/ssr/_0dbvmqt._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_0dbvmqt._.js");
      case "server/chunks/ssr/_next-internal_server_app_researcher_notifications_page_actions_0ptznl0.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_researcher_notifications_page_actions_0ptznl0.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0frylaw.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0frylaw.js");
      case "server/chunks/ssr/[root-of-the-server]__0rhw.cs._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0rhw.cs._.js");
      case "server/chunks/ssr/_0lcfyp~._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_0lcfyp~._.js");
      case "server/chunks/ssr/_next-internal_server_app_researcher_profile_page_actions_11lv4c8.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_researcher_profile_page_actions_11lv4c8.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_06g.l10.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_06g.l10.js");
      case "server/chunks/ssr/[root-of-the-server]__01oj1te._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__01oj1te._.js");
      case "server/chunks/ssr/_0.v5yyb._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_0.v5yyb._.js");
      case "server/chunks/ssr/_next-internal_server_app_researcher_settings_page_actions_0oa_-fu.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_researcher_settings_page_actions_0oa_-fu.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0svpdai.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0svpdai.js");
      case "server/chunks/ssr/[root-of-the-server]__07r8s~~._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__07r8s~~._.js");
      case "server/chunks/ssr/_0g4b.4j._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_0g4b.4j._.js");
      case "server/chunks/ssr/_next-internal_server_app_researcher_submissions_[id]_page_actions_0emei1j.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_researcher_submissions_[id]_page_actions_0emei1j.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0z36e3e.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0z36e3e.js");
      case "server/chunks/ssr/[root-of-the-server]__0sjs~cq._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0sjs~cq._.js");
      case "server/chunks/ssr/_06lwdyn._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_06lwdyn._.js");
      case "server/chunks/ssr/_next-internal_server_app_researcher_submissions_page_actions_05dac51.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_researcher_submissions_page_actions_05dac51.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0e9npl4.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0e9npl4.js");
      case "server/chunks/ssr/[root-of-the-server]__0ssgej9._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0ssgej9._.js");
      case "server/chunks/ssr/_02pz.v7._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_02pz.v7._.js");
      case "server/chunks/ssr/_next-internal_server_app_researcher_submit_page_actions_0j74eq..js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_researcher_submit_page_actions_0j74eq..js");
      case "server/chunks/ssr/app_researcher_submit_page_tsx_0bkiluo._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/app_researcher_submit_page_tsx_0bkiluo._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0scjbt5.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0scjbt5.js");
      case "server/chunks/ssr/[root-of-the-server]__0f_j4ol._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0f_j4ol._.js");
      case "server/chunks/ssr/_0l7a0.k._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_0l7a0.k._.js");
      case "server/chunks/ssr/_next-internal_server_app_reset-password_page_actions_11t-md-.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_reset-password_page_actions_11t-md-.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0~5yaab.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0~5yaab.js");
      case "server/chunks/ssr/[root-of-the-server]__098rkzj._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__098rkzj._.js");
      case "server/chunks/ssr/_next-internal_server_app_terms_page_actions_0a8-y6r.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_terms_page_actions_0a8-y6r.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0ncz_h~.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0ncz_h~.js");
      case "server/chunks/ssr/[root-of-the-server]__0ajf_tq._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0ajf_tq._.js");
      case "server/chunks/ssr/_0v3nk6a._.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_0v3nk6a._.js");
      case "server/chunks/ssr/_next-internal_server_app_verify-email_page_actions_0-4osj6.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_verify-email_page_actions_0-4osj6.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0f2.7wi.js": return require("/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_0f2.7wi.js");
      default:
        throw new Error(`Not found ${chunkPath}`);
    }
  }
