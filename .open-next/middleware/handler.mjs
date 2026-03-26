
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "3.9.16";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "../../../../.npm/_npx/b8f71965aba33be8/node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie;
    exports.parse = parseCookie;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date = new Date(val);
            if (Number.isFinite(date.valueOf()))
              setCookie.expires = date;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger();
  }
});

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const body = shouldHaveBody ? Buffer2.from(await event.arrayBuffer()) : void 0;
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
function initializeOnce() {
  if (initialized)
    return;
  cachedOrigins = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
  const functions = globalThis.openNextConfig.functions ?? {};
  for (const key in functions) {
    if (key !== "default") {
      const value = functions[key];
      const regexes = [];
      for (const pattern of value.patterns) {
        const regexPattern = `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`;
        regexes.push(new RegExp(regexPattern));
      }
      cachedPatterns.push({
        key,
        patterns: value.patterns,
        regexes
      });
    }
  }
  initialized = true;
}
var cachedOrigins, cachedPatterns, initialized, envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    cachedPatterns = [];
    initialized = false;
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          initializeOnce();
          for (const { key, patterns, regexes } of cachedPatterns) {
            for (const regex of regexes) {
              if (regex.test(_path)) {
                debug("Using origin", key, patterns);
                return cachedOrigins[key];
              }
            }
          }
          if (_path.startsWith("/_next/image") && cachedOrigins.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return cachedOrigins.imageOptimizer;
          }
          if (cachedOrigins.default) {
            debug("Using default origin", cachedOrigins.default, _path);
            return cachedOrigins.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/utils/stream.js
import { ReadableStream as ReadableStream2 } from "node:stream/web";
function toReadableStream(value, isBase64) {
  return new ReadableStream2({
    pull(controller) {
      controller.enqueue(Buffer.from(value, isBase64 ? "base64" : "utf8"));
      controller.close();
    }
  }, { highWaterMark: 0 });
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return new ReadableStream2({
      pull(controller) {
        maybeSomethingBuffer ??= Buffer.from("SOMETHING");
        controller.enqueue(maybeSomethingBuffer);
        controller.close();
      }
    }, { highWaterMark: 0 });
  }
  return new ReadableStream2({
    start(controller) {
      controller.close();
    }
  });
}
var maybeSomethingBuffer;
var init_stream = __esm({
  "../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// .next/server/edge/chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0a9gg_0.js
var require_node_modules_next_dist_esm_build_templates_edge_wrapper_0a9gg_0 = __commonJS({
  ".next/server/edge/chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0a9gg_0.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0a9gg_0.js", 38022, (e, t, l) => {
      self._ENTRIES ||= {};
      let n = Promise.resolve().then(() => e.i(42738));
      n.catch(() => {
      }), self._ENTRIES.middleware_middleware = new Proxy(n, { get(e2, t2) {
        if ("then" === t2) return (t3, l3) => e2.then(t3, l3);
        let l2 = (...l3) => e2.then((e3) => (0, e3[t2])(...l3));
        return l2.then = (l3, n2) => e2.then((e3) => e3[t2]).then(l3, n2), l2;
      } });
    }]);
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// .next/server/edge/chunks/[root-of-the-server]__07aprkn._.js
var require_root_of_the_server_07aprkn = __commonJS({
  ".next/server/edge/chunks/[root-of-the-server]__07aprkn._.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__07aprkn._.js", 74398, (e, t, r) => {
    }, 28042, (e, t, r) => {
      "use strict";
      var n = Object.defineProperty, i = Object.getOwnPropertyDescriptor, s = Object.getOwnPropertyNames, a = Object.prototype.hasOwnProperty, o = {}, l = { RequestCookies: () => g, ResponseCookies: () => m, parseCookie: () => h, parseSetCookie: () => d, stringifyCookie: () => c };
      for (var u in l) n(o, u, { get: l[u], enumerable: true });
      function c(e2) {
        var t2;
        let r2 = ["path" in e2 && e2.path && `Path=${e2.path}`, "expires" in e2 && (e2.expires || 0 === e2.expires) && `Expires=${("number" == typeof e2.expires ? new Date(e2.expires) : e2.expires).toUTCString()}`, "maxAge" in e2 && "number" == typeof e2.maxAge && `Max-Age=${e2.maxAge}`, "domain" in e2 && e2.domain && `Domain=${e2.domain}`, "secure" in e2 && e2.secure && "Secure", "httpOnly" in e2 && e2.httpOnly && "HttpOnly", "sameSite" in e2 && e2.sameSite && `SameSite=${e2.sameSite}`, "partitioned" in e2 && e2.partitioned && "Partitioned", "priority" in e2 && e2.priority && `Priority=${e2.priority}`].filter(Boolean), n2 = `${e2.name}=${encodeURIComponent(null != (t2 = e2.value) ? t2 : "")}`;
        return 0 === r2.length ? n2 : `${n2}; ${r2.join("; ")}`;
      }
      function h(e2) {
        let t2 = /* @__PURE__ */ new Map();
        for (let r2 of e2.split(/; */)) {
          if (!r2) continue;
          let e3 = r2.indexOf("=");
          if (-1 === e3) {
            t2.set(r2, "true");
            continue;
          }
          let [n2, i2] = [r2.slice(0, e3), r2.slice(e3 + 1)];
          try {
            t2.set(n2, decodeURIComponent(null != i2 ? i2 : "true"));
          } catch {
          }
        }
        return t2;
      }
      function d(e2) {
        if (!e2) return;
        let [[t2, r2], ...n2] = h(e2), { domain: i2, expires: s2, httponly: a2, maxage: o2, path: l2, samesite: u2, secure: c2, partitioned: d2, priority: g2 } = Object.fromEntries(n2.map(([e3, t3]) => [e3.toLowerCase().replace(/-/g, ""), t3]));
        {
          var m2, v, b = { name: t2, value: decodeURIComponent(r2), domain: i2, ...s2 && { expires: new Date(s2) }, ...a2 && { httpOnly: true }, ..."string" == typeof o2 && { maxAge: Number(o2) }, path: l2, ...u2 && { sameSite: f.includes(m2 = (m2 = u2).toLowerCase()) ? m2 : void 0 }, ...c2 && { secure: true }, ...g2 && { priority: p.includes(v = (v = g2).toLowerCase()) ? v : void 0 }, ...d2 && { partitioned: true } };
          let e3 = {};
          for (let t3 in b) b[t3] && (e3[t3] = b[t3]);
          return e3;
        }
      }
      t.exports = ((e2, t2, r2, o2) => {
        if (t2 && "object" == typeof t2 || "function" == typeof t2) for (let l2 of s(t2)) a.call(e2, l2) || l2 === r2 || n(e2, l2, { get: () => t2[l2], enumerable: !(o2 = i(t2, l2)) || o2.enumerable });
        return e2;
      })(n({}, "__esModule", { value: true }), o);
      var f = ["strict", "lax", "none"], p = ["low", "medium", "high"], g = class {
        constructor(e2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          const t2 = e2.get("cookie");
          if (t2) for (const [e3, r2] of h(t2)) this._parsed.set(e3, { name: e3, value: r2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed);
          if (!e2.length) return r2.map(([e3, t3]) => t3);
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter(([e3]) => e3 === n2).map(([e3, t3]) => t3);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2] = 1 === e2.length ? [e2[0].name, e2[0].value] : e2, n2 = this._parsed;
          return n2.set(t2, { name: t2, value: r2 }), this._headers.set("cookie", Array.from(n2).map(([e3, t3]) => c(t3)).join("; ")), this;
        }
        delete(e2) {
          let t2 = this._parsed, r2 = Array.isArray(e2) ? e2.map((e3) => t2.delete(e3)) : t2.delete(e2);
          return this._headers.set("cookie", Array.from(t2).map(([e3, t3]) => c(t3)).join("; ")), r2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((e2) => `${e2.name}=${encodeURIComponent(e2.value)}`).join("; ");
        }
      }, m = class {
        constructor(e2) {
          var t2, r2, n2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          const i2 = null != (n2 = null != (r2 = null == (t2 = e2.getSetCookie) ? void 0 : t2.call(e2)) ? r2 : e2.get("set-cookie")) ? n2 : [];
          for (const e3 of Array.isArray(i2) ? i2 : function(e4) {
            if (!e4) return [];
            var t3, r3, n3, i3, s2, a2 = [], o2 = 0;
            function l2() {
              for (; o2 < e4.length && /\s/.test(e4.charAt(o2)); ) o2 += 1;
              return o2 < e4.length;
            }
            for (; o2 < e4.length; ) {
              for (t3 = o2, s2 = false; l2(); ) if ("," === (r3 = e4.charAt(o2))) {
                for (n3 = o2, o2 += 1, l2(), i3 = o2; o2 < e4.length && "=" !== (r3 = e4.charAt(o2)) && ";" !== r3 && "," !== r3; ) o2 += 1;
                o2 < e4.length && "=" === e4.charAt(o2) ? (s2 = true, o2 = i3, a2.push(e4.substring(t3, n3)), t3 = o2) : o2 = n3 + 1;
              } else o2 += 1;
              (!s2 || o2 >= e4.length) && a2.push(e4.substring(t3, e4.length));
            }
            return a2;
          }(i2)) {
            const t3 = d(e3);
            t3 && this._parsed.set(t3.name, t3);
          }
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed.values());
          if (!e2.length) return r2;
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter((e3) => e3.name === n2);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2, n2] = 1 === e2.length ? [e2[0].name, e2[0].value, e2[0]] : e2, i2 = this._parsed;
          return i2.set(t2, function(e3 = { name: "", value: "" }) {
            return "number" == typeof e3.expires && (e3.expires = new Date(e3.expires)), e3.maxAge && (e3.expires = new Date(Date.now() + 1e3 * e3.maxAge)), (null === e3.path || void 0 === e3.path) && (e3.path = "/"), e3;
          }({ name: t2, value: r2, ...n2 })), function(e3, t3) {
            for (let [, r3] of (t3.delete("set-cookie"), e3)) {
              let e4 = c(r3);
              t3.append("set-cookie", e4);
            }
          }(i2, this._headers), this;
        }
        delete(...e2) {
          let [t2, r2] = "string" == typeof e2[0] ? [e2[0]] : [e2[0].name, e2[0]];
          return this.set({ ...r2, name: t2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(c).join("; ");
        }
      };
    }, 59110, (e, t, r) => {
      (() => {
        "use strict";
        let r2, n, i, s, a;
        var o, l, u, c, h, d, f, p, g, m, v, b, y, _, w, E, S = { 491: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ContextAPI = void 0;
          let n2 = r3(223), i2 = r3(172), s2 = r3(930), a2 = "context", o2 = new n2.NoopContextManager();
          class l2 {
            static getInstance() {
              return this._instance || (this._instance = new l2()), this._instance;
            }
            setGlobalContextManager(e3) {
              return (0, i2.registerGlobal)(a2, e3, s2.DiagAPI.instance());
            }
            active() {
              return this._getContextManager().active();
            }
            with(e3, t3, r4, ...n3) {
              return this._getContextManager().with(e3, t3, r4, ...n3);
            }
            bind(e3, t3) {
              return this._getContextManager().bind(e3, t3);
            }
            _getContextManager() {
              return (0, i2.getGlobal)(a2) || o2;
            }
            disable() {
              this._getContextManager().disable(), (0, i2.unregisterGlobal)(a2, s2.DiagAPI.instance());
            }
          }
          t2.ContextAPI = l2;
        }, 930: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagAPI = void 0;
          let n2 = r3(56), i2 = r3(912), s2 = r3(957), a2 = r3(172);
          class o2 {
            constructor() {
              function e3(e4) {
                return function(...t4) {
                  let r4 = (0, a2.getGlobal)("diag");
                  if (r4) return r4[e4](...t4);
                };
              }
              const t3 = this;
              t3.setLogger = (e4, r4 = { logLevel: s2.DiagLogLevel.INFO }) => {
                var n3, o3, l2;
                if (e4 === t3) {
                  let e5 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                  return t3.error(null != (n3 = e5.stack) ? n3 : e5.message), false;
                }
                "number" == typeof r4 && (r4 = { logLevel: r4 });
                let u2 = (0, a2.getGlobal)("diag"), c2 = (0, i2.createLogLevelDiagLogger)(null != (o3 = r4.logLevel) ? o3 : s2.DiagLogLevel.INFO, e4);
                if (u2 && !r4.suppressOverrideMessage) {
                  let e5 = null != (l2 = Error().stack) ? l2 : "<failed to generate stacktrace>";
                  u2.warn(`Current logger will be overwritten from ${e5}`), c2.warn(`Current logger will overwrite one already registered from ${e5}`);
                }
                return (0, a2.registerGlobal)("diag", c2, t3, true);
              }, t3.disable = () => {
                (0, a2.unregisterGlobal)("diag", t3);
              }, t3.createComponentLogger = (e4) => new n2.DiagComponentLogger(e4), t3.verbose = e3("verbose"), t3.debug = e3("debug"), t3.info = e3("info"), t3.warn = e3("warn"), t3.error = e3("error");
            }
            static instance() {
              return this._instance || (this._instance = new o2()), this._instance;
            }
          }
          t2.DiagAPI = o2;
        }, 653: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.MetricsAPI = void 0;
          let n2 = r3(660), i2 = r3(172), s2 = r3(930), a2 = "metrics";
          class o2 {
            static getInstance() {
              return this._instance || (this._instance = new o2()), this._instance;
            }
            setGlobalMeterProvider(e3) {
              return (0, i2.registerGlobal)(a2, e3, s2.DiagAPI.instance());
            }
            getMeterProvider() {
              return (0, i2.getGlobal)(a2) || n2.NOOP_METER_PROVIDER;
            }
            getMeter(e3, t3, r4) {
              return this.getMeterProvider().getMeter(e3, t3, r4);
            }
            disable() {
              (0, i2.unregisterGlobal)(a2, s2.DiagAPI.instance());
            }
          }
          t2.MetricsAPI = o2;
        }, 181: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.PropagationAPI = void 0;
          let n2 = r3(172), i2 = r3(874), s2 = r3(194), a2 = r3(277), o2 = r3(369), l2 = r3(930), u2 = "propagation", c2 = new i2.NoopTextMapPropagator();
          class h2 {
            constructor() {
              this.createBaggage = o2.createBaggage, this.getBaggage = a2.getBaggage, this.getActiveBaggage = a2.getActiveBaggage, this.setBaggage = a2.setBaggage, this.deleteBaggage = a2.deleteBaggage;
            }
            static getInstance() {
              return this._instance || (this._instance = new h2()), this._instance;
            }
            setGlobalPropagator(e3) {
              return (0, n2.registerGlobal)(u2, e3, l2.DiagAPI.instance());
            }
            inject(e3, t3, r4 = s2.defaultTextMapSetter) {
              return this._getGlobalPropagator().inject(e3, t3, r4);
            }
            extract(e3, t3, r4 = s2.defaultTextMapGetter) {
              return this._getGlobalPropagator().extract(e3, t3, r4);
            }
            fields() {
              return this._getGlobalPropagator().fields();
            }
            disable() {
              (0, n2.unregisterGlobal)(u2, l2.DiagAPI.instance());
            }
            _getGlobalPropagator() {
              return (0, n2.getGlobal)(u2) || c2;
            }
          }
          t2.PropagationAPI = h2;
        }, 997: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceAPI = void 0;
          let n2 = r3(172), i2 = r3(846), s2 = r3(139), a2 = r3(607), o2 = r3(930), l2 = "trace";
          class u2 {
            constructor() {
              this._proxyTracerProvider = new i2.ProxyTracerProvider(), this.wrapSpanContext = s2.wrapSpanContext, this.isSpanContextValid = s2.isSpanContextValid, this.deleteSpan = a2.deleteSpan, this.getSpan = a2.getSpan, this.getActiveSpan = a2.getActiveSpan, this.getSpanContext = a2.getSpanContext, this.setSpan = a2.setSpan, this.setSpanContext = a2.setSpanContext;
            }
            static getInstance() {
              return this._instance || (this._instance = new u2()), this._instance;
            }
            setGlobalTracerProvider(e3) {
              let t3 = (0, n2.registerGlobal)(l2, this._proxyTracerProvider, o2.DiagAPI.instance());
              return t3 && this._proxyTracerProvider.setDelegate(e3), t3;
            }
            getTracerProvider() {
              return (0, n2.getGlobal)(l2) || this._proxyTracerProvider;
            }
            getTracer(e3, t3) {
              return this.getTracerProvider().getTracer(e3, t3);
            }
            disable() {
              (0, n2.unregisterGlobal)(l2, o2.DiagAPI.instance()), this._proxyTracerProvider = new i2.ProxyTracerProvider();
            }
          }
          t2.TraceAPI = u2;
        }, 277: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.deleteBaggage = t2.setBaggage = t2.getActiveBaggage = t2.getBaggage = void 0;
          let n2 = r3(491), i2 = (0, r3(780).createContextKey)("OpenTelemetry Baggage Key");
          function s2(e3) {
            return e3.getValue(i2) || void 0;
          }
          t2.getBaggage = s2, t2.getActiveBaggage = function() {
            return s2(n2.ContextAPI.getInstance().active());
          }, t2.setBaggage = function(e3, t3) {
            return e3.setValue(i2, t3);
          }, t2.deleteBaggage = function(e3) {
            return e3.deleteValue(i2);
          };
        }, 993: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.BaggageImpl = void 0;
          class r3 {
            constructor(e3) {
              this._entries = e3 ? new Map(e3) : /* @__PURE__ */ new Map();
            }
            getEntry(e3) {
              let t3 = this._entries.get(e3);
              if (t3) return Object.assign({}, t3);
            }
            getAllEntries() {
              return Array.from(this._entries.entries()).map(([e3, t3]) => [e3, t3]);
            }
            setEntry(e3, t3) {
              let n2 = new r3(this._entries);
              return n2._entries.set(e3, t3), n2;
            }
            removeEntry(e3) {
              let t3 = new r3(this._entries);
              return t3._entries.delete(e3), t3;
            }
            removeEntries(...e3) {
              let t3 = new r3(this._entries);
              for (let r4 of e3) t3._entries.delete(r4);
              return t3;
            }
            clear() {
              return new r3();
            }
          }
          t2.BaggageImpl = r3;
        }, 830: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.baggageEntryMetadataSymbol = void 0, t2.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        }, 369: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.baggageEntryMetadataFromString = t2.createBaggage = void 0;
          let n2 = r3(930), i2 = r3(993), s2 = r3(830), a2 = n2.DiagAPI.instance();
          t2.createBaggage = function(e3 = {}) {
            return new i2.BaggageImpl(new Map(Object.entries(e3)));
          }, t2.baggageEntryMetadataFromString = function(e3) {
            return "string" != typeof e3 && (a2.error(`Cannot create baggage metadata from unknown type: ${typeof e3}`), e3 = ""), { __TYPE__: s2.baggageEntryMetadataSymbol, toString: () => e3 };
          };
        }, 67: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.context = void 0, t2.context = r3(491).ContextAPI.getInstance();
        }, 223: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopContextManager = void 0;
          let n2 = r3(780);
          t2.NoopContextManager = class {
            active() {
              return n2.ROOT_CONTEXT;
            }
            with(e3, t3, r4, ...n3) {
              return t3.call(r4, ...n3);
            }
            bind(e3, t3) {
              return t3;
            }
            enable() {
              return this;
            }
            disable() {
              return this;
            }
          };
        }, 780: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ROOT_CONTEXT = t2.createContextKey = void 0, t2.createContextKey = function(e3) {
            return Symbol.for(e3);
          };
          class r3 {
            constructor(e3) {
              const t3 = this;
              t3._currentContext = e3 ? new Map(e3) : /* @__PURE__ */ new Map(), t3.getValue = (e4) => t3._currentContext.get(e4), t3.setValue = (e4, n2) => {
                let i2 = new r3(t3._currentContext);
                return i2._currentContext.set(e4, n2), i2;
              }, t3.deleteValue = (e4) => {
                let n2 = new r3(t3._currentContext);
                return n2._currentContext.delete(e4), n2;
              };
            }
          }
          t2.ROOT_CONTEXT = new r3();
        }, 506: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.diag = void 0, t2.diag = r3(930).DiagAPI.instance();
        }, 56: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagComponentLogger = void 0;
          let n2 = r3(172);
          function i2(e3, t3, r4) {
            let i3 = (0, n2.getGlobal)("diag");
            if (i3) return r4.unshift(t3), i3[e3](...r4);
          }
          t2.DiagComponentLogger = class {
            constructor(e3) {
              this._namespace = e3.namespace || "DiagComponentLogger";
            }
            debug(...e3) {
              return i2("debug", this._namespace, e3);
            }
            error(...e3) {
              return i2("error", this._namespace, e3);
            }
            info(...e3) {
              return i2("info", this._namespace, e3);
            }
            warn(...e3) {
              return i2("warn", this._namespace, e3);
            }
            verbose(...e3) {
              return i2("verbose", this._namespace, e3);
            }
          };
        }, 972: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagConsoleLogger = void 0;
          let r3 = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }];
          t2.DiagConsoleLogger = class {
            constructor() {
              for (let e3 = 0; e3 < r3.length; e3++) this[r3[e3].n] = /* @__PURE__ */ function(e4) {
                return function(...t3) {
                  if (console) {
                    let r4 = console[e4];
                    if ("function" != typeof r4 && (r4 = console.log), "function" == typeof r4) return r4.apply(console, t3);
                  }
                };
              }(r3[e3].c);
            }
          };
        }, 912: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createLogLevelDiagLogger = void 0;
          let n2 = r3(957);
          t2.createLogLevelDiagLogger = function(e3, t3) {
            function r4(r5, n3) {
              let i2 = t3[r5];
              return "function" == typeof i2 && e3 >= n3 ? i2.bind(t3) : function() {
              };
            }
            return e3 < n2.DiagLogLevel.NONE ? e3 = n2.DiagLogLevel.NONE : e3 > n2.DiagLogLevel.ALL && (e3 = n2.DiagLogLevel.ALL), t3 = t3 || {}, { error: r4("error", n2.DiagLogLevel.ERROR), warn: r4("warn", n2.DiagLogLevel.WARN), info: r4("info", n2.DiagLogLevel.INFO), debug: r4("debug", n2.DiagLogLevel.DEBUG), verbose: r4("verbose", n2.DiagLogLevel.VERBOSE) };
          };
        }, 957: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagLogLevel = void 0, (r3 = t2.DiagLogLevel || (t2.DiagLogLevel = {}))[r3.NONE = 0] = "NONE", r3[r3.ERROR = 30] = "ERROR", r3[r3.WARN = 50] = "WARN", r3[r3.INFO = 60] = "INFO", r3[r3.DEBUG = 70] = "DEBUG", r3[r3.VERBOSE = 80] = "VERBOSE", r3[r3.ALL = 9999] = "ALL";
        }, 172: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.unregisterGlobal = t2.getGlobal = t2.registerGlobal = void 0;
          let n2 = r3(200), i2 = r3(521), s2 = r3(130), a2 = i2.VERSION.split(".")[0], o2 = Symbol.for(`opentelemetry.js.api.${a2}`), l2 = n2._globalThis;
          t2.registerGlobal = function(e3, t3, r4, n3 = false) {
            var s3;
            let a3 = l2[o2] = null != (s3 = l2[o2]) ? s3 : { version: i2.VERSION };
            if (!n3 && a3[e3]) {
              let t4 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e3}`);
              return r4.error(t4.stack || t4.message), false;
            }
            if (a3.version !== i2.VERSION) {
              let t4 = Error(`@opentelemetry/api: Registration of version v${a3.version} for ${e3} does not match previously registered API v${i2.VERSION}`);
              return r4.error(t4.stack || t4.message), false;
            }
            return a3[e3] = t3, r4.debug(`@opentelemetry/api: Registered a global for ${e3} v${i2.VERSION}.`), true;
          }, t2.getGlobal = function(e3) {
            var t3, r4;
            let n3 = null == (t3 = l2[o2]) ? void 0 : t3.version;
            if (n3 && (0, s2.isCompatible)(n3)) return null == (r4 = l2[o2]) ? void 0 : r4[e3];
          }, t2.unregisterGlobal = function(e3, t3) {
            t3.debug(`@opentelemetry/api: Unregistering a global for ${e3} v${i2.VERSION}.`);
            let r4 = l2[o2];
            r4 && delete r4[e3];
          };
        }, 130: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.isCompatible = t2._makeCompatibilityCheck = void 0;
          let n2 = r3(521), i2 = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
          function s2(e3) {
            let t3 = /* @__PURE__ */ new Set([e3]), r4 = /* @__PURE__ */ new Set(), n3 = e3.match(i2);
            if (!n3) return () => false;
            let s3 = { major: +n3[1], minor: +n3[2], patch: +n3[3], prerelease: n3[4] };
            if (null != s3.prerelease) return function(t4) {
              return t4 === e3;
            };
            function a2(e4) {
              return r4.add(e4), false;
            }
            return function(e4) {
              if (t3.has(e4)) return true;
              if (r4.has(e4)) return false;
              let n4 = e4.match(i2);
              if (!n4) return a2(e4);
              let o2 = { major: +n4[1], minor: +n4[2], patch: +n4[3], prerelease: n4[4] };
              if (null != o2.prerelease || s3.major !== o2.major) return a2(e4);
              if (0 === s3.major) return s3.minor === o2.minor && s3.patch <= o2.patch ? (t3.add(e4), true) : a2(e4);
              return s3.minor <= o2.minor ? (t3.add(e4), true) : a2(e4);
            };
          }
          t2._makeCompatibilityCheck = s2, t2.isCompatible = s2(n2.VERSION);
        }, 886: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.metrics = void 0, t2.metrics = r3(653).MetricsAPI.getInstance();
        }, 901: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ValueType = void 0, (r3 = t2.ValueType || (t2.ValueType = {}))[r3.INT = 0] = "INT", r3[r3.DOUBLE = 1] = "DOUBLE";
        }, 102: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createNoopMeter = t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = t2.NOOP_OBSERVABLE_GAUGE_METRIC = t2.NOOP_OBSERVABLE_COUNTER_METRIC = t2.NOOP_UP_DOWN_COUNTER_METRIC = t2.NOOP_HISTOGRAM_METRIC = t2.NOOP_COUNTER_METRIC = t2.NOOP_METER = t2.NoopObservableUpDownCounterMetric = t2.NoopObservableGaugeMetric = t2.NoopObservableCounterMetric = t2.NoopObservableMetric = t2.NoopHistogramMetric = t2.NoopUpDownCounterMetric = t2.NoopCounterMetric = t2.NoopMetric = t2.NoopMeter = void 0;
          class r3 {
            createHistogram(e3, r4) {
              return t2.NOOP_HISTOGRAM_METRIC;
            }
            createCounter(e3, r4) {
              return t2.NOOP_COUNTER_METRIC;
            }
            createUpDownCounter(e3, r4) {
              return t2.NOOP_UP_DOWN_COUNTER_METRIC;
            }
            createObservableGauge(e3, r4) {
              return t2.NOOP_OBSERVABLE_GAUGE_METRIC;
            }
            createObservableCounter(e3, r4) {
              return t2.NOOP_OBSERVABLE_COUNTER_METRIC;
            }
            createObservableUpDownCounter(e3, r4) {
              return t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
            }
            addBatchObservableCallback(e3, t3) {
            }
            removeBatchObservableCallback(e3) {
            }
          }
          t2.NoopMeter = r3;
          class n2 {
          }
          t2.NoopMetric = n2;
          class i2 extends n2 {
            add(e3, t3) {
            }
          }
          t2.NoopCounterMetric = i2;
          class s2 extends n2 {
            add(e3, t3) {
            }
          }
          t2.NoopUpDownCounterMetric = s2;
          class a2 extends n2 {
            record(e3, t3) {
            }
          }
          t2.NoopHistogramMetric = a2;
          class o2 {
            addCallback(e3) {
            }
            removeCallback(e3) {
            }
          }
          t2.NoopObservableMetric = o2;
          class l2 extends o2 {
          }
          t2.NoopObservableCounterMetric = l2;
          class u2 extends o2 {
          }
          t2.NoopObservableGaugeMetric = u2;
          class c2 extends o2 {
          }
          t2.NoopObservableUpDownCounterMetric = c2, t2.NOOP_METER = new r3(), t2.NOOP_COUNTER_METRIC = new i2(), t2.NOOP_HISTOGRAM_METRIC = new a2(), t2.NOOP_UP_DOWN_COUNTER_METRIC = new s2(), t2.NOOP_OBSERVABLE_COUNTER_METRIC = new l2(), t2.NOOP_OBSERVABLE_GAUGE_METRIC = new u2(), t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new c2(), t2.createNoopMeter = function() {
            return t2.NOOP_METER;
          };
        }, 660: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NOOP_METER_PROVIDER = t2.NoopMeterProvider = void 0;
          let n2 = r3(102);
          class i2 {
            getMeter(e3, t3, r4) {
              return n2.NOOP_METER;
            }
          }
          t2.NoopMeterProvider = i2, t2.NOOP_METER_PROVIDER = new i2();
        }, 200: function(e2, t2, r3) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t3[r4];
            } });
          } : function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), e3[n3] = t3[r4];
          }), i2 = this && this.__exportStar || function(e3, t3) {
            for (var r4 in e3) "default" === r4 || Object.prototype.hasOwnProperty.call(t3, r4) || n2(t3, e3, r4);
          };
          Object.defineProperty(t2, "__esModule", { value: true }), i2(r3(46), t2);
        }, 651: (t2, r3) => {
          Object.defineProperty(r3, "__esModule", { value: true }), r3._globalThis = void 0, r3._globalThis = "object" == typeof globalThis ? globalThis : e.g;
        }, 46: function(e2, t2, r3) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t3[r4];
            } });
          } : function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), e3[n3] = t3[r4];
          }), i2 = this && this.__exportStar || function(e3, t3) {
            for (var r4 in e3) "default" === r4 || Object.prototype.hasOwnProperty.call(t3, r4) || n2(t3, e3, r4);
          };
          Object.defineProperty(t2, "__esModule", { value: true }), i2(r3(651), t2);
        }, 939: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.propagation = void 0, t2.propagation = r3(181).PropagationAPI.getInstance();
        }, 874: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTextMapPropagator = void 0, t2.NoopTextMapPropagator = class {
            inject(e3, t3) {
            }
            extract(e3, t3) {
              return e3;
            }
            fields() {
              return [];
            }
          };
        }, 194: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.defaultTextMapSetter = t2.defaultTextMapGetter = void 0, t2.defaultTextMapGetter = { get(e3, t3) {
            if (null != e3) return e3[t3];
          }, keys: (e3) => null == e3 ? [] : Object.keys(e3) }, t2.defaultTextMapSetter = { set(e3, t3, r3) {
            null != e3 && (e3[t3] = r3);
          } };
        }, 845: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.trace = void 0, t2.trace = r3(997).TraceAPI.getInstance();
        }, 403: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NonRecordingSpan = void 0;
          let n2 = r3(476);
          t2.NonRecordingSpan = class {
            constructor(e3 = n2.INVALID_SPAN_CONTEXT) {
              this._spanContext = e3;
            }
            spanContext() {
              return this._spanContext;
            }
            setAttribute(e3, t3) {
              return this;
            }
            setAttributes(e3) {
              return this;
            }
            addEvent(e3, t3) {
              return this;
            }
            setStatus(e3) {
              return this;
            }
            updateName(e3) {
              return this;
            }
            end(e3) {
            }
            isRecording() {
              return false;
            }
            recordException(e3, t3) {
            }
          };
        }, 614: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTracer = void 0;
          let n2 = r3(491), i2 = r3(607), s2 = r3(403), a2 = r3(139), o2 = n2.ContextAPI.getInstance();
          t2.NoopTracer = class {
            startSpan(e3, t3, r4 = o2.active()) {
              var n3;
              if (null == t3 ? void 0 : t3.root) return new s2.NonRecordingSpan();
              let l2 = r4 && (0, i2.getSpanContext)(r4);
              return "object" == typeof (n3 = l2) && "string" == typeof n3.spanId && "string" == typeof n3.traceId && "number" == typeof n3.traceFlags && (0, a2.isSpanContextValid)(l2) ? new s2.NonRecordingSpan(l2) : new s2.NonRecordingSpan();
            }
            startActiveSpan(e3, t3, r4, n3) {
              let s3, a3, l2;
              if (arguments.length < 2) return;
              2 == arguments.length ? l2 = t3 : 3 == arguments.length ? (s3 = t3, l2 = r4) : (s3 = t3, a3 = r4, l2 = n3);
              let u2 = null != a3 ? a3 : o2.active(), c2 = this.startSpan(e3, s3, u2), h2 = (0, i2.setSpan)(u2, c2);
              return o2.with(h2, l2, void 0, c2);
            }
          };
        }, 124: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTracerProvider = void 0;
          let n2 = r3(614);
          t2.NoopTracerProvider = class {
            getTracer(e3, t3, r4) {
              return new n2.NoopTracer();
            }
          };
        }, 125: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ProxyTracer = void 0;
          let n2 = new (r3(614)).NoopTracer();
          t2.ProxyTracer = class {
            constructor(e3, t3, r4, n3) {
              this._provider = e3, this.name = t3, this.version = r4, this.options = n3;
            }
            startSpan(e3, t3, r4) {
              return this._getTracer().startSpan(e3, t3, r4);
            }
            startActiveSpan(e3, t3, r4, n3) {
              let i2 = this._getTracer();
              return Reflect.apply(i2.startActiveSpan, i2, arguments);
            }
            _getTracer() {
              if (this._delegate) return this._delegate;
              let e3 = this._provider.getDelegateTracer(this.name, this.version, this.options);
              return e3 ? (this._delegate = e3, this._delegate) : n2;
            }
          };
        }, 846: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ProxyTracerProvider = void 0;
          let n2 = r3(125), i2 = new (r3(124)).NoopTracerProvider();
          t2.ProxyTracerProvider = class {
            getTracer(e3, t3, r4) {
              var i3;
              return null != (i3 = this.getDelegateTracer(e3, t3, r4)) ? i3 : new n2.ProxyTracer(this, e3, t3, r4);
            }
            getDelegate() {
              var e3;
              return null != (e3 = this._delegate) ? e3 : i2;
            }
            setDelegate(e3) {
              this._delegate = e3;
            }
            getDelegateTracer(e3, t3, r4) {
              var n3;
              return null == (n3 = this._delegate) ? void 0 : n3.getTracer(e3, t3, r4);
            }
          };
        }, 996: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SamplingDecision = void 0, (r3 = t2.SamplingDecision || (t2.SamplingDecision = {}))[r3.NOT_RECORD = 0] = "NOT_RECORD", r3[r3.RECORD = 1] = "RECORD", r3[r3.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
        }, 607: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.getSpanContext = t2.setSpanContext = t2.deleteSpan = t2.setSpan = t2.getActiveSpan = t2.getSpan = void 0;
          let n2 = r3(780), i2 = r3(403), s2 = r3(491), a2 = (0, n2.createContextKey)("OpenTelemetry Context Key SPAN");
          function o2(e3) {
            return e3.getValue(a2) || void 0;
          }
          function l2(e3, t3) {
            return e3.setValue(a2, t3);
          }
          t2.getSpan = o2, t2.getActiveSpan = function() {
            return o2(s2.ContextAPI.getInstance().active());
          }, t2.setSpan = l2, t2.deleteSpan = function(e3) {
            return e3.deleteValue(a2);
          }, t2.setSpanContext = function(e3, t3) {
            return l2(e3, new i2.NonRecordingSpan(t3));
          }, t2.getSpanContext = function(e3) {
            var t3;
            return null == (t3 = o2(e3)) ? void 0 : t3.spanContext();
          };
        }, 325: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceStateImpl = void 0;
          let n2 = r3(564);
          class i2 {
            constructor(e3) {
              this._internalState = /* @__PURE__ */ new Map(), e3 && this._parse(e3);
            }
            set(e3, t3) {
              let r4 = this._clone();
              return r4._internalState.has(e3) && r4._internalState.delete(e3), r4._internalState.set(e3, t3), r4;
            }
            unset(e3) {
              let t3 = this._clone();
              return t3._internalState.delete(e3), t3;
            }
            get(e3) {
              return this._internalState.get(e3);
            }
            serialize() {
              return this._keys().reduce((e3, t3) => (e3.push(t3 + "=" + this.get(t3)), e3), []).join(",");
            }
            _parse(e3) {
              !(e3.length > 512) && (this._internalState = e3.split(",").reverse().reduce((e4, t3) => {
                let r4 = t3.trim(), i3 = r4.indexOf("=");
                if (-1 !== i3) {
                  let s2 = r4.slice(0, i3), a2 = r4.slice(i3 + 1, t3.length);
                  (0, n2.validateKey)(s2) && (0, n2.validateValue)(a2) && e4.set(s2, a2);
                }
                return e4;
              }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
            }
            _keys() {
              return Array.from(this._internalState.keys()).reverse();
            }
            _clone() {
              let e3 = new i2();
              return e3._internalState = new Map(this._internalState), e3;
            }
          }
          t2.TraceStateImpl = i2;
        }, 564: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.validateValue = t2.validateKey = void 0;
          let r3 = "[_0-9a-z-*/]", n2 = `[a-z]${r3}{0,255}`, i2 = `[a-z0-9]${r3}{0,240}@[a-z]${r3}{0,13}`, s2 = RegExp(`^(?:${n2}|${i2})$`), a2 = /^[ -~]{0,255}[!-~]$/, o2 = /,|=/;
          t2.validateKey = function(e3) {
            return s2.test(e3);
          }, t2.validateValue = function(e3) {
            return a2.test(e3) && !o2.test(e3);
          };
        }, 98: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createTraceState = void 0;
          let n2 = r3(325);
          t2.createTraceState = function(e3) {
            return new n2.TraceStateImpl(e3);
          };
        }, 476: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.INVALID_SPAN_CONTEXT = t2.INVALID_TRACEID = t2.INVALID_SPANID = void 0;
          let n2 = r3(475);
          t2.INVALID_SPANID = "0000000000000000", t2.INVALID_TRACEID = "00000000000000000000000000000000", t2.INVALID_SPAN_CONTEXT = { traceId: t2.INVALID_TRACEID, spanId: t2.INVALID_SPANID, traceFlags: n2.TraceFlags.NONE };
        }, 357: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SpanKind = void 0, (r3 = t2.SpanKind || (t2.SpanKind = {}))[r3.INTERNAL = 0] = "INTERNAL", r3[r3.SERVER = 1] = "SERVER", r3[r3.CLIENT = 2] = "CLIENT", r3[r3.PRODUCER = 3] = "PRODUCER", r3[r3.CONSUMER = 4] = "CONSUMER";
        }, 139: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.wrapSpanContext = t2.isSpanContextValid = t2.isValidSpanId = t2.isValidTraceId = void 0;
          let n2 = r3(476), i2 = r3(403), s2 = /^([0-9a-f]{32})$/i, a2 = /^[0-9a-f]{16}$/i;
          function o2(e3) {
            return s2.test(e3) && e3 !== n2.INVALID_TRACEID;
          }
          function l2(e3) {
            return a2.test(e3) && e3 !== n2.INVALID_SPANID;
          }
          t2.isValidTraceId = o2, t2.isValidSpanId = l2, t2.isSpanContextValid = function(e3) {
            return o2(e3.traceId) && l2(e3.spanId);
          }, t2.wrapSpanContext = function(e3) {
            return new i2.NonRecordingSpan(e3);
          };
        }, 847: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SpanStatusCode = void 0, (r3 = t2.SpanStatusCode || (t2.SpanStatusCode = {}))[r3.UNSET = 0] = "UNSET", r3[r3.OK = 1] = "OK", r3[r3.ERROR = 2] = "ERROR";
        }, 475: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceFlags = void 0, (r3 = t2.TraceFlags || (t2.TraceFlags = {}))[r3.NONE = 0] = "NONE", r3[r3.SAMPLED = 1] = "SAMPLED";
        }, 521: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.VERSION = void 0, t2.VERSION = "1.6.0";
        } }, O = {};
        function T(e2) {
          var t2 = O[e2];
          if (void 0 !== t2) return t2.exports;
          var r3 = O[e2] = { exports: {} }, n2 = true;
          try {
            S[e2].call(r3.exports, r3, r3.exports, T), n2 = false;
          } finally {
            n2 && delete O[e2];
          }
          return r3.exports;
        }
        T.ab = "/ROOT/node_modules/next/dist/compiled/@opentelemetry/api/";
        var R = {};
        Object.defineProperty(R, "__esModule", { value: true }), R.trace = R.propagation = R.metrics = R.diag = R.context = R.INVALID_SPAN_CONTEXT = R.INVALID_TRACEID = R.INVALID_SPANID = R.isValidSpanId = R.isValidTraceId = R.isSpanContextValid = R.createTraceState = R.TraceFlags = R.SpanStatusCode = R.SpanKind = R.SamplingDecision = R.ProxyTracerProvider = R.ProxyTracer = R.defaultTextMapSetter = R.defaultTextMapGetter = R.ValueType = R.createNoopMeter = R.DiagLogLevel = R.DiagConsoleLogger = R.ROOT_CONTEXT = R.createContextKey = R.baggageEntryMetadataFromString = void 0, o = T(369), Object.defineProperty(R, "baggageEntryMetadataFromString", { enumerable: true, get: function() {
          return o.baggageEntryMetadataFromString;
        } }), l = T(780), Object.defineProperty(R, "createContextKey", { enumerable: true, get: function() {
          return l.createContextKey;
        } }), Object.defineProperty(R, "ROOT_CONTEXT", { enumerable: true, get: function() {
          return l.ROOT_CONTEXT;
        } }), u = T(972), Object.defineProperty(R, "DiagConsoleLogger", { enumerable: true, get: function() {
          return u.DiagConsoleLogger;
        } }), c = T(957), Object.defineProperty(R, "DiagLogLevel", { enumerable: true, get: function() {
          return c.DiagLogLevel;
        } }), h = T(102), Object.defineProperty(R, "createNoopMeter", { enumerable: true, get: function() {
          return h.createNoopMeter;
        } }), d = T(901), Object.defineProperty(R, "ValueType", { enumerable: true, get: function() {
          return d.ValueType;
        } }), f = T(194), Object.defineProperty(R, "defaultTextMapGetter", { enumerable: true, get: function() {
          return f.defaultTextMapGetter;
        } }), Object.defineProperty(R, "defaultTextMapSetter", { enumerable: true, get: function() {
          return f.defaultTextMapSetter;
        } }), p = T(125), Object.defineProperty(R, "ProxyTracer", { enumerable: true, get: function() {
          return p.ProxyTracer;
        } }), g = T(846), Object.defineProperty(R, "ProxyTracerProvider", { enumerable: true, get: function() {
          return g.ProxyTracerProvider;
        } }), m = T(996), Object.defineProperty(R, "SamplingDecision", { enumerable: true, get: function() {
          return m.SamplingDecision;
        } }), v = T(357), Object.defineProperty(R, "SpanKind", { enumerable: true, get: function() {
          return v.SpanKind;
        } }), b = T(847), Object.defineProperty(R, "SpanStatusCode", { enumerable: true, get: function() {
          return b.SpanStatusCode;
        } }), y = T(475), Object.defineProperty(R, "TraceFlags", { enumerable: true, get: function() {
          return y.TraceFlags;
        } }), _ = T(98), Object.defineProperty(R, "createTraceState", { enumerable: true, get: function() {
          return _.createTraceState;
        } }), w = T(139), Object.defineProperty(R, "isSpanContextValid", { enumerable: true, get: function() {
          return w.isSpanContextValid;
        } }), Object.defineProperty(R, "isValidTraceId", { enumerable: true, get: function() {
          return w.isValidTraceId;
        } }), Object.defineProperty(R, "isValidSpanId", { enumerable: true, get: function() {
          return w.isValidSpanId;
        } }), E = T(476), Object.defineProperty(R, "INVALID_SPANID", { enumerable: true, get: function() {
          return E.INVALID_SPANID;
        } }), Object.defineProperty(R, "INVALID_TRACEID", { enumerable: true, get: function() {
          return E.INVALID_TRACEID;
        } }), Object.defineProperty(R, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function() {
          return E.INVALID_SPAN_CONTEXT;
        } }), r2 = T(67), Object.defineProperty(R, "context", { enumerable: true, get: function() {
          return r2.context;
        } }), n = T(506), Object.defineProperty(R, "diag", { enumerable: true, get: function() {
          return n.diag;
        } }), i = T(886), Object.defineProperty(R, "metrics", { enumerable: true, get: function() {
          return i.metrics;
        } }), s = T(939), Object.defineProperty(R, "propagation", { enumerable: true, get: function() {
          return s.propagation;
        } }), a = T(845), Object.defineProperty(R, "trace", { enumerable: true, get: function() {
          return a.trace;
        } }), R.default = { context: r2.context, diag: n.diag, metrics: i.metrics, propagation: s.propagation, trace: a.trace }, t.exports = R;
      })();
    }, 71498, (e, t, r) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "/ROOT/node_modules/next/dist/compiled/cookie/");
        var e2, r2, n, i, s = {};
        s.parse = function(t2, r3) {
          if ("string" != typeof t2) throw TypeError("argument str must be a string");
          for (var i2 = {}, s2 = t2.split(n), a = (r3 || {}).decode || e2, o = 0; o < s2.length; o++) {
            var l = s2[o], u = l.indexOf("=");
            if (!(u < 0)) {
              var c = l.substr(0, u).trim(), h = l.substr(++u, l.length).trim();
              '"' == h[0] && (h = h.slice(1, -1)), void 0 == i2[c] && (i2[c] = function(e3, t3) {
                try {
                  return t3(e3);
                } catch (t4) {
                  return e3;
                }
              }(h, a));
            }
          }
          return i2;
        }, s.serialize = function(e3, t2, n2) {
          var s2 = n2 || {}, a = s2.encode || r2;
          if ("function" != typeof a) throw TypeError("option encode is invalid");
          if (!i.test(e3)) throw TypeError("argument name is invalid");
          var o = a(t2);
          if (o && !i.test(o)) throw TypeError("argument val is invalid");
          var l = e3 + "=" + o;
          if (null != s2.maxAge) {
            var u = s2.maxAge - 0;
            if (isNaN(u) || !isFinite(u)) throw TypeError("option maxAge is invalid");
            l += "; Max-Age=" + Math.floor(u);
          }
          if (s2.domain) {
            if (!i.test(s2.domain)) throw TypeError("option domain is invalid");
            l += "; Domain=" + s2.domain;
          }
          if (s2.path) {
            if (!i.test(s2.path)) throw TypeError("option path is invalid");
            l += "; Path=" + s2.path;
          }
          if (s2.expires) {
            if ("function" != typeof s2.expires.toUTCString) throw TypeError("option expires is invalid");
            l += "; Expires=" + s2.expires.toUTCString();
          }
          if (s2.httpOnly && (l += "; HttpOnly"), s2.secure && (l += "; Secure"), s2.sameSite) switch ("string" == typeof s2.sameSite ? s2.sameSite.toLowerCase() : s2.sameSite) {
            case true:
            case "strict":
              l += "; SameSite=Strict";
              break;
            case "lax":
              l += "; SameSite=Lax";
              break;
            case "none":
              l += "; SameSite=None";
              break;
            default:
              throw TypeError("option sameSite is invalid");
          }
          return l;
        }, e2 = decodeURIComponent, r2 = encodeURIComponent, n = /; */, i = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/, t.exports = s;
      })();
    }, 99734, (e, t, r) => {
      (() => {
        "use strict";
        let e2, r2, n, i, s;
        var a = { 993: (e3) => {
          var t2 = Object.prototype.hasOwnProperty, r3 = "~";
          function n2() {
          }
          function i2(e4, t3, r4) {
            this.fn = e4, this.context = t3, this.once = r4 || false;
          }
          function s2(e4, t3, n3, s3, a3) {
            if ("function" != typeof n3) throw TypeError("The listener must be a function");
            var o3 = new i2(n3, s3 || e4, a3), l2 = r3 ? r3 + t3 : t3;
            return e4._events[l2] ? e4._events[l2].fn ? e4._events[l2] = [e4._events[l2], o3] : e4._events[l2].push(o3) : (e4._events[l2] = o3, e4._eventsCount++), e4;
          }
          function a2(e4, t3) {
            0 == --e4._eventsCount ? e4._events = new n2() : delete e4._events[t3];
          }
          function o2() {
            this._events = new n2(), this._eventsCount = 0;
          }
          Object.create && (n2.prototype = /* @__PURE__ */ Object.create(null), new n2().__proto__ || (r3 = false)), o2.prototype.eventNames = function() {
            var e4, n3, i3 = [];
            if (0 === this._eventsCount) return i3;
            for (n3 in e4 = this._events) t2.call(e4, n3) && i3.push(r3 ? n3.slice(1) : n3);
            return Object.getOwnPropertySymbols ? i3.concat(Object.getOwnPropertySymbols(e4)) : i3;
          }, o2.prototype.listeners = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            if (!n3) return [];
            if (n3.fn) return [n3.fn];
            for (var i3 = 0, s3 = n3.length, a3 = Array(s3); i3 < s3; i3++) a3[i3] = n3[i3].fn;
            return a3;
          }, o2.prototype.listenerCount = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            return n3 ? n3.fn ? 1 : n3.length : 0;
          }, o2.prototype.emit = function(e4, t3, n3, i3, s3, a3) {
            var o3 = r3 ? r3 + e4 : e4;
            if (!this._events[o3]) return false;
            var l2, u2, c = this._events[o3], h = arguments.length;
            if (c.fn) {
              switch (c.once && this.removeListener(e4, c.fn, void 0, true), h) {
                case 1:
                  return c.fn.call(c.context), true;
                case 2:
                  return c.fn.call(c.context, t3), true;
                case 3:
                  return c.fn.call(c.context, t3, n3), true;
                case 4:
                  return c.fn.call(c.context, t3, n3, i3), true;
                case 5:
                  return c.fn.call(c.context, t3, n3, i3, s3), true;
                case 6:
                  return c.fn.call(c.context, t3, n3, i3, s3, a3), true;
              }
              for (u2 = 1, l2 = Array(h - 1); u2 < h; u2++) l2[u2 - 1] = arguments[u2];
              c.fn.apply(c.context, l2);
            } else {
              var d, f = c.length;
              for (u2 = 0; u2 < f; u2++) switch (c[u2].once && this.removeListener(e4, c[u2].fn, void 0, true), h) {
                case 1:
                  c[u2].fn.call(c[u2].context);
                  break;
                case 2:
                  c[u2].fn.call(c[u2].context, t3);
                  break;
                case 3:
                  c[u2].fn.call(c[u2].context, t3, n3);
                  break;
                case 4:
                  c[u2].fn.call(c[u2].context, t3, n3, i3);
                  break;
                default:
                  if (!l2) for (d = 1, l2 = Array(h - 1); d < h; d++) l2[d - 1] = arguments[d];
                  c[u2].fn.apply(c[u2].context, l2);
              }
            }
            return true;
          }, o2.prototype.on = function(e4, t3, r4) {
            return s2(this, e4, t3, r4, false);
          }, o2.prototype.once = function(e4, t3, r4) {
            return s2(this, e4, t3, r4, true);
          }, o2.prototype.removeListener = function(e4, t3, n3, i3) {
            var s3 = r3 ? r3 + e4 : e4;
            if (!this._events[s3]) return this;
            if (!t3) return a2(this, s3), this;
            var o3 = this._events[s3];
            if (o3.fn) o3.fn !== t3 || i3 && !o3.once || n3 && o3.context !== n3 || a2(this, s3);
            else {
              for (var l2 = 0, u2 = [], c = o3.length; l2 < c; l2++) (o3[l2].fn !== t3 || i3 && !o3[l2].once || n3 && o3[l2].context !== n3) && u2.push(o3[l2]);
              u2.length ? this._events[s3] = 1 === u2.length ? u2[0] : u2 : a2(this, s3);
            }
            return this;
          }, o2.prototype.removeAllListeners = function(e4) {
            var t3;
            return e4 ? (t3 = r3 ? r3 + e4 : e4, this._events[t3] && a2(this, t3)) : (this._events = new n2(), this._eventsCount = 0), this;
          }, o2.prototype.off = o2.prototype.removeListener, o2.prototype.addListener = o2.prototype.on, o2.prefixed = r3, o2.EventEmitter = o2, e3.exports = o2;
        }, 213: (e3) => {
          e3.exports = (e4, t2) => (t2 = t2 || (() => {
          }), e4.then((e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => e5), (e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => {
            throw e5;
          })));
        }, 574: (e3, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.default = function(e4, t3, r3) {
            let n2 = 0, i2 = e4.length;
            for (; i2 > 0; ) {
              let s2 = i2 / 2 | 0, a2 = n2 + s2;
              0 >= r3(e4[a2], t3) ? (n2 = ++a2, i2 -= s2 + 1) : i2 = s2;
            }
            return n2;
          };
        }, 821: (e3, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true });
          let n2 = r3(574);
          t2.default = class {
            constructor() {
              this._queue = [];
            }
            enqueue(e4, t3) {
              let r4 = { priority: (t3 = Object.assign({ priority: 0 }, t3)).priority, run: e4 };
              if (this.size && this._queue[this.size - 1].priority >= t3.priority) return void this._queue.push(r4);
              let i2 = n2.default(this._queue, r4, (e5, t4) => t4.priority - e5.priority);
              this._queue.splice(i2, 0, r4);
            }
            dequeue() {
              let e4 = this._queue.shift();
              return null == e4 ? void 0 : e4.run;
            }
            filter(e4) {
              return this._queue.filter((t3) => t3.priority === e4.priority).map((e5) => e5.run);
            }
            get size() {
              return this._queue.length;
            }
          };
        }, 816: (e3, t2, r3) => {
          let n2 = r3(213);
          class i2 extends Error {
            constructor(e4) {
              super(e4), this.name = "TimeoutError";
            }
          }
          let s2 = (e4, t3, r4) => new Promise((s3, a2) => {
            if ("number" != typeof t3 || t3 < 0) throw TypeError("Expected `milliseconds` to be a positive number");
            if (t3 === 1 / 0) return void s3(e4);
            let o2 = setTimeout(() => {
              if ("function" == typeof r4) {
                try {
                  s3(r4());
                } catch (e5) {
                  a2(e5);
                }
                return;
              }
              let n3 = "string" == typeof r4 ? r4 : `Promise timed out after ${t3} milliseconds`, o3 = r4 instanceof Error ? r4 : new i2(n3);
              "function" == typeof e4.cancel && e4.cancel(), a2(o3);
            }, t3);
            n2(e4.then(s3, a2), () => {
              clearTimeout(o2);
            });
          });
          e3.exports = s2, e3.exports.default = s2, e3.exports.TimeoutError = i2;
        } }, o = {};
        function l(e3) {
          var t2 = o[e3];
          if (void 0 !== t2) return t2.exports;
          var r3 = o[e3] = { exports: {} }, n2 = true;
          try {
            a[e3](r3, r3.exports, l), n2 = false;
          } finally {
            n2 && delete o[e3];
          }
          return r3.exports;
        }
        l.ab = "/ROOT/node_modules/next/dist/compiled/p-queue/";
        var u = {};
        Object.defineProperty(u, "__esModule", { value: true }), e2 = l(993), r2 = l(816), n = l(821), i = () => {
        }, s = new r2.TimeoutError(), u.default = class extends e2 {
          constructor(e3) {
            var t2, r3, s2, a2;
            if (super(), this._intervalCount = 0, this._intervalEnd = 0, this._pendingCount = 0, this._resolveEmpty = i, this._resolveIdle = i, !("number" == typeof (e3 = Object.assign({ carryoverConcurrencyCount: false, intervalCap: 1 / 0, interval: 0, concurrency: 1 / 0, autoStart: true, queueClass: n.default }, e3)).intervalCap && e3.intervalCap >= 1)) throw TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null != (r3 = null == (t2 = e3.intervalCap) ? void 0 : t2.toString()) ? r3 : ""}\` (${typeof e3.intervalCap})`);
            if (void 0 === e3.interval || !(Number.isFinite(e3.interval) && e3.interval >= 0)) throw TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null != (a2 = null == (s2 = e3.interval) ? void 0 : s2.toString()) ? a2 : ""}\` (${typeof e3.interval})`);
            this._carryoverConcurrencyCount = e3.carryoverConcurrencyCount, this._isIntervalIgnored = e3.intervalCap === 1 / 0 || 0 === e3.interval, this._intervalCap = e3.intervalCap, this._interval = e3.interval, this._queue = new e3.queueClass(), this._queueClass = e3.queueClass, this.concurrency = e3.concurrency, this._timeout = e3.timeout, this._throwOnTimeout = true === e3.throwOnTimeout, this._isPaused = false === e3.autoStart;
          }
          get _doesIntervalAllowAnother() {
            return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
          }
          get _doesConcurrentAllowAnother() {
            return this._pendingCount < this._concurrency;
          }
          _next() {
            this._pendingCount--, this._tryToStartAnother(), this.emit("next");
          }
          _resolvePromises() {
            this._resolveEmpty(), this._resolveEmpty = i, 0 === this._pendingCount && (this._resolveIdle(), this._resolveIdle = i, this.emit("idle"));
          }
          _onResumeInterval() {
            this._onInterval(), this._initializeIntervalIfNeeded(), this._timeoutId = void 0;
          }
          _isIntervalPaused() {
            let e3 = Date.now();
            if (void 0 === this._intervalId) {
              let t2 = this._intervalEnd - e3;
              if (!(t2 < 0)) return void 0 === this._timeoutId && (this._timeoutId = setTimeout(() => {
                this._onResumeInterval();
              }, t2)), true;
              this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
            }
            return false;
          }
          _tryToStartAnother() {
            if (0 === this._queue.size) return this._intervalId && clearInterval(this._intervalId), this._intervalId = void 0, this._resolvePromises(), false;
            if (!this._isPaused) {
              let e3 = !this._isIntervalPaused();
              if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                let t2 = this._queue.dequeue();
                return !!t2 && (this.emit("active"), t2(), e3 && this._initializeIntervalIfNeeded(), true);
              }
            }
            return false;
          }
          _initializeIntervalIfNeeded() {
            this._isIntervalIgnored || void 0 !== this._intervalId || (this._intervalId = setInterval(() => {
              this._onInterval();
            }, this._interval), this._intervalEnd = Date.now() + this._interval);
          }
          _onInterval() {
            0 === this._intervalCount && 0 === this._pendingCount && this._intervalId && (clearInterval(this._intervalId), this._intervalId = void 0), this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0, this._processQueue();
          }
          _processQueue() {
            for (; this._tryToStartAnother(); ) ;
          }
          get concurrency() {
            return this._concurrency;
          }
          set concurrency(e3) {
            if (!("number" == typeof e3 && e3 >= 1)) throw TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e3}\` (${typeof e3})`);
            this._concurrency = e3, this._processQueue();
          }
          async add(e3, t2 = {}) {
            return new Promise((n2, i2) => {
              let a2 = async () => {
                this._pendingCount++, this._intervalCount++;
                try {
                  let a3 = void 0 === this._timeout && void 0 === t2.timeout ? e3() : r2.default(Promise.resolve(e3()), void 0 === t2.timeout ? this._timeout : t2.timeout, () => {
                    (void 0 === t2.throwOnTimeout ? this._throwOnTimeout : t2.throwOnTimeout) && i2(s);
                  });
                  n2(await a3);
                } catch (e4) {
                  i2(e4);
                }
                this._next();
              };
              this._queue.enqueue(a2, t2), this._tryToStartAnother(), this.emit("add");
            });
          }
          async addAll(e3, t2) {
            return Promise.all(e3.map(async (e4) => this.add(e4, t2)));
          }
          start() {
            return this._isPaused && (this._isPaused = false, this._processQueue()), this;
          }
          pause() {
            this._isPaused = true;
          }
          clear() {
            this._queue = new this._queueClass();
          }
          async onEmpty() {
            if (0 !== this._queue.size) return new Promise((e3) => {
              let t2 = this._resolveEmpty;
              this._resolveEmpty = () => {
                t2(), e3();
              };
            });
          }
          async onIdle() {
            if (0 !== this._pendingCount || 0 !== this._queue.size) return new Promise((e3) => {
              let t2 = this._resolveIdle;
              this._resolveIdle = () => {
                t2(), e3();
              };
            });
          }
          get size() {
            return this._queue.size;
          }
          sizeBy(e3) {
            return this._queue.filter(e3).length;
          }
          get pending() {
            return this._pendingCount;
          }
          get isPaused() {
            return this._isPaused;
          }
          get timeout() {
            return this._timeout;
          }
          set timeout(e3) {
            this._timeout = e3;
          }
        }, t.exports = u;
      })();
    }, 51615, (e, t, r) => {
      t.exports = e.x("node:buffer", () => (init_node_buffer(), __toCommonJS(node_buffer_exports)));
    }, 78500, (e, t, r) => {
      t.exports = e.x("node:async_hooks", () => (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports)));
    }, 25085, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      var n = { getTestReqInfo: function() {
        return l;
      }, withRequest: function() {
        return o;
      } };
      for (var i in n) Object.defineProperty(r, i, { enumerable: true, get: n[i] });
      let s = new (e.r(78500)).AsyncLocalStorage();
      function a(e2, t2) {
        let r2 = t2.header(e2, "next-test-proxy-port");
        if (!r2) return;
        let n2 = t2.url(e2);
        return { url: n2, proxyPort: Number(r2), testData: t2.header(e2, "next-test-data") || "" };
      }
      function o(e2, t2, r2) {
        let n2 = a(e2, t2);
        return n2 ? s.run(n2, r2) : r2();
      }
      function l(e2, t2) {
        let r2 = s.getStore();
        return r2 || (e2 && t2 ? a(e2, t2) : void 0);
      }
    }, 28325, (e, t, r) => {
      "use strict";
      var n = e.i(51615);
      Object.defineProperty(r, "__esModule", { value: true });
      var i = { handleFetch: function() {
        return u;
      }, interceptFetch: function() {
        return c;
      }, reader: function() {
        return o;
      } };
      for (var s in i) Object.defineProperty(r, s, { enumerable: true, get: i[s] });
      let a = e.r(25085), o = { url: (e2) => e2.url, header: (e2, t2) => e2.headers.get(t2) };
      async function l(e2, t2) {
        let { url: r2, method: i2, headers: s2, body: a2, cache: o2, credentials: l2, integrity: u2, mode: c2, redirect: h, referrer: d, referrerPolicy: f } = t2;
        return { testData: e2, api: "fetch", request: { url: r2, method: i2, headers: [...Array.from(s2), ["next-test-stack", function() {
          let e3 = (Error().stack ?? "").split("\n");
          for (let t3 = 1; t3 < e3.length; t3++) if (e3[t3].length > 0) {
            e3 = e3.slice(t3);
            break;
          }
          return (e3 = (e3 = (e3 = e3.filter((e4) => !e4.includes("/next/dist/"))).slice(0, 5)).map((e4) => e4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: a2 ? n.Buffer.from(await t2.arrayBuffer()).toString("base64") : null, cache: o2, credentials: l2, integrity: u2, mode: c2, redirect: h, referrer: d, referrerPolicy: f } };
      }
      async function u(e2, t2) {
        let r2 = (0, a.getTestReqInfo)(t2, o);
        if (!r2) return e2(t2);
        let { testData: i2, proxyPort: s2 } = r2, u2 = await l(i2, t2), c2 = await e2(`http://localhost:${s2}`, { method: "POST", body: JSON.stringify(u2), next: { internal: true } });
        if (!c2.ok) throw Object.defineProperty(Error(`Proxy request failed: ${c2.status}`), "__NEXT_ERROR_CODE", { value: "E146", enumerable: false, configurable: true });
        let h = await c2.json(), { api: d } = h;
        switch (d) {
          case "continue":
            return e2(t2);
          case "abort":
          case "unhandled":
            throw Object.defineProperty(Error(`Proxy request aborted [${t2.method} ${t2.url}]`), "__NEXT_ERROR_CODE", { value: "E145", enumerable: false, configurable: true });
          case "fetch":
            return function(e3) {
              let { status: t3, headers: r3, body: i3 } = e3.response;
              return new Response(i3 ? n.Buffer.from(i3, "base64") : null, { status: t3, headers: new Headers(r3) });
            }(h);
          default:
            return d;
        }
      }
      function c(t2) {
        return e.g.fetch = function(e2, r2) {
          var n2;
          return (null == r2 || null == (n2 = r2.next) ? void 0 : n2.internal) ? t2(e2, r2) : u(t2, new Request(e2, r2));
        }, () => {
          e.g.fetch = t2;
        };
      }
    }, 94165, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      var n = { interceptTestApis: function() {
        return o;
      }, wrapRequestHandler: function() {
        return l;
      } };
      for (var i in n) Object.defineProperty(r, i, { enumerable: true, get: n[i] });
      let s = e.r(25085), a = e.r(28325);
      function o() {
        return (0, a.interceptFetch)(e.g.fetch);
      }
      function l(e2) {
        return (t2, r2) => (0, s.withRequest)(t2, a.reader, () => e2(t2, r2));
      }
    }, 54846, (e, t, r) => {
      !function() {
        "use strict";
        var e2 = { 114: function(e3) {
          function t2(e4) {
            if ("string" != typeof e4) throw TypeError("Path must be a string. Received " + JSON.stringify(e4));
          }
          function r3(e4, t3) {
            for (var r4, n3 = "", i = 0, s = -1, a = 0, o = 0; o <= e4.length; ++o) {
              if (o < e4.length) r4 = e4.charCodeAt(o);
              else if (47 === r4) break;
              else r4 = 47;
              if (47 === r4) {
                if (s === o - 1 || 1 === a) ;
                else if (s !== o - 1 && 2 === a) {
                  if (n3.length < 2 || 2 !== i || 46 !== n3.charCodeAt(n3.length - 1) || 46 !== n3.charCodeAt(n3.length - 2)) {
                    if (n3.length > 2) {
                      var l = n3.lastIndexOf("/");
                      if (l !== n3.length - 1) {
                        -1 === l ? (n3 = "", i = 0) : i = (n3 = n3.slice(0, l)).length - 1 - n3.lastIndexOf("/"), s = o, a = 0;
                        continue;
                      }
                    } else if (2 === n3.length || 1 === n3.length) {
                      n3 = "", i = 0, s = o, a = 0;
                      continue;
                    }
                  }
                  t3 && (n3.length > 0 ? n3 += "/.." : n3 = "..", i = 2);
                } else n3.length > 0 ? n3 += "/" + e4.slice(s + 1, o) : n3 = e4.slice(s + 1, o), i = o - s - 1;
                s = o, a = 0;
              } else 46 === r4 && -1 !== a ? ++a : a = -1;
            }
            return n3;
          }
          var n2 = { resolve: function() {
            for (var e4, n3, i = "", s = false, a = arguments.length - 1; a >= -1 && !s; a--) a >= 0 ? n3 = arguments[a] : (void 0 === e4 && (e4 = ""), n3 = e4), t2(n3), 0 !== n3.length && (i = n3 + "/" + i, s = 47 === n3.charCodeAt(0));
            if (i = r3(i, !s), s) if (i.length > 0) return "/" + i;
            else return "/";
            return i.length > 0 ? i : ".";
          }, normalize: function(e4) {
            if (t2(e4), 0 === e4.length) return ".";
            var n3 = 47 === e4.charCodeAt(0), i = 47 === e4.charCodeAt(e4.length - 1);
            return (0 !== (e4 = r3(e4, !n3)).length || n3 || (e4 = "."), e4.length > 0 && i && (e4 += "/"), n3) ? "/" + e4 : e4;
          }, isAbsolute: function(e4) {
            return t2(e4), e4.length > 0 && 47 === e4.charCodeAt(0);
          }, join: function() {
            if (0 == arguments.length) return ".";
            for (var e4, r4 = 0; r4 < arguments.length; ++r4) {
              var i = arguments[r4];
              t2(i), i.length > 0 && (void 0 === e4 ? e4 = i : e4 += "/" + i);
            }
            return void 0 === e4 ? "." : n2.normalize(e4);
          }, relative: function(e4, r4) {
            if (t2(e4), t2(r4), e4 === r4 || (e4 = n2.resolve(e4)) === (r4 = n2.resolve(r4))) return "";
            for (var i = 1; i < e4.length && 47 === e4.charCodeAt(i); ++i) ;
            for (var s = e4.length, a = s - i, o = 1; o < r4.length && 47 === r4.charCodeAt(o); ++o) ;
            for (var l = r4.length - o, u = a < l ? a : l, c = -1, h = 0; h <= u; ++h) {
              if (h === u) {
                if (l > u) {
                  if (47 === r4.charCodeAt(o + h)) return r4.slice(o + h + 1);
                  else if (0 === h) return r4.slice(o + h);
                } else a > u && (47 === e4.charCodeAt(i + h) ? c = h : 0 === h && (c = 0));
                break;
              }
              var d = e4.charCodeAt(i + h);
              if (d !== r4.charCodeAt(o + h)) break;
              47 === d && (c = h);
            }
            var f = "";
            for (h = i + c + 1; h <= s; ++h) (h === s || 47 === e4.charCodeAt(h)) && (0 === f.length ? f += ".." : f += "/..");
            return f.length > 0 ? f + r4.slice(o + c) : (o += c, 47 === r4.charCodeAt(o) && ++o, r4.slice(o));
          }, _makeLong: function(e4) {
            return e4;
          }, dirname: function(e4) {
            if (t2(e4), 0 === e4.length) return ".";
            for (var r4 = e4.charCodeAt(0), n3 = 47 === r4, i = -1, s = true, a = e4.length - 1; a >= 1; --a) if (47 === (r4 = e4.charCodeAt(a))) {
              if (!s) {
                i = a;
                break;
              }
            } else s = false;
            return -1 === i ? n3 ? "/" : "." : n3 && 1 === i ? "//" : e4.slice(0, i);
          }, basename: function(e4, r4) {
            if (void 0 !== r4 && "string" != typeof r4) throw TypeError('"ext" argument must be a string');
            t2(e4);
            var n3, i = 0, s = -1, a = true;
            if (void 0 !== r4 && r4.length > 0 && r4.length <= e4.length) {
              if (r4.length === e4.length && r4 === e4) return "";
              var o = r4.length - 1, l = -1;
              for (n3 = e4.length - 1; n3 >= 0; --n3) {
                var u = e4.charCodeAt(n3);
                if (47 === u) {
                  if (!a) {
                    i = n3 + 1;
                    break;
                  }
                } else -1 === l && (a = false, l = n3 + 1), o >= 0 && (u === r4.charCodeAt(o) ? -1 == --o && (s = n3) : (o = -1, s = l));
              }
              return i === s ? s = l : -1 === s && (s = e4.length), e4.slice(i, s);
            }
            for (n3 = e4.length - 1; n3 >= 0; --n3) if (47 === e4.charCodeAt(n3)) {
              if (!a) {
                i = n3 + 1;
                break;
              }
            } else -1 === s && (a = false, s = n3 + 1);
            return -1 === s ? "" : e4.slice(i, s);
          }, extname: function(e4) {
            t2(e4);
            for (var r4 = -1, n3 = 0, i = -1, s = true, a = 0, o = e4.length - 1; o >= 0; --o) {
              var l = e4.charCodeAt(o);
              if (47 === l) {
                if (!s) {
                  n3 = o + 1;
                  break;
                }
                continue;
              }
              -1 === i && (s = false, i = o + 1), 46 === l ? -1 === r4 ? r4 = o : 1 !== a && (a = 1) : -1 !== r4 && (a = -1);
            }
            return -1 === r4 || -1 === i || 0 === a || 1 === a && r4 === i - 1 && r4 === n3 + 1 ? "" : e4.slice(r4, i);
          }, format: function(e4) {
            var t3, r4;
            if (null === e4 || "object" != typeof e4) throw TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e4);
            return t3 = e4.dir || e4.root, r4 = e4.base || (e4.name || "") + (e4.ext || ""), t3 ? t3 === e4.root ? t3 + r4 : t3 + "/" + r4 : r4;
          }, parse: function(e4) {
            t2(e4);
            var r4, n3 = { root: "", dir: "", base: "", ext: "", name: "" };
            if (0 === e4.length) return n3;
            var i = e4.charCodeAt(0), s = 47 === i;
            s ? (n3.root = "/", r4 = 1) : r4 = 0;
            for (var a = -1, o = 0, l = -1, u = true, c = e4.length - 1, h = 0; c >= r4; --c) {
              if (47 === (i = e4.charCodeAt(c))) {
                if (!u) {
                  o = c + 1;
                  break;
                }
                continue;
              }
              -1 === l && (u = false, l = c + 1), 46 === i ? -1 === a ? a = c : 1 !== h && (h = 1) : -1 !== a && (h = -1);
            }
            return -1 === a || -1 === l || 0 === h || 1 === h && a === l - 1 && a === o + 1 ? -1 !== l && (0 === o && s ? n3.base = n3.name = e4.slice(1, l) : n3.base = n3.name = e4.slice(o, l)) : (0 === o && s ? (n3.name = e4.slice(1, a), n3.base = e4.slice(1, l)) : (n3.name = e4.slice(o, a), n3.base = e4.slice(o, l)), n3.ext = e4.slice(a, l)), o > 0 ? n3.dir = e4.slice(0, o - 1) : s && (n3.dir = "/"), n3;
          }, sep: "/", delimiter: ":", win32: null, posix: null };
          n2.posix = n2, e3.exports = n2;
        } }, r2 = {};
        function n(t2) {
          var i = r2[t2];
          if (void 0 !== i) return i.exports;
          var s = r2[t2] = { exports: {} }, a = true;
          try {
            e2[t2](s, s.exports, n), a = false;
          } finally {
            a && delete r2[t2];
          }
          return s.exports;
        }
        n.ab = "/ROOT/node_modules/next/dist/compiled/path-browserify/", t.exports = n(114);
      }();
    }, 68886, (e, t, r) => {
      t.exports = e.r(54846);
    }, 67914, (e, t, r) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "/ROOT/node_modules/next/dist/compiled/path-to-regexp/");
        var e2 = {};
        (() => {
          function t2(e3, t3) {
            void 0 === t3 && (t3 = {});
            for (var r3 = function(e4) {
              for (var t4 = [], r4 = 0; r4 < e4.length; ) {
                var n3 = e4[r4];
                if ("*" === n3 || "+" === n3 || "?" === n3) {
                  t4.push({ type: "MODIFIER", index: r4, value: e4[r4++] });
                  continue;
                }
                if ("\\" === n3) {
                  t4.push({ type: "ESCAPED_CHAR", index: r4++, value: e4[r4++] });
                  continue;
                }
                if ("{" === n3) {
                  t4.push({ type: "OPEN", index: r4, value: e4[r4++] });
                  continue;
                }
                if ("}" === n3) {
                  t4.push({ type: "CLOSE", index: r4, value: e4[r4++] });
                  continue;
                }
                if (":" === n3) {
                  for (var i2 = "", s3 = r4 + 1; s3 < e4.length; ) {
                    var a3 = e4.charCodeAt(s3);
                    if (a3 >= 48 && a3 <= 57 || a3 >= 65 && a3 <= 90 || a3 >= 97 && a3 <= 122 || 95 === a3) {
                      i2 += e4[s3++];
                      continue;
                    }
                    break;
                  }
                  if (!i2) throw TypeError("Missing parameter name at ".concat(r4));
                  t4.push({ type: "NAME", index: r4, value: i2 }), r4 = s3;
                  continue;
                }
                if ("(" === n3) {
                  var o3 = 1, l2 = "", s3 = r4 + 1;
                  if ("?" === e4[s3]) throw TypeError('Pattern cannot start with "?" at '.concat(s3));
                  for (; s3 < e4.length; ) {
                    if ("\\" === e4[s3]) {
                      l2 += e4[s3++] + e4[s3++];
                      continue;
                    }
                    if (")" === e4[s3]) {
                      if (0 == --o3) {
                        s3++;
                        break;
                      }
                    } else if ("(" === e4[s3] && (o3++, "?" !== e4[s3 + 1])) throw TypeError("Capturing groups are not allowed at ".concat(s3));
                    l2 += e4[s3++];
                  }
                  if (o3) throw TypeError("Unbalanced pattern at ".concat(r4));
                  if (!l2) throw TypeError("Missing pattern at ".concat(r4));
                  t4.push({ type: "PATTERN", index: r4, value: l2 }), r4 = s3;
                  continue;
                }
                t4.push({ type: "CHAR", index: r4, value: e4[r4++] });
              }
              return t4.push({ type: "END", index: r4, value: "" }), t4;
            }(e3), n2 = t3.prefixes, s2 = void 0 === n2 ? "./" : n2, a2 = t3.delimiter, o2 = void 0 === a2 ? "/#?" : a2, l = [], u = 0, c = 0, h = "", d = function(e4) {
              if (c < r3.length && r3[c].type === e4) return r3[c++].value;
            }, f = function(e4) {
              var t4 = d(e4);
              if (void 0 !== t4) return t4;
              var n3 = r3[c], i2 = n3.type, s3 = n3.index;
              throw TypeError("Unexpected ".concat(i2, " at ").concat(s3, ", expected ").concat(e4));
            }, p = function() {
              for (var e4, t4 = ""; e4 = d("CHAR") || d("ESCAPED_CHAR"); ) t4 += e4;
              return t4;
            }, g = function(e4) {
              for (var t4 = 0; t4 < o2.length; t4++) {
                var r4 = o2[t4];
                if (e4.indexOf(r4) > -1) return true;
              }
              return false;
            }, m = function(e4) {
              var t4 = l[l.length - 1], r4 = e4 || (t4 && "string" == typeof t4 ? t4 : "");
              if (t4 && !r4) throw TypeError('Must have text between two parameters, missing text after "'.concat(t4.name, '"'));
              return !r4 || g(r4) ? "[^".concat(i(o2), "]+?") : "(?:(?!".concat(i(r4), ")[^").concat(i(o2), "])+?");
            }; c < r3.length; ) {
              var v = d("CHAR"), b = d("NAME"), y = d("PATTERN");
              if (b || y) {
                var _ = v || "";
                -1 === s2.indexOf(_) && (h += _, _ = ""), h && (l.push(h), h = ""), l.push({ name: b || u++, prefix: _, suffix: "", pattern: y || m(_), modifier: d("MODIFIER") || "" });
                continue;
              }
              var w = v || d("ESCAPED_CHAR");
              if (w) {
                h += w;
                continue;
              }
              if (h && (l.push(h), h = ""), d("OPEN")) {
                var _ = p(), E = d("NAME") || "", S = d("PATTERN") || "", O = p();
                f("CLOSE"), l.push({ name: E || (S ? u++ : ""), pattern: E && !S ? m(_) : S, prefix: _, suffix: O, modifier: d("MODIFIER") || "" });
                continue;
              }
              f("END");
            }
            return l;
          }
          function r2(e3, t3) {
            void 0 === t3 && (t3 = {});
            var r3 = s(t3), n2 = t3.encode, i2 = void 0 === n2 ? function(e4) {
              return e4;
            } : n2, a2 = t3.validate, o2 = void 0 === a2 || a2, l = e3.map(function(e4) {
              if ("object" == typeof e4) return new RegExp("^(?:".concat(e4.pattern, ")$"), r3);
            });
            return function(t4) {
              for (var r4 = "", n3 = 0; n3 < e3.length; n3++) {
                var s2 = e3[n3];
                if ("string" == typeof s2) {
                  r4 += s2;
                  continue;
                }
                var a3 = t4 ? t4[s2.name] : void 0, u = "?" === s2.modifier || "*" === s2.modifier, c = "*" === s2.modifier || "+" === s2.modifier;
                if (Array.isArray(a3)) {
                  if (!c) throw TypeError('Expected "'.concat(s2.name, '" to not repeat, but got an array'));
                  if (0 === a3.length) {
                    if (u) continue;
                    throw TypeError('Expected "'.concat(s2.name, '" to not be empty'));
                  }
                  for (var h = 0; h < a3.length; h++) {
                    var d = i2(a3[h], s2);
                    if (o2 && !l[n3].test(d)) throw TypeError('Expected all "'.concat(s2.name, '" to match "').concat(s2.pattern, '", but got "').concat(d, '"'));
                    r4 += s2.prefix + d + s2.suffix;
                  }
                  continue;
                }
                if ("string" == typeof a3 || "number" == typeof a3) {
                  var d = i2(String(a3), s2);
                  if (o2 && !l[n3].test(d)) throw TypeError('Expected "'.concat(s2.name, '" to match "').concat(s2.pattern, '", but got "').concat(d, '"'));
                  r4 += s2.prefix + d + s2.suffix;
                  continue;
                }
                if (!u) {
                  var f = c ? "an array" : "a string";
                  throw TypeError('Expected "'.concat(s2.name, '" to be ').concat(f));
                }
              }
              return r4;
            };
          }
          function n(e3, t3, r3) {
            void 0 === r3 && (r3 = {});
            var n2 = r3.decode, i2 = void 0 === n2 ? function(e4) {
              return e4;
            } : n2;
            return function(r4) {
              var n3 = e3.exec(r4);
              if (!n3) return false;
              for (var s2 = n3[0], a2 = n3.index, o2 = /* @__PURE__ */ Object.create(null), l = 1; l < n3.length; l++) !function(e4) {
                if (void 0 !== n3[e4]) {
                  var r5 = t3[e4 - 1];
                  "*" === r5.modifier || "+" === r5.modifier ? o2[r5.name] = n3[e4].split(r5.prefix + r5.suffix).map(function(e5) {
                    return i2(e5, r5);
                  }) : o2[r5.name] = i2(n3[e4], r5);
                }
              }(l);
              return { path: s2, index: a2, params: o2 };
            };
          }
          function i(e3) {
            return e3.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
          }
          function s(e3) {
            return e3 && e3.sensitive ? "" : "i";
          }
          function a(e3, t3, r3) {
            void 0 === r3 && (r3 = {});
            for (var n2 = r3.strict, a2 = void 0 !== n2 && n2, o2 = r3.start, l = r3.end, u = r3.encode, c = void 0 === u ? function(e4) {
              return e4;
            } : u, h = r3.delimiter, d = r3.endsWith, f = "[".concat(i(void 0 === d ? "" : d), "]|$"), p = "[".concat(i(void 0 === h ? "/#?" : h), "]"), g = void 0 === o2 || o2 ? "^" : "", m = 0; m < e3.length; m++) {
              var v = e3[m];
              if ("string" == typeof v) g += i(c(v));
              else {
                var b = i(c(v.prefix)), y = i(c(v.suffix));
                if (v.pattern) if (t3 && t3.push(v), b || y) if ("+" === v.modifier || "*" === v.modifier) {
                  var _ = "*" === v.modifier ? "?" : "";
                  g += "(?:".concat(b, "((?:").concat(v.pattern, ")(?:").concat(y).concat(b, "(?:").concat(v.pattern, "))*)").concat(y, ")").concat(_);
                } else g += "(?:".concat(b, "(").concat(v.pattern, ")").concat(y, ")").concat(v.modifier);
                else {
                  if ("+" === v.modifier || "*" === v.modifier) throw TypeError('Can not repeat "'.concat(v.name, '" without a prefix and suffix'));
                  g += "(".concat(v.pattern, ")").concat(v.modifier);
                }
                else g += "(?:".concat(b).concat(y, ")").concat(v.modifier);
              }
            }
            if (void 0 === l || l) a2 || (g += "".concat(p, "?")), g += r3.endsWith ? "(?=".concat(f, ")") : "$";
            else {
              var w = e3[e3.length - 1], E = "string" == typeof w ? p.indexOf(w[w.length - 1]) > -1 : void 0 === w;
              a2 || (g += "(?:".concat(p, "(?=").concat(f, "))?")), E || (g += "(?=".concat(p, "|").concat(f, ")"));
            }
            return new RegExp(g, s(r3));
          }
          function o(e3, r3, n2) {
            if (e3 instanceof RegExp) {
              var i2;
              if (!r3) return e3;
              for (var l = /\((?:\?<(.*?)>)?(?!\?)/g, u = 0, c = l.exec(e3.source); c; ) r3.push({ name: c[1] || u++, prefix: "", suffix: "", modifier: "", pattern: "" }), c = l.exec(e3.source);
              return e3;
            }
            return Array.isArray(e3) ? (i2 = e3.map(function(e4) {
              return o(e4, r3, n2).source;
            }), new RegExp("(?:".concat(i2.join("|"), ")"), s(n2))) : a(t2(e3, n2), r3, n2);
          }
          Object.defineProperty(e2, "__esModule", { value: true }), e2.pathToRegexp = e2.tokensToRegexp = e2.regexpToFunction = e2.match = e2.tokensToFunction = e2.compile = e2.parse = void 0, e2.parse = t2, e2.compile = function(e3, n2) {
            return r2(t2(e3, n2), n2);
          }, e2.tokensToFunction = r2, e2.match = function(e3, t3) {
            var r3 = [];
            return n(o(e3, r3, t3), r3, t3);
          }, e2.regexpToFunction = n, e2.tokensToRegexp = a, e2.pathToRegexp = o;
        })(), t.exports = e2;
      })();
    }, 70858, (e) => {
      "use strict";
      var t = function(e2, r2) {
        return (t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e3, t2) {
          e3.__proto__ = t2;
        } || function(e3, t2) {
          for (var r3 in t2) Object.prototype.hasOwnProperty.call(t2, r3) && (e3[r3] = t2[r3]);
        })(e2, r2);
      };
      function r(e2, r2) {
        if ("function" != typeof r2 && null !== r2) throw TypeError("Class extends value " + String(r2) + " is not a constructor or null");
        function n2() {
          this.constructor = e2;
        }
        t(e2, r2), e2.prototype = null === r2 ? Object.create(r2) : (n2.prototype = r2.prototype, new n2());
      }
      var n = function() {
        return (n = Object.assign || function(e2) {
          for (var t2, r2 = 1, n2 = arguments.length; r2 < n2; r2++) for (var i2 in t2 = arguments[r2]) Object.prototype.hasOwnProperty.call(t2, i2) && (e2[i2] = t2[i2]);
          return e2;
        }).apply(this, arguments);
      };
      function i(e2, t2) {
        var r2 = {};
        for (var n2 in e2) Object.prototype.hasOwnProperty.call(e2, n2) && 0 > t2.indexOf(n2) && (r2[n2] = e2[n2]);
        if (null != e2 && "function" == typeof Object.getOwnPropertySymbols) for (var i2 = 0, n2 = Object.getOwnPropertySymbols(e2); i2 < n2.length; i2++) 0 > t2.indexOf(n2[i2]) && Object.prototype.propertyIsEnumerable.call(e2, n2[i2]) && (r2[n2[i2]] = e2[n2[i2]]);
        return r2;
      }
      function s(e2, t2, r2, n2) {
        var i2, s2 = arguments.length, a2 = s2 < 3 ? t2 : null === n2 ? n2 = Object.getOwnPropertyDescriptor(t2, r2) : n2;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a2 = Reflect.decorate(e2, t2, r2, n2);
        else for (var o2 = e2.length - 1; o2 >= 0; o2--) (i2 = e2[o2]) && (a2 = (s2 < 3 ? i2(a2) : s2 > 3 ? i2(t2, r2, a2) : i2(t2, r2)) || a2);
        return s2 > 3 && a2 && Object.defineProperty(t2, r2, a2), a2;
      }
      function a(e2, t2) {
        return function(r2, n2) {
          t2(r2, n2, e2);
        };
      }
      function o(e2, t2, r2, n2, i2, s2) {
        function a2(e3) {
          if (void 0 !== e3 && "function" != typeof e3) throw TypeError("Function expected");
          return e3;
        }
        for (var o2, l2 = n2.kind, u2 = "getter" === l2 ? "get" : "setter" === l2 ? "set" : "value", c2 = !t2 && e2 ? n2.static ? e2 : e2.prototype : null, h2 = t2 || (c2 ? Object.getOwnPropertyDescriptor(c2, n2.name) : {}), d2 = false, f2 = r2.length - 1; f2 >= 0; f2--) {
          var p2 = {};
          for (var g2 in n2) p2[g2] = "access" === g2 ? {} : n2[g2];
          for (var g2 in n2.access) p2.access[g2] = n2.access[g2];
          p2.addInitializer = function(e3) {
            if (d2) throw TypeError("Cannot add initializers after decoration has completed");
            s2.push(a2(e3 || null));
          };
          var m2 = (0, r2[f2])("accessor" === l2 ? { get: h2.get, set: h2.set } : h2[u2], p2);
          if ("accessor" === l2) {
            if (void 0 === m2) continue;
            if (null === m2 || "object" != typeof m2) throw TypeError("Object expected");
            (o2 = a2(m2.get)) && (h2.get = o2), (o2 = a2(m2.set)) && (h2.set = o2), (o2 = a2(m2.init)) && i2.unshift(o2);
          } else (o2 = a2(m2)) && ("field" === l2 ? i2.unshift(o2) : h2[u2] = o2);
        }
        c2 && Object.defineProperty(c2, n2.name, h2), d2 = true;
      }
      function l(e2, t2, r2) {
        for (var n2 = arguments.length > 2, i2 = 0; i2 < t2.length; i2++) r2 = n2 ? t2[i2].call(e2, r2) : t2[i2].call(e2);
        return n2 ? r2 : void 0;
      }
      function u(e2) {
        return "symbol" == typeof e2 ? e2 : "".concat(e2);
      }
      function c(e2, t2, r2) {
        return "symbol" == typeof t2 && (t2 = t2.description ? "[".concat(t2.description, "]") : ""), Object.defineProperty(e2, "name", { configurable: true, value: r2 ? "".concat(r2, " ", t2) : t2 });
      }
      function h(e2, t2) {
        if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e2, t2);
      }
      function d(e2, t2, r2, n2) {
        return new (r2 || (r2 = Promise))(function(i2, s2) {
          function a2(e3) {
            try {
              l2(n2.next(e3));
            } catch (e4) {
              s2(e4);
            }
          }
          function o2(e3) {
            try {
              l2(n2.throw(e3));
            } catch (e4) {
              s2(e4);
            }
          }
          function l2(e3) {
            var t3;
            e3.done ? i2(e3.value) : ((t3 = e3.value) instanceof r2 ? t3 : new r2(function(e4) {
              e4(t3);
            })).then(a2, o2);
          }
          l2((n2 = n2.apply(e2, t2 || [])).next());
        });
      }
      function f(e2, t2) {
        var r2, n2, i2, s2 = { label: 0, sent: function() {
          if (1 & i2[0]) throw i2[1];
          return i2[1];
        }, trys: [], ops: [] }, a2 = Object.create(("function" == typeof Iterator ? Iterator : Object).prototype);
        return a2.next = o2(0), a2.throw = o2(1), a2.return = o2(2), "function" == typeof Symbol && (a2[Symbol.iterator] = function() {
          return this;
        }), a2;
        function o2(o3) {
          return function(l2) {
            var u2 = [o3, l2];
            if (r2) throw TypeError("Generator is already executing.");
            for (; a2 && (a2 = 0, u2[0] && (s2 = 0)), s2; ) try {
              if (r2 = 1, n2 && (i2 = 2 & u2[0] ? n2.return : u2[0] ? n2.throw || ((i2 = n2.return) && i2.call(n2), 0) : n2.next) && !(i2 = i2.call(n2, u2[1])).done) return i2;
              switch (n2 = 0, i2 && (u2 = [2 & u2[0], i2.value]), u2[0]) {
                case 0:
                case 1:
                  i2 = u2;
                  break;
                case 4:
                  return s2.label++, { value: u2[1], done: false };
                case 5:
                  s2.label++, n2 = u2[1], u2 = [0];
                  continue;
                case 7:
                  u2 = s2.ops.pop(), s2.trys.pop();
                  continue;
                default:
                  if (!(i2 = (i2 = s2.trys).length > 0 && i2[i2.length - 1]) && (6 === u2[0] || 2 === u2[0])) {
                    s2 = 0;
                    continue;
                  }
                  if (3 === u2[0] && (!i2 || u2[1] > i2[0] && u2[1] < i2[3])) {
                    s2.label = u2[1];
                    break;
                  }
                  if (6 === u2[0] && s2.label < i2[1]) {
                    s2.label = i2[1], i2 = u2;
                    break;
                  }
                  if (i2 && s2.label < i2[2]) {
                    s2.label = i2[2], s2.ops.push(u2);
                    break;
                  }
                  i2[2] && s2.ops.pop(), s2.trys.pop();
                  continue;
              }
              u2 = t2.call(e2, s2);
            } catch (e3) {
              u2 = [6, e3], n2 = 0;
            } finally {
              r2 = i2 = 0;
            }
            if (5 & u2[0]) throw u2[1];
            return { value: u2[0] ? u2[1] : void 0, done: true };
          };
        }
      }
      var p = Object.create ? function(e2, t2, r2, n2) {
        void 0 === n2 && (n2 = r2);
        var i2 = Object.getOwnPropertyDescriptor(t2, r2);
        (!i2 || ("get" in i2 ? !t2.__esModule : i2.writable || i2.configurable)) && (i2 = { enumerable: true, get: function() {
          return t2[r2];
        } }), Object.defineProperty(e2, n2, i2);
      } : function(e2, t2, r2, n2) {
        void 0 === n2 && (n2 = r2), e2[n2] = t2[r2];
      };
      function g(e2, t2) {
        for (var r2 in e2) "default" === r2 || Object.prototype.hasOwnProperty.call(t2, r2) || p(t2, e2, r2);
      }
      function m(e2) {
        var t2 = "function" == typeof Symbol && Symbol.iterator, r2 = t2 && e2[t2], n2 = 0;
        if (r2) return r2.call(e2);
        if (e2 && "number" == typeof e2.length) return { next: function() {
          return e2 && n2 >= e2.length && (e2 = void 0), { value: e2 && e2[n2++], done: !e2 };
        } };
        throw TypeError(t2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
      }
      function v(e2, t2) {
        var r2 = "function" == typeof Symbol && e2[Symbol.iterator];
        if (!r2) return e2;
        var n2, i2, s2 = r2.call(e2), a2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = s2.next()).done; ) a2.push(n2.value);
        } catch (e3) {
          i2 = { error: e3 };
        } finally {
          try {
            n2 && !n2.done && (r2 = s2.return) && r2.call(s2);
          } finally {
            if (i2) throw i2.error;
          }
        }
        return a2;
      }
      function b() {
        for (var e2 = [], t2 = 0; t2 < arguments.length; t2++) e2 = e2.concat(v(arguments[t2]));
        return e2;
      }
      function y() {
        for (var e2 = 0, t2 = 0, r2 = arguments.length; t2 < r2; t2++) e2 += arguments[t2].length;
        for (var n2 = Array(e2), i2 = 0, t2 = 0; t2 < r2; t2++) for (var s2 = arguments[t2], a2 = 0, o2 = s2.length; a2 < o2; a2++, i2++) n2[i2] = s2[a2];
        return n2;
      }
      function _(e2, t2, r2) {
        if (r2 || 2 == arguments.length) for (var n2, i2 = 0, s2 = t2.length; i2 < s2; i2++) !n2 && i2 in t2 || (n2 || (n2 = Array.prototype.slice.call(t2, 0, i2)), n2[i2] = t2[i2]);
        return e2.concat(n2 || Array.prototype.slice.call(t2));
      }
      function w(e2) {
        return this instanceof w ? (this.v = e2, this) : new w(e2);
      }
      function E(e2, t2, r2) {
        if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
        var n2, i2 = r2.apply(e2, t2 || []), s2 = [];
        return n2 = Object.create(("function" == typeof AsyncIterator ? AsyncIterator : Object).prototype), a2("next"), a2("throw"), a2("return", function(e3) {
          return function(t3) {
            return Promise.resolve(t3).then(e3, u2);
          };
        }), n2[Symbol.asyncIterator] = function() {
          return this;
        }, n2;
        function a2(e3, t3) {
          i2[e3] && (n2[e3] = function(t4) {
            return new Promise(function(r3, n3) {
              s2.push([e3, t4, r3, n3]) > 1 || o2(e3, t4);
            });
          }, t3 && (n2[e3] = t3(n2[e3])));
        }
        function o2(e3, t3) {
          try {
            var r3;
            (r3 = i2[e3](t3)).value instanceof w ? Promise.resolve(r3.value.v).then(l2, u2) : c2(s2[0][2], r3);
          } catch (e4) {
            c2(s2[0][3], e4);
          }
        }
        function l2(e3) {
          o2("next", e3);
        }
        function u2(e3) {
          o2("throw", e3);
        }
        function c2(e3, t3) {
          e3(t3), s2.shift(), s2.length && o2(s2[0][0], s2[0][1]);
        }
      }
      function S(e2) {
        var t2, r2;
        return t2 = {}, n2("next"), n2("throw", function(e3) {
          throw e3;
        }), n2("return"), t2[Symbol.iterator] = function() {
          return this;
        }, t2;
        function n2(n3, i2) {
          t2[n3] = e2[n3] ? function(t3) {
            return (r2 = !r2) ? { value: w(e2[n3](t3)), done: false } : i2 ? i2(t3) : t3;
          } : i2;
        }
      }
      function O(e2) {
        if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
        var t2, r2 = e2[Symbol.asyncIterator];
        return r2 ? r2.call(e2) : (e2 = m(e2), t2 = {}, n2("next"), n2("throw"), n2("return"), t2[Symbol.asyncIterator] = function() {
          return this;
        }, t2);
        function n2(r3) {
          t2[r3] = e2[r3] && function(t3) {
            return new Promise(function(n3, i2) {
              var s2, a2, o2;
              s2 = n3, a2 = i2, o2 = (t3 = e2[r3](t3)).done, Promise.resolve(t3.value).then(function(e3) {
                s2({ value: e3, done: o2 });
              }, a2);
            });
          };
        }
      }
      function T(e2, t2) {
        return Object.defineProperty ? Object.defineProperty(e2, "raw", { value: t2 }) : e2.raw = t2, e2;
      }
      var R = Object.create ? function(e2, t2) {
        Object.defineProperty(e2, "default", { enumerable: true, value: t2 });
      } : function(e2, t2) {
        e2.default = t2;
      }, x = function(e2) {
        return (x = Object.getOwnPropertyNames || function(e3) {
          var t2 = [];
          for (var r2 in e3) Object.prototype.hasOwnProperty.call(e3, r2) && (t2[t2.length] = r2);
          return t2;
        })(e2);
      };
      function k(e2) {
        if (e2 && e2.__esModule) return e2;
        var t2 = {};
        if (null != e2) for (var r2 = x(e2), n2 = 0; n2 < r2.length; n2++) "default" !== r2[n2] && p(t2, e2, r2[n2]);
        return R(t2, e2), t2;
      }
      function C(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      }
      function P(e2, t2, r2, n2) {
        if ("a" === r2 && !n2) throw TypeError("Private accessor was defined without a getter");
        if ("function" == typeof t2 ? e2 !== t2 || !n2 : !t2.has(e2)) throw TypeError("Cannot read private member from an object whose class did not declare it");
        return "m" === r2 ? n2 : "a" === r2 ? n2.call(e2) : n2 ? n2.value : t2.get(e2);
      }
      function A(e2, t2, r2, n2, i2) {
        if ("m" === n2) throw TypeError("Private method is not writable");
        if ("a" === n2 && !i2) throw TypeError("Private accessor was defined without a setter");
        if ("function" == typeof t2 ? e2 !== t2 || !i2 : !t2.has(e2)) throw TypeError("Cannot write private member to an object whose class did not declare it");
        return "a" === n2 ? i2.call(e2, r2) : i2 ? i2.value = r2 : t2.set(e2, r2), r2;
      }
      function j(e2, t2) {
        if (null === t2 || "object" != typeof t2 && "function" != typeof t2) throw TypeError("Cannot use 'in' operator on non-object");
        return "function" == typeof e2 ? t2 === e2 : e2.has(t2);
      }
      function I(e2, t2, r2) {
        if (null != t2) {
          var n2, i2;
          if ("object" != typeof t2 && "function" != typeof t2) throw TypeError("Object expected.");
          if (r2) {
            if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
            n2 = t2[Symbol.asyncDispose];
          }
          if (void 0 === n2) {
            if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
            n2 = t2[Symbol.dispose], r2 && (i2 = n2);
          }
          if ("function" != typeof n2) throw TypeError("Object not disposable.");
          i2 && (n2 = function() {
            try {
              i2.call(this);
            } catch (e3) {
              return Promise.reject(e3);
            }
          }), e2.stack.push({ value: t2, dispose: n2, async: r2 });
        } else r2 && e2.stack.push({ async: true });
        return t2;
      }
      var N = "function" == typeof SuppressedError ? SuppressedError : function(e2, t2, r2) {
        var n2 = Error(r2);
        return n2.name = "SuppressedError", n2.error = e2, n2.suppressed = t2, n2;
      };
      function $(e2) {
        function t2(t3) {
          e2.error = e2.hasError ? new N(t3, e2.error, "An error was suppressed during disposal.") : t3, e2.hasError = true;
        }
        var r2, n2 = 0;
        return function i2() {
          for (; r2 = e2.stack.pop(); ) try {
            if (!r2.async && 1 === n2) return n2 = 0, e2.stack.push(r2), Promise.resolve().then(i2);
            if (r2.dispose) {
              var s2 = r2.dispose.call(r2.value);
              if (r2.async) return n2 |= 2, Promise.resolve(s2).then(i2, function(e3) {
                return t2(e3), i2();
              });
            } else n2 |= 1;
          } catch (e3) {
            t2(e3);
          }
          if (1 === n2) return e2.hasError ? Promise.reject(e2.error) : Promise.resolve();
          if (e2.hasError) throw e2.error;
        }();
      }
      function D(e2, t2) {
        return "string" == typeof e2 && /^\.\.?\//.test(e2) ? e2.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(e3, r2, n2, i2, s2) {
          return r2 ? t2 ? ".jsx" : ".js" : !n2 || i2 && s2 ? n2 + i2 + "." + s2.toLowerCase() + "js" : e3;
        }) : e2;
      }
      let U = { __extends: r, __assign: n, __rest: i, __decorate: s, __param: a, __esDecorate: o, __runInitializers: l, __propKey: u, __setFunctionName: c, __metadata: h, __awaiter: d, __generator: f, __createBinding: p, __exportStar: g, __values: m, __read: v, __spread: b, __spreadArrays: y, __spreadArray: _, __await: w, __asyncGenerator: E, __asyncDelegator: S, __asyncValues: O, __makeTemplateObject: T, __importStar: k, __importDefault: C, __classPrivateFieldGet: P, __classPrivateFieldSet: A, __classPrivateFieldIn: j, __addDisposableResource: I, __disposeResources: $, __rewriteRelativeImportExtension: D };
      e.s(["__addDisposableResource", 0, I, "__assign", () => n, "__asyncDelegator", 0, S, "__asyncGenerator", 0, E, "__asyncValues", 0, O, "__await", 0, w, "__awaiter", 0, d, "__classPrivateFieldGet", 0, P, "__classPrivateFieldIn", 0, j, "__classPrivateFieldSet", 0, A, "__createBinding", 0, p, "__decorate", 0, s, "__disposeResources", 0, $, "__esDecorate", 0, o, "__exportStar", 0, g, "__extends", 0, r, "__generator", 0, f, "__importDefault", 0, C, "__importStar", 0, k, "__makeTemplateObject", 0, T, "__metadata", 0, h, "__param", 0, a, "__propKey", 0, u, "__read", 0, v, "__rest", 0, i, "__rewriteRelativeImportExtension", 0, D, "__runInitializers", 0, l, "__setFunctionName", 0, c, "__spread", 0, b, "__spreadArray", 0, _, "__spreadArrays", 0, y, "__values", 0, m, "default", 0, U]);
    }, 93143, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true }), r.default = class extends Error {
        constructor(e2) {
          super(e2.message), this.name = "PostgrestError", this.details = e2.details, this.hint = e2.hint, this.code = e2.code;
        }
      };
    }, 1264, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      let n = e.r(70858).__importDefault(e.r(93143));
      r.default = class {
        constructor(e2) {
          var t2, r2;
          this.shouldThrowOnError = false, this.method = e2.method, this.url = e2.url, this.headers = new Headers(e2.headers), this.schema = e2.schema, this.body = e2.body, this.shouldThrowOnError = null != (t2 = e2.shouldThrowOnError) && t2, this.signal = e2.signal, this.isMaybeSingle = null != (r2 = e2.isMaybeSingle) && r2, e2.fetch ? this.fetch = e2.fetch : this.fetch = fetch;
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        setHeader(e2, t2) {
          return this.headers = new Headers(this.headers), this.headers.set(e2, t2), this;
        }
        then(e2, t2) {
          void 0 === this.schema || (["GET", "HEAD"].includes(this.method) ? this.headers.set("Accept-Profile", this.schema) : this.headers.set("Content-Profile", this.schema)), "GET" !== this.method && "HEAD" !== this.method && this.headers.set("Content-Type", "application/json");
          let r2 = (0, this.fetch)(this.url.toString(), { method: this.method, headers: this.headers, body: JSON.stringify(this.body), signal: this.signal }).then(async (e3) => {
            var t3, r3, i, s;
            let a = null, o = null, l = null, u = e3.status, c = e3.statusText;
            if (e3.ok) {
              if ("HEAD" !== this.method) {
                let r4 = await e3.text();
                "" === r4 || (o = "text/csv" === this.headers.get("Accept") || this.headers.get("Accept") && (null == (t3 = this.headers.get("Accept")) ? void 0 : t3.includes("application/vnd.pgrst.plan+text")) ? r4 : JSON.parse(r4));
              }
              let n2 = null == (r3 = this.headers.get("Prefer")) ? void 0 : r3.match(/count=(exact|planned|estimated)/), s2 = null == (i = e3.headers.get("content-range")) ? void 0 : i.split("/");
              n2 && s2 && s2.length > 1 && (l = parseInt(s2[1])), this.isMaybeSingle && "GET" === this.method && Array.isArray(o) && (o.length > 1 ? (a = { code: "PGRST116", details: `Results contain ${o.length} rows, application/vnd.pgrst.object+json requires 1 row`, hint: null, message: "JSON object requested, multiple (or no) rows returned" }, o = null, l = null, u = 406, c = "Not Acceptable") : o = 1 === o.length ? o[0] : null);
            } else {
              let t4 = await e3.text();
              try {
                a = JSON.parse(t4), Array.isArray(a) && 404 === e3.status && (o = [], a = null, u = 200, c = "OK");
              } catch (r4) {
                404 === e3.status && "" === t4 ? (u = 204, c = "No Content") : a = { message: t4 };
              }
              if (a && this.isMaybeSingle && (null == (s = null == a ? void 0 : a.details) ? void 0 : s.includes("0 rows")) && (a = null, u = 200, c = "OK"), a && this.shouldThrowOnError) throw new n.default(a);
            }
            return { error: a, data: o, count: l, status: u, statusText: c };
          });
          return this.shouldThrowOnError || (r2 = r2.catch((e3) => {
            var t3, r3, n2;
            return { error: { message: `${null != (t3 = null == e3 ? void 0 : e3.name) ? t3 : "FetchError"}: ${null == e3 ? void 0 : e3.message}`, details: `${null != (r3 = null == e3 ? void 0 : e3.stack) ? r3 : ""}`, hint: "", code: `${null != (n2 = null == e3 ? void 0 : e3.code) ? n2 : ""}` }, data: null, count: null, status: 0, statusText: "" };
          })), r2.then(e2, t2);
        }
        returns() {
          return this;
        }
        overrideTypes() {
          return this;
        }
      };
    }, 44588, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      let n = e.r(70858).__importDefault(e.r(1264));
      class i extends n.default {
        select(e2) {
          let t2 = false, r2 = (null != e2 ? e2 : "*").split("").map((e3) => /\s/.test(e3) && !t2 ? "" : ('"' === e3 && (t2 = !t2), e3)).join("");
          return this.url.searchParams.set("select", r2), this.headers.append("Prefer", "return=representation"), this;
        }
        order(e2, { ascending: t2 = true, nullsFirst: r2, foreignTable: n2, referencedTable: i2 = n2 } = {}) {
          let s = i2 ? `${i2}.order` : "order", a = this.url.searchParams.get(s);
          return this.url.searchParams.set(s, `${a ? `${a},` : ""}${e2}.${t2 ? "asc" : "desc"}${void 0 === r2 ? "" : r2 ? ".nullsfirst" : ".nullslast"}`), this;
        }
        limit(e2, { foreignTable: t2, referencedTable: r2 = t2 } = {}) {
          let n2 = void 0 === r2 ? "limit" : `${r2}.limit`;
          return this.url.searchParams.set(n2, `${e2}`), this;
        }
        range(e2, t2, { foreignTable: r2, referencedTable: n2 = r2 } = {}) {
          let i2 = void 0 === n2 ? "offset" : `${n2}.offset`, s = void 0 === n2 ? "limit" : `${n2}.limit`;
          return this.url.searchParams.set(i2, `${e2}`), this.url.searchParams.set(s, `${t2 - e2 + 1}`), this;
        }
        abortSignal(e2) {
          return this.signal = e2, this;
        }
        single() {
          return this.headers.set("Accept", "application/vnd.pgrst.object+json"), this;
        }
        maybeSingle() {
          return "GET" === this.method ? this.headers.set("Accept", "application/json") : this.headers.set("Accept", "application/vnd.pgrst.object+json"), this.isMaybeSingle = true, this;
        }
        csv() {
          return this.headers.set("Accept", "text/csv"), this;
        }
        geojson() {
          return this.headers.set("Accept", "application/geo+json"), this;
        }
        explain({ analyze: e2 = false, verbose: t2 = false, settings: r2 = false, buffers: n2 = false, wal: i2 = false, format: s = "text" } = {}) {
          var a;
          let o = [e2 ? "analyze" : null, t2 ? "verbose" : null, r2 ? "settings" : null, n2 ? "buffers" : null, i2 ? "wal" : null].filter(Boolean).join("|"), l = null != (a = this.headers.get("Accept")) ? a : "application/json";
          return this.headers.set("Accept", `application/vnd.pgrst.plan+${s}; for="${l}"; options=${o};`), this;
        }
        rollback() {
          return this.headers.append("Prefer", "tx=rollback"), this;
        }
        returns() {
          return this;
        }
        maxAffected(e2) {
          return this.headers.append("Prefer", "handling=strict"), this.headers.append("Prefer", `max-affected=${e2}`), this;
        }
      }
      r.default = i;
    }, 37729, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      let n = e.r(70858).__importDefault(e.r(44588)), i = RegExp("[,()]");
      class s extends n.default {
        eq(e2, t2) {
          return this.url.searchParams.append(e2, `eq.${t2}`), this;
        }
        neq(e2, t2) {
          return this.url.searchParams.append(e2, `neq.${t2}`), this;
        }
        gt(e2, t2) {
          return this.url.searchParams.append(e2, `gt.${t2}`), this;
        }
        gte(e2, t2) {
          return this.url.searchParams.append(e2, `gte.${t2}`), this;
        }
        lt(e2, t2) {
          return this.url.searchParams.append(e2, `lt.${t2}`), this;
        }
        lte(e2, t2) {
          return this.url.searchParams.append(e2, `lte.${t2}`), this;
        }
        like(e2, t2) {
          return this.url.searchParams.append(e2, `like.${t2}`), this;
        }
        likeAllOf(e2, t2) {
          return this.url.searchParams.append(e2, `like(all).{${t2.join(",")}}`), this;
        }
        likeAnyOf(e2, t2) {
          return this.url.searchParams.append(e2, `like(any).{${t2.join(",")}}`), this;
        }
        ilike(e2, t2) {
          return this.url.searchParams.append(e2, `ilike.${t2}`), this;
        }
        ilikeAllOf(e2, t2) {
          return this.url.searchParams.append(e2, `ilike(all).{${t2.join(",")}}`), this;
        }
        ilikeAnyOf(e2, t2) {
          return this.url.searchParams.append(e2, `ilike(any).{${t2.join(",")}}`), this;
        }
        is(e2, t2) {
          return this.url.searchParams.append(e2, `is.${t2}`), this;
        }
        in(e2, t2) {
          let r2 = Array.from(new Set(t2)).map((e3) => "string" == typeof e3 && i.test(e3) ? `"${e3}"` : `${e3}`).join(",");
          return this.url.searchParams.append(e2, `in.(${r2})`), this;
        }
        contains(e2, t2) {
          return "string" == typeof t2 ? this.url.searchParams.append(e2, `cs.${t2}`) : Array.isArray(t2) ? this.url.searchParams.append(e2, `cs.{${t2.join(",")}}`) : this.url.searchParams.append(e2, `cs.${JSON.stringify(t2)}`), this;
        }
        containedBy(e2, t2) {
          return "string" == typeof t2 ? this.url.searchParams.append(e2, `cd.${t2}`) : Array.isArray(t2) ? this.url.searchParams.append(e2, `cd.{${t2.join(",")}}`) : this.url.searchParams.append(e2, `cd.${JSON.stringify(t2)}`), this;
        }
        rangeGt(e2, t2) {
          return this.url.searchParams.append(e2, `sr.${t2}`), this;
        }
        rangeGte(e2, t2) {
          return this.url.searchParams.append(e2, `nxl.${t2}`), this;
        }
        rangeLt(e2, t2) {
          return this.url.searchParams.append(e2, `sl.${t2}`), this;
        }
        rangeLte(e2, t2) {
          return this.url.searchParams.append(e2, `nxr.${t2}`), this;
        }
        rangeAdjacent(e2, t2) {
          return this.url.searchParams.append(e2, `adj.${t2}`), this;
        }
        overlaps(e2, t2) {
          return "string" == typeof t2 ? this.url.searchParams.append(e2, `ov.${t2}`) : this.url.searchParams.append(e2, `ov.{${t2.join(",")}}`), this;
        }
        textSearch(e2, t2, { config: r2, type: n2 } = {}) {
          let i2 = "";
          "plain" === n2 ? i2 = "pl" : "phrase" === n2 ? i2 = "ph" : "websearch" === n2 && (i2 = "w");
          let s2 = void 0 === r2 ? "" : `(${r2})`;
          return this.url.searchParams.append(e2, `${i2}fts${s2}.${t2}`), this;
        }
        match(e2) {
          return Object.entries(e2).forEach(([e3, t2]) => {
            this.url.searchParams.append(e3, `eq.${t2}`);
          }), this;
        }
        not(e2, t2, r2) {
          return this.url.searchParams.append(e2, `not.${t2}.${r2}`), this;
        }
        or(e2, { foreignTable: t2, referencedTable: r2 = t2 } = {}) {
          let n2 = r2 ? `${r2}.or` : "or";
          return this.url.searchParams.append(n2, `(${e2})`), this;
        }
        filter(e2, t2, r2) {
          return this.url.searchParams.append(e2, `${t2}.${r2}`), this;
        }
      }
      r.default = s;
    }, 89237, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      let n = e.r(70858).__importDefault(e.r(37729));
      r.default = class {
        constructor(e2, { headers: t2 = {}, schema: r2, fetch: n2 }) {
          this.url = e2, this.headers = new Headers(t2), this.schema = r2, this.fetch = n2;
        }
        select(e2, t2) {
          let { head: r2 = false, count: i } = null != t2 ? t2 : {}, s = false, a = (null != e2 ? e2 : "*").split("").map((e3) => /\s/.test(e3) && !s ? "" : ('"' === e3 && (s = !s), e3)).join("");
          return this.url.searchParams.set("select", a), i && this.headers.append("Prefer", `count=${i}`), new n.default({ method: r2 ? "HEAD" : "GET", url: this.url, headers: this.headers, schema: this.schema, fetch: this.fetch });
        }
        insert(e2, { count: t2, defaultToNull: r2 = true } = {}) {
          var i;
          if (t2 && this.headers.append("Prefer", `count=${t2}`), r2 || this.headers.append("Prefer", "missing=default"), Array.isArray(e2)) {
            let t3 = e2.reduce((e3, t4) => e3.concat(Object.keys(t4)), []);
            if (t3.length > 0) {
              let e3 = [...new Set(t3)].map((e4) => `"${e4}"`);
              this.url.searchParams.set("columns", e3.join(","));
            }
          }
          return new n.default({ method: "POST", url: this.url, headers: this.headers, schema: this.schema, body: e2, fetch: null != (i = this.fetch) ? i : fetch });
        }
        upsert(e2, { onConflict: t2, ignoreDuplicates: r2 = false, count: i, defaultToNull: s = true } = {}) {
          var a;
          if (this.headers.append("Prefer", `resolution=${r2 ? "ignore" : "merge"}-duplicates`), void 0 !== t2 && this.url.searchParams.set("on_conflict", t2), i && this.headers.append("Prefer", `count=${i}`), s || this.headers.append("Prefer", "missing=default"), Array.isArray(e2)) {
            let t3 = e2.reduce((e3, t4) => e3.concat(Object.keys(t4)), []);
            if (t3.length > 0) {
              let e3 = [...new Set(t3)].map((e4) => `"${e4}"`);
              this.url.searchParams.set("columns", e3.join(","));
            }
          }
          return new n.default({ method: "POST", url: this.url, headers: this.headers, schema: this.schema, body: e2, fetch: null != (a = this.fetch) ? a : fetch });
        }
        update(e2, { count: t2 } = {}) {
          var r2;
          return t2 && this.headers.append("Prefer", `count=${t2}`), new n.default({ method: "PATCH", url: this.url, headers: this.headers, schema: this.schema, body: e2, fetch: null != (r2 = this.fetch) ? r2 : fetch });
        }
        delete({ count: e2 } = {}) {
          var t2;
          return e2 && this.headers.append("Prefer", `count=${e2}`), new n.default({ method: "DELETE", url: this.url, headers: this.headers, schema: this.schema, fetch: null != (t2 = this.fetch) ? t2 : fetch });
        }
      };
    }, 51048, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      let n = e.r(70858), i = n.__importDefault(e.r(89237)), s = n.__importDefault(e.r(37729));
      class a {
        constructor(e2, { headers: t2 = {}, schema: r2, fetch: n2 } = {}) {
          this.url = e2, this.headers = new Headers(t2), this.schemaName = r2, this.fetch = n2;
        }
        from(e2) {
          let t2 = new URL(`${this.url}/${e2}`);
          return new i.default(t2, { headers: new Headers(this.headers), schema: this.schemaName, fetch: this.fetch });
        }
        schema(e2) {
          return new a(this.url, { headers: this.headers, schema: e2, fetch: this.fetch });
        }
        rpc(e2, t2 = {}, { head: r2 = false, get: n2 = false, count: i2 } = {}) {
          var a2;
          let o, l, u = new URL(`${this.url}/rpc/${e2}`);
          r2 || n2 ? (o = r2 ? "HEAD" : "GET", Object.entries(t2).filter(([e3, t3]) => void 0 !== t3).map(([e3, t3]) => [e3, Array.isArray(t3) ? `{${t3.join(",")}}` : `${t3}`]).forEach(([e3, t3]) => {
            u.searchParams.append(e3, t3);
          })) : (o = "POST", l = t2);
          let c = new Headers(this.headers);
          return i2 && c.set("Prefer", `count=${i2}`), new s.default({ method: o, url: u, headers: c, schema: this.schemaName, body: l, fetch: null != (a2 = this.fetch) ? a2 : fetch });
        }
      }
      r.default = a;
    }, 1565, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true }), r.PostgrestError = r.PostgrestBuilder = r.PostgrestTransformBuilder = r.PostgrestFilterBuilder = r.PostgrestQueryBuilder = r.PostgrestClient = void 0;
      let n = e.r(70858), i = n.__importDefault(e.r(51048));
      r.PostgrestClient = i.default;
      let s = n.__importDefault(e.r(89237));
      r.PostgrestQueryBuilder = s.default;
      let a = n.__importDefault(e.r(37729));
      r.PostgrestFilterBuilder = a.default;
      let o = n.__importDefault(e.r(44588));
      r.PostgrestTransformBuilder = o.default;
      let l = n.__importDefault(e.r(1264));
      r.PostgrestBuilder = l.default;
      let u = n.__importDefault(e.r(93143));
      r.PostgrestError = u.default, r.default = { PostgrestClient: i.default, PostgrestQueryBuilder: s.default, PostgrestFilterBuilder: a.default, PostgrestTransformBuilder: o.default, PostgrestBuilder: l.default, PostgrestError: u.default };
    }, 64131, (e, t, r) => {
      "use strict";
      r.parse = function(e2, t2) {
        if ("string" != typeof e2) throw TypeError("argument str must be a string");
        for (var r2 = {}, n2 = (t2 || {}).decode || s, i2 = 0; i2 < e2.length; ) {
          var a2 = e2.indexOf("=", i2);
          if (-1 === a2) break;
          var o = e2.indexOf(";", i2);
          if (-1 === o) o = e2.length;
          else if (o < a2) {
            i2 = e2.lastIndexOf(";", a2 - 1) + 1;
            continue;
          }
          var l = e2.slice(i2, a2).trim();
          if (void 0 === r2[l]) {
            var u = e2.slice(a2 + 1, o).trim();
            34 === u.charCodeAt(0) && (u = u.slice(1, -1)), r2[l] = function(e3, t3) {
              try {
                return t3(e3);
              } catch (t4) {
                return e3;
              }
            }(u, n2);
          }
          i2 = o + 1;
        }
        return r2;
      }, r.serialize = function(e2, t2, r2) {
        var s2 = r2 || {}, o = s2.encode || a;
        if ("function" != typeof o) throw TypeError("option encode is invalid");
        if (!i.test(e2)) throw TypeError("argument name is invalid");
        var l = o(t2);
        if (l && !i.test(l)) throw TypeError("argument val is invalid");
        var u = e2 + "=" + l;
        if (null != s2.maxAge) {
          var c = s2.maxAge - 0;
          if (isNaN(c) || !isFinite(c)) throw TypeError("option maxAge is invalid");
          u += "; Max-Age=" + Math.floor(c);
        }
        if (s2.domain) {
          if (!i.test(s2.domain)) throw TypeError("option domain is invalid");
          u += "; Domain=" + s2.domain;
        }
        if (s2.path) {
          if (!i.test(s2.path)) throw TypeError("option path is invalid");
          u += "; Path=" + s2.path;
        }
        if (s2.expires) {
          var h, d = s2.expires;
          if (h = d, "[object Date]" !== n.call(h) && !(h instanceof Date) || isNaN(d.valueOf())) throw TypeError("option expires is invalid");
          u += "; Expires=" + d.toUTCString();
        }
        if (s2.httpOnly && (u += "; HttpOnly"), s2.secure && (u += "; Secure"), s2.priority) switch ("string" == typeof s2.priority ? s2.priority.toLowerCase() : s2.priority) {
          case "low":
            u += "; Priority=Low";
            break;
          case "medium":
            u += "; Priority=Medium";
            break;
          case "high":
            u += "; Priority=High";
            break;
          default:
            throw TypeError("option priority is invalid");
        }
        if (s2.sameSite) switch ("string" == typeof s2.sameSite ? s2.sameSite.toLowerCase() : s2.sameSite) {
          case true:
          case "strict":
            u += "; SameSite=Strict";
            break;
          case "lax":
            u += "; SameSite=Lax";
            break;
          case "none":
            u += "; SameSite=None";
            break;
          default:
            throw TypeError("option sameSite is invalid");
        }
        return u;
      };
      var n = Object.prototype.toString, i = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
      function s(e2) {
        return -1 !== e2.indexOf("%") ? decodeURIComponent(e2) : e2;
      }
      function a(e2) {
        return encodeURIComponent(e2);
      }
    }, 64445, (e, t, r) => {
      var n = { 226: function(t2, r2) {
        !function(n2) {
          "use strict";
          var i2 = "function", s2 = "undefined", a = "object", o = "string", l = "major", u = "model", c = "name", h = "type", d = "vendor", f = "version", p = "architecture", g = "console", m = "mobile", v = "tablet", b = "smarttv", y = "wearable", _ = "embedded", w = "Amazon", E = "Apple", S = "ASUS", O = "BlackBerry", T = "Browser", R = "Chrome", x = "Firefox", k = "Google", C = "Huawei", P = "Microsoft", A = "Motorola", j = "Opera", I = "Samsung", N = "Sharp", $ = "Sony", D = "Xiaomi", U = "Zebra", L = "Facebook", M = "Chromium OS", B = "Mac OS", q = function(e2, t3) {
            var r3 = {};
            for (var n3 in e2) t3[n3] && t3[n3].length % 2 == 0 ? r3[n3] = t3[n3].concat(e2[n3]) : r3[n3] = e2[n3];
            return r3;
          }, H = function(e2) {
            for (var t3 = {}, r3 = 0; r3 < e2.length; r3++) t3[e2[r3].toUpperCase()] = e2[r3];
            return t3;
          }, V = function(e2, t3) {
            return typeof e2 === o && -1 !== F(t3).indexOf(F(e2));
          }, F = function(e2) {
            return e2.toLowerCase();
          }, G = function(e2, t3) {
            if (typeof e2 === o) return e2 = e2.replace(/^\s\s*/, ""), typeof t3 === s2 ? e2 : e2.substring(0, 350);
          }, W = function(e2, t3) {
            for (var r3, n3, s3, o2, l2, u2, c2 = 0; c2 < t3.length && !l2; ) {
              var h2 = t3[c2], d2 = t3[c2 + 1];
              for (r3 = n3 = 0; r3 < h2.length && !l2 && h2[r3]; ) if (l2 = h2[r3++].exec(e2)) for (s3 = 0; s3 < d2.length; s3++) u2 = l2[++n3], typeof (o2 = d2[s3]) === a && o2.length > 0 ? 2 === o2.length ? typeof o2[1] == i2 ? this[o2[0]] = o2[1].call(this, u2) : this[o2[0]] = o2[1] : 3 === o2.length ? typeof o2[1] !== i2 || o2[1].exec && o2[1].test ? this[o2[0]] = u2 ? u2.replace(o2[1], o2[2]) : void 0 : this[o2[0]] = u2 ? o2[1].call(this, u2, o2[2]) : void 0 : 4 === o2.length && (this[o2[0]] = u2 ? o2[3].call(this, u2.replace(o2[1], o2[2])) : void 0) : this[o2] = u2 || void 0;
              c2 += 2;
            }
          }, z = function(e2, t3) {
            for (var r3 in t3) if (typeof t3[r3] === a && t3[r3].length > 0) {
              for (var n3 = 0; n3 < t3[r3].length; n3++) if (V(t3[r3][n3], e2)) return "?" === r3 ? void 0 : r3;
            } else if (V(t3[r3], e2)) return "?" === r3 ? void 0 : r3;
            return e2;
          }, K = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, J = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [f, [c, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [f, [c, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [c, f], [/opios[\/ ]+([\w\.]+)/i], [f, [c, j + " Mini"]], [/\bopr\/([\w\.]+)/i], [f, [c, j]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [c, f], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [f, [c, "UC" + T]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [f, [c, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [f, [c, "WeChat"]], [/konqueror\/([\w\.]+)/i], [f, [c, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [f, [c, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [f, [c, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[c, /(.+)/, "$1 Secure " + T], f], [/\bfocus\/([\w\.]+)/i], [f, [c, x + " Focus"]], [/\bopt\/([\w\.]+)/i], [f, [c, j + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [f, [c, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [f, [c, "Dolphin"]], [/coast\/([\w\.]+)/i], [f, [c, j + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [f, [c, "MIUI " + T]], [/fxios\/([-\w\.]+)/i], [f, [c, x]], [/\bqihu|(qi?ho?o?|360)browser/i], [[c, "360 " + T]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[c, /(.+)/, "$1 " + T], f], [/(comodo_dragon)\/([\w\.]+)/i], [[c, /_/g, " "], f], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [c, f], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [c], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[c, L], f], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [c, f], [/\bgsa\/([\w\.]+) .*safari\//i], [f, [c, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [f, [c, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [f, [c, R + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[c, R + " WebView"], f], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [f, [c, "Android " + T]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [c, f], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [f, [c, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [f, c], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [c, [f, z, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [c, f], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[c, "Netscape"], f], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [f, [c, x + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [c, f], [/(cobalt)\/([\w\.]+)/i], [c, [f, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[p, "amd64"]], [/(ia32(?=;))/i], [[p, F]], [/((?:i[346]|x)86)[;\)]/i], [[p, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[p, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[p, "armhf"]], [/windows (ce|mobile); ppc;/i], [[p, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[p, /ower/, "", F]], [/(sun4\w)[;\)]/i], [[p, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[p, F]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [u, [d, I], [h, v]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [u, [d, I], [h, m]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [u, [d, E], [h, m]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [u, [d, E], [h, v]], [/(macintosh);/i], [u, [d, E]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [u, [d, N], [h, m]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [u, [d, C], [h, v]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [u, [d, C], [h, m]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[u, /_/g, " "], [d, D], [h, m]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[u, /_/g, " "], [d, D], [h, v]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [u, [d, "OPPO"], [h, m]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [u, [d, "Vivo"], [h, m]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [u, [d, "Realme"], [h, m]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [u, [d, A], [h, m]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [u, [d, A], [h, v]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [u, [d, "LG"], [h, v]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [u, [d, "LG"], [h, m]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [u, [d, "Lenovo"], [h, v]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[u, /_/g, " "], [d, "Nokia"], [h, m]], [/(pixel c)\b/i], [u, [d, k], [h, v]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [u, [d, k], [h, m]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [u, [d, $], [h, m]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[u, "Xperia Tablet"], [d, $], [h, v]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [u, [d, "OnePlus"], [h, m]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [u, [d, w], [h, v]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[u, /(.+)/g, "Fire Phone $1"], [d, w], [h, m]], [/(playbook);[-\w\),; ]+(rim)/i], [u, d, [h, v]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [u, [d, O], [h, m]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [u, [d, S], [h, v]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [u, [d, S], [h, m]], [/(nexus 9)/i], [u, [d, "HTC"], [h, v]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [d, [u, /_/g, " "], [h, m]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [u, [d, "Acer"], [h, v]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [u, [d, "Meizu"], [h, m]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [d, u, [h, m]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [d, u, [h, v]], [/(surface duo)/i], [u, [d, P], [h, v]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [u, [d, "Fairphone"], [h, m]], [/(u304aa)/i], [u, [d, "AT&T"], [h, m]], [/\bsie-(\w*)/i], [u, [d, "Siemens"], [h, m]], [/\b(rct\w+) b/i], [u, [d, "RCA"], [h, v]], [/\b(venue[\d ]{2,7}) b/i], [u, [d, "Dell"], [h, v]], [/\b(q(?:mv|ta)\w+) b/i], [u, [d, "Verizon"], [h, v]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [u, [d, "Barnes & Noble"], [h, v]], [/\b(tm\d{3}\w+) b/i], [u, [d, "NuVision"], [h, v]], [/\b(k88) b/i], [u, [d, "ZTE"], [h, v]], [/\b(nx\d{3}j) b/i], [u, [d, "ZTE"], [h, m]], [/\b(gen\d{3}) b.+49h/i], [u, [d, "Swiss"], [h, m]], [/\b(zur\d{3}) b/i], [u, [d, "Swiss"], [h, v]], [/\b((zeki)?tb.*\b) b/i], [u, [d, "Zeki"], [h, v]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[d, "Dragon Touch"], u, [h, v]], [/\b(ns-?\w{0,9}) b/i], [u, [d, "Insignia"], [h, v]], [/\b((nxa|next)-?\w{0,9}) b/i], [u, [d, "NextBook"], [h, v]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[d, "Voice"], u, [h, m]], [/\b(lvtel\-)?(v1[12]) b/i], [[d, "LvTel"], u, [h, m]], [/\b(ph-1) /i], [u, [d, "Essential"], [h, m]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [u, [d, "Envizen"], [h, v]], [/\b(trio[-\w\. ]+) b/i], [u, [d, "MachSpeed"], [h, v]], [/\btu_(1491) b/i], [u, [d, "Rotor"], [h, v]], [/(shield[\w ]+) b/i], [u, [d, "Nvidia"], [h, v]], [/(sprint) (\w+)/i], [d, u, [h, m]], [/(kin\.[onetw]{3})/i], [[u, /\./g, " "], [d, P], [h, m]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [u, [d, U], [h, v]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [u, [d, U], [h, m]], [/smart-tv.+(samsung)/i], [d, [h, b]], [/hbbtv.+maple;(\d+)/i], [[u, /^/, "SmartTV"], [d, I], [h, b]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[d, "LG"], [h, b]], [/(apple) ?tv/i], [d, [u, E + " TV"], [h, b]], [/crkey/i], [[u, R + "cast"], [d, k], [h, b]], [/droid.+aft(\w)( bui|\))/i], [u, [d, w], [h, b]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [u, [d, N], [h, b]], [/(bravia[\w ]+)( bui|\))/i], [u, [d, $], [h, b]], [/(mitv-\w{5}) bui/i], [u, [d, D], [h, b]], [/Hbbtv.*(technisat) (.*);/i], [d, u, [h, b]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[d, G], [u, G], [h, b]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[h, b]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [d, u, [h, g]], [/droid.+; (shield) bui/i], [u, [d, "Nvidia"], [h, g]], [/(playstation [345portablevi]+)/i], [u, [d, $], [h, g]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [u, [d, P], [h, g]], [/((pebble))app/i], [d, u, [h, y]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [u, [d, E], [h, y]], [/droid.+; (glass) \d/i], [u, [d, k], [h, y]], [/droid.+; (wt63?0{2,3})\)/i], [u, [d, U], [h, y]], [/(quest( 2| pro)?)/i], [u, [d, L], [h, y]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [d, [h, _]], [/(aeobc)\b/i], [u, [d, w], [h, _]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [u, [h, m]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [u, [h, v]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[h, v]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[h, m]], [/(android[-\w\. ]{0,9});.+buil/i], [u, [d, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [f, [c, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [f, [c, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [c, f], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [f, c]], os: [[/microsoft (windows) (vista|xp)/i], [c, f], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [c, [f, z, K]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[c, "Windows"], [f, z, K]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[f, /_/g, "."], [c, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[c, B], [f, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [f, c], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [c, f], [/\(bb(10);/i], [f, [c, O]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [f, [c, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [f, [c, x + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [f, [c, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [f, [c, "watchOS"]], [/crkey\/([\d\.]+)/i], [f, [c, R + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[c, M], f], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [c, f], [/(sunos) ?([\w\.\d]*)/i], [[c, "Solaris"], f], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [c, f]] }, X = function(e2, t3) {
            if (typeof e2 === a && (t3 = e2, e2 = void 0), !(this instanceof X)) return new X(e2, t3).getResult();
            var r3 = typeof n2 !== s2 && n2.navigator ? n2.navigator : void 0, g2 = e2 || (r3 && r3.userAgent ? r3.userAgent : ""), b2 = r3 && r3.userAgentData ? r3.userAgentData : void 0, y2 = t3 ? q(J, t3) : J, _2 = r3 && r3.userAgent == g2;
            return this.getBrowser = function() {
              var e3, t4 = {};
              return t4[c] = void 0, t4[f] = void 0, W.call(t4, g2, y2.browser), t4[l] = typeof (e3 = t4[f]) === o ? e3.replace(/[^\d\.]/g, "").split(".")[0] : void 0, _2 && r3 && r3.brave && typeof r3.brave.isBrave == i2 && (t4[c] = "Brave"), t4;
            }, this.getCPU = function() {
              var e3 = {};
              return e3[p] = void 0, W.call(e3, g2, y2.cpu), e3;
            }, this.getDevice = function() {
              var e3 = {};
              return e3[d] = void 0, e3[u] = void 0, e3[h] = void 0, W.call(e3, g2, y2.device), _2 && !e3[h] && b2 && b2.mobile && (e3[h] = m), _2 && "Macintosh" == e3[u] && r3 && typeof r3.standalone !== s2 && r3.maxTouchPoints && r3.maxTouchPoints > 2 && (e3[u] = "iPad", e3[h] = v), e3;
            }, this.getEngine = function() {
              var e3 = {};
              return e3[c] = void 0, e3[f] = void 0, W.call(e3, g2, y2.engine), e3;
            }, this.getOS = function() {
              var e3 = {};
              return e3[c] = void 0, e3[f] = void 0, W.call(e3, g2, y2.os), _2 && !e3[c] && b2 && "Unknown" != b2.platform && (e3[c] = b2.platform.replace(/chrome os/i, M).replace(/macos/i, B)), e3;
            }, this.getResult = function() {
              return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
            }, this.getUA = function() {
              return g2;
            }, this.setUA = function(e3) {
              return g2 = typeof e3 === o && e3.length > 350 ? G(e3, 350) : e3, this;
            }, this.setUA(g2), this;
          };
          if (X.VERSION = "1.0.35", X.BROWSER = H([c, f, l]), X.CPU = H([p]), X.DEVICE = H([u, d, h, g, m, b, v, y, _]), X.ENGINE = X.OS = H([c, f]), typeof r2 !== s2) t2.exports && (r2 = t2.exports = X), r2.UAParser = X;
          else if (typeof define === i2 && define.amd) e.r, void 0 !== X && e.v(X);
          else typeof n2 !== s2 && (n2.UAParser = X);
          var Y = typeof n2 !== s2 && (n2.jQuery || n2.Zepto);
          if (Y && !Y.ua) {
            var Q = new X();
            Y.ua = Q.getResult(), Y.ua.get = function() {
              return Q.getUA();
            }, Y.ua.set = function(e2) {
              Q.setUA(e2);
              var t3 = Q.getResult();
              for (var r3 in t3) Y.ua[r3] = t3[r3];
            };
          }
        }(this);
      } }, i = {};
      function s(e2) {
        var t2 = i[e2];
        if (void 0 !== t2) return t2.exports;
        var r2 = i[e2] = { exports: {} }, a = true;
        try {
          n[e2].call(r2.exports, r2, r2.exports, s), a = false;
        } finally {
          a && delete i[e2];
        }
        return r2.exports;
      }
      s.ab = "/ROOT/node_modules/next/dist/compiled/ua-parser-js/", t.exports = s(226);
    }, 8946, (e, t, r) => {
      "use strict";
      var n = { H: null, A: null };
      function i(e2) {
        var t2 = "https://react.dev/errors/" + e2;
        if (1 < arguments.length) {
          t2 += "?args[]=" + encodeURIComponent(arguments[1]);
          for (var r2 = 2; r2 < arguments.length; r2++) t2 += "&args[]=" + encodeURIComponent(arguments[r2]);
        }
        return "Minified React error #" + e2 + "; visit " + t2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }
      var s = Array.isArray;
      function a() {
      }
      var o = Symbol.for("react.transitional.element"), l = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), c = Symbol.for("react.strict_mode"), h = Symbol.for("react.profiler"), d = Symbol.for("react.forward_ref"), f = Symbol.for("react.suspense"), p = Symbol.for("react.memo"), g = Symbol.for("react.lazy"), m = Symbol.for("react.activity"), v = Symbol.for("react.view_transition"), b = Symbol.iterator, y = Object.prototype.hasOwnProperty, _ = Object.assign;
      function w(e2, t2, r2) {
        var n2 = r2.ref;
        return { $$typeof: o, type: e2, key: t2, ref: void 0 !== n2 ? n2 : null, props: r2 };
      }
      function E(e2) {
        return "object" == typeof e2 && null !== e2 && e2.$$typeof === o;
      }
      var S = /\/+/g;
      function O(e2, t2) {
        var r2, n2;
        return "object" == typeof e2 && null !== e2 && null != e2.key ? (r2 = "" + e2.key, n2 = { "=": "=0", ":": "=2" }, "$" + r2.replace(/[=:]/g, function(e3) {
          return n2[e3];
        })) : t2.toString(36);
      }
      function T(e2, t2, r2) {
        if (null == e2) return e2;
        var n2 = [], u2 = 0;
        return !function e3(t3, r3, n3, u3, c2) {
          var h2, d2, f2, p2 = typeof t3;
          ("undefined" === p2 || "boolean" === p2) && (t3 = null);
          var m2 = false;
          if (null === t3) m2 = true;
          else switch (p2) {
            case "bigint":
            case "string":
            case "number":
              m2 = true;
              break;
            case "object":
              switch (t3.$$typeof) {
                case o:
                case l:
                  m2 = true;
                  break;
                case g:
                  return e3((m2 = t3._init)(t3._payload), r3, n3, u3, c2);
              }
          }
          if (m2) return c2 = c2(t3), m2 = "" === u3 ? "." + O(t3, 0) : u3, s(c2) ? (n3 = "", null != m2 && (n3 = m2.replace(S, "$&/") + "/"), e3(c2, r3, n3, "", function(e4) {
            return e4;
          })) : null != c2 && (E(c2) && (h2 = c2, d2 = n3 + (null == c2.key || t3 && t3.key === c2.key ? "" : ("" + c2.key).replace(S, "$&/") + "/") + m2, c2 = w(h2.type, d2, h2.props)), r3.push(c2)), 1;
          m2 = 0;
          var v2 = "" === u3 ? "." : u3 + ":";
          if (s(t3)) for (var y2 = 0; y2 < t3.length; y2++) p2 = v2 + O(u3 = t3[y2], y2), m2 += e3(u3, r3, n3, p2, c2);
          else if ("function" == typeof (y2 = null === (f2 = t3) || "object" != typeof f2 ? null : "function" == typeof (f2 = b && f2[b] || f2["@@iterator"]) ? f2 : null)) for (t3 = y2.call(t3), y2 = 0; !(u3 = t3.next()).done; ) p2 = v2 + O(u3 = u3.value, y2++), m2 += e3(u3, r3, n3, p2, c2);
          else if ("object" === p2) {
            if ("function" == typeof t3.then) return e3(function(e4) {
              switch (e4.status) {
                case "fulfilled":
                  return e4.value;
                case "rejected":
                  throw e4.reason;
                default:
                  switch ("string" == typeof e4.status ? e4.then(a, a) : (e4.status = "pending", e4.then(function(t4) {
                    "pending" === e4.status && (e4.status = "fulfilled", e4.value = t4);
                  }, function(t4) {
                    "pending" === e4.status && (e4.status = "rejected", e4.reason = t4);
                  })), e4.status) {
                    case "fulfilled":
                      return e4.value;
                    case "rejected":
                      throw e4.reason;
                  }
              }
              throw e4;
            }(t3), r3, n3, u3, c2);
            throw Error(i(31, "[object Object]" === (r3 = String(t3)) ? "object with keys {" + Object.keys(t3).join(", ") + "}" : r3));
          }
          return m2;
        }(e2, n2, "", "", function(e3) {
          return t2.call(r2, e3, u2++);
        }), n2;
      }
      function R(e2) {
        if (-1 === e2._status) {
          var t2 = (0, e2._result)();
          t2.then(function(r2) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 1, e2._result = r2, void 0 === t2.status && (t2.status = "fulfilled", t2.value = r2));
          }, function(r2) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 2, e2._result = r2, void 0 === t2.status && (t2.status = "rejected", t2.reason = r2));
          }), -1 === e2._status && (e2._status = 0, e2._result = t2);
        }
        if (1 === e2._status) return e2._result.default;
        throw e2._result;
      }
      function x() {
        return /* @__PURE__ */ new WeakMap();
      }
      function k() {
        return { s: 0, v: void 0, o: null, p: null };
      }
      r.Activity = m, r.Children = { map: T, forEach: function(e2, t2, r2) {
        T(e2, function() {
          t2.apply(this, arguments);
        }, r2);
      }, count: function(e2) {
        var t2 = 0;
        return T(e2, function() {
          t2++;
        }), t2;
      }, toArray: function(e2) {
        return T(e2, function(e3) {
          return e3;
        }) || [];
      }, only: function(e2) {
        if (!E(e2)) throw Error(i(143));
        return e2;
      } }, r.Fragment = u, r.Profiler = h, r.StrictMode = c, r.Suspense = f, r.ViewTransition = v, r.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = n, r.cache = function(e2) {
        return function() {
          var t2 = n.A;
          if (!t2) return e2.apply(null, arguments);
          var r2 = t2.getCacheForType(x);
          void 0 === (t2 = r2.get(e2)) && (t2 = k(), r2.set(e2, t2)), r2 = 0;
          for (var i2 = arguments.length; r2 < i2; r2++) {
            var s2 = arguments[r2];
            if ("function" == typeof s2 || "object" == typeof s2 && null !== s2) {
              var a2 = t2.o;
              null === a2 && (t2.o = a2 = /* @__PURE__ */ new WeakMap()), void 0 === (t2 = a2.get(s2)) && (t2 = k(), a2.set(s2, t2));
            } else null === (a2 = t2.p) && (t2.p = a2 = /* @__PURE__ */ new Map()), void 0 === (t2 = a2.get(s2)) && (t2 = k(), a2.set(s2, t2));
          }
          if (1 === t2.s) return t2.v;
          if (2 === t2.s) throw t2.v;
          try {
            var o2 = e2.apply(null, arguments);
            return (r2 = t2).s = 1, r2.v = o2;
          } catch (e3) {
            throw (o2 = t2).s = 2, o2.v = e3, e3;
          }
        };
      }, r.cacheSignal = function() {
        var e2 = n.A;
        return e2 ? e2.cacheSignal() : null;
      }, r.captureOwnerStack = function() {
        return null;
      }, r.cloneElement = function(e2, t2, r2) {
        if (null == e2) throw Error(i(267, e2));
        var n2 = _({}, e2.props), s2 = e2.key;
        if (null != t2) for (a2 in void 0 !== t2.key && (s2 = "" + t2.key), t2) y.call(t2, a2) && "key" !== a2 && "__self" !== a2 && "__source" !== a2 && ("ref" !== a2 || void 0 !== t2.ref) && (n2[a2] = t2[a2]);
        var a2 = arguments.length - 2;
        if (1 === a2) n2.children = r2;
        else if (1 < a2) {
          for (var o2 = Array(a2), l2 = 0; l2 < a2; l2++) o2[l2] = arguments[l2 + 2];
          n2.children = o2;
        }
        return w(e2.type, s2, n2);
      }, r.createElement = function(e2, t2, r2) {
        var n2, i2 = {}, s2 = null;
        if (null != t2) for (n2 in void 0 !== t2.key && (s2 = "" + t2.key), t2) y.call(t2, n2) && "key" !== n2 && "__self" !== n2 && "__source" !== n2 && (i2[n2] = t2[n2]);
        var a2 = arguments.length - 2;
        if (1 === a2) i2.children = r2;
        else if (1 < a2) {
          for (var o2 = Array(a2), l2 = 0; l2 < a2; l2++) o2[l2] = arguments[l2 + 2];
          i2.children = o2;
        }
        if (e2 && e2.defaultProps) for (n2 in a2 = e2.defaultProps) void 0 === i2[n2] && (i2[n2] = a2[n2]);
        return w(e2, s2, i2);
      }, r.createRef = function() {
        return { current: null };
      }, r.forwardRef = function(e2) {
        return { $$typeof: d, render: e2 };
      }, r.isValidElement = E, r.lazy = function(e2) {
        return { $$typeof: g, _payload: { _status: -1, _result: e2 }, _init: R };
      }, r.memo = function(e2, t2) {
        return { $$typeof: p, type: e2, compare: void 0 === t2 ? null : t2 };
      }, r.use = function(e2) {
        return n.H.use(e2);
      }, r.useCallback = function(e2, t2) {
        return n.H.useCallback(e2, t2);
      }, r.useDebugValue = function() {
      }, r.useId = function() {
        return n.H.useId();
      }, r.useMemo = function(e2, t2) {
        return n.H.useMemo(e2, t2);
      }, r.version = "19.3.0-canary-3f0b9e61-20260317";
    }, 40049, (e, t, r) => {
      "use strict";
      t.exports = e.r(8946);
    }, 42738, (e) => {
      "use strict";
      let t, r, n;
      async function i() {
        return "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && await _ENTRIES.middleware_instrumentation;
      }
      e.i(74398);
      let s = null;
      async function a() {
        if ("phase-production-build" === process.env.NEXT_PHASE) return;
        s || (s = i());
        let e10 = await s;
        if (null == e10 ? void 0 : e10.register) try {
          await e10.register();
        } catch (e11) {
          throw e11.message = `An error occurred while loading instrumentation hook: ${e11.message}`, e11;
        }
      }
      async function o(...e10) {
        let t10 = await i();
        try {
          var r10;
          await (null == t10 || null == (r10 = t10.onRequestError) ? void 0 : r10.call(t10, ...e10));
        } catch (e11) {
          console.error("Error in instrumentation.onRequestError:", e11);
        }
      }
      let l = null;
      function u() {
        return l || (l = a()), l;
      }
      function c(e10) {
        return `The edge runtime does not support Node.js '${e10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== e.g.process && (process.env = e.g.process.env, e.g.process = process);
      try {
        Object.defineProperty(globalThis, "__import_unsupported", { value: function(e10) {
          let t10 = new Proxy(function() {
          }, { get(t11, r10) {
            if ("then" === r10) return {};
            throw Object.defineProperty(Error(c(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, construct() {
            throw Object.defineProperty(Error(c(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, apply(r10, n10, i10) {
            if ("function" == typeof i10[0]) return i10[0](t10);
            throw Object.defineProperty(Error(c(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          } });
          return new Proxy({}, { get: () => t10 });
        }, enumerable: false, configurable: false });
      } catch {
      }
      u();
      class h extends Error {
        constructor({ page: e10 }) {
          super(`The middleware "${e10}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class d extends Error {
        constructor() {
          super("The request.page has been deprecated in favour of `URLPattern`.\n  Read more: https://nextjs.org/docs/messages/middleware-request-page\n  ");
        }
      }
      class f extends Error {
        constructor() {
          super("The request.ua has been removed in favour of `userAgent` function.\n  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent\n  ");
        }
      }
      let p = "x-prerender-revalidate", g = ".meta", m = "x-next-cache-tags", v = "x-next-revalidated-tags", b = "_N_T_", y = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", apiNode: "api-node", apiEdge: "api-edge", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", pagesDirBrowser: "pages-dir-browser", pagesDirEdge: "pages-dir-edge", pagesDirNode: "pages-dir-node" };
      function _(e10) {
        var t10, r10, n10, i10, s2, a2 = [], o2 = 0;
        function l2() {
          for (; o2 < e10.length && /\s/.test(e10.charAt(o2)); ) o2 += 1;
          return o2 < e10.length;
        }
        for (; o2 < e10.length; ) {
          for (t10 = o2, s2 = false; l2(); ) if ("," === (r10 = e10.charAt(o2))) {
            for (n10 = o2, o2 += 1, l2(), i10 = o2; o2 < e10.length && "=" !== (r10 = e10.charAt(o2)) && ";" !== r10 && "," !== r10; ) o2 += 1;
            o2 < e10.length && "=" === e10.charAt(o2) ? (s2 = true, o2 = i10, a2.push(e10.substring(t10, n10)), t10 = o2) : o2 = n10 + 1;
          } else o2 += 1;
          (!s2 || o2 >= e10.length) && a2.push(e10.substring(t10, e10.length));
        }
        return a2;
      }
      function w(e10) {
        let t10 = {}, r10 = [];
        if (e10) for (let [n10, i10] of e10.entries()) "set-cookie" === n10.toLowerCase() ? (r10.push(..._(i10)), t10[n10] = 1 === r10.length ? r10[0] : r10) : t10[n10] = i10;
        return t10;
      }
      function E(e10) {
        try {
          return String(new URL(String(e10)));
        } catch (t10) {
          throw Object.defineProperty(Error(`URL is malformed "${String(e10)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: t10 }), "__NEXT_ERROR_CODE", { value: "E61", enumerable: false, configurable: true });
        }
      }
      ({ ...y, GROUP: { builtinReact: [y.reactServerComponents, y.actionBrowser], serverOnly: [y.reactServerComponents, y.actionBrowser, y.instrument, y.middleware], neutralTarget: [y.apiNode, y.apiEdge], clientOnly: [y.serverSideRendering, y.appPagesBrowser], bundled: [y.reactServerComponents, y.actionBrowser, y.serverSideRendering, y.appPagesBrowser, y.shared, y.instrument, y.middleware], appPages: [y.reactServerComponents, y.serverSideRendering, y.appPagesBrowser, y.actionBrowser] } });
      let S = Symbol("response"), O = Symbol("passThrough"), T = Symbol("waitUntil");
      class R {
        constructor(e10, t10) {
          this[O] = false, this[T] = t10 ? { kind: "external", function: t10 } : { kind: "internal", promises: [] };
        }
        respondWith(e10) {
          this[S] || (this[S] = Promise.resolve(e10));
        }
        passThroughOnException() {
          this[O] = true;
        }
        waitUntil(e10) {
          if ("external" === this[T].kind) return (0, this[T].function)(e10);
          this[T].promises.push(e10);
        }
      }
      class x extends R {
        constructor(e10) {
          var t10;
          super(e10.request, null == (t10 = e10.context) ? void 0 : t10.waitUntil), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new h({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new h({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      function k(e10) {
        return e10.replace(/\/$/, "") || "/";
      }
      function C(e10) {
        let t10 = e10.indexOf("#"), r10 = e10.indexOf("?"), n10 = r10 > -1 && (t10 < 0 || r10 < t10);
        return n10 || t10 > -1 ? { pathname: e10.substring(0, n10 ? r10 : t10), query: n10 ? e10.substring(r10, t10 > -1 ? t10 : void 0) : "", hash: t10 > -1 ? e10.slice(t10) : "" } : { pathname: e10, query: "", hash: "" };
      }
      function P(e10, t10) {
        if (!e10.startsWith("/") || !t10) return e10;
        let { pathname: r10, query: n10, hash: i10 } = C(e10);
        return `${t10}${r10}${n10}${i10}`;
      }
      function A(e10, t10) {
        if (!e10.startsWith("/") || !t10) return e10;
        let { pathname: r10, query: n10, hash: i10 } = C(e10);
        return `${r10}${t10}${n10}${i10}`;
      }
      function j(e10, t10) {
        if ("string" != typeof e10) return false;
        let { pathname: r10 } = C(e10);
        return r10 === t10 || r10.startsWith(t10 + "/");
      }
      let I = /* @__PURE__ */ new WeakMap();
      function N(e10, t10) {
        let r10;
        if (!t10) return { pathname: e10 };
        let n10 = I.get(t10);
        n10 || (n10 = t10.map((e11) => e11.toLowerCase()), I.set(t10, n10));
        let i10 = e10.split("/", 2);
        if (!i10[1]) return { pathname: e10 };
        let s2 = i10[1].toLowerCase(), a2 = n10.indexOf(s2);
        return a2 < 0 ? { pathname: e10 } : (r10 = t10[a2], { pathname: e10 = e10.slice(r10.length + 1) || "/", detectedLocale: r10 });
      }
      let $ = /^(?:127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)$/;
      function D(e10, t10) {
        let r10 = new URL(String(e10), t10 && String(t10));
        return $.test(r10.hostname) && (r10.hostname = "localhost"), r10;
      }
      let U = Symbol("NextURLInternal");
      class L {
        constructor(e10, t10, r10) {
          let n10, i10;
          "object" == typeof t10 && "pathname" in t10 || "string" == typeof t10 ? (n10 = t10, i10 = r10 || {}) : i10 = r10 || t10 || {}, this[U] = { url: D(e10, n10 ?? i10.base), options: i10, basePath: "" }, this.analyze();
        }
        analyze() {
          var e10, t10, r10, n10, i10;
          let s2 = function(e11, t11) {
            let { basePath: r11, i18n: n11, trailingSlash: i11 } = t11.nextConfig ?? {}, s3 = { pathname: e11, trailingSlash: "/" !== e11 ? e11.endsWith("/") : i11 };
            r11 && j(s3.pathname, r11) && (s3.pathname = function(e12, t12) {
              if (!j(e12, t12)) return e12;
              let r12 = e12.slice(t12.length);
              return r12.startsWith("/") ? r12 : `/${r12}`;
            }(s3.pathname, r11), s3.basePath = r11);
            let a3 = s3.pathname;
            if (s3.pathname.startsWith("/_next/data/") && s3.pathname.endsWith(".json")) {
              let e12 = s3.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
              s3.buildId = e12[0], a3 = "index" !== e12[1] ? `/${e12.slice(1).join("/")}` : "/", true === t11.parseData && (s3.pathname = a3);
            }
            if (n11) {
              let e12 = t11.i18nProvider ? t11.i18nProvider.analyze(s3.pathname) : N(s3.pathname, n11.locales);
              s3.locale = e12.detectedLocale, s3.pathname = e12.pathname ?? s3.pathname, !e12.detectedLocale && s3.buildId && (e12 = t11.i18nProvider ? t11.i18nProvider.analyze(a3) : N(a3, n11.locales)).detectedLocale && (s3.locale = e12.detectedLocale);
            }
            return s3;
          }(this[U].url.pathname, { nextConfig: this[U].options.nextConfig, parseData: true, i18nProvider: this[U].options.i18nProvider }), a2 = function(e11, t11) {
            let r11;
            if (t11?.host && !Array.isArray(t11.host)) r11 = t11.host.toString().split(":", 1)[0];
            else {
              if (!e11.hostname) return;
              r11 = e11.hostname;
            }
            return r11.toLowerCase();
          }(this[U].url, this[U].options.headers);
          this[U].domainLocale = this[U].options.i18nProvider ? this[U].options.i18nProvider.detectDomainLocale(a2) : function(e11, t11, r11) {
            if (e11) {
              for (let n11 of (r11 && (r11 = r11.toLowerCase()), e11)) if (t11 === n11.domain?.split(":", 1)[0].toLowerCase() || r11 === n11.defaultLocale.toLowerCase() || n11.locales?.some((e12) => e12.toLowerCase() === r11)) return n11;
            }
          }(null == (t10 = this[U].options.nextConfig) || null == (e10 = t10.i18n) ? void 0 : e10.domains, a2);
          let o2 = (null == (r10 = this[U].domainLocale) ? void 0 : r10.defaultLocale) || (null == (i10 = this[U].options.nextConfig) || null == (n10 = i10.i18n) ? void 0 : n10.defaultLocale);
          this[U].url.pathname = s2.pathname, this[U].defaultLocale = o2, this[U].basePath = s2.basePath ?? "", this[U].buildId = s2.buildId, this[U].locale = s2.locale ?? o2, this[U].trailingSlash = s2.trailingSlash;
        }
        formatPathname() {
          var e10;
          let t10;
          return t10 = function(e11, t11, r10, n10) {
            if (!t11 || t11 === r10) return e11;
            let i10 = e11.toLowerCase();
            return !n10 && (j(i10, "/api") || j(i10, `/${t11.toLowerCase()}`)) ? e11 : P(e11, `/${t11}`);
          }((e10 = { basePath: this[U].basePath, buildId: this[U].buildId, defaultLocale: this[U].options.forceLocale ? void 0 : this[U].defaultLocale, locale: this[U].locale, pathname: this[U].url.pathname, trailingSlash: this[U].trailingSlash }).pathname, e10.locale, e10.buildId ? void 0 : e10.defaultLocale, e10.ignorePrefix), (e10.buildId || !e10.trailingSlash) && (t10 = k(t10)), e10.buildId && (t10 = A(P(t10, `/_next/data/${e10.buildId}`), "/" === e10.pathname ? "index.json" : ".json")), t10 = P(t10, e10.basePath), !e10.buildId && e10.trailingSlash ? t10.endsWith("/") ? t10 : A(t10, "/") : k(t10);
        }
        formatSearch() {
          return this[U].url.search;
        }
        get buildId() {
          return this[U].buildId;
        }
        set buildId(e10) {
          this[U].buildId = e10;
        }
        get locale() {
          return this[U].locale ?? "";
        }
        set locale(e10) {
          var t10, r10;
          if (!this[U].locale || !(null == (r10 = this[U].options.nextConfig) || null == (t10 = r10.i18n) ? void 0 : t10.locales.includes(e10))) throw Object.defineProperty(TypeError(`The NextURL configuration includes no locale "${e10}"`), "__NEXT_ERROR_CODE", { value: "E597", enumerable: false, configurable: true });
          this[U].locale = e10;
        }
        get defaultLocale() {
          return this[U].defaultLocale;
        }
        get domainLocale() {
          return this[U].domainLocale;
        }
        get searchParams() {
          return this[U].url.searchParams;
        }
        get host() {
          return this[U].url.host;
        }
        set host(e10) {
          this[U].url.host = e10;
        }
        get hostname() {
          return this[U].url.hostname;
        }
        set hostname(e10) {
          this[U].url.hostname = e10;
        }
        get port() {
          return this[U].url.port;
        }
        set port(e10) {
          this[U].url.port = e10;
        }
        get protocol() {
          return this[U].url.protocol;
        }
        set protocol(e10) {
          this[U].url.protocol = e10;
        }
        get href() {
          let e10 = this.formatPathname(), t10 = this.formatSearch();
          return `${this.protocol}//${this.host}${e10}${t10}${this.hash}`;
        }
        set href(e10) {
          this[U].url = D(e10), this.analyze();
        }
        get origin() {
          return this[U].url.origin;
        }
        get pathname() {
          return this[U].url.pathname;
        }
        set pathname(e10) {
          this[U].url.pathname = e10;
        }
        get hash() {
          return this[U].url.hash;
        }
        set hash(e10) {
          this[U].url.hash = e10;
        }
        get search() {
          return this[U].url.search;
        }
        set search(e10) {
          this[U].url.search = e10;
        }
        get password() {
          return this[U].url.password;
        }
        set password(e10) {
          this[U].url.password = e10;
        }
        get username() {
          return this[U].url.username;
        }
        set username(e10) {
          this[U].url.username = e10;
        }
        get basePath() {
          return this[U].basePath;
        }
        set basePath(e10) {
          this[U].basePath = e10.startsWith("/") ? e10 : `/${e10}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new L(String(this), this[U].options);
        }
      }
      var M, B, q, H, V, F, G, W, z, K, J, X, Y, Q, Z, ee, et, er, en, ei, es, ea, eo, el, eu, ec, eh, ed, ef, ep, eg, em, ev, eb, ey, e_, ew, eE, eS, eO = e.i(28042);
      let eT = Symbol("internal request");
      class eR extends Request {
        constructor(e10, t10 = {}) {
          const r10 = "string" != typeof e10 && "url" in e10 ? e10.url : String(e10);
          E(r10), e10 instanceof Request ? super(e10, t10) : super(r10, t10);
          const n10 = new L(r10, { headers: w(this.headers), nextConfig: t10.nextConfig });
          this[eT] = { cookies: new eO.RequestCookies(this.headers), nextUrl: n10, url: n10.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[eT].cookies;
        }
        get nextUrl() {
          return this[eT].nextUrl;
        }
        get page() {
          throw new d();
        }
        get ua() {
          throw new f();
        }
        get url() {
          return this[eT].url;
        }
      }
      class ex {
        static get(e10, t10, r10) {
          let n10 = Reflect.get(e10, t10, r10);
          return "function" == typeof n10 ? n10.bind(e10) : n10;
        }
        static set(e10, t10, r10, n10) {
          return Reflect.set(e10, t10, r10, n10);
        }
        static has(e10, t10) {
          return Reflect.has(e10, t10);
        }
        static deleteProperty(e10, t10) {
          return Reflect.deleteProperty(e10, t10);
        }
      }
      let ek = Symbol("internal response"), eC = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function eP(e10, t10) {
        var r10;
        if (null == e10 || null == (r10 = e10.request) ? void 0 : r10.headers) {
          if (!(e10.request.headers instanceof Headers)) throw Object.defineProperty(Error("request.headers must be an instance of Headers"), "__NEXT_ERROR_CODE", { value: "E119", enumerable: false, configurable: true });
          let r11 = [];
          for (let [n10, i10] of e10.request.headers) t10.set("x-middleware-request-" + n10, i10), r11.push(n10);
          t10.set("x-middleware-override-headers", r11.join(","));
        }
      }
      class eA extends Response {
        constructor(e10, t10 = {}) {
          super(e10, t10);
          const r10 = this.headers, n10 = new Proxy(new eO.ResponseCookies(r10), { get(e11, n11, i10) {
            switch (n11) {
              case "delete":
              case "set":
                return (...i11) => {
                  let s2 = Reflect.apply(e11[n11], e11, i11), a2 = new Headers(r10);
                  return s2 instanceof eO.ResponseCookies && r10.set("x-middleware-set-cookie", s2.getAll().map((e12) => (0, eO.stringifyCookie)(e12)).join(",")), eP(t10, a2), s2;
                };
              default:
                return ex.get(e11, n11, i10);
            }
          } });
          this[ek] = { cookies: n10, url: t10.url ? new L(t10.url, { headers: w(r10), nextConfig: t10.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[ek].cookies;
        }
        static json(e10, t10) {
          let r10 = Response.json(e10, t10);
          return new eA(r10.body, r10);
        }
        static redirect(e10, t10) {
          let r10 = "number" == typeof t10 ? t10 : (null == t10 ? void 0 : t10.status) ?? 307;
          if (!eC.has(r10)) throw Object.defineProperty(RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", { value: "E529", enumerable: false, configurable: true });
          let n10 = "object" == typeof t10 ? t10 : {}, i10 = new Headers(null == n10 ? void 0 : n10.headers);
          return i10.set("Location", E(e10)), new eA(null, { ...n10, headers: i10, status: r10 });
        }
        static rewrite(e10, t10) {
          let r10 = new Headers(null == t10 ? void 0 : t10.headers);
          return r10.set("x-middleware-rewrite", E(e10)), eP(t10, r10), new eA(null, { ...t10, headers: r10 });
        }
        static next(e10) {
          let t10 = new Headers(null == e10 ? void 0 : e10.headers);
          return t10.set("x-middleware-next", "1"), eP(e10, t10), new eA(null, { ...e10, headers: t10 });
        }
      }
      function ej(e10, t10) {
        let r10 = "string" == typeof t10 ? new URL(t10) : t10, n10 = new URL(e10, t10), i10 = n10.origin === r10.origin;
        return { url: i10 ? n10.toString().slice(r10.origin.length) : n10.toString(), isRelative: i10 };
      }
      let eI = "next-router-prefetch", eN = ["rsc", "next-router-state-tree", eI, "next-hmr-refresh", "next-router-segment-prefetch"], e$ = "_rsc";
      function eD(e10) {
        return e10.startsWith("/") ? e10 : `/${e10}`;
      }
      function eU(e10) {
        return eD(e10.split("/").reduce((e11, t10, r10, n10) => t10 ? "(" === t10[0] && t10.endsWith(")") || "@" === t10[0] || ("page" === t10 || "route" === t10) && r10 === n10.length - 1 ? e11 : `${e11}/${t10}` : e11, ""));
      }
      class eL extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new eL();
        }
      }
      class eM extends Headers {
        constructor(e10) {
          super(), this.headers = new Proxy(e10, { get(t10, r10, n10) {
            if ("symbol" == typeof r10) return ex.get(t10, r10, n10);
            let i10 = r10.toLowerCase(), s2 = Object.keys(e10).find((e11) => e11.toLowerCase() === i10);
            if (void 0 !== s2) return ex.get(t10, s2, n10);
          }, set(t10, r10, n10, i10) {
            if ("symbol" == typeof r10) return ex.set(t10, r10, n10, i10);
            let s2 = r10.toLowerCase(), a2 = Object.keys(e10).find((e11) => e11.toLowerCase() === s2);
            return ex.set(t10, a2 ?? r10, n10, i10);
          }, has(t10, r10) {
            if ("symbol" == typeof r10) return ex.has(t10, r10);
            let n10 = r10.toLowerCase(), i10 = Object.keys(e10).find((e11) => e11.toLowerCase() === n10);
            return void 0 !== i10 && ex.has(t10, i10);
          }, deleteProperty(t10, r10) {
            if ("symbol" == typeof r10) return ex.deleteProperty(t10, r10);
            let n10 = r10.toLowerCase(), i10 = Object.keys(e10).find((e11) => e11.toLowerCase() === n10);
            return void 0 === i10 || ex.deleteProperty(t10, i10);
          } });
        }
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r10) {
            switch (t10) {
              case "append":
              case "delete":
              case "set":
                return eL.callable;
              default:
                return ex.get(e11, t10, r10);
            }
          } });
        }
        merge(e10) {
          return Array.isArray(e10) ? e10.join(", ") : e10;
        }
        static from(e10) {
          return e10 instanceof Headers ? e10 : new eM(e10);
        }
        append(e10, t10) {
          let r10 = this.headers[e10];
          "string" == typeof r10 ? this.headers[e10] = [r10, t10] : Array.isArray(r10) ? r10.push(t10) : this.headers[e10] = t10;
        }
        delete(e10) {
          delete this.headers[e10];
        }
        get(e10) {
          let t10 = this.headers[e10];
          return void 0 !== t10 ? this.merge(t10) : null;
        }
        has(e10) {
          return void 0 !== this.headers[e10];
        }
        set(e10, t10) {
          this.headers[e10] = t10;
        }
        forEach(e10, t10) {
          for (let [r10, n10] of this.entries()) e10.call(t10, n10, r10, this);
        }
        *entries() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase(), r10 = this.get(t10);
            yield [t10, r10];
          }
        }
        *keys() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase();
            yield t10;
          }
        }
        *values() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = this.get(e10);
            yield t10;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      let eB = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class eq {
        disable() {
          throw eB;
        }
        getStore() {
        }
        run() {
          throw eB;
        }
        exit() {
          throw eB;
        }
        enterWith() {
          throw eB;
        }
        static bind(e10) {
          return e10;
        }
      }
      let eH = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
      function eV() {
        return eH ? new eH() : new eq();
      }
      let eF = eV();
      class eG extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options");
        }
        static callable() {
          throw new eG();
        }
      }
      class eW {
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r10) {
            switch (t10) {
              case "clear":
              case "delete":
              case "set":
                return eG.callable;
              default:
                return ex.get(e11, t10, r10);
            }
          } });
        }
      }
      let ez = Symbol.for("next.mutated.cookies");
      class eK {
        static wrap(e10, t10) {
          let r10 = new eO.ResponseCookies(new Headers());
          for (let t11 of e10.getAll()) r10.set(t11);
          let n10 = [], i10 = /* @__PURE__ */ new Set(), s2 = () => {
            let e11 = eF.getStore();
            if (e11 && (e11.pathWasRevalidated = 1), n10 = r10.getAll().filter((e12) => i10.has(e12.name)), t10) {
              let e12 = [];
              for (let t11 of n10) {
                let r11 = new eO.ResponseCookies(new Headers());
                r11.set(t11), e12.push(r11.toString());
              }
              t10(e12);
            }
          }, a2 = new Proxy(r10, { get(e11, t11, r11) {
            switch (t11) {
              case ez:
                return n10;
              case "delete":
                return function(...t12) {
                  i10.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.delete(...t12), a2;
                  } finally {
                    s2();
                  }
                };
              case "set":
                return function(...t12) {
                  i10.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.set(...t12), a2;
                  } finally {
                    s2();
                  }
                };
              default:
                return ex.get(e11, t11, r11);
            }
          } });
          return a2;
        }
      }
      function eJ(e10, t10) {
        if ("action" !== e10.phase) throw new eG();
      }
      var eX = ((M = eX || {}).handleRequest = "BaseServer.handleRequest", M.run = "BaseServer.run", M.pipe = "BaseServer.pipe", M.getStaticHTML = "BaseServer.getStaticHTML", M.render = "BaseServer.render", M.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", M.renderToResponse = "BaseServer.renderToResponse", M.renderToHTML = "BaseServer.renderToHTML", M.renderError = "BaseServer.renderError", M.renderErrorToResponse = "BaseServer.renderErrorToResponse", M.renderErrorToHTML = "BaseServer.renderErrorToHTML", M.render404 = "BaseServer.render404", M), eY = ((B = eY || {}).loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", B.loadComponents = "LoadComponents.loadComponents", B), eQ = ((q = eQ || {}).getRequestHandler = "NextServer.getRequestHandler", q.getRequestHandlerWithMetadata = "NextServer.getRequestHandlerWithMetadata", q.getServer = "NextServer.getServer", q.getServerRequestHandler = "NextServer.getServerRequestHandler", q.createServer = "createServer.createServer", q), eZ = ((H = eZ || {}).compression = "NextNodeServer.compression", H.getBuildId = "NextNodeServer.getBuildId", H.createComponentTree = "NextNodeServer.createComponentTree", H.clientComponentLoading = "NextNodeServer.clientComponentLoading", H.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", H.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", H.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", H.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", H.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", H.sendRenderResult = "NextNodeServer.sendRenderResult", H.proxyRequest = "NextNodeServer.proxyRequest", H.runApi = "NextNodeServer.runApi", H.render = "NextNodeServer.render", H.renderHTML = "NextNodeServer.renderHTML", H.imageOptimizer = "NextNodeServer.imageOptimizer", H.getPagePath = "NextNodeServer.getPagePath", H.getRoutesManifest = "NextNodeServer.getRoutesManifest", H.findPageComponents = "NextNodeServer.findPageComponents", H.getFontManifest = "NextNodeServer.getFontManifest", H.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", H.getRequestHandler = "NextNodeServer.getRequestHandler", H.renderToHTML = "NextNodeServer.renderToHTML", H.renderError = "NextNodeServer.renderError", H.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", H.render404 = "NextNodeServer.render404", H.startResponse = "NextNodeServer.startResponse", H.route = "route", H.onProxyReq = "onProxyReq", H.apiResolver = "apiResolver", H.internalFetch = "internalFetch", H), e0 = ((V = e0 || {}).startServer = "startServer.startServer", V), e1 = ((F = e1 || {}).getServerSideProps = "Render.getServerSideProps", F.getStaticProps = "Render.getStaticProps", F.renderToString = "Render.renderToString", F.renderDocument = "Render.renderDocument", F.createBodyResult = "Render.createBodyResult", F), e2 = ((G = e2 || {}).renderToString = "AppRender.renderToString", G.renderToReadableStream = "AppRender.renderToReadableStream", G.getBodyResult = "AppRender.getBodyResult", G.fetch = "AppRender.fetch", G), e4 = ((W = e4 || {}).executeRoute = "Router.executeRoute", W), e3 = ((z = e3 || {}).runHandler = "Node.runHandler", z), e8 = ((K = e8 || {}).runHandler = "AppRouteRouteHandlers.runHandler", K), e6 = ((J = e6 || {}).generateMetadata = "ResolveMetadata.generateMetadata", J.generateViewport = "ResolveMetadata.generateViewport", J), e9 = ((X = e9 || {}).execute = "Middleware.execute", X);
      let e5 = /* @__PURE__ */ new Set(["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"]), e7 = /* @__PURE__ */ new Set(["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"]);
      function te(e10) {
        return null !== e10 && "object" == typeof e10 && "then" in e10 && "function" == typeof e10.then;
      }
      let tt = process.env.NEXT_OTEL_PERFORMANCE_PREFIX, { context: tr, propagation: tn, trace: ti, SpanStatusCode: ts, SpanKind: ta, ROOT_CONTEXT: to } = t = e.r(59110);
      class tl extends Error {
        constructor(e10, t10) {
          super(), this.bubble = e10, this.result = t10;
        }
      }
      let tu = (e10, t10) => {
        "object" == typeof t10 && null !== t10 && t10 instanceof tl && t10.bubble ? e10.setAttribute("next.bubble", true) : (t10 && (e10.recordException(t10), e10.setAttribute("error.type", t10.name)), e10.setStatus({ code: ts.ERROR, message: null == t10 ? void 0 : t10.message })), e10.end();
      }, tc = /* @__PURE__ */ new Map(), th = t.createContextKey("next.rootSpanId"), td = 0, tf = { set(e10, t10, r10) {
        e10.push({ key: t10, value: r10 });
      } }, tp = (n = new class e {
        getTracerInstance() {
          return ti.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return tr;
        }
        getTracePropagationData() {
          let e10 = tr.active(), t10 = [];
          return tn.inject(e10, t10, tf), t10;
        }
        getActiveScopeSpan() {
          return ti.getSpan(null == tr ? void 0 : tr.active());
        }
        withPropagatedContext(e10, t10, r10, n10 = false) {
          let i10 = tr.active();
          if (n10) {
            let n11 = tn.extract(to, e10, r10);
            if (ti.getSpanContext(n11)) return tr.with(n11, t10);
            let s3 = tn.extract(i10, e10, r10);
            return tr.with(s3, t10);
          }
          if (ti.getSpanContext(i10)) return t10();
          let s2 = tn.extract(i10, e10, r10);
          return tr.with(s2, t10);
        }
        trace(...e10) {
          let [t10, r10, n10] = e10, { fn: i10, options: s2 } = "function" == typeof r10 ? { fn: r10, options: {} } : { fn: n10, options: { ...r10 } }, a2 = s2.spanName ?? t10;
          if (!e5.has(t10) && "1" !== process.env.NEXT_OTEL_VERBOSE || s2.hideSpan) return i10();
          let o2 = this.getSpanContext((null == s2 ? void 0 : s2.parentSpan) ?? this.getActiveScopeSpan());
          o2 || (o2 = (null == tr ? void 0 : tr.active()) ?? to);
          let l2 = o2.getValue(th), u2 = "number" != typeof l2 || !tc.has(l2), c2 = td++;
          return s2.attributes = { "next.span_name": a2, "next.span_type": t10, ...s2.attributes }, tr.with(o2.setValue(th, c2), () => this.getTracerInstance().startActiveSpan(a2, s2, (e11) => {
            let r11;
            tt && t10 && e7.has(t10) && (r11 = "performance" in globalThis && "measure" in performance ? globalThis.performance.now() : void 0);
            let n11 = false, a3 = () => {
              !n11 && (n11 = true, tc.delete(c2), r11 && performance.measure(`${tt}:next-${(t10.split(".").pop() || "").replace(/[A-Z]/g, (e12) => "-" + e12.toLowerCase())}`, { start: r11, end: performance.now() }));
            };
            if (u2 && tc.set(c2, new Map(Object.entries(s2.attributes ?? {}))), i10.length > 1) try {
              return i10(e11, (t11) => tu(e11, t11));
            } catch (t11) {
              throw tu(e11, t11), t11;
            } finally {
              a3();
            }
            try {
              let t11 = i10(e11);
              if (te(t11)) return t11.then((t12) => (e11.end(), t12)).catch((t12) => {
                throw tu(e11, t12), t12;
              }).finally(a3);
              return e11.end(), a3(), t11;
            } catch (t11) {
              throw tu(e11, t11), a3(), t11;
            }
          }));
        }
        wrap(...e10) {
          let t10 = this, [r10, n10, i10] = 3 === e10.length ? e10 : [e10[0], {}, e10[1]];
          return e5.has(r10) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let e11 = n10;
            "function" == typeof e11 && "function" == typeof i10 && (e11 = e11.apply(this, arguments));
            let s2 = arguments.length - 1, a2 = arguments[s2];
            if ("function" != typeof a2) return t10.trace(r10, e11, () => i10.apply(this, arguments));
            {
              let n11 = t10.getContext().bind(tr.active(), a2);
              return t10.trace(r10, e11, (e12, t11) => (arguments[s2] = function(e13) {
                return null == t11 || t11(e13), n11.apply(this, arguments);
              }, i10.apply(this, arguments)));
            }
          } : i10;
        }
        startSpan(...e10) {
          let [t10, r10] = e10, n10 = this.getSpanContext((null == r10 ? void 0 : r10.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(t10, r10, n10);
        }
        getSpanContext(e10) {
          return e10 ? ti.setSpan(tr.active(), e10) : void 0;
        }
        getRootSpanAttributes() {
          let e10 = tr.active().getValue(th);
          return tc.get(e10);
        }
        setRootSpanAttribute(e10, t10) {
          let r10 = tr.active().getValue(th), n10 = tc.get(r10);
          n10 && !n10.has(e10) && n10.set(e10, t10);
        }
        withSpan(e10, t10) {
          let r10 = ti.setSpan(tr.active(), e10);
          return tr.with(r10, t10);
        }
      }(), () => n), tg = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(tg);
      class tm {
        constructor(e10, t10, r10, n10) {
          var i10;
          const s2 = e10 && function(e11, t11) {
            let r11 = eM.from(e11.headers);
            return { isOnDemandRevalidate: r11.get(p) === t11.previewModeId, revalidateOnlyGenerated: r11.has("x-prerender-revalidate-if-generated") };
          }(t10, e10).isOnDemandRevalidate, a2 = null == (i10 = r10.get(tg)) ? void 0 : i10.value;
          this._isEnabled = !!(!s2 && a2 && e10 && a2 === e10.previewModeId), this._previewModeId = null == e10 ? void 0 : e10.previewModeId, this._mutableCookies = n10;
        }
        get isEnabled() {
          return this._isEnabled;
        }
        enable() {
          if (!this._previewModeId) throw Object.defineProperty(Error("Invariant: previewProps missing previewModeId this should never happen"), "__NEXT_ERROR_CODE", { value: "E93", enumerable: false, configurable: true });
          this._mutableCookies.set({ name: tg, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" }), this._isEnabled = true;
        }
        disable() {
          this._mutableCookies.set({ name: tg, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) }), this._isEnabled = false;
        }
      }
      function tv(e10, t10) {
        if ("x-middleware-set-cookie" in e10.headers && "string" == typeof e10.headers["x-middleware-set-cookie"]) {
          let r10 = e10.headers["x-middleware-set-cookie"], n10 = new Headers();
          for (let e11 of _(r10)) n10.append("set-cookie", e11);
          for (let e11 of new eO.ResponseCookies(n10).getAll()) t10.set(e11);
        }
      }
      let tb = eV();
      function ty(e10) {
        switch (e10.type) {
          case "prerender":
          case "prerender-runtime":
          case "prerender-ppr":
          case "prerender-client":
          case "validation-client":
            return e10.prerenderResumeDataCache;
          case "request":
            if (e10.prerenderResumeDataCache) return e10.prerenderResumeDataCache;
          case "prerender-legacy":
          case "cache":
          case "private-cache":
          case "unstable-cache":
          case "generate-static-params":
            return null;
          default:
            return e10;
        }
      }
      var t_ = e.i(99734);
      class tw extends Error {
        constructor(e10, t10) {
          super(`Invariant: ${e10.endsWith(".") ? e10 : e10 + "."} This is a bug in Next.js.`, t10), this.name = "InvariantError";
        }
      }
      var tE = e.i(51615);
      process.env.NEXT_PRIVATE_DEBUG_CACHE, Symbol.for("@next/cache-handlers");
      let tS = Symbol.for("@next/cache-handlers-map"), tO = Symbol.for("@next/cache-handlers-set"), tT = globalThis;
      function tR() {
        if (tT[tS]) return tT[tS].entries();
      }
      async function tx(e10, t10) {
        if (!e10) return t10();
        let r10 = tk(e10);
        try {
          return await t10();
        } finally {
          var n10, i10, s2, a2;
          let t11, o2, l2, u2, c2 = (n10 = r10, i10 = tk(e10), t11 = new Set(n10.pendingRevalidatedTags.map((e11) => {
            let t12 = "object" == typeof e11.profile ? JSON.stringify(e11.profile) : e11.profile || "";
            return `${e11.tag}:${t12}`;
          })), o2 = new Set(n10.pendingRevalidateWrites), { pendingRevalidatedTags: i10.pendingRevalidatedTags.filter((e11) => {
            let r11 = "object" == typeof e11.profile ? JSON.stringify(e11.profile) : e11.profile || "";
            return !t11.has(`${e11.tag}:${r11}`);
          }), pendingRevalidates: Object.fromEntries(Object.entries(i10.pendingRevalidates).filter(([e11]) => !(e11 in n10.pendingRevalidates))), pendingRevalidateWrites: i10.pendingRevalidateWrites.filter((e11) => !o2.has(e11)) });
          await (s2 = e10, l2 = [], (u2 = (null == (a2 = c2) ? void 0 : a2.pendingRevalidatedTags) ?? s2.pendingRevalidatedTags ?? []).length > 0 && l2.push(tC(u2, s2.incrementalCache, s2)), l2.push(...Object.values((null == a2 ? void 0 : a2.pendingRevalidates) ?? s2.pendingRevalidates ?? {})), l2.push(...(null == a2 ? void 0 : a2.pendingRevalidateWrites) ?? s2.pendingRevalidateWrites ?? []), 0 !== l2.length && Promise.all(l2).then(() => void 0));
        }
      }
      function tk(e10) {
        return { pendingRevalidatedTags: e10.pendingRevalidatedTags ? [...e10.pendingRevalidatedTags] : [], pendingRevalidates: { ...e10.pendingRevalidates }, pendingRevalidateWrites: e10.pendingRevalidateWrites ? [...e10.pendingRevalidateWrites] : [] };
      }
      async function tC(e10, t10, r10) {
        if (0 === e10.length) return;
        let n10 = function() {
          if (tT[tO]) return tT[tO].values();
        }(), i10 = [], s2 = /* @__PURE__ */ new Map();
        for (let t11 of e10) {
          let e11, r11 = t11.profile;
          for (let [t12] of s2) if ("string" == typeof t12 && "string" == typeof r11 && t12 === r11 || "object" == typeof t12 && "object" == typeof r11 && JSON.stringify(t12) === JSON.stringify(r11) || t12 === r11) {
            e11 = t12;
            break;
          }
          let n11 = e11 || r11;
          s2.has(n11) || s2.set(n11, []), s2.get(n11).push(t11.tag);
        }
        for (let [e11, o2] of s2) {
          let s3;
          if (e11) {
            let t11;
            if ("object" == typeof e11) t11 = e11;
            else if ("string" == typeof e11) {
              var a2;
              if (!(t11 = null == r10 || null == (a2 = r10.cacheLifeProfiles) ? void 0 : a2[e11])) throw Object.defineProperty(Error(`Invalid profile provided "${e11}" must be configured under cacheLife in next.config or be "max"`), "__NEXT_ERROR_CODE", { value: "E873", enumerable: false, configurable: true });
            }
            t11 && (s3 = { expire: t11.expire });
          }
          for (let t11 of n10 || []) e11 ? i10.push(null == t11.updateTags ? void 0 : t11.updateTags.call(t11, o2, s3)) : i10.push(null == t11.updateTags ? void 0 : t11.updateTags.call(t11, o2));
          t10 && i10.push(t10.revalidateTag(o2, s3));
        }
        await Promise.all(i10);
      }
      let tP = eV();
      class tA {
        constructor({ waitUntil: e10, onClose: t10, onTaskError: r10 }) {
          this.workUnitStores = /* @__PURE__ */ new Set(), this.waitUntil = e10, this.onClose = t10, this.onTaskError = r10, this.callbackQueue = new t_.default(), this.callbackQueue.pause();
        }
        after(e10) {
          if (te(e10)) this.waitUntil || tj(), this.waitUntil(e10.catch((e11) => this.reportTaskError("promise", e11)));
          else if ("function" == typeof e10) this.addCallback(e10);
          else throw Object.defineProperty(Error("`after()`: Argument must be a promise or a function"), "__NEXT_ERROR_CODE", { value: "E50", enumerable: false, configurable: true });
        }
        addCallback(e10) {
          var t10;
          this.waitUntil || tj();
          let r10 = tb.getStore();
          r10 && this.workUnitStores.add(r10);
          let n10 = tP.getStore(), i10 = n10 ? n10.rootTaskSpawnPhase : null == r10 ? void 0 : r10.phase;
          this.runCallbacksOnClosePromise || (this.runCallbacksOnClosePromise = this.runCallbacksOnClose(), this.waitUntil(this.runCallbacksOnClosePromise));
          let s2 = (t10 = async () => {
            try {
              await tP.run({ rootTaskSpawnPhase: i10 }, () => e10());
            } catch (e11) {
              this.reportTaskError("function", e11);
            }
          }, eH ? eH.bind(t10) : eq.bind(t10));
          this.callbackQueue.add(s2);
        }
        async runCallbacksOnClose() {
          return await new Promise((e10) => this.onClose(e10)), this.runCallbacks();
        }
        async runCallbacks() {
          if (0 === this.callbackQueue.size) return;
          for (let e11 of this.workUnitStores) e11.phase = "after";
          let e10 = eF.getStore();
          if (!e10) throw Object.defineProperty(new tw("Missing workStore in AfterContext.runCallbacks"), "__NEXT_ERROR_CODE", { value: "E547", enumerable: false, configurable: true });
          return tx(e10, () => (this.callbackQueue.start(), this.callbackQueue.onIdle()));
        }
        reportTaskError(e10, t10) {
          if (console.error("promise" === e10 ? "A promise passed to `after()` rejected:" : "An error occurred in a function passed to `after()`:", t10), this.onTaskError) try {
            null == this.onTaskError || this.onTaskError.call(this, t10);
          } catch (e11) {
            console.error(Object.defineProperty(new tw("`onTaskError` threw while handling an error thrown from an `after` task", { cause: e11 }), "__NEXT_ERROR_CODE", { value: "E569", enumerable: false, configurable: true }));
          }
        }
      }
      function tj() {
        throw Object.defineProperty(Error("`after()` will not work correctly, because `waitUntil` is not available in the current environment."), "__NEXT_ERROR_CODE", { value: "E91", enumerable: false, configurable: true });
      }
      function tI(e10) {
        let t10, r10 = { then: (n10, i10) => (t10 || (t10 = Promise.resolve(e10())), t10.then((e11) => {
          r10.value = e11;
        }).catch(() => {
        }), t10.then(n10, i10)) };
        return r10;
      }
      class tN {
        onClose(e10) {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot subscribe to a closed CloseController"), "__NEXT_ERROR_CODE", { value: "E365", enumerable: false, configurable: true });
          this.target.addEventListener("close", e10), this.listeners++;
        }
        dispatchClose() {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot close a CloseController multiple times"), "__NEXT_ERROR_CODE", { value: "E229", enumerable: false, configurable: true });
          this.listeners > 0 && this.target.dispatchEvent(new Event("close")), this.isClosed = true;
        }
        constructor() {
          this.target = new EventTarget(), this.listeners = 0, this.isClosed = false;
        }
      }
      function t$() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID || "", previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      let tD = Symbol.for("@next/request-context");
      async function tU(e10, t10, r10) {
        let n10 = /* @__PURE__ */ new Set();
        for (let t11 of ((e11) => {
          let t12 = ["/layout"];
          if (e11.startsWith("/")) {
            let r11 = e11.split("/");
            for (let e12 = 1; e12 < r11.length + 1; e12++) {
              let n11 = r11.slice(0, e12).join("/");
              n11 && (n11.endsWith("/page") || n11.endsWith("/route") || (n11 = `${n11}${!n11.endsWith("/") ? "/" : ""}layout`), t12.push(n11));
            }
          }
          return t12;
        })(e10)) t11 = `${b}${t11}`, n10.add(t11);
        if (t10 && (!r10 || 0 === r10.size)) {
          let e11 = `${b}${t10}`;
          n10.add(e11);
        }
        n10.has(`${b}/`) && n10.add(`${b}/index`), n10.has(`${b}/index`) && n10.add(`${b}/`);
        let i10 = Array.from(n10);
        return { tags: i10, expirationsByCacheKind: function(e11) {
          let t11 = /* @__PURE__ */ new Map(), r11 = tR();
          if (r11) for (let [n11, i11] of r11) "getExpiration" in i11 && t11.set(n11, tI(async () => i11.getExpiration(e11)));
          return t11;
        }(i10) };
      }
      let tL = Symbol.for("NextInternalRequestMeta");
      class tM extends eR {
        constructor(e10) {
          super(e10.input, e10.init), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new h({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new h({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        waitUntil() {
          throw Object.defineProperty(new h({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      let tB = { keys: (e10) => Array.from(e10.keys()), get: (e10, t10) => e10.get(t10) ?? void 0 }, tq = (e10, t10) => tp().withPropagatedContext(e10.headers, t10, tB), tH = false;
      async function tV(t10) {
        var r10, n10, i10, s2, a2;
        let o2, l2, c2, h2, d2;
        !function() {
          if (!tH && (tH = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
            let { interceptTestApis: t11, wrapRequestHandler: r11 } = e.r(94165);
            t11(), tq = r11(tq);
          }
        }(), await u();
        let f2 = void 0 !== globalThis.__BUILD_MANIFEST;
        t10.request.url = t10.request.url.replace(/\.rsc($|\?)/, "$1");
        let p2 = t10.bypassNextUrl ? new URL(t10.request.url) : new L(t10.request.url, { headers: t10.request.headers, nextConfig: t10.request.nextConfig });
        for (let e10 of [...p2.searchParams.keys()]) {
          let t11 = p2.searchParams.getAll(e10), r11 = function(e11) {
            for (let t12 of ["nxtP", "nxtI"]) if (e11 !== t12 && e11.startsWith(t12)) return e11.substring(t12.length);
            return null;
          }(e10);
          if (r11) {
            for (let e11 of (p2.searchParams.delete(r11), t11)) p2.searchParams.append(r11, e11);
            p2.searchParams.delete(e10);
          }
        }
        let g2 = process.env.__NEXT_BUILD_ID || "";
        "buildId" in p2 && (g2 = p2.buildId || "", p2.buildId = "");
        let m2 = function(e10) {
          let t11 = new Headers();
          for (let [r11, n11] of Object.entries(e10)) for (let e11 of Array.isArray(n11) ? n11 : [n11]) void 0 !== e11 && ("number" == typeof e11 && (e11 = e11.toString()), t11.append(r11, e11));
          return t11;
        }(t10.request.headers), v2 = m2.has("x-nextjs-data"), b2 = "1" === m2.get("rsc");
        v2 && "/index" === p2.pathname && (p2.pathname = "/");
        let y2 = /* @__PURE__ */ new Map();
        if (!f2) for (let e10 of eN) {
          let t11 = m2.get(e10);
          null !== t11 && (y2.set(e10, t11), m2.delete(e10));
        }
        let _2 = p2.searchParams.get(e$), w2 = new tM({ page: t10.page, input: ((h2 = (c2 = "string" == typeof p2) ? new URL(p2) : p2).searchParams.delete(e$), c2 ? h2.toString() : h2).toString(), init: { body: t10.request.body, headers: m2, method: t10.request.method, nextConfig: t10.request.nextConfig, signal: t10.request.signal } });
        t10.request.requestMeta && (a2 = t10.request.requestMeta, w2[tL] = a2), v2 && Object.defineProperty(w2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCacheShared && t10.IncrementalCache && (globalThis.__incrementalCache = new t10.IncrementalCache({ CurCacheHandler: t10.incrementalCacheHandler, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: t10.request.headers, getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: t$() }) }));
        let E2 = t10.request.waitUntil ?? (null == (r10 = null == (d2 = globalThis[tD]) ? void 0 : d2.get()) ? void 0 : r10.waitUntil), S2 = new x({ request: w2, page: t10.page, context: E2 ? { waitUntil: E2 } : void 0 });
        if ((o2 = await tq(w2, () => {
          if ("/middleware" === t10.page || "/src/middleware" === t10.page || "/proxy" === t10.page || "/src/proxy" === t10.page) {
            let e10 = S2.waitUntil.bind(S2), r11 = new tN();
            return tp().trace(e9.execute, { spanName: `middleware ${w2.method}`, attributes: { "http.target": w2.nextUrl.pathname, "http.method": w2.method } }, async () => {
              try {
                var n11, i11, s3, a3, o3, u2;
                let c3 = t$(), h3 = await tU("/", w2.nextUrl.pathname, null), d3 = (o3 = w2.nextUrl, u2 = (e11) => {
                  l2 = e11;
                }, function(e11, t11, r12, n12, i12, s4, a4, o4, l3, u3) {
                  function c4(e12) {
                    r12 && r12.setHeader("Set-Cookie", e12);
                  }
                  let h4 = {};
                  return { type: "request", phase: e11, implicitTags: s4, url: { pathname: n12.pathname, search: n12.search ?? "" }, rootParams: i12, get headers() {
                    return h4.headers || (h4.headers = function(e12) {
                      let t12 = eM.from(e12);
                      for (let e13 of eN) t12.delete(e13);
                      return eM.seal(t12);
                    }(t11.headers)), h4.headers;
                  }, get cookies() {
                    if (!h4.cookies) {
                      let e12 = new eO.RequestCookies(eM.from(t11.headers));
                      tv(t11, e12), h4.cookies = eW.seal(e12);
                    }
                    return h4.cookies;
                  }, set cookies(value) {
                    h4.cookies = value;
                  }, get mutableCookies() {
                    if (!h4.mutableCookies) {
                      var d4, f4;
                      let e12, n13 = (d4 = t11.headers, f4 = a4 || (r12 ? c4 : void 0), e12 = new eO.RequestCookies(eM.from(d4)), eK.wrap(e12, f4));
                      tv(t11, n13), h4.mutableCookies = n13;
                    }
                    return h4.mutableCookies;
                  }, get userspaceMutableCookies() {
                    if (!h4.userspaceMutableCookies) {
                      var p3;
                      let e12;
                      p3 = this, h4.userspaceMutableCookies = e12 = new Proxy(p3.mutableCookies, { get(t12, r13, n13) {
                        switch (r13) {
                          case "delete":
                            return function(...r14) {
                              return eJ(p3, "cookies().delete"), t12.delete(...r14), e12;
                            };
                          case "set":
                            return function(...r14) {
                              return eJ(p3, "cookies().set"), t12.set(...r14), e12;
                            };
                          default:
                            return ex.get(t12, r13, n13);
                        }
                      } });
                    }
                    return h4.userspaceMutableCookies;
                  }, get draftMode() {
                    return h4.draftMode || (h4.draftMode = new tm(o4, t11, this.cookies, this.mutableCookies)), h4.draftMode;
                  }, renderResumeDataCache: null, isHmrRefresh: l3, serverComponentsHmrCache: u3 || globalThis.__serverComponentsHmrCache, fallbackParams: null };
                }("action", w2, void 0, o3, {}, h3, u2, c3, false, void 0)), f3 = function({ page: e11, renderOpts: t11, isPrefetchRequest: r12, buildId: n12, previouslyRevalidatedTags: i12, nonce: s4 }) {
                  let a4 = !t11.shouldWaitOnAllReady && !t11.supportsDynamicResponse && !t11.isDraftMode && !t11.isPossibleServerAction, o4 = a4 && (!!process.env.NEXT_DEBUG_BUILD || "1" === process.env.NEXT_SSG_FETCH_METRICS), l3 = { isStaticGeneration: a4, page: e11, route: eU(e11), incrementalCache: t11.incrementalCache || globalThis.__incrementalCache, cacheLifeProfiles: t11.cacheLifeProfiles, isBuildTimePrerendering: t11.isBuildTimePrerendering, fetchCache: t11.fetchCache, isOnDemandRevalidate: t11.isOnDemandRevalidate, isDraftMode: t11.isDraftMode, isPrefetchRequest: r12, buildId: n12, reactLoadableManifest: (null == t11 ? void 0 : t11.reactLoadableManifest) || {}, assetPrefix: (null == t11 ? void 0 : t11.assetPrefix) || "", nonce: s4, afterContext: function(e12) {
                    let { waitUntil: t12, onClose: r13, onAfterTaskError: n13 } = e12;
                    return new tA({ waitUntil: t12, onClose: r13, onTaskError: n13 });
                  }(t11), cacheComponentsEnabled: t11.cacheComponents, previouslyRevalidatedTags: i12, refreshTagsByCacheKind: function() {
                    let e12 = /* @__PURE__ */ new Map(), t12 = tR();
                    if (t12) for (let [r13, n13] of t12) "refreshTags" in n13 && e12.set(r13, tI(async () => n13.refreshTags()));
                    return e12;
                  }(), runInCleanSnapshot: eH ? eH.snapshot() : function(e12, ...t12) {
                    return e12(...t12);
                  }, shouldTrackFetchMetrics: o4, reactServerErrorsByDigest: /* @__PURE__ */ new Map() };
                  return t11.store = l3, l3;
                }({ page: "/", renderOpts: { cacheLifeProfiles: null == (i11 = t10.request.nextConfig) || null == (n11 = i11.experimental) ? void 0 : n11.cacheLife, cacheComponents: false, experimental: { isRoutePPREnabled: false, authInterrupts: !!(null == (a3 = t10.request.nextConfig) || null == (s3 = a3.experimental) ? void 0 : s3.authInterrupts) }, supportsDynamicResponse: true, waitUntil: e10, onClose: r11.onClose.bind(r11), onAfterTaskError: void 0 }, isPrefetchRequest: "1" === w2.headers.get(eI), buildId: g2 ?? "", previouslyRevalidatedTags: [] });
                return await eF.run(f3, () => tb.run(d3, t10.handler, w2, S2));
              } finally {
                setTimeout(() => {
                  r11.dispatchClose();
                }, 0);
              }
            });
          }
          return t10.handler(w2, S2);
        })) && !(o2 instanceof Response)) throw Object.defineProperty(TypeError("Expected an instance of Response to be returned"), "__NEXT_ERROR_CODE", { value: "E567", enumerable: false, configurable: true });
        o2 && l2 && o2.headers.set("set-cookie", l2);
        let O2 = null == o2 ? void 0 : o2.headers.get("x-middleware-rewrite");
        if (o2 && O2 && (b2 || !f2)) {
          let e10 = new L(O2, { forceLocale: true, headers: t10.request.headers, nextConfig: t10.request.nextConfig });
          f2 || e10.host !== w2.nextUrl.host || (e10.buildId = g2 || e10.buildId, o2.headers.set("x-middleware-rewrite", String(e10)));
          let { url: r11, isRelative: a3 } = ej(e10.toString(), p2.toString());
          !f2 && v2 && o2.headers.set("x-nextjs-rewrite", r11);
          let l3 = !a3 && (null == (s2 = t10.request.nextConfig) || null == (i10 = s2.experimental) || null == (n10 = i10.clientParamParsingOrigins) ? void 0 : n10.some((t11) => new RegExp(t11).test(e10.origin)));
          b2 && (a3 || l3) && (p2.pathname !== e10.pathname && o2.headers.set("x-nextjs-rewritten-path", e10.pathname), p2.search !== e10.search && o2.headers.set("x-nextjs-rewritten-query", e10.search.slice(1)));
        }
        if (o2 && O2 && b2 && _2) {
          let e10 = new URL(O2);
          e10.searchParams.has(e$) || (e10.searchParams.set(e$, _2), o2.headers.set("x-middleware-rewrite", e10.toString()));
        }
        let R2 = null == o2 ? void 0 : o2.headers.get("Location");
        if (o2 && R2 && !f2) {
          let e10 = new L(R2, { forceLocale: false, headers: t10.request.headers, nextConfig: t10.request.nextConfig });
          o2 = new Response(o2.body, o2), e10.host === p2.host && (e10.buildId = g2 || e10.buildId, o2.headers.set("Location", ej(e10, p2).url)), v2 && (o2.headers.delete("Location"), o2.headers.set("x-nextjs-redirect", ej(e10.toString(), p2.toString()).url));
        }
        let k2 = o2 || eA.next(), C2 = k2.headers.get("x-middleware-override-headers"), P2 = [];
        if (C2) {
          for (let [e10, t11] of y2) k2.headers.set(`x-middleware-request-${e10}`, t11), P2.push(e10);
          P2.length > 0 && k2.headers.set("x-middleware-override-headers", C2 + "," + P2.join(","));
        }
        return { response: k2, waitUntil: ("internal" === S2[T].kind ? Promise.all(S2[T].promises).then(() => {
        }) : void 0) ?? Promise.resolve(), fetchMetrics: w2.fetchMetrics };
      }
      class tF {
        constructor() {
          let e10, t10;
          this.promise = new Promise((r10, n10) => {
            e10 = r10, t10 = n10;
          }), this.resolve = e10, this.reject = t10;
        }
      }
      class tG {
        constructor(e10, t10, r10) {
          this.prev = null, this.next = null, this.key = e10, this.data = t10, this.size = r10;
        }
      }
      class tW {
        constructor() {
          this.prev = null, this.next = null;
        }
      }
      class tz {
        constructor(e10, t10, r10) {
          this.cache = /* @__PURE__ */ new Map(), this.totalSize = 0, this.maxSize = e10, this.calculateSize = t10, this.onEvict = r10, this.head = new tW(), this.tail = new tW(), this.head.next = this.tail, this.tail.prev = this.head;
        }
        addToHead(e10) {
          e10.prev = this.head, e10.next = this.head.next, this.head.next.prev = e10, this.head.next = e10;
        }
        removeNode(e10) {
          e10.prev.next = e10.next, e10.next.prev = e10.prev;
        }
        moveToHead(e10) {
          this.removeNode(e10), this.addToHead(e10);
        }
        removeTail() {
          let e10 = this.tail.prev;
          return this.removeNode(e10), e10;
        }
        set(e10, t10) {
          let r10 = (null == this.calculateSize ? void 0 : this.calculateSize.call(this, t10)) ?? 1;
          if (r10 <= 0) throw Object.defineProperty(Error(`LRUCache: calculateSize returned ${r10}, but size must be > 0. Items with size 0 would never be evicted, causing unbounded cache growth.`), "__NEXT_ERROR_CODE", { value: "E1045", enumerable: false, configurable: true });
          if (r10 > this.maxSize) return console.warn("Single item size exceeds maxSize"), false;
          let n10 = this.cache.get(e10);
          if (n10) n10.data = t10, this.totalSize = this.totalSize - n10.size + r10, n10.size = r10, this.moveToHead(n10);
          else {
            let n11 = new tG(e10, t10, r10);
            this.cache.set(e10, n11), this.addToHead(n11), this.totalSize += r10;
          }
          for (; this.totalSize > this.maxSize && this.cache.size > 0; ) {
            let e11 = this.removeTail();
            this.cache.delete(e11.key), this.totalSize -= e11.size, null == this.onEvict || this.onEvict.call(this, e11.key, e11.data);
          }
          return true;
        }
        has(e10) {
          return this.cache.has(e10);
        }
        get(e10) {
          let t10 = this.cache.get(e10);
          if (t10) return this.moveToHead(t10), t10.data;
        }
        *[Symbol.iterator]() {
          let e10 = this.head.next;
          for (; e10 && e10 !== this.tail; ) {
            let t10 = e10;
            yield [t10.key, t10.data], e10 = e10.next;
          }
        }
        remove(e10) {
          let t10 = this.cache.get(e10);
          t10 && (this.removeNode(t10), this.cache.delete(e10), this.totalSize -= t10.size);
        }
        get size() {
          return this.cache.size;
        }
        get currentSize() {
          return this.totalSize;
        }
      }
      let { env: tK, stdout: tJ } = (null == (ec = globalThis) ? void 0 : ec.process) ?? {}, tX = tK && !tK.NO_COLOR && (tK.FORCE_COLOR || (null == tJ ? void 0 : tJ.isTTY) && !tK.CI && "dumb" !== tK.TERM), tY = (e10, t10, r10, n10) => {
        let i10 = e10.substring(0, n10) + r10, s2 = e10.substring(n10 + t10.length), a2 = s2.indexOf(t10);
        return ~a2 ? i10 + tY(s2, t10, r10, a2) : i10 + s2;
      }, tQ = (e10, t10, r10 = e10) => tX ? (n10) => {
        let i10 = "" + n10, s2 = i10.indexOf(t10, e10.length);
        return ~s2 ? e10 + tY(i10, t10, r10, s2) + t10 : e10 + i10 + t10;
      } : String, tZ = tQ("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m");
      tQ("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"), tQ("\x1B[3m", "\x1B[23m"), tQ("\x1B[4m", "\x1B[24m"), tQ("\x1B[7m", "\x1B[27m"), tQ("\x1B[8m", "\x1B[28m"), tQ("\x1B[9m", "\x1B[29m"), tQ("\x1B[30m", "\x1B[39m");
      let t0 = tQ("\x1B[31m", "\x1B[39m"), t1 = tQ("\x1B[32m", "\x1B[39m"), t2 = tQ("\x1B[33m", "\x1B[39m");
      tQ("\x1B[34m", "\x1B[39m");
      let t4 = tQ("\x1B[35m", "\x1B[39m");
      tQ("\x1B[38;2;173;127;168m", "\x1B[39m"), tQ("\x1B[36m", "\x1B[39m");
      let t3 = tQ("\x1B[37m", "\x1B[39m");
      tQ("\x1B[90m", "\x1B[39m"), tQ("\x1B[40m", "\x1B[49m"), tQ("\x1B[41m", "\x1B[49m"), tQ("\x1B[42m", "\x1B[49m"), tQ("\x1B[43m", "\x1B[49m"), tQ("\x1B[44m", "\x1B[49m"), tQ("\x1B[45m", "\x1B[49m"), tQ("\x1B[46m", "\x1B[49m"), tQ("\x1B[47m", "\x1B[49m"), t3(tZ("\u25CB")), t0(tZ("\u2A2F")), t2(tZ("\u26A0")), t3(tZ(" ")), t1(tZ("\u2713")), t4(tZ("\xBB")), new tz(1e4, (e10) => e10.length), new tz(1e4, (e10) => e10.length);
      var t8 = ((Y = {}).APP_PAGE = "APP_PAGE", Y.APP_ROUTE = "APP_ROUTE", Y.PAGES = "PAGES", Y.FETCH = "FETCH", Y.REDIRECT = "REDIRECT", Y.IMAGE = "IMAGE", Y), t6 = ((Q = {}).APP_PAGE = "APP_PAGE", Q.APP_ROUTE = "APP_ROUTE", Q.PAGES = "PAGES", Q.FETCH = "FETCH", Q.IMAGE = "IMAGE", Q);
      function t9() {
      }
      let t5 = new TextEncoder();
      function t7(e10) {
        return new ReadableStream({ start(t10) {
          t10.enqueue(t5.encode(e10)), t10.close();
        } });
      }
      function re(e10) {
        return new ReadableStream({ start(t10) {
          t10.enqueue(e10), t10.close();
        } });
      }
      async function rt(e10, t10) {
        let r10 = new TextDecoder("utf-8", { fatal: true }), n10 = "";
        for await (let i10 of e10) {
          if (null == t10 ? void 0 : t10.aborted) return n10;
          n10 += r10.decode(i10, { stream: true });
        }
        return n10 + r10.decode();
      }
      let rr = "ResponseAborted";
      class rn extends Error {
        constructor(...e10) {
          super(...e10), this.name = rr;
        }
      }
      let ri = 0, rs = 0, ra = 0;
      function ro(e10) {
        return (null == e10 ? void 0 : e10.name) === "AbortError" || (null == e10 ? void 0 : e10.name) === rr;
      }
      async function rl(e10, t10, r10) {
        try {
          let n10, { errored: i10, destroyed: s2 } = t10;
          if (i10 || s2) return;
          let a2 = (n10 = new AbortController(), t10.once("close", () => {
            t10.writableFinished || n10.abort(new rn());
          }), n10), o2 = function(e11, t11) {
            let r11 = false, n11 = new tF();
            function i11() {
              n11.resolve();
            }
            e11.on("drain", i11), e11.once("close", () => {
              e11.off("drain", i11), n11.resolve();
            });
            let s3 = new tF();
            return e11.once("finish", () => {
              s3.resolve();
            }), new WritableStream({ write: async (t12) => {
              if (!r11) {
                if (r11 = true, "performance" in globalThis && process.env.NEXT_OTEL_PERFORMANCE_PREFIX) {
                  let e12 = function(e13 = {}) {
                    let t13 = 0 === ri ? void 0 : { clientComponentLoadStart: ri, clientComponentLoadTimes: rs, clientComponentLoadCount: ra };
                    return e13.reset && (ri = 0, rs = 0, ra = 0), t13;
                  }();
                  e12 && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-client-component-loading`, { start: e12.clientComponentLoadStart, end: e12.clientComponentLoadStart + e12.clientComponentLoadTimes });
                }
                e11.flushHeaders(), tp().trace(eZ.startResponse, { spanName: "start response" }, () => void 0);
              }
              try {
                let r12 = e11.write(t12);
                "flush" in e11 && "function" == typeof e11.flush && e11.flush(), r12 || (await n11.promise, n11 = new tF());
              } catch (t13) {
                throw e11.end(), Object.defineProperty(Error("failed to write chunk to response", { cause: t13 }), "__NEXT_ERROR_CODE", { value: "E321", enumerable: false, configurable: true });
              }
            }, abort: (t12) => {
              e11.writableFinished || e11.destroy(t12);
            }, close: async () => {
              if (t11 && await t11, !e11.writableFinished) return e11.end(), s3.promise;
            } });
          }(t10, r10);
          await e10.pipeTo(o2, { signal: a2.signal });
        } catch (e11) {
          if (ro(e11)) return;
          throw Object.defineProperty(Error("failed to pipe response", { cause: e11 }), "__NEXT_ERROR_CODE", { value: "E180", enumerable: false, configurable: true });
        }
      }
      class ru {
        static #e = this.EMPTY = new ru(null, { metadata: {}, contentType: null });
        static fromStatic(e10, t10) {
          return new ru(e10, { metadata: {}, contentType: t10 });
        }
        constructor(e10, { contentType: t10, waitUntil: r10, metadata: n10 }) {
          this.response = e10, this.contentType = t10, this.metadata = n10, this.waitUntil = r10;
        }
        assignMetadata(e10) {
          Object.assign(this.metadata, e10);
        }
        get isNull() {
          return null === this.response;
        }
        get isDynamic() {
          return "string" != typeof this.response;
        }
        toUnchunkedString(e10 = false) {
          if (null === this.response) return "";
          if ("string" != typeof this.response) {
            if (!e10) throw Object.defineProperty(new tw("dynamic responses cannot be unchunked. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E732", enumerable: false, configurable: true });
            return rt(this.readable);
          }
          return this.response;
        }
        get readable() {
          return null === this.response ? new ReadableStream({ start(e10) {
            e10.close();
          } }) : "string" == typeof this.response ? t7(this.response) : tE.Buffer.isBuffer(this.response) ? re(this.response) : Array.isArray(this.response) ? function(...e10) {
            if (0 === e10.length) return new ReadableStream({ start(e11) {
              e11.close();
            } });
            if (1 === e10.length) return e10[0];
            let { readable: t10, writable: r10 } = new TransformStream(), n10 = e10[0].pipeTo(r10, { preventClose: true }), i10 = 1;
            for (; i10 < e10.length - 1; i10++) {
              let t11 = e10[i10];
              n10 = n10.then(() => t11.pipeTo(r10, { preventClose: true }));
            }
            let s2 = e10[i10];
            return (n10 = n10.then(() => s2.pipeTo(r10))).catch(t9), t10;
          }(...this.response) : this.response;
        }
        coerce() {
          return null === this.response ? [] : "string" == typeof this.response ? [t7(this.response)] : Array.isArray(this.response) ? this.response : tE.Buffer.isBuffer(this.response) ? [re(this.response)] : [this.response];
        }
        pipeThrough(e10) {
          this.response = this.readable.pipeThrough(e10);
        }
        unshift(e10) {
          this.response = this.coerce(), this.response.unshift(e10);
        }
        push(e10) {
          this.response = this.coerce(), this.response.push(e10);
        }
        async pipeTo(e10) {
          try {
            await this.readable.pipeTo(e10, { preventClose: true }), this.waitUntil && await this.waitUntil, await e10.close();
          } catch (t10) {
            if (ro(t10)) return void await e10.abort(t10);
            throw t10;
          }
        }
        async pipeToNodeResponse(e10) {
          await rl(this.readable, e10, this.waitUntil);
        }
      }
      function rc(e10, t10) {
        if (!e10) return t10;
        let r10 = parseInt(e10, 10);
        return Number.isFinite(r10) && r10 > 0 ? r10 : t10;
      }
      rc(process.env.NEXT_PRIVATE_RESPONSE_CACHE_TTL, 1e4), rc(process.env.NEXT_PRIVATE_RESPONSE_CACHE_MAX_SIZE, 150);
      var rh = e.i(68886);
      let rd = /* @__PURE__ */ new Map(), rf = (e10, t10) => {
        for (let r10 of e10) {
          let e11 = rd.get(r10), n10 = null == e11 ? void 0 : e11.expired;
          if ("number" == typeof n10 && n10 <= Date.now() && n10 > t10) return true;
        }
        return false;
      }, rp = (e10, t10) => {
        for (let r10 of e10) {
          let e11 = rd.get(r10), n10 = (null == e11 ? void 0 : e11.stale) ?? 0;
          if ("number" == typeof n10 && n10 > t10) return true;
        }
        return false;
      };
      class rg {
        constructor(e10) {
          this.fs = e10, this.tasks = [];
        }
        findOrCreateTask(e10) {
          for (let t11 of this.tasks) if (t11[0] === e10) return t11;
          let t10 = this.fs.mkdir(e10);
          t10.catch(() => {
          });
          let r10 = [e10, t10, []];
          return this.tasks.push(r10), r10;
        }
        append(e10, t10) {
          let r10 = this.findOrCreateTask(rh.default.dirname(e10)), n10 = r10[1].then(() => this.fs.writeFile(e10, t10));
          n10.catch(() => {
          }), r10[2].push(n10);
        }
        wait() {
          return Promise.all(this.tasks.flatMap((e10) => e10[2]));
        }
      }
      function rm(e10) {
        return (null == e10 ? void 0 : e10.length) || 0;
      }
      class rv {
        static #e = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor(e10) {
          this.fs = e10.fs, this.flushToDisk = e10.flushToDisk, this.serverDistDir = e10.serverDistDir, this.revalidatedTags = e10.revalidatedTags, e10.maxMemoryCacheSize ? rv.memoryCache ? rv.debug && console.log("FileSystemCache: memory store already initialized") : (rv.debug && console.log("FileSystemCache: using memory store for fetch cache"), rv.memoryCache = function(e11) {
            return r || (r = new tz(e11, function({ value: e12 }) {
              var t10, r10;
              if (!e12) return 25;
              if (e12.kind === t8.REDIRECT) return JSON.stringify(e12.props).length;
              if (e12.kind === t8.IMAGE) throw Object.defineProperty(Error("invariant image should not be incremental-cache"), "__NEXT_ERROR_CODE", { value: "E501", enumerable: false, configurable: true });
              if (e12.kind === t8.FETCH) return JSON.stringify(e12.data || "").length;
              if (e12.kind === t8.APP_ROUTE) return e12.body.length;
              return e12.kind === t8.APP_PAGE ? Math.max(1, e12.html.length + rm(e12.rscData) + ((null == (r10 = e12.postponed) ? void 0 : r10.length) || 0) + function(e13) {
                if (!e13) return 0;
                let t11 = 0;
                for (let [r11, n10] of e13) t11 += r11.length + rm(n10);
                return t11;
              }(e12.segmentData)) : e12.html.length + ((null == (t10 = JSON.stringify(e12.pageData)) ? void 0 : t10.length) || 0);
            })), r;
          }(e10.maxMemoryCacheSize)) : rv.debug && console.log("FileSystemCache: not using memory store for fetch cache");
        }
        resetRequestCache() {
        }
        async revalidateTag(e10, t10) {
          if (e10 = "string" == typeof e10 ? [e10] : e10, rv.debug && console.log("FileSystemCache: revalidateTag", e10, t10), 0 === e10.length) return;
          let r10 = Date.now();
          for (let n10 of e10) {
            let e11 = rd.get(n10) || {};
            if (t10) {
              let i10 = { ...e11 };
              i10.stale = r10, void 0 !== t10.expire && (i10.expired = r10 + 1e3 * t10.expire), rd.set(n10, i10);
            } else rd.set(n10, { ...e11, expired: r10 });
          }
        }
        async get(...e10) {
          var t10, r10, n10, i10, s2, a2;
          let [o2, l2] = e10, { kind: u2 } = l2, c2 = null == (t10 = rv.memoryCache) ? void 0 : t10.get(o2);
          if (rv.debug && (u2 === t6.FETCH ? console.log("FileSystemCache: get", o2, l2.tags, u2, !!c2) : console.log("FileSystemCache: get", o2, u2, !!c2)), (null == c2 || null == (r10 = c2.value) ? void 0 : r10.kind) === t8.APP_PAGE || (null == c2 || null == (n10 = c2.value) ? void 0 : n10.kind) === t8.APP_ROUTE || (null == c2 || null == (i10 = c2.value) ? void 0 : i10.kind) === t8.PAGES) {
            let e11 = null == (a2 = c2.value.headers) ? void 0 : a2[m];
            if ("string" == typeof e11) {
              let t11 = e11.split(",");
              if (t11.length > 0 && rf(t11, c2.lastModified)) return rv.debug && console.log("FileSystemCache: expired tags", t11), null;
            }
          } else if ((null == c2 || null == (s2 = c2.value) ? void 0 : s2.kind) === t8.FETCH) {
            let e11 = l2.kind === t6.FETCH ? [...l2.tags || [], ...l2.softTags || []] : [];
            if (e11.some((e12) => this.revalidatedTags.includes(e12))) return rv.debug && console.log("FileSystemCache: was revalidated", e11), null;
            if (rf(e11, c2.lastModified)) return rv.debug && console.log("FileSystemCache: expired tags", e11), null;
          }
          return c2 ?? null;
        }
        async set(e10, t10, r10) {
          var n10;
          if (null == (n10 = rv.memoryCache) || n10.set(e10, { value: t10, lastModified: Date.now() }), rv.debug && console.log("FileSystemCache: set", e10), !this.flushToDisk || !t10) return;
          let i10 = new rg(this.fs);
          if (t10.kind === t8.APP_ROUTE) {
            let r11 = this.getFilePath(`${e10}.body`, t6.APP_ROUTE);
            i10.append(r11, t10.body);
            let n11 = { headers: t10.headers, status: t10.status, postponed: void 0, segmentPaths: void 0, prefetchHints: void 0 };
            i10.append(r11.replace(/\.body$/, g), JSON.stringify(n11, null, 2));
          } else if (t10.kind === t8.PAGES || t10.kind === t8.APP_PAGE) {
            let n11 = t10.kind === t8.APP_PAGE, s2 = this.getFilePath(`${e10}.html`, n11 ? t6.APP_PAGE : t6.PAGES);
            if (i10.append(s2, t10.html), r10.fetchCache || r10.isFallback || r10.isRoutePPREnabled || i10.append(this.getFilePath(`${e10}${n11 ? ".rsc" : ".json"}`, n11 ? t6.APP_PAGE : t6.PAGES), n11 ? t10.rscData : JSON.stringify(t10.pageData)), (null == t10 ? void 0 : t10.kind) === t8.APP_PAGE) {
              let e11;
              if (t10.segmentData) {
                e11 = [];
                let r12 = s2.replace(/\.html$/, ".segments");
                for (let [n12, s3] of t10.segmentData) {
                  e11.push(n12);
                  let t11 = r12 + n12 + ".segment.rsc";
                  i10.append(t11, s3);
                }
              }
              let r11 = { headers: t10.headers, status: t10.status, postponed: t10.postponed, segmentPaths: e11, prefetchHints: void 0 };
              i10.append(s2.replace(/\.html$/, g), JSON.stringify(r11));
            }
          } else if (t10.kind === t8.FETCH) {
            let n11 = this.getFilePath(e10, t6.FETCH);
            i10.append(n11, JSON.stringify({ ...t10, tags: r10.fetchCache ? r10.tags : [] }));
          }
          await i10.wait();
        }
        getFilePath(e10, t10) {
          switch (t10) {
            case t6.FETCH:
              return rh.default.join(this.serverDistDir, "..", "cache", "fetch-cache", e10);
            case t6.PAGES:
              return rh.default.join(this.serverDistDir, "pages", e10);
            case t6.IMAGE:
            case t6.APP_PAGE:
            case t6.APP_ROUTE:
              return rh.default.join(this.serverDistDir, "app", e10);
            default:
              throw Object.defineProperty(Error(`Unexpected file path kind: ${t10}`), "__NEXT_ERROR_CODE", { value: "E479", enumerable: false, configurable: true });
          }
        }
      }
      let rb = ["(..)(..)", "(.)", "(..)", "(...)"], ry = /\/[^/]*\[[^/]+\][^/]*(?=\/|$)/, r_ = /\/\[[^/]+\](?=\/|$)/;
      function rw(e10) {
        return e10.replace(/(?:\/index)?\/?$/, "") || "/";
      }
      class rE {
        static #e = this.cacheControls = /* @__PURE__ */ new Map();
        constructor(e10) {
          this.prerenderManifest = e10;
        }
        get(e10) {
          let t10 = rE.cacheControls.get(e10);
          if (t10) return t10;
          let r10 = this.prerenderManifest.routes[e10];
          if (r10) {
            let { initialRevalidateSeconds: e11, initialExpireSeconds: t11 } = r10;
            if (void 0 !== e11) return { revalidate: e11, expire: t11 };
          }
          let n10 = this.prerenderManifest.dynamicRoutes[e10];
          if (n10) {
            let { fallbackRevalidate: e11, fallbackExpire: t11 } = n10;
            if (void 0 !== e11) return { revalidate: e11, expire: t11 };
          }
        }
        set(e10, t10) {
          rE.cacheControls.set(e10, t10);
        }
        clear() {
          rE.cacheControls.clear();
        }
      }
      e.i(67914);
      class rS {
        static #e = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor({ fs: e10, dev: t10, flushToDisk: r10, minimalMode: n10, serverDistDir: i10, requestHeaders: s2, maxMemoryCacheSize: a2, getPrerenderManifest: o2, fetchCacheKeyPrefix: l2, CurCacheHandler: u2, allowedRevalidateHeaderKeys: c2 }) {
          var h2, d2, f2, g2;
          this.locks = /* @__PURE__ */ new Map(), this.hasCustomCacheHandler = !!u2;
          const m2 = Symbol.for("@next/cache-handlers"), b2 = globalThis;
          if (u2) rS.debug && console.log("IncrementalCache: using custom cache handler", u2.name);
          else {
            const t11 = b2[m2];
            (null == t11 ? void 0 : t11.FetchCache) ? (u2 = t11.FetchCache, rS.debug && console.log("IncrementalCache: using global FetchCache cache handler")) : e10 && i10 && (rS.debug && console.log("IncrementalCache: using filesystem cache handler"), u2 = rv);
          }
          process.env.__NEXT_TEST_MAX_ISR_CACHE && (a2 = parseInt(process.env.__NEXT_TEST_MAX_ISR_CACHE, 10)), this.dev = t10, this.disableForTestmode = "true" === process.env.NEXT_PRIVATE_TEST_PROXY, this.minimalMode = n10, this.requestHeaders = s2, this.allowedRevalidateHeaderKeys = c2, this.prerenderManifest = o2(), this.cacheControls = new rE(this.prerenderManifest), this.fetchCacheKeyPrefix = l2;
          let y2 = [];
          s2[p] === (null == (d2 = this.prerenderManifest) || null == (h2 = d2.preview) ? void 0 : h2.previewModeId) && (this.isOnDemandRevalidate = true), n10 && (y2 = this.revalidatedTags = function(e11, t11) {
            return "string" == typeof e11[v] && e11["x-next-revalidate-tag-token"] === t11 ? e11[v].split(",") : [];
          }(s2, null == (g2 = this.prerenderManifest) || null == (f2 = g2.preview) ? void 0 : f2.previewModeId)), u2 && (this.cacheHandler = new u2({ dev: t10, fs: e10, flushToDisk: r10, serverDistDir: i10, revalidatedTags: y2, maxMemoryCacheSize: a2, _requestHeaders: s2, fetchCacheKeyPrefix: l2 }));
        }
        calculateRevalidate(e10, t10, r10, n10) {
          if (r10) return Math.floor(performance.timeOrigin + performance.now() - 1e3);
          let i10 = this.cacheControls.get(rw(e10)), s2 = i10 ? i10.revalidate : !n10 && 1;
          return "number" == typeof s2 ? 1e3 * s2 + t10 : s2;
        }
        _getPathname(e10, t10) {
          return t10 ? e10 : /^\/index(\/|$)/.test(e10) && !function(e11, t11 = true) {
            return (void 0 !== e11.split("/").find((e12) => rb.find((t12) => e12.startsWith(t12))) && (e11 = function(e12) {
              let t12, r10, n10;
              for (let i10 of e12.split("/")) if (r10 = rb.find((e13) => i10.startsWith(e13))) {
                [t12, n10] = e12.split(r10, 2);
                break;
              }
              if (!t12 || !r10 || !n10) throw Object.defineProperty(Error(`Invalid interception route: ${e12}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`), "__NEXT_ERROR_CODE", { value: "E269", enumerable: false, configurable: true });
              switch (t12 = eU(t12), r10) {
                case "(.)":
                  n10 = "/" === t12 ? `/${n10}` : t12 + "/" + n10;
                  break;
                case "(..)":
                  if ("/" === t12) throw Object.defineProperty(Error(`Invalid interception route: ${e12}. Cannot use (..) marker at the root level, use (.) instead.`), "__NEXT_ERROR_CODE", { value: "E207", enumerable: false, configurable: true });
                  n10 = t12.split("/").slice(0, -1).concat(n10).join("/");
                  break;
                case "(...)":
                  n10 = "/" + n10;
                  break;
                case "(..)(..)":
                  let i10 = t12.split("/");
                  if (i10.length <= 2) throw Object.defineProperty(Error(`Invalid interception route: ${e12}. Cannot use (..)(..) marker at the root level or one level up.`), "__NEXT_ERROR_CODE", { value: "E486", enumerable: false, configurable: true });
                  n10 = i10.slice(0, -2).concat(n10).join("/");
                  break;
                default:
                  throw Object.defineProperty(Error("Invariant: unexpected marker"), "__NEXT_ERROR_CODE", { value: "E112", enumerable: false, configurable: true });
              }
              return { interceptingRoute: t12, interceptedRoute: n10 };
            }(e11).interceptedRoute), t11) ? r_.test(e11) : ry.test(e11);
          }(e10) ? `/index${e10}` : "/" === e10 ? "/index" : eD(e10);
        }
        resetRequestCache() {
          var e10, t10;
          null == (t10 = this.cacheHandler) || null == (e10 = t10.resetRequestCache) || e10.call(t10);
        }
        async lock(e10) {
          for (; ; ) {
            let t11 = this.locks.get(e10);
            if (rS.debug && console.log("IncrementalCache: lock get", e10, !!t11), !t11) break;
            await t11;
          }
          let { resolve: t10, promise: r10 } = new tF();
          return rS.debug && console.log("IncrementalCache: successfully locked", e10), this.locks.set(e10, r10), () => {
            t10(), this.locks.delete(e10);
          };
        }
        async revalidateTag(e10, t10) {
          var r10;
          return null == (r10 = this.cacheHandler) ? void 0 : r10.revalidateTag(e10, t10);
        }
        async generateCacheKey(e10, t10 = {}) {
          let r10 = [], n10 = new TextEncoder(), i10 = new TextDecoder();
          if (t10.body) if (t10.body instanceof Uint8Array) r10.push(i10.decode(t10.body)), t10._ogBody = t10.body;
          else if ("function" == typeof t10.body.getReader) {
            let e11 = t10.body, s3 = [];
            try {
              await e11.pipeTo(new WritableStream({ write(e12) {
                "string" == typeof e12 ? (s3.push(n10.encode(e12)), r10.push(e12)) : (s3.push(e12), r10.push(i10.decode(e12, { stream: true })));
              } })), r10.push(i10.decode());
              let a3 = s3.reduce((e12, t11) => e12 + t11.length, 0), o3 = new Uint8Array(a3), l2 = 0;
              for (let e12 of s3) o3.set(e12, l2), l2 += e12.length;
              t10._ogBody = o3;
            } catch (e12) {
              console.error("Problem reading body", e12);
            }
          } else if ("function" == typeof t10.body.keys) {
            let e11 = t10.body;
            for (let n11 of (t10._ogBody = t10.body, /* @__PURE__ */ new Set([...e11.keys()]))) {
              let t11 = e11.getAll(n11);
              r10.push(`${n11}=${(await Promise.all(t11.map(async (e12) => "string" == typeof e12 ? e12 : await e12.text()))).join(",")}`);
            }
          } else if ("function" == typeof t10.body.arrayBuffer) {
            let e11 = t10.body, n11 = await e11.arrayBuffer();
            r10.push(await e11.text()), t10._ogBody = new Blob([n11], { type: e11.type });
          } else "string" == typeof t10.body && (r10.push(t10.body), t10._ogBody = t10.body);
          let s2 = "function" == typeof (t10.headers || {}).keys ? Object.fromEntries(t10.headers) : Object.assign({}, t10.headers);
          "traceparent" in s2 && delete s2.traceparent, "tracestate" in s2 && delete s2.tracestate;
          let a2 = JSON.stringify(["v3", this.fetchCacheKeyPrefix || "", e10, t10.method, s2, t10.mode, t10.redirect, t10.credentials, t10.referrer, t10.referrerPolicy, t10.integrity, t10.cache, r10]);
          {
            var o2;
            let e11 = n10.encode(a2);
            return o2 = await crypto.subtle.digest("SHA-256", e11), Array.prototype.map.call(new Uint8Array(o2), (e12) => e12.toString(16).padStart(2, "0")).join("");
          }
        }
        async get(e10, t10) {
          var r10, n10, i10, s2, a2, o2, l2;
          let u2, c2;
          if (t10.kind === t6.FETCH) {
            let r11 = tb.getStore(), n11 = r11 ? function(e11) {
              switch (e11.type) {
                case "request":
                case "prerender":
                case "prerender-runtime":
                case "prerender-client":
                case "validation-client":
                  if (e11.renderResumeDataCache) return e11.renderResumeDataCache;
                case "prerender-ppr":
                  return e11.prerenderResumeDataCache ?? null;
                case "cache":
                case "private-cache":
                case "unstable-cache":
                case "prerender-legacy":
                case "generate-static-params":
                  return null;
                default:
                  return e11;
              }
            }(r11) : null;
            if (n11) {
              let r12 = n11.fetch.get(e10);
              if ((null == r12 ? void 0 : r12.kind) === t8.FETCH) {
                let n12 = eF.getStore();
                if (![...t10.tags || [], ...t10.softTags || []].some((e11) => {
                  var t11, r13;
                  return (null == (t11 = this.revalidatedTags) ? void 0 : t11.includes(e11)) || (null == n12 || null == (r13 = n12.pendingRevalidatedTags) ? void 0 : r13.some((t12) => t12.tag === e11));
                })) return rS.debug && console.log("IncrementalCache: rdc:hit", e10), { isStale: false, value: r12 };
                rS.debug && console.log("IncrementalCache: rdc:revalidated-tag", e10);
              } else rS.debug && console.log("IncrementalCache: rdc:miss", e10);
            } else rS.debug && console.log("IncrementalCache: rdc:no-resume-data");
          }
          if (this.disableForTestmode || this.dev && (t10.kind !== t6.FETCH || "no-cache" === this.requestHeaders["cache-control"])) return null;
          e10 = this._getPathname(e10, t10.kind === t6.FETCH);
          let h2 = await (null == (r10 = this.cacheHandler) ? void 0 : r10.get(e10, t10));
          if (t10.kind === t6.FETCH) {
            if (!h2) return null;
            if ((null == (i10 = h2.value) ? void 0 : i10.kind) !== t8.FETCH) throw Object.defineProperty(new tw(`Expected cached value for cache key ${JSON.stringify(e10)} to be a "FETCH" kind, got ${JSON.stringify(null == (s2 = h2.value) ? void 0 : s2.kind)} instead.`), "__NEXT_ERROR_CODE", { value: "E653", enumerable: false, configurable: true });
            let r11 = eF.getStore(), n11 = [...t10.tags || [], ...t10.softTags || []];
            if (n11.some((e11) => {
              var t11, n12;
              return (null == (t11 = this.revalidatedTags) ? void 0 : t11.includes(e11)) || (null == r11 || null == (n12 = r11.pendingRevalidatedTags) ? void 0 : n12.some((t12) => t12.tag === e11));
            })) return rS.debug && console.log("IncrementalCache: expired tag", e10), null;
            let a3 = tb.getStore();
            if (a3) {
              let t11 = ty(a3);
              t11 && (rS.debug && console.log("IncrementalCache: rdc:set", e10), t11.fetch.set(e10, h2.value));
            }
            let o3 = t10.revalidate || h2.value.revalidate, l3 = (performance.timeOrigin + performance.now() - (h2.lastModified || 0)) / 1e3 > o3, u3 = h2.value.data;
            return rf(n11, h2.lastModified) ? null : (rp(n11, h2.lastModified) && (l3 = true), { isStale: l3, value: { kind: t8.FETCH, data: u3, revalidate: o3 } });
          }
          if ((null == h2 || null == (n10 = h2.value) ? void 0 : n10.kind) === t8.FETCH) throw Object.defineProperty(new tw(`Expected cached value for cache key ${JSON.stringify(e10)} not to be a ${JSON.stringify(t10.kind)} kind, got "FETCH" instead.`), "__NEXT_ERROR_CODE", { value: "E652", enumerable: false, configurable: true });
          let d2 = null, { isFallback: f2 } = t10, p2 = this.cacheControls.get(rw(e10));
          if ((null == h2 ? void 0 : h2.lastModified) === -1) u2 = -1, c2 = -31536e6;
          else {
            let r11 = performance.timeOrigin + performance.now(), n11 = (null == h2 ? void 0 : h2.lastModified) || r11;
            if (void 0 === (u2 = false !== (c2 = this.calculateRevalidate(e10, n11, this.dev ?? false, t10.isFallback)) && c2 < r11 || void 0) && ((null == h2 || null == (a2 = h2.value) ? void 0 : a2.kind) === t8.APP_PAGE || (null == h2 || null == (o2 = h2.value) ? void 0 : o2.kind) === t8.APP_ROUTE)) {
              let e11 = null == (l2 = h2.value.headers) ? void 0 : l2[m];
              if ("string" == typeof e11) {
                let t11 = e11.split(",");
                t11.length > 0 && (rf(t11, n11) ? u2 = -1 : rp(t11, n11) && (u2 = true));
              }
            }
          }
          return h2 && (d2 = { isStale: u2, cacheControl: p2, revalidateAfter: c2, value: h2.value, isFallback: f2 }), !h2 && this.prerenderManifest.notFoundRoutes.includes(e10) && (d2 = { isStale: u2, value: null, cacheControl: p2, revalidateAfter: c2, isFallback: f2 }, this.set(e10, d2.value, { ...t10, cacheControl: p2 })), d2;
        }
        async set(e10, t10, r10) {
          if ((null == t10 ? void 0 : t10.kind) === t8.FETCH) {
            let r11 = tb.getStore(), n11 = r11 ? ty(r11) : null;
            n11 && (rS.debug && console.log("IncrementalCache: rdc:set", e10), n11.fetch.set(e10, t10));
          }
          if (this.disableForTestmode || this.dev && !r10.fetchCache) return;
          e10 = this._getPathname(e10, r10.fetchCache);
          let n10 = JSON.stringify(t10).length;
          if (r10.fetchCache && n10 > 2097152 && !this.hasCustomCacheHandler && !r10.isImplicitBuildTimeCache) {
            let t11 = `Failed to set Next.js data cache for ${r10.fetchUrl || e10}, items over 2MB can not be cached (${n10} bytes)`;
            if (this.dev) throw Object.defineProperty(Error(t11), "__NEXT_ERROR_CODE", { value: "E1003", enumerable: false, configurable: true });
            console.warn(t11);
            return;
          }
          try {
            var i10;
            !r10.fetchCache && r10.cacheControl && this.cacheControls.set(rw(e10), r10.cacheControl), await (null == (i10 = this.cacheHandler) ? void 0 : i10.set(e10, t10, r10));
          } catch (t11) {
            console.warn("Failed to update prerender cache for", e10, t11);
          }
        }
      }
      var rO = e.i(70858);
      class rT extends Error {
        constructor(e10, t10 = "FunctionsError", r10) {
          super(e10), this.name = t10, this.context = r10;
        }
      }
      class rR extends rT {
        constructor(e10) {
          super("Failed to send a request to the Edge Function", "FunctionsFetchError", e10);
        }
      }
      class rx extends rT {
        constructor(e10) {
          super("Relay Error invoking the Edge Function", "FunctionsRelayError", e10);
        }
      }
      class rk extends rT {
        constructor(e10) {
          super("Edge Function returned a non-2xx status code", "FunctionsHttpError", e10);
        }
      }
      (Z = eh || (eh = {})).Any = "any", Z.ApNortheast1 = "ap-northeast-1", Z.ApNortheast2 = "ap-northeast-2", Z.ApSouth1 = "ap-south-1", Z.ApSoutheast1 = "ap-southeast-1", Z.ApSoutheast2 = "ap-southeast-2", Z.CaCentral1 = "ca-central-1", Z.EuCentral1 = "eu-central-1", Z.EuWest1 = "eu-west-1", Z.EuWest2 = "eu-west-2", Z.EuWest3 = "eu-west-3", Z.SaEast1 = "sa-east-1", Z.UsEast1 = "us-east-1", Z.UsWest1 = "us-west-1", Z.UsWest2 = "us-west-2";
      class rC {
        constructor(e10, { headers: t10 = {}, customFetch: r10, region: n10 = eh.Any } = {}) {
          this.url = e10, this.headers = t10, this.region = n10, this.fetch = /* @__PURE__ */ ((e11) => e11 ? (...t11) => e11(...t11) : (...e12) => fetch(...e12))(r10);
        }
        setAuth(e10) {
          this.headers.Authorization = `Bearer ${e10}`;
        }
        invoke(e10) {
          return (0, rO.__awaiter)(this, arguments, void 0, function* (e11, t10 = {}) {
            var r10;
            let n10, i10;
            try {
              let s2, { headers: a2, method: o2, body: l2, signal: u2, timeout: c2 } = t10, h2 = {}, { region: d2 } = t10;
              d2 || (d2 = this.region);
              let f2 = new URL(`${this.url}/${e11}`);
              d2 && "any" !== d2 && (h2["x-region"] = d2, f2.searchParams.set("forceFunctionRegion", d2)), l2 && (a2 && !Object.prototype.hasOwnProperty.call(a2, "Content-Type") || !a2) ? "u" > typeof Blob && l2 instanceof Blob || l2 instanceof ArrayBuffer ? (h2["Content-Type"] = "application/octet-stream", s2 = l2) : "string" == typeof l2 ? (h2["Content-Type"] = "text/plain", s2 = l2) : "u" > typeof FormData && l2 instanceof FormData ? s2 = l2 : (h2["Content-Type"] = "application/json", s2 = JSON.stringify(l2)) : s2 = l2;
              let p2 = u2;
              c2 && (i10 = new AbortController(), n10 = setTimeout(() => i10.abort(), c2), u2 ? (p2 = i10.signal, u2.addEventListener("abort", () => i10.abort())) : p2 = i10.signal);
              let g2 = yield this.fetch(f2.toString(), { method: o2 || "POST", headers: Object.assign(Object.assign(Object.assign({}, h2), this.headers), a2), body: s2, signal: p2 }).catch((e12) => {
                throw new rR(e12);
              }), m2 = g2.headers.get("x-relay-error");
              if (m2 && "true" === m2) throw new rx(g2);
              if (!g2.ok) throw new rk(g2);
              let v2 = (null != (r10 = g2.headers.get("Content-Type")) ? r10 : "text/plain").split(";")[0].trim();
              return { data: "application/json" === v2 ? yield g2.json() : "application/octet-stream" === v2 || "application/pdf" === v2 ? yield g2.blob() : "text/event-stream" === v2 ? g2 : "multipart/form-data" === v2 ? yield g2.formData() : yield g2.text(), error: null, response: g2 };
            } catch (e12) {
              return { data: null, error: e12, response: e12 instanceof rk || e12 instanceof rx ? e12.context : void 0 };
            } finally {
              n10 && clearTimeout(n10);
            }
          });
        }
      }
      var rP = e.i(1565);
      let { PostgrestClient: rA, PostgrestQueryBuilder: rj, PostgrestFilterBuilder: rI, PostgrestTransformBuilder: rN, PostgrestBuilder: r$, PostgrestError: rD } = rP.default || rP, rU = class {
        static detectEnvironment() {
          var t10;
          if ("u" > typeof WebSocket) return { type: "native", constructor: WebSocket };
          if ("u" > typeof globalThis && void 0 !== globalThis.WebSocket) return { type: "native", constructor: globalThis.WebSocket };
          if (void 0 !== e.g.WebSocket) return { type: "native", constructor: e.g.WebSocket };
          if ("u" > typeof globalThis && void 0 !== globalThis.WebSocketPair && void 0 === globalThis.WebSocket) return { type: "cloudflare", error: "Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.", workaround: "Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime." };
          if ("u" > typeof globalThis && globalThis.EdgeRuntime || "u" > typeof navigator && (null == (t10 = navigator.userAgent) ? void 0 : t10.includes("Vercel-Edge"))) return { type: "unsupported", error: "Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.", workaround: "Use serverless functions or a different deployment target for WebSocket functionality." };
          if ("u" > typeof process) {
            let e10 = process.versions;
            if (e10 && e10.node) {
              let t11 = parseInt(e10.node.replace(/^v/, "").split(".")[0]);
              return t11 >= 22 ? void 0 !== globalThis.WebSocket ? { type: "native", constructor: globalThis.WebSocket } : { type: "unsupported", error: `Node.js ${t11} detected but native WebSocket not found.`, workaround: "Provide a WebSocket implementation via the transport option." } : { type: "unsupported", error: `Node.js ${t11} detected without native WebSocket support.`, workaround: 'For Node.js < 22, install "ws" package and provide it via the transport option:\nimport ws from "ws"\nnew RealtimeClient(url, { transport: ws })' };
            }
          }
          return { type: "unsupported", error: "Unknown JavaScript runtime without WebSocket support.", workaround: "Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation." };
        }
        static getWebSocketConstructor() {
          let e10 = this.detectEnvironment();
          if (e10.constructor) return e10.constructor;
          let t10 = e10.error || "WebSocket not supported in this environment.";
          throw e10.workaround && (t10 += `

Suggested solution: ${e10.workaround}`), Error(t10);
        }
        static createWebSocket(e10, t10) {
          return new (this.getWebSocketConstructor())(e10, t10);
        }
        static isWebSocketSupported() {
          try {
            let e10 = this.detectEnvironment();
            return "native" === e10.type || "ws" === e10.type;
          } catch (e10) {
            return false;
          }
        }
      }, rL = "1.0.0";
      (ee = ed || (ed = {}))[ee.connecting = 0] = "connecting", ee[ee.open = 1] = "open", ee[ee.closing = 2] = "closing", ee[ee.closed = 3] = "closed", (et = ef || (ef = {})).closed = "closed", et.errored = "errored", et.joined = "joined", et.joining = "joining", et.leaving = "leaving", (er = ep || (ep = {})).close = "phx_close", er.error = "phx_error", er.join = "phx_join", er.reply = "phx_reply", er.leave = "phx_leave", er.access_token = "access_token", (eg || (eg = {})).websocket = "websocket", (en = em || (em = {})).Connecting = "connecting", en.Open = "open", en.Closing = "closing", en.Closed = "closed";
      class rM {
        constructor() {
          this.HEADER_LENGTH = 1, this.META_LENGTH = 4, this.USER_BROADCAST_PUSH_META_LENGTH = 5, this.KINDS = { push: 0, reply: 1, broadcast: 2, userBroadcastPush: 3, userBroadcast: 4 }, this.BINARY_ENCODING = 0, this.JSON_ENCODING = 1, this.BROADCAST = "broadcast";
        }
        encode(e10, t10) {
          return this._isArrayBuffer(e10.payload) ? t10(this._binaryEncodePush(e10)) : e10.event !== this.BROADCAST || e10.payload instanceof ArrayBuffer || "string" != typeof e10.payload.event ? t10(JSON.stringify([e10.join_ref, e10.ref, e10.topic, e10.event, e10.payload])) : t10(this._binaryEncodeUserBroadcastPush(e10));
        }
        _binaryEncodePush(e10) {
          let { join_ref: t10, ref: r10, event: n10, topic: i10, payload: s2 } = e10, a2 = this.META_LENGTH + t10.length + r10.length + i10.length + n10.length, o2 = new ArrayBuffer(this.HEADER_LENGTH + a2), l2 = new DataView(o2), u2 = 0;
          l2.setUint8(u2++, this.KINDS.push), l2.setUint8(u2++, t10.length), l2.setUint8(u2++, r10.length), l2.setUint8(u2++, i10.length), l2.setUint8(u2++, n10.length), Array.from(t10, (e11) => l2.setUint8(u2++, e11.charCodeAt(0))), Array.from(r10, (e11) => l2.setUint8(u2++, e11.charCodeAt(0))), Array.from(i10, (e11) => l2.setUint8(u2++, e11.charCodeAt(0))), Array.from(n10, (e11) => l2.setUint8(u2++, e11.charCodeAt(0)));
          var c2 = new Uint8Array(o2.byteLength + s2.byteLength);
          return c2.set(new Uint8Array(o2), 0), c2.set(new Uint8Array(s2), o2.byteLength), c2.buffer;
        }
        _binaryEncodeUserBroadcastPush(e10) {
          var t10;
          return this._isArrayBuffer(null == (t10 = e10.payload) ? void 0 : t10.payload) ? this._encodeBinaryUserBroadcastPush(e10) : this._encodeJsonUserBroadcastPush(e10);
        }
        _encodeBinaryUserBroadcastPush(e10) {
          let { join_ref: t10, ref: r10, topic: n10 } = e10, i10 = e10.payload.event, s2 = null != (h2 = null == (c2 = e10.payload) ? void 0 : c2.payload) ? h2 : new ArrayBuffer(0), a2 = this.USER_BROADCAST_PUSH_META_LENGTH + t10.length + r10.length + n10.length + i10.length, o2 = new ArrayBuffer(this.HEADER_LENGTH + a2), l2 = new DataView(o2), u2 = 0;
          l2.setUint8(u2++, this.KINDS.userBroadcastPush), l2.setUint8(u2++, t10.length), l2.setUint8(u2++, r10.length), l2.setUint8(u2++, n10.length), l2.setUint8(u2++, i10.length), l2.setUint8(u2++, this.BINARY_ENCODING), Array.from(t10, (e11) => l2.setUint8(u2++, e11.charCodeAt(0))), Array.from(r10, (e11) => l2.setUint8(u2++, e11.charCodeAt(0))), Array.from(n10, (e11) => l2.setUint8(u2++, e11.charCodeAt(0))), Array.from(i10, (e11) => l2.setUint8(u2++, e11.charCodeAt(0)));
          var c2, h2, d2 = new Uint8Array(o2.byteLength + s2.byteLength);
          return d2.set(new Uint8Array(o2), 0), d2.set(new Uint8Array(s2), o2.byteLength), d2.buffer;
        }
        _encodeJsonUserBroadcastPush(e10) {
          let { join_ref: t10, ref: r10, topic: n10 } = e10, i10 = e10.payload.event, s2 = null != (d2 = null == (h2 = e10.payload) ? void 0 : h2.payload) ? d2 : {}, a2 = new TextEncoder().encode(JSON.stringify(s2)).buffer, o2 = this.USER_BROADCAST_PUSH_META_LENGTH + t10.length + r10.length + n10.length + i10.length, l2 = new ArrayBuffer(this.HEADER_LENGTH + o2), u2 = new DataView(l2), c2 = 0;
          u2.setUint8(c2++, this.KINDS.userBroadcastPush), u2.setUint8(c2++, t10.length), u2.setUint8(c2++, r10.length), u2.setUint8(c2++, n10.length), u2.setUint8(c2++, i10.length), u2.setUint8(c2++, this.JSON_ENCODING), Array.from(t10, (e11) => u2.setUint8(c2++, e11.charCodeAt(0))), Array.from(r10, (e11) => u2.setUint8(c2++, e11.charCodeAt(0))), Array.from(n10, (e11) => u2.setUint8(c2++, e11.charCodeAt(0))), Array.from(i10, (e11) => u2.setUint8(c2++, e11.charCodeAt(0)));
          var h2, d2, f2 = new Uint8Array(l2.byteLength + a2.byteLength);
          return f2.set(new Uint8Array(l2), 0), f2.set(new Uint8Array(a2), l2.byteLength), f2.buffer;
        }
        decode(e10, t10) {
          if (this._isArrayBuffer(e10)) return t10(this._binaryDecode(e10));
          if ("string" == typeof e10) {
            let [r10, n10, i10, s2, a2] = JSON.parse(e10);
            return t10({ join_ref: r10, ref: n10, topic: i10, event: s2, payload: a2 });
          }
          return t10({});
        }
        _binaryDecode(e10) {
          let t10 = new DataView(e10), r10 = t10.getUint8(0), n10 = new TextDecoder();
          switch (r10) {
            case this.KINDS.push:
              return this._decodePush(e10, t10, n10);
            case this.KINDS.reply:
              return this._decodeReply(e10, t10, n10);
            case this.KINDS.broadcast:
              return this._decodeBroadcast(e10, t10, n10);
            case this.KINDS.userBroadcast:
              return this._decodeUserBroadcast(e10, t10, n10);
          }
        }
        _decodePush(e10, t10, r10) {
          let n10 = t10.getUint8(1), i10 = t10.getUint8(2), s2 = t10.getUint8(3), a2 = this.HEADER_LENGTH + this.META_LENGTH - 1, o2 = r10.decode(e10.slice(a2, a2 + n10));
          a2 += n10;
          let l2 = r10.decode(e10.slice(a2, a2 + i10));
          a2 += i10;
          let u2 = r10.decode(e10.slice(a2, a2 + s2));
          return a2 += s2, { join_ref: o2, ref: null, topic: l2, event: u2, payload: JSON.parse(r10.decode(e10.slice(a2, e10.byteLength))) };
        }
        _decodeReply(e10, t10, r10) {
          let n10 = t10.getUint8(1), i10 = t10.getUint8(2), s2 = t10.getUint8(3), a2 = t10.getUint8(4), o2 = this.HEADER_LENGTH + this.META_LENGTH, l2 = r10.decode(e10.slice(o2, o2 + n10));
          o2 += n10;
          let u2 = r10.decode(e10.slice(o2, o2 + i10));
          o2 += i10;
          let c2 = r10.decode(e10.slice(o2, o2 + s2));
          o2 += s2;
          let h2 = r10.decode(e10.slice(o2, o2 + a2));
          o2 += a2;
          let d2 = JSON.parse(r10.decode(e10.slice(o2, e10.byteLength)));
          return { join_ref: l2, ref: u2, topic: c2, event: ep.reply, payload: { status: h2, response: d2 } };
        }
        _decodeBroadcast(e10, t10, r10) {
          let n10 = t10.getUint8(1), i10 = t10.getUint8(2), s2 = this.HEADER_LENGTH + 2, a2 = r10.decode(e10.slice(s2, s2 + n10));
          s2 += n10;
          let o2 = r10.decode(e10.slice(s2, s2 + i10));
          return s2 += i10, { join_ref: null, ref: null, topic: a2, event: o2, payload: JSON.parse(r10.decode(e10.slice(s2, e10.byteLength))) };
        }
        _decodeUserBroadcast(e10, t10, r10) {
          let n10 = t10.getUint8(1), i10 = t10.getUint8(2), s2 = t10.getUint8(3), a2 = t10.getUint8(4), o2 = this.HEADER_LENGTH + 4, l2 = r10.decode(e10.slice(o2, o2 + n10));
          o2 += n10;
          let u2 = r10.decode(e10.slice(o2, o2 + i10));
          o2 += i10;
          let c2 = r10.decode(e10.slice(o2, o2 + s2));
          o2 += s2;
          let h2 = e10.slice(o2, e10.byteLength), d2 = a2 === this.JSON_ENCODING ? JSON.parse(r10.decode(h2)) : h2, f2 = { type: this.BROADCAST, event: u2, payload: d2 };
          return s2 > 0 && (f2.meta = JSON.parse(c2)), { join_ref: null, ref: null, topic: l2, event: this.BROADCAST, payload: f2 };
        }
        _isArrayBuffer(e10) {
          var t10;
          return e10 instanceof ArrayBuffer || (null == (t10 = null == e10 ? void 0 : e10.constructor) ? void 0 : t10.name) === "ArrayBuffer";
        }
      }
      class rB {
        constructor(e10, t10) {
          this.callback = e10, this.timerCalc = t10, this.timer = void 0, this.tries = 0, this.callback = e10, this.timerCalc = t10;
        }
        reset() {
          this.tries = 0, clearTimeout(this.timer), this.timer = void 0;
        }
        scheduleTimeout() {
          clearTimeout(this.timer), this.timer = setTimeout(() => {
            this.tries = this.tries + 1, this.callback();
          }, this.timerCalc(this.tries + 1));
        }
      }
      (ei = ev || (ev = {})).abstime = "abstime", ei.bool = "bool", ei.date = "date", ei.daterange = "daterange", ei.float4 = "float4", ei.float8 = "float8", ei.int2 = "int2", ei.int4 = "int4", ei.int4range = "int4range", ei.int8 = "int8", ei.int8range = "int8range", ei.json = "json", ei.jsonb = "jsonb", ei.money = "money", ei.numeric = "numeric", ei.oid = "oid", ei.reltime = "reltime", ei.text = "text", ei.time = "time", ei.timestamp = "timestamp", ei.timestamptz = "timestamptz", ei.timetz = "timetz", ei.tsrange = "tsrange", ei.tstzrange = "tstzrange";
      let rq = (e10, t10, r10 = {}) => {
        var n10;
        let i10 = null != (n10 = r10.skipTypes) ? n10 : [];
        return t10 ? Object.keys(t10).reduce((r11, n11) => (r11[n11] = rH(n11, e10, t10, i10), r11), {}) : {};
      }, rH = (e10, t10, r10, n10) => {
        let i10 = t10.find((t11) => t11.name === e10), s2 = null == i10 ? void 0 : i10.type, a2 = r10[e10];
        return s2 && !n10.includes(s2) ? rV(s2, a2) : rF(a2);
      }, rV = (e10, t10) => {
        if ("_" === e10.charAt(0)) return rK(t10, e10.slice(1, e10.length));
        switch (e10) {
          case ev.bool:
            return rG(t10);
          case ev.float4:
          case ev.float8:
          case ev.int2:
          case ev.int4:
          case ev.int8:
          case ev.numeric:
          case ev.oid:
            return rW(t10);
          case ev.json:
          case ev.jsonb:
            return rz(t10);
          case ev.timestamp:
            return rJ(t10);
          case ev.abstime:
          case ev.date:
          case ev.daterange:
          case ev.int4range:
          case ev.int8range:
          case ev.money:
          case ev.reltime:
          case ev.text:
          case ev.time:
          case ev.timestamptz:
          case ev.timetz:
          case ev.tsrange:
          case ev.tstzrange:
          default:
            return rF(t10);
        }
      }, rF = (e10) => e10, rG = (e10) => {
        switch (e10) {
          case "t":
            return true;
          case "f":
            return false;
          default:
            return e10;
        }
      }, rW = (e10) => {
        if ("string" == typeof e10) {
          let t10 = parseFloat(e10);
          if (!Number.isNaN(t10)) return t10;
        }
        return e10;
      }, rz = (e10) => {
        if ("string" == typeof e10) try {
          return JSON.parse(e10);
        } catch (e11) {
          console.log(`JSON parse error: ${e11}`);
        }
        return e10;
      }, rK = (e10, t10) => {
        if ("string" != typeof e10) return e10;
        let r10 = e10.length - 1, n10 = e10[r10];
        if ("{" === e10[0] && "}" === n10) {
          let n11, i10 = e10.slice(1, r10);
          try {
            n11 = JSON.parse("[" + i10 + "]");
          } catch (e11) {
            n11 = i10 ? i10.split(",") : [];
          }
          return n11.map((e11) => rV(t10, e11));
        }
        return e10;
      }, rJ = (e10) => "string" == typeof e10 ? e10.replace(" ", "T") : e10, rX = (e10) => {
        let t10 = new URL(e10);
        return t10.protocol = t10.protocol.replace(/^ws/i, "http"), t10.pathname = t10.pathname.replace(/\/+$/, "").replace(/\/socket\/websocket$/i, "").replace(/\/socket$/i, "").replace(/\/websocket$/i, ""), "" === t10.pathname || "/" === t10.pathname ? t10.pathname = "/api/broadcast" : t10.pathname = t10.pathname + "/api/broadcast", t10.href;
      };
      class rY {
        constructor(e10, t10, r10 = {}, n10 = 1e4) {
          this.channel = e10, this.event = t10, this.payload = r10, this.timeout = n10, this.sent = false, this.timeoutTimer = void 0, this.ref = "", this.receivedResp = null, this.recHooks = [], this.refEvent = null;
        }
        resend(e10) {
          this.timeout = e10, this._cancelRefEvent(), this.ref = "", this.refEvent = null, this.receivedResp = null, this.sent = false, this.send();
        }
        send() {
          this._hasReceived("timeout") || (this.startTimeout(), this.sent = true, this.channel.socket.push({ topic: this.channel.topic, event: this.event, payload: this.payload, ref: this.ref, join_ref: this.channel._joinRef() }));
        }
        updatePayload(e10) {
          this.payload = Object.assign(Object.assign({}, this.payload), e10);
        }
        receive(e10, t10) {
          var r10;
          return this._hasReceived(e10) && t10(null == (r10 = this.receivedResp) ? void 0 : r10.response), this.recHooks.push({ status: e10, callback: t10 }), this;
        }
        startTimeout() {
          if (this.timeoutTimer) return;
          this.ref = this.channel.socket._makeRef(), this.refEvent = this.channel._replyEventName(this.ref);
          let e10 = (e11) => {
            this._cancelRefEvent(), this._cancelTimeout(), this.receivedResp = e11, this._matchReceive(e11);
          };
          this.channel._on(this.refEvent, {}, e10), this.timeoutTimer = setTimeout(() => {
            this.trigger("timeout", {});
          }, this.timeout);
        }
        trigger(e10, t10) {
          this.refEvent && this.channel._trigger(this.refEvent, { status: e10, response: t10 });
        }
        destroy() {
          this._cancelRefEvent(), this._cancelTimeout();
        }
        _cancelRefEvent() {
          this.refEvent && this.channel._off(this.refEvent, {});
        }
        _cancelTimeout() {
          clearTimeout(this.timeoutTimer), this.timeoutTimer = void 0;
        }
        _matchReceive({ status: e10, response: t10 }) {
          this.recHooks.filter((t11) => t11.status === e10).forEach((e11) => e11.callback(t10));
        }
        _hasReceived(e10) {
          return this.receivedResp && this.receivedResp.status === e10;
        }
      }
      (es = eb || (eb = {})).SYNC = "sync", es.JOIN = "join", es.LEAVE = "leave";
      class rQ {
        constructor(e10, t10) {
          this.channel = e10, this.state = {}, this.pendingDiffs = [], this.joinRef = null, this.enabled = false, this.caller = { onJoin: () => {
          }, onLeave: () => {
          }, onSync: () => {
          } };
          const r10 = (null == t10 ? void 0 : t10.events) || { state: "presence_state", diff: "presence_diff" };
          this.channel._on(r10.state, {}, (e11) => {
            let { onJoin: t11, onLeave: r11, onSync: n10 } = this.caller;
            this.joinRef = this.channel._joinRef(), this.state = rQ.syncState(this.state, e11, t11, r11), this.pendingDiffs.forEach((e12) => {
              this.state = rQ.syncDiff(this.state, e12, t11, r11);
            }), this.pendingDiffs = [], n10();
          }), this.channel._on(r10.diff, {}, (e11) => {
            let { onJoin: t11, onLeave: r11, onSync: n10 } = this.caller;
            this.inPendingSyncState() ? this.pendingDiffs.push(e11) : (this.state = rQ.syncDiff(this.state, e11, t11, r11), n10());
          }), this.onJoin((e11, t11, r11) => {
            this.channel._trigger("presence", { event: "join", key: e11, currentPresences: t11, newPresences: r11 });
          }), this.onLeave((e11, t11, r11) => {
            this.channel._trigger("presence", { event: "leave", key: e11, currentPresences: t11, leftPresences: r11 });
          }), this.onSync(() => {
            this.channel._trigger("presence", { event: "sync" });
          });
        }
        static syncState(e10, t10, r10, n10) {
          let i10 = this.cloneDeep(e10), s2 = this.transformState(t10), a2 = {}, o2 = {};
          return this.map(i10, (e11, t11) => {
            s2[e11] || (o2[e11] = t11);
          }), this.map(s2, (e11, t11) => {
            let r11 = i10[e11];
            if (r11) {
              let n11 = t11.map((e12) => e12.presence_ref), i11 = r11.map((e12) => e12.presence_ref), s3 = t11.filter((e12) => 0 > i11.indexOf(e12.presence_ref)), l2 = r11.filter((e12) => 0 > n11.indexOf(e12.presence_ref));
              s3.length > 0 && (a2[e11] = s3), l2.length > 0 && (o2[e11] = l2);
            } else a2[e11] = t11;
          }), this.syncDiff(i10, { joins: a2, leaves: o2 }, r10, n10);
        }
        static syncDiff(e10, t10, r10, n10) {
          let { joins: i10, leaves: s2 } = { joins: this.transformState(t10.joins), leaves: this.transformState(t10.leaves) };
          return r10 || (r10 = () => {
          }), n10 || (n10 = () => {
          }), this.map(i10, (t11, n11) => {
            var i11;
            let s3 = null != (i11 = e10[t11]) ? i11 : [];
            if (e10[t11] = this.cloneDeep(n11), s3.length > 0) {
              let r11 = e10[t11].map((e11) => e11.presence_ref), n12 = s3.filter((e11) => 0 > r11.indexOf(e11.presence_ref));
              e10[t11].unshift(...n12);
            }
            r10(t11, s3, n11);
          }), this.map(s2, (t11, r11) => {
            let i11 = e10[t11];
            if (!i11) return;
            let s3 = r11.map((e11) => e11.presence_ref);
            i11 = i11.filter((e11) => 0 > s3.indexOf(e11.presence_ref)), e10[t11] = i11, n10(t11, i11, r11), 0 === i11.length && delete e10[t11];
          }), e10;
        }
        static map(e10, t10) {
          return Object.getOwnPropertyNames(e10).map((r10) => t10(r10, e10[r10]));
        }
        static transformState(e10) {
          return Object.getOwnPropertyNames(e10 = this.cloneDeep(e10)).reduce((t10, r10) => {
            let n10 = e10[r10];
            return "metas" in n10 ? t10[r10] = n10.metas.map((e11) => (e11.presence_ref = e11.phx_ref, delete e11.phx_ref, delete e11.phx_ref_prev, e11)) : t10[r10] = n10, t10;
          }, {});
        }
        static cloneDeep(e10) {
          return JSON.parse(JSON.stringify(e10));
        }
        onJoin(e10) {
          this.caller.onJoin = e10;
        }
        onLeave(e10) {
          this.caller.onLeave = e10;
        }
        onSync(e10) {
          this.caller.onSync = e10;
        }
        inPendingSyncState() {
          return !this.joinRef || this.joinRef !== this.channel._joinRef();
        }
      }
      (ea = ey || (ey = {})).ALL = "*", ea.INSERT = "INSERT", ea.UPDATE = "UPDATE", ea.DELETE = "DELETE", (eo = e_ || (e_ = {})).BROADCAST = "broadcast", eo.PRESENCE = "presence", eo.POSTGRES_CHANGES = "postgres_changes", eo.SYSTEM = "system", (el = ew || (ew = {})).SUBSCRIBED = "SUBSCRIBED", el.TIMED_OUT = "TIMED_OUT", el.CLOSED = "CLOSED", el.CHANNEL_ERROR = "CHANNEL_ERROR";
      class rZ {
        constructor(e10, t10 = { config: {} }, r10) {
          var n10, i10;
          if (this.topic = e10, this.params = t10, this.socket = r10, this.bindings = {}, this.state = ef.closed, this.joinedOnce = false, this.pushBuffer = [], this.subTopic = e10.replace(/^realtime:/i, ""), this.params.config = Object.assign({ broadcast: { ack: false, self: false }, presence: { key: "", enabled: false }, private: false }, t10.config), this.timeout = this.socket.timeout, this.joinPush = new rY(this, ep.join, this.params, this.timeout), this.rejoinTimer = new rB(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs), this.joinPush.receive("ok", () => {
            this.state = ef.joined, this.rejoinTimer.reset(), this.pushBuffer.forEach((e11) => e11.send()), this.pushBuffer = [];
          }), this._onClose(() => {
            this.rejoinTimer.reset(), this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`), this.state = ef.closed, this.socket._remove(this);
          }), this._onError((e11) => {
            this._isLeaving() || this._isClosed() || (this.socket.log("channel", `error ${this.topic}`, e11), this.state = ef.errored, this.rejoinTimer.scheduleTimeout());
          }), this.joinPush.receive("timeout", () => {
            this._isJoining() && (this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout), this.state = ef.errored, this.rejoinTimer.scheduleTimeout());
          }), this.joinPush.receive("error", (e11) => {
            this._isLeaving() || this._isClosed() || (this.socket.log("channel", `error ${this.topic}`, e11), this.state = ef.errored, this.rejoinTimer.scheduleTimeout());
          }), this._on(ep.reply, {}, (e11, t11) => {
            this._trigger(this._replyEventName(t11), e11);
          }), this.presence = new rQ(this), this.broadcastEndpointURL = rX(this.socket.endPoint), this.private = this.params.config.private || false, !this.private && (null == (i10 = null == (n10 = this.params.config) ? void 0 : n10.broadcast) ? void 0 : i10.replay)) throw `tried to use replay on public channel '${this.topic}'. It must be a private channel.`;
        }
        subscribe(e10, t10 = this.timeout) {
          var r10, n10, i10;
          if (this.socket.isConnected() || this.socket.connect(), this.state == ef.closed) {
            let { config: { broadcast: s2, presence: a2, private: o2 } } = this.params, l2 = null != (n10 = null == (r10 = this.bindings.postgres_changes) ? void 0 : r10.map((e11) => e11.filter)) ? n10 : [], u2 = !!this.bindings[e_.PRESENCE] && this.bindings[e_.PRESENCE].length > 0 || (null == (i10 = this.params.config.presence) ? void 0 : i10.enabled) === true, c2 = {}, h2 = { broadcast: s2, presence: Object.assign(Object.assign({}, a2), { enabled: u2 }), postgres_changes: l2, private: o2 };
            this.socket.accessTokenValue && (c2.access_token = this.socket.accessTokenValue), this._onError((t11) => null == e10 ? void 0 : e10(ew.CHANNEL_ERROR, t11)), this._onClose(() => null == e10 ? void 0 : e10(ew.CLOSED)), this.updateJoinPayload(Object.assign({ config: h2 }, c2)), this.joinedOnce = true, this._rejoin(t10), this.joinPush.receive("ok", async ({ postgres_changes: t11 }) => {
              var r11;
              if (this.socket.setAuth(), void 0 === t11) {
                null == e10 || e10(ew.SUBSCRIBED);
                return;
              }
              {
                let n11 = this.bindings.postgres_changes, i11 = null != (r11 = null == n11 ? void 0 : n11.length) ? r11 : 0, s3 = [];
                for (let r12 = 0; r12 < i11; r12++) {
                  let i12 = n11[r12], { filter: { event: a3, schema: o3, table: l3, filter: u3 } } = i12, c3 = t11 && t11[r12];
                  if (c3 && c3.event === a3 && c3.schema === o3 && c3.table === l3 && c3.filter === u3) s3.push(Object.assign(Object.assign({}, i12), { id: c3.id }));
                  else {
                    this.unsubscribe(), this.state = ef.errored, null == e10 || e10(ew.CHANNEL_ERROR, Error("mismatch between server and client bindings for postgres changes"));
                    return;
                  }
                }
                this.bindings.postgres_changes = s3, e10 && e10(ew.SUBSCRIBED);
                return;
              }
            }).receive("error", (t11) => {
              this.state = ef.errored, null == e10 || e10(ew.CHANNEL_ERROR, Error(JSON.stringify(Object.values(t11).join(", ") || "error")));
            }).receive("timeout", () => {
              null == e10 || e10(ew.TIMED_OUT);
            });
          }
          return this;
        }
        presenceState() {
          return this.presence.state;
        }
        async track(e10, t10 = {}) {
          return await this.send({ type: "presence", event: "track", payload: e10 }, t10.timeout || this.timeout);
        }
        async untrack(e10 = {}) {
          return await this.send({ type: "presence", event: "untrack" }, e10);
        }
        on(e10, t10, r10) {
          return this.state === ef.joined && e10 === e_.PRESENCE && (this.socket.log("channel", `resubscribe to ${this.topic} due to change in presence callbacks on joined channel`), this.unsubscribe().then(() => this.subscribe())), this._on(e10, t10, r10);
        }
        async httpSend(e10, t10, r10 = {}) {
          var n10;
          let i10 = this.socket.accessTokenValue ? `Bearer ${this.socket.accessTokenValue}` : "";
          if (null == t10) return Promise.reject("Payload is required for httpSend()");
          let s2 = { method: "POST", headers: { Authorization: i10, apikey: this.socket.apiKey ? this.socket.apiKey : "", "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ topic: this.subTopic, event: e10, payload: t10, private: this.private }] }) }, a2 = await this._fetchWithTimeout(this.broadcastEndpointURL, s2, null != (n10 = r10.timeout) ? n10 : this.timeout);
          if (202 === a2.status) return { success: true };
          let o2 = a2.statusText;
          try {
            let e11 = await a2.json();
            o2 = e11.error || e11.message || o2;
          } catch (e11) {
          }
          return Promise.reject(Error(o2));
        }
        async send(e10, t10 = {}) {
          var r10, n10;
          if (this._canPush() || "broadcast" !== e10.type) return new Promise((r11) => {
            var n11, i10, s2;
            let a2 = this._push(e10.type, e10, t10.timeout || this.timeout);
            "broadcast" !== e10.type || (null == (s2 = null == (i10 = null == (n11 = this.params) ? void 0 : n11.config) ? void 0 : i10.broadcast) ? void 0 : s2.ack) || r11("ok"), a2.receive("ok", () => r11("ok")), a2.receive("error", () => r11("error")), a2.receive("timeout", () => r11("timed out"));
          });
          {
            console.warn("Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.");
            let { event: i10, payload: s2 } = e10, a2 = { method: "POST", headers: { Authorization: this.socket.accessTokenValue ? `Bearer ${this.socket.accessTokenValue}` : "", apikey: this.socket.apiKey ? this.socket.apiKey : "", "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ topic: this.subTopic, event: i10, payload: s2, private: this.private }] }) };
            try {
              let e11 = await this._fetchWithTimeout(this.broadcastEndpointURL, a2, null != (r10 = t10.timeout) ? r10 : this.timeout);
              return await (null == (n10 = e11.body) ? void 0 : n10.cancel()), e11.ok ? "ok" : "error";
            } catch (e11) {
              if ("AbortError" === e11.name) return "timed out";
              return "error";
            }
          }
        }
        updateJoinPayload(e10) {
          this.joinPush.updatePayload(e10);
        }
        unsubscribe(e10 = this.timeout) {
          this.state = ef.leaving;
          let t10 = () => {
            this.socket.log("channel", `leave ${this.topic}`), this._trigger(ep.close, "leave", this._joinRef());
          };
          this.joinPush.destroy();
          let r10 = null;
          return new Promise((n10) => {
            (r10 = new rY(this, ep.leave, {}, e10)).receive("ok", () => {
              t10(), n10("ok");
            }).receive("timeout", () => {
              t10(), n10("timed out");
            }).receive("error", () => {
              n10("error");
            }), r10.send(), this._canPush() || r10.trigger("ok", {});
          }).finally(() => {
            null == r10 || r10.destroy();
          });
        }
        teardown() {
          this.pushBuffer.forEach((e10) => e10.destroy()), this.pushBuffer = [], this.rejoinTimer.reset(), this.joinPush.destroy(), this.state = ef.closed, this.bindings = {};
        }
        async _fetchWithTimeout(e10, t10, r10) {
          let n10 = new AbortController(), i10 = setTimeout(() => n10.abort(), r10), s2 = await this.socket.fetch(e10, Object.assign(Object.assign({}, t10), { signal: n10.signal }));
          return clearTimeout(i10), s2;
        }
        _push(e10, t10, r10 = this.timeout) {
          if (!this.joinedOnce) throw `tried to push '${e10}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
          let n10 = new rY(this, e10, t10, r10);
          return this._canPush() ? n10.send() : this._addToPushBuffer(n10), n10;
        }
        _addToPushBuffer(e10) {
          if (e10.startTimeout(), this.pushBuffer.push(e10), this.pushBuffer.length > 100) {
            let e11 = this.pushBuffer.shift();
            e11 && (e11.destroy(), this.socket.log("channel", `discarded push due to buffer overflow: ${e11.event}`, e11.payload));
          }
        }
        _onMessage(e10, t10, r10) {
          return t10;
        }
        _isMember(e10) {
          return this.topic === e10;
        }
        _joinRef() {
          return this.joinPush.ref;
        }
        _trigger(e10, t10, r10) {
          var n10, i10;
          let s2 = e10.toLocaleLowerCase(), { close: a2, error: o2, leave: l2, join: u2 } = ep;
          if (r10 && [a2, o2, l2, u2].indexOf(s2) >= 0 && r10 !== this._joinRef()) return;
          let c2 = this._onMessage(s2, t10, r10);
          if (t10 && !c2) throw "channel onMessage callbacks must return the payload, modified or unmodified";
          ["insert", "update", "delete"].includes(s2) ? null == (n10 = this.bindings.postgres_changes) || n10.filter((e11) => {
            var t11, r11, n11;
            return (null == (t11 = e11.filter) ? void 0 : t11.event) === "*" || (null == (n11 = null == (r11 = e11.filter) ? void 0 : r11.event) ? void 0 : n11.toLocaleLowerCase()) === s2;
          }).map((e11) => e11.callback(c2, r10)) : null == (i10 = this.bindings[s2]) || i10.filter((e11) => {
            var r11, n11, i11, a3, o3, l3;
            if (!["broadcast", "presence", "postgres_changes"].includes(s2)) return e11.type.toLocaleLowerCase() === s2;
            if ("id" in e11) {
              let s3 = e11.id, a4 = null == (r11 = e11.filter) ? void 0 : r11.event;
              return s3 && (null == (n11 = t10.ids) ? void 0 : n11.includes(s3)) && ("*" === a4 || (null == a4 ? void 0 : a4.toLocaleLowerCase()) === (null == (i11 = t10.data) ? void 0 : i11.type.toLocaleLowerCase()));
            }
            {
              let r12 = null == (o3 = null == (a3 = null == e11 ? void 0 : e11.filter) ? void 0 : a3.event) ? void 0 : o3.toLocaleLowerCase();
              return "*" === r12 || r12 === (null == (l3 = null == t10 ? void 0 : t10.event) ? void 0 : l3.toLocaleLowerCase());
            }
          }).map((e11) => {
            if ("object" == typeof c2 && "ids" in c2) {
              let e12 = c2.data, { schema: t11, table: r11, commit_timestamp: n11, type: i11, errors: s3 } = e12;
              c2 = Object.assign(Object.assign({}, { schema: t11, table: r11, commit_timestamp: n11, eventType: i11, new: {}, old: {}, errors: s3 }), this._getPayloadRecords(e12));
            }
            e11.callback(c2, r10);
          });
        }
        _isClosed() {
          return this.state === ef.closed;
        }
        _isJoined() {
          return this.state === ef.joined;
        }
        _isJoining() {
          return this.state === ef.joining;
        }
        _isLeaving() {
          return this.state === ef.leaving;
        }
        _replyEventName(e10) {
          return `chan_reply_${e10}`;
        }
        _on(e10, t10, r10) {
          let n10 = e10.toLocaleLowerCase(), i10 = { type: n10, filter: t10, callback: r10 };
          return this.bindings[n10] ? this.bindings[n10].push(i10) : this.bindings[n10] = [i10], this;
        }
        _off(e10, t10) {
          let r10 = e10.toLocaleLowerCase();
          return this.bindings[r10] && (this.bindings[r10] = this.bindings[r10].filter((e11) => {
            var n10;
            return !((null == (n10 = e11.type) ? void 0 : n10.toLocaleLowerCase()) === r10 && rZ.isEqual(e11.filter, t10));
          })), this;
        }
        static isEqual(e10, t10) {
          if (Object.keys(e10).length !== Object.keys(t10).length) return false;
          for (let r10 in e10) if (e10[r10] !== t10[r10]) return false;
          return true;
        }
        _rejoinUntilConnected() {
          this.rejoinTimer.scheduleTimeout(), this.socket.isConnected() && this._rejoin();
        }
        _onClose(e10) {
          this._on(ep.close, {}, e10);
        }
        _onError(e10) {
          this._on(ep.error, {}, (t10) => e10(t10));
        }
        _canPush() {
          return this.socket.isConnected() && this._isJoined();
        }
        _rejoin(e10 = this.timeout) {
          this._isLeaving() || (this.socket._leaveOpenTopic(this.topic), this.state = ef.joining, this.joinPush.resend(e10));
        }
        _getPayloadRecords(e10) {
          let t10 = { new: {}, old: {} };
          return ("INSERT" === e10.type || "UPDATE" === e10.type) && (t10.new = rq(e10.columns, e10.record)), ("UPDATE" === e10.type || "DELETE" === e10.type) && (t10.old = rq(e10.columns, e10.old_record)), t10;
        }
      }
      let r0 = () => {
      }, r1 = [1e3, 2e3, 5e3, 1e4], r2 = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
      class r4 {
        constructor(e10, t10) {
          var r10;
          if (this.accessTokenValue = null, this.apiKey = null, this.channels = [], this.endPoint = "", this.httpEndpoint = "", this.headers = {}, this.params = {}, this.timeout = 1e4, this.transport = null, this.heartbeatIntervalMs = 25e3, this.heartbeatTimer = void 0, this.pendingHeartbeatRef = null, this.heartbeatCallback = r0, this.ref = 0, this.reconnectTimer = null, this.vsn = rL, this.logger = r0, this.conn = null, this.sendBuffer = [], this.serializer = new rM(), this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] }, this.accessToken = null, this._connectionState = "disconnected", this._wasManualDisconnect = false, this._authPromise = null, this._resolveFetch = (e11) => e11 ? (...t11) => e11(...t11) : (...e12) => fetch(...e12), !(null == (r10 = null == t10 ? void 0 : t10.params) ? void 0 : r10.apikey)) throw Error("API key is required to connect to Realtime");
          this.apiKey = t10.params.apikey, this.endPoint = `${e10}/${eg.websocket}`, this.httpEndpoint = rX(e10), this._initializeOptions(t10), this._setupReconnectionTimer(), this.fetch = this._resolveFetch(null == t10 ? void 0 : t10.fetch);
        }
        connect() {
          if (!(this.isConnecting() || this.isDisconnecting() || null !== this.conn && this.isConnected())) {
            if (this._setConnectionState("connecting"), this.accessToken && !this._authPromise && this._setAuthSafely("connect"), this.transport) this.conn = new this.transport(this.endpointURL());
            else try {
              this.conn = rU.createWebSocket(this.endpointURL());
            } catch (t10) {
              this._setConnectionState("disconnected");
              let e10 = t10.message;
              if (e10.includes("Node.js")) throw Error(`${e10}

To use Realtime in Node.js, you need to provide a WebSocket implementation:

Option 1: Use Node.js 22+ which has native WebSocket support
Option 2: Install and provide the "ws" package:

  npm install ws

  import ws from "ws"
  const client = new RealtimeClient(url, {
    ...options,
    transport: ws
  })`);
              throw Error(`WebSocket not available: ${e10}`);
            }
            this._setupConnectionHandlers();
          }
        }
        endpointURL() {
          return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: this.vsn }));
        }
        disconnect(e10, t10) {
          if (!this.isDisconnecting()) if (this._setConnectionState("disconnecting", true), this.conn) {
            let r10 = setTimeout(() => {
              this._setConnectionState("disconnected");
            }, 100);
            this.conn.onclose = () => {
              clearTimeout(r10), this._setConnectionState("disconnected");
            }, "function" == typeof this.conn.close && (e10 ? this.conn.close(e10, null != t10 ? t10 : "") : this.conn.close()), this._teardownConnection();
          } else this._setConnectionState("disconnected");
        }
        getChannels() {
          return this.channels;
        }
        async removeChannel(e10) {
          let t10 = await e10.unsubscribe();
          return 0 === this.channels.length && this.disconnect(), t10;
        }
        async removeAllChannels() {
          let e10 = await Promise.all(this.channels.map((e11) => e11.unsubscribe()));
          return this.channels = [], this.disconnect(), e10;
        }
        log(e10, t10, r10) {
          this.logger(e10, t10, r10);
        }
        connectionState() {
          switch (this.conn && this.conn.readyState) {
            case ed.connecting:
              return em.Connecting;
            case ed.open:
              return em.Open;
            case ed.closing:
              return em.Closing;
            default:
              return em.Closed;
          }
        }
        isConnected() {
          return this.connectionState() === em.Open;
        }
        isConnecting() {
          return "connecting" === this._connectionState;
        }
        isDisconnecting() {
          return "disconnecting" === this._connectionState;
        }
        channel(e10, t10 = { config: {} }) {
          let r10 = `realtime:${e10}`, n10 = this.getChannels().find((e11) => e11.topic === r10);
          if (n10) return n10;
          {
            let r11 = new rZ(`realtime:${e10}`, t10, this);
            return this.channels.push(r11), r11;
          }
        }
        push(e10) {
          let { topic: t10, event: r10, payload: n10, ref: i10 } = e10, s2 = () => {
            this.encode(e10, (e11) => {
              var t11;
              null == (t11 = this.conn) || t11.send(e11);
            });
          };
          this.log("push", `${t10} ${r10} (${i10})`, n10), this.isConnected() ? s2() : this.sendBuffer.push(s2);
        }
        async setAuth(e10 = null) {
          this._authPromise = this._performAuth(e10);
          try {
            await this._authPromise;
          } finally {
            this._authPromise = null;
          }
        }
        async sendHeartbeat() {
          var e10;
          if (!this.isConnected()) {
            try {
              this.heartbeatCallback("disconnected");
            } catch (e11) {
              this.log("error", "error in heartbeat callback", e11);
            }
            return;
          }
          if (this.pendingHeartbeatRef) {
            this.pendingHeartbeatRef = null, this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
            try {
              this.heartbeatCallback("timeout");
            } catch (e11) {
              this.log("error", "error in heartbeat callback", e11);
            }
            this._wasManualDisconnect = false, null == (e10 = this.conn) || e10.close(1e3, "heartbeat timeout"), setTimeout(() => {
              var e11;
              this.isConnected() || null == (e11 = this.reconnectTimer) || e11.scheduleTimeout();
            }, 100);
            return;
          }
          this.pendingHeartbeatRef = this._makeRef(), this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
          try {
            this.heartbeatCallback("sent");
          } catch (e11) {
            this.log("error", "error in heartbeat callback", e11);
          }
          this._setAuthSafely("heartbeat");
        }
        onHeartbeat(e10) {
          this.heartbeatCallback = e10;
        }
        flushSendBuffer() {
          this.isConnected() && this.sendBuffer.length > 0 && (this.sendBuffer.forEach((e10) => e10()), this.sendBuffer = []);
        }
        _makeRef() {
          let e10 = this.ref + 1;
          return e10 === this.ref ? this.ref = 0 : this.ref = e10, this.ref.toString();
        }
        _leaveOpenTopic(e10) {
          let t10 = this.channels.find((t11) => t11.topic === e10 && (t11._isJoined() || t11._isJoining()));
          t10 && (this.log("transport", `leaving duplicate topic "${e10}"`), t10.unsubscribe());
        }
        _remove(e10) {
          this.channels = this.channels.filter((t10) => t10.topic !== e10.topic);
        }
        _onConnMessage(e10) {
          this.decode(e10.data, (e11) => {
            if ("phoenix" === e11.topic && "phx_reply" === e11.event) try {
              this.heartbeatCallback("ok" === e11.payload.status ? "ok" : "error");
            } catch (e12) {
              this.log("error", "error in heartbeat callback", e12);
            }
            e11.ref && e11.ref === this.pendingHeartbeatRef && (this.pendingHeartbeatRef = null);
            let { topic: t10, event: r10, payload: n10, ref: i10 } = e11, s2 = i10 ? `(${i10})` : "", a2 = n10.status || "";
            this.log("receive", `${a2} ${t10} ${r10} ${s2}`.trim(), n10), this.channels.filter((e12) => e12._isMember(t10)).forEach((e12) => e12._trigger(r10, n10, i10)), this._triggerStateCallbacks("message", e11);
          });
        }
        _clearTimer(e10) {
          var t10;
          "heartbeat" === e10 && this.heartbeatTimer ? (clearInterval(this.heartbeatTimer), this.heartbeatTimer = void 0) : "reconnect" === e10 && (null == (t10 = this.reconnectTimer) || t10.reset());
        }
        _clearAllTimers() {
          this._clearTimer("heartbeat"), this._clearTimer("reconnect");
        }
        _setupConnectionHandlers() {
          this.conn && ("binaryType" in this.conn && (this.conn.binaryType = "arraybuffer"), this.conn.onopen = () => this._onConnOpen(), this.conn.onerror = (e10) => this._onConnError(e10), this.conn.onmessage = (e10) => this._onConnMessage(e10), this.conn.onclose = (e10) => this._onConnClose(e10));
        }
        _teardownConnection() {
          if (this.conn) {
            if (this.conn.readyState === ed.open || this.conn.readyState === ed.connecting) try {
              this.conn.close();
            } catch (e10) {
              this.log("error", "Error closing connection", e10);
            }
            this.conn.onopen = null, this.conn.onerror = null, this.conn.onmessage = null, this.conn.onclose = null, this.conn = null;
          }
          this._clearAllTimers(), this.channels.forEach((e10) => e10.teardown());
        }
        _onConnOpen() {
          this._setConnectionState("connected"), this.log("transport", `connected to ${this.endpointURL()}`), (this._authPromise || (this.accessToken && !this.accessTokenValue ? this.setAuth() : Promise.resolve())).then(() => {
            this.flushSendBuffer();
          }).catch((e10) => {
            this.log("error", "error waiting for auth on connect", e10), this.flushSendBuffer();
          }), this._clearTimer("reconnect"), this.worker ? this.workerRef || this._startWorkerHeartbeat() : this._startHeartbeat(), this._triggerStateCallbacks("open");
        }
        _startHeartbeat() {
          this.heartbeatTimer && clearInterval(this.heartbeatTimer), this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
        }
        _startWorkerHeartbeat() {
          this.workerUrl ? this.log("worker", `starting worker for from ${this.workerUrl}`) : this.log("worker", "starting default worker");
          let e10 = this._workerObjectUrl(this.workerUrl);
          this.workerRef = new Worker(e10), this.workerRef.onerror = (e11) => {
            this.log("worker", "worker error", e11.message), this.workerRef.terminate();
          }, this.workerRef.onmessage = (e11) => {
            "keepAlive" === e11.data.event && this.sendHeartbeat();
          }, this.workerRef.postMessage({ event: "start", interval: this.heartbeatIntervalMs });
        }
        _onConnClose(e10) {
          var t10;
          this._setConnectionState("disconnected"), this.log("transport", "close", e10), this._triggerChanError(), this._clearTimer("heartbeat"), this._wasManualDisconnect || null == (t10 = this.reconnectTimer) || t10.scheduleTimeout(), this._triggerStateCallbacks("close", e10);
        }
        _onConnError(e10) {
          this._setConnectionState("disconnected"), this.log("transport", `${e10}`), this._triggerChanError(), this._triggerStateCallbacks("error", e10);
        }
        _triggerChanError() {
          this.channels.forEach((e10) => e10._trigger(ep.error));
        }
        _appendParams(e10, t10) {
          if (0 === Object.keys(t10).length) return e10;
          let r10 = e10.match(/\?/) ? "&" : "?", n10 = new URLSearchParams(t10);
          return `${e10}${r10}${n10}`;
        }
        _workerObjectUrl(e10) {
          let t10;
          if (e10) t10 = e10;
          else {
            let e11 = new Blob([r2], { type: "application/javascript" });
            t10 = URL.createObjectURL(e11);
          }
          return t10;
        }
        _setConnectionState(e10, t10 = false) {
          this._connectionState = e10, "connecting" === e10 ? this._wasManualDisconnect = false : "disconnecting" === e10 && (this._wasManualDisconnect = t10);
        }
        async _performAuth(e10 = null) {
          let t10;
          t10 = e10 || (this.accessToken ? await this.accessToken() : this.accessTokenValue), this.accessTokenValue != t10 && (this.accessTokenValue = t10, this.channels.forEach((e11) => {
            t10 && e11.updateJoinPayload({ access_token: t10, version: "realtime-js/2.81.1" }), e11.joinedOnce && e11._isJoined() && e11._push(ep.access_token, { access_token: t10 });
          }));
        }
        async _waitForAuthIfNeeded() {
          this._authPromise && await this._authPromise;
        }
        _setAuthSafely(e10 = "general") {
          this.setAuth().catch((t10) => {
            this.log("error", `error setting auth in ${e10}`, t10);
          });
        }
        _triggerStateCallbacks(e10, t10) {
          try {
            this.stateChangeCallbacks[e10].forEach((r10) => {
              try {
                r10(t10);
              } catch (t11) {
                this.log("error", `error in ${e10} callback`, t11);
              }
            });
          } catch (t11) {
            this.log("error", `error triggering ${e10} callbacks`, t11);
          }
        }
        _setupReconnectionTimer() {
          this.reconnectTimer = new rB(async () => {
            setTimeout(async () => {
              await this._waitForAuthIfNeeded(), this.isConnected() || this.connect();
            }, 10);
          }, this.reconnectAfterMs);
        }
        _initializeOptions(e10) {
          var t10, r10, n10, i10, s2, a2, o2, l2, u2, c2, h2, d2;
          switch (this.transport = null != (t10 = null == e10 ? void 0 : e10.transport) ? t10 : null, this.timeout = null != (r10 = null == e10 ? void 0 : e10.timeout) ? r10 : 1e4, this.heartbeatIntervalMs = null != (n10 = null == e10 ? void 0 : e10.heartbeatIntervalMs) ? n10 : 25e3, this.worker = null != (i10 = null == e10 ? void 0 : e10.worker) && i10, this.accessToken = null != (s2 = null == e10 ? void 0 : e10.accessToken) ? s2 : null, this.heartbeatCallback = null != (a2 = null == e10 ? void 0 : e10.heartbeatCallback) ? a2 : r0, this.vsn = null != (o2 = null == e10 ? void 0 : e10.vsn) ? o2 : rL, (null == e10 ? void 0 : e10.params) && (this.params = e10.params), (null == e10 ? void 0 : e10.logger) && (this.logger = e10.logger), ((null == e10 ? void 0 : e10.logLevel) || (null == e10 ? void 0 : e10.log_level)) && (this.logLevel = e10.logLevel || e10.log_level, this.params = Object.assign(Object.assign({}, this.params), { log_level: this.logLevel })), this.reconnectAfterMs = null != (l2 = null == e10 ? void 0 : e10.reconnectAfterMs) ? l2 : (e11) => r1[e11 - 1] || 1e4, this.vsn) {
            case rL:
              this.encode = null != (u2 = null == e10 ? void 0 : e10.encode) ? u2 : (e11, t11) => t11(JSON.stringify(e11)), this.decode = null != (c2 = null == e10 ? void 0 : e10.decode) ? c2 : (e11, t11) => t11(JSON.parse(e11));
              break;
            case "2.0.0":
              this.encode = null != (h2 = null == e10 ? void 0 : e10.encode) ? h2 : this.serializer.encode.bind(this.serializer), this.decode = null != (d2 = null == e10 ? void 0 : e10.decode) ? d2 : this.serializer.decode.bind(this.serializer);
              break;
            default:
              throw Error(`Unsupported serializer version: ${this.vsn}`);
          }
          this.worker && (this.workerUrl = null == e10 ? void 0 : e10.workerUrl);
        }
      }
      class r3 extends Error {
        constructor(e10) {
          super(e10), this.__isStorageError = true, this.name = "StorageError";
        }
      }
      function r8(e10) {
        return "object" == typeof e10 && null !== e10 && "__isStorageError" in e10;
      }
      class r6 extends r3 {
        constructor(e10, t10, r10) {
          super(e10), this.name = "StorageApiError", this.status = t10, this.statusCode = r10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, statusCode: this.statusCode };
        }
      }
      class r9 extends r3 {
        constructor(e10, t10) {
          super(e10), this.name = "StorageUnknownError", this.originalError = t10;
        }
      }
      let r5 = (e10) => e10 ? (...t10) => e10(...t10) : (...e11) => fetch(...e11), r7 = (e10) => {
        if (Array.isArray(e10)) return e10.map((e11) => r7(e11));
        if ("function" == typeof e10 || e10 !== Object(e10)) return e10;
        let t10 = {};
        return Object.entries(e10).forEach(([e11, r10]) => {
          t10[e11.replace(/([-_][a-z])/gi, (e12) => e12.toUpperCase().replace(/[-_]/g, ""))] = r7(r10);
        }), t10;
      }, ne = (e10) => {
        var t10;
        return e10.msg || e10.message || e10.error_description || ("string" == typeof e10.error ? e10.error : null == (t10 = e10.error) ? void 0 : t10.message) || JSON.stringify(e10);
      };
      function nt(e10, t10, r10, n10, i10, s2) {
        return (0, rO.__awaiter)(this, void 0, void 0, function* () {
          return new Promise((a2, o2) => {
            let l2;
            e10(r10, (l2 = { method: t10, headers: (null == n10 ? void 0 : n10.headers) || {} }, "GET" === t10 || !s2 ? l2 : (((e11) => {
              if ("object" != typeof e11 || null === e11) return false;
              let t11 = Object.getPrototypeOf(e11);
              return (null === t11 || t11 === Object.prototype || null === Object.getPrototypeOf(t11)) && !(Symbol.toStringTag in e11) && !(Symbol.iterator in e11);
            })(s2) ? (l2.headers = Object.assign({ "Content-Type": "application/json" }, null == n10 ? void 0 : n10.headers), l2.body = JSON.stringify(s2)) : l2.body = s2, (null == n10 ? void 0 : n10.duplex) && (l2.duplex = n10.duplex), Object.assign(Object.assign({}, l2), i10)))).then((e11) => {
              if (!e11.ok) throw e11;
              return (null == n10 ? void 0 : n10.noResolveJson) ? e11 : e11.json();
            }).then((e11) => a2(e11)).catch((e11) => (0, rO.__awaiter)(void 0, void 0, void 0, function* () {
              e11 instanceof (yield Response) && !(null == n10 ? void 0 : n10.noResolveJson) ? e11.json().then((t11) => {
                let r11 = e11.status || 500, n11 = (null == t11 ? void 0 : t11.statusCode) || r11 + "";
                o2(new r6(ne(t11), r11, n11));
              }).catch((e12) => {
                o2(new r9(ne(e12), e12));
              }) : o2(new r9(ne(e11), e11));
            }));
          });
        });
      }
      function nr(e10, t10, r10, n10) {
        return (0, rO.__awaiter)(this, void 0, void 0, function* () {
          return nt(e10, "GET", t10, r10, n10);
        });
      }
      function nn(e10, t10, r10, n10, i10) {
        return (0, rO.__awaiter)(this, void 0, void 0, function* () {
          return nt(e10, "POST", t10, n10, i10, r10);
        });
      }
      function ni(e10, t10, r10, n10, i10) {
        return (0, rO.__awaiter)(this, void 0, void 0, function* () {
          return nt(e10, "PUT", t10, n10, i10, r10);
        });
      }
      function ns(e10, t10, r10, n10, i10) {
        return (0, rO.__awaiter)(this, void 0, void 0, function* () {
          return nt(e10, "DELETE", t10, n10, i10, r10);
        });
      }
      class na {
        constructor(e10, t10) {
          this.downloadFn = e10, this.shouldThrowOnError = t10;
        }
        then(e10, t10) {
          return this.execute().then(e10, t10);
        }
        execute() {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: (yield this.downloadFn()).body, error: null };
            } catch (e10) {
              if (this.shouldThrowOnError) throw e10;
              if (r8(e10)) return { data: null, error: e10 };
              throw e10;
            }
          });
        }
      }
      eE = Symbol.toStringTag;
      let no = class {
        constructor(e10, t10) {
          this.downloadFn = e10, this.shouldThrowOnError = t10, this[eE] = "BlobDownloadBuilder", this.promise = null;
        }
        asStream() {
          return new na(this.downloadFn, this.shouldThrowOnError);
        }
        then(e10, t10) {
          return this.getPromise().then(e10, t10);
        }
        catch(e10) {
          return this.getPromise().catch(e10);
        }
        finally(e10) {
          return this.getPromise().finally(e10);
        }
        getPromise() {
          return this.promise || (this.promise = this.execute()), this.promise;
        }
        execute() {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              let e10 = yield this.downloadFn();
              return { data: yield e10.blob(), error: null };
            } catch (e10) {
              if (this.shouldThrowOnError) throw e10;
              if (r8(e10)) return { data: null, error: e10 };
              throw e10;
            }
          });
        }
      }, nl = { limit: 100, offset: 0, sortBy: { column: "name", order: "asc" } }, nu = { cacheControl: "3600", contentType: "text/plain;charset=UTF-8", upsert: false };
      class nc {
        constructor(e10, t10 = {}, r10, n10) {
          this.shouldThrowOnError = false, this.url = e10, this.headers = t10, this.bucketId = r10, this.fetch = r5(n10);
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        uploadOrUpdate(e10, t10, r10, n10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              let i10, s2 = Object.assign(Object.assign({}, nu), n10), a2 = Object.assign(Object.assign({}, this.headers), "POST" === e10 && { "x-upsert": String(s2.upsert) }), o2 = s2.metadata;
              "u" > typeof Blob && r10 instanceof Blob ? ((i10 = new FormData()).append("cacheControl", s2.cacheControl), o2 && i10.append("metadata", this.encodeMetadata(o2)), i10.append("", r10)) : "u" > typeof FormData && r10 instanceof FormData ? ((i10 = r10).has("cacheControl") || i10.append("cacheControl", s2.cacheControl), o2 && !i10.has("metadata") && i10.append("metadata", this.encodeMetadata(o2))) : (i10 = r10, a2["cache-control"] = `max-age=${s2.cacheControl}`, a2["content-type"] = s2.contentType, o2 && (a2["x-metadata"] = this.toBase64(this.encodeMetadata(o2))), ("u" > typeof ReadableStream && i10 instanceof ReadableStream || i10 && "object" == typeof i10 && "pipe" in i10 && "function" == typeof i10.pipe) && !s2.duplex && (s2.duplex = "half")), (null == n10 ? void 0 : n10.headers) && (a2 = Object.assign(Object.assign({}, a2), n10.headers));
              let l2 = this._removeEmptyFolders(t10), u2 = this._getFinalPath(l2), c2 = yield ("PUT" == e10 ? ni : nn)(this.fetch, `${this.url}/object/${u2}`, i10, Object.assign({ headers: a2 }, (null == s2 ? void 0 : s2.duplex) ? { duplex: s2.duplex } : {}));
              return { data: { path: l2, id: c2.Id, fullPath: c2.Key }, error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        upload(e10, t10, r10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            return this.uploadOrUpdate("POST", e10, t10, r10);
          });
        }
        uploadToSignedUrl(e10, t10, r10, n10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            let i10 = this._removeEmptyFolders(e10), s2 = this._getFinalPath(i10), a2 = new URL(this.url + `/object/upload/sign/${s2}`);
            a2.searchParams.set("token", t10);
            try {
              let e11, t11 = Object.assign({ upsert: nu.upsert }, n10), s3 = Object.assign(Object.assign({}, this.headers), { "x-upsert": String(t11.upsert) });
              "u" > typeof Blob && r10 instanceof Blob ? ((e11 = new FormData()).append("cacheControl", t11.cacheControl), e11.append("", r10)) : "u" > typeof FormData && r10 instanceof FormData ? (e11 = r10).append("cacheControl", t11.cacheControl) : (e11 = r10, s3["cache-control"] = `max-age=${t11.cacheControl}`, s3["content-type"] = t11.contentType);
              let o2 = yield ni(this.fetch, a2.toString(), e11, { headers: s3 });
              return { data: { path: i10, fullPath: o2.Key }, error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        createSignedUploadUrl(e10, t10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              let r10 = this._getFinalPath(e10), n10 = Object.assign({}, this.headers);
              (null == t10 ? void 0 : t10.upsert) && (n10["x-upsert"] = "true");
              let i10 = yield nn(this.fetch, `${this.url}/object/upload/sign/${r10}`, {}, { headers: n10 }), s2 = new URL(this.url + i10.url), a2 = s2.searchParams.get("token");
              if (!a2) throw new r3("No token returned by API");
              return { data: { signedUrl: s2.toString(), path: e10, token: a2 }, error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        update(e10, t10, r10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            return this.uploadOrUpdate("PUT", e10, t10, r10);
          });
        }
        move(e10, t10, r10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield nn(this.fetch, `${this.url}/object/move`, { bucketId: this.bucketId, sourceKey: e10, destinationKey: t10, destinationBucket: null == r10 ? void 0 : r10.destinationBucket }, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        copy(e10, t10, r10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: { path: (yield nn(this.fetch, `${this.url}/object/copy`, { bucketId: this.bucketId, sourceKey: e10, destinationKey: t10, destinationBucket: null == r10 ? void 0 : r10.destinationBucket }, { headers: this.headers })).Key }, error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        createSignedUrl(e10, t10, r10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              let n10 = this._getFinalPath(e10), i10 = yield nn(this.fetch, `${this.url}/object/sign/${n10}`, Object.assign({ expiresIn: t10 }, (null == r10 ? void 0 : r10.transform) ? { transform: r10.transform } : {}), { headers: this.headers }), s2 = (null == r10 ? void 0 : r10.download) ? `&download=${true === r10.download ? "" : r10.download}` : "";
              return { data: i10 = { signedUrl: encodeURI(`${this.url}${i10.signedURL}${s2}`) }, error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        createSignedUrls(e10, t10, r10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              let n10 = yield nn(this.fetch, `${this.url}/object/sign/${this.bucketId}`, { expiresIn: t10, paths: e10 }, { headers: this.headers }), i10 = (null == r10 ? void 0 : r10.download) ? `&download=${true === r10.download ? "" : r10.download}` : "";
              return { data: n10.map((e11) => Object.assign(Object.assign({}, e11), { signedUrl: e11.signedURL ? encodeURI(`${this.url}${e11.signedURL}${i10}`) : null })), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        download(e10, t10) {
          let r10 = void 0 !== (null == t10 ? void 0 : t10.transform) ? "render/image/authenticated" : "object", n10 = this.transformOptsToQueryString((null == t10 ? void 0 : t10.transform) || {}), i10 = n10 ? `?${n10}` : "", s2 = this._getFinalPath(e10);
          return new no(() => nr(this.fetch, `${this.url}/${r10}/${s2}${i10}`, { headers: this.headers, noResolveJson: true }), this.shouldThrowOnError);
        }
        info(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            let t10 = this._getFinalPath(e10);
            try {
              let e11 = yield nr(this.fetch, `${this.url}/object/info/${t10}`, { headers: this.headers });
              return { data: r7(e11), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        exists(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            let t10 = this._getFinalPath(e10);
            try {
              return yield function(e11, t11, r10) {
                return (0, rO.__awaiter)(this, void 0, void 0, function* () {
                  return nt(e11, "HEAD", t11, Object.assign(Object.assign({}, r10), { noResolveJson: true }), void 0);
                });
              }(this.fetch, `${this.url}/object/${t10}`, { headers: this.headers }), { data: true, error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11) && e11 instanceof r9) {
                let t11 = e11.originalError;
                if ([400, 404].includes(null == t11 ? void 0 : t11.status)) return { data: false, error: e11 };
              }
              throw e11;
            }
          });
        }
        getPublicUrl(e10, t10) {
          let r10 = this._getFinalPath(e10), n10 = [], i10 = (null == t10 ? void 0 : t10.download) ? `download=${true === t10.download ? "" : t10.download}` : "";
          "" !== i10 && n10.push(i10);
          let s2 = void 0 !== (null == t10 ? void 0 : t10.transform), a2 = this.transformOptsToQueryString((null == t10 ? void 0 : t10.transform) || {});
          "" !== a2 && n10.push(a2);
          let o2 = n10.join("&");
          return "" !== o2 && (o2 = `?${o2}`), { data: { publicUrl: encodeURI(`${this.url}/${s2 ? "render/image" : "object"}/public/${r10}${o2}`) } };
        }
        remove(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield ns(this.fetch, `${this.url}/object/${this.bucketId}`, { prefixes: e10 }, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        list(e10, t10, r10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              let n10 = Object.assign(Object.assign(Object.assign({}, nl), t10), { prefix: e10 || "" });
              return { data: yield nn(this.fetch, `${this.url}/object/list/${this.bucketId}`, n10, { headers: this.headers }, r10), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        listV2(e10, t10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              let r10 = Object.assign({}, e10);
              return { data: yield nn(this.fetch, `${this.url}/object/list-v2/${this.bucketId}`, r10, { headers: this.headers }, t10), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        encodeMetadata(e10) {
          return JSON.stringify(e10);
        }
        toBase64(e10) {
          return void 0 !== tE.Buffer ? tE.Buffer.from(e10).toString("base64") : btoa(e10);
        }
        _getFinalPath(e10) {
          return `${this.bucketId}/${e10.replace(/^\/+/, "")}`;
        }
        _removeEmptyFolders(e10) {
          return e10.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
        }
        transformOptsToQueryString(e10) {
          let t10 = [];
          return e10.width && t10.push(`width=${e10.width}`), e10.height && t10.push(`height=${e10.height}`), e10.resize && t10.push(`resize=${e10.resize}`), e10.format && t10.push(`format=${e10.format}`), e10.quality && t10.push(`quality=${e10.quality}`), t10.join("&");
        }
      }
      let nh = "2.81.1", nd = { "X-Client-Info": `storage-js/${nh}` };
      class nf {
        constructor(e10, t10 = {}, r10, n10) {
          this.shouldThrowOnError = false;
          const i10 = new URL(e10);
          (null == n10 ? void 0 : n10.useNewHostname) && /supabase\.(co|in|red)$/.test(i10.hostname) && !i10.hostname.includes("storage.supabase.") && (i10.hostname = i10.hostname.replace("supabase.", "storage.supabase.")), this.url = i10.href.replace(/\/$/, ""), this.headers = Object.assign(Object.assign({}, nd), t10), this.fetch = r5(r10);
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        listBuckets(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              let t10 = this.listBucketOptionsToQueryString(e10);
              return { data: yield nr(this.fetch, `${this.url}/bucket${t10}`, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        getBucket(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield nr(this.fetch, `${this.url}/bucket/${e10}`, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        createBucket(e10) {
          return (0, rO.__awaiter)(this, arguments, void 0, function* (e11, t10 = { public: false }) {
            try {
              return { data: yield nn(this.fetch, `${this.url}/bucket`, { id: e11, name: e11, type: t10.type, public: t10.public, file_size_limit: t10.fileSizeLimit, allowed_mime_types: t10.allowedMimeTypes }, { headers: this.headers }), error: null };
            } catch (e12) {
              if (this.shouldThrowOnError) throw e12;
              if (r8(e12)) return { data: null, error: e12 };
              throw e12;
            }
          });
        }
        updateBucket(e10, t10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield ni(this.fetch, `${this.url}/bucket/${e10}`, { id: e10, name: e10, public: t10.public, file_size_limit: t10.fileSizeLimit, allowed_mime_types: t10.allowedMimeTypes }, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        emptyBucket(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield nn(this.fetch, `${this.url}/bucket/${e10}/empty`, {}, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        deleteBucket(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield ns(this.fetch, `${this.url}/bucket/${e10}`, {}, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        listBucketOptionsToQueryString(e10) {
          let t10 = {};
          return e10 && ("limit" in e10 && (t10.limit = String(e10.limit)), "offset" in e10 && (t10.offset = String(e10.offset)), e10.search && (t10.search = e10.search), e10.sortColumn && (t10.sortColumn = e10.sortColumn), e10.sortOrder && (t10.sortOrder = e10.sortOrder)), Object.keys(t10).length > 0 ? "?" + new URLSearchParams(t10).toString() : "";
        }
      }
      class np {
        constructor(e10, t10 = {}, r10) {
          this.shouldThrowOnError = false, this.url = e10.replace(/\/$/, ""), this.headers = Object.assign(Object.assign({}, nd), t10), this.fetch = r5(r10);
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        createBucket(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield nn(this.fetch, `${this.url}/bucket`, { name: e10 }, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        listBuckets(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              let t10 = new URLSearchParams();
              (null == e10 ? void 0 : e10.limit) !== void 0 && t10.set("limit", e10.limit.toString()), (null == e10 ? void 0 : e10.offset) !== void 0 && t10.set("offset", e10.offset.toString()), (null == e10 ? void 0 : e10.sortColumn) && t10.set("sortColumn", e10.sortColumn), (null == e10 ? void 0 : e10.sortOrder) && t10.set("sortOrder", e10.sortOrder), (null == e10 ? void 0 : e10.search) && t10.set("search", e10.search);
              let r10 = t10.toString(), n10 = r10 ? `${this.url}/bucket?${r10}` : `${this.url}/bucket`;
              return { data: yield nr(this.fetch, n10, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        deleteBucket(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield ns(this.fetch, `${this.url}/bucket/${e10}`, {}, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (r8(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
      }
      let ng = { "X-Client-Info": `storage-js/${nh}`, "Content-Type": "application/json" };
      class nm extends Error {
        constructor(e10) {
          super(e10), this.__isStorageVectorsError = true, this.name = "StorageVectorsError";
        }
      }
      function nv(e10) {
        return "object" == typeof e10 && null !== e10 && "__isStorageVectorsError" in e10;
      }
      class nb extends nm {
        constructor(e10, t10, r10) {
          super(e10), this.name = "StorageVectorsApiError", this.status = t10, this.statusCode = r10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, statusCode: this.statusCode };
        }
      }
      class ny extends nm {
        constructor(e10, t10) {
          super(e10), this.name = "StorageVectorsUnknownError", this.originalError = t10;
        }
      }
      (eu = eS || (eS = {})).InternalError = "InternalError", eu.S3VectorConflictException = "S3VectorConflictException", eu.S3VectorNotFoundException = "S3VectorNotFoundException", eu.S3VectorBucketNotEmpty = "S3VectorBucketNotEmpty", eu.S3VectorMaxBucketsExceeded = "S3VectorMaxBucketsExceeded", eu.S3VectorMaxIndexesExceeded = "S3VectorMaxIndexesExceeded";
      let n_ = (e10) => e10 ? (...t10) => e10(...t10) : (...e11) => fetch(...e11), nw = (e10) => e10.msg || e10.message || e10.error_description || e10.error || JSON.stringify(e10);
      function nE(e10, t10, r10, n10, i10) {
        return (0, rO.__awaiter)(this, void 0, void 0, function* () {
          return function(e11, t11, r11, n11, i11, s2) {
            return (0, rO.__awaiter)(this, void 0, void 0, function* () {
              return new Promise((a2, o2) => {
                let l2;
                e11(r11, (l2 = { method: t11, headers: (null == n11 ? void 0 : n11.headers) || {} }, "GET" === t11 || !s2 ? l2 : (((e12) => {
                  if ("object" != typeof e12 || null === e12) return false;
                  let t12 = Object.getPrototypeOf(e12);
                  return (null === t12 || t12 === Object.prototype || null === Object.getPrototypeOf(t12)) && !(Symbol.toStringTag in e12) && !(Symbol.iterator in e12);
                })(s2) ? (l2.headers = Object.assign({ "Content-Type": "application/json" }, null == n11 ? void 0 : n11.headers), l2.body = JSON.stringify(s2)) : l2.body = s2, Object.assign(Object.assign({}, l2), i11)))).then((e12) => {
                  if (!e12.ok) throw e12;
                  if (null == n11 ? void 0 : n11.noResolveJson) return e12;
                  let t12 = e12.headers.get("content-type");
                  return t12 && t12.includes("application/json") ? e12.json() : {};
                }).then((e12) => a2(e12)).catch((e12) => (0, rO.__awaiter)(void 0, void 0, void 0, function* () {
                  if (!(e12 && "object" == typeof e12 && "status" in e12 && "ok" in e12 && "number" == typeof e12.status) || (null == n11 ? void 0 : n11.noResolveJson)) o2(new ny(nw(e12), e12));
                  else {
                    let t12 = e12.status || 500;
                    "function" == typeof e12.json ? e12.json().then((e13) => {
                      let r12 = (null == e13 ? void 0 : e13.statusCode) || (null == e13 ? void 0 : e13.code) || t12 + "";
                      o2(new nb(nw(e13), t12, r12));
                    }).catch(() => {
                      o2(new nb(e12.statusText || `HTTP ${t12} error`, t12, t12 + ""));
                    }) : o2(new nb(e12.statusText || `HTTP ${t12} error`, t12, t12 + ""));
                  }
                }));
              });
            });
          }(e10, "POST", t10, n10, i10, r10);
        });
      }
      class nS {
        constructor(e10, t10 = {}, r10) {
          this.shouldThrowOnError = false, this.url = e10.replace(/\/$/, ""), this.headers = Object.assign(Object.assign({}, ng), t10), this.fetch = n_(r10);
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        createIndex(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: (yield nE(this.fetch, `${this.url}/CreateIndex`, e10, { headers: this.headers })) || {}, error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (nv(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        getIndex(e10, t10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield nE(this.fetch, `${this.url}/GetIndex`, { vectorBucketName: e10, indexName: t10 }, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (nv(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        listIndexes(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield nE(this.fetch, `${this.url}/ListIndexes`, e10, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (nv(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        deleteIndex(e10, t10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: (yield nE(this.fetch, `${this.url}/DeleteIndex`, { vectorBucketName: e10, indexName: t10 }, { headers: this.headers })) || {}, error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (nv(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
      }
      class nO {
        constructor(e10, t10 = {}, r10) {
          this.shouldThrowOnError = false, this.url = e10.replace(/\/$/, ""), this.headers = Object.assign(Object.assign({}, ng), t10), this.fetch = n_(r10);
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        putVectors(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              if (e10.vectors.length < 1 || e10.vectors.length > 500) throw Error("Vector batch size must be between 1 and 500 items");
              return { data: (yield nE(this.fetch, `${this.url}/PutVectors`, e10, { headers: this.headers })) || {}, error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (nv(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        getVectors(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield nE(this.fetch, `${this.url}/GetVectors`, e10, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (nv(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        listVectors(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              if (void 0 !== e10.segmentCount) {
                if (e10.segmentCount < 1 || e10.segmentCount > 16) throw Error("segmentCount must be between 1 and 16");
                if (void 0 !== e10.segmentIndex && (e10.segmentIndex < 0 || e10.segmentIndex >= e10.segmentCount)) throw Error(`segmentIndex must be between 0 and ${e10.segmentCount - 1}`);
              }
              return { data: yield nE(this.fetch, `${this.url}/ListVectors`, e10, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (nv(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        queryVectors(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield nE(this.fetch, `${this.url}/QueryVectors`, e10, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (nv(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        deleteVectors(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              if (e10.keys.length < 1 || e10.keys.length > 500) throw Error("Keys batch size must be between 1 and 500 items");
              return { data: (yield nE(this.fetch, `${this.url}/DeleteVectors`, e10, { headers: this.headers })) || {}, error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (nv(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
      }
      class nT {
        constructor(e10, t10 = {}, r10) {
          this.shouldThrowOnError = false, this.url = e10.replace(/\/$/, ""), this.headers = Object.assign(Object.assign({}, ng), t10), this.fetch = n_(r10);
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        createBucket(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: (yield nE(this.fetch, `${this.url}/CreateVectorBucket`, { vectorBucketName: e10 }, { headers: this.headers })) || {}, error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (nv(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        getBucket(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield nE(this.fetch, `${this.url}/GetVectorBucket`, { vectorBucketName: e10 }, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (nv(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        listBuckets() {
          return (0, rO.__awaiter)(this, arguments, void 0, function* (e10 = {}) {
            try {
              return { data: yield nE(this.fetch, `${this.url}/ListVectorBuckets`, e10, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (nv(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        deleteBucket(e10) {
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: (yield nE(this.fetch, `${this.url}/DeleteVectorBucket`, { vectorBucketName: e10 }, { headers: this.headers })) || {}, error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (nv(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
      }
      class nR extends nT {
        constructor(e10, t10 = {}) {
          super(e10, t10.headers || {}, t10.fetch);
        }
        from(e10) {
          return new nx(this.url, this.headers, e10, this.fetch);
        }
      }
      class nx extends nS {
        constructor(e10, t10, r10, n10) {
          super(e10, t10, n10), this.vectorBucketName = r10;
        }
        createIndex(e10) {
          let t10 = Object.create(null, { createIndex: { get: () => super.createIndex } });
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            return t10.createIndex.call(this, Object.assign(Object.assign({}, e10), { vectorBucketName: this.vectorBucketName }));
          });
        }
        listIndexes() {
          let e10 = Object.create(null, { listIndexes: { get: () => super.listIndexes } });
          return (0, rO.__awaiter)(this, arguments, void 0, function* (t10 = {}) {
            return e10.listIndexes.call(this, Object.assign(Object.assign({}, t10), { vectorBucketName: this.vectorBucketName }));
          });
        }
        getIndex(e10) {
          let t10 = Object.create(null, { getIndex: { get: () => super.getIndex } });
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            return t10.getIndex.call(this, this.vectorBucketName, e10);
          });
        }
        deleteIndex(e10) {
          let t10 = Object.create(null, { deleteIndex: { get: () => super.deleteIndex } });
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            return t10.deleteIndex.call(this, this.vectorBucketName, e10);
          });
        }
        index(e10) {
          return new nk(this.url, this.headers, this.vectorBucketName, e10, this.fetch);
        }
      }
      class nk extends nO {
        constructor(e10, t10, r10, n10, i10) {
          super(e10, t10, i10), this.vectorBucketName = r10, this.indexName = n10;
        }
        putVectors(e10) {
          let t10 = Object.create(null, { putVectors: { get: () => super.putVectors } });
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            return t10.putVectors.call(this, Object.assign(Object.assign({}, e10), { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
          });
        }
        getVectors(e10) {
          let t10 = Object.create(null, { getVectors: { get: () => super.getVectors } });
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            return t10.getVectors.call(this, Object.assign(Object.assign({}, e10), { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
          });
        }
        listVectors() {
          let e10 = Object.create(null, { listVectors: { get: () => super.listVectors } });
          return (0, rO.__awaiter)(this, arguments, void 0, function* (t10 = {}) {
            return e10.listVectors.call(this, Object.assign(Object.assign({}, t10), { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
          });
        }
        queryVectors(e10) {
          let t10 = Object.create(null, { queryVectors: { get: () => super.queryVectors } });
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            return t10.queryVectors.call(this, Object.assign(Object.assign({}, e10), { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
          });
        }
        deleteVectors(e10) {
          let t10 = Object.create(null, { deleteVectors: { get: () => super.deleteVectors } });
          return (0, rO.__awaiter)(this, void 0, void 0, function* () {
            return t10.deleteVectors.call(this, Object.assign(Object.assign({}, e10), { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
          });
        }
      }
      class nC extends nf {
        constructor(e10, t10 = {}, r10, n10) {
          super(e10, t10, r10, n10);
        }
        from(e10) {
          return new nc(this.url, this.headers, e10, this.fetch);
        }
        get vectors() {
          return new nR(this.url + "/vector", { headers: this.headers, fetch: this.fetch });
        }
        get analytics() {
          return new np(this.url + "/iceberg", this.headers, this.fetch);
        }
      }
      let nP = "";
      nP = "u" > typeof Deno ? "deno" : "u" > typeof document ? "web" : "u" > typeof navigator && "ReactNative" === navigator.product ? "react-native" : "node";
      let nA = { headers: { "X-Client-Info": `supabase-js-${nP}/2.81.1` } }, nj = { schema: "public" }, nI = { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, flowType: "implicit" }, nN = {}, n$ = "2.81.1", nD = { "X-Client-Info": `gotrue-js/${n$}` }, nU = "X-Supabase-Api-Version", nL = { "2024-01-01": { timestamp: Date.parse("2024-01-01T00:00:00.0Z"), name: "2024-01-01" } }, nM = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;
      class nB extends Error {
        constructor(e10, t10, r10) {
          super(e10), this.__isAuthError = true, this.name = "AuthError", this.status = t10, this.code = r10;
        }
      }
      function nq(e10) {
        return "object" == typeof e10 && null !== e10 && "__isAuthError" in e10;
      }
      class nH extends nB {
        constructor(e10, t10, r10) {
          super(e10, t10, r10), this.name = "AuthApiError", this.status = t10, this.code = r10;
        }
      }
      class nV extends nB {
        constructor(e10, t10) {
          super(e10), this.name = "AuthUnknownError", this.originalError = t10;
        }
      }
      class nF extends nB {
        constructor(e10, t10, r10, n10) {
          super(e10, r10, n10), this.name = t10, this.status = r10;
        }
      }
      class nG extends nF {
        constructor() {
          super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
        }
      }
      class nW extends nF {
        constructor() {
          super("Auth session or user missing", "AuthInvalidTokenResponseError", 500, void 0);
        }
      }
      class nz extends nF {
        constructor(e10) {
          super(e10, "AuthInvalidCredentialsError", 400, void 0);
        }
      }
      class nK extends nF {
        constructor(e10, t10 = null) {
          super(e10, "AuthImplicitGrantRedirectError", 500, void 0), this.details = null, this.details = t10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, details: this.details };
        }
      }
      class nJ extends nF {
        constructor(e10, t10) {
          super(e10, "AuthRetryableFetchError", t10, void 0);
        }
      }
      function nX(e10) {
        return nq(e10) && "AuthRetryableFetchError" === e10.name;
      }
      class nY extends nF {
        constructor(e10, t10, r10) {
          super(e10, "AuthWeakPasswordError", t10, "weak_password"), this.reasons = r10;
        }
      }
      class nQ extends nF {
        constructor(e10) {
          super(e10, "AuthInvalidJwtError", 400, "invalid_jwt");
        }
      }
      let nZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""), n0 = " 	\n\r=".split(""), n1 = (() => {
        let e10 = Array(128);
        for (let t10 = 0; t10 < e10.length; t10 += 1) e10[t10] = -1;
        for (let t10 = 0; t10 < n0.length; t10 += 1) e10[n0[t10].charCodeAt(0)] = -2;
        for (let t10 = 0; t10 < nZ.length; t10 += 1) e10[nZ[t10].charCodeAt(0)] = t10;
        return e10;
      })();
      function n2(e10, t10, r10) {
        if (null !== e10) for (t10.queue = t10.queue << 8 | e10, t10.queuedBits += 8; t10.queuedBits >= 6; ) r10(nZ[t10.queue >> t10.queuedBits - 6 & 63]), t10.queuedBits -= 6;
        else if (t10.queuedBits > 0) for (t10.queue = t10.queue << 6 - t10.queuedBits, t10.queuedBits = 6; t10.queuedBits >= 6; ) r10(nZ[t10.queue >> t10.queuedBits - 6 & 63]), t10.queuedBits -= 6;
      }
      function n4(e10, t10, r10) {
        let n10 = n1[e10];
        if (n10 > -1) for (t10.queue = t10.queue << 6 | n10, t10.queuedBits += 6; t10.queuedBits >= 8; ) r10(t10.queue >> t10.queuedBits - 8 & 255), t10.queuedBits -= 8;
        else if (-2 === n10) return;
        else throw Error(`Invalid Base64-URL character "${String.fromCharCode(e10)}"`);
      }
      function n3(e10) {
        let t10 = [], r10 = (e11) => {
          t10.push(String.fromCodePoint(e11));
        }, n10 = { utf8seq: 0, codepoint: 0 }, i10 = { queue: 0, queuedBits: 0 }, s2 = (e11) => {
          !function(e12, t11, r11) {
            if (0 === t11.utf8seq) {
              if (e12 <= 127) return r11(e12);
              for (let r12 = 1; r12 < 6; r12 += 1) if ((e12 >> 7 - r12 & 1) == 0) {
                t11.utf8seq = r12;
                break;
              }
              if (2 === t11.utf8seq) t11.codepoint = 31 & e12;
              else if (3 === t11.utf8seq) t11.codepoint = 15 & e12;
              else if (4 === t11.utf8seq) t11.codepoint = 7 & e12;
              else throw Error("Invalid UTF-8 sequence");
              t11.utf8seq -= 1;
            } else if (t11.utf8seq > 0) {
              if (e12 <= 127) throw Error("Invalid UTF-8 sequence");
              t11.codepoint = t11.codepoint << 6 | 63 & e12, t11.utf8seq -= 1, 0 === t11.utf8seq && r11(t11.codepoint);
            }
          }(e11, n10, r10);
        };
        for (let t11 = 0; t11 < e10.length; t11 += 1) n4(e10.charCodeAt(t11), i10, s2);
        return t10.join("");
      }
      function n8(e10) {
        let t10 = [], r10 = { queue: 0, queuedBits: 0 }, n10 = (e11) => {
          t10.push(e11);
        };
        for (let t11 = 0; t11 < e10.length; t11 += 1) n4(e10.charCodeAt(t11), r10, n10);
        return new Uint8Array(t10);
      }
      function n6(e10) {
        let t10 = [], r10 = { queue: 0, queuedBits: 0 }, n10 = (e11) => {
          t10.push(e11);
        };
        return e10.forEach((e11) => n2(e11, r10, n10)), n2(null, r10, n10), t10.join("");
      }
      let n9 = (e10) => e10 ? (...t10) => e10(...t10) : (...e11) => fetch(...e11), n5 = async (e10, t10, r10) => {
        await e10.setItem(t10, JSON.stringify(r10));
      }, n7 = async (e10, t10) => {
        let r10 = await e10.getItem(t10);
        if (!r10) return null;
        try {
          return JSON.parse(r10);
        } catch (e11) {
          return r10;
        }
      }, ie = async (e10, t10) => {
        await e10.removeItem(t10);
      };
      class it {
        constructor() {
          this.promise = new it.promiseConstructor((e10, t10) => {
            this.resolve = e10, this.reject = t10;
          });
        }
      }
      function ir(e10) {
        let t10 = e10.split(".");
        if (3 !== t10.length) throw new nQ("Invalid JWT structure");
        for (let e11 = 0; e11 < t10.length; e11++) if (!nM.test(t10[e11])) throw new nQ("JWT not in base64url format");
        return { header: JSON.parse(n3(t10[0])), payload: JSON.parse(n3(t10[1])), signature: n8(t10[2]), raw: { header: t10[0], payload: t10[1] } };
      }
      async function ii(e10) {
        return await new Promise((t10) => {
          setTimeout(() => t10(null), e10);
        });
      }
      function is(e10) {
        return ("0" + e10.toString(16)).substr(-2);
      }
      async function ia(e10) {
        let t10 = new TextEncoder().encode(e10);
        return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", t10))).map((e11) => String.fromCharCode(e11)).join("");
      }
      async function io(e10) {
        return "u" > typeof crypto && void 0 !== crypto.subtle && "u" > typeof TextEncoder ? btoa(await ia(e10)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : (console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."), e10);
      }
      async function il(e10, t10, r10 = false) {
        let n10 = function() {
          let e11 = new Uint32Array(56);
          if ("u" < typeof crypto) {
            let e12 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~", t11 = e12.length, r11 = "";
            for (let n11 = 0; n11 < 56; n11++) r11 += e12.charAt(Math.floor(Math.random() * t11));
            return r11;
          }
          return crypto.getRandomValues(e11), Array.from(e11, is).join("");
        }(), i10 = n10;
        r10 && (i10 += "/PASSWORD_RECOVERY"), await n5(e10, `${t10}-code-verifier`, i10);
        let s2 = await io(n10), a2 = n10 === s2 ? "plain" : "s256";
        return [s2, a2];
      }
      it.promiseConstructor = Promise;
      let iu = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i, ic = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
      function ih(e10) {
        if (!ic.test(e10)) throw Error("@supabase/auth-js: Expected parameter to be UUID but is not");
      }
      function id() {
        return new Proxy({}, { get: (e10, t10) => {
          if ("__isUserNotAvailableProxy" === t10) return true;
          if ("symbol" == typeof t10) {
            let e11 = t10.toString();
            if ("Symbol(Symbol.toPrimitive)" === e11 || "Symbol(Symbol.toStringTag)" === e11 || "Symbol(util.inspect.custom)" === e11) return;
          }
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${t10}" property of the session object is not supported. Please use getUser() instead.`);
        }, set: (e10, t10) => {
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${t10}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
        }, deleteProperty: (e10, t10) => {
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${t10}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
        } });
      }
      function ip(e10) {
        return JSON.parse(JSON.stringify(e10));
      }
      let ig = (e10) => e10.msg || e10.message || e10.error_description || e10.error || JSON.stringify(e10), im = [502, 503, 504];
      async function iv(e10) {
        var t10;
        let r10, n10;
        if (!("object" == typeof e10 && null !== e10 && "status" in e10 && "ok" in e10 && "json" in e10 && "function" == typeof e10.json)) throw new nJ(ig(e10), 0);
        if (im.includes(e10.status)) throw new nJ(ig(e10), e10.status);
        try {
          r10 = await e10.json();
        } catch (e11) {
          throw new nV(ig(e11), e11);
        }
        let i10 = function(e11) {
          let t11 = e11.headers.get(nU);
          if (!t11 || !t11.match(iu)) return null;
          try {
            return /* @__PURE__ */ new Date(`${t11}T00:00:00.0Z`);
          } catch (e12) {
            return null;
          }
        }(e10);
        if (i10 && i10.getTime() >= nL["2024-01-01"].timestamp && "object" == typeof r10 && r10 && "string" == typeof r10.code ? n10 = r10.code : "object" == typeof r10 && r10 && "string" == typeof r10.error_code && (n10 = r10.error_code), n10) {
          if ("weak_password" === n10) throw new nY(ig(r10), e10.status, (null == (t10 = r10.weak_password) ? void 0 : t10.reasons) || []);
          else if ("session_not_found" === n10) throw new nG();
        } else if ("object" == typeof r10 && r10 && "object" == typeof r10.weak_password && r10.weak_password && Array.isArray(r10.weak_password.reasons) && r10.weak_password.reasons.length && r10.weak_password.reasons.reduce((e11, t11) => e11 && "string" == typeof t11, true)) throw new nY(ig(r10), e10.status, r10.weak_password.reasons);
        throw new nH(ig(r10), e10.status || 500, n10);
      }
      async function ib(e10, t10, r10, n10) {
        var i10;
        let s2 = Object.assign({}, null == n10 ? void 0 : n10.headers);
        s2[nU] || (s2[nU] = nL["2024-01-01"].name), (null == n10 ? void 0 : n10.jwt) && (s2.Authorization = `Bearer ${n10.jwt}`);
        let a2 = null != (i10 = null == n10 ? void 0 : n10.query) ? i10 : {};
        (null == n10 ? void 0 : n10.redirectTo) && (a2.redirect_to = n10.redirectTo);
        let o2 = Object.keys(a2).length ? "?" + new URLSearchParams(a2).toString() : "", l2 = await iy(e10, t10, r10 + o2, { headers: s2, noResolveJson: null == n10 ? void 0 : n10.noResolveJson }, {}, null == n10 ? void 0 : n10.body);
        return (null == n10 ? void 0 : n10.xform) ? null == n10 ? void 0 : n10.xform(l2) : { data: Object.assign({}, l2), error: null };
      }
      async function iy(e10, t10, r10, n10, i10, s2) {
        let a2, o2, l2 = (o2 = { method: t10, headers: (null == n10 ? void 0 : n10.headers) || {} }, "GET" === t10 ? o2 : (o2.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, null == n10 ? void 0 : n10.headers), o2.body = JSON.stringify(s2), Object.assign(Object.assign({}, o2), i10)));
        try {
          a2 = await e10(r10, Object.assign({}, l2));
        } catch (e11) {
          throw console.error(e11), new nJ(ig(e11), 0);
        }
        if (a2.ok || await iv(a2), null == n10 ? void 0 : n10.noResolveJson) return a2;
        try {
          return await a2.json();
        } catch (e11) {
          await iv(e11);
        }
      }
      function i_(e10) {
        var t10, r10, n10;
        let i10 = null;
        (n10 = e10).access_token && n10.refresh_token && n10.expires_in && (i10 = Object.assign({}, e10), e10.expires_at || (i10.expires_at = (r10 = e10.expires_in, Math.round(Date.now() / 1e3) + r10)));
        return { data: { session: i10, user: null != (t10 = e10.user) ? t10 : e10 }, error: null };
      }
      function iw(e10) {
        let t10 = i_(e10);
        return !t10.error && e10.weak_password && "object" == typeof e10.weak_password && Array.isArray(e10.weak_password.reasons) && e10.weak_password.reasons.length && e10.weak_password.message && "string" == typeof e10.weak_password.message && e10.weak_password.reasons.reduce((e11, t11) => e11 && "string" == typeof t11, true) && (t10.data.weak_password = e10.weak_password), t10;
      }
      function iE(e10) {
        var t10;
        return { data: { user: null != (t10 = e10.user) ? t10 : e10 }, error: null };
      }
      function iS(e10) {
        return { data: e10, error: null };
      }
      function iO(e10) {
        let { action_link: t10, email_otp: r10, hashed_token: n10, redirect_to: i10, verification_type: s2 } = e10;
        return { data: { properties: { action_link: t10, email_otp: r10, hashed_token: n10, redirect_to: i10, verification_type: s2 }, user: Object.assign({}, (0, rO.__rest)(e10, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"])) }, error: null };
      }
      function iT(e10) {
        return e10;
      }
      let iR = ["global", "local", "others"];
      class ix {
        constructor({ url: e10 = "", headers: t10 = {}, fetch: r10 }) {
          this.url = e10, this.headers = t10, this.fetch = n9(r10), this.mfa = { listFactors: this._listFactors.bind(this), deleteFactor: this._deleteFactor.bind(this) }, this.oauth = { listClients: this._listOAuthClients.bind(this), createClient: this._createOAuthClient.bind(this), getClient: this._getOAuthClient.bind(this), updateClient: this._updateOAuthClient.bind(this), deleteClient: this._deleteOAuthClient.bind(this), regenerateClientSecret: this._regenerateOAuthClientSecret.bind(this) };
        }
        async signOut(e10, t10 = iR[0]) {
          if (0 > iR.indexOf(t10)) throw Error(`@supabase/auth-js: Parameter scope must be one of ${iR.join(", ")}`);
          try {
            return await ib(this.fetch, "POST", `${this.url}/logout?scope=${t10}`, { headers: this.headers, jwt: e10, noResolveJson: true }), { data: null, error: null };
          } catch (e11) {
            if (nq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async inviteUserByEmail(e10, t10 = {}) {
          try {
            return await ib(this.fetch, "POST", `${this.url}/invite`, { body: { email: e10, data: t10.data }, headers: this.headers, redirectTo: t10.redirectTo, xform: iE });
          } catch (e11) {
            if (nq(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async generateLink(e10) {
          try {
            let { options: t10 } = e10, r10 = (0, rO.__rest)(e10, ["options"]), n10 = Object.assign(Object.assign({}, r10), t10);
            return "newEmail" in r10 && (n10.new_email = null == r10 ? void 0 : r10.newEmail, delete n10.newEmail), await ib(this.fetch, "POST", `${this.url}/admin/generate_link`, { body: n10, headers: this.headers, xform: iO, redirectTo: null == t10 ? void 0 : t10.redirectTo });
          } catch (e11) {
            if (nq(e11)) return { data: { properties: null, user: null }, error: e11 };
            throw e11;
          }
        }
        async createUser(e10) {
          try {
            return await ib(this.fetch, "POST", `${this.url}/admin/users`, { body: e10, headers: this.headers, xform: iE });
          } catch (e11) {
            if (nq(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async listUsers(e10) {
          var t10, r10, n10, i10, s2, a2, o2;
          try {
            let l2 = { nextPage: null, lastPage: 0, total: 0 }, u2 = await ib(this.fetch, "GET", `${this.url}/admin/users`, { headers: this.headers, noResolveJson: true, query: { page: null != (r10 = null == (t10 = null == e10 ? void 0 : e10.page) ? void 0 : t10.toString()) ? r10 : "", per_page: null != (i10 = null == (n10 = null == e10 ? void 0 : e10.perPage) ? void 0 : n10.toString()) ? i10 : "" }, xform: iT });
            if (u2.error) throw u2.error;
            let c2 = await u2.json(), h2 = null != (s2 = u2.headers.get("x-total-count")) ? s2 : 0, d2 = null != (o2 = null == (a2 = u2.headers.get("link")) ? void 0 : a2.split(",")) ? o2 : [];
            return d2.length > 0 && (d2.forEach((e11) => {
              let t11 = parseInt(e11.split(";")[0].split("=")[1].substring(0, 1)), r11 = JSON.parse(e11.split(";")[1].split("=")[1]);
              l2[`${r11}Page`] = t11;
            }), l2.total = parseInt(h2)), { data: Object.assign(Object.assign({}, c2), l2), error: null };
          } catch (e11) {
            if (nq(e11)) return { data: { users: [] }, error: e11 };
            throw e11;
          }
        }
        async getUserById(e10) {
          ih(e10);
          try {
            return await ib(this.fetch, "GET", `${this.url}/admin/users/${e10}`, { headers: this.headers, xform: iE });
          } catch (e11) {
            if (nq(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async updateUserById(e10, t10) {
          ih(e10);
          try {
            return await ib(this.fetch, "PUT", `${this.url}/admin/users/${e10}`, { body: t10, headers: this.headers, xform: iE });
          } catch (e11) {
            if (nq(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async deleteUser(e10, t10 = false) {
          ih(e10);
          try {
            return await ib(this.fetch, "DELETE", `${this.url}/admin/users/${e10}`, { headers: this.headers, body: { should_soft_delete: t10 }, xform: iE });
          } catch (e11) {
            if (nq(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async _listFactors(e10) {
          ih(e10.userId);
          try {
            let { data: t10, error: r10 } = await ib(this.fetch, "GET", `${this.url}/admin/users/${e10.userId}/factors`, { headers: this.headers, xform: (e11) => ({ data: { factors: e11 }, error: null }) });
            return { data: t10, error: r10 };
          } catch (e11) {
            if (nq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _deleteFactor(e10) {
          ih(e10.userId), ih(e10.id);
          try {
            return { data: await ib(this.fetch, "DELETE", `${this.url}/admin/users/${e10.userId}/factors/${e10.id}`, { headers: this.headers }), error: null };
          } catch (e11) {
            if (nq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _listOAuthClients(e10) {
          var t10, r10, n10, i10, s2, a2, o2;
          try {
            let l2 = { nextPage: null, lastPage: 0, total: 0 }, u2 = await ib(this.fetch, "GET", `${this.url}/admin/oauth/clients`, { headers: this.headers, noResolveJson: true, query: { page: null != (r10 = null == (t10 = null == e10 ? void 0 : e10.page) ? void 0 : t10.toString()) ? r10 : "", per_page: null != (i10 = null == (n10 = null == e10 ? void 0 : e10.perPage) ? void 0 : n10.toString()) ? i10 : "" }, xform: iT });
            if (u2.error) throw u2.error;
            let c2 = await u2.json(), h2 = null != (s2 = u2.headers.get("x-total-count")) ? s2 : 0, d2 = null != (o2 = null == (a2 = u2.headers.get("link")) ? void 0 : a2.split(",")) ? o2 : [];
            return d2.length > 0 && (d2.forEach((e11) => {
              let t11 = parseInt(e11.split(";")[0].split("=")[1].substring(0, 1)), r11 = JSON.parse(e11.split(";")[1].split("=")[1]);
              l2[`${r11}Page`] = t11;
            }), l2.total = parseInt(h2)), { data: Object.assign(Object.assign({}, c2), l2), error: null };
          } catch (e11) {
            if (nq(e11)) return { data: { clients: [] }, error: e11 };
            throw e11;
          }
        }
        async _createOAuthClient(e10) {
          try {
            return await ib(this.fetch, "POST", `${this.url}/admin/oauth/clients`, { body: e10, headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (nq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _getOAuthClient(e10) {
          try {
            return await ib(this.fetch, "GET", `${this.url}/admin/oauth/clients/${e10}`, { headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (nq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _updateOAuthClient(e10, t10) {
          try {
            return await ib(this.fetch, "PUT", `${this.url}/admin/oauth/clients/${e10}`, { body: t10, headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (nq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _deleteOAuthClient(e10) {
          try {
            return await ib(this.fetch, "DELETE", `${this.url}/admin/oauth/clients/${e10}`, { headers: this.headers, noResolveJson: true }), { data: null, error: null };
          } catch (e11) {
            if (nq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _regenerateOAuthClientSecret(e10) {
          try {
            return await ib(this.fetch, "POST", `${this.url}/admin/oauth/clients/${e10}/regenerate_secret`, { headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (nq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
      }
      function ik(e10 = {}) {
        return { getItem: (t10) => e10[t10] || null, setItem: (t10, r10) => {
          e10[t10] = r10;
        }, removeItem: (t10) => {
          delete e10[t10];
        } };
      }
      globalThis;
      class iC extends Error {
        constructor(e10) {
          super(e10), this.isAcquireTimeout = true;
        }
      }
      function iP(e10) {
        if (!/^0x[a-fA-F0-9]{40}$/.test(e10)) throw Error(`@supabase/auth-js: Address "${e10}" is invalid.`);
        return e10.toLowerCase();
      }
      class iA extends Error {
        constructor({ message: e10, code: t10, cause: r10, name: n10 }) {
          var i10;
          super(e10, { cause: r10 }), this.__isWebAuthnError = true, this.name = null != (i10 = null != n10 ? n10 : r10 instanceof Error ? r10.name : void 0) ? i10 : "Unknown Error", this.code = t10;
        }
      }
      class ij extends iA {
        constructor(e10, t10) {
          super({ code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: t10, message: e10 }), this.name = "WebAuthnUnknownError", this.originalError = t10;
        }
      }
      let iI = new class {
        createNewAbortSignal() {
          if (this.controller) {
            let e11 = Error("Cancelling existing WebAuthn API call for new one");
            e11.name = "AbortError", this.controller.abort(e11);
          }
          let e10 = new AbortController();
          return this.controller = e10, e10.signal;
        }
        cancelCeremony() {
          if (this.controller) {
            let e10 = Error("Manually cancelling existing WebAuthn API call");
            e10.name = "AbortError", this.controller.abort(e10), this.controller = void 0;
          }
        }
      }();
      function iN(e10) {
        return "localhost" === e10 || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(e10);
      }
      async function i$(e10) {
        try {
          let t10 = await navigator.credentials.create(e10);
          if (!t10) return { data: null, error: new ij("Empty credential response", t10) };
          if (!(t10 instanceof PublicKeyCredential)) return { data: null, error: new ij("Browser returned unexpected credential type", t10) };
          return { data: t10, error: null };
        } catch (t10) {
          return { data: null, error: function({ error: e11, options: t11 }) {
            var r10, n10, i10;
            let { publicKey: s2 } = t11;
            if (!s2) throw Error("options was missing required publicKey property");
            if ("AbortError" === e11.name) {
              if (t11.signal instanceof AbortSignal) return new iA({ message: "Registration ceremony was sent an abort signal", code: "ERROR_CEREMONY_ABORTED", cause: e11 });
            } else if ("ConstraintError" === e11.name) {
              if ((null == (r10 = s2.authenticatorSelection) ? void 0 : r10.requireResidentKey) === true) return new iA({ message: "Discoverable credentials were required but no available authenticator supported it", code: "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT", cause: e11 });
              else if ("conditional" === t11.mediation && (null == (n10 = s2.authenticatorSelection) ? void 0 : n10.userVerification) === "required") return new iA({ message: "User verification was required during automatic registration but it could not be performed", code: "ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE", cause: e11 });
              else if ((null == (i10 = s2.authenticatorSelection) ? void 0 : i10.userVerification) === "required") return new iA({ message: "User verification was required but no available authenticator supported it", code: "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT", cause: e11 });
            } else if ("InvalidStateError" === e11.name) return new iA({ message: "The authenticator was previously registered", code: "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED", cause: e11 });
            else if ("NotAllowedError" === e11.name) return new iA({ message: e11.message, code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
            else if ("NotSupportedError" === e11.name) return new iA(0 === s2.pubKeyCredParams.filter((e12) => "public-key" === e12.type).length ? { message: 'No entry in pubKeyCredParams was of type "public-key"', code: "ERROR_MALFORMED_PUBKEYCREDPARAMS", cause: e11 } : { message: "No available authenticator supported any of the specified pubKeyCredParams algorithms", code: "ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG", cause: e11 });
            else if ("SecurityError" === e11.name) {
              let t12 = window.location.hostname;
              if (!iN(t12)) return new iA({ message: `${window.location.hostname} is an invalid domain`, code: "ERROR_INVALID_DOMAIN", cause: e11 });
              if (s2.rp.id !== t12) return new iA({ message: `The RP ID "${s2.rp.id}" is invalid for this domain`, code: "ERROR_INVALID_RP_ID", cause: e11 });
            } else if ("TypeError" === e11.name) {
              if (s2.user.id.byteLength < 1 || s2.user.id.byteLength > 64) return new iA({ message: "User ID was not between 1 and 64 characters", code: "ERROR_INVALID_USER_ID_LENGTH", cause: e11 });
            } else if ("UnknownError" === e11.name) return new iA({ message: "The authenticator was unable to process the specified options, or could not create a new credential", code: "ERROR_AUTHENTICATOR_GENERAL_ERROR", cause: e11 });
            return new iA({ message: "a Non-Webauthn related error has occurred", code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
          }({ error: t10, options: e10 }) };
        }
      }
      async function iD(e10) {
        try {
          let t10 = await navigator.credentials.get(e10);
          if (!t10) return { data: null, error: new ij("Empty credential response", t10) };
          if (!(t10 instanceof PublicKeyCredential)) return { data: null, error: new ij("Browser returned unexpected credential type", t10) };
          return { data: t10, error: null };
        } catch (t10) {
          return { data: null, error: function({ error: e11, options: t11 }) {
            let { publicKey: r10 } = t11;
            if (!r10) throw Error("options was missing required publicKey property");
            if ("AbortError" === e11.name) {
              if (t11.signal instanceof AbortSignal) return new iA({ message: "Authentication ceremony was sent an abort signal", code: "ERROR_CEREMONY_ABORTED", cause: e11 });
            } else if ("NotAllowedError" === e11.name) return new iA({ message: e11.message, code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
            else if ("SecurityError" === e11.name) {
              let t12 = window.location.hostname;
              if (!iN(t12)) return new iA({ message: `${window.location.hostname} is an invalid domain`, code: "ERROR_INVALID_DOMAIN", cause: e11 });
              if (r10.rpId !== t12) return new iA({ message: `The RP ID "${r10.rpId}" is invalid for this domain`, code: "ERROR_INVALID_RP_ID", cause: e11 });
            } else if ("UnknownError" === e11.name) return new iA({ message: "The authenticator was unable to process the specified options, or could not create a new assertion signature", code: "ERROR_AUTHENTICATOR_GENERAL_ERROR", cause: e11 });
            return new iA({ message: "a Non-Webauthn related error has occurred", code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
          }({ error: t10, options: e10 }) };
        }
      }
      let iU = { hints: ["security-key"], authenticatorSelection: { authenticatorAttachment: "cross-platform", requireResidentKey: false, userVerification: "preferred", residentKey: "discouraged" }, attestation: "direct" }, iL = { userVerification: "preferred", hints: ["security-key"], attestation: "direct" };
      function iM(...e10) {
        let t10 = (e11) => null !== e11 && "object" == typeof e11 && !Array.isArray(e11), r10 = (e11) => e11 instanceof ArrayBuffer || ArrayBuffer.isView(e11), n10 = {};
        for (let i10 of e10) if (i10) for (let e11 in i10) {
          let s2 = i10[e11];
          if (void 0 !== s2) if (Array.isArray(s2)) n10[e11] = s2;
          else if (r10(s2)) n10[e11] = s2;
          else if (t10(s2)) {
            let r11 = n10[e11];
            t10(r11) ? n10[e11] = iM(r11, s2) : n10[e11] = iM(s2);
          } else n10[e11] = s2;
        }
        return n10;
      }
      class iB {
        constructor(e10) {
          this.client = e10, this.enroll = this._enroll.bind(this), this.challenge = this._challenge.bind(this), this.verify = this._verify.bind(this), this.authenticate = this._authenticate.bind(this), this.register = this._register.bind(this);
        }
        async _enroll(e10) {
          return this.client.mfa.enroll(Object.assign(Object.assign({}, e10), { factorType: "webauthn" }));
        }
        async _challenge({ factorId: e10, webauthn: t10, friendlyName: r10, signal: n10 }, i10) {
          try {
            var s2, a2, o2, l2;
            let { data: u2, error: c2 } = await this.client.mfa.challenge({ factorId: e10, webauthn: t10 });
            if (!u2) return { data: null, error: c2 };
            let h2 = null != n10 ? n10 : iI.createNewAbortSignal();
            if ("create" === u2.webauthn.type) {
              let { user: e11 } = u2.webauthn.credential_options.publicKey;
              e11.name || (e11.name = `${e11.id}:${r10}`), e11.displayName || (e11.displayName = e11.name);
            }
            switch (u2.webauthn.type) {
              case "create": {
                let t11 = (s2 = u2.webauthn.credential_options.publicKey, a2 = null == i10 ? void 0 : i10.create, iM(iU, s2, a2 || {})), { data: r11, error: n11 } = await i$({ publicKey: t11, signal: h2 });
                if (r11) return { data: { factorId: e10, challengeId: u2.id, webauthn: { type: u2.webauthn.type, credential_response: r11 } }, error: null };
                return { data: null, error: n11 };
              }
              case "request": {
                let t11 = (o2 = u2.webauthn.credential_options.publicKey, l2 = null == i10 ? void 0 : i10.request, iM(iL, o2, l2 || {})), { data: r11, error: n11 } = await iD(Object.assign(Object.assign({}, u2.webauthn.credential_options), { publicKey: t11, signal: h2 }));
                if (r11) return { data: { factorId: e10, challengeId: u2.id, webauthn: { type: u2.webauthn.type, credential_response: r11 } }, error: null };
                return { data: null, error: n11 };
              }
            }
          } catch (e11) {
            if (nq(e11)) return { data: null, error: e11 };
            return { data: null, error: new nV("Unexpected error in challenge", e11) };
          }
        }
        async _verify({ challengeId: e10, factorId: t10, webauthn: r10 }) {
          return this.client.mfa.verify({ factorId: t10, challengeId: e10, webauthn: r10 });
        }
        async _authenticate({ factorId: e10, webauthn: { rpId: t10, rpOrigins: r10, signal: n10 } = {} }, i10) {
          if (!t10) return { data: null, error: new nB("rpId is required for WebAuthn authentication") };
          try {
            1;
            return { data: null, error: new nV("Browser does not support WebAuthn", null) };
          } catch (e11) {
            if (nq(e11)) return { data: null, error: e11 };
            return { data: null, error: new nV("Unexpected error in authenticate", e11) };
          }
        }
        async _register({ friendlyName: e10, webauthn: { rpId: t10, rpOrigins: r10, signal: n10 } = {} }, i10) {
          if (!t10) return { data: null, error: new nB("rpId is required for WebAuthn registration") };
          try {
            1;
            return { data: null, error: new nV("Browser does not support WebAuthn", null) };
          } catch (e11) {
            if (nq(e11)) return { data: null, error: e11 };
            return { data: null, error: new nV("Unexpected error in register", e11) };
          }
        }
      }
      if ("object" != typeof globalThis) try {
        Object.defineProperty(Object.prototype, "__magic__", { get: function() {
          return this;
        }, configurable: true }), __magic__.globalThis = __magic__, delete Object.prototype.__magic__;
      } catch (e10) {
        "u" > typeof self && (self.globalThis = self);
      }
      let iq = { url: "http://localhost:9999", storageKey: "supabase.auth.token", autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, headers: nD, flowType: "implicit", debug: false, hasCustomAuthorizationHeader: false, throwOnError: false };
      async function iH(e10, t10, r10) {
        return await r10();
      }
      let iV = {};
      class iF {
        get jwks() {
          var e10, t10;
          return null != (t10 = null == (e10 = iV[this.storageKey]) ? void 0 : e10.jwks) ? t10 : { keys: [] };
        }
        set jwks(e10) {
          iV[this.storageKey] = Object.assign(Object.assign({}, iV[this.storageKey]), { jwks: e10 });
        }
        get jwks_cached_at() {
          var e10, t10;
          return null != (t10 = null == (e10 = iV[this.storageKey]) ? void 0 : e10.cachedAt) ? t10 : Number.MIN_SAFE_INTEGER;
        }
        set jwks_cached_at(e10) {
          iV[this.storageKey] = Object.assign(Object.assign({}, iV[this.storageKey]), { cachedAt: e10 });
        }
        constructor(e10) {
          var t10;
          this.userStorage = null, this.memoryStorage = null, this.stateChangeEmitters = /* @__PURE__ */ new Map(), this.autoRefreshTicker = null, this.visibilityChangedCallback = null, this.refreshingDeferred = null, this.initializePromise = null, this.detectSessionInUrl = true, this.hasCustomAuthorizationHeader = false, this.suppressGetSessionWarning = false, this.lockAcquired = false, this.pendingInLock = [], this.broadcastChannel = null, this.logger = console.log;
          const r10 = Object.assign(Object.assign({}, iq), e10);
          this.storageKey = r10.storageKey, this.instanceID = null != (t10 = iF.nextInstanceID[this.storageKey]) ? t10 : 0, iF.nextInstanceID[this.storageKey] = this.instanceID + 1, this.logDebugMessages = !!r10.debug, "function" == typeof r10.debug && (this.logger = r10.debug), this.instanceID, this.persistSession = r10.persistSession, this.autoRefreshToken = r10.autoRefreshToken, this.admin = new ix({ url: r10.url, headers: r10.headers, fetch: r10.fetch }), this.url = r10.url, this.headers = r10.headers, this.fetch = n9(r10.fetch), this.lock = r10.lock || iH, this.detectSessionInUrl = r10.detectSessionInUrl, this.flowType = r10.flowType, this.hasCustomAuthorizationHeader = r10.hasCustomAuthorizationHeader, this.throwOnError = r10.throwOnError, r10.lock ? this.lock = r10.lock : this.lock = iH, this.jwks || (this.jwks = { keys: [] }, this.jwks_cached_at = Number.MIN_SAFE_INTEGER), this.mfa = { verify: this._verify.bind(this), enroll: this._enroll.bind(this), unenroll: this._unenroll.bind(this), challenge: this._challenge.bind(this), listFactors: this._listFactors.bind(this), challengeAndVerify: this._challengeAndVerify.bind(this), getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this), webauthn: new iB(this) }, this.oauth = { getAuthorizationDetails: this._getAuthorizationDetails.bind(this), approveAuthorization: this._approveAuthorization.bind(this), denyAuthorization: this._denyAuthorization.bind(this) }, this.persistSession ? (r10.storage ? this.storage = r10.storage : (this.memoryStorage = {}, this.storage = ik(this.memoryStorage)), r10.userStorage && (this.userStorage = r10.userStorage)) : (this.memoryStorage = {}, this.storage = ik(this.memoryStorage)), this.initialize();
        }
        isThrowOnErrorEnabled() {
          return this.throwOnError;
        }
        _returnResult(e10) {
          if (this.throwOnError && e10 && e10.error) throw e10.error;
          return e10;
        }
        _logPrefix() {
          return `GoTrueClient@${this.storageKey}:${this.instanceID} (${n$}) ${(/* @__PURE__ */ new Date()).toISOString()}`;
        }
        _debug(...e10) {
          return this.logDebugMessages && this.logger(this._logPrefix(), ...e10), this;
        }
        async initialize() {
          return this.initializePromise || (this.initializePromise = (async () => await this._acquireLock(-1, async () => await this._initialize()))()), await this.initializePromise;
        }
        async _initialize() {
          try {
            return await this._recoverAndRefresh(), { error: null };
          } catch (e10) {
            if (nq(e10)) return this._returnResult({ error: e10 });
            return this._returnResult({ error: new nV("Unexpected error during initialization", e10) });
          } finally {
            await this._handleVisibilityChange(), this._debug("#_initialize()", "end");
          }
        }
        async signInAnonymously(e10) {
          var t10, r10, n10;
          try {
            let { data: i10, error: s2 } = await ib(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, body: { data: null != (r10 = null == (t10 = null == e10 ? void 0 : e10.options) ? void 0 : t10.data) ? r10 : {}, gotrue_meta_security: { captcha_token: null == (n10 = null == e10 ? void 0 : e10.options) ? void 0 : n10.captchaToken } }, xform: i_ });
            if (s2 || !i10) return this._returnResult({ data: { user: null, session: null }, error: s2 });
            let a2 = i10.session, o2 = i10.user;
            return i10.session && (await this._saveSession(i10.session), await this._notifyAllSubscribers("SIGNED_IN", a2)), this._returnResult({ data: { user: o2, session: a2 }, error: null });
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signUp(e10) {
          var t10, r10, n10;
          try {
            let i10;
            if ("email" in e10) {
              let { email: r11, password: n11, options: s3 } = e10, a3 = null, o3 = null;
              "pkce" === this.flowType && ([a3, o3] = await il(this.storage, this.storageKey)), i10 = await ib(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, redirectTo: null == s3 ? void 0 : s3.emailRedirectTo, body: { email: r11, password: n11, data: null != (t10 = null == s3 ? void 0 : s3.data) ? t10 : {}, gotrue_meta_security: { captcha_token: null == s3 ? void 0 : s3.captchaToken }, code_challenge: a3, code_challenge_method: o3 }, xform: i_ });
            } else if ("phone" in e10) {
              let { phone: t11, password: s3, options: a3 } = e10;
              i10 = await ib(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, body: { phone: t11, password: s3, data: null != (r10 = null == a3 ? void 0 : a3.data) ? r10 : {}, channel: null != (n10 = null == a3 ? void 0 : a3.channel) ? n10 : "sms", gotrue_meta_security: { captcha_token: null == a3 ? void 0 : a3.captchaToken } }, xform: i_ });
            } else throw new nz("You must provide either an email or phone number and a password");
            let { data: s2, error: a2 } = i10;
            if (a2 || !s2) return this._returnResult({ data: { user: null, session: null }, error: a2 });
            let o2 = s2.session, l2 = s2.user;
            return s2.session && (await this._saveSession(s2.session), await this._notifyAllSubscribers("SIGNED_IN", o2)), this._returnResult({ data: { user: l2, session: o2 }, error: null });
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithPassword(e10) {
          try {
            let t10;
            if ("email" in e10) {
              let { email: r11, password: n11, options: i10 } = e10;
              t10 = await ib(this.fetch, "POST", `${this.url}/token?grant_type=password`, { headers: this.headers, body: { email: r11, password: n11, gotrue_meta_security: { captcha_token: null == i10 ? void 0 : i10.captchaToken } }, xform: iw });
            } else if ("phone" in e10) {
              let { phone: r11, password: n11, options: i10 } = e10;
              t10 = await ib(this.fetch, "POST", `${this.url}/token?grant_type=password`, { headers: this.headers, body: { phone: r11, password: n11, gotrue_meta_security: { captcha_token: null == i10 ? void 0 : i10.captchaToken } }, xform: iw });
            } else throw new nz("You must provide either an email or phone number and a password");
            let { data: r10, error: n10 } = t10;
            if (n10) return this._returnResult({ data: { user: null, session: null }, error: n10 });
            if (!r10 || !r10.session || !r10.user) {
              let e11 = new nW();
              return this._returnResult({ data: { user: null, session: null }, error: e11 });
            }
            return r10.session && (await this._saveSession(r10.session), await this._notifyAllSubscribers("SIGNED_IN", r10.session)), this._returnResult({ data: Object.assign({ user: r10.user, session: r10.session }, r10.weak_password ? { weakPassword: r10.weak_password } : null), error: n10 });
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithOAuth(e10) {
          var t10, r10, n10, i10;
          return await this._handleProviderSignIn(e10.provider, { redirectTo: null == (t10 = e10.options) ? void 0 : t10.redirectTo, scopes: null == (r10 = e10.options) ? void 0 : r10.scopes, queryParams: null == (n10 = e10.options) ? void 0 : n10.queryParams, skipBrowserRedirect: null == (i10 = e10.options) ? void 0 : i10.skipBrowserRedirect });
        }
        async exchangeCodeForSession(e10) {
          return await this.initializePromise, this._acquireLock(-1, async () => this._exchangeCodeForSession(e10));
        }
        async signInWithWeb3(e10) {
          let { chain: t10 } = e10;
          switch (t10) {
            case "ethereum":
              return await this.signInWithEthereum(e10);
            case "solana":
              return await this.signInWithSolana(e10);
            default:
              throw Error(`@supabase/auth-js: Unsupported chain "${t10}"`);
          }
        }
        async signInWithEthereum(e10) {
          var t10, r10, n10, i10, s2, a2, o2, l2, u2, c2, h2, d2;
          let f2, p2;
          if ("message" in e10) f2 = e10.message, p2 = e10.signature;
          else {
            let { chain: c3, wallet: h3, statement: g2, options: m2 } = e10;
            if ("object" != typeof h3 || !(null == m2 ? void 0 : m2.url)) throw Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
            let v2 = new URL(null != (t10 = null == m2 ? void 0 : m2.url) ? t10 : window.location.href), b2 = await h3.request({ method: "eth_requestAccounts" }).then((e11) => e11).catch(() => {
              throw Error("@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid");
            });
            if (!b2 || 0 === b2.length) throw Error("@supabase/auth-js: No accounts available. Please ensure the wallet is connected.");
            let y2 = iP(b2[0]), _2 = null == (r10 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : r10.chainId;
            _2 || (_2 = parseInt(await h3.request({ method: "eth_chainId" }), 16)), f2 = function(e11) {
              var t11;
              let { chainId: r11, domain: n11, expirationTime: i11, issuedAt: s3 = /* @__PURE__ */ new Date(), nonce: a3, notBefore: o3, requestId: l3, resources: u3, scheme: c4, uri: h4, version: d3 } = e11;
              if (!Number.isInteger(r11)) throw Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${r11}`);
              if (!n11) throw Error('@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.');
              if (a3 && a3.length < 8) throw Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${a3}`);
              if (!h4) throw Error('@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.');
              if ("1" !== d3) throw Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${d3}`);
              if (null == (t11 = e11.statement) ? void 0 : t11.includes("\n")) throw Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${e11.statement}`);
              let f3 = iP(e11.address), p3 = c4 ? `${c4}://${n11}` : n11, g3 = e11.statement ? `${e11.statement}
` : "", m3 = `${p3} wants you to sign in with your Ethereum account:
${f3}

${g3}`, v3 = `URI: ${h4}
Version: ${d3}
Chain ID: ${r11}${a3 ? `
Nonce: ${a3}` : ""}
Issued At: ${s3.toISOString()}`;
              if (i11 && (v3 += `
Expiration Time: ${i11.toISOString()}`), o3 && (v3 += `
Not Before: ${o3.toISOString()}`), l3 && (v3 += `
Request ID: ${l3}`), u3) {
                let e12 = "\nResources:";
                for (let t12 of u3) {
                  if (!t12 || "string" != typeof t12) throw Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${t12}`);
                  e12 += `
- ${t12}`;
                }
                v3 += e12;
              }
              return `${m3}
${v3}`;
            }({ domain: v2.host, address: y2, statement: g2, uri: v2.href, version: "1", chainId: _2, nonce: null == (n10 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : n10.nonce, issuedAt: null != (s2 = null == (i10 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : i10.issuedAt) ? s2 : /* @__PURE__ */ new Date(), expirationTime: null == (a2 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : a2.expirationTime, notBefore: null == (o2 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : o2.notBefore, requestId: null == (l2 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : l2.requestId, resources: null == (u2 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : u2.resources }), p2 = await h3.request({ method: "personal_sign", params: [(d2 = f2, "0x" + Array.from(new TextEncoder().encode(d2), (e11) => e11.toString(16).padStart(2, "0")).join("")), y2] });
          }
          try {
            let { data: t11, error: r11 } = await ib(this.fetch, "POST", `${this.url}/token?grant_type=web3`, { headers: this.headers, body: Object.assign({ chain: "ethereum", message: f2, signature: p2 }, (null == (c2 = e10.options) ? void 0 : c2.captchaToken) ? { gotrue_meta_security: { captcha_token: null == (h2 = e10.options) ? void 0 : h2.captchaToken } } : null), xform: i_ });
            if (r11) throw r11;
            if (!t11 || !t11.session || !t11.user) {
              let e11 = new nW();
              return this._returnResult({ data: { user: null, session: null }, error: e11 });
            }
            return t11.session && (await this._saveSession(t11.session), await this._notifyAllSubscribers("SIGNED_IN", t11.session)), this._returnResult({ data: Object.assign({}, t11), error: r11 });
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithSolana(e10) {
          var t10, r10, n10, i10, s2, a2, o2, l2, u2, c2, h2, d2;
          let f2, p2;
          if ("message" in e10) f2 = e10.message, p2 = e10.signature;
          else {
            let { chain: h3, wallet: d3, statement: g2, options: m2 } = e10;
            if ("object" != typeof d3 || !(null == m2 ? void 0 : m2.url)) throw Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
            let v2 = new URL(null != (t10 = null == m2 ? void 0 : m2.url) ? t10 : window.location.href);
            if ("signIn" in d3 && d3.signIn) {
              let e11, t11 = await d3.signIn(Object.assign(Object.assign(Object.assign({ issuedAt: (/* @__PURE__ */ new Date()).toISOString() }, null == m2 ? void 0 : m2.signInWithSolana), { version: "1", domain: v2.host, uri: v2.href }), g2 ? { statement: g2 } : null));
              if (Array.isArray(t11) && t11[0] && "object" == typeof t11[0]) e11 = t11[0];
              else if (t11 && "object" == typeof t11 && "signedMessage" in t11 && "signature" in t11) e11 = t11;
              else throw Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");
              if ("signedMessage" in e11 && "signature" in e11 && ("string" == typeof e11.signedMessage || e11.signedMessage instanceof Uint8Array) && e11.signature instanceof Uint8Array) f2 = "string" == typeof e11.signedMessage ? e11.signedMessage : new TextDecoder().decode(e11.signedMessage), p2 = e11.signature;
              else throw Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields");
            } else {
              if (!("signMessage" in d3) || "function" != typeof d3.signMessage || !("publicKey" in d3) || "object" != typeof d3 || !d3.publicKey || !("toBase58" in d3.publicKey) || "function" != typeof d3.publicKey.toBase58) throw Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");
              f2 = [`${v2.host} wants you to sign in with your Solana account:`, d3.publicKey.toBase58(), ...g2 ? ["", g2, ""] : [""], "Version: 1", `URI: ${v2.href}`, `Issued At: ${null != (n10 = null == (r10 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : r10.issuedAt) ? n10 : (/* @__PURE__ */ new Date()).toISOString()}`, ...(null == (i10 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : i10.notBefore) ? [`Not Before: ${m2.signInWithSolana.notBefore}`] : [], ...(null == (s2 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : s2.expirationTime) ? [`Expiration Time: ${m2.signInWithSolana.expirationTime}`] : [], ...(null == (a2 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : a2.chainId) ? [`Chain ID: ${m2.signInWithSolana.chainId}`] : [], ...(null == (o2 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : o2.nonce) ? [`Nonce: ${m2.signInWithSolana.nonce}`] : [], ...(null == (l2 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : l2.requestId) ? [`Request ID: ${m2.signInWithSolana.requestId}`] : [], ...(null == (c2 = null == (u2 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : u2.resources) ? void 0 : c2.length) ? ["Resources", ...m2.signInWithSolana.resources.map((e12) => `- ${e12}`)] : []].join("\n");
              let e11 = await d3.signMessage(new TextEncoder().encode(f2), "utf8");
              if (!e11 || !(e11 instanceof Uint8Array)) throw Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");
              p2 = e11;
            }
          }
          try {
            let { data: t11, error: r11 } = await ib(this.fetch, "POST", `${this.url}/token?grant_type=web3`, { headers: this.headers, body: Object.assign({ chain: "solana", message: f2, signature: n6(p2) }, (null == (h2 = e10.options) ? void 0 : h2.captchaToken) ? { gotrue_meta_security: { captcha_token: null == (d2 = e10.options) ? void 0 : d2.captchaToken } } : null), xform: i_ });
            if (r11) throw r11;
            if (!t11 || !t11.session || !t11.user) {
              let e11 = new nW();
              return this._returnResult({ data: { user: null, session: null }, error: e11 });
            }
            return t11.session && (await this._saveSession(t11.session), await this._notifyAllSubscribers("SIGNED_IN", t11.session)), this._returnResult({ data: Object.assign({}, t11), error: r11 });
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async _exchangeCodeForSession(e10) {
          let t10 = await n7(this.storage, `${this.storageKey}-code-verifier`), [r10, n10] = (null != t10 ? t10 : "").split("/");
          try {
            let { data: t11, error: i10 } = await ib(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, { headers: this.headers, body: { auth_code: e10, code_verifier: r10 }, xform: i_ });
            if (await ie(this.storage, `${this.storageKey}-code-verifier`), i10) throw i10;
            if (!t11 || !t11.session || !t11.user) {
              let e11 = new nW();
              return this._returnResult({ data: { user: null, session: null, redirectType: null }, error: e11 });
            }
            return t11.session && (await this._saveSession(t11.session), await this._notifyAllSubscribers("SIGNED_IN", t11.session)), this._returnResult({ data: Object.assign(Object.assign({}, t11), { redirectType: null != n10 ? n10 : null }), error: i10 });
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: { user: null, session: null, redirectType: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithIdToken(e10) {
          try {
            let { options: t10, provider: r10, token: n10, access_token: i10, nonce: s2 } = e10, { data: a2, error: o2 } = await ib(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, { headers: this.headers, body: { provider: r10, id_token: n10, access_token: i10, nonce: s2, gotrue_meta_security: { captcha_token: null == t10 ? void 0 : t10.captchaToken } }, xform: i_ });
            if (o2) return this._returnResult({ data: { user: null, session: null }, error: o2 });
            if (!a2 || !a2.session || !a2.user) {
              let e11 = new nW();
              return this._returnResult({ data: { user: null, session: null }, error: e11 });
            }
            return a2.session && (await this._saveSession(a2.session), await this._notifyAllSubscribers("SIGNED_IN", a2.session)), this._returnResult({ data: a2, error: o2 });
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithOtp(e10) {
          var t10, r10, n10, i10, s2;
          try {
            if ("email" in e10) {
              let { email: n11, options: i11 } = e10, s3 = null, a2 = null;
              "pkce" === this.flowType && ([s3, a2] = await il(this.storage, this.storageKey));
              let { error: o2 } = await ib(this.fetch, "POST", `${this.url}/otp`, { headers: this.headers, body: { email: n11, data: null != (t10 = null == i11 ? void 0 : i11.data) ? t10 : {}, create_user: null == (r10 = null == i11 ? void 0 : i11.shouldCreateUser) || r10, gotrue_meta_security: { captcha_token: null == i11 ? void 0 : i11.captchaToken }, code_challenge: s3, code_challenge_method: a2 }, redirectTo: null == i11 ? void 0 : i11.emailRedirectTo });
              return this._returnResult({ data: { user: null, session: null }, error: o2 });
            }
            if ("phone" in e10) {
              let { phone: t11, options: r11 } = e10, { data: a2, error: o2 } = await ib(this.fetch, "POST", `${this.url}/otp`, { headers: this.headers, body: { phone: t11, data: null != (n10 = null == r11 ? void 0 : r11.data) ? n10 : {}, create_user: null == (i10 = null == r11 ? void 0 : r11.shouldCreateUser) || i10, gotrue_meta_security: { captcha_token: null == r11 ? void 0 : r11.captchaToken }, channel: null != (s2 = null == r11 ? void 0 : r11.channel) ? s2 : "sms" } });
              return this._returnResult({ data: { user: null, session: null, messageId: null == a2 ? void 0 : a2.message_id }, error: o2 });
            }
            throw new nz("You must provide either an email or phone number.");
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async verifyOtp(e10) {
          var t10, r10;
          try {
            let n10, i10;
            "options" in e10 && (n10 = null == (t10 = e10.options) ? void 0 : t10.redirectTo, i10 = null == (r10 = e10.options) ? void 0 : r10.captchaToken);
            let { data: s2, error: a2 } = await ib(this.fetch, "POST", `${this.url}/verify`, { headers: this.headers, body: Object.assign(Object.assign({}, e10), { gotrue_meta_security: { captcha_token: i10 } }), redirectTo: n10, xform: i_ });
            if (a2) throw a2;
            if (!s2) throw Error("An error occurred on token verification.");
            let o2 = s2.session, l2 = s2.user;
            return (null == o2 ? void 0 : o2.access_token) && (await this._saveSession(o2), await this._notifyAllSubscribers("recovery" == e10.type ? "PASSWORD_RECOVERY" : "SIGNED_IN", o2)), this._returnResult({ data: { user: l2, session: o2 }, error: null });
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithSSO(e10) {
          var t10, r10, n10, i10;
          try {
            let s2 = null, a2 = null;
            "pkce" === this.flowType && ([s2, a2] = await il(this.storage, this.storageKey));
            let o2 = await ib(this.fetch, "POST", `${this.url}/sso`, { body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in e10 ? { provider_id: e10.providerId } : null), "domain" in e10 ? { domain: e10.domain } : null), { redirect_to: null != (r10 = null == (t10 = e10.options) ? void 0 : t10.redirectTo) ? r10 : void 0 }), (null == (n10 = null == e10 ? void 0 : e10.options) ? void 0 : n10.captchaToken) ? { gotrue_meta_security: { captcha_token: e10.options.captchaToken } } : null), { skip_http_redirect: true, code_challenge: s2, code_challenge_method: a2 }), headers: this.headers, xform: iS });
            return null == (i10 = o2.data) || i10.url, this._returnResult(o2);
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async reauthenticate() {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._reauthenticate());
        }
        async _reauthenticate() {
          try {
            return await this._useSession(async (e10) => {
              let { data: { session: t10 }, error: r10 } = e10;
              if (r10) throw r10;
              if (!t10) throw new nG();
              let { error: n10 } = await ib(this.fetch, "GET", `${this.url}/reauthenticate`, { headers: this.headers, jwt: t10.access_token });
              return this._returnResult({ data: { user: null, session: null }, error: n10 });
            });
          } catch (e10) {
            if (nq(e10)) return this._returnResult({ data: { user: null, session: null }, error: e10 });
            throw e10;
          }
        }
        async resend(e10) {
          try {
            let t10 = `${this.url}/resend`;
            if ("email" in e10) {
              let { email: r10, type: n10, options: i10 } = e10, { error: s2 } = await ib(this.fetch, "POST", t10, { headers: this.headers, body: { email: r10, type: n10, gotrue_meta_security: { captcha_token: null == i10 ? void 0 : i10.captchaToken } }, redirectTo: null == i10 ? void 0 : i10.emailRedirectTo });
              return this._returnResult({ data: { user: null, session: null }, error: s2 });
            }
            if ("phone" in e10) {
              let { phone: r10, type: n10, options: i10 } = e10, { data: s2, error: a2 } = await ib(this.fetch, "POST", t10, { headers: this.headers, body: { phone: r10, type: n10, gotrue_meta_security: { captcha_token: null == i10 ? void 0 : i10.captchaToken } } });
              return this._returnResult({ data: { user: null, session: null, messageId: null == s2 ? void 0 : s2.message_id }, error: a2 });
            }
            throw new nz("You must provide either an email or phone number and a type");
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async getSession() {
          return await this.initializePromise, await this._acquireLock(-1, async () => this._useSession(async (e10) => e10));
        }
        async _acquireLock(e10, t10) {
          this._debug("#_acquireLock", "begin", e10);
          try {
            if (this.lockAcquired) {
              let e11 = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve(), r10 = (async () => (await e11, await t10()))();
              return this.pendingInLock.push((async () => {
                try {
                  await r10;
                } catch (e12) {
                }
              })()), r10;
            }
            return await this.lock(`lock:${this.storageKey}`, e10, async () => {
              this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
              try {
                this.lockAcquired = true;
                let e11 = t10();
                for (this.pendingInLock.push((async () => {
                  try {
                    await e11;
                  } catch (e12) {
                  }
                })()), await e11; this.pendingInLock.length; ) {
                  let e12 = [...this.pendingInLock];
                  await Promise.all(e12), this.pendingInLock.splice(0, e12.length);
                }
                return await e11;
              } finally {
                this._debug("#_acquireLock", "lock released for storage key", this.storageKey), this.lockAcquired = false;
              }
            });
          } finally {
            this._debug("#_acquireLock", "end");
          }
        }
        async _useSession(e10) {
          this._debug("#_useSession", "begin");
          try {
            let t10 = await this.__loadSession();
            return await e10(t10);
          } finally {
            this._debug("#_useSession", "end");
          }
        }
        async __loadSession() {
          this._debug("#__loadSession()", "begin"), this.lockAcquired || this._debug("#__loadSession()", "used outside of an acquired lock!", Error().stack);
          try {
            let t10 = null, r10 = await n7(this.storage, this.storageKey);
            if (this._debug("#getSession()", "session from storage", r10), null !== r10 && (this._isValidSession(r10) ? t10 = r10 : (this._debug("#getSession()", "session from storage is not valid"), await this._removeSession())), !t10) return { data: { session: null }, error: null };
            let n10 = !!t10.expires_at && 1e3 * t10.expires_at - Date.now() < 9e4;
            if (this._debug("#__loadSession()", `session has${n10 ? "" : " not"} expired`, "expires_at", t10.expires_at), !n10) {
              if (this.userStorage) {
                let e11 = await n7(this.userStorage, this.storageKey + "-user");
                (null == e11 ? void 0 : e11.user) ? t10.user = e11.user : t10.user = id();
              }
              if (this.storage.isServer && t10.user && !t10.user.__isUserNotAvailableProxy) {
                var e10;
                let r11 = { value: this.suppressGetSessionWarning };
                t10.user = (e10 = t10.user, new Proxy(e10, { get: (e11, t11, n11) => {
                  if ("__isInsecureUserWarningProxy" === t11) return true;
                  if ("symbol" == typeof t11) {
                    let r12 = t11.toString();
                    if ("Symbol(Symbol.toPrimitive)" === r12 || "Symbol(Symbol.toStringTag)" === r12 || "Symbol(util.inspect.custom)" === r12 || "Symbol(nodejs.util.inspect.custom)" === r12) return Reflect.get(e11, t11, n11);
                  }
                  return r11.value || "string" != typeof t11 || (console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server."), r11.value = true), Reflect.get(e11, t11, n11);
                } })), r11.value && (this.suppressGetSessionWarning = true);
              }
              return { data: { session: t10 }, error: null };
            }
            let { data: i10, error: s2 } = await this._callRefreshToken(t10.refresh_token);
            if (s2) return this._returnResult({ data: { session: null }, error: s2 });
            return this._returnResult({ data: { session: i10 }, error: null });
          } finally {
            this._debug("#__loadSession()", "end");
          }
        }
        async getUser(e10) {
          return e10 ? await this._getUser(e10) : (await this.initializePromise, await this._acquireLock(-1, async () => await this._getUser()));
        }
        async _getUser(e10) {
          try {
            if (e10) return await ib(this.fetch, "GET", `${this.url}/user`, { headers: this.headers, jwt: e10, xform: iE });
            return await this._useSession(async (e11) => {
              var t10, r10, n10;
              let { data: i10, error: s2 } = e11;
              if (s2) throw s2;
              return (null == (t10 = i10.session) ? void 0 : t10.access_token) || this.hasCustomAuthorizationHeader ? await ib(this.fetch, "GET", `${this.url}/user`, { headers: this.headers, jwt: null != (n10 = null == (r10 = i10.session) ? void 0 : r10.access_token) ? n10 : void 0, xform: iE }) : { data: { user: null }, error: new nG() };
            });
          } catch (e11) {
            if (nq(e11)) return nq(e11) && "AuthSessionMissingError" === e11.name && (await this._removeSession(), await ie(this.storage, `${this.storageKey}-code-verifier`)), this._returnResult({ data: { user: null }, error: e11 });
            throw e11;
          }
        }
        async updateUser(e10, t10 = {}) {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._updateUser(e10, t10));
        }
        async _updateUser(e10, t10 = {}) {
          try {
            return await this._useSession(async (r10) => {
              let { data: n10, error: i10 } = r10;
              if (i10) throw i10;
              if (!n10.session) throw new nG();
              let s2 = n10.session, a2 = null, o2 = null;
              "pkce" === this.flowType && null != e10.email && ([a2, o2] = await il(this.storage, this.storageKey));
              let { data: l2, error: u2 } = await ib(this.fetch, "PUT", `${this.url}/user`, { headers: this.headers, redirectTo: null == t10 ? void 0 : t10.emailRedirectTo, body: Object.assign(Object.assign({}, e10), { code_challenge: a2, code_challenge_method: o2 }), jwt: s2.access_token, xform: iE });
              if (u2) throw u2;
              return s2.user = l2.user, await this._saveSession(s2), await this._notifyAllSubscribers("USER_UPDATED", s2), this._returnResult({ data: { user: s2.user }, error: null });
            });
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: { user: null }, error: e11 });
            throw e11;
          }
        }
        async setSession(e10) {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._setSession(e10));
        }
        async _setSession(e10) {
          try {
            if (!e10.access_token || !e10.refresh_token) throw new nG();
            let t10 = Date.now() / 1e3, r10 = t10, n10 = true, i10 = null, { payload: s2 } = ir(e10.access_token);
            if (s2.exp && (n10 = (r10 = s2.exp) <= t10), n10) {
              let { data: t11, error: r11 } = await this._callRefreshToken(e10.refresh_token);
              if (r11) return this._returnResult({ data: { user: null, session: null }, error: r11 });
              if (!t11) return { data: { user: null, session: null }, error: null };
              i10 = t11;
            } else {
              let { data: n11, error: s3 } = await this._getUser(e10.access_token);
              if (s3) throw s3;
              i10 = { access_token: e10.access_token, refresh_token: e10.refresh_token, user: n11.user, token_type: "bearer", expires_in: r10 - t10, expires_at: r10 }, await this._saveSession(i10), await this._notifyAllSubscribers("SIGNED_IN", i10);
            }
            return this._returnResult({ data: { user: i10.user, session: i10 }, error: null });
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: { session: null, user: null }, error: e11 });
            throw e11;
          }
        }
        async refreshSession(e10) {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._refreshSession(e10));
        }
        async _refreshSession(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10;
              if (!e10) {
                let { data: n11, error: i11 } = t10;
                if (i11) throw i11;
                e10 = null != (r10 = n11.session) ? r10 : void 0;
              }
              if (!(null == e10 ? void 0 : e10.refresh_token)) throw new nG();
              let { data: n10, error: i10 } = await this._callRefreshToken(e10.refresh_token);
              return i10 ? this._returnResult({ data: { user: null, session: null }, error: i10 }) : n10 ? this._returnResult({ data: { user: n10.user, session: n10 }, error: null }) : this._returnResult({ data: { user: null, session: null }, error: null });
            });
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async _getSessionFromURL(e10, t10) {
          try {
            throw new nK("No browser detected.");
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: { session: null, redirectType: null }, error: e11 });
            throw e11;
          }
        }
        _isImplicitGrantCallback(e10) {
          return !!(e10.access_token || e10.error_description);
        }
        async _isPKCECallback(e10) {
          let t10 = await n7(this.storage, `${this.storageKey}-code-verifier`);
          return !!(e10.code && t10);
        }
        async signOut(e10 = { scope: "global" }) {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._signOut(e10));
        }
        async _signOut({ scope: e10 } = { scope: "global" }) {
          return await this._useSession(async (t10) => {
            var r10;
            let { data: n10, error: i10 } = t10;
            if (i10) return this._returnResult({ error: i10 });
            let s2 = null == (r10 = n10.session) ? void 0 : r10.access_token;
            if (s2) {
              let { error: t11 } = await this.admin.signOut(s2, e10);
              if (t11 && !(nq(t11) && "AuthApiError" === t11.name && (404 === t11.status || 401 === t11.status || 403 === t11.status))) return this._returnResult({ error: t11 });
            }
            return "others" !== e10 && (await this._removeSession(), await ie(this.storage, `${this.storageKey}-code-verifier`)), this._returnResult({ error: null });
          });
        }
        onAuthStateChange(e10) {
          let t10 = Symbol("auth-callback"), r10 = { id: t10, callback: e10, unsubscribe: () => {
            this._debug("#unsubscribe()", "state change callback with id removed", t10), this.stateChangeEmitters.delete(t10);
          } };
          return this._debug("#onAuthStateChange()", "registered callback with id", t10), this.stateChangeEmitters.set(t10, r10), (async () => {
            await this.initializePromise, await this._acquireLock(-1, async () => {
              this._emitInitialSession(t10);
            });
          })(), { data: { subscription: r10 } };
        }
        async _emitInitialSession(e10) {
          return await this._useSession(async (t10) => {
            var r10, n10;
            try {
              let { data: { session: n11 }, error: i10 } = t10;
              if (i10) throw i10;
              await (null == (r10 = this.stateChangeEmitters.get(e10)) ? void 0 : r10.callback("INITIAL_SESSION", n11)), this._debug("INITIAL_SESSION", "callback id", e10, "session", n11);
            } catch (t11) {
              await (null == (n10 = this.stateChangeEmitters.get(e10)) ? void 0 : n10.callback("INITIAL_SESSION", null)), this._debug("INITIAL_SESSION", "callback id", e10, "error", t11), console.error(t11);
            }
          });
        }
        async resetPasswordForEmail(e10, t10 = {}) {
          let r10 = null, n10 = null;
          "pkce" === this.flowType && ([r10, n10] = await il(this.storage, this.storageKey, true));
          try {
            return await ib(this.fetch, "POST", `${this.url}/recover`, { body: { email: e10, code_challenge: r10, code_challenge_method: n10, gotrue_meta_security: { captcha_token: t10.captchaToken } }, headers: this.headers, redirectTo: t10.redirectTo });
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async getUserIdentities() {
          var e10;
          try {
            let { data: t10, error: r10 } = await this.getUser();
            if (r10) throw r10;
            return this._returnResult({ data: { identities: null != (e10 = t10.user.identities) ? e10 : [] }, error: null });
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async linkIdentity(e10) {
          return "token" in e10 ? this.linkIdentityIdToken(e10) : this.linkIdentityOAuth(e10);
        }
        async linkIdentityOAuth(e10) {
          try {
            let { data: t10, error: r10 } = await this._useSession(async (t11) => {
              var r11, n10, i10, s2, a2;
              let { data: o2, error: l2 } = t11;
              if (l2) throw l2;
              let u2 = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, e10.provider, { redirectTo: null == (r11 = e10.options) ? void 0 : r11.redirectTo, scopes: null == (n10 = e10.options) ? void 0 : n10.scopes, queryParams: null == (i10 = e10.options) ? void 0 : i10.queryParams, skipBrowserRedirect: true });
              return await ib(this.fetch, "GET", u2, { headers: this.headers, jwt: null != (a2 = null == (s2 = o2.session) ? void 0 : s2.access_token) ? a2 : void 0 });
            });
            if (r10) throw r10;
            return this._returnResult({ data: { provider: e10.provider, url: null == t10 ? void 0 : t10.url }, error: null });
          } catch (t10) {
            if (nq(t10)) return this._returnResult({ data: { provider: e10.provider, url: null }, error: t10 });
            throw t10;
          }
        }
        async linkIdentityIdToken(e10) {
          return await this._useSession(async (t10) => {
            var r10;
            try {
              let { error: n10, data: { session: i10 } } = t10;
              if (n10) throw n10;
              let { options: s2, provider: a2, token: o2, access_token: l2, nonce: u2 } = e10, { data: c2, error: h2 } = await ib(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, { headers: this.headers, jwt: null != (r10 = null == i10 ? void 0 : i10.access_token) ? r10 : void 0, body: { provider: a2, id_token: o2, access_token: l2, nonce: u2, link_identity: true, gotrue_meta_security: { captcha_token: null == s2 ? void 0 : s2.captchaToken } }, xform: i_ });
              if (h2) return this._returnResult({ data: { user: null, session: null }, error: h2 });
              if (!c2 || !c2.session || !c2.user) return this._returnResult({ data: { user: null, session: null }, error: new nW() });
              return c2.session && (await this._saveSession(c2.session), await this._notifyAllSubscribers("USER_UPDATED", c2.session)), this._returnResult({ data: c2, error: h2 });
            } catch (e11) {
              if (nq(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
              throw e11;
            }
          });
        }
        async unlinkIdentity(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10, n10;
              let { data: i10, error: s2 } = t10;
              if (s2) throw s2;
              return await ib(this.fetch, "DELETE", `${this.url}/user/identities/${e10.identity_id}`, { headers: this.headers, jwt: null != (n10 = null == (r10 = i10.session) ? void 0 : r10.access_token) ? n10 : void 0 });
            });
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _refreshAccessToken(e10) {
          let t10 = `#_refreshAccessToken(${e10.substring(0, 5)}...)`;
          this._debug(t10, "begin");
          try {
            var r10, n10;
            let i10 = Date.now();
            return await (r10 = async (r11) => (r11 > 0 && await ii(200 * Math.pow(2, r11 - 1)), this._debug(t10, "refreshing attempt", r11), await ib(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, { body: { refresh_token: e10 }, headers: this.headers, xform: i_ })), n10 = (e11, t11) => {
              let r11 = 200 * Math.pow(2, e11);
              return t11 && nX(t11) && Date.now() + r11 - i10 < 3e4;
            }, new Promise((e11, t11) => {
              (async () => {
                for (let i11 = 0; i11 < 1 / 0; i11++) try {
                  let t12 = await r10(i11);
                  if (!n10(i11, null, t12)) return void e11(t12);
                } catch (e12) {
                  if (!n10(i11, e12)) return void t11(e12);
                }
              })();
            }));
          } catch (e11) {
            if (this._debug(t10, "error", e11), nq(e11)) return this._returnResult({ data: { session: null, user: null }, error: e11 });
            throw e11;
          } finally {
            this._debug(t10, "end");
          }
        }
        _isValidSession(e10) {
          return "object" == typeof e10 && null !== e10 && "access_token" in e10 && "refresh_token" in e10 && "expires_at" in e10;
        }
        async _handleProviderSignIn(e10, t10) {
          let r10 = await this._getUrlForProvider(`${this.url}/authorize`, e10, { redirectTo: t10.redirectTo, scopes: t10.scopes, queryParams: t10.queryParams });
          return this._debug("#_handleProviderSignIn()", "provider", e10, "options", t10, "url", r10), { data: { provider: e10, url: r10 }, error: null };
        }
        async _recoverAndRefresh() {
          var e10, t10;
          let r10 = "#_recoverAndRefresh()";
          this._debug(r10, "begin");
          try {
            let n10 = await n7(this.storage, this.storageKey);
            if (n10 && this.userStorage) {
              let t11 = await n7(this.userStorage, this.storageKey + "-user");
              !this.storage.isServer && Object.is(this.storage, this.userStorage) && !t11 && (t11 = { user: n10.user }, await n5(this.userStorage, this.storageKey + "-user", t11)), n10.user = null != (e10 = null == t11 ? void 0 : t11.user) ? e10 : id();
            } else if (n10 && !n10.user && !n10.user) {
              let e11 = await n7(this.storage, this.storageKey + "-user");
              e11 && (null == e11 ? void 0 : e11.user) ? (n10.user = e11.user, await ie(this.storage, this.storageKey + "-user"), await n5(this.storage, this.storageKey, n10)) : n10.user = id();
            }
            if (this._debug(r10, "session from storage", n10), !this._isValidSession(n10)) {
              this._debug(r10, "session is not valid"), null !== n10 && await this._removeSession();
              return;
            }
            let i10 = (null != (t10 = n10.expires_at) ? t10 : 1 / 0) * 1e3 - Date.now() < 9e4;
            if (this._debug(r10, `session has${i10 ? "" : " not"} expired with margin of 90000s`), i10) {
              if (this.autoRefreshToken && n10.refresh_token) {
                let { error: e11 } = await this._callRefreshToken(n10.refresh_token);
                e11 && (console.error(e11), nX(e11) || (this._debug(r10, "refresh failed with a non-retryable error, removing the session", e11), await this._removeSession()));
              }
            } else if (n10.user && true === n10.user.__isUserNotAvailableProxy) try {
              let { data: e11, error: t11 } = await this._getUser(n10.access_token);
              !t11 && (null == e11 ? void 0 : e11.user) ? (n10.user = e11.user, await this._saveSession(n10), await this._notifyAllSubscribers("SIGNED_IN", n10)) : this._debug(r10, "could not get user data, skipping SIGNED_IN notification");
            } catch (e11) {
              console.error("Error getting user data:", e11), this._debug(r10, "error getting user data, skipping SIGNED_IN notification", e11);
            }
            else await this._notifyAllSubscribers("SIGNED_IN", n10);
          } catch (e11) {
            this._debug(r10, "error", e11), console.error(e11);
            return;
          } finally {
            this._debug(r10, "end");
          }
        }
        async _callRefreshToken(e10) {
          var t10, r10;
          if (!e10) throw new nG();
          if (this.refreshingDeferred) return this.refreshingDeferred.promise;
          let n10 = `#_callRefreshToken(${e10.substring(0, 5)}...)`;
          this._debug(n10, "begin");
          try {
            this.refreshingDeferred = new it();
            let { data: t11, error: r11 } = await this._refreshAccessToken(e10);
            if (r11) throw r11;
            if (!t11.session) throw new nG();
            await this._saveSession(t11.session), await this._notifyAllSubscribers("TOKEN_REFRESHED", t11.session);
            let n11 = { data: t11.session, error: null };
            return this.refreshingDeferred.resolve(n11), n11;
          } catch (e11) {
            if (this._debug(n10, "error", e11), nq(e11)) {
              let r11 = { data: null, error: e11 };
              return nX(e11) || await this._removeSession(), null == (t10 = this.refreshingDeferred) || t10.resolve(r11), r11;
            }
            throw null == (r10 = this.refreshingDeferred) || r10.reject(e11), e11;
          } finally {
            this.refreshingDeferred = null, this._debug(n10, "end");
          }
        }
        async _notifyAllSubscribers(e10, t10, r10 = true) {
          let n10 = `#_notifyAllSubscribers(${e10})`;
          this._debug(n10, "begin", t10, `broadcast = ${r10}`);
          try {
            this.broadcastChannel && r10 && this.broadcastChannel.postMessage({ event: e10, session: t10 });
            let n11 = [], i10 = Array.from(this.stateChangeEmitters.values()).map(async (r11) => {
              try {
                await r11.callback(e10, t10);
              } catch (e11) {
                n11.push(e11);
              }
            });
            if (await Promise.all(i10), n11.length > 0) {
              for (let e11 = 0; e11 < n11.length; e11 += 1) console.error(n11[e11]);
              throw n11[0];
            }
          } finally {
            this._debug(n10, "end");
          }
        }
        async _saveSession(e10) {
          this._debug("#_saveSession()", e10), this.suppressGetSessionWarning = true;
          let t10 = Object.assign({}, e10), r10 = t10.user && true === t10.user.__isUserNotAvailableProxy;
          if (this.userStorage) {
            !r10 && t10.user && await n5(this.userStorage, this.storageKey + "-user", { user: t10.user });
            let e11 = Object.assign({}, t10);
            delete e11.user;
            let n10 = ip(e11);
            await n5(this.storage, this.storageKey, n10);
          } else {
            let e11 = ip(t10);
            await n5(this.storage, this.storageKey, e11);
          }
        }
        async _removeSession() {
          this._debug("#_removeSession()"), await ie(this.storage, this.storageKey), await ie(this.storage, this.storageKey + "-code-verifier"), await ie(this.storage, this.storageKey + "-user"), this.userStorage && await ie(this.userStorage, this.storageKey + "-user"), await this._notifyAllSubscribers("SIGNED_OUT", null);
        }
        _removeVisibilityChangedCallback() {
          this._debug("#_removeVisibilityChangedCallback()"), this.visibilityChangedCallback, this.visibilityChangedCallback = null;
        }
        async _startAutoRefresh() {
          await this._stopAutoRefresh(), this._debug("#_startAutoRefresh()");
          let e10 = setInterval(() => this._autoRefreshTokenTick(), 3e4);
          this.autoRefreshTicker = e10, e10 && "object" == typeof e10 && "function" == typeof e10.unref ? e10.unref() : "u" > typeof Deno && "function" == typeof Deno.unrefTimer && Deno.unrefTimer(e10), setTimeout(async () => {
            await this.initializePromise, await this._autoRefreshTokenTick();
          }, 0);
        }
        async _stopAutoRefresh() {
          this._debug("#_stopAutoRefresh()");
          let e10 = this.autoRefreshTicker;
          this.autoRefreshTicker = null, e10 && clearInterval(e10);
        }
        async startAutoRefresh() {
          this._removeVisibilityChangedCallback(), await this._startAutoRefresh();
        }
        async stopAutoRefresh() {
          this._removeVisibilityChangedCallback(), await this._stopAutoRefresh();
        }
        async _autoRefreshTokenTick() {
          this._debug("#_autoRefreshTokenTick()", "begin");
          try {
            await this._acquireLock(0, async () => {
              try {
                let e10 = Date.now();
                try {
                  return await this._useSession(async (t10) => {
                    let { data: { session: r10 } } = t10;
                    if (!r10 || !r10.refresh_token || !r10.expires_at) return void this._debug("#_autoRefreshTokenTick()", "no session");
                    let n10 = Math.floor((1e3 * r10.expires_at - e10) / 3e4);
                    this._debug("#_autoRefreshTokenTick()", `access token expires in ${n10} ticks, a tick lasts 30000ms, refresh threshold is 3 ticks`), n10 <= 3 && await this._callRefreshToken(r10.refresh_token);
                  });
                } catch (e11) {
                  console.error("Auto refresh tick failed with error. This is likely a transient error.", e11);
                }
              } finally {
                this._debug("#_autoRefreshTokenTick()", "end");
              }
            });
          } catch (e10) {
            if (e10.isAcquireTimeout || e10 instanceof iC) this._debug("auto refresh token tick lock not available");
            else throw e10;
          }
        }
        async _handleVisibilityChange() {
          return this._debug("#_handleVisibilityChange()"), this.autoRefreshToken && this.startAutoRefresh(), false;
        }
        async _onVisibilityChanged(e10) {
          let t10 = `#_onVisibilityChanged(${e10})`;
          this._debug(t10, "visibilityState", document.visibilityState), "visible" === document.visibilityState ? (this.autoRefreshToken && this._startAutoRefresh(), e10 || (await this.initializePromise, await this._acquireLock(-1, async () => {
            "visible" !== document.visibilityState ? this._debug(t10, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting") : await this._recoverAndRefresh();
          }))) : "hidden" === document.visibilityState && this.autoRefreshToken && this._stopAutoRefresh();
        }
        async _getUrlForProvider(e10, t10, r10) {
          let n10 = [`provider=${encodeURIComponent(t10)}`];
          if ((null == r10 ? void 0 : r10.redirectTo) && n10.push(`redirect_to=${encodeURIComponent(r10.redirectTo)}`), (null == r10 ? void 0 : r10.scopes) && n10.push(`scopes=${encodeURIComponent(r10.scopes)}`), "pkce" === this.flowType) {
            let [e11, t11] = await il(this.storage, this.storageKey), r11 = new URLSearchParams({ code_challenge: `${encodeURIComponent(e11)}`, code_challenge_method: `${encodeURIComponent(t11)}` });
            n10.push(r11.toString());
          }
          if (null == r10 ? void 0 : r10.queryParams) {
            let e11 = new URLSearchParams(r10.queryParams);
            n10.push(e11.toString());
          }
          return (null == r10 ? void 0 : r10.skipBrowserRedirect) && n10.push(`skip_http_redirect=${r10.skipBrowserRedirect}`), `${e10}?${n10.join("&")}`;
        }
        async _unenroll(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10;
              let { data: n10, error: i10 } = t10;
              return i10 ? this._returnResult({ data: null, error: i10 }) : await ib(this.fetch, "DELETE", `${this.url}/factors/${e10.factorId}`, { headers: this.headers, jwt: null == (r10 = null == n10 ? void 0 : n10.session) ? void 0 : r10.access_token });
            });
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _enroll(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10, n10;
              let { data: i10, error: s2 } = t10;
              if (s2) return this._returnResult({ data: null, error: s2 });
              let a2 = Object.assign({ friendly_name: e10.friendlyName, factor_type: e10.factorType }, "phone" === e10.factorType ? { phone: e10.phone } : "totp" === e10.factorType ? { issuer: e10.issuer } : {}), { data: o2, error: l2 } = await ib(this.fetch, "POST", `${this.url}/factors`, { body: a2, headers: this.headers, jwt: null == (r10 = null == i10 ? void 0 : i10.session) ? void 0 : r10.access_token });
              return l2 ? this._returnResult({ data: null, error: l2 }) : ("totp" === e10.factorType && "totp" === o2.type && (null == (n10 = null == o2 ? void 0 : o2.totp) ? void 0 : n10.qr_code) && (o2.totp.qr_code = `data:image/svg+xml;utf-8,${o2.totp.qr_code}`), this._returnResult({ data: o2, error: null }));
            });
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _verify(e10) {
          return this._acquireLock(-1, async () => {
            try {
              return await this._useSession(async (t10) => {
                var r10, n10, i10;
                let { data: s2, error: a2 } = t10;
                if (a2) return this._returnResult({ data: null, error: a2 });
                let o2 = Object.assign({ challenge_id: e10.challengeId }, "webauthn" in e10 ? { webauthn: Object.assign(Object.assign({}, e10.webauthn), { credential_response: "create" === e10.webauthn.type ? (n10 = e10.webauthn.credential_response, "toJSON" in n10 && "function" == typeof n10.toJSON ? n10.toJSON() : { id: n10.id, rawId: n10.id, response: { attestationObject: n6(new Uint8Array(n10.response.attestationObject)), clientDataJSON: n6(new Uint8Array(n10.response.clientDataJSON)) }, type: "public-key", clientExtensionResults: n10.getClientExtensionResults(), authenticatorAttachment: null != (i10 = n10.authenticatorAttachment) ? i10 : void 0 }) : function(e11) {
                  var t11;
                  if ("toJSON" in e11 && "function" == typeof e11.toJSON) return e11.toJSON();
                  let r11 = e11.getClientExtensionResults(), n11 = e11.response;
                  return { id: e11.id, rawId: e11.id, response: { authenticatorData: n6(new Uint8Array(n11.authenticatorData)), clientDataJSON: n6(new Uint8Array(n11.clientDataJSON)), signature: n6(new Uint8Array(n11.signature)), userHandle: n11.userHandle ? n6(new Uint8Array(n11.userHandle)) : void 0 }, type: "public-key", clientExtensionResults: r11, authenticatorAttachment: null != (t11 = e11.authenticatorAttachment) ? t11 : void 0 };
                }(e10.webauthn.credential_response) }) } : { code: e10.code }), { data: l2, error: u2 } = await ib(this.fetch, "POST", `${this.url}/factors/${e10.factorId}/verify`, { body: o2, headers: this.headers, jwt: null == (r10 = null == s2 ? void 0 : s2.session) ? void 0 : r10.access_token });
                return u2 ? this._returnResult({ data: null, error: u2 }) : (await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + l2.expires_in }, l2)), await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", l2), this._returnResult({ data: l2, error: u2 }));
              });
            } catch (e11) {
              if (nq(e11)) return this._returnResult({ data: null, error: e11 });
              throw e11;
            }
          });
        }
        async _challenge(e10) {
          return this._acquireLock(-1, async () => {
            try {
              return await this._useSession(async (t10) => {
                var r10;
                let { data: n10, error: i10 } = t10;
                if (i10) return this._returnResult({ data: null, error: i10 });
                let s2 = await ib(this.fetch, "POST", `${this.url}/factors/${e10.factorId}/challenge`, { body: e10, headers: this.headers, jwt: null == (r10 = null == n10 ? void 0 : n10.session) ? void 0 : r10.access_token });
                if (s2.error) return s2;
                let { data: a2 } = s2;
                if ("webauthn" !== a2.type) return { data: a2, error: null };
                switch (a2.webauthn.type) {
                  case "create":
                    return { data: Object.assign(Object.assign({}, a2), { webauthn: Object.assign(Object.assign({}, a2.webauthn), { credential_options: Object.assign(Object.assign({}, a2.webauthn.credential_options), { publicKey: function(e11) {
                      if (!e11) throw Error("Credential creation options are required");
                      if ("u" > typeof PublicKeyCredential && "parseCreationOptionsFromJSON" in PublicKeyCredential && "function" == typeof PublicKeyCredential.parseCreationOptionsFromJSON) return PublicKeyCredential.parseCreationOptionsFromJSON(e11);
                      let { challenge: t11, user: r11, excludeCredentials: n11 } = e11, i11 = (0, rO.__rest)(e11, ["challenge", "user", "excludeCredentials"]), s3 = n8(t11).buffer, a3 = Object.assign(Object.assign({}, r11), { id: n8(r11.id).buffer }), o2 = Object.assign(Object.assign({}, i11), { challenge: s3, user: a3 });
                      if (n11 && n11.length > 0) {
                        o2.excludeCredentials = Array(n11.length);
                        for (let e12 = 0; e12 < n11.length; e12++) {
                          let t12 = n11[e12];
                          o2.excludeCredentials[e12] = Object.assign(Object.assign({}, t12), { id: n8(t12.id).buffer, type: t12.type || "public-key", transports: t12.transports });
                        }
                      }
                      return o2;
                    }(a2.webauthn.credential_options.publicKey) }) }) }), error: null };
                  case "request":
                    return { data: Object.assign(Object.assign({}, a2), { webauthn: Object.assign(Object.assign({}, a2.webauthn), { credential_options: Object.assign(Object.assign({}, a2.webauthn.credential_options), { publicKey: function(e11) {
                      if (!e11) throw Error("Credential request options are required");
                      if ("u" > typeof PublicKeyCredential && "parseRequestOptionsFromJSON" in PublicKeyCredential && "function" == typeof PublicKeyCredential.parseRequestOptionsFromJSON) return PublicKeyCredential.parseRequestOptionsFromJSON(e11);
                      let { challenge: t11, allowCredentials: r11 } = e11, n11 = (0, rO.__rest)(e11, ["challenge", "allowCredentials"]), i11 = n8(t11).buffer, s3 = Object.assign(Object.assign({}, n11), { challenge: i11 });
                      if (r11 && r11.length > 0) {
                        s3.allowCredentials = Array(r11.length);
                        for (let e12 = 0; e12 < r11.length; e12++) {
                          let t12 = r11[e12];
                          s3.allowCredentials[e12] = Object.assign(Object.assign({}, t12), { id: n8(t12.id).buffer, type: t12.type || "public-key", transports: t12.transports });
                        }
                      }
                      return s3;
                    }(a2.webauthn.credential_options.publicKey) }) }) }), error: null };
                }
              });
            } catch (e11) {
              if (nq(e11)) return this._returnResult({ data: null, error: e11 });
              throw e11;
            }
          });
        }
        async _challengeAndVerify(e10) {
          let { data: t10, error: r10 } = await this._challenge({ factorId: e10.factorId });
          return r10 ? this._returnResult({ data: null, error: r10 }) : await this._verify({ factorId: e10.factorId, challengeId: t10.id, code: e10.code });
        }
        async _listFactors() {
          var e10;
          let { data: { user: t10 }, error: r10 } = await this.getUser();
          if (r10) return { data: null, error: r10 };
          let n10 = { all: [], phone: [], totp: [], webauthn: [] };
          for (let r11 of null != (e10 = null == t10 ? void 0 : t10.factors) ? e10 : []) n10.all.push(r11), "verified" === r11.status && n10[r11.factor_type].push(r11);
          return { data: n10, error: null };
        }
        async _getAuthenticatorAssuranceLevel() {
          var e10, t10;
          let { data: { session: r10 }, error: n10 } = await this.getSession();
          if (n10) return this._returnResult({ data: null, error: n10 });
          if (!r10) return { data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] }, error: null };
          let { payload: i10 } = ir(r10.access_token), s2 = null;
          i10.aal && (s2 = i10.aal);
          let a2 = s2;
          return (null != (t10 = null == (e10 = r10.user.factors) ? void 0 : e10.filter((e11) => "verified" === e11.status)) ? t10 : []).length > 0 && (a2 = "aal2"), { data: { currentLevel: s2, nextLevel: a2, currentAuthenticationMethods: i10.amr || [] }, error: null };
        }
        async _getAuthorizationDetails(e10) {
          try {
            return await this._useSession(async (t10) => {
              let { data: { session: r10 }, error: n10 } = t10;
              return n10 ? this._returnResult({ data: null, error: n10 }) : r10 ? await ib(this.fetch, "GET", `${this.url}/oauth/authorizations/${e10}`, { headers: this.headers, jwt: r10.access_token, xform: (e11) => ({ data: e11, error: null }) }) : this._returnResult({ data: null, error: new nG() });
            });
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _approveAuthorization(e10, t10) {
          try {
            return await this._useSession(async (t11) => {
              let { data: { session: r10 }, error: n10 } = t11;
              if (n10) return this._returnResult({ data: null, error: n10 });
              if (!r10) return this._returnResult({ data: null, error: new nG() });
              let i10 = await ib(this.fetch, "POST", `${this.url}/oauth/authorizations/${e10}/consent`, { headers: this.headers, jwt: r10.access_token, body: { action: "approve" }, xform: (e11) => ({ data: e11, error: null }) });
              return i10.data && i10.data.redirect_url, i10;
            });
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _denyAuthorization(e10, t10) {
          try {
            return await this._useSession(async (t11) => {
              let { data: { session: r10 }, error: n10 } = t11;
              if (n10) return this._returnResult({ data: null, error: n10 });
              if (!r10) return this._returnResult({ data: null, error: new nG() });
              let i10 = await ib(this.fetch, "POST", `${this.url}/oauth/authorizations/${e10}/consent`, { headers: this.headers, jwt: r10.access_token, body: { action: "deny" }, xform: (e11) => ({ data: e11, error: null }) });
              return i10.data && i10.data.redirect_url, i10;
            });
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async fetchJwk(e10, t10 = { keys: [] }) {
          let r10 = t10.keys.find((t11) => t11.kid === e10);
          if (r10) return r10;
          let n10 = Date.now();
          if ((r10 = this.jwks.keys.find((t11) => t11.kid === e10)) && this.jwks_cached_at + 6e5 > n10) return r10;
          let { data: i10, error: s2 } = await ib(this.fetch, "GET", `${this.url}/.well-known/jwks.json`, { headers: this.headers });
          if (s2) throw s2;
          return i10.keys && 0 !== i10.keys.length && (this.jwks = i10, this.jwks_cached_at = n10, r10 = i10.keys.find((t11) => t11.kid === e10)) ? r10 : null;
        }
        async getClaims(e10, t10 = {}) {
          try {
            var r10;
            let n10, i10 = e10;
            if (!i10) {
              let { data: e11, error: t11 } = await this.getSession();
              if (t11 || !e11.session) return this._returnResult({ data: null, error: t11 });
              i10 = e11.session.access_token;
            }
            let { header: s2, payload: a2, signature: o2, raw: { header: l2, payload: u2 } } = ir(i10);
            (null == t10 ? void 0 : t10.allowExpired) || function(e11) {
              if (!e11) throw Error("Missing exp claim");
              if (e11 <= Math.floor(Date.now() / 1e3)) throw Error("JWT has expired");
            }(a2.exp);
            let c2 = !s2.alg || s2.alg.startsWith("HS") || !s2.kid || !("crypto" in globalThis && "subtle" in globalThis.crypto) ? null : await this.fetchJwk(s2.kid, (null == t10 ? void 0 : t10.keys) ? { keys: t10.keys } : null == t10 ? void 0 : t10.jwks);
            if (!c2) {
              let { error: e11 } = await this.getUser(i10);
              if (e11) throw e11;
              return { data: { claims: a2, header: s2, signature: o2 }, error: null };
            }
            let h2 = function(e11) {
              switch (e11) {
                case "RS256":
                  return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
                case "ES256":
                  return { name: "ECDSA", namedCurve: "P-256", hash: { name: "SHA-256" } };
                default:
                  throw Error("Invalid alg claim");
              }
            }(s2.alg), d2 = await crypto.subtle.importKey("jwk", c2, h2, true, ["verify"]);
            if (!await crypto.subtle.verify(h2, d2, o2, (r10 = `${l2}.${u2}`, n10 = [], !function(e11, t11) {
              for (let r11 = 0; r11 < e11.length; r11 += 1) {
                let n11 = e11.charCodeAt(r11);
                if (n11 > 55295 && n11 <= 56319) {
                  let t12 = (n11 - 55296) * 1024 & 65535;
                  n11 = (e11.charCodeAt(r11 + 1) - 56320 & 65535 | t12) + 65536, r11 += 1;
                }
                !function(e12, t12) {
                  if (e12 <= 127) return t12(e12);
                  if (e12 <= 2047) {
                    t12(192 | e12 >> 6), t12(128 | 63 & e12);
                    return;
                  }
                  if (e12 <= 65535) {
                    t12(224 | e12 >> 12), t12(128 | e12 >> 6 & 63), t12(128 | 63 & e12);
                    return;
                  }
                  if (e12 <= 1114111) {
                    t12(240 | e12 >> 18), t12(128 | e12 >> 12 & 63), t12(128 | e12 >> 6 & 63), t12(128 | 63 & e12);
                    return;
                  }
                  throw Error(`Unrecognized Unicode codepoint: ${e12.toString(16)}`);
                }(n11, t11);
              }
            }(r10, (e11) => n10.push(e11)), new Uint8Array(n10)))) throw new nQ("Invalid JWT signature");
            return { data: { claims: a2, header: s2, signature: o2 }, error: null };
          } catch (e11) {
            if (nq(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
      }
      iF.nextInstanceID = {};
      let iG = iF;
      class iW extends iG {
        constructor(e10) {
          super(e10);
        }
      }
      class iz {
        constructor(e10, t10, r10) {
          var n10, i10, s2;
          this.supabaseUrl = e10, this.supabaseKey = t10;
          const a2 = function(e11) {
            let t11 = null == e11 ? void 0 : e11.trim();
            if (!t11) throw Error("supabaseUrl is required.");
            if (!t11.match(/^https?:\/\//i)) throw Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");
            try {
              return new URL(t11.endsWith("/") ? t11 : t11 + "/");
            } catch (e12) {
              throw Error("Invalid supabaseUrl: Provided URL is malformed.");
            }
          }(e10);
          if (!t10) throw Error("supabaseKey is required.");
          this.realtimeUrl = new URL("realtime/v1", a2), this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws"), this.authUrl = new URL("auth/v1", a2), this.storageUrl = new URL("storage/v1", a2), this.functionsUrl = new URL("functions/v1", a2);
          const o2 = `sb-${a2.hostname.split(".")[0]}-auth-token`, l2 = function(e11, t11) {
            var r11, n11;
            let { db: i11, auth: s3, realtime: a3, global: o3 } = e11, { db: l3, auth: u2, realtime: c2, global: h2 } = t11, d2 = { db: Object.assign(Object.assign({}, l3), i11), auth: Object.assign(Object.assign({}, u2), s3), realtime: Object.assign(Object.assign({}, c2), a3), storage: {}, global: Object.assign(Object.assign(Object.assign({}, h2), o3), { headers: Object.assign(Object.assign({}, null != (r11 = null == h2 ? void 0 : h2.headers) ? r11 : {}), null != (n11 = null == o3 ? void 0 : o3.headers) ? n11 : {}) }), accessToken: async () => "" };
            return e11.accessToken ? d2.accessToken = e11.accessToken : delete d2.accessToken, d2;
          }(null != r10 ? r10 : {}, { db: nj, realtime: nN, auth: Object.assign(Object.assign({}, nI), { storageKey: o2 }), global: nA });
          this.storageKey = null != (n10 = l2.auth.storageKey) ? n10 : "", this.headers = null != (i10 = l2.global.headers) ? i10 : {}, l2.accessToken ? (this.accessToken = l2.accessToken, this.auth = new Proxy({}, { get: (e11, t11) => {
            throw Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(t11)} is not possible`);
          } })) : this.auth = this._initSupabaseAuthClient(null != (s2 = l2.auth) ? s2 : {}, this.headers, l2.global.fetch), this.fetch = /* @__PURE__ */ ((e11, t11, r11) => {
            let n11 = r11 ? (...e12) => r11(...e12) : (...e12) => fetch(...e12), i11 = Headers;
            return async (r12, s3) => {
              var a3;
              let o3 = null != (a3 = await t11()) ? a3 : e11, l3 = new i11(null == s3 ? void 0 : s3.headers);
              return l3.has("apikey") || l3.set("apikey", e11), l3.has("Authorization") || l3.set("Authorization", `Bearer ${o3}`), n11(r12, Object.assign(Object.assign({}, s3), { headers: l3 }));
            };
          })(t10, this._getAccessToken.bind(this), l2.global.fetch), this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers, accessToken: this._getAccessToken.bind(this) }, l2.realtime)), this.accessToken && this.accessToken().then((e11) => this.realtime.setAuth(e11)).catch((e11) => console.warn("Failed to set initial Realtime auth token:", e11)), this.rest = new rA(new URL("rest/v1", a2).href, { headers: this.headers, schema: l2.db.schema, fetch: this.fetch }), this.storage = new nC(this.storageUrl.href, this.headers, this.fetch, null == r10 ? void 0 : r10.storage), l2.accessToken || this._listenForAuthEvents();
        }
        get functions() {
          return new rC(this.functionsUrl.href, { headers: this.headers, customFetch: this.fetch });
        }
        from(e10) {
          return this.rest.from(e10);
        }
        schema(e10) {
          return this.rest.schema(e10);
        }
        rpc(e10, t10 = {}, r10 = { head: false, get: false, count: void 0 }) {
          return this.rest.rpc(e10, t10, r10);
        }
        channel(e10, t10 = { config: {} }) {
          return this.realtime.channel(e10, t10);
        }
        getChannels() {
          return this.realtime.getChannels();
        }
        removeChannel(e10) {
          return this.realtime.removeChannel(e10);
        }
        removeAllChannels() {
          return this.realtime.removeAllChannels();
        }
        async _getAccessToken() {
          var e10, t10;
          if (this.accessToken) return await this.accessToken();
          let { data: r10 } = await this.auth.getSession();
          return null != (t10 = null == (e10 = r10.session) ? void 0 : e10.access_token) ? t10 : this.supabaseKey;
        }
        _initSupabaseAuthClient({ autoRefreshToken: e10, persistSession: t10, detectSessionInUrl: r10, storage: n10, userStorage: i10, storageKey: s2, flowType: a2, lock: o2, debug: l2, throwOnError: u2 }, c2, h2) {
          let d2 = { Authorization: `Bearer ${this.supabaseKey}`, apikey: `${this.supabaseKey}` };
          return new iW({ url: this.authUrl.href, headers: Object.assign(Object.assign({}, d2), c2), storageKey: s2, autoRefreshToken: e10, persistSession: t10, detectSessionInUrl: r10, storage: n10, userStorage: i10, flowType: a2, lock: o2, debug: l2, throwOnError: u2, fetch: h2, hasCustomAuthorizationHeader: Object.keys(this.headers).some((e11) => "authorization" === e11.toLowerCase()) });
        }
        _initRealtimeClient(e10) {
          return new r4(this.realtimeUrl.href, Object.assign(Object.assign({}, e10), { params: Object.assign({ apikey: this.supabaseKey }, null == e10 ? void 0 : e10.params) }));
        }
        _listenForAuthEvents() {
          return this.auth.onAuthStateChange((e10, t10) => {
            this._handleTokenChanged(e10, "CLIENT", null == t10 ? void 0 : t10.access_token);
          });
        }
        _handleTokenChanged(e10, t10, r10) {
          ("TOKEN_REFRESHED" === e10 || "SIGNED_IN" === e10) && this.changedAccessToken !== r10 ? (this.changedAccessToken = r10, this.realtime.setAuth(r10)) : "SIGNED_OUT" === e10 && (this.realtime.setAuth(), "STORAGE" == t10 && this.auth.signOut(), this.changedAccessToken = void 0);
        }
      }
      function iK(e10) {
        return null != e10 && "object" == typeof e10 && true === e10["@@functional/placeholder"];
      }
      function iJ(e10) {
        return function t10(r10) {
          return 0 == arguments.length || iK(r10) ? t10 : e10.apply(this, arguments);
        };
      }
      function iX(e10) {
        return function t10(r10, n10) {
          switch (arguments.length) {
            case 0:
              return t10;
            case 1:
              return iK(r10) ? t10 : iJ(function(t11) {
                return e10(r10, t11);
              });
            default:
              return iK(r10) && iK(n10) ? t10 : iK(r10) ? iJ(function(t11) {
                return e10(t11, n10);
              }) : iK(n10) ? iJ(function(t11) {
                return e10(r10, t11);
              }) : e10(r10, n10);
          }
        };
      }
      function iY(e10) {
        return function t10(r10, n10, i10) {
          switch (arguments.length) {
            case 0:
              return t10;
            case 1:
              return iK(r10) ? t10 : iX(function(t11, n11) {
                return e10(r10, t11, n11);
              });
            case 2:
              return iK(r10) && iK(n10) ? t10 : iK(r10) ? iX(function(t11, r11) {
                return e10(t11, n10, r11);
              }) : iK(n10) ? iX(function(t11, n11) {
                return e10(r10, t11, n11);
              }) : iJ(function(t11) {
                return e10(r10, n10, t11);
              });
            default:
              return iK(r10) && iK(n10) && iK(i10) ? t10 : iK(r10) && iK(n10) ? iX(function(t11, r11) {
                return e10(t11, r11, i10);
              }) : iK(r10) && iK(i10) ? iX(function(t11, r11) {
                return e10(t11, n10, r11);
              }) : iK(n10) && iK(i10) ? iX(function(t11, n11) {
                return e10(r10, t11, n11);
              }) : iK(r10) ? iJ(function(t11) {
                return e10(t11, n10, i10);
              }) : iK(n10) ? iJ(function(t11) {
                return e10(r10, t11, i10);
              }) : iK(i10) ? iJ(function(t11) {
                return e10(r10, n10, t11);
              }) : e10(r10, n10, i10);
          }
        };
      }
      function iQ(e10) {
        return "[object Object]" === Object.prototype.toString.call(e10);
      }
      function iZ(e10, t10) {
        return Object.prototype.hasOwnProperty.call(t10, e10);
      }
      (function() {
        if ("u" < typeof process) return false;
        let e10 = process.version;
        if (null == e10) return false;
        let t10 = e10.match(/^v(\d+)\./);
        return !!t10 && 18 >= parseInt(t10[1], 10);
      })() && console.warn("\u26A0\uFE0F  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217");
      var i0 = iY(function(e10, t10, r10) {
        var n10, i10 = {};
        for (n10 in r10 = r10 || {}, t10 = t10 || {}) iZ(n10, t10) && (i10[n10] = iZ(n10, r10) ? e10(n10, t10[n10], r10[n10]) : t10[n10]);
        for (n10 in r10) iZ(n10, r10) && !iZ(n10, i10) && (i10[n10] = r10[n10]);
        return i10;
      }), i1 = iY(function e10(t10, r10, n10) {
        return i0(function(r11, n11, i10) {
          return iQ(n11) && iQ(i10) ? e10(t10, n11, i10) : t10(r11, n11, i10);
        }, r10, n10);
      }), i2 = iX(function(e10, t10) {
        return i1(function(e11, t11, r10) {
          return r10;
        }, e10, t10);
      });
      e.i(64131);
      var i4 = { path: "/", sameSite: "lax", httpOnly: false, maxAge: 31536e6 };
      async function i3(e10, t10) {
        let r10 = await t10(e10);
        if (r10) return r10;
        let n10 = [];
        for (let r11 = 0; ; r11++) {
          let i10 = `${e10}.${r11}`, s2 = await t10(i10);
          if (!s2) break;
          n10.push(s2);
        }
        if (n10.length > 0) return n10.join("");
      }
      async function i8(e10, t10, r10) {
        if (await t10(e10)) return void await r10(e10);
        for (let n10 = 0; ; n10++) {
          let i10 = `${e10}.${n10}`;
          if (!await t10(i10)) break;
          await r10(i10);
        }
      }
      if (e.i(64445), e.i(40049).default.unstable_postpone, false === ("Route %%% needs to bail out of prerendering at this point because it used ^^^. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error".includes("needs to bail out of prerendering at this point because it used") && "Route %%% needs to bail out of prerendering at this point because it used ^^^. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error".includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error"))) throw Object.defineProperty(Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E296", enumerable: false, configurable: true });
      async function i6(e10) {
        let t10, r10, n10 = eA.next({ request: e10 }), i10 = (t10 = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) || (console.warn("Missing Supabase URL in middleware"), ""), s2 = (r10 = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY) || (console.warn("Missing Supabase Anon Key in middleware"), "");
        if (!i10 || !s2) return n10;
        let a2 = function(e11, t11, r11) {
          if (!e11 || !t11) throw Error(`Your project's URL and Key are required to create a Supabase client!

Check your Supabase project's API settings to find these values

https://supabase.com/dashboard/project/_/settings/api`);
          let { cookies: n11, cookieOptions: i11, ...s3 } = r11;
          return (null == i11 ? void 0 : i11.name) && (s3.auth = { ...s3.auth, storageKey: i11.name }), new iz(e11, t11, i2({ global: { headers: { "X-Client-Info": "supabase-ssr/0.1.0" } }, auth: { flowType: "pkce", autoRefreshToken: false, detectSessionInUrl: false, persistSession: true, storage: { isServer: true, getItem: async (e12) => await i3(e12, async (e13) => {
            if ("function" == typeof n11.get) return await n11.get(e13);
          }), setItem: async (e12, t12) => {
            let r12 = function(e13, t13) {
              let r13 = 3180, n12 = encodeURIComponent(t13);
              if (n12.length <= r13) return [{ name: e13, value: t13 }];
              let i12 = [];
              for (; n12.length > 0; ) {
                let e14 = n12.slice(0, r13), t14 = e14.lastIndexOf("%");
                t14 > r13 - 3 && (e14 = e14.slice(0, t14));
                let s4 = "";
                for (; e14.length > 0; ) try {
                  s4 = decodeURIComponent(e14);
                  break;
                } catch (t15) {
                  if (t15 instanceof URIError && "%" === e14.at(-3) && e14.length > 3) e14 = e14.slice(0, e14.length - 3);
                  else throw t15;
                }
                i12.push(s4), n12 = n12.slice(e14.length);
              }
              return i12.map((t14, r14) => ({ name: `${e13}.${r14}`, value: t14 }));
            }(e12, t12);
            await Promise.all(r12.map(async (e13) => {
              "function" == typeof n11.set && await n11.set(e13.name, e13.value, { ...i4, ...i11, maxAge: i4.maxAge });
            }));
          }, removeItem: async (e12) => {
            "function" == typeof n11.remove && "function" != typeof n11.get ? console.log("Removing chunked cookie without a `get` method is not supported.\n\n	When you call the `createServerClient` function from the `@supabase/ssr` package, make sure you declare both a `get` and `remove` method on the `cookies` object.\n\nhttps://supabase.com/docs/guides/auth/server-side/creating-a-client") : i8(e12, async (e13) => {
              if ("function" == typeof n11.get) return await n11.get(e13);
            }, async (e13) => {
              if ("function" == typeof n11.remove) return await n11.remove(e13, { ...i4, ...i11, maxAge: 0 });
            });
          } } } }, s3));
        }(i10, s2, { cookies: { get: (t11) => e10.cookies.get(t11)?.value, set(t11, r11, i11) {
          e10.cookies.set({ name: t11, value: r11, ...i11 }), (n10 = eA.next({ request: e10 })).cookies.set({ name: t11, value: r11, ...i11 });
        }, remove(t11, r11) {
          e10.cookies.set({ name: t11, value: "", ...r11 }), (n10 = eA.next({ request: e10 })).cookies.set({ name: t11, value: "", ...r11 });
        } } }), { data: { user: o2 } } = await a2.auth.getUser();
        if (!o2 && !e10.nextUrl.pathname.startsWith("/login") && !e10.nextUrl.pathname.startsWith("/register") && !e10.nextUrl.pathname.startsWith("/verify-email") && !e10.nextUrl.pathname.startsWith("/forgot-password") && !e10.nextUrl.pathname.startsWith("/reset-password") && !e10.nextUrl.pathname.startsWith("/instructions") && !e10.nextUrl.pathname.startsWith("/terms") && !e10.nextUrl.pathname.startsWith("/privacy") && !e10.nextUrl.pathname.startsWith("/faq") && !e10.nextUrl.pathname.startsWith("/help") && "/" !== e10.nextUrl.pathname) {
          let t11 = e10.nextUrl.clone();
          return t11.pathname = "/login", eA.redirect(t11);
        }
        return n10;
      }
      async function i9(e10) {
        return await i6(e10);
      }
      RegExp("\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at __next_root_layout_boundary__ \\([^\\n]*\\)"), RegExp("\\n\\s+at __next_metadata_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_viewport_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_outlet_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_instant_validation_boundary__[\\n\\s]"), e.s(["config", 0, { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] }, "middleware", 0, i9], 99446);
      let i5 = { ...e.i(99446) }, i7 = "/middleware", se = i5.middleware || i5.default;
      if ("function" != typeof se) throw new class extends Error {
        constructor(e10) {
          super(e10), this.stack = "";
        }
      }(`The Middleware file "${i7}" must export a function named \`middleware\` or a default function.`);
      let st = (e10) => tV({ ...e10, IncrementalCache: rS, incrementalCacheHandler: null, page: i7, handler: async (...e11) => {
        try {
          return await se(...e11);
        } catch (i10) {
          let t10 = e11[0], r10 = new URL(t10.url), n10 = r10.pathname + r10.search;
          throw await o(i10, { path: n10, method: t10.method, headers: Object.fromEntries(t10.headers.entries()) }, { routerKind: "Pages Router", routePath: "/proxy", routeType: "proxy", revalidateReason: void 0 }), i10;
        }
      } });
      async function sr(e10, t10) {
        let r10 = await st({ request: { url: e10.url, method: e10.method, headers: w(e10.headers), nextConfig: { basePath: "", i18n: "", trailingSlash: false, experimental: { cacheLife: { default: { stale: 300, revalidate: 900, expire: 4294967294 }, seconds: { stale: 30, revalidate: 1, expire: 60 }, minutes: { stale: 300, revalidate: 60, expire: 3600 }, hours: { stale: 300, revalidate: 3600, expire: 86400 }, days: { stale: 300, revalidate: 86400, expire: 604800 }, weeks: { stale: 300, revalidate: 604800, expire: 2592e3 }, max: { stale: 300, revalidate: 2592e3, expire: 31536e3 } }, authInterrupts: false, clientParamParsingOrigins: [] } }, page: { name: i7 }, body: "GET" !== e10.method && "HEAD" !== e10.method ? e10.body ?? void 0 : void 0, waitUntil: t10.waitUntil, requestMeta: t10.requestMeta, signal: t10.signal || new AbortController().signal } });
        return null == t10.waitUntil || t10.waitUntil.call(t10, r10.waitUntil), r10.response;
      }
      e.s(["default", 0, st, "handler", 0, sr], 42738);
    }]);
  }
});

// .next/server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_10wlvud.js
var require_turbopack_node_modules_next_dist_esm_build_templates_edge_wrapper_10wlvud = __commonJS({
  ".next/server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_10wlvud.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_10wlvud.js", { otherChunks: ["chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0a9gg_0.js", "chunks/[root-of-the-server]__07aprkn._.js"], runtimeModuleIds: [38022] }]), (() => {
      let e;
      if (!Array.isArray(globalThis.TURBOPACK)) return;
      let t = ["NEXT_DEPLOYMENT_ID", "NEXT_CLIENT_ASSET_SUFFIX"];
      var r, n = ((r = n || {})[r.Runtime = 0] = "Runtime", r[r.Parent = 1] = "Parent", r[r.Update = 2] = "Update", r);
      let o = /* @__PURE__ */ new WeakMap();
      function u(e2, t2) {
        this.m = e2, this.e = t2;
      }
      let l = u.prototype, i = Object.prototype.hasOwnProperty, a = "u" > typeof Symbol && Symbol.toStringTag;
      function s(e2, t2, r2) {
        i.call(e2, t2) || Object.defineProperty(e2, t2, r2);
      }
      function c(e2, t2) {
        let r2 = e2[t2];
        return r2 || (r2 = f(t2), e2[t2] = r2), r2;
      }
      function f(e2) {
        return { exports: {}, error: void 0, id: e2, namespaceObject: void 0 };
      }
      function d(e2, t2) {
        s(e2, "__esModule", { value: true }), a && s(e2, a, { value: "Module" });
        let r2 = 0;
        for (; r2 < t2.length; ) {
          let n2 = t2[r2++], o2 = t2[r2++];
          if ("number" == typeof o2) if (0 === o2) s(e2, n2, { value: t2[r2++], enumerable: true, writable: false });
          else throw Error(`unexpected tag: ${o2}`);
          else "function" == typeof t2[r2] ? s(e2, n2, { get: o2, set: t2[r2++], enumerable: true }) : s(e2, n2, { get: o2, enumerable: true });
        }
        Object.seal(e2);
      }
      function h(e2, t2) {
        (null != t2 ? c(this.c, t2) : this.m).exports = e2;
      }
      l.s = function(e2, t2) {
        let r2, n2;
        null != t2 ? n2 = (r2 = c(this.c, t2)).exports : (r2 = this.m, n2 = this.e), r2.namespaceObject = n2, d(n2, e2);
      }, l.j = function(e2, t2) {
        var r2, n2;
        let u2, l2, a2;
        null != t2 ? l2 = (u2 = c(this.c, t2)).exports : (u2 = this.m, l2 = this.e);
        let s2 = (r2 = u2, n2 = l2, (a2 = o.get(r2)) || (o.set(r2, a2 = []), r2.exports = r2.namespaceObject = new Proxy(n2, { get(e3, t3) {
          if (i.call(e3, t3) || "default" === t3 || "__esModule" === t3) return Reflect.get(e3, t3);
          for (let e4 of a2) {
            let r3 = Reflect.get(e4, t3);
            if (void 0 !== r3) return r3;
          }
        }, ownKeys(e3) {
          let t3 = Reflect.ownKeys(e3);
          for (let e4 of a2) for (let r3 of Reflect.ownKeys(e4)) "default" === r3 || t3.includes(r3) || t3.push(r3);
          return t3;
        } })), a2);
        "object" == typeof e2 && null !== e2 && s2.push(e2);
      }, l.v = h, l.n = function(e2, t2) {
        let r2;
        (r2 = null != t2 ? c(this.c, t2) : this.m).exports = r2.namespaceObject = e2;
      };
      let p = Object.getPrototypeOf ? (e2) => Object.getPrototypeOf(e2) : (e2) => e2.__proto__, m = [null, p({}), p([]), p(p)];
      function b(e2, t2, r2) {
        let n2 = [], o2 = -1;
        for (let t3 = e2; ("object" == typeof t3 || "function" == typeof t3) && !m.includes(t3); t3 = p(t3)) for (let r3 of Object.getOwnPropertyNames(t3)) n2.push(r3, /* @__PURE__ */ function(e3, t4) {
          return () => e3[t4];
        }(e2, r3)), -1 === o2 && "default" === r3 && (o2 = n2.length - 1);
        return r2 && o2 >= 0 || (o2 >= 0 ? n2.splice(o2, 1, 0, e2) : n2.push("default", 0, e2)), d(t2, n2), t2;
      }
      function y(e2) {
        return "function" == typeof e2 ? function(...t2) {
          return e2.apply(this, t2);
        } : /* @__PURE__ */ Object.create(null);
      }
      function g(e2) {
        let t2 = K(e2, this.m);
        if (t2.namespaceObject) return t2.namespaceObject;
        let r2 = t2.exports;
        return t2.namespaceObject = b(r2, y(r2), r2 && r2.__esModule);
      }
      function w(e2) {
        let t2 = e2.indexOf("#");
        -1 !== t2 && (e2 = e2.substring(0, t2));
        let r2 = e2.indexOf("?");
        return -1 !== r2 && (e2 = e2.substring(0, r2)), e2;
      }
      function O(e2) {
        return "string" == typeof e2 ? e2 : e2.path;
      }
      function _() {
        let e2, t2;
        return { promise: new Promise((r2, n2) => {
          t2 = n2, e2 = r2;
        }), resolve: e2, reject: t2 };
      }
      l.i = g, l.A = function(e2) {
        return this.r(e2)(g.bind(this));
      }, l.t = "function" == typeof __require ? __require : function() {
        throw Error("Unexpected use of runtime require");
      }, l.r = function(e2) {
        return K(e2, this.m).exports;
      }, l.f = function(e2) {
        function t2(t3) {
          if (t3 = w(t3), i.call(e2, t3)) return e2[t3].module();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }
        return t2.keys = () => Object.keys(e2), t2.resolve = (t3) => {
          if (t3 = w(t3), i.call(e2, t3)) return e2[t3].id();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }, t2.import = async (e3) => await t2(e3), t2;
      };
      let k = Symbol("turbopack queues"), j = Symbol("turbopack exports"), C = Symbol("turbopack error");
      function P(e2) {
        e2 && 1 !== e2.status && (e2.status = 1, e2.forEach((e3) => e3.queueCount--), e2.forEach((e3) => e3.queueCount-- ? e3.queueCount++ : e3()));
      }
      l.a = function(e2, t2) {
        let r2 = this.m, n2 = t2 ? Object.assign([], { status: -1 }) : void 0, o2 = /* @__PURE__ */ new Set(), { resolve: u2, reject: l2, promise: i2 } = _(), a2 = Object.assign(i2, { [j]: r2.exports, [k]: (e3) => {
          n2 && e3(n2), o2.forEach(e3), a2.catch(() => {
          });
        } }), s2 = { get: () => a2, set(e3) {
          e3 !== a2 && (a2[j] = e3);
        } };
        Object.defineProperty(r2, "exports", s2), Object.defineProperty(r2, "namespaceObject", s2), e2(function(e3) {
          let t3 = e3.map((e4) => {
            if (null !== e4 && "object" == typeof e4) {
              if (k in e4) return e4;
              if (null != e4 && "object" == typeof e4 && "then" in e4 && "function" == typeof e4.then) {
                let t4 = Object.assign([], { status: 0 }), r4 = { [j]: {}, [k]: (e5) => e5(t4) };
                return e4.then((e5) => {
                  r4[j] = e5, P(t4);
                }, (e5) => {
                  r4[C] = e5, P(t4);
                }), r4;
              }
            }
            return { [j]: e4, [k]: () => {
            } };
          }), r3 = () => t3.map((e4) => {
            if (e4[C]) throw e4[C];
            return e4[j];
          }), { promise: u3, resolve: l3 } = _(), i3 = Object.assign(() => l3(r3), { queueCount: 0 });
          function a3(e4) {
            e4 !== n2 && !o2.has(e4) && (o2.add(e4), e4 && 0 === e4.status && (i3.queueCount++, e4.push(i3)));
          }
          return t3.map((e4) => e4[k](a3)), i3.queueCount ? u3 : r3();
        }, function(e3) {
          e3 ? l2(a2[C] = e3) : u2(a2[j]), P(n2);
        }), n2 && -1 === n2.status && (n2.status = 0);
      };
      let v = function(e2) {
        let t2 = new URL(e2, "x:/"), r2 = {};
        for (let e3 in t2) r2[e3] = t2[e3];
        for (let t3 in r2.href = e2, r2.pathname = e2.replace(/[?#].*/, ""), r2.origin = r2.protocol = "", r2.toString = r2.toJSON = (...t4) => e2, r2) Object.defineProperty(this, t3, { enumerable: true, configurable: true, value: r2[t3] });
      };
      function E(e2, t2) {
        throw Error(`Invariant: ${t2(e2)}`);
      }
      v.prototype = URL.prototype, l.U = v, l.z = function(e2) {
        throw Error("dynamic usage of require is not supported");
      }, l.g = globalThis;
      let U = u.prototype, R = /* @__PURE__ */ new Map();
      l.M = R;
      let x = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map();
      async function $(e2, t2, r2) {
        let n2;
        if ("string" == typeof r2) return A(e2, t2, q(r2));
        let o2 = r2.included || [], u2 = o2.map((e3) => !!R.has(e3) || x.get(e3));
        if (u2.length > 0 && u2.every((e3) => e3)) return void await Promise.all(u2);
        let l2 = r2.moduleChunks || [], i2 = l2.map((e3) => M.get(e3)).filter((e3) => e3);
        if (i2.length > 0) {
          if (i2.length === l2.length) return void await Promise.all(i2);
          let r3 = /* @__PURE__ */ new Set();
          for (let e3 of l2) M.has(e3) || r3.add(e3);
          for (let n3 of r3) {
            let r4 = A(e2, t2, q(n3));
            M.set(n3, r4), i2.push(r4);
          }
          n2 = Promise.all(i2);
        } else {
          for (let o3 of (n2 = A(e2, t2, q(r2.path)), l2)) M.has(o3) || M.set(o3, n2);
        }
        for (let e3 of o2) x.has(e3) || x.set(e3, n2);
        await n2;
      }
      U.l = function(e2) {
        return $(n.Parent, this.m.id, e2);
      };
      let T = Promise.resolve(void 0), S = /* @__PURE__ */ new WeakMap();
      function A(t2, r2, o2) {
        let u2 = e.loadChunkCached(t2, o2), l2 = S.get(u2);
        if (void 0 === l2) {
          let e2 = S.set.bind(S, u2, T);
          l2 = u2.then(e2).catch((e3) => {
            let u3;
            switch (t2) {
              case n.Runtime:
                u3 = `as a runtime dependency of chunk ${r2}`;
                break;
              case n.Parent:
                u3 = `from module ${r2}`;
                break;
              case n.Update:
                u3 = "from an HMR update";
                break;
              default:
                E(t2, (e4) => `Unknown source type: ${e4}`);
            }
            let l3 = Error(`Failed to load chunk ${o2} ${u3}${e3 ? `: ${e3}` : ""}`, e3 ? { cause: e3 } : void 0);
            throw l3.name = "ChunkLoadError", l3;
          }), S.set(u2, l2);
        }
        return l2;
      }
      function q(e2) {
        return `${e2.split("/").map((e3) => encodeURIComponent(e3)).join("/")}`;
      }
      U.L = function(e2) {
        return A(n.Parent, this.m.id, e2);
      }, U.R = function(e2) {
        let t2 = this.r(e2);
        return t2?.default ?? t2;
      }, U.P = function(e2) {
        return `/ROOT/${e2 ?? ""}`;
      }, U.q = function(e2, t2) {
        h.call(this, `${e2}`, t2);
      }, U.b = function(e2, r2, n2, o2) {
        let u2 = "SharedWorker" === e2.name, l2 = [n2.map((e3) => q(e3)).reverse(), ""];
        for (let e3 of t) l2.push(globalThis[e3]);
        let i2 = new URL(q(r2), location.origin), a2 = JSON.stringify(l2);
        return u2 ? i2.searchParams.set("params", a2) : i2.hash = "#params=" + encodeURIComponent(a2), new e2(i2, o2 ? { ...o2, type: void 0 } : void 0);
      };
      let N = /\.js(?:\?[^#]*)?(?:#.*)?$/;
      l.w = function(t2, r2, o2) {
        return e.loadWebAssembly(n.Parent, this.m.id, t2, r2, o2);
      }, l.u = function(t2, r2) {
        return e.loadWebAssemblyModule(n.Parent, this.m.id, t2, r2);
      };
      let I = {};
      l.c = I;
      let K = (e2, t2) => {
        let r2 = I[e2];
        if (r2) {
          if (r2.error) throw r2.error;
          return r2;
        }
        return L(e2, n.Parent, t2.id);
      };
      function L(e2, t2, r2) {
        let n2 = R.get(e2);
        if ("function" != typeof n2) throw Error(function(e3, t3, r3) {
          let n3;
          switch (t3) {
            case 0:
              n3 = `as a runtime entry of chunk ${r3}`;
              break;
            case 1:
              n3 = `because it was required from module ${r3}`;
              break;
            case 2:
              n3 = "because of an HMR update";
              break;
            default:
              E(t3, (e4) => `Unknown source type: ${e4}`);
          }
          return `Module ${e3} was instantiated ${n3}, but the module factory is not available.`;
        }(e2, t2, r2));
        let o2 = f(e2), l2 = o2.exports;
        I[e2] = o2;
        let i2 = new u(o2, l2);
        try {
          n2(i2, o2, l2);
        } catch (e3) {
          throw o2.error = e3, e3;
        }
        return o2.namespaceObject && o2.exports !== o2.namespaceObject && b(o2.exports, o2.namespaceObject), o2;
      }
      function W(t2) {
        let r2, n2 = function(e2) {
          if ("string" == typeof e2) return e2;
          if (e2) return { src: e2.getAttribute("src") };
          if ("u" > typeof TURBOPACK_NEXT_CHUNK_URLS) return { src: TURBOPACK_NEXT_CHUNK_URLS.pop() };
          throw Error("chunk path empty but not in a worker");
        }(t2[0]);
        return 2 === t2.length ? r2 = t2[1] : (r2 = void 0, !function(e2, t3) {
          let r3 = 1;
          for (; r3 < e2.length; ) {
            let n3, o2 = r3 + 1;
            for (; o2 < e2.length && "function" != typeof e2[o2]; ) o2++;
            if (o2 === e2.length) throw Error("malformed chunk format, expected a factory function");
            let u2 = e2[o2];
            for (let u3 = r3; u3 < o2; u3++) {
              let r4 = e2[u3], o3 = t3.get(r4);
              if (o3) {
                n3 = o3;
                break;
              }
            }
            let l2 = n3 ?? u2, i2 = false;
            for (let n4 = r3; n4 < o2; n4++) {
              let r4 = e2[n4];
              t3.has(r4) || (i2 || (l2 === u2 && Object.defineProperty(u2, "name", { value: "module evaluation" }), i2 = true), t3.set(r4, l2));
            }
            r3 = o2 + 1;
          }
        }(t2, R)), e.registerChunk(n2, r2);
      }
      function B(e2, t2, r2 = false) {
        let n2;
        try {
          n2 = t2();
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return !r2 || n2.__esModule ? n2 : b(n2, y(n2), true);
      }
      l.y = async function(e2) {
        let t2;
        try {
          t2 = await import(e2);
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return t2 && t2.__esModule && t2.default && "default" in t2.default ? b(t2.default, y(t2), true) : t2;
      }, B.resolve = (e2, t2) => __require.resolve(e2, t2), l.x = B, e = { registerChunk(e2, t2) {
        let r2 = function(e3) {
          if ("string" == typeof e3) return e3;
          let t3 = decodeURIComponent(e3.src.replace(/[?#].*$/, ""));
          return t3.startsWith("") ? t3.slice(0) : t3;
        }(e2);
        F.add(r2), function(e3) {
          let t3 = D.get(e3);
          if (null != t3) {
            for (let r3 of t3) r3.requiredChunks.delete(e3), 0 === r3.requiredChunks.size && X(r3.runtimeModuleIds, r3.chunkPath);
            D.delete(e3);
          }
        }(r2), null != t2 && (0 === t2.otherChunks.length ? X(t2.runtimeModuleIds, r2) : function(e3, t3, r3) {
          let n2 = /* @__PURE__ */ new Set(), o2 = { runtimeModuleIds: r3, chunkPath: e3, requiredChunks: n2 };
          for (let e4 of t3) {
            let t4 = O(e4);
            if (F.has(t4)) continue;
            n2.add(t4);
            let r4 = D.get(t4);
            null == r4 && (r4 = /* @__PURE__ */ new Set(), D.set(t4, r4)), r4.add(o2);
          }
          0 === o2.requiredChunks.size && X(o2.runtimeModuleIds, o2.chunkPath);
        }(r2, t2.otherChunks.filter((e3) => {
          var t3;
          return t3 = O(e3), N.test(t3);
        }), t2.runtimeModuleIds));
      }, loadChunkCached(e2, t2) {
        throw Error("chunk loading is not supported");
      }, async loadWebAssembly(e2, t2, r2, n2, o2) {
        let u2 = await H(r2, n2);
        return await WebAssembly.instantiate(u2, o2);
      }, loadWebAssemblyModule: async (e2, t2, r2, n2) => H(r2, n2) };
      let F = /* @__PURE__ */ new Set(), D = /* @__PURE__ */ new Map();
      function X(e2, t2) {
        for (let r2 of e2) !function(e3, t3) {
          let r3 = I[t3];
          if (r3) {
            if (r3.error) throw r3.error;
            return;
          }
          L(t3, n.Runtime, e3);
        }(t2, r2);
      }
      async function H(e2, t2) {
        let r2;
        try {
          r2 = t2();
        } catch (e3) {
        }
        if (!r2) throw Error(`dynamically loading WebAssembly is not supported in this runtime as global was not injected for chunk '${e2}'`);
        return r2;
      }
      let z = globalThis.TURBOPACK;
      globalThis.TURBOPACK = { push: W }, z.forEach(W);
    })();
  }
});

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  const correspondingRoute = routes.find((route) => route.regex.some((r) => new RegExp(r).test(path3)));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/static|_next\\/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*))(\\\\.json)?[\\/#\\?]?$"] }];
    require_node_modules_next_dist_esm_build_templates_edge_wrapper_0a9gg_0();
    require_root_of_the_server_07aprkn();
    require_turbopack_node_modules_next_dist_esm_build_templates_edge_wrapper_10wlvud();
  }
});

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto2 from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "webpack": null, "typescript": { "ignoreBuildErrors": false }, "typedRoutes": false, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.js", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": true, "compress": true, "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 14400, "formats": ["image/webp"], "maximumRedirects": 3, "maximumResponseBody": 5e7, "dangerouslyAllowLocalIP": false, "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "attachment", "localPatterns": [{ "pathname": "**", "search": "" }], "remotePatterns": [{ "protocol": "https", "hostname": "**.supabase.co" }], "qualities": [75], "unoptimized": false, "customCacheHandler": false }, "devIndicators": { "position": "bottom-left" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "excludeDefaultMomentLocales": true, "reactProductionProfiling": false, "reactStrictMode": true, "reactMaxHeadersLength": 6e3, "httpAgentOptions": { "keepAlive": true }, "logging": { "serverFunctions": true, "browserToTerminal": "warn" }, "compiler": {}, "expireTime": 31536e3, "staticPageGenerationTimeout": 60, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "outputFileTracingRoot": "/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research", "cacheComponents": false, "cacheLife": { "default": { "stale": 300, "revalidate": 900, "expire": 4294967294 }, "seconds": { "stale": 30, "revalidate": 1, "expire": 60 }, "minutes": { "stale": 300, "revalidate": 60, "expire": 3600 }, "hours": { "stale": 300, "revalidate": 3600, "expire": 86400 }, "days": { "stale": 300, "revalidate": 86400, "expire": 604800 }, "weeks": { "stale": 300, "revalidate": 604800, "expire": 2592e3 }, "max": { "stale": 300, "revalidate": 2592e3, "expire": 31536e3 } }, "cacheHandlers": {}, "experimental": { "appNewScrollHandler": false, "useSkewCookie": false, "cssChunking": true, "multiZoneDraftMode": false, "appNavFailHandling": false, "prerenderEarlyExit": true, "serverMinification": true, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "cachedNavigations": false, "partialFallbacks": false, "dynamicOnHover": false, "varyParams": false, "prefetchInlining": false, "preloadEntriesOnStart": true, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "proxyPrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 11, "memoryBasedWorkersCount": false, "imgOptConcurrency": null, "imgOptTimeoutInSeconds": 7, "imgOptMaxInputPixels": 268402689, "imgOptSequentialRead": null, "imgOptSkipMetadata": null, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "typedEnv": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "authInterrupts": false, "webpackMemoryOptimizations": false, "optimizeServerReact": true, "strictRouteTypes": false, "viewTransition": false, "removeUncaughtErrorAndRejectionListeners": false, "validateRSCRequestHeaders": false, "staleTimes": { "dynamic": 0, "static": 300 }, "reactDebugChannel": true, "serverComponentsHmrCache": true, "staticGenerationMaxConcurrency": 8, "staticGenerationMinPagesPerWorker": 25, "transitionIndicator": false, "gestureTransition": false, "inlineCss": false, "useCache": false, "globalNotFound": false, "browserDebugInfoInTerminal": "warn", "lockDistDir": true, "proxyClientMaxBodySize": 10485760, "hideLogsAfterAbort": false, "mcpServer": true, "turbopackFileSystemCacheForDev": true, "turbopackFileSystemCacheForBuild": false, "turbopackInferModuleSideEffects": true, "turbopackPluginRuntimeStrategy": "childProcesses", "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "effect", "@effect/schema", "@effect/platform", "@effect/platform-node", "@effect/platform-browser", "@effect/platform-bun", "@effect/sql", "@effect/sql-mssql", "@effect/sql-mysql2", "@effect/sql-pg", "@effect/sql-sqlite-node", "@effect/sql-sqlite-bun", "@effect/sql-sqlite-wasm", "@effect/sql-sqlite-react-native", "@effect/rpc", "@effect/rpc-http", "@effect/typeclass", "@effect/experimental", "@effect/opentelemetry", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "htmlLimitedBots": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight", "bundlePagesRouterDependencies": false, "configFileName": "next.config.js", "turbopack": { "root": "/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Assistant-for-evaluating-scientific-research" }, "distDirRoot": ".next", "_originalRewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] } };
var BuildId = "Rc9L4jEinUz3pt_tro3aN";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "priority": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_global-error", "regex": "^/_global\\-error(?:/)?$", "routeKeys": {}, "namedRegex": "^/_global\\-error(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/admin/dashboard", "regex": "^/admin/dashboard(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/dashboard(?:/)?$" }, { "page": "/admin/monitoring", "regex": "^/admin/monitoring(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/monitoring(?:/)?$" }, { "page": "/admin/notifications", "regex": "^/admin/notifications(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/notifications(?:/)?$" }, { "page": "/admin/profile", "regex": "^/admin/profile(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/profile(?:/)?$" }, { "page": "/admin/reports", "regex": "^/admin/reports(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/reports(?:/)?$" }, { "page": "/admin/settings", "regex": "^/admin/settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/settings(?:/)?$" }, { "page": "/admin/statistics", "regex": "^/admin/statistics(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/statistics(?:/)?$" }, { "page": "/admin/submissions", "regex": "^/admin/submissions(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/submissions(?:/)?$" }, { "page": "/admin/users", "regex": "^/admin/users(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/users(?:/)?$" }, { "page": "/admin/verification-requests", "regex": "^/admin/verification\\-requests(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/verification\\-requests(?:/)?$" }, { "page": "/api/auth/login", "regex": "^/api/auth/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/login(?:/)?$" }, { "page": "/api/auth/logout", "regex": "^/api/auth/logout(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/logout(?:/)?$" }, { "page": "/api/auth/me", "regex": "^/api/auth/me(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/me(?:/)?$" }, { "page": "/api/auth/register", "regex": "^/api/auth/register(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/register(?:/)?$" }, { "page": "/api/auth/reset-password-direct", "regex": "^/api/auth/reset\\-password\\-direct(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/reset\\-password\\-direct(?:/)?$" }, { "page": "/api/auth/verify-email", "regex": "^/api/auth/verify\\-email(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/verify\\-email(?:/)?$" }, { "page": "/faq", "regex": "^/faq(?:/)?$", "routeKeys": {}, "namedRegex": "^/faq(?:/)?$" }, { "page": "/forgot-password", "regex": "^/forgot\\-password(?:/)?$", "routeKeys": {}, "namedRegex": "^/forgot\\-password(?:/)?$" }, { "page": "/help", "regex": "^/help(?:/)?$", "routeKeys": {}, "namedRegex": "^/help(?:/)?$" }, { "page": "/instructions", "regex": "^/instructions(?:/)?$", "routeKeys": {}, "namedRegex": "^/instructions(?:/)?$" }, { "page": "/login", "regex": "^/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/login(?:/)?$" }, { "page": "/privacy", "regex": "^/privacy(?:/)?$", "routeKeys": {}, "namedRegex": "^/privacy(?:/)?$" }, { "page": "/register", "regex": "^/register(?:/)?$", "routeKeys": {}, "namedRegex": "^/register(?:/)?$" }, { "page": "/researcher/dashboard", "regex": "^/researcher/dashboard(?:/)?$", "routeKeys": {}, "namedRegex": "^/researcher/dashboard(?:/)?$" }, { "page": "/researcher/notifications", "regex": "^/researcher/notifications(?:/)?$", "routeKeys": {}, "namedRegex": "^/researcher/notifications(?:/)?$" }, { "page": "/researcher/profile", "regex": "^/researcher/profile(?:/)?$", "routeKeys": {}, "namedRegex": "^/researcher/profile(?:/)?$" }, { "page": "/researcher/settings", "regex": "^/researcher/settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/researcher/settings(?:/)?$" }, { "page": "/researcher/submissions", "regex": "^/researcher/submissions(?:/)?$", "routeKeys": {}, "namedRegex": "^/researcher/submissions(?:/)?$" }, { "page": "/researcher/submit", "regex": "^/researcher/submit(?:/)?$", "routeKeys": {}, "namedRegex": "^/researcher/submit(?:/)?$" }, { "page": "/reset-password", "regex": "^/reset\\-password(?:/)?$", "routeKeys": {}, "namedRegex": "^/reset\\-password(?:/)?$" }, { "page": "/terms", "regex": "^/terms(?:/)?$", "routeKeys": {}, "namedRegex": "^/terms(?:/)?$" }, { "page": "/verify-email", "regex": "^/verify\\-email(?:/)?$", "routeKeys": {}, "namedRegex": "^/verify\\-email(?:/)?$" }], "dynamic": [{ "page": "/admin/submissions/[id]", "regex": "^/admin/submissions/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/submissions/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/admin/users/[id]", "regex": "^/admin/users/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/users/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/users/[id]/verification", "regex": "^/api/admin/users/([^/]+?)/verification(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/users/(?<nxtPid>[^/]+?)/verification(?:/)?$" }, { "page": "/researcher/submissions/[id]", "regex": "^/researcher/submissions/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/researcher/submissions/(?<nxtPid>[^/]+?)(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [{ "source": "/:path*.html", "headers": [{ "key": "X-Content-Type-Options", "value": "nosniff" }], "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))?\\.html(?:/)?$" }];
var PrerenderManifest = { "version": 4, "routes": { "/_global-error": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_global-error", "dataRoute": "/_global-error.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "ae096cacf228e90707bc28729bf6a35a", "previewModeSigningKey": "0dd875593f290717a661c5e5ceac6dade3dd1ed0997fb11bafaf5855c9b61258", "previewModeEncryptionKey": "0971e75eb2bf599c800f69443f855ed00fd3173ff925cac9eef96659348b8f01" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge/chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0a9gg_0.js", "server/edge/chunks/[root-of-the-server]__07aprkn._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_10wlvud.js"], "name": "middleware", "page": "/", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_10wlvud.js", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/static|_next\\/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*))(\\\\.json)?[\\/#\\?]?$", "originalSource": "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "Rc9L4jEinUz3pt_tro3aN", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "6JayUTSXnZPslDCyKMgaPF4WxvHm6+wQhPqkw0kKPWE=", "__NEXT_PREVIEW_MODE_ID": "ae096cacf228e90707bc28729bf6a35a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "0971e75eb2bf599c800f69443f855ed00fd3173ff925cac9eef96659348b8f01", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "0dd875593f290717a661c5e5ceac6dade3dd1ed0997fb11bafaf5855c9b61258" } } }, "sortedMiddleware": ["/"], "functions": {} };
var AppPathRoutesManifest = { "/_global-error/page": "/_global-error", "/_not-found/page": "/_not-found", "/admin/dashboard/page": "/admin/dashboard", "/admin/monitoring/page": "/admin/monitoring", "/admin/notifications/page": "/admin/notifications", "/admin/profile/page": "/admin/profile", "/admin/reports/page": "/admin/reports", "/admin/settings/page": "/admin/settings", "/admin/statistics/page": "/admin/statistics", "/admin/submissions/[id]/page": "/admin/submissions/[id]", "/admin/submissions/page": "/admin/submissions", "/admin/users/[id]/page": "/admin/users/[id]", "/admin/users/page": "/admin/users", "/admin/verification-requests/page": "/admin/verification-requests", "/api/admin/users/[id]/verification/route": "/api/admin/users/[id]/verification", "/api/auth/login/route": "/api/auth/login", "/api/auth/logout/route": "/api/auth/logout", "/api/auth/me/route": "/api/auth/me", "/api/auth/register/route": "/api/auth/register", "/api/auth/reset-password-direct/route": "/api/auth/reset-password-direct", "/api/auth/verify-email/route": "/api/auth/verify-email", "/faq/page": "/faq", "/forgot-password/page": "/forgot-password", "/help/page": "/help", "/instructions/page": "/instructions", "/login/page": "/login", "/page": "/", "/privacy/page": "/privacy", "/register/page": "/register", "/researcher/dashboard/page": "/researcher/dashboard", "/researcher/notifications/page": "/researcher/notifications", "/researcher/profile/page": "/researcher/profile", "/researcher/settings/page": "/researcher/settings", "/researcher/submissions/[id]/page": "/researcher/submissions/[id]", "/researcher/submissions/page": "/researcher/submissions", "/researcher/submit/page": "/researcher/submit", "/reset-password/page": "/reset-password", "/terms/page": "/terms", "/verify-email/page": "/verify-email" };
var FunctionsConfigManifest = { "version": 1, "functions": {} };
var PagesManifest = { "/500": "pages/500.html" };
process.env.NEXT_BUILD_ID = BuildId;
process.env.NEXT_PREVIEW_MODE_ID = PrerenderManifest?.preview?.previewModeId;

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();
import { ReadableStream as ReadableStream3 } from "node:stream/web";

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType.split(";")[0];
  return commonBinaryMimeTypes.has(value);
}

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: constructNextUrl(internalEvent.url, `/${detectedLocale}`)
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (!pattern.test(url))
    return false;
  if (host) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.host !== host;
    } catch {
      return !url.includes(host);
    }
  }
  return true;
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  return new ReadableStream3({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function normalizeLocationHeader(location2, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location2)) {
    return location2;
  }
  const locationURL = new URL(location2);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    const cacheTags = value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
    delete value.meta?.headers?.["x-next-cache-tags"];
    return cacheTags;
  } catch (e) {
    return [];
  }
}

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
var NEXT_SEGMENT_PREFETCH_HEADER = "next-router-segment-prefetch";
var NEXT_PRERENDER_HEADER = "x-nextjs-prerender";
var NEXT_POSTPONED_HEADER = "x-nextjs-postponed";
async function computeCacheControl(path3, body, host, revalidate, lastModified) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest?.routes ?? {}).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  if (finalRevalidate !== CACHE_ONE_YEAR) {
    const sMaxAge = Math.max(finalRevalidate - age, 1);
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate
    });
    const isStale = sMaxAge === 1;
    if (isStale) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
function getBodyForAppRouter(event, cachedValue) {
  if (cachedValue.type !== "app") {
    throw new Error("getBodyForAppRouter called with non-app cache value");
  }
  try {
    const segmentHeader = `${event.headers[NEXT_SEGMENT_PREFETCH_HEADER]}`;
    const isSegmentResponse = Boolean(segmentHeader) && segmentHeader in (cachedValue.segmentData || {});
    const body = isSegmentResponse ? cachedValue.segmentData[segmentHeader] : cachedValue.rsc;
    return {
      body,
      additionalHeaders: isSegmentResponse ? { [NEXT_PRERENDER_HEADER]: "1", [NEXT_POSTPONED_HEADER]: "2" } : {}
    };
  } catch (e) {
    error("Error while getting body for app router from cache:", e);
    return { body: cachedValue.rsc, additionalHeaders: {} };
  }
}
async function generateResult(event, localizedPath, cachedValue, lastModified) {
  debug("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  let additionalHeaders = {};
  if (cachedValue.type === "app") {
    isDataRequest = Boolean(event.headers.rsc);
    if (isDataRequest) {
      const { body: appRouterBody, additionalHeaders: appHeaders } = getBodyForAppRouter(event, cachedValue);
      body = appRouterBody;
      additionalHeaders = appHeaders;
    } else {
      body = cachedValue.html;
    }
    type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
  } else if (cachedValue.type === "page") {
    isDataRequest = Boolean(event.query.__nextDataReq);
    body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
    type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
  } else {
    throw new Error("generateResult called with unsupported cache value type, only 'app' and 'page' are supported");
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified);
  return {
    type: "core",
    // Sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    // Also set the status code to the rewriteStatusCode if defined
    // This can happen in handleMiddleware in routingHandler.
    // `NextResponse.rewrite(url, { status: xxx})
    // The rewrite status code should take precedence over the cached one
    statusCode: event.rewriteStatusCode ?? cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER,
      ...additionalHeaders
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => {
    try {
      return escapePathDelimiters(decodeURIComponent(segment), true);
    } catch (e) {
      return segment;
    }
  }).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  localizedPath = decodePathParams(localizedPath);
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest?.routes ?? {}).includes(localizedPath ?? "/") || Object.values(PrerenderManifest?.dynamicRoutes ?? {}).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(localizedPath ?? "/index");
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const tags = getTagsFromValue(cachedData.value);
        const _hasBeenRevalidated = cachedData.shouldBypassTagCache ? false : await hasBeenRevalidated(localizedPath, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          return {
            type: "core",
            statusCode: event.rewriteStatusCode ?? cachedData.value.meta?.status ?? 200,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers: {
              ...cacheControl,
              ...cachedData.value.meta?.headers,
              vary: VARY_HEADER
            },
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => (route.startsWith("/api/") || route === "/api") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !event.headers["x-nextjs-data"] && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes = {}, routes = {} } = prerenderManifest ?? {};
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest?.preview?.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: rewriteUrl && !isExternalRewrite ? statusCode : void 0
  };
}

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      if (key.startsWith(INTERNAL_HEADER_PREFIX) || key.startsWith(MIDDLEWARE_HEADER_PREFIX)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    const middlewareHeadersPrioritized = globalThis.openNextConfig.dangerous?.middlewareHeadersOverrideNextConfigHeaders ?? false;
    if (middlewareHeadersPrioritized) {
      headers = {
        ...headers,
        ...middlewareEventOrResult.responseHeaders
      };
    } else {
      headers = {
        ...middlewareEventOrResult.responseHeaders,
        ...headers
      };
    }
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// ../../../../.npm/_npx/b8f71965aba33be8/node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    if (process.env.OPEN_NEXT_REQUEST_ID_HEADER || globalThis.openNextDebug) {
      result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    }
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
