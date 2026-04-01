
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
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
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

// node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/adapters/logger.js
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
  "node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
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

// node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/cookie/dist/index.js"(exports) {
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

// node_modules/@opennextjs/aws/dist/http/util.js
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
  "node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
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

// node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
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

// node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
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
  "node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
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

// node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// node_modules/@opennextjs/aws/dist/utils/stream.js
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
  "node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
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

// .next/server/edge-runtime-webpack.js
var require_edge_runtime_webpack = __commonJS({
  ".next/server/edge-runtime-webpack.js"() {
    "use strict";
    (() => {
      "use strict";
      var a, b, c, d, e, f, g = {}, h = {};
      function i(a2) {
        var b2 = h[a2];
        if (void 0 !== b2) return b2.exports;
        var c2 = h[a2] = { exports: {} }, d2 = true;
        try {
          g[a2](c2, c2.exports, i), d2 = false;
        } finally {
          d2 && delete h[a2];
        }
        return c2.exports;
      }
      i.m = g, i.amdO = {}, a = [], i.O = (b2, c2, d2, e2) => {
        if (c2) {
          e2 = e2 || 0;
          for (var f2 = a.length; f2 > 0 && a[f2 - 1][2] > e2; f2--) a[f2] = a[f2 - 1];
          a[f2] = [c2, d2, e2];
          return;
        }
        for (var g2 = 1 / 0, f2 = 0; f2 < a.length; f2++) {
          for (var [c2, d2, e2] = a[f2], h2 = true, j = 0; j < c2.length; j++) (false & e2 || g2 >= e2) && Object.keys(i.O).every((a2) => i.O[a2](c2[j])) ? c2.splice(j--, 1) : (h2 = false, e2 < g2 && (g2 = e2));
          if (h2) {
            a.splice(f2--, 1);
            var k = d2();
            void 0 !== k && (b2 = k);
          }
        }
        return b2;
      }, i.n = (a2) => {
        var b2 = a2 && a2.__esModule ? () => a2.default : () => a2;
        return i.d(b2, { a: b2 }), b2;
      }, c = Object.getPrototypeOf ? (a2) => Object.getPrototypeOf(a2) : (a2) => a2.__proto__, i.t = function(a2, d2) {
        if (1 & d2 && (a2 = this(a2)), 8 & d2 || "object" == typeof a2 && a2 && (4 & d2 && a2.__esModule || 16 & d2 && "function" == typeof a2.then)) return a2;
        var e2 = /* @__PURE__ */ Object.create(null);
        i.r(e2);
        var f2 = {};
        b = b || [null, c({}), c([]), c(c)];
        for (var g2 = 2 & d2 && a2; "object" == typeof g2 && !~b.indexOf(g2); g2 = c(g2)) Object.getOwnPropertyNames(g2).forEach((b2) => f2[b2] = () => a2[b2]);
        return f2.default = () => a2, i.d(e2, f2), e2;
      }, i.d = (a2, b2) => {
        for (var c2 in b2) i.o(b2, c2) && !i.o(a2, c2) && Object.defineProperty(a2, c2, { enumerable: true, get: b2[c2] });
      }, i.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || Function("return this")();
        } catch (a2) {
          if ("object" == typeof window) return window;
        }
      }(), i.o = (a2, b2) => Object.prototype.hasOwnProperty.call(a2, b2), i.r = (a2) => {
        "u" > typeof Symbol && Symbol.toStringTag && Object.defineProperty(a2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(a2, "__esModule", { value: true });
      }, d = { 149: 0 }, i.O.j = (a2) => 0 === d[a2], e = (a2, b2) => {
        var c2, e2, [f2, g2, h2] = b2, j = 0;
        if (f2.some((a3) => 0 !== d[a3])) {
          for (c2 in g2) i.o(g2, c2) && (i.m[c2] = g2[c2]);
          if (h2) var k = h2(i);
        }
        for (a2 && a2(b2); j < f2.length; j++) e2 = f2[j], i.o(d, e2) && d[e2] && d[e2][0](), d[e2] = 0;
        return i.O(k);
      }, (f = self.webpackChunk_N_E = self.webpackChunk_N_E || []).forEach(e.bind(null, 0)), f.push = e.bind(null, f.push.bind(f));
    })();
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

// .next/server/middleware.js
var require_middleware = __commonJS({
  ".next/server/middleware.js"() {
    "use strict";
    (self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[751], { 42: (a) => {
      !function() {
        "use strict";
        var b = { 114: function(a2) {
          function b2(a3) {
            if ("string" != typeof a3) throw TypeError("Path must be a string. Received " + JSON.stringify(a3));
          }
          function c2(a3, b3) {
            for (var c3, d3 = "", e = 0, f = -1, g = 0, h = 0; h <= a3.length; ++h) {
              if (h < a3.length) c3 = a3.charCodeAt(h);
              else if (47 === c3) break;
              else c3 = 47;
              if (47 === c3) {
                if (f === h - 1 || 1 === g) ;
                else if (f !== h - 1 && 2 === g) {
                  if (d3.length < 2 || 2 !== e || 46 !== d3.charCodeAt(d3.length - 1) || 46 !== d3.charCodeAt(d3.length - 2)) {
                    if (d3.length > 2) {
                      var i = d3.lastIndexOf("/");
                      if (i !== d3.length - 1) {
                        -1 === i ? (d3 = "", e = 0) : e = (d3 = d3.slice(0, i)).length - 1 - d3.lastIndexOf("/"), f = h, g = 0;
                        continue;
                      }
                    } else if (2 === d3.length || 1 === d3.length) {
                      d3 = "", e = 0, f = h, g = 0;
                      continue;
                    }
                  }
                  b3 && (d3.length > 0 ? d3 += "/.." : d3 = "..", e = 2);
                } else d3.length > 0 ? d3 += "/" + a3.slice(f + 1, h) : d3 = a3.slice(f + 1, h), e = h - f - 1;
                f = h, g = 0;
              } else 46 === c3 && -1 !== g ? ++g : g = -1;
            }
            return d3;
          }
          var d2 = { resolve: function() {
            for (var a3, d3, e = "", f = false, g = arguments.length - 1; g >= -1 && !f; g--) g >= 0 ? d3 = arguments[g] : (void 0 === a3 && (a3 = ""), d3 = a3), b2(d3), 0 !== d3.length && (e = d3 + "/" + e, f = 47 === d3.charCodeAt(0));
            if (e = c2(e, !f), f) if (e.length > 0) return "/" + e;
            else return "/";
            return e.length > 0 ? e : ".";
          }, normalize: function(a3) {
            if (b2(a3), 0 === a3.length) return ".";
            var d3 = 47 === a3.charCodeAt(0), e = 47 === a3.charCodeAt(a3.length - 1);
            return (0 !== (a3 = c2(a3, !d3)).length || d3 || (a3 = "."), a3.length > 0 && e && (a3 += "/"), d3) ? "/" + a3 : a3;
          }, isAbsolute: function(a3) {
            return b2(a3), a3.length > 0 && 47 === a3.charCodeAt(0);
          }, join: function() {
            if (0 == arguments.length) return ".";
            for (var a3, c3 = 0; c3 < arguments.length; ++c3) {
              var e = arguments[c3];
              b2(e), e.length > 0 && (void 0 === a3 ? a3 = e : a3 += "/" + e);
            }
            return void 0 === a3 ? "." : d2.normalize(a3);
          }, relative: function(a3, c3) {
            if (b2(a3), b2(c3), a3 === c3 || (a3 = d2.resolve(a3)) === (c3 = d2.resolve(c3))) return "";
            for (var e = 1; e < a3.length && 47 === a3.charCodeAt(e); ++e) ;
            for (var f = a3.length, g = f - e, h = 1; h < c3.length && 47 === c3.charCodeAt(h); ++h) ;
            for (var i = c3.length - h, j = g < i ? g : i, k = -1, l = 0; l <= j; ++l) {
              if (l === j) {
                if (i > j) {
                  if (47 === c3.charCodeAt(h + l)) return c3.slice(h + l + 1);
                  else if (0 === l) return c3.slice(h + l);
                } else g > j && (47 === a3.charCodeAt(e + l) ? k = l : 0 === l && (k = 0));
                break;
              }
              var m = a3.charCodeAt(e + l);
              if (m !== c3.charCodeAt(h + l)) break;
              47 === m && (k = l);
            }
            var n = "";
            for (l = e + k + 1; l <= f; ++l) (l === f || 47 === a3.charCodeAt(l)) && (0 === n.length ? n += ".." : n += "/..");
            return n.length > 0 ? n + c3.slice(h + k) : (h += k, 47 === c3.charCodeAt(h) && ++h, c3.slice(h));
          }, _makeLong: function(a3) {
            return a3;
          }, dirname: function(a3) {
            if (b2(a3), 0 === a3.length) return ".";
            for (var c3 = a3.charCodeAt(0), d3 = 47 === c3, e = -1, f = true, g = a3.length - 1; g >= 1; --g) if (47 === (c3 = a3.charCodeAt(g))) {
              if (!f) {
                e = g;
                break;
              }
            } else f = false;
            return -1 === e ? d3 ? "/" : "." : d3 && 1 === e ? "//" : a3.slice(0, e);
          }, basename: function(a3, c3) {
            if (void 0 !== c3 && "string" != typeof c3) throw TypeError('"ext" argument must be a string');
            b2(a3);
            var d3, e = 0, f = -1, g = true;
            if (void 0 !== c3 && c3.length > 0 && c3.length <= a3.length) {
              if (c3.length === a3.length && c3 === a3) return "";
              var h = c3.length - 1, i = -1;
              for (d3 = a3.length - 1; d3 >= 0; --d3) {
                var j = a3.charCodeAt(d3);
                if (47 === j) {
                  if (!g) {
                    e = d3 + 1;
                    break;
                  }
                } else -1 === i && (g = false, i = d3 + 1), h >= 0 && (j === c3.charCodeAt(h) ? -1 == --h && (f = d3) : (h = -1, f = i));
              }
              return e === f ? f = i : -1 === f && (f = a3.length), a3.slice(e, f);
            }
            for (d3 = a3.length - 1; d3 >= 0; --d3) if (47 === a3.charCodeAt(d3)) {
              if (!g) {
                e = d3 + 1;
                break;
              }
            } else -1 === f && (g = false, f = d3 + 1);
            return -1 === f ? "" : a3.slice(e, f);
          }, extname: function(a3) {
            b2(a3);
            for (var c3 = -1, d3 = 0, e = -1, f = true, g = 0, h = a3.length - 1; h >= 0; --h) {
              var i = a3.charCodeAt(h);
              if (47 === i) {
                if (!f) {
                  d3 = h + 1;
                  break;
                }
                continue;
              }
              -1 === e && (f = false, e = h + 1), 46 === i ? -1 === c3 ? c3 = h : 1 !== g && (g = 1) : -1 !== c3 && (g = -1);
            }
            return -1 === c3 || -1 === e || 0 === g || 1 === g && c3 === e - 1 && c3 === d3 + 1 ? "" : a3.slice(c3, e);
          }, format: function(a3) {
            var b3, c3;
            if (null === a3 || "object" != typeof a3) throw TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof a3);
            return b3 = a3.dir || a3.root, c3 = a3.base || (a3.name || "") + (a3.ext || ""), b3 ? b3 === a3.root ? b3 + c3 : b3 + "/" + c3 : c3;
          }, parse: function(a3) {
            b2(a3);
            var c3, d3 = { root: "", dir: "", base: "", ext: "", name: "" };
            if (0 === a3.length) return d3;
            var e = a3.charCodeAt(0), f = 47 === e;
            f ? (d3.root = "/", c3 = 1) : c3 = 0;
            for (var g = -1, h = 0, i = -1, j = true, k = a3.length - 1, l = 0; k >= c3; --k) {
              if (47 === (e = a3.charCodeAt(k))) {
                if (!j) {
                  h = k + 1;
                  break;
                }
                continue;
              }
              -1 === i && (j = false, i = k + 1), 46 === e ? -1 === g ? g = k : 1 !== l && (l = 1) : -1 !== g && (l = -1);
            }
            return -1 === g || -1 === i || 0 === l || 1 === l && g === i - 1 && g === h + 1 ? -1 !== i && (0 === h && f ? d3.base = d3.name = a3.slice(1, i) : d3.base = d3.name = a3.slice(h, i)) : (0 === h && f ? (d3.name = a3.slice(1, g), d3.base = a3.slice(1, i)) : (d3.name = a3.slice(h, g), d3.base = a3.slice(h, i)), d3.ext = a3.slice(g, i)), h > 0 ? d3.dir = a3.slice(0, h - 1) : f && (d3.dir = "/"), d3;
          }, sep: "/", delimiter: ":", win32: null, posix: null };
          d2.posix = d2, a2.exports = d2;
        } }, c = {};
        function d(a2) {
          var e = c[a2];
          if (void 0 !== e) return e.exports;
          var f = c[a2] = { exports: {} }, g = true;
          try {
            b[a2](f, f.exports, d), g = false;
          } finally {
            g && delete c[a2];
          }
          return f.exports;
        }
        d.ab = "//", a.exports = d(114);
      }();
    }, 51: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      let d = c(284), e = d.__importDefault(c(855)), f = d.__importDefault(c(827));
      class g {
        constructor(a2, { headers: b2 = {}, schema: c2, fetch: d2 } = {}) {
          this.url = a2, this.headers = new Headers(b2), this.schemaName = c2, this.fetch = d2;
        }
        from(a2) {
          let b2 = new URL(`${this.url}/${a2}`);
          return new e.default(b2, { headers: new Headers(this.headers), schema: this.schemaName, fetch: this.fetch });
        }
        schema(a2) {
          return new g(this.url, { headers: this.headers, schema: a2, fetch: this.fetch });
        }
        rpc(a2, b2 = {}, { head: c2 = false, get: d2 = false, count: e2 } = {}) {
          var g2;
          let h, i, j = new URL(`${this.url}/rpc/${a2}`);
          c2 || d2 ? (h = c2 ? "HEAD" : "GET", Object.entries(b2).filter(([a3, b3]) => void 0 !== b3).map(([a3, b3]) => [a3, Array.isArray(b3) ? `{${b3.join(",")}}` : `${b3}`]).forEach(([a3, b3]) => {
            j.searchParams.append(a3, b3);
          })) : (h = "POST", i = b2);
          let k = new Headers(this.headers);
          return e2 && k.set("Prefer", `count=${e2}`), new f.default({ method: h, url: j, headers: k, schema: this.schemaName, body: i, fetch: null != (g2 = this.fetch) ? g2 : fetch });
        }
      }
      b.default = g;
    }, 69: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      let d = c(284).__importDefault(c(486));
      class e {
        constructor(a2) {
          var b2, c2;
          this.shouldThrowOnError = false, this.method = a2.method, this.url = a2.url, this.headers = new Headers(a2.headers), this.schema = a2.schema, this.body = a2.body, this.shouldThrowOnError = null != (b2 = a2.shouldThrowOnError) && b2, this.signal = a2.signal, this.isMaybeSingle = null != (c2 = a2.isMaybeSingle) && c2, a2.fetch ? this.fetch = a2.fetch : this.fetch = fetch;
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        setHeader(a2, b2) {
          return this.headers = new Headers(this.headers), this.headers.set(a2, b2), this;
        }
        then(a2, b2) {
          void 0 === this.schema || (["GET", "HEAD"].includes(this.method) ? this.headers.set("Accept-Profile", this.schema) : this.headers.set("Content-Profile", this.schema)), "GET" !== this.method && "HEAD" !== this.method && this.headers.set("Content-Type", "application/json");
          let c2 = (0, this.fetch)(this.url.toString(), { method: this.method, headers: this.headers, body: JSON.stringify(this.body), signal: this.signal }).then(async (a3) => {
            var b3, c3, e2, f;
            let g = null, h = null, i = null, j = a3.status, k = a3.statusText;
            if (a3.ok) {
              if ("HEAD" !== this.method) {
                let c4 = await a3.text();
                "" === c4 || (h = "text/csv" === this.headers.get("Accept") || this.headers.get("Accept") && (null == (b3 = this.headers.get("Accept")) ? void 0 : b3.includes("application/vnd.pgrst.plan+text")) ? c4 : JSON.parse(c4));
              }
              let d2 = null == (c3 = this.headers.get("Prefer")) ? void 0 : c3.match(/count=(exact|planned|estimated)/), f2 = null == (e2 = a3.headers.get("content-range")) ? void 0 : e2.split("/");
              d2 && f2 && f2.length > 1 && (i = parseInt(f2[1])), this.isMaybeSingle && "GET" === this.method && Array.isArray(h) && (h.length > 1 ? (g = { code: "PGRST116", details: `Results contain ${h.length} rows, application/vnd.pgrst.object+json requires 1 row`, hint: null, message: "JSON object requested, multiple (or no) rows returned" }, h = null, i = null, j = 406, k = "Not Acceptable") : h = 1 === h.length ? h[0] : null);
            } else {
              let b4 = await a3.text();
              try {
                g = JSON.parse(b4), Array.isArray(g) && 404 === a3.status && (h = [], g = null, j = 200, k = "OK");
              } catch (c4) {
                404 === a3.status && "" === b4 ? (j = 204, k = "No Content") : g = { message: b4 };
              }
              if (g && this.isMaybeSingle && (null == (f = null == g ? void 0 : g.details) ? void 0 : f.includes("0 rows")) && (g = null, j = 200, k = "OK"), g && this.shouldThrowOnError) throw new d.default(g);
            }
            return { error: g, data: h, count: i, status: j, statusText: k };
          });
          return this.shouldThrowOnError || (c2 = c2.catch((a3) => {
            var b3, c3, d2;
            return { error: { message: `${null != (b3 = null == a3 ? void 0 : a3.name) ? b3 : "FetchError"}: ${null == a3 ? void 0 : a3.message}`, details: `${null != (c3 = null == a3 ? void 0 : a3.stack) ? c3 : ""}`, hint: "", code: `${null != (d2 = null == a3 ? void 0 : a3.code) ? d2 : ""}` }, data: null, count: null, status: 0, statusText: "" };
          })), c2.then(a2, b2);
        }
        returns() {
          return this;
        }
        overrideTypes() {
          return this;
        }
      }
      b.default = e;
    }, 232: (a) => {
      (() => {
        "use strict";
        var b = { 993: (a2) => {
          var b2 = Object.prototype.hasOwnProperty, c2 = "~";
          function d2() {
          }
          function e2(a3, b3, c3) {
            this.fn = a3, this.context = b3, this.once = c3 || false;
          }
          function f(a3, b3, d3, f2, g2) {
            if ("function" != typeof d3) throw TypeError("The listener must be a function");
            var h2 = new e2(d3, f2 || a3, g2), i = c2 ? c2 + b3 : b3;
            return a3._events[i] ? a3._events[i].fn ? a3._events[i] = [a3._events[i], h2] : a3._events[i].push(h2) : (a3._events[i] = h2, a3._eventsCount++), a3;
          }
          function g(a3, b3) {
            0 == --a3._eventsCount ? a3._events = new d2() : delete a3._events[b3];
          }
          function h() {
            this._events = new d2(), this._eventsCount = 0;
          }
          Object.create && (d2.prototype = /* @__PURE__ */ Object.create(null), new d2().__proto__ || (c2 = false)), h.prototype.eventNames = function() {
            var a3, d3, e3 = [];
            if (0 === this._eventsCount) return e3;
            for (d3 in a3 = this._events) b2.call(a3, d3) && e3.push(c2 ? d3.slice(1) : d3);
            return Object.getOwnPropertySymbols ? e3.concat(Object.getOwnPropertySymbols(a3)) : e3;
          }, h.prototype.listeners = function(a3) {
            var b3 = c2 ? c2 + a3 : a3, d3 = this._events[b3];
            if (!d3) return [];
            if (d3.fn) return [d3.fn];
            for (var e3 = 0, f2 = d3.length, g2 = Array(f2); e3 < f2; e3++) g2[e3] = d3[e3].fn;
            return g2;
          }, h.prototype.listenerCount = function(a3) {
            var b3 = c2 ? c2 + a3 : a3, d3 = this._events[b3];
            return d3 ? d3.fn ? 1 : d3.length : 0;
          }, h.prototype.emit = function(a3, b3, d3, e3, f2, g2) {
            var h2 = c2 ? c2 + a3 : a3;
            if (!this._events[h2]) return false;
            var i, j, k = this._events[h2], l = arguments.length;
            if (k.fn) {
              switch (k.once && this.removeListener(a3, k.fn, void 0, true), l) {
                case 1:
                  return k.fn.call(k.context), true;
                case 2:
                  return k.fn.call(k.context, b3), true;
                case 3:
                  return k.fn.call(k.context, b3, d3), true;
                case 4:
                  return k.fn.call(k.context, b3, d3, e3), true;
                case 5:
                  return k.fn.call(k.context, b3, d3, e3, f2), true;
                case 6:
                  return k.fn.call(k.context, b3, d3, e3, f2, g2), true;
              }
              for (j = 1, i = Array(l - 1); j < l; j++) i[j - 1] = arguments[j];
              k.fn.apply(k.context, i);
            } else {
              var m, n = k.length;
              for (j = 0; j < n; j++) switch (k[j].once && this.removeListener(a3, k[j].fn, void 0, true), l) {
                case 1:
                  k[j].fn.call(k[j].context);
                  break;
                case 2:
                  k[j].fn.call(k[j].context, b3);
                  break;
                case 3:
                  k[j].fn.call(k[j].context, b3, d3);
                  break;
                case 4:
                  k[j].fn.call(k[j].context, b3, d3, e3);
                  break;
                default:
                  if (!i) for (m = 1, i = Array(l - 1); m < l; m++) i[m - 1] = arguments[m];
                  k[j].fn.apply(k[j].context, i);
              }
            }
            return true;
          }, h.prototype.on = function(a3, b3, c3) {
            return f(this, a3, b3, c3, false);
          }, h.prototype.once = function(a3, b3, c3) {
            return f(this, a3, b3, c3, true);
          }, h.prototype.removeListener = function(a3, b3, d3, e3) {
            var f2 = c2 ? c2 + a3 : a3;
            if (!this._events[f2]) return this;
            if (!b3) return g(this, f2), this;
            var h2 = this._events[f2];
            if (h2.fn) h2.fn !== b3 || e3 && !h2.once || d3 && h2.context !== d3 || g(this, f2);
            else {
              for (var i = 0, j = [], k = h2.length; i < k; i++) (h2[i].fn !== b3 || e3 && !h2[i].once || d3 && h2[i].context !== d3) && j.push(h2[i]);
              j.length ? this._events[f2] = 1 === j.length ? j[0] : j : g(this, f2);
            }
            return this;
          }, h.prototype.removeAllListeners = function(a3) {
            var b3;
            return a3 ? (b3 = c2 ? c2 + a3 : a3, this._events[b3] && g(this, b3)) : (this._events = new d2(), this._eventsCount = 0), this;
          }, h.prototype.off = h.prototype.removeListener, h.prototype.addListener = h.prototype.on, h.prefixed = c2, h.EventEmitter = h, a2.exports = h;
        }, 213: (a2) => {
          a2.exports = (a3, b2) => (b2 = b2 || (() => {
          }), a3.then((a4) => new Promise((a5) => {
            a5(b2());
          }).then(() => a4), (a4) => new Promise((a5) => {
            a5(b2());
          }).then(() => {
            throw a4;
          })));
        }, 574: (a2, b2) => {
          Object.defineProperty(b2, "__esModule", { value: true }), b2.default = function(a3, b3, c2) {
            let d2 = 0, e2 = a3.length;
            for (; e2 > 0; ) {
              let f = e2 / 2 | 0, g = d2 + f;
              0 >= c2(a3[g], b3) ? (d2 = ++g, e2 -= f + 1) : e2 = f;
            }
            return d2;
          };
        }, 821: (a2, b2, c2) => {
          Object.defineProperty(b2, "__esModule", { value: true });
          let d2 = c2(574);
          class e2 {
            constructor() {
              this._queue = [];
            }
            enqueue(a3, b3) {
              let c3 = { priority: (b3 = Object.assign({ priority: 0 }, b3)).priority, run: a3 };
              if (this.size && this._queue[this.size - 1].priority >= b3.priority) return void this._queue.push(c3);
              let e3 = d2.default(this._queue, c3, (a4, b4) => b4.priority - a4.priority);
              this._queue.splice(e3, 0, c3);
            }
            dequeue() {
              let a3 = this._queue.shift();
              return null == a3 ? void 0 : a3.run;
            }
            filter(a3) {
              return this._queue.filter((b3) => b3.priority === a3.priority).map((a4) => a4.run);
            }
            get size() {
              return this._queue.length;
            }
          }
          b2.default = e2;
        }, 816: (a2, b2, c2) => {
          let d2 = c2(213);
          class e2 extends Error {
            constructor(a3) {
              super(a3), this.name = "TimeoutError";
            }
          }
          let f = (a3, b3, c3) => new Promise((f2, g) => {
            if ("number" != typeof b3 || b3 < 0) throw TypeError("Expected `milliseconds` to be a positive number");
            if (b3 === 1 / 0) return void f2(a3);
            let h = setTimeout(() => {
              if ("function" == typeof c3) {
                try {
                  f2(c3());
                } catch (a4) {
                  g(a4);
                }
                return;
              }
              let d3 = "string" == typeof c3 ? c3 : `Promise timed out after ${b3} milliseconds`, h2 = c3 instanceof Error ? c3 : new e2(d3);
              "function" == typeof a3.cancel && a3.cancel(), g(h2);
            }, b3);
            d2(a3.then(f2, g), () => {
              clearTimeout(h);
            });
          });
          a2.exports = f, a2.exports.default = f, a2.exports.TimeoutError = e2;
        } }, c = {};
        function d(a2) {
          var e2 = c[a2];
          if (void 0 !== e2) return e2.exports;
          var f = c[a2] = { exports: {} }, g = true;
          try {
            b[a2](f, f.exports, d), g = false;
          } finally {
            g && delete c[a2];
          }
          return f.exports;
        }
        d.ab = "//";
        var e = {};
        (() => {
          Object.defineProperty(e, "__esModule", { value: true });
          let a2 = d(993), b2 = d(816), c2 = d(821), f = () => {
          }, g = new b2.TimeoutError();
          class h extends a2 {
            constructor(a3) {
              var b3, d2, e2, g2;
              if (super(), this._intervalCount = 0, this._intervalEnd = 0, this._pendingCount = 0, this._resolveEmpty = f, this._resolveIdle = f, !("number" == typeof (a3 = Object.assign({ carryoverConcurrencyCount: false, intervalCap: 1 / 0, interval: 0, concurrency: 1 / 0, autoStart: true, queueClass: c2.default }, a3)).intervalCap && a3.intervalCap >= 1)) throw TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null != (d2 = null == (b3 = a3.intervalCap) ? void 0 : b3.toString()) ? d2 : ""}\` (${typeof a3.intervalCap})`);
              if (void 0 === a3.interval || !(Number.isFinite(a3.interval) && a3.interval >= 0)) throw TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null != (g2 = null == (e2 = a3.interval) ? void 0 : e2.toString()) ? g2 : ""}\` (${typeof a3.interval})`);
              this._carryoverConcurrencyCount = a3.carryoverConcurrencyCount, this._isIntervalIgnored = a3.intervalCap === 1 / 0 || 0 === a3.interval, this._intervalCap = a3.intervalCap, this._interval = a3.interval, this._queue = new a3.queueClass(), this._queueClass = a3.queueClass, this.concurrency = a3.concurrency, this._timeout = a3.timeout, this._throwOnTimeout = true === a3.throwOnTimeout, this._isPaused = false === a3.autoStart;
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
              this._resolveEmpty(), this._resolveEmpty = f, 0 === this._pendingCount && (this._resolveIdle(), this._resolveIdle = f, this.emit("idle"));
            }
            _onResumeInterval() {
              this._onInterval(), this._initializeIntervalIfNeeded(), this._timeoutId = void 0;
            }
            _isIntervalPaused() {
              let a3 = Date.now();
              if (void 0 === this._intervalId) {
                let b3 = this._intervalEnd - a3;
                if (!(b3 < 0)) return void 0 === this._timeoutId && (this._timeoutId = setTimeout(() => {
                  this._onResumeInterval();
                }, b3)), true;
                this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
              }
              return false;
            }
            _tryToStartAnother() {
              if (0 === this._queue.size) return this._intervalId && clearInterval(this._intervalId), this._intervalId = void 0, this._resolvePromises(), false;
              if (!this._isPaused) {
                let a3 = !this._isIntervalPaused();
                if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                  let b3 = this._queue.dequeue();
                  return !!b3 && (this.emit("active"), b3(), a3 && this._initializeIntervalIfNeeded(), true);
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
            set concurrency(a3) {
              if (!("number" == typeof a3 && a3 >= 1)) throw TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${a3}\` (${typeof a3})`);
              this._concurrency = a3, this._processQueue();
            }
            async add(a3, c3 = {}) {
              return new Promise((d2, e2) => {
                let f2 = async () => {
                  this._pendingCount++, this._intervalCount++;
                  try {
                    let f3 = void 0 === this._timeout && void 0 === c3.timeout ? a3() : b2.default(Promise.resolve(a3()), void 0 === c3.timeout ? this._timeout : c3.timeout, () => {
                      (void 0 === c3.throwOnTimeout ? this._throwOnTimeout : c3.throwOnTimeout) && e2(g);
                    });
                    d2(await f3);
                  } catch (a4) {
                    e2(a4);
                  }
                  this._next();
                };
                this._queue.enqueue(f2, c3), this._tryToStartAnother(), this.emit("add");
              });
            }
            async addAll(a3, b3) {
              return Promise.all(a3.map(async (a4) => this.add(a4, b3)));
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
              if (0 !== this._queue.size) return new Promise((a3) => {
                let b3 = this._resolveEmpty;
                this._resolveEmpty = () => {
                  b3(), a3();
                };
              });
            }
            async onIdle() {
              if (0 !== this._pendingCount || 0 !== this._queue.size) return new Promise((a3) => {
                let b3 = this._resolveIdle;
                this._resolveIdle = () => {
                  b3(), a3();
                };
              });
            }
            get size() {
              return this._queue.size;
            }
            sizeBy(a3) {
              return this._queue.filter(a3).length;
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
            set timeout(a3) {
              this._timeout = a3;
            }
          }
          e.default = h;
        })(), a.exports = e;
      })();
    }, 259: (a) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "//");
        var b = {};
        (() => {
          function a2(a3, b2) {
            void 0 === b2 && (b2 = {});
            for (var c2 = function(a4) {
              for (var b3 = [], c3 = 0; c3 < a4.length; ) {
                var d3 = a4[c3];
                if ("*" === d3 || "+" === d3 || "?" === d3) {
                  b3.push({ type: "MODIFIER", index: c3, value: a4[c3++] });
                  continue;
                }
                if ("\\" === d3) {
                  b3.push({ type: "ESCAPED_CHAR", index: c3++, value: a4[c3++] });
                  continue;
                }
                if ("{" === d3) {
                  b3.push({ type: "OPEN", index: c3, value: a4[c3++] });
                  continue;
                }
                if ("}" === d3) {
                  b3.push({ type: "CLOSE", index: c3, value: a4[c3++] });
                  continue;
                }
                if (":" === d3) {
                  for (var e2 = "", f3 = c3 + 1; f3 < a4.length; ) {
                    var g3 = a4.charCodeAt(f3);
                    if (g3 >= 48 && g3 <= 57 || g3 >= 65 && g3 <= 90 || g3 >= 97 && g3 <= 122 || 95 === g3) {
                      e2 += a4[f3++];
                      continue;
                    }
                    break;
                  }
                  if (!e2) throw TypeError("Missing parameter name at ".concat(c3));
                  b3.push({ type: "NAME", index: c3, value: e2 }), c3 = f3;
                  continue;
                }
                if ("(" === d3) {
                  var h3 = 1, i2 = "", f3 = c3 + 1;
                  if ("?" === a4[f3]) throw TypeError('Pattern cannot start with "?" at '.concat(f3));
                  for (; f3 < a4.length; ) {
                    if ("\\" === a4[f3]) {
                      i2 += a4[f3++] + a4[f3++];
                      continue;
                    }
                    if (")" === a4[f3]) {
                      if (0 == --h3) {
                        f3++;
                        break;
                      }
                    } else if ("(" === a4[f3] && (h3++, "?" !== a4[f3 + 1])) throw TypeError("Capturing groups are not allowed at ".concat(f3));
                    i2 += a4[f3++];
                  }
                  if (h3) throw TypeError("Unbalanced pattern at ".concat(c3));
                  if (!i2) throw TypeError("Missing pattern at ".concat(c3));
                  b3.push({ type: "PATTERN", index: c3, value: i2 }), c3 = f3;
                  continue;
                }
                b3.push({ type: "CHAR", index: c3, value: a4[c3++] });
              }
              return b3.push({ type: "END", index: c3, value: "" }), b3;
            }(a3), d2 = b2.prefixes, f2 = void 0 === d2 ? "./" : d2, g2 = b2.delimiter, h2 = void 0 === g2 ? "/#?" : g2, i = [], j = 0, k = 0, l = "", m = function(a4) {
              if (k < c2.length && c2[k].type === a4) return c2[k++].value;
            }, n = function(a4) {
              var b3 = m(a4);
              if (void 0 !== b3) return b3;
              var d3 = c2[k], e2 = d3.type, f3 = d3.index;
              throw TypeError("Unexpected ".concat(e2, " at ").concat(f3, ", expected ").concat(a4));
            }, o = function() {
              for (var a4, b3 = ""; a4 = m("CHAR") || m("ESCAPED_CHAR"); ) b3 += a4;
              return b3;
            }, p = function(a4) {
              for (var b3 = 0; b3 < h2.length; b3++) {
                var c3 = h2[b3];
                if (a4.indexOf(c3) > -1) return true;
              }
              return false;
            }, q = function(a4) {
              var b3 = i[i.length - 1], c3 = a4 || (b3 && "string" == typeof b3 ? b3 : "");
              if (b3 && !c3) throw TypeError('Must have text between two parameters, missing text after "'.concat(b3.name, '"'));
              return !c3 || p(c3) ? "[^".concat(e(h2), "]+?") : "(?:(?!".concat(e(c3), ")[^").concat(e(h2), "])+?");
            }; k < c2.length; ) {
              var r = m("CHAR"), s = m("NAME"), t = m("PATTERN");
              if (s || t) {
                var u = r || "";
                -1 === f2.indexOf(u) && (l += u, u = ""), l && (i.push(l), l = ""), i.push({ name: s || j++, prefix: u, suffix: "", pattern: t || q(u), modifier: m("MODIFIER") || "" });
                continue;
              }
              var v = r || m("ESCAPED_CHAR");
              if (v) {
                l += v;
                continue;
              }
              if (l && (i.push(l), l = ""), m("OPEN")) {
                var u = o(), w = m("NAME") || "", x = m("PATTERN") || "", y = o();
                n("CLOSE"), i.push({ name: w || (x ? j++ : ""), pattern: w && !x ? q(u) : x, prefix: u, suffix: y, modifier: m("MODIFIER") || "" });
                continue;
              }
              n("END");
            }
            return i;
          }
          function c(a3, b2) {
            void 0 === b2 && (b2 = {});
            var c2 = f(b2), d2 = b2.encode, e2 = void 0 === d2 ? function(a4) {
              return a4;
            } : d2, g2 = b2.validate, h2 = void 0 === g2 || g2, i = a3.map(function(a4) {
              if ("object" == typeof a4) return new RegExp("^(?:".concat(a4.pattern, ")$"), c2);
            });
            return function(b3) {
              for (var c3 = "", d3 = 0; d3 < a3.length; d3++) {
                var f2 = a3[d3];
                if ("string" == typeof f2) {
                  c3 += f2;
                  continue;
                }
                var g3 = b3 ? b3[f2.name] : void 0, j = "?" === f2.modifier || "*" === f2.modifier, k = "*" === f2.modifier || "+" === f2.modifier;
                if (Array.isArray(g3)) {
                  if (!k) throw TypeError('Expected "'.concat(f2.name, '" to not repeat, but got an array'));
                  if (0 === g3.length) {
                    if (j) continue;
                    throw TypeError('Expected "'.concat(f2.name, '" to not be empty'));
                  }
                  for (var l = 0; l < g3.length; l++) {
                    var m = e2(g3[l], f2);
                    if (h2 && !i[d3].test(m)) throw TypeError('Expected all "'.concat(f2.name, '" to match "').concat(f2.pattern, '", but got "').concat(m, '"'));
                    c3 += f2.prefix + m + f2.suffix;
                  }
                  continue;
                }
                if ("string" == typeof g3 || "number" == typeof g3) {
                  var m = e2(String(g3), f2);
                  if (h2 && !i[d3].test(m)) throw TypeError('Expected "'.concat(f2.name, '" to match "').concat(f2.pattern, '", but got "').concat(m, '"'));
                  c3 += f2.prefix + m + f2.suffix;
                  continue;
                }
                if (!j) {
                  var n = k ? "an array" : "a string";
                  throw TypeError('Expected "'.concat(f2.name, '" to be ').concat(n));
                }
              }
              return c3;
            };
          }
          function d(a3, b2, c2) {
            void 0 === c2 && (c2 = {});
            var d2 = c2.decode, e2 = void 0 === d2 ? function(a4) {
              return a4;
            } : d2;
            return function(c3) {
              var d3 = a3.exec(c3);
              if (!d3) return false;
              for (var f2 = d3[0], g2 = d3.index, h2 = /* @__PURE__ */ Object.create(null), i = 1; i < d3.length; i++) !function(a4) {
                if (void 0 !== d3[a4]) {
                  var c4 = b2[a4 - 1];
                  "*" === c4.modifier || "+" === c4.modifier ? h2[c4.name] = d3[a4].split(c4.prefix + c4.suffix).map(function(a5) {
                    return e2(a5, c4);
                  }) : h2[c4.name] = e2(d3[a4], c4);
                }
              }(i);
              return { path: f2, index: g2, params: h2 };
            };
          }
          function e(a3) {
            return a3.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
          }
          function f(a3) {
            return a3 && a3.sensitive ? "" : "i";
          }
          function g(a3, b2, c2) {
            void 0 === c2 && (c2 = {});
            for (var d2 = c2.strict, g2 = void 0 !== d2 && d2, h2 = c2.start, i = c2.end, j = c2.encode, k = void 0 === j ? function(a4) {
              return a4;
            } : j, l = c2.delimiter, m = c2.endsWith, n = "[".concat(e(void 0 === m ? "" : m), "]|$"), o = "[".concat(e(void 0 === l ? "/#?" : l), "]"), p = void 0 === h2 || h2 ? "^" : "", q = 0; q < a3.length; q++) {
              var r = a3[q];
              if ("string" == typeof r) p += e(k(r));
              else {
                var s = e(k(r.prefix)), t = e(k(r.suffix));
                if (r.pattern) if (b2 && b2.push(r), s || t) if ("+" === r.modifier || "*" === r.modifier) {
                  var u = "*" === r.modifier ? "?" : "";
                  p += "(?:".concat(s, "((?:").concat(r.pattern, ")(?:").concat(t).concat(s, "(?:").concat(r.pattern, "))*)").concat(t, ")").concat(u);
                } else p += "(?:".concat(s, "(").concat(r.pattern, ")").concat(t, ")").concat(r.modifier);
                else {
                  if ("+" === r.modifier || "*" === r.modifier) throw TypeError('Can not repeat "'.concat(r.name, '" without a prefix and suffix'));
                  p += "(".concat(r.pattern, ")").concat(r.modifier);
                }
                else p += "(?:".concat(s).concat(t, ")").concat(r.modifier);
              }
            }
            if (void 0 === i || i) g2 || (p += "".concat(o, "?")), p += c2.endsWith ? "(?=".concat(n, ")") : "$";
            else {
              var v = a3[a3.length - 1], w = "string" == typeof v ? o.indexOf(v[v.length - 1]) > -1 : void 0 === v;
              g2 || (p += "(?:".concat(o, "(?=").concat(n, "))?")), w || (p += "(?=".concat(o, "|").concat(n, ")"));
            }
            return new RegExp(p, f(c2));
          }
          function h(b2, c2, d2) {
            if (b2 instanceof RegExp) {
              var e2;
              if (!c2) return b2;
              for (var i = /\((?:\?<(.*?)>)?(?!\?)/g, j = 0, k = i.exec(b2.source); k; ) c2.push({ name: k[1] || j++, prefix: "", suffix: "", modifier: "", pattern: "" }), k = i.exec(b2.source);
              return b2;
            }
            return Array.isArray(b2) ? (e2 = b2.map(function(a3) {
              return h(a3, c2, d2).source;
            }), new RegExp("(?:".concat(e2.join("|"), ")"), f(d2))) : g(a2(b2, d2), c2, d2);
          }
          Object.defineProperty(b, "__esModule", { value: true }), b.pathToRegexp = b.tokensToRegexp = b.regexpToFunction = b.match = b.tokensToFunction = b.compile = b.parse = void 0, b.parse = a2, b.compile = function(b2, d2) {
            return c(a2(b2, d2), d2);
          }, b.tokensToFunction = c, b.match = function(a3, b2) {
            var c2 = [];
            return d(h(a3, c2, b2), c2, b2);
          }, b.regexpToFunction = d, b.tokensToRegexp = g, b.pathToRegexp = h;
        })(), a.exports = b;
      })();
    }, 269: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true }), b.PostgrestError = b.PostgrestBuilder = b.PostgrestTransformBuilder = b.PostgrestFilterBuilder = b.PostgrestQueryBuilder = b.PostgrestClient = void 0;
      let d = c(284), e = d.__importDefault(c(51));
      b.PostgrestClient = e.default;
      let f = d.__importDefault(c(855));
      b.PostgrestQueryBuilder = f.default;
      let g = d.__importDefault(c(827));
      b.PostgrestFilterBuilder = g.default;
      let h = d.__importDefault(c(319));
      b.PostgrestTransformBuilder = h.default;
      let i = d.__importDefault(c(69));
      b.PostgrestBuilder = i.default;
      let j = d.__importDefault(c(486));
      b.PostgrestError = j.default, b.default = { PostgrestClient: e.default, PostgrestQueryBuilder: f.default, PostgrestFilterBuilder: g.default, PostgrestTransformBuilder: h.default, PostgrestBuilder: i.default, PostgrestError: j.default };
    }, 284: (a, b, c) => {
      "use strict";
      c.r(b), c.d(b, { __addDisposableResource: () => J, __assign: () => f, __asyncDelegator: () => z, __asyncGenerator: () => y, __asyncValues: () => A, __await: () => x, __awaiter: () => o, __classPrivateFieldGet: () => G, __classPrivateFieldIn: () => I, __classPrivateFieldSet: () => H, __createBinding: () => q, __decorate: () => h, __disposeResources: () => L, __esDecorate: () => j, __exportStar: () => r, __extends: () => e, __generator: () => p, __importDefault: () => F, __importStar: () => E, __makeTemplateObject: () => B, __metadata: () => n, __param: () => i, __propKey: () => l, __read: () => t, __rest: () => g, __rewriteRelativeImportExtension: () => M, __runInitializers: () => k, __setFunctionName: () => m, __spread: () => u, __spreadArray: () => w, __spreadArrays: () => v, __values: () => s, default: () => N });
      var d = function(a2, b2) {
        return (d = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(a3, b3) {
          a3.__proto__ = b3;
        } || function(a3, b3) {
          for (var c2 in b3) Object.prototype.hasOwnProperty.call(b3, c2) && (a3[c2] = b3[c2]);
        })(a2, b2);
      };
      function e(a2, b2) {
        if ("function" != typeof b2 && null !== b2) throw TypeError("Class extends value " + String(b2) + " is not a constructor or null");
        function c2() {
          this.constructor = a2;
        }
        d(a2, b2), a2.prototype = null === b2 ? Object.create(b2) : (c2.prototype = b2.prototype, new c2());
      }
      var f = function() {
        return (f = Object.assign || function(a2) {
          for (var b2, c2 = 1, d2 = arguments.length; c2 < d2; c2++) for (var e2 in b2 = arguments[c2]) Object.prototype.hasOwnProperty.call(b2, e2) && (a2[e2] = b2[e2]);
          return a2;
        }).apply(this, arguments);
      };
      function g(a2, b2) {
        var c2 = {};
        for (var d2 in a2) Object.prototype.hasOwnProperty.call(a2, d2) && 0 > b2.indexOf(d2) && (c2[d2] = a2[d2]);
        if (null != a2 && "function" == typeof Object.getOwnPropertySymbols) for (var e2 = 0, d2 = Object.getOwnPropertySymbols(a2); e2 < d2.length; e2++) 0 > b2.indexOf(d2[e2]) && Object.prototype.propertyIsEnumerable.call(a2, d2[e2]) && (c2[d2[e2]] = a2[d2[e2]]);
        return c2;
      }
      function h(a2, b2, c2, d2) {
        var e2, f2 = arguments.length, g2 = f2 < 3 ? b2 : null === d2 ? d2 = Object.getOwnPropertyDescriptor(b2, c2) : d2;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) g2 = Reflect.decorate(a2, b2, c2, d2);
        else for (var h2 = a2.length - 1; h2 >= 0; h2--) (e2 = a2[h2]) && (g2 = (f2 < 3 ? e2(g2) : f2 > 3 ? e2(b2, c2, g2) : e2(b2, c2)) || g2);
        return f2 > 3 && g2 && Object.defineProperty(b2, c2, g2), g2;
      }
      function i(a2, b2) {
        return function(c2, d2) {
          b2(c2, d2, a2);
        };
      }
      function j(a2, b2, c2, d2, e2, f2) {
        function g2(a3) {
          if (void 0 !== a3 && "function" != typeof a3) throw TypeError("Function expected");
          return a3;
        }
        for (var h2, i2 = d2.kind, j2 = "getter" === i2 ? "get" : "setter" === i2 ? "set" : "value", k2 = !b2 && a2 ? d2.static ? a2 : a2.prototype : null, l2 = b2 || (k2 ? Object.getOwnPropertyDescriptor(k2, d2.name) : {}), m2 = false, n2 = c2.length - 1; n2 >= 0; n2--) {
          var o2 = {};
          for (var p2 in d2) o2[p2] = "access" === p2 ? {} : d2[p2];
          for (var p2 in d2.access) o2.access[p2] = d2.access[p2];
          o2.addInitializer = function(a3) {
            if (m2) throw TypeError("Cannot add initializers after decoration has completed");
            f2.push(g2(a3 || null));
          };
          var q2 = (0, c2[n2])("accessor" === i2 ? { get: l2.get, set: l2.set } : l2[j2], o2);
          if ("accessor" === i2) {
            if (void 0 === q2) continue;
            if (null === q2 || "object" != typeof q2) throw TypeError("Object expected");
            (h2 = g2(q2.get)) && (l2.get = h2), (h2 = g2(q2.set)) && (l2.set = h2), (h2 = g2(q2.init)) && e2.unshift(h2);
          } else (h2 = g2(q2)) && ("field" === i2 ? e2.unshift(h2) : l2[j2] = h2);
        }
        k2 && Object.defineProperty(k2, d2.name, l2), m2 = true;
      }
      function k(a2, b2, c2) {
        for (var d2 = arguments.length > 2, e2 = 0; e2 < b2.length; e2++) c2 = d2 ? b2[e2].call(a2, c2) : b2[e2].call(a2);
        return d2 ? c2 : void 0;
      }
      function l(a2) {
        return "symbol" == typeof a2 ? a2 : "".concat(a2);
      }
      function m(a2, b2, c2) {
        return "symbol" == typeof b2 && (b2 = b2.description ? "[".concat(b2.description, "]") : ""), Object.defineProperty(a2, "name", { configurable: true, value: c2 ? "".concat(c2, " ", b2) : b2 });
      }
      function n(a2, b2) {
        if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(a2, b2);
      }
      function o(a2, b2, c2, d2) {
        return new (c2 || (c2 = Promise))(function(e2, f2) {
          function g2(a3) {
            try {
              i2(d2.next(a3));
            } catch (a4) {
              f2(a4);
            }
          }
          function h2(a3) {
            try {
              i2(d2.throw(a3));
            } catch (a4) {
              f2(a4);
            }
          }
          function i2(a3) {
            var b3;
            a3.done ? e2(a3.value) : ((b3 = a3.value) instanceof c2 ? b3 : new c2(function(a4) {
              a4(b3);
            })).then(g2, h2);
          }
          i2((d2 = d2.apply(a2, b2 || [])).next());
        });
      }
      function p(a2, b2) {
        var c2, d2, e2, f2 = { label: 0, sent: function() {
          if (1 & e2[0]) throw e2[1];
          return e2[1];
        }, trys: [], ops: [] }, g2 = Object.create(("function" == typeof Iterator ? Iterator : Object).prototype);
        return g2.next = h2(0), g2.throw = h2(1), g2.return = h2(2), "function" == typeof Symbol && (g2[Symbol.iterator] = function() {
          return this;
        }), g2;
        function h2(h3) {
          return function(i2) {
            var j2 = [h3, i2];
            if (c2) throw TypeError("Generator is already executing.");
            for (; g2 && (g2 = 0, j2[0] && (f2 = 0)), f2; ) try {
              if (c2 = 1, d2 && (e2 = 2 & j2[0] ? d2.return : j2[0] ? d2.throw || ((e2 = d2.return) && e2.call(d2), 0) : d2.next) && !(e2 = e2.call(d2, j2[1])).done) return e2;
              switch (d2 = 0, e2 && (j2 = [2 & j2[0], e2.value]), j2[0]) {
                case 0:
                case 1:
                  e2 = j2;
                  break;
                case 4:
                  return f2.label++, { value: j2[1], done: false };
                case 5:
                  f2.label++, d2 = j2[1], j2 = [0];
                  continue;
                case 7:
                  j2 = f2.ops.pop(), f2.trys.pop();
                  continue;
                default:
                  if (!(e2 = (e2 = f2.trys).length > 0 && e2[e2.length - 1]) && (6 === j2[0] || 2 === j2[0])) {
                    f2 = 0;
                    continue;
                  }
                  if (3 === j2[0] && (!e2 || j2[1] > e2[0] && j2[1] < e2[3])) {
                    f2.label = j2[1];
                    break;
                  }
                  if (6 === j2[0] && f2.label < e2[1]) {
                    f2.label = e2[1], e2 = j2;
                    break;
                  }
                  if (e2 && f2.label < e2[2]) {
                    f2.label = e2[2], f2.ops.push(j2);
                    break;
                  }
                  e2[2] && f2.ops.pop(), f2.trys.pop();
                  continue;
              }
              j2 = b2.call(a2, f2);
            } catch (a3) {
              j2 = [6, a3], d2 = 0;
            } finally {
              c2 = e2 = 0;
            }
            if (5 & j2[0]) throw j2[1];
            return { value: j2[0] ? j2[1] : void 0, done: true };
          };
        }
      }
      var q = Object.create ? function(a2, b2, c2, d2) {
        void 0 === d2 && (d2 = c2);
        var e2 = Object.getOwnPropertyDescriptor(b2, c2);
        (!e2 || ("get" in e2 ? !b2.__esModule : e2.writable || e2.configurable)) && (e2 = { enumerable: true, get: function() {
          return b2[c2];
        } }), Object.defineProperty(a2, d2, e2);
      } : function(a2, b2, c2, d2) {
        void 0 === d2 && (d2 = c2), a2[d2] = b2[c2];
      };
      function r(a2, b2) {
        for (var c2 in a2) "default" === c2 || Object.prototype.hasOwnProperty.call(b2, c2) || q(b2, a2, c2);
      }
      function s(a2) {
        var b2 = "function" == typeof Symbol && Symbol.iterator, c2 = b2 && a2[b2], d2 = 0;
        if (c2) return c2.call(a2);
        if (a2 && "number" == typeof a2.length) return { next: function() {
          return a2 && d2 >= a2.length && (a2 = void 0), { value: a2 && a2[d2++], done: !a2 };
        } };
        throw TypeError(b2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
      }
      function t(a2, b2) {
        var c2 = "function" == typeof Symbol && a2[Symbol.iterator];
        if (!c2) return a2;
        var d2, e2, f2 = c2.call(a2), g2 = [];
        try {
          for (; (void 0 === b2 || b2-- > 0) && !(d2 = f2.next()).done; ) g2.push(d2.value);
        } catch (a3) {
          e2 = { error: a3 };
        } finally {
          try {
            d2 && !d2.done && (c2 = f2.return) && c2.call(f2);
          } finally {
            if (e2) throw e2.error;
          }
        }
        return g2;
      }
      function u() {
        for (var a2 = [], b2 = 0; b2 < arguments.length; b2++) a2 = a2.concat(t(arguments[b2]));
        return a2;
      }
      function v() {
        for (var a2 = 0, b2 = 0, c2 = arguments.length; b2 < c2; b2++) a2 += arguments[b2].length;
        for (var d2 = Array(a2), e2 = 0, b2 = 0; b2 < c2; b2++) for (var f2 = arguments[b2], g2 = 0, h2 = f2.length; g2 < h2; g2++, e2++) d2[e2] = f2[g2];
        return d2;
      }
      function w(a2, b2, c2) {
        if (c2 || 2 == arguments.length) for (var d2, e2 = 0, f2 = b2.length; e2 < f2; e2++) !d2 && e2 in b2 || (d2 || (d2 = Array.prototype.slice.call(b2, 0, e2)), d2[e2] = b2[e2]);
        return a2.concat(d2 || Array.prototype.slice.call(b2));
      }
      function x(a2) {
        return this instanceof x ? (this.v = a2, this) : new x(a2);
      }
      function y(a2, b2, c2) {
        if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
        var d2, e2 = c2.apply(a2, b2 || []), f2 = [];
        return d2 = Object.create(("function" == typeof AsyncIterator ? AsyncIterator : Object).prototype), g2("next"), g2("throw"), g2("return", function(a3) {
          return function(b3) {
            return Promise.resolve(b3).then(a3, j2);
          };
        }), d2[Symbol.asyncIterator] = function() {
          return this;
        }, d2;
        function g2(a3, b3) {
          e2[a3] && (d2[a3] = function(b4) {
            return new Promise(function(c3, d3) {
              f2.push([a3, b4, c3, d3]) > 1 || h2(a3, b4);
            });
          }, b3 && (d2[a3] = b3(d2[a3])));
        }
        function h2(a3, b3) {
          try {
            var c3;
            (c3 = e2[a3](b3)).value instanceof x ? Promise.resolve(c3.value.v).then(i2, j2) : k2(f2[0][2], c3);
          } catch (a4) {
            k2(f2[0][3], a4);
          }
        }
        function i2(a3) {
          h2("next", a3);
        }
        function j2(a3) {
          h2("throw", a3);
        }
        function k2(a3, b3) {
          a3(b3), f2.shift(), f2.length && h2(f2[0][0], f2[0][1]);
        }
      }
      function z(a2) {
        var b2, c2;
        return b2 = {}, d2("next"), d2("throw", function(a3) {
          throw a3;
        }), d2("return"), b2[Symbol.iterator] = function() {
          return this;
        }, b2;
        function d2(d3, e2) {
          b2[d3] = a2[d3] ? function(b3) {
            return (c2 = !c2) ? { value: x(a2[d3](b3)), done: false } : e2 ? e2(b3) : b3;
          } : e2;
        }
      }
      function A(a2) {
        if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
        var b2, c2 = a2[Symbol.asyncIterator];
        return c2 ? c2.call(a2) : (a2 = s(a2), b2 = {}, d2("next"), d2("throw"), d2("return"), b2[Symbol.asyncIterator] = function() {
          return this;
        }, b2);
        function d2(c3) {
          b2[c3] = a2[c3] && function(b3) {
            return new Promise(function(d3, e2) {
              var f2, g2, h2;
              f2 = d3, g2 = e2, h2 = (b3 = a2[c3](b3)).done, Promise.resolve(b3.value).then(function(a3) {
                f2({ value: a3, done: h2 });
              }, g2);
            });
          };
        }
      }
      function B(a2, b2) {
        return Object.defineProperty ? Object.defineProperty(a2, "raw", { value: b2 }) : a2.raw = b2, a2;
      }
      var C = Object.create ? function(a2, b2) {
        Object.defineProperty(a2, "default", { enumerable: true, value: b2 });
      } : function(a2, b2) {
        a2.default = b2;
      }, D = function(a2) {
        return (D = Object.getOwnPropertyNames || function(a3) {
          var b2 = [];
          for (var c2 in a3) Object.prototype.hasOwnProperty.call(a3, c2) && (b2[b2.length] = c2);
          return b2;
        })(a2);
      };
      function E(a2) {
        if (a2 && a2.__esModule) return a2;
        var b2 = {};
        if (null != a2) for (var c2 = D(a2), d2 = 0; d2 < c2.length; d2++) "default" !== c2[d2] && q(b2, a2, c2[d2]);
        return C(b2, a2), b2;
      }
      function F(a2) {
        return a2 && a2.__esModule ? a2 : { default: a2 };
      }
      function G(a2, b2, c2, d2) {
        if ("a" === c2 && !d2) throw TypeError("Private accessor was defined without a getter");
        if ("function" == typeof b2 ? a2 !== b2 || !d2 : !b2.has(a2)) throw TypeError("Cannot read private member from an object whose class did not declare it");
        return "m" === c2 ? d2 : "a" === c2 ? d2.call(a2) : d2 ? d2.value : b2.get(a2);
      }
      function H(a2, b2, c2, d2, e2) {
        if ("m" === d2) throw TypeError("Private method is not writable");
        if ("a" === d2 && !e2) throw TypeError("Private accessor was defined without a setter");
        if ("function" == typeof b2 ? a2 !== b2 || !e2 : !b2.has(a2)) throw TypeError("Cannot write private member to an object whose class did not declare it");
        return "a" === d2 ? e2.call(a2, c2) : e2 ? e2.value = c2 : b2.set(a2, c2), c2;
      }
      function I(a2, b2) {
        if (null === b2 || "object" != typeof b2 && "function" != typeof b2) throw TypeError("Cannot use 'in' operator on non-object");
        return "function" == typeof a2 ? b2 === a2 : a2.has(b2);
      }
      function J(a2, b2, c2) {
        if (null != b2) {
          var d2, e2;
          if ("object" != typeof b2 && "function" != typeof b2) throw TypeError("Object expected.");
          if (c2) {
            if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
            d2 = b2[Symbol.asyncDispose];
          }
          if (void 0 === d2) {
            if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
            d2 = b2[Symbol.dispose], c2 && (e2 = d2);
          }
          if ("function" != typeof d2) throw TypeError("Object not disposable.");
          e2 && (d2 = function() {
            try {
              e2.call(this);
            } catch (a3) {
              return Promise.reject(a3);
            }
          }), a2.stack.push({ value: b2, dispose: d2, async: c2 });
        } else c2 && a2.stack.push({ async: true });
        return b2;
      }
      var K = "function" == typeof SuppressedError ? SuppressedError : function(a2, b2, c2) {
        var d2 = Error(c2);
        return d2.name = "SuppressedError", d2.error = a2, d2.suppressed = b2, d2;
      };
      function L(a2) {
        function b2(b3) {
          a2.error = a2.hasError ? new K(b3, a2.error, "An error was suppressed during disposal.") : b3, a2.hasError = true;
        }
        var c2, d2 = 0;
        return function e2() {
          for (; c2 = a2.stack.pop(); ) try {
            if (!c2.async && 1 === d2) return d2 = 0, a2.stack.push(c2), Promise.resolve().then(e2);
            if (c2.dispose) {
              var f2 = c2.dispose.call(c2.value);
              if (c2.async) return d2 |= 2, Promise.resolve(f2).then(e2, function(a3) {
                return b2(a3), e2();
              });
            } else d2 |= 1;
          } catch (a3) {
            b2(a3);
          }
          if (1 === d2) return a2.hasError ? Promise.reject(a2.error) : Promise.resolve();
          if (a2.hasError) throw a2.error;
        }();
      }
      function M(a2, b2) {
        return "string" == typeof a2 && /^\.\.?\//.test(a2) ? a2.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(a3, c2, d2, e2, f2) {
          return c2 ? b2 ? ".jsx" : ".js" : !d2 || e2 && f2 ? d2 + e2 + "." + f2.toLowerCase() + "js" : a3;
        }) : a2;
      }
      let N = { __extends: e, __assign: f, __rest: g, __decorate: h, __param: i, __esDecorate: j, __runInitializers: k, __propKey: l, __setFunctionName: m, __metadata: n, __awaiter: o, __generator: p, __createBinding: q, __exportStar: r, __values: s, __read: t, __spread: u, __spreadArrays: v, __spreadArray: w, __await: x, __asyncGenerator: y, __asyncDelegator: z, __asyncValues: A, __makeTemplateObject: B, __importStar: E, __importDefault: F, __classPrivateFieldGet: G, __classPrivateFieldSet: H, __classPrivateFieldIn: I, __addDisposableResource: J, __disposeResources: L, __rewriteRelativeImportExtension: M };
    }, 318: (a, b, c) => {
      "use strict";
      var d = c(356).Buffer;
      Object.defineProperty(b, "__esModule", { value: true });
      var e = { handleFetch: function() {
        return j;
      }, interceptFetch: function() {
        return k;
      }, reader: function() {
        return h;
      } };
      for (var f in e) Object.defineProperty(b, f, { enumerable: true, get: e[f] });
      let g = c(643), h = { url: (a2) => a2.url, header: (a2, b2) => a2.headers.get(b2) };
      async function i(a2, b2) {
        let { url: c2, method: e2, headers: f2, body: g2, cache: h2, credentials: i2, integrity: j2, mode: k2, redirect: l, referrer: m, referrerPolicy: n } = b2;
        return { testData: a2, api: "fetch", request: { url: c2, method: e2, headers: [...Array.from(f2), ["next-test-stack", function() {
          let a3 = (Error().stack ?? "").split("\n");
          for (let b3 = 1; b3 < a3.length; b3++) if (a3[b3].length > 0) {
            a3 = a3.slice(b3);
            break;
          }
          return (a3 = (a3 = (a3 = a3.filter((a4) => !a4.includes("/next/dist/"))).slice(0, 5)).map((a4) => a4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: g2 ? d.from(await b2.arrayBuffer()).toString("base64") : null, cache: h2, credentials: i2, integrity: j2, mode: k2, redirect: l, referrer: m, referrerPolicy: n } };
      }
      async function j(a2, b2) {
        let c2 = (0, g.getTestReqInfo)(b2, h);
        if (!c2) return a2(b2);
        let { testData: e2, proxyPort: f2 } = c2, j2 = await i(e2, b2), k2 = await a2(`http://localhost:${f2}`, { method: "POST", body: JSON.stringify(j2), next: { internal: true } });
        if (!k2.ok) throw Object.defineProperty(Error(`Proxy request failed: ${k2.status}`), "__NEXT_ERROR_CODE", { value: "E146", enumerable: false, configurable: true });
        let l = await k2.json(), { api: m } = l;
        switch (m) {
          case "continue":
            return a2(b2);
          case "abort":
          case "unhandled":
            throw Object.defineProperty(Error(`Proxy request aborted [${b2.method} ${b2.url}]`), "__NEXT_ERROR_CODE", { value: "E145", enumerable: false, configurable: true });
          case "fetch":
            return function(a3) {
              let { status: b3, headers: c3, body: e3 } = a3.response;
              return new Response(e3 ? d.from(e3, "base64") : null, { status: b3, headers: new Headers(c3) });
            }(l);
          default:
            return m;
        }
      }
      function k(a2) {
        return c.g.fetch = function(b2, c2) {
          var d2;
          return (null == c2 || null == (d2 = c2.next) ? void 0 : d2.internal) ? a2(b2, c2) : j(a2, new Request(b2, c2));
        }, () => {
          c.g.fetch = a2;
        };
      }
    }, 319: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      let d = c(284).__importDefault(c(69));
      class e extends d.default {
        select(a2) {
          let b2 = false, c2 = (null != a2 ? a2 : "*").split("").map((a3) => /\s/.test(a3) && !b2 ? "" : ('"' === a3 && (b2 = !b2), a3)).join("");
          return this.url.searchParams.set("select", c2), this.headers.append("Prefer", "return=representation"), this;
        }
        order(a2, { ascending: b2 = true, nullsFirst: c2, foreignTable: d2, referencedTable: e2 = d2 } = {}) {
          let f = e2 ? `${e2}.order` : "order", g = this.url.searchParams.get(f);
          return this.url.searchParams.set(f, `${g ? `${g},` : ""}${a2}.${b2 ? "asc" : "desc"}${void 0 === c2 ? "" : c2 ? ".nullsfirst" : ".nullslast"}`), this;
        }
        limit(a2, { foreignTable: b2, referencedTable: c2 = b2 } = {}) {
          let d2 = void 0 === c2 ? "limit" : `${c2}.limit`;
          return this.url.searchParams.set(d2, `${a2}`), this;
        }
        range(a2, b2, { foreignTable: c2, referencedTable: d2 = c2 } = {}) {
          let e2 = void 0 === d2 ? "offset" : `${d2}.offset`, f = void 0 === d2 ? "limit" : `${d2}.limit`;
          return this.url.searchParams.set(e2, `${a2}`), this.url.searchParams.set(f, `${b2 - a2 + 1}`), this;
        }
        abortSignal(a2) {
          return this.signal = a2, this;
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
        explain({ analyze: a2 = false, verbose: b2 = false, settings: c2 = false, buffers: d2 = false, wal: e2 = false, format: f = "text" } = {}) {
          var g;
          let h = [a2 ? "analyze" : null, b2 ? "verbose" : null, c2 ? "settings" : null, d2 ? "buffers" : null, e2 ? "wal" : null].filter(Boolean).join("|"), i = null != (g = this.headers.get("Accept")) ? g : "application/json";
          return this.headers.set("Accept", `application/vnd.pgrst.plan+${f}; for="${i}"; options=${h};`), this;
        }
        rollback() {
          return this.headers.append("Prefer", "tx=rollback"), this;
        }
        returns() {
          return this;
        }
        maxAffected(a2) {
          return this.headers.append("Prefer", "handling=strict"), this.headers.append("Prefer", `max-affected=${a2}`), this;
        }
      }
      b.default = e;
    }, 345: (a, b, c) => {
      "use strict";
      a.exports = c(417);
    }, 356: (a) => {
      "use strict";
      a.exports = (init_node_buffer(), __toCommonJS(node_buffer_exports));
    }, 417: (a, b) => {
      "use strict";
      Symbol.for("react.transitional.element"), Symbol.for("react.portal"), Symbol.for("react.fragment"), Symbol.for("react.strict_mode"), Symbol.for("react.profiler"), Symbol.for("react.forward_ref"), Symbol.for("react.suspense"), Symbol.for("react.memo"), Symbol.for("react.lazy"), Symbol.for("react.activity"), Symbol.for("react.view_transition"), Symbol.iterator;
      Object.prototype.hasOwnProperty;
    }, 446: (a, b, c) => {
      (() => {
        "use strict";
        let b2, d, e, f, g;
        var h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x = { 491: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ContextAPI = void 0;
          let d2 = c2(223), e2 = c2(172), f2 = c2(930), g2 = "context", h2 = new d2.NoopContextManager();
          class i2 {
            static getInstance() {
              return this._instance || (this._instance = new i2()), this._instance;
            }
            setGlobalContextManager(a3) {
              return (0, e2.registerGlobal)(g2, a3, f2.DiagAPI.instance());
            }
            active() {
              return this._getContextManager().active();
            }
            with(a3, b4, c3, ...d3) {
              return this._getContextManager().with(a3, b4, c3, ...d3);
            }
            bind(a3, b4) {
              return this._getContextManager().bind(a3, b4);
            }
            _getContextManager() {
              return (0, e2.getGlobal)(g2) || h2;
            }
            disable() {
              this._getContextManager().disable(), (0, e2.unregisterGlobal)(g2, f2.DiagAPI.instance());
            }
          }
          b3.ContextAPI = i2;
        }, 930: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.DiagAPI = void 0;
          let d2 = c2(56), e2 = c2(912), f2 = c2(957), g2 = c2(172);
          class h2 {
            constructor() {
              function a3(a4) {
                return function(...b5) {
                  let c3 = (0, g2.getGlobal)("diag");
                  if (c3) return c3[a4](...b5);
                };
              }
              const b4 = this;
              b4.setLogger = (a4, c3 = { logLevel: f2.DiagLogLevel.INFO }) => {
                var d3, h3, i2;
                if (a4 === b4) {
                  let a5 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                  return b4.error(null != (d3 = a5.stack) ? d3 : a5.message), false;
                }
                "number" == typeof c3 && (c3 = { logLevel: c3 });
                let j2 = (0, g2.getGlobal)("diag"), k2 = (0, e2.createLogLevelDiagLogger)(null != (h3 = c3.logLevel) ? h3 : f2.DiagLogLevel.INFO, a4);
                if (j2 && !c3.suppressOverrideMessage) {
                  let a5 = null != (i2 = Error().stack) ? i2 : "<failed to generate stacktrace>";
                  j2.warn(`Current logger will be overwritten from ${a5}`), k2.warn(`Current logger will overwrite one already registered from ${a5}`);
                }
                return (0, g2.registerGlobal)("diag", k2, b4, true);
              }, b4.disable = () => {
                (0, g2.unregisterGlobal)("diag", b4);
              }, b4.createComponentLogger = (a4) => new d2.DiagComponentLogger(a4), b4.verbose = a3("verbose"), b4.debug = a3("debug"), b4.info = a3("info"), b4.warn = a3("warn"), b4.error = a3("error");
            }
            static instance() {
              return this._instance || (this._instance = new h2()), this._instance;
            }
          }
          b3.DiagAPI = h2;
        }, 653: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.MetricsAPI = void 0;
          let d2 = c2(660), e2 = c2(172), f2 = c2(930), g2 = "metrics";
          class h2 {
            static getInstance() {
              return this._instance || (this._instance = new h2()), this._instance;
            }
            setGlobalMeterProvider(a3) {
              return (0, e2.registerGlobal)(g2, a3, f2.DiagAPI.instance());
            }
            getMeterProvider() {
              return (0, e2.getGlobal)(g2) || d2.NOOP_METER_PROVIDER;
            }
            getMeter(a3, b4, c3) {
              return this.getMeterProvider().getMeter(a3, b4, c3);
            }
            disable() {
              (0, e2.unregisterGlobal)(g2, f2.DiagAPI.instance());
            }
          }
          b3.MetricsAPI = h2;
        }, 181: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.PropagationAPI = void 0;
          let d2 = c2(172), e2 = c2(874), f2 = c2(194), g2 = c2(277), h2 = c2(369), i2 = c2(930), j2 = "propagation", k2 = new e2.NoopTextMapPropagator();
          class l2 {
            constructor() {
              this.createBaggage = h2.createBaggage, this.getBaggage = g2.getBaggage, this.getActiveBaggage = g2.getActiveBaggage, this.setBaggage = g2.setBaggage, this.deleteBaggage = g2.deleteBaggage;
            }
            static getInstance() {
              return this._instance || (this._instance = new l2()), this._instance;
            }
            setGlobalPropagator(a3) {
              return (0, d2.registerGlobal)(j2, a3, i2.DiagAPI.instance());
            }
            inject(a3, b4, c3 = f2.defaultTextMapSetter) {
              return this._getGlobalPropagator().inject(a3, b4, c3);
            }
            extract(a3, b4, c3 = f2.defaultTextMapGetter) {
              return this._getGlobalPropagator().extract(a3, b4, c3);
            }
            fields() {
              return this._getGlobalPropagator().fields();
            }
            disable() {
              (0, d2.unregisterGlobal)(j2, i2.DiagAPI.instance());
            }
            _getGlobalPropagator() {
              return (0, d2.getGlobal)(j2) || k2;
            }
          }
          b3.PropagationAPI = l2;
        }, 997: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.TraceAPI = void 0;
          let d2 = c2(172), e2 = c2(846), f2 = c2(139), g2 = c2(607), h2 = c2(930), i2 = "trace";
          class j2 {
            constructor() {
              this._proxyTracerProvider = new e2.ProxyTracerProvider(), this.wrapSpanContext = f2.wrapSpanContext, this.isSpanContextValid = f2.isSpanContextValid, this.deleteSpan = g2.deleteSpan, this.getSpan = g2.getSpan, this.getActiveSpan = g2.getActiveSpan, this.getSpanContext = g2.getSpanContext, this.setSpan = g2.setSpan, this.setSpanContext = g2.setSpanContext;
            }
            static getInstance() {
              return this._instance || (this._instance = new j2()), this._instance;
            }
            setGlobalTracerProvider(a3) {
              let b4 = (0, d2.registerGlobal)(i2, this._proxyTracerProvider, h2.DiagAPI.instance());
              return b4 && this._proxyTracerProvider.setDelegate(a3), b4;
            }
            getTracerProvider() {
              return (0, d2.getGlobal)(i2) || this._proxyTracerProvider;
            }
            getTracer(a3, b4) {
              return this.getTracerProvider().getTracer(a3, b4);
            }
            disable() {
              (0, d2.unregisterGlobal)(i2, h2.DiagAPI.instance()), this._proxyTracerProvider = new e2.ProxyTracerProvider();
            }
          }
          b3.TraceAPI = j2;
        }, 277: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.deleteBaggage = b3.setBaggage = b3.getActiveBaggage = b3.getBaggage = void 0;
          let d2 = c2(491), e2 = (0, c2(780).createContextKey)("OpenTelemetry Baggage Key");
          function f2(a3) {
            return a3.getValue(e2) || void 0;
          }
          b3.getBaggage = f2, b3.getActiveBaggage = function() {
            return f2(d2.ContextAPI.getInstance().active());
          }, b3.setBaggage = function(a3, b4) {
            return a3.setValue(e2, b4);
          }, b3.deleteBaggage = function(a3) {
            return a3.deleteValue(e2);
          };
        }, 993: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.BaggageImpl = void 0;
          class c2 {
            constructor(a3) {
              this._entries = a3 ? new Map(a3) : /* @__PURE__ */ new Map();
            }
            getEntry(a3) {
              let b4 = this._entries.get(a3);
              if (b4) return Object.assign({}, b4);
            }
            getAllEntries() {
              return Array.from(this._entries.entries()).map(([a3, b4]) => [a3, b4]);
            }
            setEntry(a3, b4) {
              let d2 = new c2(this._entries);
              return d2._entries.set(a3, b4), d2;
            }
            removeEntry(a3) {
              let b4 = new c2(this._entries);
              return b4._entries.delete(a3), b4;
            }
            removeEntries(...a3) {
              let b4 = new c2(this._entries);
              for (let c3 of a3) b4._entries.delete(c3);
              return b4;
            }
            clear() {
              return new c2();
            }
          }
          b3.BaggageImpl = c2;
        }, 830: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.baggageEntryMetadataSymbol = void 0, b3.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        }, 369: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.baggageEntryMetadataFromString = b3.createBaggage = void 0;
          let d2 = c2(930), e2 = c2(993), f2 = c2(830), g2 = d2.DiagAPI.instance();
          b3.createBaggage = function(a3 = {}) {
            return new e2.BaggageImpl(new Map(Object.entries(a3)));
          }, b3.baggageEntryMetadataFromString = function(a3) {
            return "string" != typeof a3 && (g2.error(`Cannot create baggage metadata from unknown type: ${typeof a3}`), a3 = ""), { __TYPE__: f2.baggageEntryMetadataSymbol, toString: () => a3 };
          };
        }, 67: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.context = void 0, b3.context = c2(491).ContextAPI.getInstance();
        }, 223: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NoopContextManager = void 0;
          let d2 = c2(780);
          class e2 {
            active() {
              return d2.ROOT_CONTEXT;
            }
            with(a3, b4, c3, ...d3) {
              return b4.call(c3, ...d3);
            }
            bind(a3, b4) {
              return b4;
            }
            enable() {
              return this;
            }
            disable() {
              return this;
            }
          }
          b3.NoopContextManager = e2;
        }, 780: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ROOT_CONTEXT = b3.createContextKey = void 0, b3.createContextKey = function(a3) {
            return Symbol.for(a3);
          };
          class c2 {
            constructor(a3) {
              const b4 = this;
              b4._currentContext = a3 ? new Map(a3) : /* @__PURE__ */ new Map(), b4.getValue = (a4) => b4._currentContext.get(a4), b4.setValue = (a4, d2) => {
                let e2 = new c2(b4._currentContext);
                return e2._currentContext.set(a4, d2), e2;
              }, b4.deleteValue = (a4) => {
                let d2 = new c2(b4._currentContext);
                return d2._currentContext.delete(a4), d2;
              };
            }
          }
          b3.ROOT_CONTEXT = new c2();
        }, 506: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.diag = void 0, b3.diag = c2(930).DiagAPI.instance();
        }, 56: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.DiagComponentLogger = void 0;
          let d2 = c2(172);
          class e2 {
            constructor(a3) {
              this._namespace = a3.namespace || "DiagComponentLogger";
            }
            debug(...a3) {
              return f2("debug", this._namespace, a3);
            }
            error(...a3) {
              return f2("error", this._namespace, a3);
            }
            info(...a3) {
              return f2("info", this._namespace, a3);
            }
            warn(...a3) {
              return f2("warn", this._namespace, a3);
            }
            verbose(...a3) {
              return f2("verbose", this._namespace, a3);
            }
          }
          function f2(a3, b4, c3) {
            let e3 = (0, d2.getGlobal)("diag");
            if (e3) return c3.unshift(b4), e3[a3](...c3);
          }
          b3.DiagComponentLogger = e2;
        }, 972: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.DiagConsoleLogger = void 0;
          let c2 = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }];
          class d2 {
            constructor() {
              for (let a3 = 0; a3 < c2.length; a3++) this[c2[a3].n] = /* @__PURE__ */ function(a4) {
                return function(...b4) {
                  if (console) {
                    let c3 = console[a4];
                    if ("function" != typeof c3 && (c3 = console.log), "function" == typeof c3) return c3.apply(console, b4);
                  }
                };
              }(c2[a3].c);
            }
          }
          b3.DiagConsoleLogger = d2;
        }, 912: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.createLogLevelDiagLogger = void 0;
          let d2 = c2(957);
          b3.createLogLevelDiagLogger = function(a3, b4) {
            function c3(c4, d3) {
              let e2 = b4[c4];
              return "function" == typeof e2 && a3 >= d3 ? e2.bind(b4) : function() {
              };
            }
            return a3 < d2.DiagLogLevel.NONE ? a3 = d2.DiagLogLevel.NONE : a3 > d2.DiagLogLevel.ALL && (a3 = d2.DiagLogLevel.ALL), b4 = b4 || {}, { error: c3("error", d2.DiagLogLevel.ERROR), warn: c3("warn", d2.DiagLogLevel.WARN), info: c3("info", d2.DiagLogLevel.INFO), debug: c3("debug", d2.DiagLogLevel.DEBUG), verbose: c3("verbose", d2.DiagLogLevel.VERBOSE) };
          };
        }, 957: (a2, b3) => {
          var c2;
          Object.defineProperty(b3, "__esModule", { value: true }), b3.DiagLogLevel = void 0, (c2 = b3.DiagLogLevel || (b3.DiagLogLevel = {}))[c2.NONE = 0] = "NONE", c2[c2.ERROR = 30] = "ERROR", c2[c2.WARN = 50] = "WARN", c2[c2.INFO = 60] = "INFO", c2[c2.DEBUG = 70] = "DEBUG", c2[c2.VERBOSE = 80] = "VERBOSE", c2[c2.ALL = 9999] = "ALL";
        }, 172: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.unregisterGlobal = b3.getGlobal = b3.registerGlobal = void 0;
          let d2 = c2(200), e2 = c2(521), f2 = c2(130), g2 = e2.VERSION.split(".")[0], h2 = Symbol.for(`opentelemetry.js.api.${g2}`), i2 = d2._globalThis;
          b3.registerGlobal = function(a3, b4, c3, d3 = false) {
            var f3;
            let g3 = i2[h2] = null != (f3 = i2[h2]) ? f3 : { version: e2.VERSION };
            if (!d3 && g3[a3]) {
              let b5 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${a3}`);
              return c3.error(b5.stack || b5.message), false;
            }
            if (g3.version !== e2.VERSION) {
              let b5 = Error(`@opentelemetry/api: Registration of version v${g3.version} for ${a3} does not match previously registered API v${e2.VERSION}`);
              return c3.error(b5.stack || b5.message), false;
            }
            return g3[a3] = b4, c3.debug(`@opentelemetry/api: Registered a global for ${a3} v${e2.VERSION}.`), true;
          }, b3.getGlobal = function(a3) {
            var b4, c3;
            let d3 = null == (b4 = i2[h2]) ? void 0 : b4.version;
            if (d3 && (0, f2.isCompatible)(d3)) return null == (c3 = i2[h2]) ? void 0 : c3[a3];
          }, b3.unregisterGlobal = function(a3, b4) {
            b4.debug(`@opentelemetry/api: Unregistering a global for ${a3} v${e2.VERSION}.`);
            let c3 = i2[h2];
            c3 && delete c3[a3];
          };
        }, 130: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.isCompatible = b3._makeCompatibilityCheck = void 0;
          let d2 = c2(521), e2 = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
          function f2(a3) {
            let b4 = /* @__PURE__ */ new Set([a3]), c3 = /* @__PURE__ */ new Set(), d3 = a3.match(e2);
            if (!d3) return () => false;
            let f3 = { major: +d3[1], minor: +d3[2], patch: +d3[3], prerelease: d3[4] };
            if (null != f3.prerelease) return function(b5) {
              return b5 === a3;
            };
            function g2(a4) {
              return c3.add(a4), false;
            }
            return function(a4) {
              if (b4.has(a4)) return true;
              if (c3.has(a4)) return false;
              let d4 = a4.match(e2);
              if (!d4) return g2(a4);
              let h2 = { major: +d4[1], minor: +d4[2], patch: +d4[3], prerelease: d4[4] };
              if (null != h2.prerelease || f3.major !== h2.major) return g2(a4);
              if (0 === f3.major) return f3.minor === h2.minor && f3.patch <= h2.patch ? (b4.add(a4), true) : g2(a4);
              return f3.minor <= h2.minor ? (b4.add(a4), true) : g2(a4);
            };
          }
          b3._makeCompatibilityCheck = f2, b3.isCompatible = f2(d2.VERSION);
        }, 886: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.metrics = void 0, b3.metrics = c2(653).MetricsAPI.getInstance();
        }, 901: (a2, b3) => {
          var c2;
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ValueType = void 0, (c2 = b3.ValueType || (b3.ValueType = {}))[c2.INT = 0] = "INT", c2[c2.DOUBLE = 1] = "DOUBLE";
        }, 102: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.createNoopMeter = b3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = b3.NOOP_OBSERVABLE_GAUGE_METRIC = b3.NOOP_OBSERVABLE_COUNTER_METRIC = b3.NOOP_UP_DOWN_COUNTER_METRIC = b3.NOOP_HISTOGRAM_METRIC = b3.NOOP_COUNTER_METRIC = b3.NOOP_METER = b3.NoopObservableUpDownCounterMetric = b3.NoopObservableGaugeMetric = b3.NoopObservableCounterMetric = b3.NoopObservableMetric = b3.NoopHistogramMetric = b3.NoopUpDownCounterMetric = b3.NoopCounterMetric = b3.NoopMetric = b3.NoopMeter = void 0;
          class c2 {
            createHistogram(a3, c3) {
              return b3.NOOP_HISTOGRAM_METRIC;
            }
            createCounter(a3, c3) {
              return b3.NOOP_COUNTER_METRIC;
            }
            createUpDownCounter(a3, c3) {
              return b3.NOOP_UP_DOWN_COUNTER_METRIC;
            }
            createObservableGauge(a3, c3) {
              return b3.NOOP_OBSERVABLE_GAUGE_METRIC;
            }
            createObservableCounter(a3, c3) {
              return b3.NOOP_OBSERVABLE_COUNTER_METRIC;
            }
            createObservableUpDownCounter(a3, c3) {
              return b3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
            }
            addBatchObservableCallback(a3, b4) {
            }
            removeBatchObservableCallback(a3) {
            }
          }
          b3.NoopMeter = c2;
          class d2 {
          }
          b3.NoopMetric = d2;
          class e2 extends d2 {
            add(a3, b4) {
            }
          }
          b3.NoopCounterMetric = e2;
          class f2 extends d2 {
            add(a3, b4) {
            }
          }
          b3.NoopUpDownCounterMetric = f2;
          class g2 extends d2 {
            record(a3, b4) {
            }
          }
          b3.NoopHistogramMetric = g2;
          class h2 {
            addCallback(a3) {
            }
            removeCallback(a3) {
            }
          }
          b3.NoopObservableMetric = h2;
          class i2 extends h2 {
          }
          b3.NoopObservableCounterMetric = i2;
          class j2 extends h2 {
          }
          b3.NoopObservableGaugeMetric = j2;
          class k2 extends h2 {
          }
          b3.NoopObservableUpDownCounterMetric = k2, b3.NOOP_METER = new c2(), b3.NOOP_COUNTER_METRIC = new e2(), b3.NOOP_HISTOGRAM_METRIC = new g2(), b3.NOOP_UP_DOWN_COUNTER_METRIC = new f2(), b3.NOOP_OBSERVABLE_COUNTER_METRIC = new i2(), b3.NOOP_OBSERVABLE_GAUGE_METRIC = new j2(), b3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new k2(), b3.createNoopMeter = function() {
            return b3.NOOP_METER;
          };
        }, 660: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NOOP_METER_PROVIDER = b3.NoopMeterProvider = void 0;
          let d2 = c2(102);
          class e2 {
            getMeter(a3, b4, c3) {
              return d2.NOOP_METER;
            }
          }
          b3.NoopMeterProvider = e2, b3.NOOP_METER_PROVIDER = new e2();
        }, 200: function(a2, b3, c2) {
          var d2 = this && this.__createBinding || (Object.create ? function(a3, b4, c3, d3) {
            void 0 === d3 && (d3 = c3), Object.defineProperty(a3, d3, { enumerable: true, get: function() {
              return b4[c3];
            } });
          } : function(a3, b4, c3, d3) {
            void 0 === d3 && (d3 = c3), a3[d3] = b4[c3];
          }), e2 = this && this.__exportStar || function(a3, b4) {
            for (var c3 in a3) "default" === c3 || Object.prototype.hasOwnProperty.call(b4, c3) || d2(b4, a3, c3);
          };
          Object.defineProperty(b3, "__esModule", { value: true }), e2(c2(46), b3);
        }, 651: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3._globalThis = void 0, b3._globalThis = "object" == typeof globalThis ? globalThis : c.g;
        }, 46: function(a2, b3, c2) {
          var d2 = this && this.__createBinding || (Object.create ? function(a3, b4, c3, d3) {
            void 0 === d3 && (d3 = c3), Object.defineProperty(a3, d3, { enumerable: true, get: function() {
              return b4[c3];
            } });
          } : function(a3, b4, c3, d3) {
            void 0 === d3 && (d3 = c3), a3[d3] = b4[c3];
          }), e2 = this && this.__exportStar || function(a3, b4) {
            for (var c3 in a3) "default" === c3 || Object.prototype.hasOwnProperty.call(b4, c3) || d2(b4, a3, c3);
          };
          Object.defineProperty(b3, "__esModule", { value: true }), e2(c2(651), b3);
        }, 939: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.propagation = void 0, b3.propagation = c2(181).PropagationAPI.getInstance();
        }, 874: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NoopTextMapPropagator = void 0;
          class c2 {
            inject(a3, b4) {
            }
            extract(a3, b4) {
              return a3;
            }
            fields() {
              return [];
            }
          }
          b3.NoopTextMapPropagator = c2;
        }, 194: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.defaultTextMapSetter = b3.defaultTextMapGetter = void 0, b3.defaultTextMapGetter = { get(a3, b4) {
            if (null != a3) return a3[b4];
          }, keys: (a3) => null == a3 ? [] : Object.keys(a3) }, b3.defaultTextMapSetter = { set(a3, b4, c2) {
            null != a3 && (a3[b4] = c2);
          } };
        }, 845: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.trace = void 0, b3.trace = c2(997).TraceAPI.getInstance();
        }, 403: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NonRecordingSpan = void 0;
          let d2 = c2(476);
          class e2 {
            constructor(a3 = d2.INVALID_SPAN_CONTEXT) {
              this._spanContext = a3;
            }
            spanContext() {
              return this._spanContext;
            }
            setAttribute(a3, b4) {
              return this;
            }
            setAttributes(a3) {
              return this;
            }
            addEvent(a3, b4) {
              return this;
            }
            setStatus(a3) {
              return this;
            }
            updateName(a3) {
              return this;
            }
            end(a3) {
            }
            isRecording() {
              return false;
            }
            recordException(a3, b4) {
            }
          }
          b3.NonRecordingSpan = e2;
        }, 614: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NoopTracer = void 0;
          let d2 = c2(491), e2 = c2(607), f2 = c2(403), g2 = c2(139), h2 = d2.ContextAPI.getInstance();
          class i2 {
            startSpan(a3, b4, c3 = h2.active()) {
              var d3;
              if (null == b4 ? void 0 : b4.root) return new f2.NonRecordingSpan();
              let i3 = c3 && (0, e2.getSpanContext)(c3);
              return "object" == typeof (d3 = i3) && "string" == typeof d3.spanId && "string" == typeof d3.traceId && "number" == typeof d3.traceFlags && (0, g2.isSpanContextValid)(i3) ? new f2.NonRecordingSpan(i3) : new f2.NonRecordingSpan();
            }
            startActiveSpan(a3, b4, c3, d3) {
              let f3, g3, i3;
              if (arguments.length < 2) return;
              2 == arguments.length ? i3 = b4 : 3 == arguments.length ? (f3 = b4, i3 = c3) : (f3 = b4, g3 = c3, i3 = d3);
              let j2 = null != g3 ? g3 : h2.active(), k2 = this.startSpan(a3, f3, j2), l2 = (0, e2.setSpan)(j2, k2);
              return h2.with(l2, i3, void 0, k2);
            }
          }
          b3.NoopTracer = i2;
        }, 124: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NoopTracerProvider = void 0;
          let d2 = c2(614);
          class e2 {
            getTracer(a3, b4, c3) {
              return new d2.NoopTracer();
            }
          }
          b3.NoopTracerProvider = e2;
        }, 125: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ProxyTracer = void 0;
          let d2 = new (c2(614)).NoopTracer();
          class e2 {
            constructor(a3, b4, c3, d3) {
              this._provider = a3, this.name = b4, this.version = c3, this.options = d3;
            }
            startSpan(a3, b4, c3) {
              return this._getTracer().startSpan(a3, b4, c3);
            }
            startActiveSpan(a3, b4, c3, d3) {
              let e3 = this._getTracer();
              return Reflect.apply(e3.startActiveSpan, e3, arguments);
            }
            _getTracer() {
              if (this._delegate) return this._delegate;
              let a3 = this._provider.getDelegateTracer(this.name, this.version, this.options);
              return a3 ? (this._delegate = a3, this._delegate) : d2;
            }
          }
          b3.ProxyTracer = e2;
        }, 846: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ProxyTracerProvider = void 0;
          let d2 = c2(125), e2 = new (c2(124)).NoopTracerProvider();
          class f2 {
            getTracer(a3, b4, c3) {
              var e3;
              return null != (e3 = this.getDelegateTracer(a3, b4, c3)) ? e3 : new d2.ProxyTracer(this, a3, b4, c3);
            }
            getDelegate() {
              var a3;
              return null != (a3 = this._delegate) ? a3 : e2;
            }
            setDelegate(a3) {
              this._delegate = a3;
            }
            getDelegateTracer(a3, b4, c3) {
              var d3;
              return null == (d3 = this._delegate) ? void 0 : d3.getTracer(a3, b4, c3);
            }
          }
          b3.ProxyTracerProvider = f2;
        }, 996: (a2, b3) => {
          var c2;
          Object.defineProperty(b3, "__esModule", { value: true }), b3.SamplingDecision = void 0, (c2 = b3.SamplingDecision || (b3.SamplingDecision = {}))[c2.NOT_RECORD = 0] = "NOT_RECORD", c2[c2.RECORD = 1] = "RECORD", c2[c2.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
        }, 607: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.getSpanContext = b3.setSpanContext = b3.deleteSpan = b3.setSpan = b3.getActiveSpan = b3.getSpan = void 0;
          let d2 = c2(780), e2 = c2(403), f2 = c2(491), g2 = (0, d2.createContextKey)("OpenTelemetry Context Key SPAN");
          function h2(a3) {
            return a3.getValue(g2) || void 0;
          }
          function i2(a3, b4) {
            return a3.setValue(g2, b4);
          }
          b3.getSpan = h2, b3.getActiveSpan = function() {
            return h2(f2.ContextAPI.getInstance().active());
          }, b3.setSpan = i2, b3.deleteSpan = function(a3) {
            return a3.deleteValue(g2);
          }, b3.setSpanContext = function(a3, b4) {
            return i2(a3, new e2.NonRecordingSpan(b4));
          }, b3.getSpanContext = function(a3) {
            var b4;
            return null == (b4 = h2(a3)) ? void 0 : b4.spanContext();
          };
        }, 325: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.TraceStateImpl = void 0;
          let d2 = c2(564);
          class e2 {
            constructor(a3) {
              this._internalState = /* @__PURE__ */ new Map(), a3 && this._parse(a3);
            }
            set(a3, b4) {
              let c3 = this._clone();
              return c3._internalState.has(a3) && c3._internalState.delete(a3), c3._internalState.set(a3, b4), c3;
            }
            unset(a3) {
              let b4 = this._clone();
              return b4._internalState.delete(a3), b4;
            }
            get(a3) {
              return this._internalState.get(a3);
            }
            serialize() {
              return this._keys().reduce((a3, b4) => (a3.push(b4 + "=" + this.get(b4)), a3), []).join(",");
            }
            _parse(a3) {
              !(a3.length > 512) && (this._internalState = a3.split(",").reverse().reduce((a4, b4) => {
                let c3 = b4.trim(), e3 = c3.indexOf("=");
                if (-1 !== e3) {
                  let f2 = c3.slice(0, e3), g2 = c3.slice(e3 + 1, b4.length);
                  (0, d2.validateKey)(f2) && (0, d2.validateValue)(g2) && a4.set(f2, g2);
                }
                return a4;
              }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
            }
            _keys() {
              return Array.from(this._internalState.keys()).reverse();
            }
            _clone() {
              let a3 = new e2();
              return a3._internalState = new Map(this._internalState), a3;
            }
          }
          b3.TraceStateImpl = e2;
        }, 564: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.validateValue = b3.validateKey = void 0;
          let c2 = "[_0-9a-z-*/]", d2 = `[a-z]${c2}{0,255}`, e2 = `[a-z0-9]${c2}{0,240}@[a-z]${c2}{0,13}`, f2 = RegExp(`^(?:${d2}|${e2})$`), g2 = /^[ -~]{0,255}[!-~]$/, h2 = /,|=/;
          b3.validateKey = function(a3) {
            return f2.test(a3);
          }, b3.validateValue = function(a3) {
            return g2.test(a3) && !h2.test(a3);
          };
        }, 98: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.createTraceState = void 0;
          let d2 = c2(325);
          b3.createTraceState = function(a3) {
            return new d2.TraceStateImpl(a3);
          };
        }, 476: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.INVALID_SPAN_CONTEXT = b3.INVALID_TRACEID = b3.INVALID_SPANID = void 0;
          let d2 = c2(475);
          b3.INVALID_SPANID = "0000000000000000", b3.INVALID_TRACEID = "00000000000000000000000000000000", b3.INVALID_SPAN_CONTEXT = { traceId: b3.INVALID_TRACEID, spanId: b3.INVALID_SPANID, traceFlags: d2.TraceFlags.NONE };
        }, 357: (a2, b3) => {
          var c2;
          Object.defineProperty(b3, "__esModule", { value: true }), b3.SpanKind = void 0, (c2 = b3.SpanKind || (b3.SpanKind = {}))[c2.INTERNAL = 0] = "INTERNAL", c2[c2.SERVER = 1] = "SERVER", c2[c2.CLIENT = 2] = "CLIENT", c2[c2.PRODUCER = 3] = "PRODUCER", c2[c2.CONSUMER = 4] = "CONSUMER";
        }, 139: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.wrapSpanContext = b3.isSpanContextValid = b3.isValidSpanId = b3.isValidTraceId = void 0;
          let d2 = c2(476), e2 = c2(403), f2 = /^([0-9a-f]{32})$/i, g2 = /^[0-9a-f]{16}$/i;
          function h2(a3) {
            return f2.test(a3) && a3 !== d2.INVALID_TRACEID;
          }
          function i2(a3) {
            return g2.test(a3) && a3 !== d2.INVALID_SPANID;
          }
          b3.isValidTraceId = h2, b3.isValidSpanId = i2, b3.isSpanContextValid = function(a3) {
            return h2(a3.traceId) && i2(a3.spanId);
          }, b3.wrapSpanContext = function(a3) {
            return new e2.NonRecordingSpan(a3);
          };
        }, 847: (a2, b3) => {
          var c2;
          Object.defineProperty(b3, "__esModule", { value: true }), b3.SpanStatusCode = void 0, (c2 = b3.SpanStatusCode || (b3.SpanStatusCode = {}))[c2.UNSET = 0] = "UNSET", c2[c2.OK = 1] = "OK", c2[c2.ERROR = 2] = "ERROR";
        }, 475: (a2, b3) => {
          var c2;
          Object.defineProperty(b3, "__esModule", { value: true }), b3.TraceFlags = void 0, (c2 = b3.TraceFlags || (b3.TraceFlags = {}))[c2.NONE = 0] = "NONE", c2[c2.SAMPLED = 1] = "SAMPLED";
        }, 521: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.VERSION = void 0, b3.VERSION = "1.6.0";
        } }, y = {};
        function z(a2) {
          var b3 = y[a2];
          if (void 0 !== b3) return b3.exports;
          var c2 = y[a2] = { exports: {} }, d2 = true;
          try {
            x[a2].call(c2.exports, c2, c2.exports, z), d2 = false;
          } finally {
            d2 && delete y[a2];
          }
          return c2.exports;
        }
        z.ab = "//";
        var A = {};
        Object.defineProperty(A, "__esModule", { value: true }), A.trace = A.propagation = A.metrics = A.diag = A.context = A.INVALID_SPAN_CONTEXT = A.INVALID_TRACEID = A.INVALID_SPANID = A.isValidSpanId = A.isValidTraceId = A.isSpanContextValid = A.createTraceState = A.TraceFlags = A.SpanStatusCode = A.SpanKind = A.SamplingDecision = A.ProxyTracerProvider = A.ProxyTracer = A.defaultTextMapSetter = A.defaultTextMapGetter = A.ValueType = A.createNoopMeter = A.DiagLogLevel = A.DiagConsoleLogger = A.ROOT_CONTEXT = A.createContextKey = A.baggageEntryMetadataFromString = void 0, h = z(369), Object.defineProperty(A, "baggageEntryMetadataFromString", { enumerable: true, get: function() {
          return h.baggageEntryMetadataFromString;
        } }), i = z(780), Object.defineProperty(A, "createContextKey", { enumerable: true, get: function() {
          return i.createContextKey;
        } }), Object.defineProperty(A, "ROOT_CONTEXT", { enumerable: true, get: function() {
          return i.ROOT_CONTEXT;
        } }), j = z(972), Object.defineProperty(A, "DiagConsoleLogger", { enumerable: true, get: function() {
          return j.DiagConsoleLogger;
        } }), k = z(957), Object.defineProperty(A, "DiagLogLevel", { enumerable: true, get: function() {
          return k.DiagLogLevel;
        } }), l = z(102), Object.defineProperty(A, "createNoopMeter", { enumerable: true, get: function() {
          return l.createNoopMeter;
        } }), m = z(901), Object.defineProperty(A, "ValueType", { enumerable: true, get: function() {
          return m.ValueType;
        } }), n = z(194), Object.defineProperty(A, "defaultTextMapGetter", { enumerable: true, get: function() {
          return n.defaultTextMapGetter;
        } }), Object.defineProperty(A, "defaultTextMapSetter", { enumerable: true, get: function() {
          return n.defaultTextMapSetter;
        } }), o = z(125), Object.defineProperty(A, "ProxyTracer", { enumerable: true, get: function() {
          return o.ProxyTracer;
        } }), p = z(846), Object.defineProperty(A, "ProxyTracerProvider", { enumerable: true, get: function() {
          return p.ProxyTracerProvider;
        } }), q = z(996), Object.defineProperty(A, "SamplingDecision", { enumerable: true, get: function() {
          return q.SamplingDecision;
        } }), r = z(357), Object.defineProperty(A, "SpanKind", { enumerable: true, get: function() {
          return r.SpanKind;
        } }), s = z(847), Object.defineProperty(A, "SpanStatusCode", { enumerable: true, get: function() {
          return s.SpanStatusCode;
        } }), t = z(475), Object.defineProperty(A, "TraceFlags", { enumerable: true, get: function() {
          return t.TraceFlags;
        } }), u = z(98), Object.defineProperty(A, "createTraceState", { enumerable: true, get: function() {
          return u.createTraceState;
        } }), v = z(139), Object.defineProperty(A, "isSpanContextValid", { enumerable: true, get: function() {
          return v.isSpanContextValid;
        } }), Object.defineProperty(A, "isValidTraceId", { enumerable: true, get: function() {
          return v.isValidTraceId;
        } }), Object.defineProperty(A, "isValidSpanId", { enumerable: true, get: function() {
          return v.isValidSpanId;
        } }), w = z(476), Object.defineProperty(A, "INVALID_SPANID", { enumerable: true, get: function() {
          return w.INVALID_SPANID;
        } }), Object.defineProperty(A, "INVALID_TRACEID", { enumerable: true, get: function() {
          return w.INVALID_TRACEID;
        } }), Object.defineProperty(A, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function() {
          return w.INVALID_SPAN_CONTEXT;
        } }), b2 = z(67), Object.defineProperty(A, "context", { enumerable: true, get: function() {
          return b2.context;
        } }), d = z(506), Object.defineProperty(A, "diag", { enumerable: true, get: function() {
          return d.diag;
        } }), e = z(886), Object.defineProperty(A, "metrics", { enumerable: true, get: function() {
          return e.metrics;
        } }), f = z(939), Object.defineProperty(A, "propagation", { enumerable: true, get: function() {
          return f.propagation;
        } }), g = z(845), Object.defineProperty(A, "trace", { enumerable: true, get: function() {
          return g.trace;
        } }), A.default = { context: b2.context, diag: d.diag, metrics: e.metrics, propagation: f.propagation, trace: g.trace }, a.exports = A;
      })();
    }, 486: (a, b) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      class c extends Error {
        constructor(a2) {
          super(a2.message), this.name = "PostgrestError", this.details = a2.details, this.hint = a2.hint, this.code = a2.code;
        }
      }
      b.default = c;
    }, 521: (a) => {
      "use strict";
      a.exports = (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports));
    }, 643: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      var d = { getTestReqInfo: function() {
        return i;
      }, withRequest: function() {
        return h;
      } };
      for (var e in d) Object.defineProperty(b, e, { enumerable: true, get: d[e] });
      let f = new (c(521)).AsyncLocalStorage();
      function g(a2, b2) {
        let c2 = b2.header(a2, "next-test-proxy-port");
        if (!c2) return;
        let d2 = b2.url(a2);
        return { url: d2, proxyPort: Number(c2), testData: b2.header(a2, "next-test-data") || "" };
      }
      function h(a2, b2, c2) {
        let d2 = g(a2, b2);
        return d2 ? f.run(d2, c2) : c2();
      }
      function i(a2, b2) {
        let c2 = f.getStore();
        return c2 || (a2 && b2 ? g(a2, b2) : void 0);
      }
    }, 654: (a, b, c) => {
      "use strict";
      a.exports = c(42);
    }, 712: (a, b) => {
      "use strict";
      Object.prototype.toString;
    }, 827: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      let d = c(284).__importDefault(c(319)), e = RegExp("[,()]");
      class f extends d.default {
        eq(a2, b2) {
          return this.url.searchParams.append(a2, `eq.${b2}`), this;
        }
        neq(a2, b2) {
          return this.url.searchParams.append(a2, `neq.${b2}`), this;
        }
        gt(a2, b2) {
          return this.url.searchParams.append(a2, `gt.${b2}`), this;
        }
        gte(a2, b2) {
          return this.url.searchParams.append(a2, `gte.${b2}`), this;
        }
        lt(a2, b2) {
          return this.url.searchParams.append(a2, `lt.${b2}`), this;
        }
        lte(a2, b2) {
          return this.url.searchParams.append(a2, `lte.${b2}`), this;
        }
        like(a2, b2) {
          return this.url.searchParams.append(a2, `like.${b2}`), this;
        }
        likeAllOf(a2, b2) {
          return this.url.searchParams.append(a2, `like(all).{${b2.join(",")}}`), this;
        }
        likeAnyOf(a2, b2) {
          return this.url.searchParams.append(a2, `like(any).{${b2.join(",")}}`), this;
        }
        ilike(a2, b2) {
          return this.url.searchParams.append(a2, `ilike.${b2}`), this;
        }
        ilikeAllOf(a2, b2) {
          return this.url.searchParams.append(a2, `ilike(all).{${b2.join(",")}}`), this;
        }
        ilikeAnyOf(a2, b2) {
          return this.url.searchParams.append(a2, `ilike(any).{${b2.join(",")}}`), this;
        }
        is(a2, b2) {
          return this.url.searchParams.append(a2, `is.${b2}`), this;
        }
        in(a2, b2) {
          let c2 = Array.from(new Set(b2)).map((a3) => "string" == typeof a3 && e.test(a3) ? `"${a3}"` : `${a3}`).join(",");
          return this.url.searchParams.append(a2, `in.(${c2})`), this;
        }
        contains(a2, b2) {
          return "string" == typeof b2 ? this.url.searchParams.append(a2, `cs.${b2}`) : Array.isArray(b2) ? this.url.searchParams.append(a2, `cs.{${b2.join(",")}}`) : this.url.searchParams.append(a2, `cs.${JSON.stringify(b2)}`), this;
        }
        containedBy(a2, b2) {
          return "string" == typeof b2 ? this.url.searchParams.append(a2, `cd.${b2}`) : Array.isArray(b2) ? this.url.searchParams.append(a2, `cd.{${b2.join(",")}}`) : this.url.searchParams.append(a2, `cd.${JSON.stringify(b2)}`), this;
        }
        rangeGt(a2, b2) {
          return this.url.searchParams.append(a2, `sr.${b2}`), this;
        }
        rangeGte(a2, b2) {
          return this.url.searchParams.append(a2, `nxl.${b2}`), this;
        }
        rangeLt(a2, b2) {
          return this.url.searchParams.append(a2, `sl.${b2}`), this;
        }
        rangeLte(a2, b2) {
          return this.url.searchParams.append(a2, `nxr.${b2}`), this;
        }
        rangeAdjacent(a2, b2) {
          return this.url.searchParams.append(a2, `adj.${b2}`), this;
        }
        overlaps(a2, b2) {
          return "string" == typeof b2 ? this.url.searchParams.append(a2, `ov.${b2}`) : this.url.searchParams.append(a2, `ov.{${b2.join(",")}}`), this;
        }
        textSearch(a2, b2, { config: c2, type: d2 } = {}) {
          let e2 = "";
          "plain" === d2 ? e2 = "pl" : "phrase" === d2 ? e2 = "ph" : "websearch" === d2 && (e2 = "w");
          let f2 = void 0 === c2 ? "" : `(${c2})`;
          return this.url.searchParams.append(a2, `${e2}fts${f2}.${b2}`), this;
        }
        match(a2) {
          return Object.entries(a2).forEach(([a3, b2]) => {
            this.url.searchParams.append(a3, `eq.${b2}`);
          }), this;
        }
        not(a2, b2, c2) {
          return this.url.searchParams.append(a2, `not.${b2}.${c2}`), this;
        }
        or(a2, { foreignTable: b2, referencedTable: c2 = b2 } = {}) {
          let d2 = c2 ? `${c2}.or` : "or";
          return this.url.searchParams.append(d2, `(${a2})`), this;
        }
        filter(a2, b2, c2) {
          return this.url.searchParams.append(a2, `${b2}.${c2}`), this;
        }
      }
      b.default = f;
    }, 833: (a, b, c) => {
      "use strict";
      let d, e, f;
      c.r(b), c.d(b, { default: () => fB, handler: () => fA });
      var g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T = {};
      async function U() {
        return "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && await _ENTRIES.middleware_instrumentation;
      }
      c.r(T), c.d(T, { config: () => fu, middleware: () => ft, runtime: () => fs });
      let V = null;
      async function W() {
        if ("phase-production-build" === process.env.NEXT_PHASE) return;
        V || (V = U());
        let a10 = await V;
        if (null == a10 ? void 0 : a10.register) try {
          await a10.register();
        } catch (a11) {
          throw a11.message = `An error occurred while loading instrumentation hook: ${a11.message}`, a11;
        }
      }
      async function X(...a10) {
        let b10 = await U();
        try {
          var c10;
          await (null == b10 || null == (c10 = b10.onRequestError) ? void 0 : c10.call(b10, ...a10));
        } catch (a11) {
          console.error("Error in instrumentation.onRequestError:", a11);
        }
      }
      let Y = null;
      function Z() {
        return Y || (Y = W()), Y;
      }
      function $(a10) {
        return `The edge runtime does not support Node.js '${a10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== c.g.process && (process.env = c.g.process.env, c.g.process = process);
      try {
        Object.defineProperty(globalThis, "__import_unsupported", { value: function(a10) {
          let b10 = new Proxy(function() {
          }, { get(b11, c10) {
            if ("then" === c10) return {};
            throw Object.defineProperty(Error($(a10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, construct() {
            throw Object.defineProperty(Error($(a10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, apply(c10, d10, e10) {
            if ("function" == typeof e10[0]) return e10[0](b10);
            throw Object.defineProperty(Error($(a10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          } });
          return new Proxy({}, { get: () => b10 });
        }, enumerable: false, configurable: false });
      } catch {
      }
      Z();
      class _ extends Error {
        constructor({ page: a10 }) {
          super(`The middleware "${a10}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class aa extends Error {
        constructor() {
          super("The request.page has been deprecated in favour of `URLPattern`.\n  Read more: https://nextjs.org/docs/messages/middleware-request-page\n  ");
        }
      }
      class ab extends Error {
        constructor() {
          super("The request.ua has been removed in favour of `userAgent` function.\n  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent\n  ");
        }
      }
      let ac = "x-prerender-revalidate", ad = ".meta", ae = "x-next-cache-tags", af = "x-next-revalidated-tags", ag = "_N_T_", ah = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", apiNode: "api-node", apiEdge: "api-edge", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", pagesDirBrowser: "pages-dir-browser", pagesDirEdge: "pages-dir-edge", pagesDirNode: "pages-dir-node" };
      function ai(a10) {
        var b10, c10, d10, e10, f2, g2 = [], h2 = 0;
        function i2() {
          for (; h2 < a10.length && /\s/.test(a10.charAt(h2)); ) h2 += 1;
          return h2 < a10.length;
        }
        for (; h2 < a10.length; ) {
          for (b10 = h2, f2 = false; i2(); ) if ("," === (c10 = a10.charAt(h2))) {
            for (d10 = h2, h2 += 1, i2(), e10 = h2; h2 < a10.length && "=" !== (c10 = a10.charAt(h2)) && ";" !== c10 && "," !== c10; ) h2 += 1;
            h2 < a10.length && "=" === a10.charAt(h2) ? (f2 = true, h2 = e10, g2.push(a10.substring(b10, d10)), b10 = h2) : h2 = d10 + 1;
          } else h2 += 1;
          (!f2 || h2 >= a10.length) && g2.push(a10.substring(b10, a10.length));
        }
        return g2;
      }
      function aj(a10) {
        let b10 = {}, c10 = [];
        if (a10) for (let [d10, e10] of a10.entries()) "set-cookie" === d10.toLowerCase() ? (c10.push(...ai(e10)), b10[d10] = 1 === c10.length ? c10[0] : c10) : b10[d10] = e10;
        return b10;
      }
      function ak(a10) {
        try {
          return String(new URL(String(a10)));
        } catch (b10) {
          throw Object.defineProperty(Error(`URL is malformed "${String(a10)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: b10 }), "__NEXT_ERROR_CODE", { value: "E61", enumerable: false, configurable: true });
        }
      }
      ({ ...ah, GROUP: { builtinReact: [ah.reactServerComponents, ah.actionBrowser], serverOnly: [ah.reactServerComponents, ah.actionBrowser, ah.instrument, ah.middleware], neutralTarget: [ah.apiNode, ah.apiEdge], clientOnly: [ah.serverSideRendering, ah.appPagesBrowser], bundled: [ah.reactServerComponents, ah.actionBrowser, ah.serverSideRendering, ah.appPagesBrowser, ah.shared, ah.instrument, ah.middleware], appPages: [ah.reactServerComponents, ah.serverSideRendering, ah.appPagesBrowser, ah.actionBrowser] } });
      let al = Symbol("response"), am = Symbol("passThrough"), an = Symbol("waitUntil");
      class ao {
        constructor(a10, b10) {
          this[am] = false, this[an] = b10 ? { kind: "external", function: b10 } : { kind: "internal", promises: [] };
        }
        respondWith(a10) {
          this[al] || (this[al] = Promise.resolve(a10));
        }
        passThroughOnException() {
          this[am] = true;
        }
        waitUntil(a10) {
          if ("external" === this[an].kind) return (0, this[an].function)(a10);
          this[an].promises.push(a10);
        }
      }
      class ap extends ao {
        constructor(a10) {
          var b10;
          super(a10.request, null == (b10 = a10.context) ? void 0 : b10.waitUntil), this.sourcePage = a10.page;
        }
        get request() {
          throw Object.defineProperty(new _({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new _({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      function aq(a10) {
        return a10.replace(/\/$/, "") || "/";
      }
      function ar(a10) {
        let b10 = a10.indexOf("#"), c10 = a10.indexOf("?"), d10 = c10 > -1 && (b10 < 0 || c10 < b10);
        return d10 || b10 > -1 ? { pathname: a10.substring(0, d10 ? c10 : b10), query: d10 ? a10.substring(c10, b10 > -1 ? b10 : void 0) : "", hash: b10 > -1 ? a10.slice(b10) : "" } : { pathname: a10, query: "", hash: "" };
      }
      function as(a10, b10) {
        if (!a10.startsWith("/") || !b10) return a10;
        let { pathname: c10, query: d10, hash: e10 } = ar(a10);
        return `${b10}${c10}${d10}${e10}`;
      }
      function at(a10, b10) {
        if (!a10.startsWith("/") || !b10) return a10;
        let { pathname: c10, query: d10, hash: e10 } = ar(a10);
        return `${c10}${b10}${d10}${e10}`;
      }
      function au(a10, b10) {
        if ("string" != typeof a10) return false;
        let { pathname: c10 } = ar(a10);
        return c10 === b10 || c10.startsWith(b10 + "/");
      }
      let av = /* @__PURE__ */ new WeakMap();
      function aw(a10, b10) {
        let c10;
        if (!b10) return { pathname: a10 };
        let d10 = av.get(b10);
        d10 || (d10 = b10.map((a11) => a11.toLowerCase()), av.set(b10, d10));
        let e10 = a10.split("/", 2);
        if (!e10[1]) return { pathname: a10 };
        let f2 = e10[1].toLowerCase(), g2 = d10.indexOf(f2);
        return g2 < 0 ? { pathname: a10 } : (c10 = b10[g2], { pathname: a10 = a10.slice(c10.length + 1) || "/", detectedLocale: c10 });
      }
      let ax = /^(?:127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)$/;
      function ay(a10, b10) {
        let c10 = new URL(String(a10), b10 && String(b10));
        return ax.test(c10.hostname) && (c10.hostname = "localhost"), c10;
      }
      let az = Symbol("NextURLInternal");
      class aA {
        constructor(a10, b10, c10) {
          let d10, e10;
          "object" == typeof b10 && "pathname" in b10 || "string" == typeof b10 ? (d10 = b10, e10 = c10 || {}) : e10 = c10 || b10 || {}, this[az] = { url: ay(a10, d10 ?? e10.base), options: e10, basePath: "" }, this.analyze();
        }
        analyze() {
          var a10, b10, c10, d10, e10;
          let f2 = function(a11, b11) {
            let { basePath: c11, i18n: d11, trailingSlash: e11 } = b11.nextConfig ?? {}, f3 = { pathname: a11, trailingSlash: "/" !== a11 ? a11.endsWith("/") : e11 };
            c11 && au(f3.pathname, c11) && (f3.pathname = function(a12, b12) {
              if (!au(a12, b12)) return a12;
              let c12 = a12.slice(b12.length);
              return c12.startsWith("/") ? c12 : `/${c12}`;
            }(f3.pathname, c11), f3.basePath = c11);
            let g3 = f3.pathname;
            if (f3.pathname.startsWith("/_next/data/") && f3.pathname.endsWith(".json")) {
              let a12 = f3.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
              f3.buildId = a12[0], g3 = "index" !== a12[1] ? `/${a12.slice(1).join("/")}` : "/", true === b11.parseData && (f3.pathname = g3);
            }
            if (d11) {
              let a12 = b11.i18nProvider ? b11.i18nProvider.analyze(f3.pathname) : aw(f3.pathname, d11.locales);
              f3.locale = a12.detectedLocale, f3.pathname = a12.pathname ?? f3.pathname, !a12.detectedLocale && f3.buildId && (a12 = b11.i18nProvider ? b11.i18nProvider.analyze(g3) : aw(g3, d11.locales)).detectedLocale && (f3.locale = a12.detectedLocale);
            }
            return f3;
          }(this[az].url.pathname, { nextConfig: this[az].options.nextConfig, parseData: true, i18nProvider: this[az].options.i18nProvider }), g2 = function(a11, b11) {
            let c11;
            if (b11?.host && !Array.isArray(b11.host)) c11 = b11.host.toString().split(":", 1)[0];
            else {
              if (!a11.hostname) return;
              c11 = a11.hostname;
            }
            return c11.toLowerCase();
          }(this[az].url, this[az].options.headers);
          this[az].domainLocale = this[az].options.i18nProvider ? this[az].options.i18nProvider.detectDomainLocale(g2) : function(a11, b11, c11) {
            if (a11) {
              for (let d11 of (c11 && (c11 = c11.toLowerCase()), a11)) if (b11 === d11.domain?.split(":", 1)[0].toLowerCase() || c11 === d11.defaultLocale.toLowerCase() || d11.locales?.some((a12) => a12.toLowerCase() === c11)) return d11;
            }
          }(null == (b10 = this[az].options.nextConfig) || null == (a10 = b10.i18n) ? void 0 : a10.domains, g2);
          let h2 = (null == (c10 = this[az].domainLocale) ? void 0 : c10.defaultLocale) || (null == (e10 = this[az].options.nextConfig) || null == (d10 = e10.i18n) ? void 0 : d10.defaultLocale);
          this[az].url.pathname = f2.pathname, this[az].defaultLocale = h2, this[az].basePath = f2.basePath ?? "", this[az].buildId = f2.buildId, this[az].locale = f2.locale ?? h2, this[az].trailingSlash = f2.trailingSlash;
        }
        formatPathname() {
          var a10;
          let b10;
          return b10 = function(a11, b11, c10, d10) {
            if (!b11 || b11 === c10) return a11;
            let e10 = a11.toLowerCase();
            return !d10 && (au(e10, "/api") || au(e10, `/${b11.toLowerCase()}`)) ? a11 : as(a11, `/${b11}`);
          }((a10 = { basePath: this[az].basePath, buildId: this[az].buildId, defaultLocale: this[az].options.forceLocale ? void 0 : this[az].defaultLocale, locale: this[az].locale, pathname: this[az].url.pathname, trailingSlash: this[az].trailingSlash }).pathname, a10.locale, a10.buildId ? void 0 : a10.defaultLocale, a10.ignorePrefix), (a10.buildId || !a10.trailingSlash) && (b10 = aq(b10)), a10.buildId && (b10 = at(as(b10, `/_next/data/${a10.buildId}`), "/" === a10.pathname ? "index.json" : ".json")), b10 = as(b10, a10.basePath), !a10.buildId && a10.trailingSlash ? b10.endsWith("/") ? b10 : at(b10, "/") : aq(b10);
        }
        formatSearch() {
          return this[az].url.search;
        }
        get buildId() {
          return this[az].buildId;
        }
        set buildId(a10) {
          this[az].buildId = a10;
        }
        get locale() {
          return this[az].locale ?? "";
        }
        set locale(a10) {
          var b10, c10;
          if (!this[az].locale || !(null == (c10 = this[az].options.nextConfig) || null == (b10 = c10.i18n) ? void 0 : b10.locales.includes(a10))) throw Object.defineProperty(TypeError(`The NextURL configuration includes no locale "${a10}"`), "__NEXT_ERROR_CODE", { value: "E597", enumerable: false, configurable: true });
          this[az].locale = a10;
        }
        get defaultLocale() {
          return this[az].defaultLocale;
        }
        get domainLocale() {
          return this[az].domainLocale;
        }
        get searchParams() {
          return this[az].url.searchParams;
        }
        get host() {
          return this[az].url.host;
        }
        set host(a10) {
          this[az].url.host = a10;
        }
        get hostname() {
          return this[az].url.hostname;
        }
        set hostname(a10) {
          this[az].url.hostname = a10;
        }
        get port() {
          return this[az].url.port;
        }
        set port(a10) {
          this[az].url.port = a10;
        }
        get protocol() {
          return this[az].url.protocol;
        }
        set protocol(a10) {
          this[az].url.protocol = a10;
        }
        get href() {
          let a10 = this.formatPathname(), b10 = this.formatSearch();
          return `${this.protocol}//${this.host}${a10}${b10}${this.hash}`;
        }
        set href(a10) {
          this[az].url = ay(a10), this.analyze();
        }
        get origin() {
          return this[az].url.origin;
        }
        get pathname() {
          return this[az].url.pathname;
        }
        set pathname(a10) {
          this[az].url.pathname = a10;
        }
        get hash() {
          return this[az].url.hash;
        }
        set hash(a10) {
          this[az].url.hash = a10;
        }
        get search() {
          return this[az].url.search;
        }
        set search(a10) {
          this[az].url.search = a10;
        }
        get password() {
          return this[az].url.password;
        }
        set password(a10) {
          this[az].url.password = a10;
        }
        get username() {
          return this[az].url.username;
        }
        set username(a10) {
          this[az].url.username = a10;
        }
        get basePath() {
          return this[az].basePath;
        }
        set basePath(a10) {
          this[az].basePath = a10.startsWith("/") ? a10 : `/${a10}`;
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
          return new aA(String(this), this[az].options);
        }
      }
      var aB = c(918);
      let aC = Symbol("internal request");
      class aD extends Request {
        constructor(a10, b10 = {}) {
          const c10 = "string" != typeof a10 && "url" in a10 ? a10.url : String(a10);
          ak(c10), a10 instanceof Request ? super(a10, b10) : super(c10, b10);
          const d10 = new aA(c10, { headers: aj(this.headers), nextConfig: b10.nextConfig });
          this[aC] = { cookies: new aB.RequestCookies(this.headers), nextUrl: d10, url: d10.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[aC].cookies;
        }
        get nextUrl() {
          return this[aC].nextUrl;
        }
        get page() {
          throw new aa();
        }
        get ua() {
          throw new ab();
        }
        get url() {
          return this[aC].url;
        }
      }
      class aE {
        static get(a10, b10, c10) {
          let d10 = Reflect.get(a10, b10, c10);
          return "function" == typeof d10 ? d10.bind(a10) : d10;
        }
        static set(a10, b10, c10, d10) {
          return Reflect.set(a10, b10, c10, d10);
        }
        static has(a10, b10) {
          return Reflect.has(a10, b10);
        }
        static deleteProperty(a10, b10) {
          return Reflect.deleteProperty(a10, b10);
        }
      }
      let aF = Symbol("internal response"), aG = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function aH(a10, b10) {
        var c10;
        if (null == a10 || null == (c10 = a10.request) ? void 0 : c10.headers) {
          if (!(a10.request.headers instanceof Headers)) throw Object.defineProperty(Error("request.headers must be an instance of Headers"), "__NEXT_ERROR_CODE", { value: "E119", enumerable: false, configurable: true });
          let c11 = [];
          for (let [d10, e10] of a10.request.headers) b10.set("x-middleware-request-" + d10, e10), c11.push(d10);
          b10.set("x-middleware-override-headers", c11.join(","));
        }
      }
      class aI extends Response {
        constructor(a10, b10 = {}) {
          super(a10, b10);
          const c10 = this.headers, d10 = new Proxy(new aB.ResponseCookies(c10), { get(a11, d11, e10) {
            switch (d11) {
              case "delete":
              case "set":
                return (...e11) => {
                  let f2 = Reflect.apply(a11[d11], a11, e11), g2 = new Headers(c10);
                  return f2 instanceof aB.ResponseCookies && c10.set("x-middleware-set-cookie", f2.getAll().map((a12) => (0, aB.stringifyCookie)(a12)).join(",")), aH(b10, g2), f2;
                };
              default:
                return aE.get(a11, d11, e10);
            }
          } });
          this[aF] = { cookies: d10, url: b10.url ? new aA(b10.url, { headers: aj(c10), nextConfig: b10.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[aF].cookies;
        }
        static json(a10, b10) {
          let c10 = Response.json(a10, b10);
          return new aI(c10.body, c10);
        }
        static redirect(a10, b10) {
          let c10 = "number" == typeof b10 ? b10 : (null == b10 ? void 0 : b10.status) ?? 307;
          if (!aG.has(c10)) throw Object.defineProperty(RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", { value: "E529", enumerable: false, configurable: true });
          let d10 = "object" == typeof b10 ? b10 : {}, e10 = new Headers(null == d10 ? void 0 : d10.headers);
          return e10.set("Location", ak(a10)), new aI(null, { ...d10, headers: e10, status: c10 });
        }
        static rewrite(a10, b10) {
          let c10 = new Headers(null == b10 ? void 0 : b10.headers);
          return c10.set("x-middleware-rewrite", ak(a10)), aH(b10, c10), new aI(null, { ...b10, headers: c10 });
        }
        static next(a10) {
          let b10 = new Headers(null == a10 ? void 0 : a10.headers);
          return b10.set("x-middleware-next", "1"), aH(a10, b10), new aI(null, { ...a10, headers: b10 });
        }
      }
      function aJ(a10, b10) {
        let c10 = "string" == typeof b10 ? new URL(b10) : b10, d10 = new URL(a10, b10), e10 = d10.origin === c10.origin;
        return { url: e10 ? d10.toString().slice(c10.origin.length) : d10.toString(), isRelative: e10 };
      }
      let aK = "next-router-prefetch", aL = ["rsc", "next-router-state-tree", aK, "next-hmr-refresh", "next-router-segment-prefetch"], aM = "_rsc";
      function aN(a10) {
        return a10.startsWith("/") ? a10 : `/${a10}`;
      }
      function aO(a10) {
        return aN(a10.split("/").reduce((a11, b10, c10, d10) => b10 ? "(" === b10[0] && b10.endsWith(")") || "@" === b10[0] || ("page" === b10 || "route" === b10) && c10 === d10.length - 1 ? a11 : `${a11}/${b10}` : a11, ""));
      }
      class aP extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new aP();
        }
      }
      class aQ extends Headers {
        constructor(a10) {
          super(), this.headers = new Proxy(a10, { get(b10, c10, d10) {
            if ("symbol" == typeof c10) return aE.get(b10, c10, d10);
            let e10 = c10.toLowerCase(), f2 = Object.keys(a10).find((a11) => a11.toLowerCase() === e10);
            if (void 0 !== f2) return aE.get(b10, f2, d10);
          }, set(b10, c10, d10, e10) {
            if ("symbol" == typeof c10) return aE.set(b10, c10, d10, e10);
            let f2 = c10.toLowerCase(), g2 = Object.keys(a10).find((a11) => a11.toLowerCase() === f2);
            return aE.set(b10, g2 ?? c10, d10, e10);
          }, has(b10, c10) {
            if ("symbol" == typeof c10) return aE.has(b10, c10);
            let d10 = c10.toLowerCase(), e10 = Object.keys(a10).find((a11) => a11.toLowerCase() === d10);
            return void 0 !== e10 && aE.has(b10, e10);
          }, deleteProperty(b10, c10) {
            if ("symbol" == typeof c10) return aE.deleteProperty(b10, c10);
            let d10 = c10.toLowerCase(), e10 = Object.keys(a10).find((a11) => a11.toLowerCase() === d10);
            return void 0 === e10 || aE.deleteProperty(b10, e10);
          } });
        }
        static seal(a10) {
          return new Proxy(a10, { get(a11, b10, c10) {
            switch (b10) {
              case "append":
              case "delete":
              case "set":
                return aP.callable;
              default:
                return aE.get(a11, b10, c10);
            }
          } });
        }
        merge(a10) {
          return Array.isArray(a10) ? a10.join(", ") : a10;
        }
        static from(a10) {
          return a10 instanceof Headers ? a10 : new aQ(a10);
        }
        append(a10, b10) {
          let c10 = this.headers[a10];
          "string" == typeof c10 ? this.headers[a10] = [c10, b10] : Array.isArray(c10) ? c10.push(b10) : this.headers[a10] = b10;
        }
        delete(a10) {
          delete this.headers[a10];
        }
        get(a10) {
          let b10 = this.headers[a10];
          return void 0 !== b10 ? this.merge(b10) : null;
        }
        has(a10) {
          return void 0 !== this.headers[a10];
        }
        set(a10, b10) {
          this.headers[a10] = b10;
        }
        forEach(a10, b10) {
          for (let [c10, d10] of this.entries()) a10.call(b10, d10, c10, this);
        }
        *entries() {
          for (let a10 of Object.keys(this.headers)) {
            let b10 = a10.toLowerCase(), c10 = this.get(b10);
            yield [b10, c10];
          }
        }
        *keys() {
          for (let a10 of Object.keys(this.headers)) {
            let b10 = a10.toLowerCase();
            yield b10;
          }
        }
        *values() {
          for (let a10 of Object.keys(this.headers)) {
            let b10 = this.get(a10);
            yield b10;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      let aR = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class aS {
        disable() {
          throw aR;
        }
        getStore() {
        }
        run() {
          throw aR;
        }
        exit() {
          throw aR;
        }
        enterWith() {
          throw aR;
        }
        static bind(a10) {
          return a10;
        }
      }
      let aT = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
      function aU() {
        return aT ? new aT() : new aS();
      }
      let aV = aU();
      class aW extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options");
        }
        static callable() {
          throw new aW();
        }
      }
      class aX {
        static seal(a10) {
          return new Proxy(a10, { get(a11, b10, c10) {
            switch (b10) {
              case "clear":
              case "delete":
              case "set":
                return aW.callable;
              default:
                return aE.get(a11, b10, c10);
            }
          } });
        }
      }
      let aY = Symbol.for("next.mutated.cookies");
      class aZ {
        static wrap(a10, b10) {
          let c10 = new aB.ResponseCookies(new Headers());
          for (let b11 of a10.getAll()) c10.set(b11);
          let d10 = [], e10 = /* @__PURE__ */ new Set(), f2 = () => {
            let a11 = aV.getStore();
            if (a11 && (a11.pathWasRevalidated = 1), d10 = c10.getAll().filter((a12) => e10.has(a12.name)), b10) {
              let a12 = [];
              for (let b11 of d10) {
                let c11 = new aB.ResponseCookies(new Headers());
                c11.set(b11), a12.push(c11.toString());
              }
              b10(a12);
            }
          }, g2 = new Proxy(c10, { get(a11, b11, c11) {
            switch (b11) {
              case aY:
                return d10;
              case "delete":
                return function(...b12) {
                  e10.add("string" == typeof b12[0] ? b12[0] : b12[0].name);
                  try {
                    return a11.delete(...b12), g2;
                  } finally {
                    f2();
                  }
                };
              case "set":
                return function(...b12) {
                  e10.add("string" == typeof b12[0] ? b12[0] : b12[0].name);
                  try {
                    return a11.set(...b12), g2;
                  } finally {
                    f2();
                  }
                };
              default:
                return aE.get(a11, b11, c11);
            }
          } });
          return g2;
        }
      }
      function a$(a10, b10) {
        if ("action" !== a10.phase) throw new aW();
      }
      var a_ = ((g = a_ || {}).handleRequest = "BaseServer.handleRequest", g.run = "BaseServer.run", g.pipe = "BaseServer.pipe", g.getStaticHTML = "BaseServer.getStaticHTML", g.render = "BaseServer.render", g.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", g.renderToResponse = "BaseServer.renderToResponse", g.renderToHTML = "BaseServer.renderToHTML", g.renderError = "BaseServer.renderError", g.renderErrorToResponse = "BaseServer.renderErrorToResponse", g.renderErrorToHTML = "BaseServer.renderErrorToHTML", g.render404 = "BaseServer.render404", g), a0 = ((h = a0 || {}).loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", h.loadComponents = "LoadComponents.loadComponents", h), a1 = ((i = a1 || {}).getRequestHandler = "NextServer.getRequestHandler", i.getRequestHandlerWithMetadata = "NextServer.getRequestHandlerWithMetadata", i.getServer = "NextServer.getServer", i.getServerRequestHandler = "NextServer.getServerRequestHandler", i.createServer = "createServer.createServer", i), a2 = ((j = a2 || {}).compression = "NextNodeServer.compression", j.getBuildId = "NextNodeServer.getBuildId", j.createComponentTree = "NextNodeServer.createComponentTree", j.clientComponentLoading = "NextNodeServer.clientComponentLoading", j.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", j.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", j.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", j.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", j.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", j.sendRenderResult = "NextNodeServer.sendRenderResult", j.proxyRequest = "NextNodeServer.proxyRequest", j.runApi = "NextNodeServer.runApi", j.render = "NextNodeServer.render", j.renderHTML = "NextNodeServer.renderHTML", j.imageOptimizer = "NextNodeServer.imageOptimizer", j.getPagePath = "NextNodeServer.getPagePath", j.getRoutesManifest = "NextNodeServer.getRoutesManifest", j.findPageComponents = "NextNodeServer.findPageComponents", j.getFontManifest = "NextNodeServer.getFontManifest", j.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", j.getRequestHandler = "NextNodeServer.getRequestHandler", j.renderToHTML = "NextNodeServer.renderToHTML", j.renderError = "NextNodeServer.renderError", j.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", j.render404 = "NextNodeServer.render404", j.startResponse = "NextNodeServer.startResponse", j.route = "route", j.onProxyReq = "onProxyReq", j.apiResolver = "apiResolver", j.internalFetch = "internalFetch", j), a3 = ((k = a3 || {}).startServer = "startServer.startServer", k), a4 = ((l = a4 || {}).getServerSideProps = "Render.getServerSideProps", l.getStaticProps = "Render.getStaticProps", l.renderToString = "Render.renderToString", l.renderDocument = "Render.renderDocument", l.createBodyResult = "Render.createBodyResult", l), a5 = ((m = a5 || {}).renderToString = "AppRender.renderToString", m.renderToReadableStream = "AppRender.renderToReadableStream", m.getBodyResult = "AppRender.getBodyResult", m.fetch = "AppRender.fetch", m), a6 = ((n = a6 || {}).executeRoute = "Router.executeRoute", n), a7 = ((o = a7 || {}).runHandler = "Node.runHandler", o), a8 = ((p = a8 || {}).runHandler = "AppRouteRouteHandlers.runHandler", p), a9 = ((q = a9 || {}).generateMetadata = "ResolveMetadata.generateMetadata", q.generateViewport = "ResolveMetadata.generateViewport", q), ba = ((r = ba || {}).execute = "Middleware.execute", r);
      let bb = /* @__PURE__ */ new Set(["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"]), bc = /* @__PURE__ */ new Set(["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"]);
      function bd(a10) {
        return null !== a10 && "object" == typeof a10 && "then" in a10 && "function" == typeof a10.then;
      }
      let be = process.env.NEXT_OTEL_PERFORMANCE_PREFIX, { context: bf, propagation: bg, trace: bh, SpanStatusCode: bi, SpanKind: bj, ROOT_CONTEXT: bk } = d = c(446);
      class bl extends Error {
        constructor(a10, b10) {
          super(), this.bubble = a10, this.result = b10;
        }
      }
      let bm = (a10, b10) => {
        "object" == typeof b10 && null !== b10 && b10 instanceof bl && b10.bubble ? a10.setAttribute("next.bubble", true) : (b10 && (a10.recordException(b10), a10.setAttribute("error.type", b10.name)), a10.setStatus({ code: bi.ERROR, message: null == b10 ? void 0 : b10.message })), a10.end();
      }, bn = /* @__PURE__ */ new Map(), bo = d.createContextKey("next.rootSpanId"), bp = 0, bq = { set(a10, b10, c10) {
        a10.push({ key: b10, value: c10 });
      } };
      class br {
        getTracerInstance() {
          return bh.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return bf;
        }
        getTracePropagationData() {
          let a10 = bf.active(), b10 = [];
          return bg.inject(a10, b10, bq), b10;
        }
        getActiveScopeSpan() {
          return bh.getSpan(null == bf ? void 0 : bf.active());
        }
        withPropagatedContext(a10, b10, c10, d10 = false) {
          let e10 = bf.active();
          if (d10) {
            let d11 = bg.extract(bk, a10, c10);
            if (bh.getSpanContext(d11)) return bf.with(d11, b10);
            let f3 = bg.extract(e10, a10, c10);
            return bf.with(f3, b10);
          }
          if (bh.getSpanContext(e10)) return b10();
          let f2 = bg.extract(e10, a10, c10);
          return bf.with(f2, b10);
        }
        trace(...a10) {
          let [b10, c10, d10] = a10, { fn: e10, options: f2 } = "function" == typeof c10 ? { fn: c10, options: {} } : { fn: d10, options: { ...c10 } }, g2 = f2.spanName ?? b10;
          if (!bb.has(b10) && "1" !== process.env.NEXT_OTEL_VERBOSE || f2.hideSpan) return e10();
          let h2 = this.getSpanContext((null == f2 ? void 0 : f2.parentSpan) ?? this.getActiveScopeSpan());
          h2 || (h2 = (null == bf ? void 0 : bf.active()) ?? bk);
          let i2 = h2.getValue(bo), j2 = "number" != typeof i2 || !bn.has(i2), k2 = bp++;
          return f2.attributes = { "next.span_name": g2, "next.span_type": b10, ...f2.attributes }, bf.with(h2.setValue(bo, k2), () => this.getTracerInstance().startActiveSpan(g2, f2, (a11) => {
            let c11;
            be && b10 && bc.has(b10) && (c11 = "performance" in globalThis && "measure" in performance ? globalThis.performance.now() : void 0);
            let d11 = false, g3 = () => {
              !d11 && (d11 = true, bn.delete(k2), c11 && performance.measure(`${be}:next-${(b10.split(".").pop() || "").replace(/[A-Z]/g, (a12) => "-" + a12.toLowerCase())}`, { start: c11, end: performance.now() }));
            };
            if (j2 && bn.set(k2, new Map(Object.entries(f2.attributes ?? {}))), e10.length > 1) try {
              return e10(a11, (b11) => bm(a11, b11));
            } catch (b11) {
              throw bm(a11, b11), b11;
            } finally {
              g3();
            }
            try {
              let b11 = e10(a11);
              if (bd(b11)) return b11.then((b12) => (a11.end(), b12)).catch((b12) => {
                throw bm(a11, b12), b12;
              }).finally(g3);
              return a11.end(), g3(), b11;
            } catch (b11) {
              throw bm(a11, b11), g3(), b11;
            }
          }));
        }
        wrap(...a10) {
          let b10 = this, [c10, d10, e10] = 3 === a10.length ? a10 : [a10[0], {}, a10[1]];
          return bb.has(c10) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let a11 = d10;
            "function" == typeof a11 && "function" == typeof e10 && (a11 = a11.apply(this, arguments));
            let f2 = arguments.length - 1, g2 = arguments[f2];
            if ("function" != typeof g2) return b10.trace(c10, a11, () => e10.apply(this, arguments));
            {
              let d11 = b10.getContext().bind(bf.active(), g2);
              return b10.trace(c10, a11, (a12, b11) => (arguments[f2] = function(a13) {
                return null == b11 || b11(a13), d11.apply(this, arguments);
              }, e10.apply(this, arguments)));
            }
          } : e10;
        }
        startSpan(...a10) {
          let [b10, c10] = a10, d10 = this.getSpanContext((null == c10 ? void 0 : c10.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(b10, c10, d10);
        }
        getSpanContext(a10) {
          return a10 ? bh.setSpan(bf.active(), a10) : void 0;
        }
        getRootSpanAttributes() {
          let a10 = bf.active().getValue(bo);
          return bn.get(a10);
        }
        setRootSpanAttribute(a10, b10) {
          let c10 = bf.active().getValue(bo), d10 = bn.get(c10);
          d10 && !d10.has(a10) && d10.set(a10, b10);
        }
        withSpan(a10, b10) {
          let c10 = bh.setSpan(bf.active(), a10);
          return bf.with(c10, b10);
        }
      }
      let bs = (f = new br(), () => f), bt = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(bt);
      class bu {
        constructor(a10, b10, c10, d10) {
          var e10;
          const f2 = a10 && function(a11, b11) {
            let c11 = aQ.from(a11.headers);
            return { isOnDemandRevalidate: c11.get(ac) === b11.previewModeId, revalidateOnlyGenerated: c11.has("x-prerender-revalidate-if-generated") };
          }(b10, a10).isOnDemandRevalidate, g2 = null == (e10 = c10.get(bt)) ? void 0 : e10.value;
          this._isEnabled = !!(!f2 && g2 && a10 && g2 === a10.previewModeId), this._previewModeId = null == a10 ? void 0 : a10.previewModeId, this._mutableCookies = d10;
        }
        get isEnabled() {
          return this._isEnabled;
        }
        enable() {
          if (!this._previewModeId) throw Object.defineProperty(Error("Invariant: previewProps missing previewModeId this should never happen"), "__NEXT_ERROR_CODE", { value: "E93", enumerable: false, configurable: true });
          this._mutableCookies.set({ name: bt, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" }), this._isEnabled = true;
        }
        disable() {
          this._mutableCookies.set({ name: bt, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) }), this._isEnabled = false;
        }
      }
      function bv(a10, b10) {
        if ("x-middleware-set-cookie" in a10.headers && "string" == typeof a10.headers["x-middleware-set-cookie"]) {
          let c10 = a10.headers["x-middleware-set-cookie"], d10 = new Headers();
          for (let a11 of ai(c10)) d10.append("set-cookie", a11);
          for (let a11 of new aB.ResponseCookies(d10).getAll()) b10.set(a11);
        }
      }
      let bw = aU();
      function bx(a10) {
        switch (a10.type) {
          case "prerender":
          case "prerender-runtime":
          case "prerender-ppr":
          case "prerender-client":
          case "validation-client":
            return a10.prerenderResumeDataCache;
          case "request":
            if (a10.prerenderResumeDataCache) return a10.prerenderResumeDataCache;
          case "prerender-legacy":
          case "cache":
          case "private-cache":
          case "unstable-cache":
          case "generate-static-params":
            return null;
          default:
            return a10;
        }
      }
      var by = c(232), bz = c.n(by);
      class bA extends Error {
        constructor(a10, b10) {
          super(`Invariant: ${a10.endsWith(".") ? a10 : a10 + "."} This is a bug in Next.js.`, b10), this.name = "InvariantError";
        }
      }
      class bB {
        constructor(a10, b10, c10) {
          this.prev = null, this.next = null, this.key = a10, this.data = b10, this.size = c10;
        }
      }
      class bC {
        constructor() {
          this.prev = null, this.next = null;
        }
      }
      class bD {
        constructor(a10, b10, c10) {
          this.cache = /* @__PURE__ */ new Map(), this.totalSize = 0, this.maxSize = a10, this.calculateSize = b10, this.onEvict = c10, this.head = new bC(), this.tail = new bC(), this.head.next = this.tail, this.tail.prev = this.head;
        }
        addToHead(a10) {
          a10.prev = this.head, a10.next = this.head.next, this.head.next.prev = a10, this.head.next = a10;
        }
        removeNode(a10) {
          a10.prev.next = a10.next, a10.next.prev = a10.prev;
        }
        moveToHead(a10) {
          this.removeNode(a10), this.addToHead(a10);
        }
        removeTail() {
          let a10 = this.tail.prev;
          return this.removeNode(a10), a10;
        }
        set(a10, b10) {
          let c10 = (null == this.calculateSize ? void 0 : this.calculateSize.call(this, b10)) ?? 1;
          if (c10 <= 0) throw Object.defineProperty(Error(`LRUCache: calculateSize returned ${c10}, but size must be > 0. Items with size 0 would never be evicted, causing unbounded cache growth.`), "__NEXT_ERROR_CODE", { value: "E1045", enumerable: false, configurable: true });
          if (c10 > this.maxSize) return console.warn("Single item size exceeds maxSize"), false;
          let d10 = this.cache.get(a10);
          if (d10) d10.data = b10, this.totalSize = this.totalSize - d10.size + c10, d10.size = c10, this.moveToHead(d10);
          else {
            let d11 = new bB(a10, b10, c10);
            this.cache.set(a10, d11), this.addToHead(d11), this.totalSize += c10;
          }
          for (; this.totalSize > this.maxSize && this.cache.size > 0; ) {
            let a11 = this.removeTail();
            this.cache.delete(a11.key), this.totalSize -= a11.size, null == this.onEvict || this.onEvict.call(this, a11.key, a11.data);
          }
          return true;
        }
        has(a10) {
          return this.cache.has(a10);
        }
        get(a10) {
          let b10 = this.cache.get(a10);
          if (b10) return this.moveToHead(b10), b10.data;
        }
        *[Symbol.iterator]() {
          let a10 = this.head.next;
          for (; a10 && a10 !== this.tail; ) {
            let b10 = a10;
            yield [b10.key, b10.data], a10 = a10.next;
          }
        }
        remove(a10) {
          let b10 = this.cache.get(a10);
          b10 && (this.removeNode(b10), this.cache.delete(a10), this.totalSize -= b10.size);
        }
        get size() {
          return this.cache.size;
        }
        get currentSize() {
          return this.totalSize;
        }
      }
      let bE = /* @__PURE__ */ new Map(), bF = (a10, b10) => {
        for (let c10 of a10) {
          let a11 = bE.get(c10), d10 = null == a11 ? void 0 : a11.expired;
          if ("number" == typeof d10 && d10 <= Date.now() && d10 > b10) return true;
        }
        return false;
      }, bG = (a10, b10) => {
        for (let c10 of a10) {
          let a11 = bE.get(c10), d10 = (null == a11 ? void 0 : a11.stale) ?? 0;
          if ("number" == typeof d10 && d10 > b10) return true;
        }
        return false;
      };
      c(356).Buffer, process.env.NEXT_PRIVATE_DEBUG_CACHE, Symbol.for("@next/cache-handlers");
      let bH = Symbol.for("@next/cache-handlers-map"), bI = Symbol.for("@next/cache-handlers-set"), bJ = globalThis;
      function bK() {
        if (bJ[bH]) return bJ[bH].entries();
      }
      async function bL(a10, b10) {
        if (!a10) return b10();
        let c10 = bM(a10);
        try {
          return await b10();
        } finally {
          var d10, e10, f2, g2;
          let b11, h2, i2, j2, k2 = (d10 = c10, e10 = bM(a10), b11 = new Set(d10.pendingRevalidatedTags.map((a11) => {
            let b12 = "object" == typeof a11.profile ? JSON.stringify(a11.profile) : a11.profile || "";
            return `${a11.tag}:${b12}`;
          })), h2 = new Set(d10.pendingRevalidateWrites), { pendingRevalidatedTags: e10.pendingRevalidatedTags.filter((a11) => {
            let c11 = "object" == typeof a11.profile ? JSON.stringify(a11.profile) : a11.profile || "";
            return !b11.has(`${a11.tag}:${c11}`);
          }), pendingRevalidates: Object.fromEntries(Object.entries(e10.pendingRevalidates).filter(([a11]) => !(a11 in d10.pendingRevalidates))), pendingRevalidateWrites: e10.pendingRevalidateWrites.filter((a11) => !h2.has(a11)) });
          await (f2 = a10, i2 = [], (j2 = (null == (g2 = k2) ? void 0 : g2.pendingRevalidatedTags) ?? f2.pendingRevalidatedTags ?? []).length > 0 && i2.push(bN(j2, f2.incrementalCache, f2)), i2.push(...Object.values((null == g2 ? void 0 : g2.pendingRevalidates) ?? f2.pendingRevalidates ?? {})), i2.push(...(null == g2 ? void 0 : g2.pendingRevalidateWrites) ?? f2.pendingRevalidateWrites ?? []), 0 !== i2.length && Promise.all(i2).then(() => void 0));
        }
      }
      function bM(a10) {
        return { pendingRevalidatedTags: a10.pendingRevalidatedTags ? [...a10.pendingRevalidatedTags] : [], pendingRevalidates: { ...a10.pendingRevalidates }, pendingRevalidateWrites: a10.pendingRevalidateWrites ? [...a10.pendingRevalidateWrites] : [] };
      }
      async function bN(a10, b10, c10) {
        if (0 === a10.length) return;
        let d10 = function() {
          if (bJ[bI]) return bJ[bI].values();
        }(), e10 = [], f2 = /* @__PURE__ */ new Map();
        for (let b11 of a10) {
          let a11, c11 = b11.profile;
          for (let [b12] of f2) if ("string" == typeof b12 && "string" == typeof c11 && b12 === c11 || "object" == typeof b12 && "object" == typeof c11 && JSON.stringify(b12) === JSON.stringify(c11) || b12 === c11) {
            a11 = b12;
            break;
          }
          let d11 = a11 || c11;
          f2.has(d11) || f2.set(d11, []), f2.get(d11).push(b11.tag);
        }
        for (let [a11, h2] of f2) {
          let f3;
          if (a11) {
            let b11;
            if ("object" == typeof a11) b11 = a11;
            else if ("string" == typeof a11) {
              var g2;
              if (!(b11 = null == c10 || null == (g2 = c10.cacheLifeProfiles) ? void 0 : g2[a11])) throw Object.defineProperty(Error(`Invalid profile provided "${a11}" must be configured under cacheLife in next.config or be "max"`), "__NEXT_ERROR_CODE", { value: "E873", enumerable: false, configurable: true });
            }
            b11 && (f3 = { expire: b11.expire });
          }
          for (let b11 of d10 || []) a11 ? e10.push(null == b11.updateTags ? void 0 : b11.updateTags.call(b11, h2, f3)) : e10.push(null == b11.updateTags ? void 0 : b11.updateTags.call(b11, h2));
          b10 && e10.push(b10.revalidateTag(h2, f3));
        }
        await Promise.all(e10);
      }
      let bO = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class bP {
        disable() {
          throw bO;
        }
        getStore() {
        }
        run() {
          throw bO;
        }
        exit() {
          throw bO;
        }
        enterWith() {
          throw bO;
        }
        static bind(a10) {
          return a10;
        }
      }
      let bQ = "u" > typeof globalThis && globalThis.AsyncLocalStorage, bR = bQ ? new bQ() : new bP();
      class bS {
        constructor({ waitUntil: a10, onClose: b10, onTaskError: c10 }) {
          this.workUnitStores = /* @__PURE__ */ new Set(), this.waitUntil = a10, this.onClose = b10, this.onTaskError = c10, this.callbackQueue = new (bz())(), this.callbackQueue.pause();
        }
        after(a10) {
          if (bd(a10)) this.waitUntil || bT(), this.waitUntil(a10.catch((a11) => this.reportTaskError("promise", a11)));
          else if ("function" == typeof a10) this.addCallback(a10);
          else throw Object.defineProperty(Error("`after()`: Argument must be a promise or a function"), "__NEXT_ERROR_CODE", { value: "E50", enumerable: false, configurable: true });
        }
        addCallback(a10) {
          var b10;
          this.waitUntil || bT();
          let c10 = bw.getStore();
          c10 && this.workUnitStores.add(c10);
          let d10 = bR.getStore(), e10 = d10 ? d10.rootTaskSpawnPhase : null == c10 ? void 0 : c10.phase;
          this.runCallbacksOnClosePromise || (this.runCallbacksOnClosePromise = this.runCallbacksOnClose(), this.waitUntil(this.runCallbacksOnClosePromise));
          let f2 = (b10 = async () => {
            try {
              await bR.run({ rootTaskSpawnPhase: e10 }, () => a10());
            } catch (a11) {
              this.reportTaskError("function", a11);
            }
          }, bQ ? bQ.bind(b10) : bP.bind(b10));
          this.callbackQueue.add(f2);
        }
        async runCallbacksOnClose() {
          return await new Promise((a10) => this.onClose(a10)), this.runCallbacks();
        }
        async runCallbacks() {
          if (0 === this.callbackQueue.size) return;
          for (let a11 of this.workUnitStores) a11.phase = "after";
          let a10 = aV.getStore();
          if (!a10) throw Object.defineProperty(new bA("Missing workStore in AfterContext.runCallbacks"), "__NEXT_ERROR_CODE", { value: "E547", enumerable: false, configurable: true });
          return bL(a10, () => (this.callbackQueue.start(), this.callbackQueue.onIdle()));
        }
        reportTaskError(a10, b10) {
          if (console.error("promise" === a10 ? "A promise passed to `after()` rejected:" : "An error occurred in a function passed to `after()`:", b10), this.onTaskError) try {
            null == this.onTaskError || this.onTaskError.call(this, b10);
          } catch (a11) {
            console.error(Object.defineProperty(new bA("`onTaskError` threw while handling an error thrown from an `after` task", { cause: a11 }), "__NEXT_ERROR_CODE", { value: "E569", enumerable: false, configurable: true }));
          }
        }
      }
      function bT() {
        throw Object.defineProperty(Error("`after()` will not work correctly, because `waitUntil` is not available in the current environment."), "__NEXT_ERROR_CODE", { value: "E91", enumerable: false, configurable: true });
      }
      function bU(a10) {
        let b10, c10 = { then: (d10, e10) => (b10 || (b10 = Promise.resolve(a10())), b10.then((a11) => {
          c10.value = a11;
        }).catch(() => {
        }), b10.then(d10, e10)) };
        return c10;
      }
      class bV {
        onClose(a10) {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot subscribe to a closed CloseController"), "__NEXT_ERROR_CODE", { value: "E365", enumerable: false, configurable: true });
          this.target.addEventListener("close", a10), this.listeners++;
        }
        dispatchClose() {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot close a CloseController multiple times"), "__NEXT_ERROR_CODE", { value: "E229", enumerable: false, configurable: true });
          this.listeners > 0 && this.target.dispatchEvent(new Event("close")), this.isClosed = true;
        }
        constructor() {
          this.target = new EventTarget(), this.listeners = 0, this.isClosed = false;
        }
      }
      function bW() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID || "", previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      let bX = Symbol.for("@next/request-context");
      async function bY(a10, b10, c10) {
        let d10 = /* @__PURE__ */ new Set();
        for (let b11 of ((a11) => {
          let b12 = ["/layout"];
          if (a11.startsWith("/")) {
            let c11 = a11.split("/");
            for (let a12 = 1; a12 < c11.length + 1; a12++) {
              let d11 = c11.slice(0, a12).join("/");
              d11 && (d11.endsWith("/page") || d11.endsWith("/route") || (d11 = `${d11}${!d11.endsWith("/") ? "/" : ""}layout`), b12.push(d11));
            }
          }
          return b12;
        })(a10)) b11 = `${ag}${b11}`, d10.add(b11);
        if (b10 && (!c10 || 0 === c10.size)) {
          let a11 = `${ag}${b10}`;
          d10.add(a11);
        }
        d10.has(`${ag}/`) && d10.add(`${ag}/index`), d10.has(`${ag}/index`) && d10.add(`${ag}/`);
        let e10 = Array.from(d10);
        return { tags: e10, expirationsByCacheKind: function(a11) {
          let b11 = /* @__PURE__ */ new Map(), c11 = bK();
          if (c11) for (let [d11, e11] of c11) "getExpiration" in e11 && b11.set(d11, bU(async () => e11.getExpiration(a11)));
          return b11;
        }(e10) };
      }
      let bZ = Symbol.for("NextInternalRequestMeta");
      class b$ extends aD {
        constructor(a10) {
          super(a10.input, a10.init), this.sourcePage = a10.page;
        }
        get request() {
          throw Object.defineProperty(new _({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new _({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        waitUntil() {
          throw Object.defineProperty(new _({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      let b_ = { keys: (a10) => Array.from(a10.keys()), get: (a10, b10) => a10.get(b10) ?? void 0 }, b0 = (a10, b10) => bs().withPropagatedContext(a10.headers, b10, b_), b1 = false;
      async function b2(a10) {
        var b10, d10, e10, f2, g2;
        let h2, i2, j2, k2, l2;
        !function() {
          if (!b1 && (b1 = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
            let { interceptTestApis: a11, wrapRequestHandler: b11 } = c(987);
            a11(), b0 = b11(b0);
          }
        }(), await Z();
        let m2 = void 0 !== globalThis.__BUILD_MANIFEST;
        a10.request.url = a10.request.url.replace(/\.rsc($|\?)/, "$1");
        let n2 = a10.bypassNextUrl ? new URL(a10.request.url) : new aA(a10.request.url, { headers: a10.request.headers, nextConfig: a10.request.nextConfig });
        for (let a11 of [...n2.searchParams.keys()]) {
          let b11 = n2.searchParams.getAll(a11), c10 = function(a12) {
            for (let b12 of ["nxtP", "nxtI"]) if (a12 !== b12 && a12.startsWith(b12)) return a12.substring(b12.length);
            return null;
          }(a11);
          if (c10) {
            for (let a12 of (n2.searchParams.delete(c10), b11)) n2.searchParams.append(c10, a12);
            n2.searchParams.delete(a11);
          }
        }
        let o2 = process.env.__NEXT_BUILD_ID || "";
        "buildId" in n2 && (o2 = n2.buildId || "", n2.buildId = "");
        let p2 = function(a11) {
          let b11 = new Headers();
          for (let [c10, d11] of Object.entries(a11)) for (let a12 of Array.isArray(d11) ? d11 : [d11]) void 0 !== a12 && ("number" == typeof a12 && (a12 = a12.toString()), b11.append(c10, a12));
          return b11;
        }(a10.request.headers), q2 = p2.has("x-nextjs-data"), r2 = "1" === p2.get("rsc");
        q2 && "/index" === n2.pathname && (n2.pathname = "/");
        let s2 = /* @__PURE__ */ new Map();
        if (!m2) for (let a11 of aL) {
          let b11 = p2.get(a11);
          null !== b11 && (s2.set(a11, b11), p2.delete(a11));
        }
        let t2 = n2.searchParams.get(aM), u2 = new b$({ page: a10.page, input: ((k2 = (j2 = "string" == typeof n2) ? new URL(n2) : n2).searchParams.delete(aM), j2 ? k2.toString() : k2).toString(), init: { body: a10.request.body, headers: p2, method: a10.request.method, nextConfig: a10.request.nextConfig, signal: a10.request.signal } });
        a10.request.requestMeta && (g2 = a10.request.requestMeta, u2[bZ] = g2), q2 && Object.defineProperty(u2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCacheShared && a10.IncrementalCache && (globalThis.__incrementalCache = new a10.IncrementalCache({ CurCacheHandler: a10.incrementalCacheHandler, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: a10.request.headers, getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: bW() }) }));
        let v2 = a10.request.waitUntil ?? (null == (b10 = null == (l2 = globalThis[bX]) ? void 0 : l2.get()) ? void 0 : b10.waitUntil), w2 = new ap({ request: u2, page: a10.page, context: v2 ? { waitUntil: v2 } : void 0 });
        if ((h2 = await b0(u2, () => {
          if ("/middleware" === a10.page || "/src/middleware" === a10.page || "/proxy" === a10.page || "/src/proxy" === a10.page) {
            let b11 = w2.waitUntil.bind(w2), c10 = new bV();
            return bs().trace(ba.execute, { spanName: `middleware ${u2.method}`, attributes: { "http.target": u2.nextUrl.pathname, "http.method": u2.method } }, async () => {
              try {
                var d11, e11, f3, g3, h3, j3;
                let k3 = bW(), l3 = await bY("/", u2.nextUrl.pathname, null), m3 = (h3 = u2.nextUrl, j3 = (a11) => {
                  i2 = a11;
                }, function(a11, b12, c11, d12, e12, f4, g4, h4, i3, j4) {
                  function k4(a12) {
                    c11 && c11.setHeader("Set-Cookie", a12);
                  }
                  let l4 = {};
                  return { type: "request", phase: a11, implicitTags: f4, url: { pathname: d12.pathname, search: d12.search ?? "" }, rootParams: e12, get headers() {
                    return l4.headers || (l4.headers = function(a12) {
                      let b13 = aQ.from(a12);
                      for (let a13 of aL) b13.delete(a13);
                      return aQ.seal(b13);
                    }(b12.headers)), l4.headers;
                  }, get cookies() {
                    if (!l4.cookies) {
                      let a12 = new aB.RequestCookies(aQ.from(b12.headers));
                      bv(b12, a12), l4.cookies = aX.seal(a12);
                    }
                    return l4.cookies;
                  }, set cookies(value) {
                    l4.cookies = value;
                  }, get mutableCookies() {
                    if (!l4.mutableCookies) {
                      var m4, n4;
                      let a12, d13 = (m4 = b12.headers, n4 = g4 || (c11 ? k4 : void 0), a12 = new aB.RequestCookies(aQ.from(m4)), aZ.wrap(a12, n4));
                      bv(b12, d13), l4.mutableCookies = d13;
                    }
                    return l4.mutableCookies;
                  }, get userspaceMutableCookies() {
                    if (!l4.userspaceMutableCookies) {
                      var o3;
                      let a12;
                      o3 = this, l4.userspaceMutableCookies = a12 = new Proxy(o3.mutableCookies, { get(b13, c12, d13) {
                        switch (c12) {
                          case "delete":
                            return function(...c13) {
                              return a$(o3, "cookies().delete"), b13.delete(...c13), a12;
                            };
                          case "set":
                            return function(...c13) {
                              return a$(o3, "cookies().set"), b13.set(...c13), a12;
                            };
                          default:
                            return aE.get(b13, c12, d13);
                        }
                      } });
                    }
                    return l4.userspaceMutableCookies;
                  }, get draftMode() {
                    return l4.draftMode || (l4.draftMode = new bu(h4, b12, this.cookies, this.mutableCookies)), l4.draftMode;
                  }, renderResumeDataCache: null, isHmrRefresh: i3, serverComponentsHmrCache: j4 || globalThis.__serverComponentsHmrCache, fallbackParams: null };
                }("action", u2, void 0, h3, {}, l3, j3, k3, false, void 0)), n3 = function({ page: a11, renderOpts: b12, isPrefetchRequest: c11, buildId: d12, previouslyRevalidatedTags: e12, nonce: f4 }) {
                  let g4 = !b12.shouldWaitOnAllReady && !b12.supportsDynamicResponse && !b12.isDraftMode && !b12.isPossibleServerAction, h4 = g4 && (!!process.env.NEXT_DEBUG_BUILD || "1" === process.env.NEXT_SSG_FETCH_METRICS), i3 = { isStaticGeneration: g4, page: a11, route: aO(a11), incrementalCache: b12.incrementalCache || globalThis.__incrementalCache, cacheLifeProfiles: b12.cacheLifeProfiles, isBuildTimePrerendering: b12.isBuildTimePrerendering, fetchCache: b12.fetchCache, isOnDemandRevalidate: b12.isOnDemandRevalidate, isDraftMode: b12.isDraftMode, isPrefetchRequest: c11, buildId: d12, reactLoadableManifest: (null == b12 ? void 0 : b12.reactLoadableManifest) || {}, assetPrefix: (null == b12 ? void 0 : b12.assetPrefix) || "", nonce: f4, afterContext: function(a12) {
                    let { waitUntil: b13, onClose: c12, onAfterTaskError: d13 } = a12;
                    return new bS({ waitUntil: b13, onClose: c12, onTaskError: d13 });
                  }(b12), cacheComponentsEnabled: b12.cacheComponents, previouslyRevalidatedTags: e12, refreshTagsByCacheKind: function() {
                    let a12 = /* @__PURE__ */ new Map(), b13 = bK();
                    if (b13) for (let [c12, d13] of b13) "refreshTags" in d13 && a12.set(c12, bU(async () => d13.refreshTags()));
                    return a12;
                  }(), runInCleanSnapshot: bQ ? bQ.snapshot() : function(a12, ...b13) {
                    return a12(...b13);
                  }, shouldTrackFetchMetrics: h4, reactServerErrorsByDigest: /* @__PURE__ */ new Map() };
                  return b12.store = i3, i3;
                }({ page: "/", renderOpts: { cacheLifeProfiles: null == (e11 = a10.request.nextConfig) || null == (d11 = e11.experimental) ? void 0 : d11.cacheLife, cacheComponents: false, experimental: { isRoutePPREnabled: false, authInterrupts: !!(null == (g3 = a10.request.nextConfig) || null == (f3 = g3.experimental) ? void 0 : f3.authInterrupts) }, supportsDynamicResponse: true, waitUntil: b11, onClose: c10.onClose.bind(c10), onAfterTaskError: void 0 }, isPrefetchRequest: "1" === u2.headers.get(aK), buildId: o2 ?? "", previouslyRevalidatedTags: [] });
                return await aV.run(n3, () => bw.run(m3, a10.handler, u2, w2));
              } finally {
                setTimeout(() => {
                  c10.dispatchClose();
                }, 0);
              }
            });
          }
          return a10.handler(u2, w2);
        })) && !(h2 instanceof Response)) throw Object.defineProperty(TypeError("Expected an instance of Response to be returned"), "__NEXT_ERROR_CODE", { value: "E567", enumerable: false, configurable: true });
        h2 && i2 && h2.headers.set("set-cookie", i2);
        let x2 = null == h2 ? void 0 : h2.headers.get("x-middleware-rewrite");
        if (h2 && x2 && (r2 || !m2)) {
          let b11 = new aA(x2, { forceLocale: true, headers: a10.request.headers, nextConfig: a10.request.nextConfig });
          m2 || b11.host !== u2.nextUrl.host || (b11.buildId = o2 || b11.buildId, h2.headers.set("x-middleware-rewrite", String(b11)));
          let { url: c10, isRelative: g3 } = aJ(b11.toString(), n2.toString());
          !m2 && q2 && h2.headers.set("x-nextjs-rewrite", c10);
          let i3 = !g3 && (null == (f2 = a10.request.nextConfig) || null == (e10 = f2.experimental) || null == (d10 = e10.clientParamParsingOrigins) ? void 0 : d10.some((a11) => new RegExp(a11).test(b11.origin)));
          r2 && (g3 || i3) && (n2.pathname !== b11.pathname && h2.headers.set("x-nextjs-rewritten-path", b11.pathname), n2.search !== b11.search && h2.headers.set("x-nextjs-rewritten-query", b11.search.slice(1)));
        }
        if (h2 && x2 && r2 && t2) {
          let a11 = new URL(x2);
          a11.searchParams.has(aM) || (a11.searchParams.set(aM, t2), h2.headers.set("x-middleware-rewrite", a11.toString()));
        }
        let y2 = null == h2 ? void 0 : h2.headers.get("Location");
        if (h2 && y2 && !m2) {
          let b11 = new aA(y2, { forceLocale: false, headers: a10.request.headers, nextConfig: a10.request.nextConfig });
          h2 = new Response(h2.body, h2), b11.host === n2.host && (b11.buildId = o2 || b11.buildId, h2.headers.set("Location", aJ(b11, n2).url)), q2 && (h2.headers.delete("Location"), h2.headers.set("x-nextjs-redirect", aJ(b11.toString(), n2.toString()).url));
        }
        let z2 = h2 || aI.next(), A2 = z2.headers.get("x-middleware-override-headers"), B2 = [];
        if (A2) {
          for (let [a11, b11] of s2) z2.headers.set(`x-middleware-request-${a11}`, b11), B2.push(a11);
          B2.length > 0 && z2.headers.set("x-middleware-override-headers", A2 + "," + B2.join(","));
        }
        return { response: z2, waitUntil: ("internal" === w2[an].kind ? Promise.all(w2[an].promises).then(() => {
        }) : void 0) ?? Promise.resolve(), fetchMetrics: u2.fetchMetrics };
      }
      let { env: b3, stdout: b4 } = (null == (F = globalThis) ? void 0 : F.process) ?? {}, b5 = b3 && !b3.NO_COLOR && (b3.FORCE_COLOR || (null == b4 ? void 0 : b4.isTTY) && !b3.CI && "dumb" !== b3.TERM), b6 = (a10, b10, c10, d10) => {
        let e10 = a10.substring(0, d10) + c10, f2 = a10.substring(d10 + b10.length), g2 = f2.indexOf(b10);
        return ~g2 ? e10 + b6(f2, b10, c10, g2) : e10 + f2;
      }, b7 = (a10, b10, c10 = a10) => b5 ? (d10) => {
        let e10 = "" + d10, f2 = e10.indexOf(b10, a10.length);
        return ~f2 ? a10 + b6(e10, b10, c10, f2) + b10 : a10 + e10 + b10;
      } : String, b8 = b7("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m");
      b7("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"), b7("\x1B[3m", "\x1B[23m"), b7("\x1B[4m", "\x1B[24m"), b7("\x1B[7m", "\x1B[27m"), b7("\x1B[8m", "\x1B[28m"), b7("\x1B[9m", "\x1B[29m"), b7("\x1B[30m", "\x1B[39m");
      let b9 = b7("\x1B[31m", "\x1B[39m"), ca = b7("\x1B[32m", "\x1B[39m"), cb = b7("\x1B[33m", "\x1B[39m");
      b7("\x1B[34m", "\x1B[39m");
      let cc = b7("\x1B[35m", "\x1B[39m");
      b7("\x1B[38;2;173;127;168m", "\x1B[39m"), b7("\x1B[36m", "\x1B[39m");
      let cd = b7("\x1B[37m", "\x1B[39m");
      b7("\x1B[90m", "\x1B[39m"), b7("\x1B[40m", "\x1B[49m"), b7("\x1B[41m", "\x1B[49m"), b7("\x1B[42m", "\x1B[49m"), b7("\x1B[43m", "\x1B[49m"), b7("\x1B[44m", "\x1B[49m"), b7("\x1B[45m", "\x1B[49m"), b7("\x1B[46m", "\x1B[49m"), b7("\x1B[47m", "\x1B[49m"), cd(b8("\u25CB")), b9(b8("\u2A2F")), cb(b8("\u26A0")), cd(b8(" ")), ca(b8("\u2713")), cc(b8("\xBB")), new bD(1e4, (a10) => a10.length), new bD(1e4, (a10) => a10.length);
      var ce = ((s = {}).APP_PAGE = "APP_PAGE", s.APP_ROUTE = "APP_ROUTE", s.PAGES = "PAGES", s.FETCH = "FETCH", s.REDIRECT = "REDIRECT", s.IMAGE = "IMAGE", s), cf = ((t = {}).APP_PAGE = "APP_PAGE", t.APP_ROUTE = "APP_ROUTE", t.PAGES = "PAGES", t.FETCH = "FETCH", t.IMAGE = "IMAGE", t);
      function cg() {
      }
      new Uint8Array([60, 104, 116, 109, 108]), new Uint8Array([60, 104, 101, 97, 100]), new Uint8Array([60, 98, 111, 100, 121]), new Uint8Array([60, 47, 104, 101, 97, 100, 62]), new Uint8Array([60, 47, 98, 111, 100, 121, 62]), new Uint8Array([60, 47, 104, 116, 109, 108, 62]), new Uint8Array([60, 47, 98, 111, 100, 121, 62, 60, 47, 104, 116, 109, 108, 62]), new Uint8Array([60, 109, 101, 116, 97, 32, 110, 97, 109, 101, 61, 34, 194, 171, 110, 120, 116, 45, 105, 99, 111, 110, 194, 187, 34]), c(356).Buffer, c(356).Buffer;
      let ch = new TextEncoder();
      function ci(a10) {
        return new ReadableStream({ start(b10) {
          b10.enqueue(ch.encode(a10)), b10.close();
        } });
      }
      function cj(a10) {
        return new ReadableStream({ start(b10) {
          b10.enqueue(a10), b10.close();
        } });
      }
      async function ck(a10, b10) {
        let c10 = new TextDecoder("utf-8", { fatal: true }), d10 = "";
        for await (let e10 of a10) {
          if (null == b10 ? void 0 : b10.aborted) return d10;
          d10 += c10.decode(e10, { stream: true });
        }
        return d10 + c10.decode();
      }
      let cl = "ResponseAborted";
      class cm extends Error {
        constructor(...a10) {
          super(...a10), this.name = cl;
        }
      }
      class cn {
        constructor() {
          let a10, b10;
          this.promise = new Promise((c10, d10) => {
            a10 = c10, b10 = d10;
          }), this.resolve = a10, this.reject = b10;
        }
      }
      let co = 0, cp = 0, cq = 0;
      function cr(a10) {
        return (null == a10 ? void 0 : a10.name) === "AbortError" || (null == a10 ? void 0 : a10.name) === cl;
      }
      async function cs(a10, b10, c10) {
        try {
          let d10, { errored: e10, destroyed: f2 } = b10;
          if (e10 || f2) return;
          let g2 = (d10 = new AbortController(), b10.once("close", () => {
            b10.writableFinished || d10.abort(new cm());
          }), d10), h2 = function(a11, b11) {
            let c11 = false, d11 = new cn();
            function e11() {
              d11.resolve();
            }
            a11.on("drain", e11), a11.once("close", () => {
              a11.off("drain", e11), d11.resolve();
            });
            let f3 = new cn();
            return a11.once("finish", () => {
              f3.resolve();
            }), new WritableStream({ write: async (b12) => {
              if (!c11) {
                if (c11 = true, "performance" in globalThis && process.env.NEXT_OTEL_PERFORMANCE_PREFIX) {
                  let a12 = function(a13 = {}) {
                    let b13 = 0 === co ? void 0 : { clientComponentLoadStart: co, clientComponentLoadTimes: cp, clientComponentLoadCount: cq };
                    return a13.reset && (co = 0, cp = 0, cq = 0), b13;
                  }();
                  a12 && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-client-component-loading`, { start: a12.clientComponentLoadStart, end: a12.clientComponentLoadStart + a12.clientComponentLoadTimes });
                }
                a11.flushHeaders(), bs().trace(a2.startResponse, { spanName: "start response" }, () => void 0);
              }
              try {
                let c12 = a11.write(b12);
                "flush" in a11 && "function" == typeof a11.flush && a11.flush(), c12 || (await d11.promise, d11 = new cn());
              } catch (b13) {
                throw a11.end(), Object.defineProperty(Error("failed to write chunk to response", { cause: b13 }), "__NEXT_ERROR_CODE", { value: "E321", enumerable: false, configurable: true });
              }
            }, abort: (b12) => {
              a11.writableFinished || a11.destroy(b12);
            }, close: async () => {
              if (b11 && await b11, !a11.writableFinished) return a11.end(), f3.promise;
            } });
          }(b10, c10);
          await a10.pipeTo(h2, { signal: g2.signal });
        } catch (a11) {
          if (cr(a11)) return;
          throw Object.defineProperty(Error("failed to pipe response", { cause: a11 }), "__NEXT_ERROR_CODE", { value: "E180", enumerable: false, configurable: true });
        }
      }
      var ct = c(356).Buffer;
      class cu {
        static #a = this.EMPTY = new cu(null, { metadata: {}, contentType: null });
        static fromStatic(a10, b10) {
          return new cu(a10, { metadata: {}, contentType: b10 });
        }
        constructor(a10, { contentType: b10, waitUntil: c10, metadata: d10 }) {
          this.response = a10, this.contentType = b10, this.metadata = d10, this.waitUntil = c10;
        }
        assignMetadata(a10) {
          Object.assign(this.metadata, a10);
        }
        get isNull() {
          return null === this.response;
        }
        get isDynamic() {
          return "string" != typeof this.response;
        }
        toUnchunkedString(a10 = false) {
          if (null === this.response) return "";
          if ("string" != typeof this.response) {
            if (!a10) throw Object.defineProperty(new bA("dynamic responses cannot be unchunked. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E732", enumerable: false, configurable: true });
            return ck(this.readable);
          }
          return this.response;
        }
        get readable() {
          return null === this.response ? new ReadableStream({ start(a10) {
            a10.close();
          } }) : "string" == typeof this.response ? ci(this.response) : ct.isBuffer(this.response) ? cj(this.response) : Array.isArray(this.response) ? function(...a10) {
            if (0 === a10.length) return new ReadableStream({ start(a11) {
              a11.close();
            } });
            if (1 === a10.length) return a10[0];
            let { readable: b10, writable: c10 } = new TransformStream(), d10 = a10[0].pipeTo(c10, { preventClose: true }), e10 = 1;
            for (; e10 < a10.length - 1; e10++) {
              let b11 = a10[e10];
              d10 = d10.then(() => b11.pipeTo(c10, { preventClose: true }));
            }
            let f2 = a10[e10];
            return (d10 = d10.then(() => f2.pipeTo(c10))).catch(cg), b10;
          }(...this.response) : this.response;
        }
        coerce() {
          return null === this.response ? [] : "string" == typeof this.response ? [ci(this.response)] : Array.isArray(this.response) ? this.response : ct.isBuffer(this.response) ? [cj(this.response)] : [this.response];
        }
        pipeThrough(a10) {
          this.response = this.readable.pipeThrough(a10);
        }
        unshift(a10) {
          this.response = this.coerce(), this.response.unshift(a10);
        }
        push(a10) {
          this.response = this.coerce(), this.response.push(a10);
        }
        async pipeTo(a10) {
          try {
            await this.readable.pipeTo(a10, { preventClose: true }), this.waitUntil && await this.waitUntil, await a10.close();
          } catch (b10) {
            if (cr(b10)) return void await a10.abort(b10);
            throw b10;
          }
        }
        async pipeToNodeResponse(a10) {
          await cs(this.readable, a10, this.waitUntil);
        }
      }
      function cv(a10, b10) {
        if (!a10) return b10;
        let c10 = parseInt(a10, 10);
        return Number.isFinite(c10) && c10 > 0 ? c10 : b10;
      }
      cv(process.env.NEXT_PRIVATE_RESPONSE_CACHE_TTL, 1e4), cv(process.env.NEXT_PRIVATE_RESPONSE_CACHE_MAX_SIZE, 150);
      var cw = c(654), cx = c.n(cw);
      class cy {
        constructor(a10) {
          this.fs = a10, this.tasks = [];
        }
        findOrCreateTask(a10) {
          for (let b11 of this.tasks) if (b11[0] === a10) return b11;
          let b10 = this.fs.mkdir(a10);
          b10.catch(() => {
          });
          let c10 = [a10, b10, []];
          return this.tasks.push(c10), c10;
        }
        append(a10, b10) {
          let c10 = this.findOrCreateTask(cx().dirname(a10)), d10 = c10[1].then(() => this.fs.writeFile(a10, b10));
          d10.catch(() => {
          }), c10[2].push(d10);
        }
        wait() {
          return Promise.all(this.tasks.flatMap((a10) => a10[2]));
        }
      }
      function cz(a10) {
        return (null == a10 ? void 0 : a10.length) || 0;
      }
      class cA {
        static #a = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor(a10) {
          this.fs = a10.fs, this.flushToDisk = a10.flushToDisk, this.serverDistDir = a10.serverDistDir, this.revalidatedTags = a10.revalidatedTags, a10.maxMemoryCacheSize ? cA.memoryCache ? cA.debug && console.log("FileSystemCache: memory store already initialized") : (cA.debug && console.log("FileSystemCache: using memory store for fetch cache"), cA.memoryCache = function(a11) {
            return e || (e = new bD(a11, function({ value: a12 }) {
              var b10, c10;
              if (!a12) return 25;
              if (a12.kind === ce.REDIRECT) return JSON.stringify(a12.props).length;
              if (a12.kind === ce.IMAGE) throw Object.defineProperty(Error("invariant image should not be incremental-cache"), "__NEXT_ERROR_CODE", { value: "E501", enumerable: false, configurable: true });
              if (a12.kind === ce.FETCH) return JSON.stringify(a12.data || "").length;
              if (a12.kind === ce.APP_ROUTE) return a12.body.length;
              return a12.kind === ce.APP_PAGE ? Math.max(1, a12.html.length + cz(a12.rscData) + ((null == (c10 = a12.postponed) ? void 0 : c10.length) || 0) + function(a13) {
                if (!a13) return 0;
                let b11 = 0;
                for (let [c11, d10] of a13) b11 += c11.length + cz(d10);
                return b11;
              }(a12.segmentData)) : a12.html.length + ((null == (b10 = JSON.stringify(a12.pageData)) ? void 0 : b10.length) || 0);
            })), e;
          }(a10.maxMemoryCacheSize)) : cA.debug && console.log("FileSystemCache: not using memory store for fetch cache");
        }
        resetRequestCache() {
        }
        async revalidateTag(a10, b10) {
          if (a10 = "string" == typeof a10 ? [a10] : a10, cA.debug && console.log("FileSystemCache: revalidateTag", a10, b10), 0 === a10.length) return;
          let c10 = Date.now();
          for (let d10 of a10) {
            let a11 = bE.get(d10) || {};
            if (b10) {
              let e10 = { ...a11 };
              e10.stale = c10, void 0 !== b10.expire && (e10.expired = c10 + 1e3 * b10.expire), bE.set(d10, e10);
            } else bE.set(d10, { ...a11, expired: c10 });
          }
        }
        async get(...a10) {
          var b10, c10, d10, e10, f2, g2;
          let [h2, i2] = a10, { kind: j2 } = i2, k2 = null == (b10 = cA.memoryCache) ? void 0 : b10.get(h2);
          if (cA.debug && (j2 === cf.FETCH ? console.log("FileSystemCache: get", h2, i2.tags, j2, !!k2) : console.log("FileSystemCache: get", h2, j2, !!k2)), (null == k2 || null == (c10 = k2.value) ? void 0 : c10.kind) === ce.APP_PAGE || (null == k2 || null == (d10 = k2.value) ? void 0 : d10.kind) === ce.APP_ROUTE || (null == k2 || null == (e10 = k2.value) ? void 0 : e10.kind) === ce.PAGES) {
            let a11 = null == (g2 = k2.value.headers) ? void 0 : g2[ae];
            if ("string" == typeof a11) {
              let b11 = a11.split(",");
              if (b11.length > 0 && bF(b11, k2.lastModified)) return cA.debug && console.log("FileSystemCache: expired tags", b11), null;
            }
          } else if ((null == k2 || null == (f2 = k2.value) ? void 0 : f2.kind) === ce.FETCH) {
            let a11 = i2.kind === cf.FETCH ? [...i2.tags || [], ...i2.softTags || []] : [];
            if (a11.some((a12) => this.revalidatedTags.includes(a12))) return cA.debug && console.log("FileSystemCache: was revalidated", a11), null;
            if (bF(a11, k2.lastModified)) return cA.debug && console.log("FileSystemCache: expired tags", a11), null;
          }
          return k2 ?? null;
        }
        async set(a10, b10, c10) {
          var d10;
          if (null == (d10 = cA.memoryCache) || d10.set(a10, { value: b10, lastModified: Date.now() }), cA.debug && console.log("FileSystemCache: set", a10), !this.flushToDisk || !b10) return;
          let e10 = new cy(this.fs);
          if (b10.kind === ce.APP_ROUTE) {
            let c11 = this.getFilePath(`${a10}.body`, cf.APP_ROUTE);
            e10.append(c11, b10.body);
            let d11 = { headers: b10.headers, status: b10.status, postponed: void 0, segmentPaths: void 0, prefetchHints: void 0 };
            e10.append(c11.replace(/\.body$/, ad), JSON.stringify(d11, null, 2));
          } else if (b10.kind === ce.PAGES || b10.kind === ce.APP_PAGE) {
            let d11 = b10.kind === ce.APP_PAGE, f2 = this.getFilePath(`${a10}.html`, d11 ? cf.APP_PAGE : cf.PAGES);
            if (e10.append(f2, b10.html), c10.fetchCache || c10.isFallback || c10.isRoutePPREnabled || e10.append(this.getFilePath(`${a10}${d11 ? ".rsc" : ".json"}`, d11 ? cf.APP_PAGE : cf.PAGES), d11 ? b10.rscData : JSON.stringify(b10.pageData)), (null == b10 ? void 0 : b10.kind) === ce.APP_PAGE) {
              let a11;
              if (b10.segmentData) {
                a11 = [];
                let c12 = f2.replace(/\.html$/, ".segments");
                for (let [d12, f3] of b10.segmentData) {
                  a11.push(d12);
                  let b11 = c12 + d12 + ".segment.rsc";
                  e10.append(b11, f3);
                }
              }
              let c11 = { headers: b10.headers, status: b10.status, postponed: b10.postponed, segmentPaths: a11, prefetchHints: void 0 };
              e10.append(f2.replace(/\.html$/, ad), JSON.stringify(c11));
            }
          } else if (b10.kind === ce.FETCH) {
            let d11 = this.getFilePath(a10, cf.FETCH);
            e10.append(d11, JSON.stringify({ ...b10, tags: c10.fetchCache ? c10.tags : [] }));
          }
          await e10.wait();
        }
        getFilePath(a10, b10) {
          switch (b10) {
            case cf.FETCH:
              return cx().join(this.serverDistDir, "..", "cache", "fetch-cache", a10);
            case cf.PAGES:
              return cx().join(this.serverDistDir, "pages", a10);
            case cf.IMAGE:
            case cf.APP_PAGE:
            case cf.APP_ROUTE:
              return cx().join(this.serverDistDir, "app", a10);
            default:
              throw Object.defineProperty(Error(`Unexpected file path kind: ${b10}`), "__NEXT_ERROR_CODE", { value: "E479", enumerable: false, configurable: true });
          }
        }
      }
      let cB = ["(..)(..)", "(.)", "(..)", "(...)"], cC = /\/[^/]*\[[^/]+\][^/]*(?=\/|$)/, cD = /\/\[[^/]+\](?=\/|$)/;
      function cE(a10) {
        return a10.replace(/(?:\/index)?\/?$/, "") || "/";
      }
      "u" > typeof performance && ["mark", "measure", "getEntriesByName"].every((a10) => "function" == typeof performance[a10]);
      class cF {
        static #a = this.cacheControls = /* @__PURE__ */ new Map();
        constructor(a10) {
          this.prerenderManifest = a10;
        }
        get(a10) {
          let b10 = cF.cacheControls.get(a10);
          if (b10) return b10;
          let c10 = this.prerenderManifest.routes[a10];
          if (c10) {
            let { initialRevalidateSeconds: a11, initialExpireSeconds: b11 } = c10;
            if (void 0 !== a11) return { revalidate: a11, expire: b11 };
          }
          let d10 = this.prerenderManifest.dynamicRoutes[a10];
          if (d10) {
            let { fallbackRevalidate: a11, fallbackExpire: b11 } = d10;
            if (void 0 !== a11) return { revalidate: a11, expire: b11 };
          }
        }
        set(a10, b10) {
          cF.cacheControls.set(a10, b10);
        }
        clear() {
          cF.cacheControls.clear();
        }
      }
      c(259);
      class cG {
        static #a = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor({ fs: a10, dev: b10, flushToDisk: c10, minimalMode: d10, serverDistDir: e10, requestHeaders: f2, maxMemoryCacheSize: g2, getPrerenderManifest: h2, fetchCacheKeyPrefix: i2, CurCacheHandler: j2, allowedRevalidateHeaderKeys: k2 }) {
          var l2, m2, n2, o2;
          this.locks = /* @__PURE__ */ new Map(), this.hasCustomCacheHandler = !!j2;
          const p2 = Symbol.for("@next/cache-handlers"), q2 = globalThis;
          if (j2) cG.debug && console.log("IncrementalCache: using custom cache handler", j2.name);
          else {
            const b11 = q2[p2];
            (null == b11 ? void 0 : b11.FetchCache) ? (j2 = b11.FetchCache, cG.debug && console.log("IncrementalCache: using global FetchCache cache handler")) : a10 && e10 && (cG.debug && console.log("IncrementalCache: using filesystem cache handler"), j2 = cA);
          }
          process.env.__NEXT_TEST_MAX_ISR_CACHE && (g2 = parseInt(process.env.__NEXT_TEST_MAX_ISR_CACHE, 10)), this.dev = b10, this.disableForTestmode = "true" === process.env.NEXT_PRIVATE_TEST_PROXY, this.minimalMode = d10, this.requestHeaders = f2, this.allowedRevalidateHeaderKeys = k2, this.prerenderManifest = h2(), this.cacheControls = new cF(this.prerenderManifest), this.fetchCacheKeyPrefix = i2;
          let r2 = [];
          f2[ac] === (null == (m2 = this.prerenderManifest) || null == (l2 = m2.preview) ? void 0 : l2.previewModeId) && (this.isOnDemandRevalidate = true), d10 && (r2 = this.revalidatedTags = function(a11, b11) {
            return "string" == typeof a11[af] && a11["x-next-revalidate-tag-token"] === b11 ? a11[af].split(",") : [];
          }(f2, null == (o2 = this.prerenderManifest) || null == (n2 = o2.preview) ? void 0 : n2.previewModeId)), j2 && (this.cacheHandler = new j2({ dev: b10, fs: a10, flushToDisk: c10, serverDistDir: e10, revalidatedTags: r2, maxMemoryCacheSize: g2, _requestHeaders: f2, fetchCacheKeyPrefix: i2 }));
        }
        calculateRevalidate(a10, b10, c10, d10) {
          if (c10) return Math.floor(performance.timeOrigin + performance.now() - 1e3);
          let e10 = this.cacheControls.get(cE(a10)), f2 = e10 ? e10.revalidate : !d10 && 1;
          return "number" == typeof f2 ? 1e3 * f2 + b10 : f2;
        }
        _getPathname(a10, b10) {
          return b10 ? a10 : /^\/index(\/|$)/.test(a10) && !function(a11, b11 = true) {
            return (void 0 !== a11.split("/").find((a12) => cB.find((b12) => a12.startsWith(b12))) && (a11 = function(a12) {
              let b12, c10, d10;
              for (let e10 of a12.split("/")) if (c10 = cB.find((a13) => e10.startsWith(a13))) {
                [b12, d10] = a12.split(c10, 2);
                break;
              }
              if (!b12 || !c10 || !d10) throw Object.defineProperty(Error(`Invalid interception route: ${a12}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`), "__NEXT_ERROR_CODE", { value: "E269", enumerable: false, configurable: true });
              switch (b12 = aO(b12), c10) {
                case "(.)":
                  d10 = "/" === b12 ? `/${d10}` : b12 + "/" + d10;
                  break;
                case "(..)":
                  if ("/" === b12) throw Object.defineProperty(Error(`Invalid interception route: ${a12}. Cannot use (..) marker at the root level, use (.) instead.`), "__NEXT_ERROR_CODE", { value: "E207", enumerable: false, configurable: true });
                  d10 = b12.split("/").slice(0, -1).concat(d10).join("/");
                  break;
                case "(...)":
                  d10 = "/" + d10;
                  break;
                case "(..)(..)":
                  let e10 = b12.split("/");
                  if (e10.length <= 2) throw Object.defineProperty(Error(`Invalid interception route: ${a12}. Cannot use (..)(..) marker at the root level or one level up.`), "__NEXT_ERROR_CODE", { value: "E486", enumerable: false, configurable: true });
                  d10 = e10.slice(0, -2).concat(d10).join("/");
                  break;
                default:
                  throw Object.defineProperty(Error("Invariant: unexpected marker"), "__NEXT_ERROR_CODE", { value: "E112", enumerable: false, configurable: true });
              }
              return { interceptingRoute: b12, interceptedRoute: d10 };
            }(a11).interceptedRoute), b11) ? cD.test(a11) : cC.test(a11);
          }(a10) ? `/index${a10}` : "/" === a10 ? "/index" : aN(a10);
        }
        resetRequestCache() {
          var a10, b10;
          null == (b10 = this.cacheHandler) || null == (a10 = b10.resetRequestCache) || a10.call(b10);
        }
        async lock(a10) {
          for (; ; ) {
            let b11 = this.locks.get(a10);
            if (cG.debug && console.log("IncrementalCache: lock get", a10, !!b11), !b11) break;
            await b11;
          }
          let { resolve: b10, promise: c10 } = new cn();
          return cG.debug && console.log("IncrementalCache: successfully locked", a10), this.locks.set(a10, c10), () => {
            b10(), this.locks.delete(a10);
          };
        }
        async revalidateTag(a10, b10) {
          var c10;
          return null == (c10 = this.cacheHandler) ? void 0 : c10.revalidateTag(a10, b10);
        }
        async generateCacheKey(a10, b10 = {}) {
          let c10 = [], d10 = new TextEncoder(), e10 = new TextDecoder();
          if (b10.body) if (b10.body instanceof Uint8Array) c10.push(e10.decode(b10.body)), b10._ogBody = b10.body;
          else if ("function" == typeof b10.body.getReader) {
            let a11 = b10.body, f3 = [];
            try {
              await a11.pipeTo(new WritableStream({ write(a12) {
                "string" == typeof a12 ? (f3.push(d10.encode(a12)), c10.push(a12)) : (f3.push(a12), c10.push(e10.decode(a12, { stream: true })));
              } })), c10.push(e10.decode());
              let g3 = f3.reduce((a12, b11) => a12 + b11.length, 0), h3 = new Uint8Array(g3), i2 = 0;
              for (let a12 of f3) h3.set(a12, i2), i2 += a12.length;
              b10._ogBody = h3;
            } catch (a12) {
              console.error("Problem reading body", a12);
            }
          } else if ("function" == typeof b10.body.keys) {
            let a11 = b10.body;
            for (let d11 of (b10._ogBody = b10.body, /* @__PURE__ */ new Set([...a11.keys()]))) {
              let b11 = a11.getAll(d11);
              c10.push(`${d11}=${(await Promise.all(b11.map(async (a12) => "string" == typeof a12 ? a12 : await a12.text()))).join(",")}`);
            }
          } else if ("function" == typeof b10.body.arrayBuffer) {
            let a11 = b10.body, d11 = await a11.arrayBuffer();
            c10.push(await a11.text()), b10._ogBody = new Blob([d11], { type: a11.type });
          } else "string" == typeof b10.body && (c10.push(b10.body), b10._ogBody = b10.body);
          let f2 = "function" == typeof (b10.headers || {}).keys ? Object.fromEntries(b10.headers) : Object.assign({}, b10.headers);
          "traceparent" in f2 && delete f2.traceparent, "tracestate" in f2 && delete f2.tracestate;
          let g2 = JSON.stringify(["v3", this.fetchCacheKeyPrefix || "", a10, b10.method, f2, b10.mode, b10.redirect, b10.credentials, b10.referrer, b10.referrerPolicy, b10.integrity, b10.cache, c10]);
          {
            var h2;
            let a11 = d10.encode(g2);
            return h2 = await crypto.subtle.digest("SHA-256", a11), Array.prototype.map.call(new Uint8Array(h2), (a12) => a12.toString(16).padStart(2, "0")).join("");
          }
        }
        async get(a10, b10) {
          var c10, d10, e10, f2, g2, h2, i2;
          let j2, k2;
          if (b10.kind === cf.FETCH) {
            let c11 = bw.getStore(), d11 = c11 ? function(a11) {
              switch (a11.type) {
                case "request":
                case "prerender":
                case "prerender-runtime":
                case "prerender-client":
                case "validation-client":
                  if (a11.renderResumeDataCache) return a11.renderResumeDataCache;
                case "prerender-ppr":
                  return a11.prerenderResumeDataCache ?? null;
                case "cache":
                case "private-cache":
                case "unstable-cache":
                case "prerender-legacy":
                case "generate-static-params":
                  return null;
                default:
                  return a11;
              }
            }(c11) : null;
            if (d11) {
              let c12 = d11.fetch.get(a10);
              if ((null == c12 ? void 0 : c12.kind) === ce.FETCH) {
                let d12 = aV.getStore();
                if (![...b10.tags || [], ...b10.softTags || []].some((a11) => {
                  var b11, c13;
                  return (null == (b11 = this.revalidatedTags) ? void 0 : b11.includes(a11)) || (null == d12 || null == (c13 = d12.pendingRevalidatedTags) ? void 0 : c13.some((b12) => b12.tag === a11));
                })) return cG.debug && console.log("IncrementalCache: rdc:hit", a10), { isStale: false, value: c12 };
                cG.debug && console.log("IncrementalCache: rdc:revalidated-tag", a10);
              } else cG.debug && console.log("IncrementalCache: rdc:miss", a10);
            } else cG.debug && console.log("IncrementalCache: rdc:no-resume-data");
          }
          if (this.disableForTestmode || this.dev && (b10.kind !== cf.FETCH || "no-cache" === this.requestHeaders["cache-control"])) return null;
          a10 = this._getPathname(a10, b10.kind === cf.FETCH);
          let l2 = await (null == (c10 = this.cacheHandler) ? void 0 : c10.get(a10, b10));
          if (b10.kind === cf.FETCH) {
            if (!l2) return null;
            if ((null == (e10 = l2.value) ? void 0 : e10.kind) !== ce.FETCH) throw Object.defineProperty(new bA(`Expected cached value for cache key ${JSON.stringify(a10)} to be a "FETCH" kind, got ${JSON.stringify(null == (f2 = l2.value) ? void 0 : f2.kind)} instead.`), "__NEXT_ERROR_CODE", { value: "E653", enumerable: false, configurable: true });
            let c11 = aV.getStore(), d11 = [...b10.tags || [], ...b10.softTags || []];
            if (d11.some((a11) => {
              var b11, d12;
              return (null == (b11 = this.revalidatedTags) ? void 0 : b11.includes(a11)) || (null == c11 || null == (d12 = c11.pendingRevalidatedTags) ? void 0 : d12.some((b12) => b12.tag === a11));
            })) return cG.debug && console.log("IncrementalCache: expired tag", a10), null;
            let g3 = bw.getStore();
            if (g3) {
              let b11 = bx(g3);
              b11 && (cG.debug && console.log("IncrementalCache: rdc:set", a10), b11.fetch.set(a10, l2.value));
            }
            let h3 = b10.revalidate || l2.value.revalidate, i3 = (performance.timeOrigin + performance.now() - (l2.lastModified || 0)) / 1e3 > h3, j3 = l2.value.data;
            return bF(d11, l2.lastModified) ? null : (bG(d11, l2.lastModified) && (i3 = true), { isStale: i3, value: { kind: ce.FETCH, data: j3, revalidate: h3 } });
          }
          if ((null == l2 || null == (d10 = l2.value) ? void 0 : d10.kind) === ce.FETCH) throw Object.defineProperty(new bA(`Expected cached value for cache key ${JSON.stringify(a10)} not to be a ${JSON.stringify(b10.kind)} kind, got "FETCH" instead.`), "__NEXT_ERROR_CODE", { value: "E652", enumerable: false, configurable: true });
          let m2 = null, { isFallback: n2 } = b10, o2 = this.cacheControls.get(cE(a10));
          if ((null == l2 ? void 0 : l2.lastModified) === -1) j2 = -1, k2 = -31536e6;
          else {
            let c11 = performance.timeOrigin + performance.now(), d11 = (null == l2 ? void 0 : l2.lastModified) || c11;
            if (void 0 === (j2 = false !== (k2 = this.calculateRevalidate(a10, d11, this.dev ?? false, b10.isFallback)) && k2 < c11 || void 0) && ((null == l2 || null == (g2 = l2.value) ? void 0 : g2.kind) === ce.APP_PAGE || (null == l2 || null == (h2 = l2.value) ? void 0 : h2.kind) === ce.APP_ROUTE)) {
              let a11 = null == (i2 = l2.value.headers) ? void 0 : i2[ae];
              if ("string" == typeof a11) {
                let b11 = a11.split(",");
                b11.length > 0 && (bF(b11, d11) ? j2 = -1 : bG(b11, d11) && (j2 = true));
              }
            }
          }
          return l2 && (m2 = { isStale: j2, cacheControl: o2, revalidateAfter: k2, value: l2.value, isFallback: n2 }), !l2 && this.prerenderManifest.notFoundRoutes.includes(a10) && (m2 = { isStale: j2, value: null, cacheControl: o2, revalidateAfter: k2, isFallback: n2 }, this.set(a10, m2.value, { ...b10, cacheControl: o2 })), m2;
        }
        async set(a10, b10, c10) {
          if ((null == b10 ? void 0 : b10.kind) === ce.FETCH) {
            let c11 = bw.getStore(), d11 = c11 ? bx(c11) : null;
            d11 && (cG.debug && console.log("IncrementalCache: rdc:set", a10), d11.fetch.set(a10, b10));
          }
          if (this.disableForTestmode || this.dev && !c10.fetchCache) return;
          a10 = this._getPathname(a10, c10.fetchCache);
          let d10 = JSON.stringify(b10).length;
          if (c10.fetchCache && d10 > 2097152 && !this.hasCustomCacheHandler && !c10.isImplicitBuildTimeCache) {
            let b11 = `Failed to set Next.js data cache for ${c10.fetchUrl || a10}, items over 2MB can not be cached (${d10} bytes)`;
            if (this.dev) throw Object.defineProperty(Error(b11), "__NEXT_ERROR_CODE", { value: "E1003", enumerable: false, configurable: true });
            console.warn(b11);
            return;
          }
          try {
            var e10;
            !c10.fetchCache && c10.cacheControl && this.cacheControls.set(cE(a10), c10.cacheControl), await (null == (e10 = this.cacheHandler) ? void 0 : e10.set(a10, b10, c10));
          } catch (b11) {
            console.warn("Failed to update prerender cache for", a10, b11);
          }
        }
      }
      c(712);
      var cH = c(284);
      class cI extends Error {
        constructor(a10, b10 = "FunctionsError", c10) {
          super(a10), this.name = b10, this.context = c10;
        }
      }
      class cJ extends cI {
        constructor(a10) {
          super("Failed to send a request to the Edge Function", "FunctionsFetchError", a10);
        }
      }
      class cK extends cI {
        constructor(a10) {
          super("Relay Error invoking the Edge Function", "FunctionsRelayError", a10);
        }
      }
      class cL extends cI {
        constructor(a10) {
          super("Edge Function returned a non-2xx status code", "FunctionsHttpError", a10);
        }
      }
      (u = G || (G = {})).Any = "any", u.ApNortheast1 = "ap-northeast-1", u.ApNortheast2 = "ap-northeast-2", u.ApSouth1 = "ap-south-1", u.ApSoutheast1 = "ap-southeast-1", u.ApSoutheast2 = "ap-southeast-2", u.CaCentral1 = "ca-central-1", u.EuCentral1 = "eu-central-1", u.EuWest1 = "eu-west-1", u.EuWest2 = "eu-west-2", u.EuWest3 = "eu-west-3", u.SaEast1 = "sa-east-1", u.UsEast1 = "us-east-1", u.UsWest1 = "us-west-1", u.UsWest2 = "us-west-2";
      class cM {
        constructor(a10, { headers: b10 = {}, customFetch: c10, region: d10 = G.Any } = {}) {
          this.url = a10, this.headers = b10, this.region = d10, this.fetch = /* @__PURE__ */ ((a11) => a11 ? (...b11) => a11(...b11) : (...a12) => fetch(...a12))(c10);
        }
        setAuth(a10) {
          this.headers.Authorization = `Bearer ${a10}`;
        }
        invoke(a10) {
          return (0, cH.__awaiter)(this, arguments, void 0, function* (a11, b10 = {}) {
            var c10;
            let d10, e10;
            try {
              let f2, { headers: g2, method: h2, body: i2, signal: j2, timeout: k2 } = b10, l2 = {}, { region: m2 } = b10;
              m2 || (m2 = this.region);
              let n2 = new URL(`${this.url}/${a11}`);
              m2 && "any" !== m2 && (l2["x-region"] = m2, n2.searchParams.set("forceFunctionRegion", m2)), i2 && (g2 && !Object.prototype.hasOwnProperty.call(g2, "Content-Type") || !g2) ? "u" > typeof Blob && i2 instanceof Blob || i2 instanceof ArrayBuffer ? (l2["Content-Type"] = "application/octet-stream", f2 = i2) : "string" == typeof i2 ? (l2["Content-Type"] = "text/plain", f2 = i2) : "u" > typeof FormData && i2 instanceof FormData ? f2 = i2 : (l2["Content-Type"] = "application/json", f2 = JSON.stringify(i2)) : f2 = i2;
              let o2 = j2;
              k2 && (e10 = new AbortController(), d10 = setTimeout(() => e10.abort(), k2), j2 ? (o2 = e10.signal, j2.addEventListener("abort", () => e10.abort())) : o2 = e10.signal);
              let p2 = yield this.fetch(n2.toString(), { method: h2 || "POST", headers: Object.assign(Object.assign(Object.assign({}, l2), this.headers), g2), body: f2, signal: o2 }).catch((a12) => {
                throw new cJ(a12);
              }), q2 = p2.headers.get("x-relay-error");
              if (q2 && "true" === q2) throw new cK(p2);
              if (!p2.ok) throw new cL(p2);
              let r2 = (null != (c10 = p2.headers.get("Content-Type")) ? c10 : "text/plain").split(";")[0].trim();
              return { data: "application/json" === r2 ? yield p2.json() : "application/octet-stream" === r2 || "application/pdf" === r2 ? yield p2.blob() : "text/event-stream" === r2 ? p2 : "multipart/form-data" === r2 ? yield p2.formData() : yield p2.text(), error: null, response: p2 };
            } catch (a12) {
              return { data: null, error: a12, response: a12 instanceof cL || a12 instanceof cK ? a12.context : void 0 };
            } finally {
              d10 && clearTimeout(d10);
            }
          });
        }
      }
      var cN = c(269), cO = c.t(cN, 2);
      let { PostgrestClient: cP, PostgrestQueryBuilder: cQ, PostgrestFilterBuilder: cR, PostgrestTransformBuilder: cS, PostgrestBuilder: cT, PostgrestError: cU } = cN || cO;
      class cV {
        static detectEnvironment() {
          var a10;
          if ("u" > typeof WebSocket) return { type: "native", constructor: WebSocket };
          if ("u" > typeof globalThis && void 0 !== globalThis.WebSocket) return { type: "native", constructor: globalThis.WebSocket };
          if (void 0 !== c.g && void 0 !== c.g.WebSocket) return { type: "native", constructor: c.g.WebSocket };
          if ("u" > typeof globalThis && void 0 !== globalThis.WebSocketPair && void 0 === globalThis.WebSocket) return { type: "cloudflare", error: "Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.", workaround: "Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime." };
          if ("u" > typeof globalThis && globalThis.EdgeRuntime || "u" > typeof navigator && (null == (a10 = navigator.userAgent) ? void 0 : a10.includes("Vercel-Edge"))) return { type: "unsupported", error: "Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.", workaround: "Use serverless functions or a different deployment target for WebSocket functionality." };
          if ("u" > typeof process) {
            let a11 = process.versions;
            if (a11 && a11.node) {
              let b10 = parseInt(a11.node.replace(/^v/, "").split(".")[0]);
              return b10 >= 22 ? void 0 !== globalThis.WebSocket ? { type: "native", constructor: globalThis.WebSocket } : { type: "unsupported", error: `Node.js ${b10} detected but native WebSocket not found.`, workaround: "Provide a WebSocket implementation via the transport option." } : { type: "unsupported", error: `Node.js ${b10} detected without native WebSocket support.`, workaround: 'For Node.js < 22, install "ws" package and provide it via the transport option:\nimport ws from "ws"\nnew RealtimeClient(url, { transport: ws })' };
            }
          }
          return { type: "unsupported", error: "Unknown JavaScript runtime without WebSocket support.", workaround: "Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation." };
        }
        static getWebSocketConstructor() {
          let a10 = this.detectEnvironment();
          if (a10.constructor) return a10.constructor;
          let b10 = a10.error || "WebSocket not supported in this environment.";
          throw a10.workaround && (b10 += `

Suggested solution: ${a10.workaround}`), Error(b10);
        }
        static createWebSocket(a10, b10) {
          return new (this.getWebSocketConstructor())(a10, b10);
        }
        static isWebSocketSupported() {
          try {
            let a10 = this.detectEnvironment();
            return "native" === a10.type || "ws" === a10.type;
          } catch (a10) {
            return false;
          }
        }
      }
      let cW = "1.0.0";
      (v = H || (H = {}))[v.connecting = 0] = "connecting", v[v.open = 1] = "open", v[v.closing = 2] = "closing", v[v.closed = 3] = "closed", (w = I || (I = {})).closed = "closed", w.errored = "errored", w.joined = "joined", w.joining = "joining", w.leaving = "leaving", (x = J || (J = {})).close = "phx_close", x.error = "phx_error", x.join = "phx_join", x.reply = "phx_reply", x.leave = "phx_leave", x.access_token = "access_token", (K || (K = {})).websocket = "websocket", (y = L || (L = {})).Connecting = "connecting", y.Open = "open", y.Closing = "closing", y.Closed = "closed";
      class cX {
        constructor() {
          this.HEADER_LENGTH = 1, this.META_LENGTH = 4, this.USER_BROADCAST_PUSH_META_LENGTH = 5, this.KINDS = { push: 0, reply: 1, broadcast: 2, userBroadcastPush: 3, userBroadcast: 4 }, this.BINARY_ENCODING = 0, this.JSON_ENCODING = 1, this.BROADCAST = "broadcast";
        }
        encode(a10, b10) {
          return this._isArrayBuffer(a10.payload) ? b10(this._binaryEncodePush(a10)) : a10.event !== this.BROADCAST || a10.payload instanceof ArrayBuffer || "string" != typeof a10.payload.event ? b10(JSON.stringify([a10.join_ref, a10.ref, a10.topic, a10.event, a10.payload])) : b10(this._binaryEncodeUserBroadcastPush(a10));
        }
        _binaryEncodePush(a10) {
          let { join_ref: b10, ref: c10, event: d10, topic: e10, payload: f2 } = a10, g2 = this.META_LENGTH + b10.length + c10.length + e10.length + d10.length, h2 = new ArrayBuffer(this.HEADER_LENGTH + g2), i2 = new DataView(h2), j2 = 0;
          i2.setUint8(j2++, this.KINDS.push), i2.setUint8(j2++, b10.length), i2.setUint8(j2++, c10.length), i2.setUint8(j2++, e10.length), i2.setUint8(j2++, d10.length), Array.from(b10, (a11) => i2.setUint8(j2++, a11.charCodeAt(0))), Array.from(c10, (a11) => i2.setUint8(j2++, a11.charCodeAt(0))), Array.from(e10, (a11) => i2.setUint8(j2++, a11.charCodeAt(0))), Array.from(d10, (a11) => i2.setUint8(j2++, a11.charCodeAt(0)));
          var k2 = new Uint8Array(h2.byteLength + f2.byteLength);
          return k2.set(new Uint8Array(h2), 0), k2.set(new Uint8Array(f2), h2.byteLength), k2.buffer;
        }
        _binaryEncodeUserBroadcastPush(a10) {
          var b10;
          return this._isArrayBuffer(null == (b10 = a10.payload) ? void 0 : b10.payload) ? this._encodeBinaryUserBroadcastPush(a10) : this._encodeJsonUserBroadcastPush(a10);
        }
        _encodeBinaryUserBroadcastPush(a10) {
          let { join_ref: b10, ref: c10, topic: d10 } = a10, e10 = a10.payload.event, f2 = null != (l2 = null == (k2 = a10.payload) ? void 0 : k2.payload) ? l2 : new ArrayBuffer(0), g2 = this.USER_BROADCAST_PUSH_META_LENGTH + b10.length + c10.length + d10.length + e10.length, h2 = new ArrayBuffer(this.HEADER_LENGTH + g2), i2 = new DataView(h2), j2 = 0;
          i2.setUint8(j2++, this.KINDS.userBroadcastPush), i2.setUint8(j2++, b10.length), i2.setUint8(j2++, c10.length), i2.setUint8(j2++, d10.length), i2.setUint8(j2++, e10.length), i2.setUint8(j2++, this.BINARY_ENCODING), Array.from(b10, (a11) => i2.setUint8(j2++, a11.charCodeAt(0))), Array.from(c10, (a11) => i2.setUint8(j2++, a11.charCodeAt(0))), Array.from(d10, (a11) => i2.setUint8(j2++, a11.charCodeAt(0))), Array.from(e10, (a11) => i2.setUint8(j2++, a11.charCodeAt(0)));
          var k2, l2, m2 = new Uint8Array(h2.byteLength + f2.byteLength);
          return m2.set(new Uint8Array(h2), 0), m2.set(new Uint8Array(f2), h2.byteLength), m2.buffer;
        }
        _encodeJsonUserBroadcastPush(a10) {
          let { join_ref: b10, ref: c10, topic: d10 } = a10, e10 = a10.payload.event, f2 = null != (m2 = null == (l2 = a10.payload) ? void 0 : l2.payload) ? m2 : {}, g2 = new TextEncoder().encode(JSON.stringify(f2)).buffer, h2 = this.USER_BROADCAST_PUSH_META_LENGTH + b10.length + c10.length + d10.length + e10.length, i2 = new ArrayBuffer(this.HEADER_LENGTH + h2), j2 = new DataView(i2), k2 = 0;
          j2.setUint8(k2++, this.KINDS.userBroadcastPush), j2.setUint8(k2++, b10.length), j2.setUint8(k2++, c10.length), j2.setUint8(k2++, d10.length), j2.setUint8(k2++, e10.length), j2.setUint8(k2++, this.JSON_ENCODING), Array.from(b10, (a11) => j2.setUint8(k2++, a11.charCodeAt(0))), Array.from(c10, (a11) => j2.setUint8(k2++, a11.charCodeAt(0))), Array.from(d10, (a11) => j2.setUint8(k2++, a11.charCodeAt(0))), Array.from(e10, (a11) => j2.setUint8(k2++, a11.charCodeAt(0)));
          var l2, m2, n2 = new Uint8Array(i2.byteLength + g2.byteLength);
          return n2.set(new Uint8Array(i2), 0), n2.set(new Uint8Array(g2), i2.byteLength), n2.buffer;
        }
        decode(a10, b10) {
          if (this._isArrayBuffer(a10)) return b10(this._binaryDecode(a10));
          if ("string" == typeof a10) {
            let [c10, d10, e10, f2, g2] = JSON.parse(a10);
            return b10({ join_ref: c10, ref: d10, topic: e10, event: f2, payload: g2 });
          }
          return b10({});
        }
        _binaryDecode(a10) {
          let b10 = new DataView(a10), c10 = b10.getUint8(0), d10 = new TextDecoder();
          switch (c10) {
            case this.KINDS.push:
              return this._decodePush(a10, b10, d10);
            case this.KINDS.reply:
              return this._decodeReply(a10, b10, d10);
            case this.KINDS.broadcast:
              return this._decodeBroadcast(a10, b10, d10);
            case this.KINDS.userBroadcast:
              return this._decodeUserBroadcast(a10, b10, d10);
          }
        }
        _decodePush(a10, b10, c10) {
          let d10 = b10.getUint8(1), e10 = b10.getUint8(2), f2 = b10.getUint8(3), g2 = this.HEADER_LENGTH + this.META_LENGTH - 1, h2 = c10.decode(a10.slice(g2, g2 + d10));
          g2 += d10;
          let i2 = c10.decode(a10.slice(g2, g2 + e10));
          g2 += e10;
          let j2 = c10.decode(a10.slice(g2, g2 + f2));
          return g2 += f2, { join_ref: h2, ref: null, topic: i2, event: j2, payload: JSON.parse(c10.decode(a10.slice(g2, a10.byteLength))) };
        }
        _decodeReply(a10, b10, c10) {
          let d10 = b10.getUint8(1), e10 = b10.getUint8(2), f2 = b10.getUint8(3), g2 = b10.getUint8(4), h2 = this.HEADER_LENGTH + this.META_LENGTH, i2 = c10.decode(a10.slice(h2, h2 + d10));
          h2 += d10;
          let j2 = c10.decode(a10.slice(h2, h2 + e10));
          h2 += e10;
          let k2 = c10.decode(a10.slice(h2, h2 + f2));
          h2 += f2;
          let l2 = c10.decode(a10.slice(h2, h2 + g2));
          h2 += g2;
          let m2 = JSON.parse(c10.decode(a10.slice(h2, a10.byteLength)));
          return { join_ref: i2, ref: j2, topic: k2, event: J.reply, payload: { status: l2, response: m2 } };
        }
        _decodeBroadcast(a10, b10, c10) {
          let d10 = b10.getUint8(1), e10 = b10.getUint8(2), f2 = this.HEADER_LENGTH + 2, g2 = c10.decode(a10.slice(f2, f2 + d10));
          f2 += d10;
          let h2 = c10.decode(a10.slice(f2, f2 + e10));
          return f2 += e10, { join_ref: null, ref: null, topic: g2, event: h2, payload: JSON.parse(c10.decode(a10.slice(f2, a10.byteLength))) };
        }
        _decodeUserBroadcast(a10, b10, c10) {
          let d10 = b10.getUint8(1), e10 = b10.getUint8(2), f2 = b10.getUint8(3), g2 = b10.getUint8(4), h2 = this.HEADER_LENGTH + 4, i2 = c10.decode(a10.slice(h2, h2 + d10));
          h2 += d10;
          let j2 = c10.decode(a10.slice(h2, h2 + e10));
          h2 += e10;
          let k2 = c10.decode(a10.slice(h2, h2 + f2));
          h2 += f2;
          let l2 = a10.slice(h2, a10.byteLength), m2 = g2 === this.JSON_ENCODING ? JSON.parse(c10.decode(l2)) : l2, n2 = { type: this.BROADCAST, event: j2, payload: m2 };
          return f2 > 0 && (n2.meta = JSON.parse(k2)), { join_ref: null, ref: null, topic: i2, event: this.BROADCAST, payload: n2 };
        }
        _isArrayBuffer(a10) {
          var b10;
          return a10 instanceof ArrayBuffer || (null == (b10 = null == a10 ? void 0 : a10.constructor) ? void 0 : b10.name) === "ArrayBuffer";
        }
      }
      class cY {
        constructor(a10, b10) {
          this.callback = a10, this.timerCalc = b10, this.timer = void 0, this.tries = 0, this.callback = a10, this.timerCalc = b10;
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
      (z = M || (M = {})).abstime = "abstime", z.bool = "bool", z.date = "date", z.daterange = "daterange", z.float4 = "float4", z.float8 = "float8", z.int2 = "int2", z.int4 = "int4", z.int4range = "int4range", z.int8 = "int8", z.int8range = "int8range", z.json = "json", z.jsonb = "jsonb", z.money = "money", z.numeric = "numeric", z.oid = "oid", z.reltime = "reltime", z.text = "text", z.time = "time", z.timestamp = "timestamp", z.timestamptz = "timestamptz", z.timetz = "timetz", z.tsrange = "tsrange", z.tstzrange = "tstzrange";
      let cZ = (a10, b10, c10 = {}) => {
        var d10;
        let e10 = null != (d10 = c10.skipTypes) ? d10 : [];
        return b10 ? Object.keys(b10).reduce((c11, d11) => (c11[d11] = c$(d11, a10, b10, e10), c11), {}) : {};
      }, c$ = (a10, b10, c10, d10) => {
        let e10 = b10.find((b11) => b11.name === a10), f2 = null == e10 ? void 0 : e10.type, g2 = c10[a10];
        return f2 && !d10.includes(f2) ? c_(f2, g2) : c0(g2);
      }, c_ = (a10, b10) => {
        if ("_" === a10.charAt(0)) return c4(b10, a10.slice(1, a10.length));
        switch (a10) {
          case M.bool:
            return c1(b10);
          case M.float4:
          case M.float8:
          case M.int2:
          case M.int4:
          case M.int8:
          case M.numeric:
          case M.oid:
            return c2(b10);
          case M.json:
          case M.jsonb:
            return c3(b10);
          case M.timestamp:
            return c5(b10);
          case M.abstime:
          case M.date:
          case M.daterange:
          case M.int4range:
          case M.int8range:
          case M.money:
          case M.reltime:
          case M.text:
          case M.time:
          case M.timestamptz:
          case M.timetz:
          case M.tsrange:
          case M.tstzrange:
          default:
            return c0(b10);
        }
      }, c0 = (a10) => a10, c1 = (a10) => {
        switch (a10) {
          case "t":
            return true;
          case "f":
            return false;
          default:
            return a10;
        }
      }, c2 = (a10) => {
        if ("string" == typeof a10) {
          let b10 = parseFloat(a10);
          if (!Number.isNaN(b10)) return b10;
        }
        return a10;
      }, c3 = (a10) => {
        if ("string" == typeof a10) try {
          return JSON.parse(a10);
        } catch (a11) {
          console.log(`JSON parse error: ${a11}`);
        }
        return a10;
      }, c4 = (a10, b10) => {
        if ("string" != typeof a10) return a10;
        let c10 = a10.length - 1, d10 = a10[c10];
        if ("{" === a10[0] && "}" === d10) {
          let d11, e10 = a10.slice(1, c10);
          try {
            d11 = JSON.parse("[" + e10 + "]");
          } catch (a11) {
            d11 = e10 ? e10.split(",") : [];
          }
          return d11.map((a11) => c_(b10, a11));
        }
        return a10;
      }, c5 = (a10) => "string" == typeof a10 ? a10.replace(" ", "T") : a10, c6 = (a10) => {
        let b10 = new URL(a10);
        return b10.protocol = b10.protocol.replace(/^ws/i, "http"), b10.pathname = b10.pathname.replace(/\/+$/, "").replace(/\/socket\/websocket$/i, "").replace(/\/socket$/i, "").replace(/\/websocket$/i, ""), "" === b10.pathname || "/" === b10.pathname ? b10.pathname = "/api/broadcast" : b10.pathname = b10.pathname + "/api/broadcast", b10.href;
      };
      class c7 {
        constructor(a10, b10, c10 = {}, d10 = 1e4) {
          this.channel = a10, this.event = b10, this.payload = c10, this.timeout = d10, this.sent = false, this.timeoutTimer = void 0, this.ref = "", this.receivedResp = null, this.recHooks = [], this.refEvent = null;
        }
        resend(a10) {
          this.timeout = a10, this._cancelRefEvent(), this.ref = "", this.refEvent = null, this.receivedResp = null, this.sent = false, this.send();
        }
        send() {
          this._hasReceived("timeout") || (this.startTimeout(), this.sent = true, this.channel.socket.push({ topic: this.channel.topic, event: this.event, payload: this.payload, ref: this.ref, join_ref: this.channel._joinRef() }));
        }
        updatePayload(a10) {
          this.payload = Object.assign(Object.assign({}, this.payload), a10);
        }
        receive(a10, b10) {
          var c10;
          return this._hasReceived(a10) && b10(null == (c10 = this.receivedResp) ? void 0 : c10.response), this.recHooks.push({ status: a10, callback: b10 }), this;
        }
        startTimeout() {
          if (this.timeoutTimer) return;
          this.ref = this.channel.socket._makeRef(), this.refEvent = this.channel._replyEventName(this.ref);
          let a10 = (a11) => {
            this._cancelRefEvent(), this._cancelTimeout(), this.receivedResp = a11, this._matchReceive(a11);
          };
          this.channel._on(this.refEvent, {}, a10), this.timeoutTimer = setTimeout(() => {
            this.trigger("timeout", {});
          }, this.timeout);
        }
        trigger(a10, b10) {
          this.refEvent && this.channel._trigger(this.refEvent, { status: a10, response: b10 });
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
        _matchReceive({ status: a10, response: b10 }) {
          this.recHooks.filter((b11) => b11.status === a10).forEach((a11) => a11.callback(b10));
        }
        _hasReceived(a10) {
          return this.receivedResp && this.receivedResp.status === a10;
        }
      }
      (A = N || (N = {})).SYNC = "sync", A.JOIN = "join", A.LEAVE = "leave";
      class c8 {
        constructor(a10, b10) {
          this.channel = a10, this.state = {}, this.pendingDiffs = [], this.joinRef = null, this.enabled = false, this.caller = { onJoin: () => {
          }, onLeave: () => {
          }, onSync: () => {
          } };
          const c10 = (null == b10 ? void 0 : b10.events) || { state: "presence_state", diff: "presence_diff" };
          this.channel._on(c10.state, {}, (a11) => {
            let { onJoin: b11, onLeave: c11, onSync: d10 } = this.caller;
            this.joinRef = this.channel._joinRef(), this.state = c8.syncState(this.state, a11, b11, c11), this.pendingDiffs.forEach((a12) => {
              this.state = c8.syncDiff(this.state, a12, b11, c11);
            }), this.pendingDiffs = [], d10();
          }), this.channel._on(c10.diff, {}, (a11) => {
            let { onJoin: b11, onLeave: c11, onSync: d10 } = this.caller;
            this.inPendingSyncState() ? this.pendingDiffs.push(a11) : (this.state = c8.syncDiff(this.state, a11, b11, c11), d10());
          }), this.onJoin((a11, b11, c11) => {
            this.channel._trigger("presence", { event: "join", key: a11, currentPresences: b11, newPresences: c11 });
          }), this.onLeave((a11, b11, c11) => {
            this.channel._trigger("presence", { event: "leave", key: a11, currentPresences: b11, leftPresences: c11 });
          }), this.onSync(() => {
            this.channel._trigger("presence", { event: "sync" });
          });
        }
        static syncState(a10, b10, c10, d10) {
          let e10 = this.cloneDeep(a10), f2 = this.transformState(b10), g2 = {}, h2 = {};
          return this.map(e10, (a11, b11) => {
            f2[a11] || (h2[a11] = b11);
          }), this.map(f2, (a11, b11) => {
            let c11 = e10[a11];
            if (c11) {
              let d11 = b11.map((a12) => a12.presence_ref), e11 = c11.map((a12) => a12.presence_ref), f3 = b11.filter((a12) => 0 > e11.indexOf(a12.presence_ref)), i2 = c11.filter((a12) => 0 > d11.indexOf(a12.presence_ref));
              f3.length > 0 && (g2[a11] = f3), i2.length > 0 && (h2[a11] = i2);
            } else g2[a11] = b11;
          }), this.syncDiff(e10, { joins: g2, leaves: h2 }, c10, d10);
        }
        static syncDiff(a10, b10, c10, d10) {
          let { joins: e10, leaves: f2 } = { joins: this.transformState(b10.joins), leaves: this.transformState(b10.leaves) };
          return c10 || (c10 = () => {
          }), d10 || (d10 = () => {
          }), this.map(e10, (b11, d11) => {
            var e11;
            let f3 = null != (e11 = a10[b11]) ? e11 : [];
            if (a10[b11] = this.cloneDeep(d11), f3.length > 0) {
              let c11 = a10[b11].map((a11) => a11.presence_ref), d12 = f3.filter((a11) => 0 > c11.indexOf(a11.presence_ref));
              a10[b11].unshift(...d12);
            }
            c10(b11, f3, d11);
          }), this.map(f2, (b11, c11) => {
            let e11 = a10[b11];
            if (!e11) return;
            let f3 = c11.map((a11) => a11.presence_ref);
            e11 = e11.filter((a11) => 0 > f3.indexOf(a11.presence_ref)), a10[b11] = e11, d10(b11, e11, c11), 0 === e11.length && delete a10[b11];
          }), a10;
        }
        static map(a10, b10) {
          return Object.getOwnPropertyNames(a10).map((c10) => b10(c10, a10[c10]));
        }
        static transformState(a10) {
          return Object.getOwnPropertyNames(a10 = this.cloneDeep(a10)).reduce((b10, c10) => {
            let d10 = a10[c10];
            return "metas" in d10 ? b10[c10] = d10.metas.map((a11) => (a11.presence_ref = a11.phx_ref, delete a11.phx_ref, delete a11.phx_ref_prev, a11)) : b10[c10] = d10, b10;
          }, {});
        }
        static cloneDeep(a10) {
          return JSON.parse(JSON.stringify(a10));
        }
        onJoin(a10) {
          this.caller.onJoin = a10;
        }
        onLeave(a10) {
          this.caller.onLeave = a10;
        }
        onSync(a10) {
          this.caller.onSync = a10;
        }
        inPendingSyncState() {
          return !this.joinRef || this.joinRef !== this.channel._joinRef();
        }
      }
      (B = O || (O = {})).ALL = "*", B.INSERT = "INSERT", B.UPDATE = "UPDATE", B.DELETE = "DELETE", (C = P || (P = {})).BROADCAST = "broadcast", C.PRESENCE = "presence", C.POSTGRES_CHANGES = "postgres_changes", C.SYSTEM = "system", (D = Q || (Q = {})).SUBSCRIBED = "SUBSCRIBED", D.TIMED_OUT = "TIMED_OUT", D.CLOSED = "CLOSED", D.CHANNEL_ERROR = "CHANNEL_ERROR";
      class c9 {
        constructor(a10, b10 = { config: {} }, c10) {
          var d10, e10;
          if (this.topic = a10, this.params = b10, this.socket = c10, this.bindings = {}, this.state = I.closed, this.joinedOnce = false, this.pushBuffer = [], this.subTopic = a10.replace(/^realtime:/i, ""), this.params.config = Object.assign({ broadcast: { ack: false, self: false }, presence: { key: "", enabled: false }, private: false }, b10.config), this.timeout = this.socket.timeout, this.joinPush = new c7(this, J.join, this.params, this.timeout), this.rejoinTimer = new cY(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs), this.joinPush.receive("ok", () => {
            this.state = I.joined, this.rejoinTimer.reset(), this.pushBuffer.forEach((a11) => a11.send()), this.pushBuffer = [];
          }), this._onClose(() => {
            this.rejoinTimer.reset(), this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`), this.state = I.closed, this.socket._remove(this);
          }), this._onError((a11) => {
            this._isLeaving() || this._isClosed() || (this.socket.log("channel", `error ${this.topic}`, a11), this.state = I.errored, this.rejoinTimer.scheduleTimeout());
          }), this.joinPush.receive("timeout", () => {
            this._isJoining() && (this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout), this.state = I.errored, this.rejoinTimer.scheduleTimeout());
          }), this.joinPush.receive("error", (a11) => {
            this._isLeaving() || this._isClosed() || (this.socket.log("channel", `error ${this.topic}`, a11), this.state = I.errored, this.rejoinTimer.scheduleTimeout());
          }), this._on(J.reply, {}, (a11, b11) => {
            this._trigger(this._replyEventName(b11), a11);
          }), this.presence = new c8(this), this.broadcastEndpointURL = c6(this.socket.endPoint), this.private = this.params.config.private || false, !this.private && (null == (e10 = null == (d10 = this.params.config) ? void 0 : d10.broadcast) ? void 0 : e10.replay)) throw `tried to use replay on public channel '${this.topic}'. It must be a private channel.`;
        }
        subscribe(a10, b10 = this.timeout) {
          var c10, d10, e10;
          if (this.socket.isConnected() || this.socket.connect(), this.state == I.closed) {
            let { config: { broadcast: f2, presence: g2, private: h2 } } = this.params, i2 = null != (d10 = null == (c10 = this.bindings.postgres_changes) ? void 0 : c10.map((a11) => a11.filter)) ? d10 : [], j2 = !!this.bindings[P.PRESENCE] && this.bindings[P.PRESENCE].length > 0 || (null == (e10 = this.params.config.presence) ? void 0 : e10.enabled) === true, k2 = {}, l2 = { broadcast: f2, presence: Object.assign(Object.assign({}, g2), { enabled: j2 }), postgres_changes: i2, private: h2 };
            this.socket.accessTokenValue && (k2.access_token = this.socket.accessTokenValue), this._onError((b11) => null == a10 ? void 0 : a10(Q.CHANNEL_ERROR, b11)), this._onClose(() => null == a10 ? void 0 : a10(Q.CLOSED)), this.updateJoinPayload(Object.assign({ config: l2 }, k2)), this.joinedOnce = true, this._rejoin(b10), this.joinPush.receive("ok", async ({ postgres_changes: b11 }) => {
              var c11;
              if (this.socket.setAuth(), void 0 === b11) {
                null == a10 || a10(Q.SUBSCRIBED);
                return;
              }
              {
                let d11 = this.bindings.postgres_changes, e11 = null != (c11 = null == d11 ? void 0 : d11.length) ? c11 : 0, f3 = [];
                for (let c12 = 0; c12 < e11; c12++) {
                  let e12 = d11[c12], { filter: { event: g3, schema: h3, table: i3, filter: j3 } } = e12, k3 = b11 && b11[c12];
                  if (k3 && k3.event === g3 && k3.schema === h3 && k3.table === i3 && k3.filter === j3) f3.push(Object.assign(Object.assign({}, e12), { id: k3.id }));
                  else {
                    this.unsubscribe(), this.state = I.errored, null == a10 || a10(Q.CHANNEL_ERROR, Error("mismatch between server and client bindings for postgres changes"));
                    return;
                  }
                }
                this.bindings.postgres_changes = f3, a10 && a10(Q.SUBSCRIBED);
                return;
              }
            }).receive("error", (b11) => {
              this.state = I.errored, null == a10 || a10(Q.CHANNEL_ERROR, Error(JSON.stringify(Object.values(b11).join(", ") || "error")));
            }).receive("timeout", () => {
              null == a10 || a10(Q.TIMED_OUT);
            });
          }
          return this;
        }
        presenceState() {
          return this.presence.state;
        }
        async track(a10, b10 = {}) {
          return await this.send({ type: "presence", event: "track", payload: a10 }, b10.timeout || this.timeout);
        }
        async untrack(a10 = {}) {
          return await this.send({ type: "presence", event: "untrack" }, a10);
        }
        on(a10, b10, c10) {
          return this.state === I.joined && a10 === P.PRESENCE && (this.socket.log("channel", `resubscribe to ${this.topic} due to change in presence callbacks on joined channel`), this.unsubscribe().then(() => this.subscribe())), this._on(a10, b10, c10);
        }
        async httpSend(a10, b10, c10 = {}) {
          var d10;
          let e10 = this.socket.accessTokenValue ? `Bearer ${this.socket.accessTokenValue}` : "";
          if (null == b10) return Promise.reject("Payload is required for httpSend()");
          let f2 = { method: "POST", headers: { Authorization: e10, apikey: this.socket.apiKey ? this.socket.apiKey : "", "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ topic: this.subTopic, event: a10, payload: b10, private: this.private }] }) }, g2 = await this._fetchWithTimeout(this.broadcastEndpointURL, f2, null != (d10 = c10.timeout) ? d10 : this.timeout);
          if (202 === g2.status) return { success: true };
          let h2 = g2.statusText;
          try {
            let a11 = await g2.json();
            h2 = a11.error || a11.message || h2;
          } catch (a11) {
          }
          return Promise.reject(Error(h2));
        }
        async send(a10, b10 = {}) {
          var c10, d10;
          if (this._canPush() || "broadcast" !== a10.type) return new Promise((c11) => {
            var d11, e10, f2;
            let g2 = this._push(a10.type, a10, b10.timeout || this.timeout);
            "broadcast" !== a10.type || (null == (f2 = null == (e10 = null == (d11 = this.params) ? void 0 : d11.config) ? void 0 : e10.broadcast) ? void 0 : f2.ack) || c11("ok"), g2.receive("ok", () => c11("ok")), g2.receive("error", () => c11("error")), g2.receive("timeout", () => c11("timed out"));
          });
          {
            console.warn("Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.");
            let { event: e10, payload: f2 } = a10, g2 = { method: "POST", headers: { Authorization: this.socket.accessTokenValue ? `Bearer ${this.socket.accessTokenValue}` : "", apikey: this.socket.apiKey ? this.socket.apiKey : "", "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ topic: this.subTopic, event: e10, payload: f2, private: this.private }] }) };
            try {
              let a11 = await this._fetchWithTimeout(this.broadcastEndpointURL, g2, null != (c10 = b10.timeout) ? c10 : this.timeout);
              return await (null == (d10 = a11.body) ? void 0 : d10.cancel()), a11.ok ? "ok" : "error";
            } catch (a11) {
              if ("AbortError" === a11.name) return "timed out";
              return "error";
            }
          }
        }
        updateJoinPayload(a10) {
          this.joinPush.updatePayload(a10);
        }
        unsubscribe(a10 = this.timeout) {
          this.state = I.leaving;
          let b10 = () => {
            this.socket.log("channel", `leave ${this.topic}`), this._trigger(J.close, "leave", this._joinRef());
          };
          this.joinPush.destroy();
          let c10 = null;
          return new Promise((d10) => {
            (c10 = new c7(this, J.leave, {}, a10)).receive("ok", () => {
              b10(), d10("ok");
            }).receive("timeout", () => {
              b10(), d10("timed out");
            }).receive("error", () => {
              d10("error");
            }), c10.send(), this._canPush() || c10.trigger("ok", {});
          }).finally(() => {
            null == c10 || c10.destroy();
          });
        }
        teardown() {
          this.pushBuffer.forEach((a10) => a10.destroy()), this.pushBuffer = [], this.rejoinTimer.reset(), this.joinPush.destroy(), this.state = I.closed, this.bindings = {};
        }
        async _fetchWithTimeout(a10, b10, c10) {
          let d10 = new AbortController(), e10 = setTimeout(() => d10.abort(), c10), f2 = await this.socket.fetch(a10, Object.assign(Object.assign({}, b10), { signal: d10.signal }));
          return clearTimeout(e10), f2;
        }
        _push(a10, b10, c10 = this.timeout) {
          if (!this.joinedOnce) throw `tried to push '${a10}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
          let d10 = new c7(this, a10, b10, c10);
          return this._canPush() ? d10.send() : this._addToPushBuffer(d10), d10;
        }
        _addToPushBuffer(a10) {
          if (a10.startTimeout(), this.pushBuffer.push(a10), this.pushBuffer.length > 100) {
            let a11 = this.pushBuffer.shift();
            a11 && (a11.destroy(), this.socket.log("channel", `discarded push due to buffer overflow: ${a11.event}`, a11.payload));
          }
        }
        _onMessage(a10, b10, c10) {
          return b10;
        }
        _isMember(a10) {
          return this.topic === a10;
        }
        _joinRef() {
          return this.joinPush.ref;
        }
        _trigger(a10, b10, c10) {
          var d10, e10;
          let f2 = a10.toLocaleLowerCase(), { close: g2, error: h2, leave: i2, join: j2 } = J;
          if (c10 && [g2, h2, i2, j2].indexOf(f2) >= 0 && c10 !== this._joinRef()) return;
          let k2 = this._onMessage(f2, b10, c10);
          if (b10 && !k2) throw "channel onMessage callbacks must return the payload, modified or unmodified";
          ["insert", "update", "delete"].includes(f2) ? null == (d10 = this.bindings.postgres_changes) || d10.filter((a11) => {
            var b11, c11, d11;
            return (null == (b11 = a11.filter) ? void 0 : b11.event) === "*" || (null == (d11 = null == (c11 = a11.filter) ? void 0 : c11.event) ? void 0 : d11.toLocaleLowerCase()) === f2;
          }).map((a11) => a11.callback(k2, c10)) : null == (e10 = this.bindings[f2]) || e10.filter((a11) => {
            var c11, d11, e11, g3, h3, i3;
            if (!["broadcast", "presence", "postgres_changes"].includes(f2)) return a11.type.toLocaleLowerCase() === f2;
            if ("id" in a11) {
              let f3 = a11.id, g4 = null == (c11 = a11.filter) ? void 0 : c11.event;
              return f3 && (null == (d11 = b10.ids) ? void 0 : d11.includes(f3)) && ("*" === g4 || (null == g4 ? void 0 : g4.toLocaleLowerCase()) === (null == (e11 = b10.data) ? void 0 : e11.type.toLocaleLowerCase()));
            }
            {
              let c12 = null == (h3 = null == (g3 = null == a11 ? void 0 : a11.filter) ? void 0 : g3.event) ? void 0 : h3.toLocaleLowerCase();
              return "*" === c12 || c12 === (null == (i3 = null == b10 ? void 0 : b10.event) ? void 0 : i3.toLocaleLowerCase());
            }
          }).map((a11) => {
            if ("object" == typeof k2 && "ids" in k2) {
              let a12 = k2.data, { schema: b11, table: c11, commit_timestamp: d11, type: e11, errors: f3 } = a12;
              k2 = Object.assign(Object.assign({}, { schema: b11, table: c11, commit_timestamp: d11, eventType: e11, new: {}, old: {}, errors: f3 }), this._getPayloadRecords(a12));
            }
            a11.callback(k2, c10);
          });
        }
        _isClosed() {
          return this.state === I.closed;
        }
        _isJoined() {
          return this.state === I.joined;
        }
        _isJoining() {
          return this.state === I.joining;
        }
        _isLeaving() {
          return this.state === I.leaving;
        }
        _replyEventName(a10) {
          return `chan_reply_${a10}`;
        }
        _on(a10, b10, c10) {
          let d10 = a10.toLocaleLowerCase(), e10 = { type: d10, filter: b10, callback: c10 };
          return this.bindings[d10] ? this.bindings[d10].push(e10) : this.bindings[d10] = [e10], this;
        }
        _off(a10, b10) {
          let c10 = a10.toLocaleLowerCase();
          return this.bindings[c10] && (this.bindings[c10] = this.bindings[c10].filter((a11) => {
            var d10;
            return !((null == (d10 = a11.type) ? void 0 : d10.toLocaleLowerCase()) === c10 && c9.isEqual(a11.filter, b10));
          })), this;
        }
        static isEqual(a10, b10) {
          if (Object.keys(a10).length !== Object.keys(b10).length) return false;
          for (let c10 in a10) if (a10[c10] !== b10[c10]) return false;
          return true;
        }
        _rejoinUntilConnected() {
          this.rejoinTimer.scheduleTimeout(), this.socket.isConnected() && this._rejoin();
        }
        _onClose(a10) {
          this._on(J.close, {}, a10);
        }
        _onError(a10) {
          this._on(J.error, {}, (b10) => a10(b10));
        }
        _canPush() {
          return this.socket.isConnected() && this._isJoined();
        }
        _rejoin(a10 = this.timeout) {
          this._isLeaving() || (this.socket._leaveOpenTopic(this.topic), this.state = I.joining, this.joinPush.resend(a10));
        }
        _getPayloadRecords(a10) {
          let b10 = { new: {}, old: {} };
          return ("INSERT" === a10.type || "UPDATE" === a10.type) && (b10.new = cZ(a10.columns, a10.record)), ("UPDATE" === a10.type || "DELETE" === a10.type) && (b10.old = cZ(a10.columns, a10.old_record)), b10;
        }
      }
      let da = () => {
      }, db = [1e3, 2e3, 5e3, 1e4], dc = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
      class dd {
        constructor(a10, b10) {
          var c10;
          if (this.accessTokenValue = null, this.apiKey = null, this.channels = [], this.endPoint = "", this.httpEndpoint = "", this.headers = {}, this.params = {}, this.timeout = 1e4, this.transport = null, this.heartbeatIntervalMs = 25e3, this.heartbeatTimer = void 0, this.pendingHeartbeatRef = null, this.heartbeatCallback = da, this.ref = 0, this.reconnectTimer = null, this.vsn = cW, this.logger = da, this.conn = null, this.sendBuffer = [], this.serializer = new cX(), this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] }, this.accessToken = null, this._connectionState = "disconnected", this._wasManualDisconnect = false, this._authPromise = null, this._resolveFetch = (a11) => a11 ? (...b11) => a11(...b11) : (...a12) => fetch(...a12), !(null == (c10 = null == b10 ? void 0 : b10.params) ? void 0 : c10.apikey)) throw Error("API key is required to connect to Realtime");
          this.apiKey = b10.params.apikey, this.endPoint = `${a10}/${K.websocket}`, this.httpEndpoint = c6(a10), this._initializeOptions(b10), this._setupReconnectionTimer(), this.fetch = this._resolveFetch(null == b10 ? void 0 : b10.fetch);
        }
        connect() {
          if (!(this.isConnecting() || this.isDisconnecting() || null !== this.conn && this.isConnected())) {
            if (this._setConnectionState("connecting"), this.accessToken && !this._authPromise && this._setAuthSafely("connect"), this.transport) this.conn = new this.transport(this.endpointURL());
            else try {
              this.conn = cV.createWebSocket(this.endpointURL());
            } catch (b10) {
              this._setConnectionState("disconnected");
              let a10 = b10.message;
              if (a10.includes("Node.js")) throw Error(`${a10}

To use Realtime in Node.js, you need to provide a WebSocket implementation:

Option 1: Use Node.js 22+ which has native WebSocket support
Option 2: Install and provide the "ws" package:

  npm install ws

  import ws from "ws"
  const client = new RealtimeClient(url, {
    ...options,
    transport: ws
  })`);
              throw Error(`WebSocket not available: ${a10}`);
            }
            this._setupConnectionHandlers();
          }
        }
        endpointURL() {
          return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: this.vsn }));
        }
        disconnect(a10, b10) {
          if (!this.isDisconnecting()) if (this._setConnectionState("disconnecting", true), this.conn) {
            let c10 = setTimeout(() => {
              this._setConnectionState("disconnected");
            }, 100);
            this.conn.onclose = () => {
              clearTimeout(c10), this._setConnectionState("disconnected");
            }, "function" == typeof this.conn.close && (a10 ? this.conn.close(a10, null != b10 ? b10 : "") : this.conn.close()), this._teardownConnection();
          } else this._setConnectionState("disconnected");
        }
        getChannels() {
          return this.channels;
        }
        async removeChannel(a10) {
          let b10 = await a10.unsubscribe();
          return 0 === this.channels.length && this.disconnect(), b10;
        }
        async removeAllChannels() {
          let a10 = await Promise.all(this.channels.map((a11) => a11.unsubscribe()));
          return this.channels = [], this.disconnect(), a10;
        }
        log(a10, b10, c10) {
          this.logger(a10, b10, c10);
        }
        connectionState() {
          switch (this.conn && this.conn.readyState) {
            case H.connecting:
              return L.Connecting;
            case H.open:
              return L.Open;
            case H.closing:
              return L.Closing;
            default:
              return L.Closed;
          }
        }
        isConnected() {
          return this.connectionState() === L.Open;
        }
        isConnecting() {
          return "connecting" === this._connectionState;
        }
        isDisconnecting() {
          return "disconnecting" === this._connectionState;
        }
        channel(a10, b10 = { config: {} }) {
          let c10 = `realtime:${a10}`, d10 = this.getChannels().find((a11) => a11.topic === c10);
          if (d10) return d10;
          {
            let c11 = new c9(`realtime:${a10}`, b10, this);
            return this.channels.push(c11), c11;
          }
        }
        push(a10) {
          let { topic: b10, event: c10, payload: d10, ref: e10 } = a10, f2 = () => {
            this.encode(a10, (a11) => {
              var b11;
              null == (b11 = this.conn) || b11.send(a11);
            });
          };
          this.log("push", `${b10} ${c10} (${e10})`, d10), this.isConnected() ? f2() : this.sendBuffer.push(f2);
        }
        async setAuth(a10 = null) {
          this._authPromise = this._performAuth(a10);
          try {
            await this._authPromise;
          } finally {
            this._authPromise = null;
          }
        }
        async sendHeartbeat() {
          var a10;
          if (!this.isConnected()) {
            try {
              this.heartbeatCallback("disconnected");
            } catch (a11) {
              this.log("error", "error in heartbeat callback", a11);
            }
            return;
          }
          if (this.pendingHeartbeatRef) {
            this.pendingHeartbeatRef = null, this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
            try {
              this.heartbeatCallback("timeout");
            } catch (a11) {
              this.log("error", "error in heartbeat callback", a11);
            }
            this._wasManualDisconnect = false, null == (a10 = this.conn) || a10.close(1e3, "heartbeat timeout"), setTimeout(() => {
              var a11;
              this.isConnected() || null == (a11 = this.reconnectTimer) || a11.scheduleTimeout();
            }, 100);
            return;
          }
          this.pendingHeartbeatRef = this._makeRef(), this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
          try {
            this.heartbeatCallback("sent");
          } catch (a11) {
            this.log("error", "error in heartbeat callback", a11);
          }
          this._setAuthSafely("heartbeat");
        }
        onHeartbeat(a10) {
          this.heartbeatCallback = a10;
        }
        flushSendBuffer() {
          this.isConnected() && this.sendBuffer.length > 0 && (this.sendBuffer.forEach((a10) => a10()), this.sendBuffer = []);
        }
        _makeRef() {
          let a10 = this.ref + 1;
          return a10 === this.ref ? this.ref = 0 : this.ref = a10, this.ref.toString();
        }
        _leaveOpenTopic(a10) {
          let b10 = this.channels.find((b11) => b11.topic === a10 && (b11._isJoined() || b11._isJoining()));
          b10 && (this.log("transport", `leaving duplicate topic "${a10}"`), b10.unsubscribe());
        }
        _remove(a10) {
          this.channels = this.channels.filter((b10) => b10.topic !== a10.topic);
        }
        _onConnMessage(a10) {
          this.decode(a10.data, (a11) => {
            if ("phoenix" === a11.topic && "phx_reply" === a11.event) try {
              this.heartbeatCallback("ok" === a11.payload.status ? "ok" : "error");
            } catch (a12) {
              this.log("error", "error in heartbeat callback", a12);
            }
            a11.ref && a11.ref === this.pendingHeartbeatRef && (this.pendingHeartbeatRef = null);
            let { topic: b10, event: c10, payload: d10, ref: e10 } = a11, f2 = e10 ? `(${e10})` : "", g2 = d10.status || "";
            this.log("receive", `${g2} ${b10} ${c10} ${f2}`.trim(), d10), this.channels.filter((a12) => a12._isMember(b10)).forEach((a12) => a12._trigger(c10, d10, e10)), this._triggerStateCallbacks("message", a11);
          });
        }
        _clearTimer(a10) {
          var b10;
          "heartbeat" === a10 && this.heartbeatTimer ? (clearInterval(this.heartbeatTimer), this.heartbeatTimer = void 0) : "reconnect" === a10 && (null == (b10 = this.reconnectTimer) || b10.reset());
        }
        _clearAllTimers() {
          this._clearTimer("heartbeat"), this._clearTimer("reconnect");
        }
        _setupConnectionHandlers() {
          this.conn && ("binaryType" in this.conn && (this.conn.binaryType = "arraybuffer"), this.conn.onopen = () => this._onConnOpen(), this.conn.onerror = (a10) => this._onConnError(a10), this.conn.onmessage = (a10) => this._onConnMessage(a10), this.conn.onclose = (a10) => this._onConnClose(a10));
        }
        _teardownConnection() {
          if (this.conn) {
            if (this.conn.readyState === H.open || this.conn.readyState === H.connecting) try {
              this.conn.close();
            } catch (a10) {
              this.log("error", "Error closing connection", a10);
            }
            this.conn.onopen = null, this.conn.onerror = null, this.conn.onmessage = null, this.conn.onclose = null, this.conn = null;
          }
          this._clearAllTimers(), this.channels.forEach((a10) => a10.teardown());
        }
        _onConnOpen() {
          this._setConnectionState("connected"), this.log("transport", `connected to ${this.endpointURL()}`), (this._authPromise || (this.accessToken && !this.accessTokenValue ? this.setAuth() : Promise.resolve())).then(() => {
            this.flushSendBuffer();
          }).catch((a10) => {
            this.log("error", "error waiting for auth on connect", a10), this.flushSendBuffer();
          }), this._clearTimer("reconnect"), this.worker ? this.workerRef || this._startWorkerHeartbeat() : this._startHeartbeat(), this._triggerStateCallbacks("open");
        }
        _startHeartbeat() {
          this.heartbeatTimer && clearInterval(this.heartbeatTimer), this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
        }
        _startWorkerHeartbeat() {
          this.workerUrl ? this.log("worker", `starting worker for from ${this.workerUrl}`) : this.log("worker", "starting default worker");
          let a10 = this._workerObjectUrl(this.workerUrl);
          this.workerRef = new Worker(a10), this.workerRef.onerror = (a11) => {
            this.log("worker", "worker error", a11.message), this.workerRef.terminate();
          }, this.workerRef.onmessage = (a11) => {
            "keepAlive" === a11.data.event && this.sendHeartbeat();
          }, this.workerRef.postMessage({ event: "start", interval: this.heartbeatIntervalMs });
        }
        _onConnClose(a10) {
          var b10;
          this._setConnectionState("disconnected"), this.log("transport", "close", a10), this._triggerChanError(), this._clearTimer("heartbeat"), this._wasManualDisconnect || null == (b10 = this.reconnectTimer) || b10.scheduleTimeout(), this._triggerStateCallbacks("close", a10);
        }
        _onConnError(a10) {
          this._setConnectionState("disconnected"), this.log("transport", `${a10}`), this._triggerChanError(), this._triggerStateCallbacks("error", a10);
        }
        _triggerChanError() {
          this.channels.forEach((a10) => a10._trigger(J.error));
        }
        _appendParams(a10, b10) {
          if (0 === Object.keys(b10).length) return a10;
          let c10 = a10.match(/\?/) ? "&" : "?", d10 = new URLSearchParams(b10);
          return `${a10}${c10}${d10}`;
        }
        _workerObjectUrl(a10) {
          let b10;
          if (a10) b10 = a10;
          else {
            let a11 = new Blob([dc], { type: "application/javascript" });
            b10 = URL.createObjectURL(a11);
          }
          return b10;
        }
        _setConnectionState(a10, b10 = false) {
          this._connectionState = a10, "connecting" === a10 ? this._wasManualDisconnect = false : "disconnecting" === a10 && (this._wasManualDisconnect = b10);
        }
        async _performAuth(a10 = null) {
          let b10;
          b10 = a10 || (this.accessToken ? await this.accessToken() : this.accessTokenValue), this.accessTokenValue != b10 && (this.accessTokenValue = b10, this.channels.forEach((a11) => {
            b10 && a11.updateJoinPayload({ access_token: b10, version: "realtime-js/2.81.1" }), a11.joinedOnce && a11._isJoined() && a11._push(J.access_token, { access_token: b10 });
          }));
        }
        async _waitForAuthIfNeeded() {
          this._authPromise && await this._authPromise;
        }
        _setAuthSafely(a10 = "general") {
          this.setAuth().catch((b10) => {
            this.log("error", `error setting auth in ${a10}`, b10);
          });
        }
        _triggerStateCallbacks(a10, b10) {
          try {
            this.stateChangeCallbacks[a10].forEach((c10) => {
              try {
                c10(b10);
              } catch (b11) {
                this.log("error", `error in ${a10} callback`, b11);
              }
            });
          } catch (b11) {
            this.log("error", `error triggering ${a10} callbacks`, b11);
          }
        }
        _setupReconnectionTimer() {
          this.reconnectTimer = new cY(async () => {
            setTimeout(async () => {
              await this._waitForAuthIfNeeded(), this.isConnected() || this.connect();
            }, 10);
          }, this.reconnectAfterMs);
        }
        _initializeOptions(a10) {
          var b10, c10, d10, e10, f2, g2, h2, i2, j2, k2, l2, m2;
          switch (this.transport = null != (b10 = null == a10 ? void 0 : a10.transport) ? b10 : null, this.timeout = null != (c10 = null == a10 ? void 0 : a10.timeout) ? c10 : 1e4, this.heartbeatIntervalMs = null != (d10 = null == a10 ? void 0 : a10.heartbeatIntervalMs) ? d10 : 25e3, this.worker = null != (e10 = null == a10 ? void 0 : a10.worker) && e10, this.accessToken = null != (f2 = null == a10 ? void 0 : a10.accessToken) ? f2 : null, this.heartbeatCallback = null != (g2 = null == a10 ? void 0 : a10.heartbeatCallback) ? g2 : da, this.vsn = null != (h2 = null == a10 ? void 0 : a10.vsn) ? h2 : cW, (null == a10 ? void 0 : a10.params) && (this.params = a10.params), (null == a10 ? void 0 : a10.logger) && (this.logger = a10.logger), ((null == a10 ? void 0 : a10.logLevel) || (null == a10 ? void 0 : a10.log_level)) && (this.logLevel = a10.logLevel || a10.log_level, this.params = Object.assign(Object.assign({}, this.params), { log_level: this.logLevel })), this.reconnectAfterMs = null != (i2 = null == a10 ? void 0 : a10.reconnectAfterMs) ? i2 : (a11) => db[a11 - 1] || 1e4, this.vsn) {
            case cW:
              this.encode = null != (j2 = null == a10 ? void 0 : a10.encode) ? j2 : (a11, b11) => b11(JSON.stringify(a11)), this.decode = null != (k2 = null == a10 ? void 0 : a10.decode) ? k2 : (a11, b11) => b11(JSON.parse(a11));
              break;
            case "2.0.0":
              this.encode = null != (l2 = null == a10 ? void 0 : a10.encode) ? l2 : this.serializer.encode.bind(this.serializer), this.decode = null != (m2 = null == a10 ? void 0 : a10.decode) ? m2 : this.serializer.decode.bind(this.serializer);
              break;
            default:
              throw Error(`Unsupported serializer version: ${this.vsn}`);
          }
          if (this.worker) {
            if ("u" > typeof window && !window.Worker) throw Error("Web Worker is not supported");
            this.workerUrl = null == a10 ? void 0 : a10.workerUrl;
          }
        }
      }
      class de extends Error {
        constructor(a10) {
          super(a10), this.__isStorageError = true, this.name = "StorageError";
        }
      }
      function df(a10) {
        return "object" == typeof a10 && null !== a10 && "__isStorageError" in a10;
      }
      class dg extends de {
        constructor(a10, b10, c10) {
          super(a10), this.name = "StorageApiError", this.status = b10, this.statusCode = c10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, statusCode: this.statusCode };
        }
      }
      class dh extends de {
        constructor(a10, b10) {
          super(a10), this.name = "StorageUnknownError", this.originalError = b10;
        }
      }
      let di = (a10) => a10 ? (...b10) => a10(...b10) : (...a11) => fetch(...a11), dj = (a10) => {
        if (Array.isArray(a10)) return a10.map((a11) => dj(a11));
        if ("function" == typeof a10 || a10 !== Object(a10)) return a10;
        let b10 = {};
        return Object.entries(a10).forEach(([a11, c10]) => {
          b10[a11.replace(/([-_][a-z])/gi, (a12) => a12.toUpperCase().replace(/[-_]/g, ""))] = dj(c10);
        }), b10;
      }, dk = (a10) => {
        var b10;
        return a10.msg || a10.message || a10.error_description || ("string" == typeof a10.error ? a10.error : null == (b10 = a10.error) ? void 0 : b10.message) || JSON.stringify(a10);
      };
      function dl(a10, b10, c10, d10, e10, f2) {
        return (0, cH.__awaiter)(this, void 0, void 0, function* () {
          return new Promise((g2, h2) => {
            let i2;
            a10(c10, (i2 = { method: b10, headers: (null == d10 ? void 0 : d10.headers) || {} }, "GET" === b10 || !f2 ? i2 : (((a11) => {
              if ("object" != typeof a11 || null === a11) return false;
              let b11 = Object.getPrototypeOf(a11);
              return (null === b11 || b11 === Object.prototype || null === Object.getPrototypeOf(b11)) && !(Symbol.toStringTag in a11) && !(Symbol.iterator in a11);
            })(f2) ? (i2.headers = Object.assign({ "Content-Type": "application/json" }, null == d10 ? void 0 : d10.headers), i2.body = JSON.stringify(f2)) : i2.body = f2, (null == d10 ? void 0 : d10.duplex) && (i2.duplex = d10.duplex), Object.assign(Object.assign({}, i2), e10)))).then((a11) => {
              if (!a11.ok) throw a11;
              return (null == d10 ? void 0 : d10.noResolveJson) ? a11 : a11.json();
            }).then((a11) => g2(a11)).catch((a11) => (0, cH.__awaiter)(void 0, void 0, void 0, function* () {
              a11 instanceof (yield Response) && !(null == d10 ? void 0 : d10.noResolveJson) ? a11.json().then((b11) => {
                let c11 = a11.status || 500, d11 = (null == b11 ? void 0 : b11.statusCode) || c11 + "";
                h2(new dg(dk(b11), c11, d11));
              }).catch((a12) => {
                h2(new dh(dk(a12), a12));
              }) : h2(new dh(dk(a11), a11));
            }));
          });
        });
      }
      function dm(a10, b10, c10, d10) {
        return (0, cH.__awaiter)(this, void 0, void 0, function* () {
          return dl(a10, "GET", b10, c10, d10);
        });
      }
      function dn(a10, b10, c10, d10, e10) {
        return (0, cH.__awaiter)(this, void 0, void 0, function* () {
          return dl(a10, "POST", b10, d10, e10, c10);
        });
      }
      function dp(a10, b10, c10, d10, e10) {
        return (0, cH.__awaiter)(this, void 0, void 0, function* () {
          return dl(a10, "PUT", b10, d10, e10, c10);
        });
      }
      function dq(a10, b10, c10, d10, e10) {
        return (0, cH.__awaiter)(this, void 0, void 0, function* () {
          return dl(a10, "DELETE", b10, d10, e10, c10);
        });
      }
      class dr {
        constructor(a10, b10) {
          this.downloadFn = a10, this.shouldThrowOnError = b10;
        }
        then(a10, b10) {
          return this.execute().then(a10, b10);
        }
        execute() {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: (yield this.downloadFn()).body, error: null };
            } catch (a10) {
              if (this.shouldThrowOnError) throw a10;
              if (df(a10)) return { data: null, error: a10 };
              throw a10;
            }
          });
        }
      }
      class ds {
        constructor(a10, b10) {
          this.downloadFn = a10, this.shouldThrowOnError = b10, this[R] = "BlobDownloadBuilder", this.promise = null;
        }
        asStream() {
          return new dr(this.downloadFn, this.shouldThrowOnError);
        }
        then(a10, b10) {
          return this.getPromise().then(a10, b10);
        }
        catch(a10) {
          return this.getPromise().catch(a10);
        }
        finally(a10) {
          return this.getPromise().finally(a10);
        }
        getPromise() {
          return this.promise || (this.promise = this.execute()), this.promise;
        }
        execute() {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              let a10 = yield this.downloadFn();
              return { data: yield a10.blob(), error: null };
            } catch (a10) {
              if (this.shouldThrowOnError) throw a10;
              if (df(a10)) return { data: null, error: a10 };
              throw a10;
            }
          });
        }
      }
      R = Symbol.toStringTag;
      var dt = c(356).Buffer;
      let du = { limit: 100, offset: 0, sortBy: { column: "name", order: "asc" } }, dv = { cacheControl: "3600", contentType: "text/plain;charset=UTF-8", upsert: false };
      class dw {
        constructor(a10, b10 = {}, c10, d10) {
          this.shouldThrowOnError = false, this.url = a10, this.headers = b10, this.bucketId = c10, this.fetch = di(d10);
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        uploadOrUpdate(a10, b10, c10, d10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              let e10, f2 = Object.assign(Object.assign({}, dv), d10), g2 = Object.assign(Object.assign({}, this.headers), "POST" === a10 && { "x-upsert": String(f2.upsert) }), h2 = f2.metadata;
              "u" > typeof Blob && c10 instanceof Blob ? ((e10 = new FormData()).append("cacheControl", f2.cacheControl), h2 && e10.append("metadata", this.encodeMetadata(h2)), e10.append("", c10)) : "u" > typeof FormData && c10 instanceof FormData ? ((e10 = c10).has("cacheControl") || e10.append("cacheControl", f2.cacheControl), h2 && !e10.has("metadata") && e10.append("metadata", this.encodeMetadata(h2))) : (e10 = c10, g2["cache-control"] = `max-age=${f2.cacheControl}`, g2["content-type"] = f2.contentType, h2 && (g2["x-metadata"] = this.toBase64(this.encodeMetadata(h2))), ("u" > typeof ReadableStream && e10 instanceof ReadableStream || e10 && "object" == typeof e10 && "pipe" in e10 && "function" == typeof e10.pipe) && !f2.duplex && (f2.duplex = "half")), (null == d10 ? void 0 : d10.headers) && (g2 = Object.assign(Object.assign({}, g2), d10.headers));
              let i2 = this._removeEmptyFolders(b10), j2 = this._getFinalPath(i2), k2 = yield ("PUT" == a10 ? dp : dn)(this.fetch, `${this.url}/object/${j2}`, e10, Object.assign({ headers: g2 }, (null == f2 ? void 0 : f2.duplex) ? { duplex: f2.duplex } : {}));
              return { data: { path: i2, id: k2.Id, fullPath: k2.Key }, error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        upload(a10, b10, c10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            return this.uploadOrUpdate("POST", a10, b10, c10);
          });
        }
        uploadToSignedUrl(a10, b10, c10, d10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            let e10 = this._removeEmptyFolders(a10), f2 = this._getFinalPath(e10), g2 = new URL(this.url + `/object/upload/sign/${f2}`);
            g2.searchParams.set("token", b10);
            try {
              let a11, b11 = Object.assign({ upsert: dv.upsert }, d10), f3 = Object.assign(Object.assign({}, this.headers), { "x-upsert": String(b11.upsert) });
              "u" > typeof Blob && c10 instanceof Blob ? ((a11 = new FormData()).append("cacheControl", b11.cacheControl), a11.append("", c10)) : "u" > typeof FormData && c10 instanceof FormData ? (a11 = c10).append("cacheControl", b11.cacheControl) : (a11 = c10, f3["cache-control"] = `max-age=${b11.cacheControl}`, f3["content-type"] = b11.contentType);
              let h2 = yield dp(this.fetch, g2.toString(), a11, { headers: f3 });
              return { data: { path: e10, fullPath: h2.Key }, error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        createSignedUploadUrl(a10, b10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              let c10 = this._getFinalPath(a10), d10 = Object.assign({}, this.headers);
              (null == b10 ? void 0 : b10.upsert) && (d10["x-upsert"] = "true");
              let e10 = yield dn(this.fetch, `${this.url}/object/upload/sign/${c10}`, {}, { headers: d10 }), f2 = new URL(this.url + e10.url), g2 = f2.searchParams.get("token");
              if (!g2) throw new de("No token returned by API");
              return { data: { signedUrl: f2.toString(), path: a10, token: g2 }, error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        update(a10, b10, c10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            return this.uploadOrUpdate("PUT", a10, b10, c10);
          });
        }
        move(a10, b10, c10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield dn(this.fetch, `${this.url}/object/move`, { bucketId: this.bucketId, sourceKey: a10, destinationKey: b10, destinationBucket: null == c10 ? void 0 : c10.destinationBucket }, { headers: this.headers }), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        copy(a10, b10, c10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: { path: (yield dn(this.fetch, `${this.url}/object/copy`, { bucketId: this.bucketId, sourceKey: a10, destinationKey: b10, destinationBucket: null == c10 ? void 0 : c10.destinationBucket }, { headers: this.headers })).Key }, error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        createSignedUrl(a10, b10, c10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              let d10 = this._getFinalPath(a10), e10 = yield dn(this.fetch, `${this.url}/object/sign/${d10}`, Object.assign({ expiresIn: b10 }, (null == c10 ? void 0 : c10.transform) ? { transform: c10.transform } : {}), { headers: this.headers }), f2 = (null == c10 ? void 0 : c10.download) ? `&download=${true === c10.download ? "" : c10.download}` : "";
              return { data: e10 = { signedUrl: encodeURI(`${this.url}${e10.signedURL}${f2}`) }, error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        createSignedUrls(a10, b10, c10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              let d10 = yield dn(this.fetch, `${this.url}/object/sign/${this.bucketId}`, { expiresIn: b10, paths: a10 }, { headers: this.headers }), e10 = (null == c10 ? void 0 : c10.download) ? `&download=${true === c10.download ? "" : c10.download}` : "";
              return { data: d10.map((a11) => Object.assign(Object.assign({}, a11), { signedUrl: a11.signedURL ? encodeURI(`${this.url}${a11.signedURL}${e10}`) : null })), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        download(a10, b10) {
          let c10 = void 0 !== (null == b10 ? void 0 : b10.transform) ? "render/image/authenticated" : "object", d10 = this.transformOptsToQueryString((null == b10 ? void 0 : b10.transform) || {}), e10 = d10 ? `?${d10}` : "", f2 = this._getFinalPath(a10);
          return new ds(() => dm(this.fetch, `${this.url}/${c10}/${f2}${e10}`, { headers: this.headers, noResolveJson: true }), this.shouldThrowOnError);
        }
        info(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            let b10 = this._getFinalPath(a10);
            try {
              let a11 = yield dm(this.fetch, `${this.url}/object/info/${b10}`, { headers: this.headers });
              return { data: dj(a11), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        exists(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            let b10 = this._getFinalPath(a10);
            try {
              return yield function(a11, b11, c10) {
                return (0, cH.__awaiter)(this, void 0, void 0, function* () {
                  return dl(a11, "HEAD", b11, Object.assign(Object.assign({}, c10), { noResolveJson: true }), void 0);
                });
              }(this.fetch, `${this.url}/object/${b10}`, { headers: this.headers }), { data: true, error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11) && a11 instanceof dh) {
                let b11 = a11.originalError;
                if ([400, 404].includes(null == b11 ? void 0 : b11.status)) return { data: false, error: a11 };
              }
              throw a11;
            }
          });
        }
        getPublicUrl(a10, b10) {
          let c10 = this._getFinalPath(a10), d10 = [], e10 = (null == b10 ? void 0 : b10.download) ? `download=${true === b10.download ? "" : b10.download}` : "";
          "" !== e10 && d10.push(e10);
          let f2 = void 0 !== (null == b10 ? void 0 : b10.transform), g2 = this.transformOptsToQueryString((null == b10 ? void 0 : b10.transform) || {});
          "" !== g2 && d10.push(g2);
          let h2 = d10.join("&");
          return "" !== h2 && (h2 = `?${h2}`), { data: { publicUrl: encodeURI(`${this.url}/${f2 ? "render/image" : "object"}/public/${c10}${h2}`) } };
        }
        remove(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield dq(this.fetch, `${this.url}/object/${this.bucketId}`, { prefixes: a10 }, { headers: this.headers }), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        list(a10, b10, c10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              let d10 = Object.assign(Object.assign(Object.assign({}, du), b10), { prefix: a10 || "" });
              return { data: yield dn(this.fetch, `${this.url}/object/list/${this.bucketId}`, d10, { headers: this.headers }, c10), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        listV2(a10, b10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              let c10 = Object.assign({}, a10);
              return { data: yield dn(this.fetch, `${this.url}/object/list-v2/${this.bucketId}`, c10, { headers: this.headers }, b10), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        encodeMetadata(a10) {
          return JSON.stringify(a10);
        }
        toBase64(a10) {
          return void 0 !== dt ? dt.from(a10).toString("base64") : btoa(a10);
        }
        _getFinalPath(a10) {
          return `${this.bucketId}/${a10.replace(/^\/+/, "")}`;
        }
        _removeEmptyFolders(a10) {
          return a10.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
        }
        transformOptsToQueryString(a10) {
          let b10 = [];
          return a10.width && b10.push(`width=${a10.width}`), a10.height && b10.push(`height=${a10.height}`), a10.resize && b10.push(`resize=${a10.resize}`), a10.format && b10.push(`format=${a10.format}`), a10.quality && b10.push(`quality=${a10.quality}`), b10.join("&");
        }
      }
      let dx = "2.81.1", dy = { "X-Client-Info": `storage-js/${dx}` };
      class dz {
        constructor(a10, b10 = {}, c10, d10) {
          this.shouldThrowOnError = false;
          const e10 = new URL(a10);
          (null == d10 ? void 0 : d10.useNewHostname) && /supabase\.(co|in|red)$/.test(e10.hostname) && !e10.hostname.includes("storage.supabase.") && (e10.hostname = e10.hostname.replace("supabase.", "storage.supabase.")), this.url = e10.href.replace(/\/$/, ""), this.headers = Object.assign(Object.assign({}, dy), b10), this.fetch = di(c10);
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        listBuckets(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              let b10 = this.listBucketOptionsToQueryString(a10);
              return { data: yield dm(this.fetch, `${this.url}/bucket${b10}`, { headers: this.headers }), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        getBucket(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield dm(this.fetch, `${this.url}/bucket/${a10}`, { headers: this.headers }), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        createBucket(a10) {
          return (0, cH.__awaiter)(this, arguments, void 0, function* (a11, b10 = { public: false }) {
            try {
              return { data: yield dn(this.fetch, `${this.url}/bucket`, { id: a11, name: a11, type: b10.type, public: b10.public, file_size_limit: b10.fileSizeLimit, allowed_mime_types: b10.allowedMimeTypes }, { headers: this.headers }), error: null };
            } catch (a12) {
              if (this.shouldThrowOnError) throw a12;
              if (df(a12)) return { data: null, error: a12 };
              throw a12;
            }
          });
        }
        updateBucket(a10, b10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield dp(this.fetch, `${this.url}/bucket/${a10}`, { id: a10, name: a10, public: b10.public, file_size_limit: b10.fileSizeLimit, allowed_mime_types: b10.allowedMimeTypes }, { headers: this.headers }), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        emptyBucket(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield dn(this.fetch, `${this.url}/bucket/${a10}/empty`, {}, { headers: this.headers }), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        deleteBucket(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield dq(this.fetch, `${this.url}/bucket/${a10}`, {}, { headers: this.headers }), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        listBucketOptionsToQueryString(a10) {
          let b10 = {};
          return a10 && ("limit" in a10 && (b10.limit = String(a10.limit)), "offset" in a10 && (b10.offset = String(a10.offset)), a10.search && (b10.search = a10.search), a10.sortColumn && (b10.sortColumn = a10.sortColumn), a10.sortOrder && (b10.sortOrder = a10.sortOrder)), Object.keys(b10).length > 0 ? "?" + new URLSearchParams(b10).toString() : "";
        }
      }
      class dA {
        constructor(a10, b10 = {}, c10) {
          this.shouldThrowOnError = false, this.url = a10.replace(/\/$/, ""), this.headers = Object.assign(Object.assign({}, dy), b10), this.fetch = di(c10);
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        createBucket(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield dn(this.fetch, `${this.url}/bucket`, { name: a10 }, { headers: this.headers }), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        listBuckets(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              let b10 = new URLSearchParams();
              (null == a10 ? void 0 : a10.limit) !== void 0 && b10.set("limit", a10.limit.toString()), (null == a10 ? void 0 : a10.offset) !== void 0 && b10.set("offset", a10.offset.toString()), (null == a10 ? void 0 : a10.sortColumn) && b10.set("sortColumn", a10.sortColumn), (null == a10 ? void 0 : a10.sortOrder) && b10.set("sortOrder", a10.sortOrder), (null == a10 ? void 0 : a10.search) && b10.set("search", a10.search);
              let c10 = b10.toString(), d10 = c10 ? `${this.url}/bucket?${c10}` : `${this.url}/bucket`;
              return { data: yield dm(this.fetch, d10, { headers: this.headers }), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        deleteBucket(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield dq(this.fetch, `${this.url}/bucket/${a10}`, {}, { headers: this.headers }), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (df(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
      }
      let dB = { "X-Client-Info": `storage-js/${dx}`, "Content-Type": "application/json" };
      class dC extends Error {
        constructor(a10) {
          super(a10), this.__isStorageVectorsError = true, this.name = "StorageVectorsError";
        }
      }
      function dD(a10) {
        return "object" == typeof a10 && null !== a10 && "__isStorageVectorsError" in a10;
      }
      class dE extends dC {
        constructor(a10, b10, c10) {
          super(a10), this.name = "StorageVectorsApiError", this.status = b10, this.statusCode = c10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, statusCode: this.statusCode };
        }
      }
      class dF extends dC {
        constructor(a10, b10) {
          super(a10), this.name = "StorageVectorsUnknownError", this.originalError = b10;
        }
      }
      (E = S || (S = {})).InternalError = "InternalError", E.S3VectorConflictException = "S3VectorConflictException", E.S3VectorNotFoundException = "S3VectorNotFoundException", E.S3VectorBucketNotEmpty = "S3VectorBucketNotEmpty", E.S3VectorMaxBucketsExceeded = "S3VectorMaxBucketsExceeded", E.S3VectorMaxIndexesExceeded = "S3VectorMaxIndexesExceeded";
      let dG = (a10) => a10 ? (...b10) => a10(...b10) : (...a11) => fetch(...a11), dH = (a10) => a10.msg || a10.message || a10.error_description || a10.error || JSON.stringify(a10);
      function dI(a10, b10, c10, d10, e10) {
        return (0, cH.__awaiter)(this, void 0, void 0, function* () {
          return function(a11, b11, c11, d11, e11, f2) {
            return (0, cH.__awaiter)(this, void 0, void 0, function* () {
              return new Promise((g2, h2) => {
                let i2;
                a11(c11, (i2 = { method: b11, headers: (null == d11 ? void 0 : d11.headers) || {} }, "GET" === b11 || !f2 ? i2 : (((a12) => {
                  if ("object" != typeof a12 || null === a12) return false;
                  let b12 = Object.getPrototypeOf(a12);
                  return (null === b12 || b12 === Object.prototype || null === Object.getPrototypeOf(b12)) && !(Symbol.toStringTag in a12) && !(Symbol.iterator in a12);
                })(f2) ? (i2.headers = Object.assign({ "Content-Type": "application/json" }, null == d11 ? void 0 : d11.headers), i2.body = JSON.stringify(f2)) : i2.body = f2, Object.assign(Object.assign({}, i2), e11)))).then((a12) => {
                  if (!a12.ok) throw a12;
                  if (null == d11 ? void 0 : d11.noResolveJson) return a12;
                  let b12 = a12.headers.get("content-type");
                  return b12 && b12.includes("application/json") ? a12.json() : {};
                }).then((a12) => g2(a12)).catch((a12) => (0, cH.__awaiter)(void 0, void 0, void 0, function* () {
                  if (!(a12 && "object" == typeof a12 && "status" in a12 && "ok" in a12 && "number" == typeof a12.status) || (null == d11 ? void 0 : d11.noResolveJson)) h2(new dF(dH(a12), a12));
                  else {
                    let b12 = a12.status || 500;
                    "function" == typeof a12.json ? a12.json().then((a13) => {
                      let c12 = (null == a13 ? void 0 : a13.statusCode) || (null == a13 ? void 0 : a13.code) || b12 + "";
                      h2(new dE(dH(a13), b12, c12));
                    }).catch(() => {
                      h2(new dE(a12.statusText || `HTTP ${b12} error`, b12, b12 + ""));
                    }) : h2(new dE(a12.statusText || `HTTP ${b12} error`, b12, b12 + ""));
                  }
                }));
              });
            });
          }(a10, "POST", b10, d10, e10, c10);
        });
      }
      class dJ {
        constructor(a10, b10 = {}, c10) {
          this.shouldThrowOnError = false, this.url = a10.replace(/\/$/, ""), this.headers = Object.assign(Object.assign({}, dB), b10), this.fetch = dG(c10);
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        createIndex(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: (yield dI(this.fetch, `${this.url}/CreateIndex`, a10, { headers: this.headers })) || {}, error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (dD(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        getIndex(a10, b10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield dI(this.fetch, `${this.url}/GetIndex`, { vectorBucketName: a10, indexName: b10 }, { headers: this.headers }), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (dD(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        listIndexes(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield dI(this.fetch, `${this.url}/ListIndexes`, a10, { headers: this.headers }), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (dD(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        deleteIndex(a10, b10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: (yield dI(this.fetch, `${this.url}/DeleteIndex`, { vectorBucketName: a10, indexName: b10 }, { headers: this.headers })) || {}, error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (dD(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
      }
      class dK {
        constructor(a10, b10 = {}, c10) {
          this.shouldThrowOnError = false, this.url = a10.replace(/\/$/, ""), this.headers = Object.assign(Object.assign({}, dB), b10), this.fetch = dG(c10);
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        putVectors(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              if (a10.vectors.length < 1 || a10.vectors.length > 500) throw Error("Vector batch size must be between 1 and 500 items");
              return { data: (yield dI(this.fetch, `${this.url}/PutVectors`, a10, { headers: this.headers })) || {}, error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (dD(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        getVectors(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield dI(this.fetch, `${this.url}/GetVectors`, a10, { headers: this.headers }), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (dD(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        listVectors(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              if (void 0 !== a10.segmentCount) {
                if (a10.segmentCount < 1 || a10.segmentCount > 16) throw Error("segmentCount must be between 1 and 16");
                if (void 0 !== a10.segmentIndex && (a10.segmentIndex < 0 || a10.segmentIndex >= a10.segmentCount)) throw Error(`segmentIndex must be between 0 and ${a10.segmentCount - 1}`);
              }
              return { data: yield dI(this.fetch, `${this.url}/ListVectors`, a10, { headers: this.headers }), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (dD(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        queryVectors(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield dI(this.fetch, `${this.url}/QueryVectors`, a10, { headers: this.headers }), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (dD(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        deleteVectors(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              if (a10.keys.length < 1 || a10.keys.length > 500) throw Error("Keys batch size must be between 1 and 500 items");
              return { data: (yield dI(this.fetch, `${this.url}/DeleteVectors`, a10, { headers: this.headers })) || {}, error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (dD(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
      }
      class dL {
        constructor(a10, b10 = {}, c10) {
          this.shouldThrowOnError = false, this.url = a10.replace(/\/$/, ""), this.headers = Object.assign(Object.assign({}, dB), b10), this.fetch = dG(c10);
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        createBucket(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: (yield dI(this.fetch, `${this.url}/CreateVectorBucket`, { vectorBucketName: a10 }, { headers: this.headers })) || {}, error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (dD(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        getBucket(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: yield dI(this.fetch, `${this.url}/GetVectorBucket`, { vectorBucketName: a10 }, { headers: this.headers }), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (dD(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        listBuckets() {
          return (0, cH.__awaiter)(this, arguments, void 0, function* (a10 = {}) {
            try {
              return { data: yield dI(this.fetch, `${this.url}/ListVectorBuckets`, a10, { headers: this.headers }), error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (dD(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
        deleteBucket(a10) {
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            try {
              return { data: (yield dI(this.fetch, `${this.url}/DeleteVectorBucket`, { vectorBucketName: a10 }, { headers: this.headers })) || {}, error: null };
            } catch (a11) {
              if (this.shouldThrowOnError) throw a11;
              if (dD(a11)) return { data: null, error: a11 };
              throw a11;
            }
          });
        }
      }
      class dM extends dL {
        constructor(a10, b10 = {}) {
          super(a10, b10.headers || {}, b10.fetch);
        }
        from(a10) {
          return new dN(this.url, this.headers, a10, this.fetch);
        }
      }
      class dN extends dJ {
        constructor(a10, b10, c10, d10) {
          super(a10, b10, d10), this.vectorBucketName = c10;
        }
        createIndex(a10) {
          let b10 = Object.create(null, { createIndex: { get: () => super.createIndex } });
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            return b10.createIndex.call(this, Object.assign(Object.assign({}, a10), { vectorBucketName: this.vectorBucketName }));
          });
        }
        listIndexes() {
          let a10 = Object.create(null, { listIndexes: { get: () => super.listIndexes } });
          return (0, cH.__awaiter)(this, arguments, void 0, function* (b10 = {}) {
            return a10.listIndexes.call(this, Object.assign(Object.assign({}, b10), { vectorBucketName: this.vectorBucketName }));
          });
        }
        getIndex(a10) {
          let b10 = Object.create(null, { getIndex: { get: () => super.getIndex } });
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            return b10.getIndex.call(this, this.vectorBucketName, a10);
          });
        }
        deleteIndex(a10) {
          let b10 = Object.create(null, { deleteIndex: { get: () => super.deleteIndex } });
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            return b10.deleteIndex.call(this, this.vectorBucketName, a10);
          });
        }
        index(a10) {
          return new dO(this.url, this.headers, this.vectorBucketName, a10, this.fetch);
        }
      }
      class dO extends dK {
        constructor(a10, b10, c10, d10, e10) {
          super(a10, b10, e10), this.vectorBucketName = c10, this.indexName = d10;
        }
        putVectors(a10) {
          let b10 = Object.create(null, { putVectors: { get: () => super.putVectors } });
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            return b10.putVectors.call(this, Object.assign(Object.assign({}, a10), { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
          });
        }
        getVectors(a10) {
          let b10 = Object.create(null, { getVectors: { get: () => super.getVectors } });
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            return b10.getVectors.call(this, Object.assign(Object.assign({}, a10), { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
          });
        }
        listVectors() {
          let a10 = Object.create(null, { listVectors: { get: () => super.listVectors } });
          return (0, cH.__awaiter)(this, arguments, void 0, function* (b10 = {}) {
            return a10.listVectors.call(this, Object.assign(Object.assign({}, b10), { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
          });
        }
        queryVectors(a10) {
          let b10 = Object.create(null, { queryVectors: { get: () => super.queryVectors } });
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            return b10.queryVectors.call(this, Object.assign(Object.assign({}, a10), { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
          });
        }
        deleteVectors(a10) {
          let b10 = Object.create(null, { deleteVectors: { get: () => super.deleteVectors } });
          return (0, cH.__awaiter)(this, void 0, void 0, function* () {
            return b10.deleteVectors.call(this, Object.assign(Object.assign({}, a10), { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
          });
        }
      }
      class dP extends dz {
        constructor(a10, b10 = {}, c10, d10) {
          super(a10, b10, c10, d10);
        }
        from(a10) {
          return new dw(this.url, this.headers, a10, this.fetch);
        }
        get vectors() {
          return new dM(this.url + "/vector", { headers: this.headers, fetch: this.fetch });
        }
        get analytics() {
          return new dA(this.url + "/iceberg", this.headers, this.fetch);
        }
      }
      let dQ = "";
      dQ = "u" > typeof Deno ? "deno" : "u" > typeof document ? "web" : "u" > typeof navigator && "ReactNative" === navigator.product ? "react-native" : "node";
      let dR = { headers: { "X-Client-Info": `supabase-js-${dQ}/2.81.1` } }, dS = { schema: "public" }, dT = { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, flowType: "implicit" }, dU = {}, dV = "2.81.1", dW = { "X-Client-Info": `gotrue-js/${dV}` }, dX = "X-Supabase-Api-Version", dY = { "2024-01-01": { timestamp: Date.parse("2024-01-01T00:00:00.0Z"), name: "2024-01-01" } }, dZ = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;
      class d$ extends Error {
        constructor(a10, b10, c10) {
          super(a10), this.__isAuthError = true, this.name = "AuthError", this.status = b10, this.code = c10;
        }
      }
      function d_(a10) {
        return "object" == typeof a10 && null !== a10 && "__isAuthError" in a10;
      }
      class d0 extends d$ {
        constructor(a10, b10, c10) {
          super(a10, b10, c10), this.name = "AuthApiError", this.status = b10, this.code = c10;
        }
      }
      class d1 extends d$ {
        constructor(a10, b10) {
          super(a10), this.name = "AuthUnknownError", this.originalError = b10;
        }
      }
      class d2 extends d$ {
        constructor(a10, b10, c10, d10) {
          super(a10, c10, d10), this.name = b10, this.status = c10;
        }
      }
      class d3 extends d2 {
        constructor() {
          super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
        }
      }
      class d4 extends d2 {
        constructor() {
          super("Auth session or user missing", "AuthInvalidTokenResponseError", 500, void 0);
        }
      }
      class d5 extends d2 {
        constructor(a10) {
          super(a10, "AuthInvalidCredentialsError", 400, void 0);
        }
      }
      class d6 extends d2 {
        constructor(a10, b10 = null) {
          super(a10, "AuthImplicitGrantRedirectError", 500, void 0), this.details = null, this.details = b10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, details: this.details };
        }
      }
      class d7 extends d2 {
        constructor(a10, b10 = null) {
          super(a10, "AuthPKCEGrantCodeExchangeError", 500, void 0), this.details = null, this.details = b10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, details: this.details };
        }
      }
      class d8 extends d2 {
        constructor(a10, b10) {
          super(a10, "AuthRetryableFetchError", b10, void 0);
        }
      }
      function d9(a10) {
        return d_(a10) && "AuthRetryableFetchError" === a10.name;
      }
      class ea extends d2 {
        constructor(a10, b10, c10) {
          super(a10, "AuthWeakPasswordError", b10, "weak_password"), this.reasons = c10;
        }
      }
      class eb extends d2 {
        constructor(a10) {
          super(a10, "AuthInvalidJwtError", 400, "invalid_jwt");
        }
      }
      let ec = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""), ed = " 	\n\r=".split(""), ee = (() => {
        let a10 = Array(128);
        for (let b10 = 0; b10 < a10.length; b10 += 1) a10[b10] = -1;
        for (let b10 = 0; b10 < ed.length; b10 += 1) a10[ed[b10].charCodeAt(0)] = -2;
        for (let b10 = 0; b10 < ec.length; b10 += 1) a10[ec[b10].charCodeAt(0)] = b10;
        return a10;
      })();
      function ef(a10, b10, c10) {
        if (null !== a10) for (b10.queue = b10.queue << 8 | a10, b10.queuedBits += 8; b10.queuedBits >= 6; ) c10(ec[b10.queue >> b10.queuedBits - 6 & 63]), b10.queuedBits -= 6;
        else if (b10.queuedBits > 0) for (b10.queue = b10.queue << 6 - b10.queuedBits, b10.queuedBits = 6; b10.queuedBits >= 6; ) c10(ec[b10.queue >> b10.queuedBits - 6 & 63]), b10.queuedBits -= 6;
      }
      function eg(a10, b10, c10) {
        let d10 = ee[a10];
        if (d10 > -1) for (b10.queue = b10.queue << 6 | d10, b10.queuedBits += 6; b10.queuedBits >= 8; ) c10(b10.queue >> b10.queuedBits - 8 & 255), b10.queuedBits -= 8;
        else if (-2 === d10) return;
        else throw Error(`Invalid Base64-URL character "${String.fromCharCode(a10)}"`);
      }
      function eh(a10) {
        let b10 = [], c10 = (a11) => {
          b10.push(String.fromCodePoint(a11));
        }, d10 = { utf8seq: 0, codepoint: 0 }, e10 = { queue: 0, queuedBits: 0 }, f2 = (a11) => {
          !function(a12, b11, c11) {
            if (0 === b11.utf8seq) {
              if (a12 <= 127) return c11(a12);
              for (let c12 = 1; c12 < 6; c12 += 1) if ((a12 >> 7 - c12 & 1) == 0) {
                b11.utf8seq = c12;
                break;
              }
              if (2 === b11.utf8seq) b11.codepoint = 31 & a12;
              else if (3 === b11.utf8seq) b11.codepoint = 15 & a12;
              else if (4 === b11.utf8seq) b11.codepoint = 7 & a12;
              else throw Error("Invalid UTF-8 sequence");
              b11.utf8seq -= 1;
            } else if (b11.utf8seq > 0) {
              if (a12 <= 127) throw Error("Invalid UTF-8 sequence");
              b11.codepoint = b11.codepoint << 6 | 63 & a12, b11.utf8seq -= 1, 0 === b11.utf8seq && c11(b11.codepoint);
            }
          }(a11, d10, c10);
        };
        for (let b11 = 0; b11 < a10.length; b11 += 1) eg(a10.charCodeAt(b11), e10, f2);
        return b10.join("");
      }
      function ei(a10) {
        let b10 = [], c10 = { queue: 0, queuedBits: 0 }, d10 = (a11) => {
          b10.push(a11);
        };
        for (let b11 = 0; b11 < a10.length; b11 += 1) eg(a10.charCodeAt(b11), c10, d10);
        return new Uint8Array(b10);
      }
      function ej(a10) {
        let b10 = [], c10 = { queue: 0, queuedBits: 0 }, d10 = (a11) => {
          b10.push(a11);
        };
        return a10.forEach((a11) => ef(a11, c10, d10)), ef(null, c10, d10), b10.join("");
      }
      let ek = () => "u" > typeof window && "u" > typeof document, el = { tested: false, writable: false }, em = () => {
        if (!ek()) return false;
        try {
          if ("object" != typeof globalThis.localStorage) return false;
        } catch (a11) {
          return false;
        }
        if (el.tested) return el.writable;
        let a10 = `lswt-${Math.random()}${Math.random()}`;
        try {
          globalThis.localStorage.setItem(a10, a10), globalThis.localStorage.removeItem(a10), el.tested = true, el.writable = true;
        } catch (a11) {
          el.tested = true, el.writable = false;
        }
        return el.writable;
      }, en = (a10) => a10 ? (...b10) => a10(...b10) : (...a11) => fetch(...a11), eo = async (a10, b10, c10) => {
        await a10.setItem(b10, JSON.stringify(c10));
      }, ep = async (a10, b10) => {
        let c10 = await a10.getItem(b10);
        if (!c10) return null;
        try {
          return JSON.parse(c10);
        } catch (a11) {
          return c10;
        }
      }, eq = async (a10, b10) => {
        await a10.removeItem(b10);
      };
      class er {
        constructor() {
          this.promise = new er.promiseConstructor((a10, b10) => {
            this.resolve = a10, this.reject = b10;
          });
        }
      }
      function es(a10) {
        let b10 = a10.split(".");
        if (3 !== b10.length) throw new eb("Invalid JWT structure");
        for (let a11 = 0; a11 < b10.length; a11++) if (!dZ.test(b10[a11])) throw new eb("JWT not in base64url format");
        return { header: JSON.parse(eh(b10[0])), payload: JSON.parse(eh(b10[1])), signature: ei(b10[2]), raw: { header: b10[0], payload: b10[1] } };
      }
      async function et(a10) {
        return await new Promise((b10) => {
          setTimeout(() => b10(null), a10);
        });
      }
      function eu(a10) {
        return ("0" + a10.toString(16)).substr(-2);
      }
      async function ev(a10) {
        let b10 = new TextEncoder().encode(a10);
        return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", b10))).map((a11) => String.fromCharCode(a11)).join("");
      }
      async function ew(a10) {
        return "u" > typeof crypto && void 0 !== crypto.subtle && "u" > typeof TextEncoder ? btoa(await ev(a10)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : (console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."), a10);
      }
      async function ex(a10, b10, c10 = false) {
        let d10 = function() {
          let a11 = new Uint32Array(56);
          if ("u" < typeof crypto) {
            let a12 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~", b11 = a12.length, c11 = "";
            for (let d11 = 0; d11 < 56; d11++) c11 += a12.charAt(Math.floor(Math.random() * b11));
            return c11;
          }
          return crypto.getRandomValues(a11), Array.from(a11, eu).join("");
        }(), e10 = d10;
        c10 && (e10 += "/PASSWORD_RECOVERY"), await eo(a10, `${b10}-code-verifier`, e10);
        let f2 = await ew(d10), g2 = d10 === f2 ? "plain" : "s256";
        return [f2, g2];
      }
      er.promiseConstructor = Promise;
      let ey = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i, ez = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
      function eA(a10) {
        if (!ez.test(a10)) throw Error("@supabase/auth-js: Expected parameter to be UUID but is not");
      }
      function eB() {
        return new Proxy({}, { get: (a10, b10) => {
          if ("__isUserNotAvailableProxy" === b10) return true;
          if ("symbol" == typeof b10) {
            let a11 = b10.toString();
            if ("Symbol(Symbol.toPrimitive)" === a11 || "Symbol(Symbol.toStringTag)" === a11 || "Symbol(util.inspect.custom)" === a11) return;
          }
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${b10}" property of the session object is not supported. Please use getUser() instead.`);
        }, set: (a10, b10) => {
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${b10}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
        }, deleteProperty: (a10, b10) => {
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${b10}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
        } });
      }
      function eC(a10) {
        return JSON.parse(JSON.stringify(a10));
      }
      let eD = (a10) => a10.msg || a10.message || a10.error_description || a10.error || JSON.stringify(a10), eE = [502, 503, 504];
      async function eF(a10) {
        var b10;
        let c10, d10;
        if (!("object" == typeof a10 && null !== a10 && "status" in a10 && "ok" in a10 && "json" in a10 && "function" == typeof a10.json)) throw new d8(eD(a10), 0);
        if (eE.includes(a10.status)) throw new d8(eD(a10), a10.status);
        try {
          c10 = await a10.json();
        } catch (a11) {
          throw new d1(eD(a11), a11);
        }
        let e10 = function(a11) {
          let b11 = a11.headers.get(dX);
          if (!b11 || !b11.match(ey)) return null;
          try {
            return /* @__PURE__ */ new Date(`${b11}T00:00:00.0Z`);
          } catch (a12) {
            return null;
          }
        }(a10);
        if (e10 && e10.getTime() >= dY["2024-01-01"].timestamp && "object" == typeof c10 && c10 && "string" == typeof c10.code ? d10 = c10.code : "object" == typeof c10 && c10 && "string" == typeof c10.error_code && (d10 = c10.error_code), d10) {
          if ("weak_password" === d10) throw new ea(eD(c10), a10.status, (null == (b10 = c10.weak_password) ? void 0 : b10.reasons) || []);
          else if ("session_not_found" === d10) throw new d3();
        } else if ("object" == typeof c10 && c10 && "object" == typeof c10.weak_password && c10.weak_password && Array.isArray(c10.weak_password.reasons) && c10.weak_password.reasons.length && c10.weak_password.reasons.reduce((a11, b11) => a11 && "string" == typeof b11, true)) throw new ea(eD(c10), a10.status, c10.weak_password.reasons);
        throw new d0(eD(c10), a10.status || 500, d10);
      }
      async function eG(a10, b10, c10, d10) {
        var e10;
        let f2 = Object.assign({}, null == d10 ? void 0 : d10.headers);
        f2[dX] || (f2[dX] = dY["2024-01-01"].name), (null == d10 ? void 0 : d10.jwt) && (f2.Authorization = `Bearer ${d10.jwt}`);
        let g2 = null != (e10 = null == d10 ? void 0 : d10.query) ? e10 : {};
        (null == d10 ? void 0 : d10.redirectTo) && (g2.redirect_to = d10.redirectTo);
        let h2 = Object.keys(g2).length ? "?" + new URLSearchParams(g2).toString() : "", i2 = await eH(a10, b10, c10 + h2, { headers: f2, noResolveJson: null == d10 ? void 0 : d10.noResolveJson }, {}, null == d10 ? void 0 : d10.body);
        return (null == d10 ? void 0 : d10.xform) ? null == d10 ? void 0 : d10.xform(i2) : { data: Object.assign({}, i2), error: null };
      }
      async function eH(a10, b10, c10, d10, e10, f2) {
        let g2, h2, i2 = (h2 = { method: b10, headers: (null == d10 ? void 0 : d10.headers) || {} }, "GET" === b10 ? h2 : (h2.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, null == d10 ? void 0 : d10.headers), h2.body = JSON.stringify(f2), Object.assign(Object.assign({}, h2), e10)));
        try {
          g2 = await a10(c10, Object.assign({}, i2));
        } catch (a11) {
          throw console.error(a11), new d8(eD(a11), 0);
        }
        if (g2.ok || await eF(g2), null == d10 ? void 0 : d10.noResolveJson) return g2;
        try {
          return await g2.json();
        } catch (a11) {
          await eF(a11);
        }
      }
      function eI(a10) {
        var b10, c10, d10;
        let e10 = null;
        (d10 = a10).access_token && d10.refresh_token && d10.expires_in && (e10 = Object.assign({}, a10), a10.expires_at || (e10.expires_at = (c10 = a10.expires_in, Math.round(Date.now() / 1e3) + c10)));
        return { data: { session: e10, user: null != (b10 = a10.user) ? b10 : a10 }, error: null };
      }
      function eJ(a10) {
        let b10 = eI(a10);
        return !b10.error && a10.weak_password && "object" == typeof a10.weak_password && Array.isArray(a10.weak_password.reasons) && a10.weak_password.reasons.length && a10.weak_password.message && "string" == typeof a10.weak_password.message && a10.weak_password.reasons.reduce((a11, b11) => a11 && "string" == typeof b11, true) && (b10.data.weak_password = a10.weak_password), b10;
      }
      function eK(a10) {
        var b10;
        return { data: { user: null != (b10 = a10.user) ? b10 : a10 }, error: null };
      }
      function eL(a10) {
        return { data: a10, error: null };
      }
      function eM(a10) {
        let { action_link: b10, email_otp: c10, hashed_token: d10, redirect_to: e10, verification_type: f2 } = a10;
        return { data: { properties: { action_link: b10, email_otp: c10, hashed_token: d10, redirect_to: e10, verification_type: f2 }, user: Object.assign({}, (0, cH.__rest)(a10, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"])) }, error: null };
      }
      function eN(a10) {
        return a10;
      }
      let eO = ["global", "local", "others"];
      class eP {
        constructor({ url: a10 = "", headers: b10 = {}, fetch: c10 }) {
          this.url = a10, this.headers = b10, this.fetch = en(c10), this.mfa = { listFactors: this._listFactors.bind(this), deleteFactor: this._deleteFactor.bind(this) }, this.oauth = { listClients: this._listOAuthClients.bind(this), createClient: this._createOAuthClient.bind(this), getClient: this._getOAuthClient.bind(this), updateClient: this._updateOAuthClient.bind(this), deleteClient: this._deleteOAuthClient.bind(this), regenerateClientSecret: this._regenerateOAuthClientSecret.bind(this) };
        }
        async signOut(a10, b10 = eO[0]) {
          if (0 > eO.indexOf(b10)) throw Error(`@supabase/auth-js: Parameter scope must be one of ${eO.join(", ")}`);
          try {
            return await eG(this.fetch, "POST", `${this.url}/logout?scope=${b10}`, { headers: this.headers, jwt: a10, noResolveJson: true }), { data: null, error: null };
          } catch (a11) {
            if (d_(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async inviteUserByEmail(a10, b10 = {}) {
          try {
            return await eG(this.fetch, "POST", `${this.url}/invite`, { body: { email: a10, data: b10.data }, headers: this.headers, redirectTo: b10.redirectTo, xform: eK });
          } catch (a11) {
            if (d_(a11)) return { data: { user: null }, error: a11 };
            throw a11;
          }
        }
        async generateLink(a10) {
          try {
            let { options: b10 } = a10, c10 = (0, cH.__rest)(a10, ["options"]), d10 = Object.assign(Object.assign({}, c10), b10);
            return "newEmail" in c10 && (d10.new_email = null == c10 ? void 0 : c10.newEmail, delete d10.newEmail), await eG(this.fetch, "POST", `${this.url}/admin/generate_link`, { body: d10, headers: this.headers, xform: eM, redirectTo: null == b10 ? void 0 : b10.redirectTo });
          } catch (a11) {
            if (d_(a11)) return { data: { properties: null, user: null }, error: a11 };
            throw a11;
          }
        }
        async createUser(a10) {
          try {
            return await eG(this.fetch, "POST", `${this.url}/admin/users`, { body: a10, headers: this.headers, xform: eK });
          } catch (a11) {
            if (d_(a11)) return { data: { user: null }, error: a11 };
            throw a11;
          }
        }
        async listUsers(a10) {
          var b10, c10, d10, e10, f2, g2, h2;
          try {
            let i2 = { nextPage: null, lastPage: 0, total: 0 }, j2 = await eG(this.fetch, "GET", `${this.url}/admin/users`, { headers: this.headers, noResolveJson: true, query: { page: null != (c10 = null == (b10 = null == a10 ? void 0 : a10.page) ? void 0 : b10.toString()) ? c10 : "", per_page: null != (e10 = null == (d10 = null == a10 ? void 0 : a10.perPage) ? void 0 : d10.toString()) ? e10 : "" }, xform: eN });
            if (j2.error) throw j2.error;
            let k2 = await j2.json(), l2 = null != (f2 = j2.headers.get("x-total-count")) ? f2 : 0, m2 = null != (h2 = null == (g2 = j2.headers.get("link")) ? void 0 : g2.split(",")) ? h2 : [];
            return m2.length > 0 && (m2.forEach((a11) => {
              let b11 = parseInt(a11.split(";")[0].split("=")[1].substring(0, 1)), c11 = JSON.parse(a11.split(";")[1].split("=")[1]);
              i2[`${c11}Page`] = b11;
            }), i2.total = parseInt(l2)), { data: Object.assign(Object.assign({}, k2), i2), error: null };
          } catch (a11) {
            if (d_(a11)) return { data: { users: [] }, error: a11 };
            throw a11;
          }
        }
        async getUserById(a10) {
          eA(a10);
          try {
            return await eG(this.fetch, "GET", `${this.url}/admin/users/${a10}`, { headers: this.headers, xform: eK });
          } catch (a11) {
            if (d_(a11)) return { data: { user: null }, error: a11 };
            throw a11;
          }
        }
        async updateUserById(a10, b10) {
          eA(a10);
          try {
            return await eG(this.fetch, "PUT", `${this.url}/admin/users/${a10}`, { body: b10, headers: this.headers, xform: eK });
          } catch (a11) {
            if (d_(a11)) return { data: { user: null }, error: a11 };
            throw a11;
          }
        }
        async deleteUser(a10, b10 = false) {
          eA(a10);
          try {
            return await eG(this.fetch, "DELETE", `${this.url}/admin/users/${a10}`, { headers: this.headers, body: { should_soft_delete: b10 }, xform: eK });
          } catch (a11) {
            if (d_(a11)) return { data: { user: null }, error: a11 };
            throw a11;
          }
        }
        async _listFactors(a10) {
          eA(a10.userId);
          try {
            let { data: b10, error: c10 } = await eG(this.fetch, "GET", `${this.url}/admin/users/${a10.userId}/factors`, { headers: this.headers, xform: (a11) => ({ data: { factors: a11 }, error: null }) });
            return { data: b10, error: c10 };
          } catch (a11) {
            if (d_(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async _deleteFactor(a10) {
          eA(a10.userId), eA(a10.id);
          try {
            return { data: await eG(this.fetch, "DELETE", `${this.url}/admin/users/${a10.userId}/factors/${a10.id}`, { headers: this.headers }), error: null };
          } catch (a11) {
            if (d_(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async _listOAuthClients(a10) {
          var b10, c10, d10, e10, f2, g2, h2;
          try {
            let i2 = { nextPage: null, lastPage: 0, total: 0 }, j2 = await eG(this.fetch, "GET", `${this.url}/admin/oauth/clients`, { headers: this.headers, noResolveJson: true, query: { page: null != (c10 = null == (b10 = null == a10 ? void 0 : a10.page) ? void 0 : b10.toString()) ? c10 : "", per_page: null != (e10 = null == (d10 = null == a10 ? void 0 : a10.perPage) ? void 0 : d10.toString()) ? e10 : "" }, xform: eN });
            if (j2.error) throw j2.error;
            let k2 = await j2.json(), l2 = null != (f2 = j2.headers.get("x-total-count")) ? f2 : 0, m2 = null != (h2 = null == (g2 = j2.headers.get("link")) ? void 0 : g2.split(",")) ? h2 : [];
            return m2.length > 0 && (m2.forEach((a11) => {
              let b11 = parseInt(a11.split(";")[0].split("=")[1].substring(0, 1)), c11 = JSON.parse(a11.split(";")[1].split("=")[1]);
              i2[`${c11}Page`] = b11;
            }), i2.total = parseInt(l2)), { data: Object.assign(Object.assign({}, k2), i2), error: null };
          } catch (a11) {
            if (d_(a11)) return { data: { clients: [] }, error: a11 };
            throw a11;
          }
        }
        async _createOAuthClient(a10) {
          try {
            return await eG(this.fetch, "POST", `${this.url}/admin/oauth/clients`, { body: a10, headers: this.headers, xform: (a11) => ({ data: a11, error: null }) });
          } catch (a11) {
            if (d_(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async _getOAuthClient(a10) {
          try {
            return await eG(this.fetch, "GET", `${this.url}/admin/oauth/clients/${a10}`, { headers: this.headers, xform: (a11) => ({ data: a11, error: null }) });
          } catch (a11) {
            if (d_(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async _updateOAuthClient(a10, b10) {
          try {
            return await eG(this.fetch, "PUT", `${this.url}/admin/oauth/clients/${a10}`, { body: b10, headers: this.headers, xform: (a11) => ({ data: a11, error: null }) });
          } catch (a11) {
            if (d_(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async _deleteOAuthClient(a10) {
          try {
            return await eG(this.fetch, "DELETE", `${this.url}/admin/oauth/clients/${a10}`, { headers: this.headers, noResolveJson: true }), { data: null, error: null };
          } catch (a11) {
            if (d_(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
        async _regenerateOAuthClientSecret(a10) {
          try {
            return await eG(this.fetch, "POST", `${this.url}/admin/oauth/clients/${a10}/regenerate_secret`, { headers: this.headers, xform: (a11) => ({ data: a11, error: null }) });
          } catch (a11) {
            if (d_(a11)) return { data: null, error: a11 };
            throw a11;
          }
        }
      }
      function eQ(a10 = {}) {
        return { getItem: (b10) => a10[b10] || null, setItem: (b10, c10) => {
          a10[b10] = c10;
        }, removeItem: (b10) => {
          delete a10[b10];
        } };
      }
      let eR = { debug: !!(globalThis && em() && globalThis.localStorage && "true" === globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug")) };
      class eS extends Error {
        constructor(a10) {
          super(a10), this.isAcquireTimeout = true;
        }
      }
      class eT extends eS {
      }
      async function eU(a10, b10, c10) {
        eR.debug && console.log("@supabase/gotrue-js: navigatorLock: acquire lock", a10, b10);
        let d10 = new globalThis.AbortController();
        return b10 > 0 && setTimeout(() => {
          d10.abort(), eR.debug && console.log("@supabase/gotrue-js: navigatorLock acquire timed out", a10);
        }, b10), await Promise.resolve().then(() => globalThis.navigator.locks.request(a10, 0 === b10 ? { mode: "exclusive", ifAvailable: true } : { mode: "exclusive", signal: d10.signal }, async (d11) => {
          if (d11) {
            eR.debug && console.log("@supabase/gotrue-js: navigatorLock: acquired", a10, d11.name);
            try {
              return await c10();
            } finally {
              eR.debug && console.log("@supabase/gotrue-js: navigatorLock: released", a10, d11.name);
            }
          }
          if (0 === b10) throw eR.debug && console.log("@supabase/gotrue-js: navigatorLock: not immediately available", a10), new eT(`Acquiring an exclusive Navigator LockManager lock "${a10}" immediately failed`);
          if (eR.debug) try {
            let a11 = await globalThis.navigator.locks.query();
            console.log("@supabase/gotrue-js: Navigator LockManager state", JSON.stringify(a11, null, "  "));
          } catch (a11) {
            console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state", a11);
          }
          return console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request"), await c10();
        }));
      }
      function eV(a10) {
        if (!/^0x[a-fA-F0-9]{40}$/.test(a10)) throw Error(`@supabase/auth-js: Address "${a10}" is invalid.`);
        return a10.toLowerCase();
      }
      class eW extends Error {
        constructor({ message: a10, code: b10, cause: c10, name: d10 }) {
          var e10;
          super(a10, { cause: c10 }), this.__isWebAuthnError = true, this.name = null != (e10 = null != d10 ? d10 : c10 instanceof Error ? c10.name : void 0) ? e10 : "Unknown Error", this.code = b10;
        }
      }
      class eX extends eW {
        constructor(a10, b10) {
          super({ code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: b10, message: a10 }), this.name = "WebAuthnUnknownError", this.originalError = b10;
        }
      }
      class eY {
        createNewAbortSignal() {
          if (this.controller) {
            let a11 = Error("Cancelling existing WebAuthn API call for new one");
            a11.name = "AbortError", this.controller.abort(a11);
          }
          let a10 = new AbortController();
          return this.controller = a10, a10.signal;
        }
        cancelCeremony() {
          if (this.controller) {
            let a10 = Error("Manually cancelling existing WebAuthn API call");
            a10.name = "AbortError", this.controller.abort(a10), this.controller = void 0;
          }
        }
      }
      let eZ = new eY();
      function e$(a10) {
        return "localhost" === a10 || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(a10);
      }
      function e_() {
        var a10, b10;
        return !!(ek() && "PublicKeyCredential" in window && window.PublicKeyCredential && "credentials" in navigator && "function" == typeof (null == (a10 = null == navigator ? void 0 : navigator.credentials) ? void 0 : a10.create) && "function" == typeof (null == (b10 = null == navigator ? void 0 : navigator.credentials) ? void 0 : b10.get));
      }
      async function e0(a10) {
        try {
          let b10 = await navigator.credentials.create(a10);
          if (!b10) return { data: null, error: new eX("Empty credential response", b10) };
          if (!(b10 instanceof PublicKeyCredential)) return { data: null, error: new eX("Browser returned unexpected credential type", b10) };
          return { data: b10, error: null };
        } catch (b10) {
          return { data: null, error: function({ error: a11, options: b11 }) {
            var c10, d10, e10;
            let { publicKey: f2 } = b11;
            if (!f2) throw Error("options was missing required publicKey property");
            if ("AbortError" === a11.name) {
              if (b11.signal instanceof AbortSignal) return new eW({ message: "Registration ceremony was sent an abort signal", code: "ERROR_CEREMONY_ABORTED", cause: a11 });
            } else if ("ConstraintError" === a11.name) {
              if ((null == (c10 = f2.authenticatorSelection) ? void 0 : c10.requireResidentKey) === true) return new eW({ message: "Discoverable credentials were required but no available authenticator supported it", code: "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT", cause: a11 });
              else if ("conditional" === b11.mediation && (null == (d10 = f2.authenticatorSelection) ? void 0 : d10.userVerification) === "required") return new eW({ message: "User verification was required during automatic registration but it could not be performed", code: "ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE", cause: a11 });
              else if ((null == (e10 = f2.authenticatorSelection) ? void 0 : e10.userVerification) === "required") return new eW({ message: "User verification was required but no available authenticator supported it", code: "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT", cause: a11 });
            } else if ("InvalidStateError" === a11.name) return new eW({ message: "The authenticator was previously registered", code: "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED", cause: a11 });
            else if ("NotAllowedError" === a11.name) return new eW({ message: a11.message, code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: a11 });
            else if ("NotSupportedError" === a11.name) return new eW(0 === f2.pubKeyCredParams.filter((a12) => "public-key" === a12.type).length ? { message: 'No entry in pubKeyCredParams was of type "public-key"', code: "ERROR_MALFORMED_PUBKEYCREDPARAMS", cause: a11 } : { message: "No available authenticator supported any of the specified pubKeyCredParams algorithms", code: "ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG", cause: a11 });
            else if ("SecurityError" === a11.name) {
              let b12 = window.location.hostname;
              if (!e$(b12)) return new eW({ message: `${window.location.hostname} is an invalid domain`, code: "ERROR_INVALID_DOMAIN", cause: a11 });
              if (f2.rp.id !== b12) return new eW({ message: `The RP ID "${f2.rp.id}" is invalid for this domain`, code: "ERROR_INVALID_RP_ID", cause: a11 });
            } else if ("TypeError" === a11.name) {
              if (f2.user.id.byteLength < 1 || f2.user.id.byteLength > 64) return new eW({ message: "User ID was not between 1 and 64 characters", code: "ERROR_INVALID_USER_ID_LENGTH", cause: a11 });
            } else if ("UnknownError" === a11.name) return new eW({ message: "The authenticator was unable to process the specified options, or could not create a new credential", code: "ERROR_AUTHENTICATOR_GENERAL_ERROR", cause: a11 });
            return new eW({ message: "a Non-Webauthn related error has occurred", code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: a11 });
          }({ error: b10, options: a10 }) };
        }
      }
      async function e1(a10) {
        try {
          let b10 = await navigator.credentials.get(a10);
          if (!b10) return { data: null, error: new eX("Empty credential response", b10) };
          if (!(b10 instanceof PublicKeyCredential)) return { data: null, error: new eX("Browser returned unexpected credential type", b10) };
          return { data: b10, error: null };
        } catch (b10) {
          return { data: null, error: function({ error: a11, options: b11 }) {
            let { publicKey: c10 } = b11;
            if (!c10) throw Error("options was missing required publicKey property");
            if ("AbortError" === a11.name) {
              if (b11.signal instanceof AbortSignal) return new eW({ message: "Authentication ceremony was sent an abort signal", code: "ERROR_CEREMONY_ABORTED", cause: a11 });
            } else if ("NotAllowedError" === a11.name) return new eW({ message: a11.message, code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: a11 });
            else if ("SecurityError" === a11.name) {
              let b12 = window.location.hostname;
              if (!e$(b12)) return new eW({ message: `${window.location.hostname} is an invalid domain`, code: "ERROR_INVALID_DOMAIN", cause: a11 });
              if (c10.rpId !== b12) return new eW({ message: `The RP ID "${c10.rpId}" is invalid for this domain`, code: "ERROR_INVALID_RP_ID", cause: a11 });
            } else if ("UnknownError" === a11.name) return new eW({ message: "The authenticator was unable to process the specified options, or could not create a new assertion signature", code: "ERROR_AUTHENTICATOR_GENERAL_ERROR", cause: a11 });
            return new eW({ message: "a Non-Webauthn related error has occurred", code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: a11 });
          }({ error: b10, options: a10 }) };
        }
      }
      let e2 = { hints: ["security-key"], authenticatorSelection: { authenticatorAttachment: "cross-platform", requireResidentKey: false, userVerification: "preferred", residentKey: "discouraged" }, attestation: "direct" }, e3 = { userVerification: "preferred", hints: ["security-key"], attestation: "direct" };
      function e4(...a10) {
        let b10 = (a11) => null !== a11 && "object" == typeof a11 && !Array.isArray(a11), c10 = (a11) => a11 instanceof ArrayBuffer || ArrayBuffer.isView(a11), d10 = {};
        for (let e10 of a10) if (e10) for (let a11 in e10) {
          let f2 = e10[a11];
          if (void 0 !== f2) if (Array.isArray(f2)) d10[a11] = f2;
          else if (c10(f2)) d10[a11] = f2;
          else if (b10(f2)) {
            let c11 = d10[a11];
            b10(c11) ? d10[a11] = e4(c11, f2) : d10[a11] = e4(f2);
          } else d10[a11] = f2;
        }
        return d10;
      }
      class e5 {
        constructor(a10) {
          this.client = a10, this.enroll = this._enroll.bind(this), this.challenge = this._challenge.bind(this), this.verify = this._verify.bind(this), this.authenticate = this._authenticate.bind(this), this.register = this._register.bind(this);
        }
        async _enroll(a10) {
          return this.client.mfa.enroll(Object.assign(Object.assign({}, a10), { factorType: "webauthn" }));
        }
        async _challenge({ factorId: a10, webauthn: b10, friendlyName: c10, signal: d10 }, e10) {
          try {
            var f2, g2, h2, i2;
            let { data: j2, error: k2 } = await this.client.mfa.challenge({ factorId: a10, webauthn: b10 });
            if (!j2) return { data: null, error: k2 };
            let l2 = null != d10 ? d10 : eZ.createNewAbortSignal();
            if ("create" === j2.webauthn.type) {
              let { user: a11 } = j2.webauthn.credential_options.publicKey;
              a11.name || (a11.name = `${a11.id}:${c10}`), a11.displayName || (a11.displayName = a11.name);
            }
            switch (j2.webauthn.type) {
              case "create": {
                let b11 = (f2 = j2.webauthn.credential_options.publicKey, g2 = null == e10 ? void 0 : e10.create, e4(e2, f2, g2 || {})), { data: c11, error: d11 } = await e0({ publicKey: b11, signal: l2 });
                if (c11) return { data: { factorId: a10, challengeId: j2.id, webauthn: { type: j2.webauthn.type, credential_response: c11 } }, error: null };
                return { data: null, error: d11 };
              }
              case "request": {
                let b11 = (h2 = j2.webauthn.credential_options.publicKey, i2 = null == e10 ? void 0 : e10.request, e4(e3, h2, i2 || {})), { data: c11, error: d11 } = await e1(Object.assign(Object.assign({}, j2.webauthn.credential_options), { publicKey: b11, signal: l2 }));
                if (c11) return { data: { factorId: a10, challengeId: j2.id, webauthn: { type: j2.webauthn.type, credential_response: c11 } }, error: null };
                return { data: null, error: d11 };
              }
            }
          } catch (a11) {
            if (d_(a11)) return { data: null, error: a11 };
            return { data: null, error: new d1("Unexpected error in challenge", a11) };
          }
        }
        async _verify({ challengeId: a10, factorId: b10, webauthn: c10 }) {
          return this.client.mfa.verify({ factorId: b10, challengeId: a10, webauthn: c10 });
        }
        async _authenticate({ factorId: a10, webauthn: { rpId: b10 = "u" > typeof window ? window.location.hostname : void 0, rpOrigins: c10 = "u" > typeof window ? [window.location.origin] : void 0, signal: d10 } = {} }, e10) {
          if (!b10) return { data: null, error: new d$("rpId is required for WebAuthn authentication") };
          try {
            if (!e_()) return { data: null, error: new d1("Browser does not support WebAuthn", null) };
            let { data: f2, error: g2 } = await this.challenge({ factorId: a10, webauthn: { rpId: b10, rpOrigins: c10 }, signal: d10 }, { request: e10 });
            if (!f2) return { data: null, error: g2 };
            let { webauthn: h2 } = f2;
            return this._verify({ factorId: a10, challengeId: f2.challengeId, webauthn: { type: h2.type, rpId: b10, rpOrigins: c10, credential_response: h2.credential_response } });
          } catch (a11) {
            if (d_(a11)) return { data: null, error: a11 };
            return { data: null, error: new d1("Unexpected error in authenticate", a11) };
          }
        }
        async _register({ friendlyName: a10, webauthn: { rpId: b10 = "u" > typeof window ? window.location.hostname : void 0, rpOrigins: c10 = "u" > typeof window ? [window.location.origin] : void 0, signal: d10 } = {} }, e10) {
          if (!b10) return { data: null, error: new d$("rpId is required for WebAuthn registration") };
          try {
            if (!e_()) return { data: null, error: new d1("Browser does not support WebAuthn", null) };
            let { data: f2, error: g2 } = await this._enroll({ friendlyName: a10 });
            if (!f2) return await this.client.mfa.listFactors().then((b11) => {
              var c11;
              return null == (c11 = b11.data) ? void 0 : c11.all.find((b12) => "webauthn" === b12.factor_type && b12.friendly_name === a10 && "unverified" !== b12.status);
            }).then((a11) => a11 ? this.client.mfa.unenroll({ factorId: null == a11 ? void 0 : a11.id }) : void 0), { data: null, error: g2 };
            let { data: h2, error: i2 } = await this._challenge({ factorId: f2.id, friendlyName: f2.friendly_name, webauthn: { rpId: b10, rpOrigins: c10 }, signal: d10 }, { create: e10 });
            if (!h2) return { data: null, error: i2 };
            return this._verify({ factorId: f2.id, challengeId: h2.challengeId, webauthn: { rpId: b10, rpOrigins: c10, type: h2.webauthn.type, credential_response: h2.webauthn.credential_response } });
          } catch (a11) {
            if (d_(a11)) return { data: null, error: a11 };
            return { data: null, error: new d1("Unexpected error in register", a11) };
          }
        }
      }
      if ("object" != typeof globalThis) try {
        Object.defineProperty(Object.prototype, "__magic__", { get: function() {
          return this;
        }, configurable: true }), __magic__.globalThis = __magic__, delete Object.prototype.__magic__;
      } catch (a10) {
        "u" > typeof self && (self.globalThis = self);
      }
      let e6 = { url: "http://localhost:9999", storageKey: "supabase.auth.token", autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, headers: dW, flowType: "implicit", debug: false, hasCustomAuthorizationHeader: false, throwOnError: false };
      async function e7(a10, b10, c10) {
        return await c10();
      }
      let e8 = {};
      class e9 {
        get jwks() {
          var a10, b10;
          return null != (b10 = null == (a10 = e8[this.storageKey]) ? void 0 : a10.jwks) ? b10 : { keys: [] };
        }
        set jwks(a10) {
          e8[this.storageKey] = Object.assign(Object.assign({}, e8[this.storageKey]), { jwks: a10 });
        }
        get jwks_cached_at() {
          var a10, b10;
          return null != (b10 = null == (a10 = e8[this.storageKey]) ? void 0 : a10.cachedAt) ? b10 : Number.MIN_SAFE_INTEGER;
        }
        set jwks_cached_at(a10) {
          e8[this.storageKey] = Object.assign(Object.assign({}, e8[this.storageKey]), { cachedAt: a10 });
        }
        constructor(a10) {
          var b10, c10, d10;
          this.userStorage = null, this.memoryStorage = null, this.stateChangeEmitters = /* @__PURE__ */ new Map(), this.autoRefreshTicker = null, this.visibilityChangedCallback = null, this.refreshingDeferred = null, this.initializePromise = null, this.detectSessionInUrl = true, this.hasCustomAuthorizationHeader = false, this.suppressGetSessionWarning = false, this.lockAcquired = false, this.pendingInLock = [], this.broadcastChannel = null, this.logger = console.log;
          const e10 = Object.assign(Object.assign({}, e6), a10);
          if (this.storageKey = e10.storageKey, this.instanceID = null != (b10 = e9.nextInstanceID[this.storageKey]) ? b10 : 0, e9.nextInstanceID[this.storageKey] = this.instanceID + 1, this.logDebugMessages = !!e10.debug, "function" == typeof e10.debug && (this.logger = e10.debug), this.instanceID > 0 && ek()) {
            const a11 = `${this._logPrefix()} Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.`;
            console.warn(a11), this.logDebugMessages && console.trace(a11);
          }
          if (this.persistSession = e10.persistSession, this.autoRefreshToken = e10.autoRefreshToken, this.admin = new eP({ url: e10.url, headers: e10.headers, fetch: e10.fetch }), this.url = e10.url, this.headers = e10.headers, this.fetch = en(e10.fetch), this.lock = e10.lock || e7, this.detectSessionInUrl = e10.detectSessionInUrl, this.flowType = e10.flowType, this.hasCustomAuthorizationHeader = e10.hasCustomAuthorizationHeader, this.throwOnError = e10.throwOnError, e10.lock ? this.lock = e10.lock : ek() && (null == (c10 = null == globalThis ? void 0 : globalThis.navigator) ? void 0 : c10.locks) ? this.lock = eU : this.lock = e7, this.jwks || (this.jwks = { keys: [] }, this.jwks_cached_at = Number.MIN_SAFE_INTEGER), this.mfa = { verify: this._verify.bind(this), enroll: this._enroll.bind(this), unenroll: this._unenroll.bind(this), challenge: this._challenge.bind(this), listFactors: this._listFactors.bind(this), challengeAndVerify: this._challengeAndVerify.bind(this), getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this), webauthn: new e5(this) }, this.oauth = { getAuthorizationDetails: this._getAuthorizationDetails.bind(this), approveAuthorization: this._approveAuthorization.bind(this), denyAuthorization: this._denyAuthorization.bind(this) }, this.persistSession ? (e10.storage ? this.storage = e10.storage : em() ? this.storage = globalThis.localStorage : (this.memoryStorage = {}, this.storage = eQ(this.memoryStorage)), e10.userStorage && (this.userStorage = e10.userStorage)) : (this.memoryStorage = {}, this.storage = eQ(this.memoryStorage)), ek() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
            try {
              this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
            } catch (a11) {
              console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", a11);
            }
            null == (d10 = this.broadcastChannel) || d10.addEventListener("message", async (a11) => {
              this._debug("received broadcast notification from other tab or client", a11), await this._notifyAllSubscribers(a11.data.event, a11.data.session, false);
            });
          }
          this.initialize();
        }
        isThrowOnErrorEnabled() {
          return this.throwOnError;
        }
        _returnResult(a10) {
          if (this.throwOnError && a10 && a10.error) throw a10.error;
          return a10;
        }
        _logPrefix() {
          return `GoTrueClient@${this.storageKey}:${this.instanceID} (${dV}) ${(/* @__PURE__ */ new Date()).toISOString()}`;
        }
        _debug(...a10) {
          return this.logDebugMessages && this.logger(this._logPrefix(), ...a10), this;
        }
        async initialize() {
          return this.initializePromise || (this.initializePromise = (async () => await this._acquireLock(-1, async () => await this._initialize()))()), await this.initializePromise;
        }
        async _initialize() {
          var a10;
          try {
            let b10 = {}, c10 = "none";
            if (ek() && (b10 = function(a11) {
              let b11 = {}, c11 = new URL(a11);
              if (c11.hash && "#" === c11.hash[0]) try {
                new URLSearchParams(c11.hash.substring(1)).forEach((a12, c12) => {
                  b11[c12] = a12;
                });
              } catch (a12) {
              }
              return c11.searchParams.forEach((a12, c12) => {
                b11[c12] = a12;
              }), b11;
            }(window.location.href), this._isImplicitGrantCallback(b10) ? c10 = "implicit" : await this._isPKCECallback(b10) && (c10 = "pkce")), ek() && this.detectSessionInUrl && "none" !== c10) {
              let { data: d10, error: e10 } = await this._getSessionFromURL(b10, c10);
              if (e10) {
                if (this._debug("#_initialize()", "error detecting session from URL", e10), d_(e10) && "AuthImplicitGrantRedirectError" === e10.name) {
                  let b11 = null == (a10 = e10.details) ? void 0 : a10.code;
                  if ("identity_already_exists" === b11 || "identity_not_found" === b11 || "single_identity_not_deletable" === b11) return { error: e10 };
                }
                return await this._removeSession(), { error: e10 };
              }
              let { session: f2, redirectType: g2 } = d10;
              return this._debug("#_initialize()", "detected session in URL", f2, "redirect type", g2), await this._saveSession(f2), setTimeout(async () => {
                "recovery" === g2 ? await this._notifyAllSubscribers("PASSWORD_RECOVERY", f2) : await this._notifyAllSubscribers("SIGNED_IN", f2);
              }, 0), { error: null };
            }
            return await this._recoverAndRefresh(), { error: null };
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ error: a11 });
            return this._returnResult({ error: new d1("Unexpected error during initialization", a11) });
          } finally {
            await this._handleVisibilityChange(), this._debug("#_initialize()", "end");
          }
        }
        async signInAnonymously(a10) {
          var b10, c10, d10;
          try {
            let { data: e10, error: f2 } = await eG(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, body: { data: null != (c10 = null == (b10 = null == a10 ? void 0 : a10.options) ? void 0 : b10.data) ? c10 : {}, gotrue_meta_security: { captcha_token: null == (d10 = null == a10 ? void 0 : a10.options) ? void 0 : d10.captchaToken } }, xform: eI });
            if (f2 || !e10) return this._returnResult({ data: { user: null, session: null }, error: f2 });
            let g2 = e10.session, h2 = e10.user;
            return e10.session && (await this._saveSession(e10.session), await this._notifyAllSubscribers("SIGNED_IN", g2)), this._returnResult({ data: { user: h2, session: g2 }, error: null });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async signUp(a10) {
          var b10, c10, d10;
          try {
            let e10;
            if ("email" in a10) {
              let { email: c11, password: d11, options: f3 } = a10, g3 = null, h3 = null;
              "pkce" === this.flowType && ([g3, h3] = await ex(this.storage, this.storageKey)), e10 = await eG(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, redirectTo: null == f3 ? void 0 : f3.emailRedirectTo, body: { email: c11, password: d11, data: null != (b10 = null == f3 ? void 0 : f3.data) ? b10 : {}, gotrue_meta_security: { captcha_token: null == f3 ? void 0 : f3.captchaToken }, code_challenge: g3, code_challenge_method: h3 }, xform: eI });
            } else if ("phone" in a10) {
              let { phone: b11, password: f3, options: g3 } = a10;
              e10 = await eG(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, body: { phone: b11, password: f3, data: null != (c10 = null == g3 ? void 0 : g3.data) ? c10 : {}, channel: null != (d10 = null == g3 ? void 0 : g3.channel) ? d10 : "sms", gotrue_meta_security: { captcha_token: null == g3 ? void 0 : g3.captchaToken } }, xform: eI });
            } else throw new d5("You must provide either an email or phone number and a password");
            let { data: f2, error: g2 } = e10;
            if (g2 || !f2) return this._returnResult({ data: { user: null, session: null }, error: g2 });
            let h2 = f2.session, i2 = f2.user;
            return f2.session && (await this._saveSession(f2.session), await this._notifyAllSubscribers("SIGNED_IN", h2)), this._returnResult({ data: { user: i2, session: h2 }, error: null });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async signInWithPassword(a10) {
          try {
            let b10;
            if ("email" in a10) {
              let { email: c11, password: d11, options: e10 } = a10;
              b10 = await eG(this.fetch, "POST", `${this.url}/token?grant_type=password`, { headers: this.headers, body: { email: c11, password: d11, gotrue_meta_security: { captcha_token: null == e10 ? void 0 : e10.captchaToken } }, xform: eJ });
            } else if ("phone" in a10) {
              let { phone: c11, password: d11, options: e10 } = a10;
              b10 = await eG(this.fetch, "POST", `${this.url}/token?grant_type=password`, { headers: this.headers, body: { phone: c11, password: d11, gotrue_meta_security: { captcha_token: null == e10 ? void 0 : e10.captchaToken } }, xform: eJ });
            } else throw new d5("You must provide either an email or phone number and a password");
            let { data: c10, error: d10 } = b10;
            if (d10) return this._returnResult({ data: { user: null, session: null }, error: d10 });
            if (!c10 || !c10.session || !c10.user) {
              let a11 = new d4();
              return this._returnResult({ data: { user: null, session: null }, error: a11 });
            }
            return c10.session && (await this._saveSession(c10.session), await this._notifyAllSubscribers("SIGNED_IN", c10.session)), this._returnResult({ data: Object.assign({ user: c10.user, session: c10.session }, c10.weak_password ? { weakPassword: c10.weak_password } : null), error: d10 });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async signInWithOAuth(a10) {
          var b10, c10, d10, e10;
          return await this._handleProviderSignIn(a10.provider, { redirectTo: null == (b10 = a10.options) ? void 0 : b10.redirectTo, scopes: null == (c10 = a10.options) ? void 0 : c10.scopes, queryParams: null == (d10 = a10.options) ? void 0 : d10.queryParams, skipBrowserRedirect: null == (e10 = a10.options) ? void 0 : e10.skipBrowserRedirect });
        }
        async exchangeCodeForSession(a10) {
          return await this.initializePromise, this._acquireLock(-1, async () => this._exchangeCodeForSession(a10));
        }
        async signInWithWeb3(a10) {
          let { chain: b10 } = a10;
          switch (b10) {
            case "ethereum":
              return await this.signInWithEthereum(a10);
            case "solana":
              return await this.signInWithSolana(a10);
            default:
              throw Error(`@supabase/auth-js: Unsupported chain "${b10}"`);
          }
        }
        async signInWithEthereum(a10) {
          var b10, c10, d10, e10, f2, g2, h2, i2, j2, k2, l2, m2;
          let n2, o2;
          if ("message" in a10) n2 = a10.message, o2 = a10.signature;
          else {
            let k3, { chain: l3, wallet: p2, statement: q2, options: r2 } = a10;
            if (ek()) if ("object" == typeof p2) k3 = p2;
            else {
              let a11 = window;
              if ("ethereum" in a11 && "object" == typeof a11.ethereum && "request" in a11.ethereum && "function" == typeof a11.ethereum.request) k3 = a11.ethereum;
              else throw Error("@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.");
            }
            else {
              if ("object" != typeof p2 || !(null == r2 ? void 0 : r2.url)) throw Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
              k3 = p2;
            }
            let s2 = new URL(null != (b10 = null == r2 ? void 0 : r2.url) ? b10 : window.location.href), t2 = await k3.request({ method: "eth_requestAccounts" }).then((a11) => a11).catch(() => {
              throw Error("@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid");
            });
            if (!t2 || 0 === t2.length) throw Error("@supabase/auth-js: No accounts available. Please ensure the wallet is connected.");
            let u2 = eV(t2[0]), v2 = null == (c10 = null == r2 ? void 0 : r2.signInWithEthereum) ? void 0 : c10.chainId;
            v2 || (v2 = parseInt(await k3.request({ method: "eth_chainId" }), 16)), n2 = function(a11) {
              var b11;
              let { chainId: c11, domain: d11, expirationTime: e11, issuedAt: f3 = /* @__PURE__ */ new Date(), nonce: g3, notBefore: h3, requestId: i3, resources: j3, scheme: k4, uri: l4, version: m3 } = a11;
              if (!Number.isInteger(c11)) throw Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${c11}`);
              if (!d11) throw Error('@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.');
              if (g3 && g3.length < 8) throw Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${g3}`);
              if (!l4) throw Error('@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.');
              if ("1" !== m3) throw Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${m3}`);
              if (null == (b11 = a11.statement) ? void 0 : b11.includes("\n")) throw Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${a11.statement}`);
              let n3 = eV(a11.address), o3 = k4 ? `${k4}://${d11}` : d11, p3 = a11.statement ? `${a11.statement}
` : "", q3 = `${o3} wants you to sign in with your Ethereum account:
${n3}

${p3}`, r3 = `URI: ${l4}
Version: ${m3}
Chain ID: ${c11}${g3 ? `
Nonce: ${g3}` : ""}
Issued At: ${f3.toISOString()}`;
              if (e11 && (r3 += `
Expiration Time: ${e11.toISOString()}`), h3 && (r3 += `
Not Before: ${h3.toISOString()}`), i3 && (r3 += `
Request ID: ${i3}`), j3) {
                let a12 = "\nResources:";
                for (let b12 of j3) {
                  if (!b12 || "string" != typeof b12) throw Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${b12}`);
                  a12 += `
- ${b12}`;
                }
                r3 += a12;
              }
              return `${q3}
${r3}`;
            }({ domain: s2.host, address: u2, statement: q2, uri: s2.href, version: "1", chainId: v2, nonce: null == (d10 = null == r2 ? void 0 : r2.signInWithEthereum) ? void 0 : d10.nonce, issuedAt: null != (f2 = null == (e10 = null == r2 ? void 0 : r2.signInWithEthereum) ? void 0 : e10.issuedAt) ? f2 : /* @__PURE__ */ new Date(), expirationTime: null == (g2 = null == r2 ? void 0 : r2.signInWithEthereum) ? void 0 : g2.expirationTime, notBefore: null == (h2 = null == r2 ? void 0 : r2.signInWithEthereum) ? void 0 : h2.notBefore, requestId: null == (i2 = null == r2 ? void 0 : r2.signInWithEthereum) ? void 0 : i2.requestId, resources: null == (j2 = null == r2 ? void 0 : r2.signInWithEthereum) ? void 0 : j2.resources }), o2 = await k3.request({ method: "personal_sign", params: [(m2 = n2, "0x" + Array.from(new TextEncoder().encode(m2), (a11) => a11.toString(16).padStart(2, "0")).join("")), u2] });
          }
          try {
            let { data: b11, error: c11 } = await eG(this.fetch, "POST", `${this.url}/token?grant_type=web3`, { headers: this.headers, body: Object.assign({ chain: "ethereum", message: n2, signature: o2 }, (null == (k2 = a10.options) ? void 0 : k2.captchaToken) ? { gotrue_meta_security: { captcha_token: null == (l2 = a10.options) ? void 0 : l2.captchaToken } } : null), xform: eI });
            if (c11) throw c11;
            if (!b11 || !b11.session || !b11.user) {
              let a11 = new d4();
              return this._returnResult({ data: { user: null, session: null }, error: a11 });
            }
            return b11.session && (await this._saveSession(b11.session), await this._notifyAllSubscribers("SIGNED_IN", b11.session)), this._returnResult({ data: Object.assign({}, b11), error: c11 });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async signInWithSolana(a10) {
          var b10, c10, d10, e10, f2, g2, h2, i2, j2, k2, l2, m2;
          let n2, o2;
          if ("message" in a10) n2 = a10.message, o2 = a10.signature;
          else {
            let l3, { chain: m3, wallet: p2, statement: q2, options: r2 } = a10;
            if (ek()) if ("object" == typeof p2) l3 = p2;
            else {
              let a11 = window;
              if ("solana" in a11 && "object" == typeof a11.solana && ("signIn" in a11.solana && "function" == typeof a11.solana.signIn || "signMessage" in a11.solana && "function" == typeof a11.solana.signMessage)) l3 = a11.solana;
              else throw Error("@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.");
            }
            else {
              if ("object" != typeof p2 || !(null == r2 ? void 0 : r2.url)) throw Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
              l3 = p2;
            }
            let s2 = new URL(null != (b10 = null == r2 ? void 0 : r2.url) ? b10 : window.location.href);
            if ("signIn" in l3 && l3.signIn) {
              let a11, b11 = await l3.signIn(Object.assign(Object.assign(Object.assign({ issuedAt: (/* @__PURE__ */ new Date()).toISOString() }, null == r2 ? void 0 : r2.signInWithSolana), { version: "1", domain: s2.host, uri: s2.href }), q2 ? { statement: q2 } : null));
              if (Array.isArray(b11) && b11[0] && "object" == typeof b11[0]) a11 = b11[0];
              else if (b11 && "object" == typeof b11 && "signedMessage" in b11 && "signature" in b11) a11 = b11;
              else throw Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");
              if ("signedMessage" in a11 && "signature" in a11 && ("string" == typeof a11.signedMessage || a11.signedMessage instanceof Uint8Array) && a11.signature instanceof Uint8Array) n2 = "string" == typeof a11.signedMessage ? a11.signedMessage : new TextDecoder().decode(a11.signedMessage), o2 = a11.signature;
              else throw Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields");
            } else {
              if (!("signMessage" in l3) || "function" != typeof l3.signMessage || !("publicKey" in l3) || "object" != typeof l3 || !l3.publicKey || !("toBase58" in l3.publicKey) || "function" != typeof l3.publicKey.toBase58) throw Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");
              n2 = [`${s2.host} wants you to sign in with your Solana account:`, l3.publicKey.toBase58(), ...q2 ? ["", q2, ""] : [""], "Version: 1", `URI: ${s2.href}`, `Issued At: ${null != (d10 = null == (c10 = null == r2 ? void 0 : r2.signInWithSolana) ? void 0 : c10.issuedAt) ? d10 : (/* @__PURE__ */ new Date()).toISOString()}`, ...(null == (e10 = null == r2 ? void 0 : r2.signInWithSolana) ? void 0 : e10.notBefore) ? [`Not Before: ${r2.signInWithSolana.notBefore}`] : [], ...(null == (f2 = null == r2 ? void 0 : r2.signInWithSolana) ? void 0 : f2.expirationTime) ? [`Expiration Time: ${r2.signInWithSolana.expirationTime}`] : [], ...(null == (g2 = null == r2 ? void 0 : r2.signInWithSolana) ? void 0 : g2.chainId) ? [`Chain ID: ${r2.signInWithSolana.chainId}`] : [], ...(null == (h2 = null == r2 ? void 0 : r2.signInWithSolana) ? void 0 : h2.nonce) ? [`Nonce: ${r2.signInWithSolana.nonce}`] : [], ...(null == (i2 = null == r2 ? void 0 : r2.signInWithSolana) ? void 0 : i2.requestId) ? [`Request ID: ${r2.signInWithSolana.requestId}`] : [], ...(null == (k2 = null == (j2 = null == r2 ? void 0 : r2.signInWithSolana) ? void 0 : j2.resources) ? void 0 : k2.length) ? ["Resources", ...r2.signInWithSolana.resources.map((a12) => `- ${a12}`)] : []].join("\n");
              let a11 = await l3.signMessage(new TextEncoder().encode(n2), "utf8");
              if (!a11 || !(a11 instanceof Uint8Array)) throw Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");
              o2 = a11;
            }
          }
          try {
            let { data: b11, error: c11 } = await eG(this.fetch, "POST", `${this.url}/token?grant_type=web3`, { headers: this.headers, body: Object.assign({ chain: "solana", message: n2, signature: ej(o2) }, (null == (l2 = a10.options) ? void 0 : l2.captchaToken) ? { gotrue_meta_security: { captcha_token: null == (m2 = a10.options) ? void 0 : m2.captchaToken } } : null), xform: eI });
            if (c11) throw c11;
            if (!b11 || !b11.session || !b11.user) {
              let a11 = new d4();
              return this._returnResult({ data: { user: null, session: null }, error: a11 });
            }
            return b11.session && (await this._saveSession(b11.session), await this._notifyAllSubscribers("SIGNED_IN", b11.session)), this._returnResult({ data: Object.assign({}, b11), error: c11 });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async _exchangeCodeForSession(a10) {
          let b10 = await ep(this.storage, `${this.storageKey}-code-verifier`), [c10, d10] = (null != b10 ? b10 : "").split("/");
          try {
            let { data: b11, error: e10 } = await eG(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, { headers: this.headers, body: { auth_code: a10, code_verifier: c10 }, xform: eI });
            if (await eq(this.storage, `${this.storageKey}-code-verifier`), e10) throw e10;
            if (!b11 || !b11.session || !b11.user) {
              let a11 = new d4();
              return this._returnResult({ data: { user: null, session: null, redirectType: null }, error: a11 });
            }
            return b11.session && (await this._saveSession(b11.session), await this._notifyAllSubscribers("SIGNED_IN", b11.session)), this._returnResult({ data: Object.assign(Object.assign({}, b11), { redirectType: null != d10 ? d10 : null }), error: e10 });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: { user: null, session: null, redirectType: null }, error: a11 });
            throw a11;
          }
        }
        async signInWithIdToken(a10) {
          try {
            let { options: b10, provider: c10, token: d10, access_token: e10, nonce: f2 } = a10, { data: g2, error: h2 } = await eG(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, { headers: this.headers, body: { provider: c10, id_token: d10, access_token: e10, nonce: f2, gotrue_meta_security: { captcha_token: null == b10 ? void 0 : b10.captchaToken } }, xform: eI });
            if (h2) return this._returnResult({ data: { user: null, session: null }, error: h2 });
            if (!g2 || !g2.session || !g2.user) {
              let a11 = new d4();
              return this._returnResult({ data: { user: null, session: null }, error: a11 });
            }
            return g2.session && (await this._saveSession(g2.session), await this._notifyAllSubscribers("SIGNED_IN", g2.session)), this._returnResult({ data: g2, error: h2 });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async signInWithOtp(a10) {
          var b10, c10, d10, e10, f2;
          try {
            if ("email" in a10) {
              let { email: d11, options: e11 } = a10, f3 = null, g2 = null;
              "pkce" === this.flowType && ([f3, g2] = await ex(this.storage, this.storageKey));
              let { error: h2 } = await eG(this.fetch, "POST", `${this.url}/otp`, { headers: this.headers, body: { email: d11, data: null != (b10 = null == e11 ? void 0 : e11.data) ? b10 : {}, create_user: null == (c10 = null == e11 ? void 0 : e11.shouldCreateUser) || c10, gotrue_meta_security: { captcha_token: null == e11 ? void 0 : e11.captchaToken }, code_challenge: f3, code_challenge_method: g2 }, redirectTo: null == e11 ? void 0 : e11.emailRedirectTo });
              return this._returnResult({ data: { user: null, session: null }, error: h2 });
            }
            if ("phone" in a10) {
              let { phone: b11, options: c11 } = a10, { data: g2, error: h2 } = await eG(this.fetch, "POST", `${this.url}/otp`, { headers: this.headers, body: { phone: b11, data: null != (d10 = null == c11 ? void 0 : c11.data) ? d10 : {}, create_user: null == (e10 = null == c11 ? void 0 : c11.shouldCreateUser) || e10, gotrue_meta_security: { captcha_token: null == c11 ? void 0 : c11.captchaToken }, channel: null != (f2 = null == c11 ? void 0 : c11.channel) ? f2 : "sms" } });
              return this._returnResult({ data: { user: null, session: null, messageId: null == g2 ? void 0 : g2.message_id }, error: h2 });
            }
            throw new d5("You must provide either an email or phone number.");
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async verifyOtp(a10) {
          var b10, c10;
          try {
            let d10, e10;
            "options" in a10 && (d10 = null == (b10 = a10.options) ? void 0 : b10.redirectTo, e10 = null == (c10 = a10.options) ? void 0 : c10.captchaToken);
            let { data: f2, error: g2 } = await eG(this.fetch, "POST", `${this.url}/verify`, { headers: this.headers, body: Object.assign(Object.assign({}, a10), { gotrue_meta_security: { captcha_token: e10 } }), redirectTo: d10, xform: eI });
            if (g2) throw g2;
            if (!f2) throw Error("An error occurred on token verification.");
            let h2 = f2.session, i2 = f2.user;
            return (null == h2 ? void 0 : h2.access_token) && (await this._saveSession(h2), await this._notifyAllSubscribers("recovery" == a10.type ? "PASSWORD_RECOVERY" : "SIGNED_IN", h2)), this._returnResult({ data: { user: i2, session: h2 }, error: null });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async signInWithSSO(a10) {
          var b10, c10, d10, e10, f2;
          try {
            let g2 = null, h2 = null;
            "pkce" === this.flowType && ([g2, h2] = await ex(this.storage, this.storageKey));
            let i2 = await eG(this.fetch, "POST", `${this.url}/sso`, { body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in a10 ? { provider_id: a10.providerId } : null), "domain" in a10 ? { domain: a10.domain } : null), { redirect_to: null != (c10 = null == (b10 = a10.options) ? void 0 : b10.redirectTo) ? c10 : void 0 }), (null == (d10 = null == a10 ? void 0 : a10.options) ? void 0 : d10.captchaToken) ? { gotrue_meta_security: { captcha_token: a10.options.captchaToken } } : null), { skip_http_redirect: true, code_challenge: g2, code_challenge_method: h2 }), headers: this.headers, xform: eL });
            return (null == (e10 = i2.data) ? void 0 : e10.url) && ek() && !(null == (f2 = a10.options) ? void 0 : f2.skipBrowserRedirect) && window.location.assign(i2.data.url), this._returnResult(i2);
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async reauthenticate() {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._reauthenticate());
        }
        async _reauthenticate() {
          try {
            return await this._useSession(async (a10) => {
              let { data: { session: b10 }, error: c10 } = a10;
              if (c10) throw c10;
              if (!b10) throw new d3();
              let { error: d10 } = await eG(this.fetch, "GET", `${this.url}/reauthenticate`, { headers: this.headers, jwt: b10.access_token });
              return this._returnResult({ data: { user: null, session: null }, error: d10 });
            });
          } catch (a10) {
            if (d_(a10)) return this._returnResult({ data: { user: null, session: null }, error: a10 });
            throw a10;
          }
        }
        async resend(a10) {
          try {
            let b10 = `${this.url}/resend`;
            if ("email" in a10) {
              let { email: c10, type: d10, options: e10 } = a10, { error: f2 } = await eG(this.fetch, "POST", b10, { headers: this.headers, body: { email: c10, type: d10, gotrue_meta_security: { captcha_token: null == e10 ? void 0 : e10.captchaToken } }, redirectTo: null == e10 ? void 0 : e10.emailRedirectTo });
              return this._returnResult({ data: { user: null, session: null }, error: f2 });
            }
            if ("phone" in a10) {
              let { phone: c10, type: d10, options: e10 } = a10, { data: f2, error: g2 } = await eG(this.fetch, "POST", b10, { headers: this.headers, body: { phone: c10, type: d10, gotrue_meta_security: { captcha_token: null == e10 ? void 0 : e10.captchaToken } } });
              return this._returnResult({ data: { user: null, session: null, messageId: null == f2 ? void 0 : f2.message_id }, error: g2 });
            }
            throw new d5("You must provide either an email or phone number and a type");
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async getSession() {
          return await this.initializePromise, await this._acquireLock(-1, async () => this._useSession(async (a10) => a10));
        }
        async _acquireLock(a10, b10) {
          this._debug("#_acquireLock", "begin", a10);
          try {
            if (this.lockAcquired) {
              let a11 = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve(), c10 = (async () => (await a11, await b10()))();
              return this.pendingInLock.push((async () => {
                try {
                  await c10;
                } catch (a12) {
                }
              })()), c10;
            }
            return await this.lock(`lock:${this.storageKey}`, a10, async () => {
              this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
              try {
                this.lockAcquired = true;
                let a11 = b10();
                for (this.pendingInLock.push((async () => {
                  try {
                    await a11;
                  } catch (a12) {
                  }
                })()), await a11; this.pendingInLock.length; ) {
                  let a12 = [...this.pendingInLock];
                  await Promise.all(a12), this.pendingInLock.splice(0, a12.length);
                }
                return await a11;
              } finally {
                this._debug("#_acquireLock", "lock released for storage key", this.storageKey), this.lockAcquired = false;
              }
            });
          } finally {
            this._debug("#_acquireLock", "end");
          }
        }
        async _useSession(a10) {
          this._debug("#_useSession", "begin");
          try {
            let b10 = await this.__loadSession();
            return await a10(b10);
          } finally {
            this._debug("#_useSession", "end");
          }
        }
        async __loadSession() {
          this._debug("#__loadSession()", "begin"), this.lockAcquired || this._debug("#__loadSession()", "used outside of an acquired lock!", Error().stack);
          try {
            let b10 = null, c10 = await ep(this.storage, this.storageKey);
            if (this._debug("#getSession()", "session from storage", c10), null !== c10 && (this._isValidSession(c10) ? b10 = c10 : (this._debug("#getSession()", "session from storage is not valid"), await this._removeSession())), !b10) return { data: { session: null }, error: null };
            let d10 = !!b10.expires_at && 1e3 * b10.expires_at - Date.now() < 9e4;
            if (this._debug("#__loadSession()", `session has${d10 ? "" : " not"} expired`, "expires_at", b10.expires_at), !d10) {
              if (this.userStorage) {
                let a11 = await ep(this.userStorage, this.storageKey + "-user");
                (null == a11 ? void 0 : a11.user) ? b10.user = a11.user : b10.user = eB();
              }
              if (this.storage.isServer && b10.user && !b10.user.__isUserNotAvailableProxy) {
                var a10;
                let c11 = { value: this.suppressGetSessionWarning };
                b10.user = (a10 = b10.user, new Proxy(a10, { get: (a11, b11, d11) => {
                  if ("__isInsecureUserWarningProxy" === b11) return true;
                  if ("symbol" == typeof b11) {
                    let c12 = b11.toString();
                    if ("Symbol(Symbol.toPrimitive)" === c12 || "Symbol(Symbol.toStringTag)" === c12 || "Symbol(util.inspect.custom)" === c12 || "Symbol(nodejs.util.inspect.custom)" === c12) return Reflect.get(a11, b11, d11);
                  }
                  return c11.value || "string" != typeof b11 || (console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server."), c11.value = true), Reflect.get(a11, b11, d11);
                } })), c11.value && (this.suppressGetSessionWarning = true);
              }
              return { data: { session: b10 }, error: null };
            }
            let { data: e10, error: f2 } = await this._callRefreshToken(b10.refresh_token);
            if (f2) return this._returnResult({ data: { session: null }, error: f2 });
            return this._returnResult({ data: { session: e10 }, error: null });
          } finally {
            this._debug("#__loadSession()", "end");
          }
        }
        async getUser(a10) {
          return a10 ? await this._getUser(a10) : (await this.initializePromise, await this._acquireLock(-1, async () => await this._getUser()));
        }
        async _getUser(a10) {
          try {
            if (a10) return await eG(this.fetch, "GET", `${this.url}/user`, { headers: this.headers, jwt: a10, xform: eK });
            return await this._useSession(async (a11) => {
              var b10, c10, d10;
              let { data: e10, error: f2 } = a11;
              if (f2) throw f2;
              return (null == (b10 = e10.session) ? void 0 : b10.access_token) || this.hasCustomAuthorizationHeader ? await eG(this.fetch, "GET", `${this.url}/user`, { headers: this.headers, jwt: null != (d10 = null == (c10 = e10.session) ? void 0 : c10.access_token) ? d10 : void 0, xform: eK }) : { data: { user: null }, error: new d3() };
            });
          } catch (a11) {
            if (d_(a11)) return d_(a11) && "AuthSessionMissingError" === a11.name && (await this._removeSession(), await eq(this.storage, `${this.storageKey}-code-verifier`)), this._returnResult({ data: { user: null }, error: a11 });
            throw a11;
          }
        }
        async updateUser(a10, b10 = {}) {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._updateUser(a10, b10));
        }
        async _updateUser(a10, b10 = {}) {
          try {
            return await this._useSession(async (c10) => {
              let { data: d10, error: e10 } = c10;
              if (e10) throw e10;
              if (!d10.session) throw new d3();
              let f2 = d10.session, g2 = null, h2 = null;
              "pkce" === this.flowType && null != a10.email && ([g2, h2] = await ex(this.storage, this.storageKey));
              let { data: i2, error: j2 } = await eG(this.fetch, "PUT", `${this.url}/user`, { headers: this.headers, redirectTo: null == b10 ? void 0 : b10.emailRedirectTo, body: Object.assign(Object.assign({}, a10), { code_challenge: g2, code_challenge_method: h2 }), jwt: f2.access_token, xform: eK });
              if (j2) throw j2;
              return f2.user = i2.user, await this._saveSession(f2), await this._notifyAllSubscribers("USER_UPDATED", f2), this._returnResult({ data: { user: f2.user }, error: null });
            });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: { user: null }, error: a11 });
            throw a11;
          }
        }
        async setSession(a10) {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._setSession(a10));
        }
        async _setSession(a10) {
          try {
            if (!a10.access_token || !a10.refresh_token) throw new d3();
            let b10 = Date.now() / 1e3, c10 = b10, d10 = true, e10 = null, { payload: f2 } = es(a10.access_token);
            if (f2.exp && (d10 = (c10 = f2.exp) <= b10), d10) {
              let { data: b11, error: c11 } = await this._callRefreshToken(a10.refresh_token);
              if (c11) return this._returnResult({ data: { user: null, session: null }, error: c11 });
              if (!b11) return { data: { user: null, session: null }, error: null };
              e10 = b11;
            } else {
              let { data: d11, error: f3 } = await this._getUser(a10.access_token);
              if (f3) throw f3;
              e10 = { access_token: a10.access_token, refresh_token: a10.refresh_token, user: d11.user, token_type: "bearer", expires_in: c10 - b10, expires_at: c10 }, await this._saveSession(e10), await this._notifyAllSubscribers("SIGNED_IN", e10);
            }
            return this._returnResult({ data: { user: e10.user, session: e10 }, error: null });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: { session: null, user: null }, error: a11 });
            throw a11;
          }
        }
        async refreshSession(a10) {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._refreshSession(a10));
        }
        async _refreshSession(a10) {
          try {
            return await this._useSession(async (b10) => {
              var c10;
              if (!a10) {
                let { data: d11, error: e11 } = b10;
                if (e11) throw e11;
                a10 = null != (c10 = d11.session) ? c10 : void 0;
              }
              if (!(null == a10 ? void 0 : a10.refresh_token)) throw new d3();
              let { data: d10, error: e10 } = await this._callRefreshToken(a10.refresh_token);
              return e10 ? this._returnResult({ data: { user: null, session: null }, error: e10 }) : d10 ? this._returnResult({ data: { user: d10.user, session: d10 }, error: null }) : this._returnResult({ data: { user: null, session: null }, error: null });
            });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
            throw a11;
          }
        }
        async _getSessionFromURL(a10, b10) {
          try {
            if (!ek()) throw new d6("No browser detected.");
            if (a10.error || a10.error_description || a10.error_code) throw new d6(a10.error_description || "Error in URL with unspecified error_description", { error: a10.error || "unspecified_error", code: a10.error_code || "unspecified_code" });
            switch (b10) {
              case "implicit":
                if ("pkce" === this.flowType) throw new d7("Not a valid PKCE flow url.");
                break;
              case "pkce":
                if ("implicit" === this.flowType) throw new d6("Not a valid implicit grant flow url.");
            }
            if ("pkce" === b10) {
              if (this._debug("#_initialize()", "begin", "is PKCE flow", true), !a10.code) throw new d7("No code detected.");
              let { data: b11, error: c11 } = await this._exchangeCodeForSession(a10.code);
              if (c11) throw c11;
              let d11 = new URL(window.location.href);
              return d11.searchParams.delete("code"), window.history.replaceState(window.history.state, "", d11.toString()), { data: { session: b11.session, redirectType: null }, error: null };
            }
            let { provider_token: c10, provider_refresh_token: d10, access_token: e10, refresh_token: f2, expires_in: g2, expires_at: h2, token_type: i2 } = a10;
            if (!e10 || !g2 || !f2 || !i2) throw new d6("No session defined in URL");
            let j2 = Math.round(Date.now() / 1e3), k2 = parseInt(g2), l2 = j2 + k2;
            h2 && (l2 = parseInt(h2));
            let m2 = l2 - j2;
            1e3 * m2 <= 3e4 && console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${m2}s, should have been closer to ${k2}s`);
            let n2 = l2 - k2;
            j2 - n2 >= 120 ? console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", n2, l2, j2) : j2 - n2 < 0 && console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew", n2, l2, j2);
            let { data: o2, error: p2 } = await this._getUser(e10);
            if (p2) throw p2;
            let q2 = { provider_token: c10, provider_refresh_token: d10, access_token: e10, expires_in: k2, expires_at: l2, refresh_token: f2, token_type: i2, user: o2.user };
            return window.location.hash = "", this._debug("#_getSessionFromURL()", "clearing window.location.hash"), this._returnResult({ data: { session: q2, redirectType: a10.type }, error: null });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: { session: null, redirectType: null }, error: a11 });
            throw a11;
          }
        }
        _isImplicitGrantCallback(a10) {
          return !!(a10.access_token || a10.error_description);
        }
        async _isPKCECallback(a10) {
          let b10 = await ep(this.storage, `${this.storageKey}-code-verifier`);
          return !!(a10.code && b10);
        }
        async signOut(a10 = { scope: "global" }) {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._signOut(a10));
        }
        async _signOut({ scope: a10 } = { scope: "global" }) {
          return await this._useSession(async (b10) => {
            var c10;
            let { data: d10, error: e10 } = b10;
            if (e10) return this._returnResult({ error: e10 });
            let f2 = null == (c10 = d10.session) ? void 0 : c10.access_token;
            if (f2) {
              let { error: b11 } = await this.admin.signOut(f2, a10);
              if (b11 && !(d_(b11) && "AuthApiError" === b11.name && (404 === b11.status || 401 === b11.status || 403 === b11.status))) return this._returnResult({ error: b11 });
            }
            return "others" !== a10 && (await this._removeSession(), await eq(this.storage, `${this.storageKey}-code-verifier`)), this._returnResult({ error: null });
          });
        }
        onAuthStateChange(a10) {
          let b10 = Symbol("auth-callback"), c10 = { id: b10, callback: a10, unsubscribe: () => {
            this._debug("#unsubscribe()", "state change callback with id removed", b10), this.stateChangeEmitters.delete(b10);
          } };
          return this._debug("#onAuthStateChange()", "registered callback with id", b10), this.stateChangeEmitters.set(b10, c10), (async () => {
            await this.initializePromise, await this._acquireLock(-1, async () => {
              this._emitInitialSession(b10);
            });
          })(), { data: { subscription: c10 } };
        }
        async _emitInitialSession(a10) {
          return await this._useSession(async (b10) => {
            var c10, d10;
            try {
              let { data: { session: d11 }, error: e10 } = b10;
              if (e10) throw e10;
              await (null == (c10 = this.stateChangeEmitters.get(a10)) ? void 0 : c10.callback("INITIAL_SESSION", d11)), this._debug("INITIAL_SESSION", "callback id", a10, "session", d11);
            } catch (b11) {
              await (null == (d10 = this.stateChangeEmitters.get(a10)) ? void 0 : d10.callback("INITIAL_SESSION", null)), this._debug("INITIAL_SESSION", "callback id", a10, "error", b11), console.error(b11);
            }
          });
        }
        async resetPasswordForEmail(a10, b10 = {}) {
          let c10 = null, d10 = null;
          "pkce" === this.flowType && ([c10, d10] = await ex(this.storage, this.storageKey, true));
          try {
            return await eG(this.fetch, "POST", `${this.url}/recover`, { body: { email: a10, code_challenge: c10, code_challenge_method: d10, gotrue_meta_security: { captcha_token: b10.captchaToken } }, headers: this.headers, redirectTo: b10.redirectTo });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async getUserIdentities() {
          var a10;
          try {
            let { data: b10, error: c10 } = await this.getUser();
            if (c10) throw c10;
            return this._returnResult({ data: { identities: null != (a10 = b10.user.identities) ? a10 : [] }, error: null });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async linkIdentity(a10) {
          return "token" in a10 ? this.linkIdentityIdToken(a10) : this.linkIdentityOAuth(a10);
        }
        async linkIdentityOAuth(a10) {
          var b10;
          try {
            let { data: c10, error: d10 } = await this._useSession(async (b11) => {
              var c11, d11, e10, f2, g2;
              let { data: h2, error: i2 } = b11;
              if (i2) throw i2;
              let j2 = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, a10.provider, { redirectTo: null == (c11 = a10.options) ? void 0 : c11.redirectTo, scopes: null == (d11 = a10.options) ? void 0 : d11.scopes, queryParams: null == (e10 = a10.options) ? void 0 : e10.queryParams, skipBrowserRedirect: true });
              return await eG(this.fetch, "GET", j2, { headers: this.headers, jwt: null != (g2 = null == (f2 = h2.session) ? void 0 : f2.access_token) ? g2 : void 0 });
            });
            if (d10) throw d10;
            return !ek() || (null == (b10 = a10.options) ? void 0 : b10.skipBrowserRedirect) || window.location.assign(null == c10 ? void 0 : c10.url), this._returnResult({ data: { provider: a10.provider, url: null == c10 ? void 0 : c10.url }, error: null });
          } catch (b11) {
            if (d_(b11)) return this._returnResult({ data: { provider: a10.provider, url: null }, error: b11 });
            throw b11;
          }
        }
        async linkIdentityIdToken(a10) {
          return await this._useSession(async (b10) => {
            var c10;
            try {
              let { error: d10, data: { session: e10 } } = b10;
              if (d10) throw d10;
              let { options: f2, provider: g2, token: h2, access_token: i2, nonce: j2 } = a10, { data: k2, error: l2 } = await eG(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, { headers: this.headers, jwt: null != (c10 = null == e10 ? void 0 : e10.access_token) ? c10 : void 0, body: { provider: g2, id_token: h2, access_token: i2, nonce: j2, link_identity: true, gotrue_meta_security: { captcha_token: null == f2 ? void 0 : f2.captchaToken } }, xform: eI });
              if (l2) return this._returnResult({ data: { user: null, session: null }, error: l2 });
              if (!k2 || !k2.session || !k2.user) return this._returnResult({ data: { user: null, session: null }, error: new d4() });
              return k2.session && (await this._saveSession(k2.session), await this._notifyAllSubscribers("USER_UPDATED", k2.session)), this._returnResult({ data: k2, error: l2 });
            } catch (a11) {
              if (d_(a11)) return this._returnResult({ data: { user: null, session: null }, error: a11 });
              throw a11;
            }
          });
        }
        async unlinkIdentity(a10) {
          try {
            return await this._useSession(async (b10) => {
              var c10, d10;
              let { data: e10, error: f2 } = b10;
              if (f2) throw f2;
              return await eG(this.fetch, "DELETE", `${this.url}/user/identities/${a10.identity_id}`, { headers: this.headers, jwt: null != (d10 = null == (c10 = e10.session) ? void 0 : c10.access_token) ? d10 : void 0 });
            });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async _refreshAccessToken(a10) {
          let b10 = `#_refreshAccessToken(${a10.substring(0, 5)}...)`;
          this._debug(b10, "begin");
          try {
            var c10, d10;
            let e10 = Date.now();
            return await (c10 = async (c11) => (c11 > 0 && await et(200 * Math.pow(2, c11 - 1)), this._debug(b10, "refreshing attempt", c11), await eG(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, { body: { refresh_token: a10 }, headers: this.headers, xform: eI })), d10 = (a11, b11) => {
              let c11 = 200 * Math.pow(2, a11);
              return b11 && d9(b11) && Date.now() + c11 - e10 < 3e4;
            }, new Promise((a11, b11) => {
              (async () => {
                for (let e11 = 0; e11 < 1 / 0; e11++) try {
                  let b12 = await c10(e11);
                  if (!d10(e11, null, b12)) return void a11(b12);
                } catch (a12) {
                  if (!d10(e11, a12)) return void b11(a12);
                }
              })();
            }));
          } catch (a11) {
            if (this._debug(b10, "error", a11), d_(a11)) return this._returnResult({ data: { session: null, user: null }, error: a11 });
            throw a11;
          } finally {
            this._debug(b10, "end");
          }
        }
        _isValidSession(a10) {
          return "object" == typeof a10 && null !== a10 && "access_token" in a10 && "refresh_token" in a10 && "expires_at" in a10;
        }
        async _handleProviderSignIn(a10, b10) {
          let c10 = await this._getUrlForProvider(`${this.url}/authorize`, a10, { redirectTo: b10.redirectTo, scopes: b10.scopes, queryParams: b10.queryParams });
          return this._debug("#_handleProviderSignIn()", "provider", a10, "options", b10, "url", c10), ek() && !b10.skipBrowserRedirect && window.location.assign(c10), { data: { provider: a10, url: c10 }, error: null };
        }
        async _recoverAndRefresh() {
          var a10, b10;
          let c10 = "#_recoverAndRefresh()";
          this._debug(c10, "begin");
          try {
            let d10 = await ep(this.storage, this.storageKey);
            if (d10 && this.userStorage) {
              let b11 = await ep(this.userStorage, this.storageKey + "-user");
              !this.storage.isServer && Object.is(this.storage, this.userStorage) && !b11 && (b11 = { user: d10.user }, await eo(this.userStorage, this.storageKey + "-user", b11)), d10.user = null != (a10 = null == b11 ? void 0 : b11.user) ? a10 : eB();
            } else if (d10 && !d10.user && !d10.user) {
              let a11 = await ep(this.storage, this.storageKey + "-user");
              a11 && (null == a11 ? void 0 : a11.user) ? (d10.user = a11.user, await eq(this.storage, this.storageKey + "-user"), await eo(this.storage, this.storageKey, d10)) : d10.user = eB();
            }
            if (this._debug(c10, "session from storage", d10), !this._isValidSession(d10)) {
              this._debug(c10, "session is not valid"), null !== d10 && await this._removeSession();
              return;
            }
            let e10 = (null != (b10 = d10.expires_at) ? b10 : 1 / 0) * 1e3 - Date.now() < 9e4;
            if (this._debug(c10, `session has${e10 ? "" : " not"} expired with margin of 90000s`), e10) {
              if (this.autoRefreshToken && d10.refresh_token) {
                let { error: a11 } = await this._callRefreshToken(d10.refresh_token);
                a11 && (console.error(a11), d9(a11) || (this._debug(c10, "refresh failed with a non-retryable error, removing the session", a11), await this._removeSession()));
              }
            } else if (d10.user && true === d10.user.__isUserNotAvailableProxy) try {
              let { data: a11, error: b11 } = await this._getUser(d10.access_token);
              !b11 && (null == a11 ? void 0 : a11.user) ? (d10.user = a11.user, await this._saveSession(d10), await this._notifyAllSubscribers("SIGNED_IN", d10)) : this._debug(c10, "could not get user data, skipping SIGNED_IN notification");
            } catch (a11) {
              console.error("Error getting user data:", a11), this._debug(c10, "error getting user data, skipping SIGNED_IN notification", a11);
            }
            else await this._notifyAllSubscribers("SIGNED_IN", d10);
          } catch (a11) {
            this._debug(c10, "error", a11), console.error(a11);
            return;
          } finally {
            this._debug(c10, "end");
          }
        }
        async _callRefreshToken(a10) {
          var b10, c10;
          if (!a10) throw new d3();
          if (this.refreshingDeferred) return this.refreshingDeferred.promise;
          let d10 = `#_callRefreshToken(${a10.substring(0, 5)}...)`;
          this._debug(d10, "begin");
          try {
            this.refreshingDeferred = new er();
            let { data: b11, error: c11 } = await this._refreshAccessToken(a10);
            if (c11) throw c11;
            if (!b11.session) throw new d3();
            await this._saveSession(b11.session), await this._notifyAllSubscribers("TOKEN_REFRESHED", b11.session);
            let d11 = { data: b11.session, error: null };
            return this.refreshingDeferred.resolve(d11), d11;
          } catch (a11) {
            if (this._debug(d10, "error", a11), d_(a11)) {
              let c11 = { data: null, error: a11 };
              return d9(a11) || await this._removeSession(), null == (b10 = this.refreshingDeferred) || b10.resolve(c11), c11;
            }
            throw null == (c10 = this.refreshingDeferred) || c10.reject(a11), a11;
          } finally {
            this.refreshingDeferred = null, this._debug(d10, "end");
          }
        }
        async _notifyAllSubscribers(a10, b10, c10 = true) {
          let d10 = `#_notifyAllSubscribers(${a10})`;
          this._debug(d10, "begin", b10, `broadcast = ${c10}`);
          try {
            this.broadcastChannel && c10 && this.broadcastChannel.postMessage({ event: a10, session: b10 });
            let d11 = [], e10 = Array.from(this.stateChangeEmitters.values()).map(async (c11) => {
              try {
                await c11.callback(a10, b10);
              } catch (a11) {
                d11.push(a11);
              }
            });
            if (await Promise.all(e10), d11.length > 0) {
              for (let a11 = 0; a11 < d11.length; a11 += 1) console.error(d11[a11]);
              throw d11[0];
            }
          } finally {
            this._debug(d10, "end");
          }
        }
        async _saveSession(a10) {
          this._debug("#_saveSession()", a10), this.suppressGetSessionWarning = true;
          let b10 = Object.assign({}, a10), c10 = b10.user && true === b10.user.__isUserNotAvailableProxy;
          if (this.userStorage) {
            !c10 && b10.user && await eo(this.userStorage, this.storageKey + "-user", { user: b10.user });
            let a11 = Object.assign({}, b10);
            delete a11.user;
            let d10 = eC(a11);
            await eo(this.storage, this.storageKey, d10);
          } else {
            let a11 = eC(b10);
            await eo(this.storage, this.storageKey, a11);
          }
        }
        async _removeSession() {
          this._debug("#_removeSession()"), await eq(this.storage, this.storageKey), await eq(this.storage, this.storageKey + "-code-verifier"), await eq(this.storage, this.storageKey + "-user"), this.userStorage && await eq(this.userStorage, this.storageKey + "-user"), await this._notifyAllSubscribers("SIGNED_OUT", null);
        }
        _removeVisibilityChangedCallback() {
          this._debug("#_removeVisibilityChangedCallback()");
          let a10 = this.visibilityChangedCallback;
          this.visibilityChangedCallback = null;
          try {
            a10 && ek() && (null == window ? void 0 : window.removeEventListener) && window.removeEventListener("visibilitychange", a10);
          } catch (a11) {
            console.error("removing visibilitychange callback failed", a11);
          }
        }
        async _startAutoRefresh() {
          await this._stopAutoRefresh(), this._debug("#_startAutoRefresh()");
          let a10 = setInterval(() => this._autoRefreshTokenTick(), 3e4);
          this.autoRefreshTicker = a10, a10 && "object" == typeof a10 && "function" == typeof a10.unref ? a10.unref() : "u" > typeof Deno && "function" == typeof Deno.unrefTimer && Deno.unrefTimer(a10), setTimeout(async () => {
            await this.initializePromise, await this._autoRefreshTokenTick();
          }, 0);
        }
        async _stopAutoRefresh() {
          this._debug("#_stopAutoRefresh()");
          let a10 = this.autoRefreshTicker;
          this.autoRefreshTicker = null, a10 && clearInterval(a10);
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
                let a10 = Date.now();
                try {
                  return await this._useSession(async (b10) => {
                    let { data: { session: c10 } } = b10;
                    if (!c10 || !c10.refresh_token || !c10.expires_at) return void this._debug("#_autoRefreshTokenTick()", "no session");
                    let d10 = Math.floor((1e3 * c10.expires_at - a10) / 3e4);
                    this._debug("#_autoRefreshTokenTick()", `access token expires in ${d10} ticks, a tick lasts 30000ms, refresh threshold is 3 ticks`), d10 <= 3 && await this._callRefreshToken(c10.refresh_token);
                  });
                } catch (a11) {
                  console.error("Auto refresh tick failed with error. This is likely a transient error.", a11);
                }
              } finally {
                this._debug("#_autoRefreshTokenTick()", "end");
              }
            });
          } catch (a10) {
            if (a10.isAcquireTimeout || a10 instanceof eS) this._debug("auto refresh token tick lock not available");
            else throw a10;
          }
        }
        async _handleVisibilityChange() {
          if (this._debug("#_handleVisibilityChange()"), !ek() || !(null == window ? void 0 : window.addEventListener)) return this.autoRefreshToken && this.startAutoRefresh(), false;
          try {
            this.visibilityChangedCallback = async () => await this._onVisibilityChanged(false), null == window || window.addEventListener("visibilitychange", this.visibilityChangedCallback), await this._onVisibilityChanged(true);
          } catch (a10) {
            console.error("_handleVisibilityChange", a10);
          }
        }
        async _onVisibilityChanged(a10) {
          let b10 = `#_onVisibilityChanged(${a10})`;
          this._debug(b10, "visibilityState", document.visibilityState), "visible" === document.visibilityState ? (this.autoRefreshToken && this._startAutoRefresh(), a10 || (await this.initializePromise, await this._acquireLock(-1, async () => {
            "visible" !== document.visibilityState ? this._debug(b10, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting") : await this._recoverAndRefresh();
          }))) : "hidden" === document.visibilityState && this.autoRefreshToken && this._stopAutoRefresh();
        }
        async _getUrlForProvider(a10, b10, c10) {
          let d10 = [`provider=${encodeURIComponent(b10)}`];
          if ((null == c10 ? void 0 : c10.redirectTo) && d10.push(`redirect_to=${encodeURIComponent(c10.redirectTo)}`), (null == c10 ? void 0 : c10.scopes) && d10.push(`scopes=${encodeURIComponent(c10.scopes)}`), "pkce" === this.flowType) {
            let [a11, b11] = await ex(this.storage, this.storageKey), c11 = new URLSearchParams({ code_challenge: `${encodeURIComponent(a11)}`, code_challenge_method: `${encodeURIComponent(b11)}` });
            d10.push(c11.toString());
          }
          if (null == c10 ? void 0 : c10.queryParams) {
            let a11 = new URLSearchParams(c10.queryParams);
            d10.push(a11.toString());
          }
          return (null == c10 ? void 0 : c10.skipBrowserRedirect) && d10.push(`skip_http_redirect=${c10.skipBrowserRedirect}`), `${a10}?${d10.join("&")}`;
        }
        async _unenroll(a10) {
          try {
            return await this._useSession(async (b10) => {
              var c10;
              let { data: d10, error: e10 } = b10;
              return e10 ? this._returnResult({ data: null, error: e10 }) : await eG(this.fetch, "DELETE", `${this.url}/factors/${a10.factorId}`, { headers: this.headers, jwt: null == (c10 = null == d10 ? void 0 : d10.session) ? void 0 : c10.access_token });
            });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async _enroll(a10) {
          try {
            return await this._useSession(async (b10) => {
              var c10, d10;
              let { data: e10, error: f2 } = b10;
              if (f2) return this._returnResult({ data: null, error: f2 });
              let g2 = Object.assign({ friendly_name: a10.friendlyName, factor_type: a10.factorType }, "phone" === a10.factorType ? { phone: a10.phone } : "totp" === a10.factorType ? { issuer: a10.issuer } : {}), { data: h2, error: i2 } = await eG(this.fetch, "POST", `${this.url}/factors`, { body: g2, headers: this.headers, jwt: null == (c10 = null == e10 ? void 0 : e10.session) ? void 0 : c10.access_token });
              return i2 ? this._returnResult({ data: null, error: i2 }) : ("totp" === a10.factorType && "totp" === h2.type && (null == (d10 = null == h2 ? void 0 : h2.totp) ? void 0 : d10.qr_code) && (h2.totp.qr_code = `data:image/svg+xml;utf-8,${h2.totp.qr_code}`), this._returnResult({ data: h2, error: null }));
            });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async _verify(a10) {
          return this._acquireLock(-1, async () => {
            try {
              return await this._useSession(async (b10) => {
                var c10, d10, e10;
                let { data: f2, error: g2 } = b10;
                if (g2) return this._returnResult({ data: null, error: g2 });
                let h2 = Object.assign({ challenge_id: a10.challengeId }, "webauthn" in a10 ? { webauthn: Object.assign(Object.assign({}, a10.webauthn), { credential_response: "create" === a10.webauthn.type ? (d10 = a10.webauthn.credential_response, "toJSON" in d10 && "function" == typeof d10.toJSON ? d10.toJSON() : { id: d10.id, rawId: d10.id, response: { attestationObject: ej(new Uint8Array(d10.response.attestationObject)), clientDataJSON: ej(new Uint8Array(d10.response.clientDataJSON)) }, type: "public-key", clientExtensionResults: d10.getClientExtensionResults(), authenticatorAttachment: null != (e10 = d10.authenticatorAttachment) ? e10 : void 0 }) : function(a11) {
                  var b11;
                  if ("toJSON" in a11 && "function" == typeof a11.toJSON) return a11.toJSON();
                  let c11 = a11.getClientExtensionResults(), d11 = a11.response;
                  return { id: a11.id, rawId: a11.id, response: { authenticatorData: ej(new Uint8Array(d11.authenticatorData)), clientDataJSON: ej(new Uint8Array(d11.clientDataJSON)), signature: ej(new Uint8Array(d11.signature)), userHandle: d11.userHandle ? ej(new Uint8Array(d11.userHandle)) : void 0 }, type: "public-key", clientExtensionResults: c11, authenticatorAttachment: null != (b11 = a11.authenticatorAttachment) ? b11 : void 0 };
                }(a10.webauthn.credential_response) }) } : { code: a10.code }), { data: i2, error: j2 } = await eG(this.fetch, "POST", `${this.url}/factors/${a10.factorId}/verify`, { body: h2, headers: this.headers, jwt: null == (c10 = null == f2 ? void 0 : f2.session) ? void 0 : c10.access_token });
                return j2 ? this._returnResult({ data: null, error: j2 }) : (await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + i2.expires_in }, i2)), await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", i2), this._returnResult({ data: i2, error: j2 }));
              });
            } catch (a11) {
              if (d_(a11)) return this._returnResult({ data: null, error: a11 });
              throw a11;
            }
          });
        }
        async _challenge(a10) {
          return this._acquireLock(-1, async () => {
            try {
              return await this._useSession(async (b10) => {
                var c10;
                let { data: d10, error: e10 } = b10;
                if (e10) return this._returnResult({ data: null, error: e10 });
                let f2 = await eG(this.fetch, "POST", `${this.url}/factors/${a10.factorId}/challenge`, { body: a10, headers: this.headers, jwt: null == (c10 = null == d10 ? void 0 : d10.session) ? void 0 : c10.access_token });
                if (f2.error) return f2;
                let { data: g2 } = f2;
                if ("webauthn" !== g2.type) return { data: g2, error: null };
                switch (g2.webauthn.type) {
                  case "create":
                    return { data: Object.assign(Object.assign({}, g2), { webauthn: Object.assign(Object.assign({}, g2.webauthn), { credential_options: Object.assign(Object.assign({}, g2.webauthn.credential_options), { publicKey: function(a11) {
                      if (!a11) throw Error("Credential creation options are required");
                      if ("u" > typeof PublicKeyCredential && "parseCreationOptionsFromJSON" in PublicKeyCredential && "function" == typeof PublicKeyCredential.parseCreationOptionsFromJSON) return PublicKeyCredential.parseCreationOptionsFromJSON(a11);
                      let { challenge: b11, user: c11, excludeCredentials: d11 } = a11, e11 = (0, cH.__rest)(a11, ["challenge", "user", "excludeCredentials"]), f3 = ei(b11).buffer, g3 = Object.assign(Object.assign({}, c11), { id: ei(c11.id).buffer }), h2 = Object.assign(Object.assign({}, e11), { challenge: f3, user: g3 });
                      if (d11 && d11.length > 0) {
                        h2.excludeCredentials = Array(d11.length);
                        for (let a12 = 0; a12 < d11.length; a12++) {
                          let b12 = d11[a12];
                          h2.excludeCredentials[a12] = Object.assign(Object.assign({}, b12), { id: ei(b12.id).buffer, type: b12.type || "public-key", transports: b12.transports });
                        }
                      }
                      return h2;
                    }(g2.webauthn.credential_options.publicKey) }) }) }), error: null };
                  case "request":
                    return { data: Object.assign(Object.assign({}, g2), { webauthn: Object.assign(Object.assign({}, g2.webauthn), { credential_options: Object.assign(Object.assign({}, g2.webauthn.credential_options), { publicKey: function(a11) {
                      if (!a11) throw Error("Credential request options are required");
                      if ("u" > typeof PublicKeyCredential && "parseRequestOptionsFromJSON" in PublicKeyCredential && "function" == typeof PublicKeyCredential.parseRequestOptionsFromJSON) return PublicKeyCredential.parseRequestOptionsFromJSON(a11);
                      let { challenge: b11, allowCredentials: c11 } = a11, d11 = (0, cH.__rest)(a11, ["challenge", "allowCredentials"]), e11 = ei(b11).buffer, f3 = Object.assign(Object.assign({}, d11), { challenge: e11 });
                      if (c11 && c11.length > 0) {
                        f3.allowCredentials = Array(c11.length);
                        for (let a12 = 0; a12 < c11.length; a12++) {
                          let b12 = c11[a12];
                          f3.allowCredentials[a12] = Object.assign(Object.assign({}, b12), { id: ei(b12.id).buffer, type: b12.type || "public-key", transports: b12.transports });
                        }
                      }
                      return f3;
                    }(g2.webauthn.credential_options.publicKey) }) }) }), error: null };
                }
              });
            } catch (a11) {
              if (d_(a11)) return this._returnResult({ data: null, error: a11 });
              throw a11;
            }
          });
        }
        async _challengeAndVerify(a10) {
          let { data: b10, error: c10 } = await this._challenge({ factorId: a10.factorId });
          return c10 ? this._returnResult({ data: null, error: c10 }) : await this._verify({ factorId: a10.factorId, challengeId: b10.id, code: a10.code });
        }
        async _listFactors() {
          var a10;
          let { data: { user: b10 }, error: c10 } = await this.getUser();
          if (c10) return { data: null, error: c10 };
          let d10 = { all: [], phone: [], totp: [], webauthn: [] };
          for (let c11 of null != (a10 = null == b10 ? void 0 : b10.factors) ? a10 : []) d10.all.push(c11), "verified" === c11.status && d10[c11.factor_type].push(c11);
          return { data: d10, error: null };
        }
        async _getAuthenticatorAssuranceLevel() {
          var a10, b10;
          let { data: { session: c10 }, error: d10 } = await this.getSession();
          if (d10) return this._returnResult({ data: null, error: d10 });
          if (!c10) return { data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] }, error: null };
          let { payload: e10 } = es(c10.access_token), f2 = null;
          e10.aal && (f2 = e10.aal);
          let g2 = f2;
          return (null != (b10 = null == (a10 = c10.user.factors) ? void 0 : a10.filter((a11) => "verified" === a11.status)) ? b10 : []).length > 0 && (g2 = "aal2"), { data: { currentLevel: f2, nextLevel: g2, currentAuthenticationMethods: e10.amr || [] }, error: null };
        }
        async _getAuthorizationDetails(a10) {
          try {
            return await this._useSession(async (b10) => {
              let { data: { session: c10 }, error: d10 } = b10;
              return d10 ? this._returnResult({ data: null, error: d10 }) : c10 ? await eG(this.fetch, "GET", `${this.url}/oauth/authorizations/${a10}`, { headers: this.headers, jwt: c10.access_token, xform: (a11) => ({ data: a11, error: null }) }) : this._returnResult({ data: null, error: new d3() });
            });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async _approveAuthorization(a10, b10) {
          try {
            return await this._useSession(async (c10) => {
              let { data: { session: d10 }, error: e10 } = c10;
              if (e10) return this._returnResult({ data: null, error: e10 });
              if (!d10) return this._returnResult({ data: null, error: new d3() });
              let f2 = await eG(this.fetch, "POST", `${this.url}/oauth/authorizations/${a10}/consent`, { headers: this.headers, jwt: d10.access_token, body: { action: "approve" }, xform: (a11) => ({ data: a11, error: null }) });
              return f2.data && f2.data.redirect_url && ek() && !(null == b10 ? void 0 : b10.skipBrowserRedirect) && window.location.assign(f2.data.redirect_url), f2;
            });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async _denyAuthorization(a10, b10) {
          try {
            return await this._useSession(async (c10) => {
              let { data: { session: d10 }, error: e10 } = c10;
              if (e10) return this._returnResult({ data: null, error: e10 });
              if (!d10) return this._returnResult({ data: null, error: new d3() });
              let f2 = await eG(this.fetch, "POST", `${this.url}/oauth/authorizations/${a10}/consent`, { headers: this.headers, jwt: d10.access_token, body: { action: "deny" }, xform: (a11) => ({ data: a11, error: null }) });
              return f2.data && f2.data.redirect_url && ek() && !(null == b10 ? void 0 : b10.skipBrowserRedirect) && window.location.assign(f2.data.redirect_url), f2;
            });
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
        async fetchJwk(a10, b10 = { keys: [] }) {
          let c10 = b10.keys.find((b11) => b11.kid === a10);
          if (c10) return c10;
          let d10 = Date.now();
          if ((c10 = this.jwks.keys.find((b11) => b11.kid === a10)) && this.jwks_cached_at + 6e5 > d10) return c10;
          let { data: e10, error: f2 } = await eG(this.fetch, "GET", `${this.url}/.well-known/jwks.json`, { headers: this.headers });
          if (f2) throw f2;
          return e10.keys && 0 !== e10.keys.length && (this.jwks = e10, this.jwks_cached_at = d10, c10 = e10.keys.find((b11) => b11.kid === a10)) ? c10 : null;
        }
        async getClaims(a10, b10 = {}) {
          try {
            var c10;
            let d10, e10 = a10;
            if (!e10) {
              let { data: a11, error: b11 } = await this.getSession();
              if (b11 || !a11.session) return this._returnResult({ data: null, error: b11 });
              e10 = a11.session.access_token;
            }
            let { header: f2, payload: g2, signature: h2, raw: { header: i2, payload: j2 } } = es(e10);
            (null == b10 ? void 0 : b10.allowExpired) || function(a11) {
              if (!a11) throw Error("Missing exp claim");
              if (a11 <= Math.floor(Date.now() / 1e3)) throw Error("JWT has expired");
            }(g2.exp);
            let k2 = !f2.alg || f2.alg.startsWith("HS") || !f2.kid || !("crypto" in globalThis && "subtle" in globalThis.crypto) ? null : await this.fetchJwk(f2.kid, (null == b10 ? void 0 : b10.keys) ? { keys: b10.keys } : null == b10 ? void 0 : b10.jwks);
            if (!k2) {
              let { error: a11 } = await this.getUser(e10);
              if (a11) throw a11;
              return { data: { claims: g2, header: f2, signature: h2 }, error: null };
            }
            let l2 = function(a11) {
              switch (a11) {
                case "RS256":
                  return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
                case "ES256":
                  return { name: "ECDSA", namedCurve: "P-256", hash: { name: "SHA-256" } };
                default:
                  throw Error("Invalid alg claim");
              }
            }(f2.alg), m2 = await crypto.subtle.importKey("jwk", k2, l2, true, ["verify"]);
            if (!await crypto.subtle.verify(l2, m2, h2, (c10 = `${i2}.${j2}`, d10 = [], !function(a11, b11) {
              for (let c11 = 0; c11 < a11.length; c11 += 1) {
                let d11 = a11.charCodeAt(c11);
                if (d11 > 55295 && d11 <= 56319) {
                  let b12 = (d11 - 55296) * 1024 & 65535;
                  d11 = (a11.charCodeAt(c11 + 1) - 56320 & 65535 | b12) + 65536, c11 += 1;
                }
                !function(a12, b12) {
                  if (a12 <= 127) return b12(a12);
                  if (a12 <= 2047) {
                    b12(192 | a12 >> 6), b12(128 | 63 & a12);
                    return;
                  }
                  if (a12 <= 65535) {
                    b12(224 | a12 >> 12), b12(128 | a12 >> 6 & 63), b12(128 | 63 & a12);
                    return;
                  }
                  if (a12 <= 1114111) {
                    b12(240 | a12 >> 18), b12(128 | a12 >> 12 & 63), b12(128 | a12 >> 6 & 63), b12(128 | 63 & a12);
                    return;
                  }
                  throw Error(`Unrecognized Unicode codepoint: ${a12.toString(16)}`);
                }(d11, b11);
              }
            }(c10, (a11) => d10.push(a11)), new Uint8Array(d10)))) throw new eb("Invalid JWT signature");
            return { data: { claims: g2, header: f2, signature: h2 }, error: null };
          } catch (a11) {
            if (d_(a11)) return this._returnResult({ data: null, error: a11 });
            throw a11;
          }
        }
      }
      e9.nextInstanceID = {};
      let fa = e9;
      class fb extends fa {
        constructor(a10) {
          super(a10);
        }
      }
      class fc {
        constructor(a10, b10, c10) {
          var d10, e10, f2;
          this.supabaseUrl = a10, this.supabaseKey = b10;
          const g2 = function(a11) {
            let b11 = null == a11 ? void 0 : a11.trim();
            if (!b11) throw Error("supabaseUrl is required.");
            if (!b11.match(/^https?:\/\//i)) throw Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");
            try {
              return new URL(b11.endsWith("/") ? b11 : b11 + "/");
            } catch (a12) {
              throw Error("Invalid supabaseUrl: Provided URL is malformed.");
            }
          }(a10);
          if (!b10) throw Error("supabaseKey is required.");
          this.realtimeUrl = new URL("realtime/v1", g2), this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws"), this.authUrl = new URL("auth/v1", g2), this.storageUrl = new URL("storage/v1", g2), this.functionsUrl = new URL("functions/v1", g2);
          const h2 = `sb-${g2.hostname.split(".")[0]}-auth-token`, i2 = function(a11, b11) {
            var c11, d11;
            let { db: e11, auth: f3, realtime: g3, global: h3 } = a11, { db: i3, auth: j2, realtime: k2, global: l2 } = b11, m2 = { db: Object.assign(Object.assign({}, i3), e11), auth: Object.assign(Object.assign({}, j2), f3), realtime: Object.assign(Object.assign({}, k2), g3), storage: {}, global: Object.assign(Object.assign(Object.assign({}, l2), h3), { headers: Object.assign(Object.assign({}, null != (c11 = null == l2 ? void 0 : l2.headers) ? c11 : {}), null != (d11 = null == h3 ? void 0 : h3.headers) ? d11 : {}) }), accessToken: async () => "" };
            return a11.accessToken ? m2.accessToken = a11.accessToken : delete m2.accessToken, m2;
          }(null != c10 ? c10 : {}, { db: dS, realtime: dU, auth: Object.assign(Object.assign({}, dT), { storageKey: h2 }), global: dR });
          this.storageKey = null != (d10 = i2.auth.storageKey) ? d10 : "", this.headers = null != (e10 = i2.global.headers) ? e10 : {}, i2.accessToken ? (this.accessToken = i2.accessToken, this.auth = new Proxy({}, { get: (a11, b11) => {
            throw Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(b11)} is not possible`);
          } })) : this.auth = this._initSupabaseAuthClient(null != (f2 = i2.auth) ? f2 : {}, this.headers, i2.global.fetch), this.fetch = /* @__PURE__ */ ((a11, b11, c11) => {
            let d11 = c11 ? (...a12) => c11(...a12) : (...a12) => fetch(...a12), e11 = Headers;
            return async (c12, f3) => {
              var g3;
              let h3 = null != (g3 = await b11()) ? g3 : a11, i3 = new e11(null == f3 ? void 0 : f3.headers);
              return i3.has("apikey") || i3.set("apikey", a11), i3.has("Authorization") || i3.set("Authorization", `Bearer ${h3}`), d11(c12, Object.assign(Object.assign({}, f3), { headers: i3 }));
            };
          })(b10, this._getAccessToken.bind(this), i2.global.fetch), this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers, accessToken: this._getAccessToken.bind(this) }, i2.realtime)), this.accessToken && this.accessToken().then((a11) => this.realtime.setAuth(a11)).catch((a11) => console.warn("Failed to set initial Realtime auth token:", a11)), this.rest = new cP(new URL("rest/v1", g2).href, { headers: this.headers, schema: i2.db.schema, fetch: this.fetch }), this.storage = new dP(this.storageUrl.href, this.headers, this.fetch, null == c10 ? void 0 : c10.storage), i2.accessToken || this._listenForAuthEvents();
        }
        get functions() {
          return new cM(this.functionsUrl.href, { headers: this.headers, customFetch: this.fetch });
        }
        from(a10) {
          return this.rest.from(a10);
        }
        schema(a10) {
          return this.rest.schema(a10);
        }
        rpc(a10, b10 = {}, c10 = { head: false, get: false, count: void 0 }) {
          return this.rest.rpc(a10, b10, c10);
        }
        channel(a10, b10 = { config: {} }) {
          return this.realtime.channel(a10, b10);
        }
        getChannels() {
          return this.realtime.getChannels();
        }
        removeChannel(a10) {
          return this.realtime.removeChannel(a10);
        }
        removeAllChannels() {
          return this.realtime.removeAllChannels();
        }
        async _getAccessToken() {
          var a10, b10;
          if (this.accessToken) return await this.accessToken();
          let { data: c10 } = await this.auth.getSession();
          return null != (b10 = null == (a10 = c10.session) ? void 0 : a10.access_token) ? b10 : this.supabaseKey;
        }
        _initSupabaseAuthClient({ autoRefreshToken: a10, persistSession: b10, detectSessionInUrl: c10, storage: d10, userStorage: e10, storageKey: f2, flowType: g2, lock: h2, debug: i2, throwOnError: j2 }, k2, l2) {
          let m2 = { Authorization: `Bearer ${this.supabaseKey}`, apikey: `${this.supabaseKey}` };
          return new fb({ url: this.authUrl.href, headers: Object.assign(Object.assign({}, m2), k2), storageKey: f2, autoRefreshToken: a10, persistSession: b10, detectSessionInUrl: c10, storage: d10, userStorage: e10, flowType: g2, lock: h2, debug: i2, throwOnError: j2, fetch: l2, hasCustomAuthorizationHeader: Object.keys(this.headers).some((a11) => "authorization" === a11.toLowerCase()) });
        }
        _initRealtimeClient(a10) {
          return new dd(this.realtimeUrl.href, Object.assign(Object.assign({}, a10), { params: Object.assign({ apikey: this.supabaseKey }, null == a10 ? void 0 : a10.params) }));
        }
        _listenForAuthEvents() {
          return this.auth.onAuthStateChange((a10, b10) => {
            this._handleTokenChanged(a10, "CLIENT", null == b10 ? void 0 : b10.access_token);
          });
        }
        _handleTokenChanged(a10, b10, c10) {
          ("TOKEN_REFRESHED" === a10 || "SIGNED_IN" === a10) && this.changedAccessToken !== c10 ? (this.changedAccessToken = c10, this.realtime.setAuth(c10)) : "SIGNED_OUT" === a10 && (this.realtime.setAuth(), "STORAGE" == b10 && this.auth.signOut(), this.changedAccessToken = void 0);
        }
      }
      function fd(a10) {
        return null != a10 && "object" == typeof a10 && true === a10["@@functional/placeholder"];
      }
      function fe(a10) {
        return function b10(c10) {
          return 0 == arguments.length || fd(c10) ? b10 : a10.apply(this, arguments);
        };
      }
      function ff(a10) {
        return function b10(c10, d10) {
          switch (arguments.length) {
            case 0:
              return b10;
            case 1:
              return fd(c10) ? b10 : fe(function(b11) {
                return a10(c10, b11);
              });
            default:
              return fd(c10) && fd(d10) ? b10 : fd(c10) ? fe(function(b11) {
                return a10(b11, d10);
              }) : fd(d10) ? fe(function(b11) {
                return a10(c10, b11);
              }) : a10(c10, d10);
          }
        };
      }
      function fg(a10) {
        return function b10(c10, d10, e10) {
          switch (arguments.length) {
            case 0:
              return b10;
            case 1:
              return fd(c10) ? b10 : ff(function(b11, d11) {
                return a10(c10, b11, d11);
              });
            case 2:
              return fd(c10) && fd(d10) ? b10 : fd(c10) ? ff(function(b11, c11) {
                return a10(b11, d10, c11);
              }) : fd(d10) ? ff(function(b11, d11) {
                return a10(c10, b11, d11);
              }) : fe(function(b11) {
                return a10(c10, d10, b11);
              });
            default:
              return fd(c10) && fd(d10) && fd(e10) ? b10 : fd(c10) && fd(d10) ? ff(function(b11, c11) {
                return a10(b11, c11, e10);
              }) : fd(c10) && fd(e10) ? ff(function(b11, c11) {
                return a10(b11, d10, c11);
              }) : fd(d10) && fd(e10) ? ff(function(b11, d11) {
                return a10(c10, b11, d11);
              }) : fd(c10) ? fe(function(b11) {
                return a10(b11, d10, e10);
              }) : fd(d10) ? fe(function(b11) {
                return a10(c10, b11, e10);
              }) : fd(e10) ? fe(function(b11) {
                return a10(c10, d10, b11);
              }) : a10(c10, d10, e10);
          }
        };
      }
      function fh(a10) {
        return "[object Object]" === Object.prototype.toString.call(a10);
      }
      function fi(a10, b10) {
        return Object.prototype.hasOwnProperty.call(b10, a10);
      }
      (function() {
        if ("u" > typeof window || "u" < typeof process) return false;
        let a10 = process.version;
        if (null == a10) return false;
        let b10 = a10.match(/^v(\d+)\./);
        return !!b10 && 18 >= parseInt(b10[1], 10);
      })() && console.warn("\u26A0\uFE0F  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217");
      var fj = fg(function(a10, b10, c10) {
        var d10, e10 = {};
        for (d10 in c10 = c10 || {}, b10 = b10 || {}) fi(d10, b10) && (e10[d10] = fi(d10, c10) ? a10(d10, b10[d10], c10[d10]) : b10[d10]);
        for (d10 in c10) fi(d10, c10) && !fi(d10, e10) && (e10[d10] = c10[d10]);
        return e10;
      }), fk = fg(function a10(b10, c10, d10) {
        return fj(function(c11, d11, e10) {
          return fh(d11) && fh(e10) ? a10(b10, d11, e10) : b10(c11, d11, e10);
        }, c10, d10);
      }), fl = ff(function(a10, b10) {
        return fk(function(a11, b11, c10) {
          return c10;
        }, a10, b10);
      });
      function fm() {
        return "u" > typeof window && void 0 !== window.document;
      }
      var fn = { path: "/", sameSite: "lax", httpOnly: false, maxAge: 31536e6 };
      async function fo(a10, b10) {
        let c10 = await b10(a10);
        if (c10) return c10;
        let d10 = [];
        for (let c11 = 0; ; c11++) {
          let e10 = `${a10}.${c11}`, f2 = await b10(e10);
          if (!f2) break;
          d10.push(f2);
        }
        if (d10.length > 0) return d10.join("");
      }
      async function fp(a10, b10, c10) {
        if (await b10(a10)) return void await c10(a10);
        for (let d10 = 0; ; d10++) {
          let e10 = `${a10}.${d10}`;
          if (!await b10(e10)) break;
          await c10(e10);
        }
      }
      c(990), "u" < typeof URLPattern || URLPattern;
      var fq = c(345);
      if (/* @__PURE__ */ new WeakMap(), fq.unstable_postpone, false === ("Route %%% needs to bail out of prerendering at this point because it used ^^^. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error".includes("needs to bail out of prerendering at this point because it used") && "Route %%% needs to bail out of prerendering at this point because it used ^^^. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error".includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error"))) throw Object.defineProperty(Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E296", enumerable: false, configurable: true });
      async function fr(a10) {
        let b10 = aI.next({ request: a10 }), c10 = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || globalThis.NEXT_PUBLIC_SUPABASE_URL || globalThis.SUPABASE_URL || "", d10 = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || globalThis.NEXT_PUBLIC_SUPABASE_ANON_KEY || globalThis.SUPABASE_ANON_KEY || "";
        if (!c10 || !d10) return b10;
        let e10 = function(a11, b11, c11) {
          if (!a11 || !b11) throw Error(`Your project's URL and Key are required to create a Supabase client!

Check your Supabase project's API settings to find these values

https://supabase.com/dashboard/project/_/settings/api`);
          let { cookies: d11, cookieOptions: e11, ...f3 } = c11;
          return (null == e11 ? void 0 : e11.name) && (f3.auth = { ...f3.auth, storageKey: e11.name }), new fc(a11, b11, fl({ global: { headers: { "X-Client-Info": "supabase-ssr/0.1.0" } }, auth: { flowType: "pkce", autoRefreshToken: fm(), detectSessionInUrl: fm(), persistSession: true, storage: { isServer: true, getItem: async (a12) => await fo(a12, async (a13) => {
            if ("function" == typeof d11.get) return await d11.get(a13);
          }), setItem: async (a12, b12) => {
            let c12 = function(a13, b13) {
              let c13 = 3180, d12 = encodeURIComponent(b13);
              if (d12.length <= c13) return [{ name: a13, value: b13 }];
              let e12 = [];
              for (; d12.length > 0; ) {
                let a14 = d12.slice(0, c13), b14 = a14.lastIndexOf("%");
                b14 > c13 - 3 && (a14 = a14.slice(0, b14));
                let f4 = "";
                for (; a14.length > 0; ) try {
                  f4 = decodeURIComponent(a14);
                  break;
                } catch (b15) {
                  if (b15 instanceof URIError && "%" === a14.at(-3) && a14.length > 3) a14 = a14.slice(0, a14.length - 3);
                  else throw b15;
                }
                e12.push(f4), d12 = d12.slice(a14.length);
              }
              return e12.map((b14, c14) => ({ name: `${a13}.${c14}`, value: b14 }));
            }(a12, b12);
            await Promise.all(c12.map(async (a13) => {
              "function" == typeof d11.set && await d11.set(a13.name, a13.value, { ...fn, ...e11, maxAge: fn.maxAge });
            }));
          }, removeItem: async (a12) => {
            "function" == typeof d11.remove && "function" != typeof d11.get ? console.log("Removing chunked cookie without a `get` method is not supported.\n\n	When you call the `createServerClient` function from the `@supabase/ssr` package, make sure you declare both a `get` and `remove` method on the `cookies` object.\n\nhttps://supabase.com/docs/guides/auth/server-side/creating-a-client") : fp(a12, async (a13) => {
              if ("function" == typeof d11.get) return await d11.get(a13);
            }, async (a13) => {
              if ("function" == typeof d11.remove) return await d11.remove(a13, { ...fn, ...e11, maxAge: 0 });
            });
          } } } }, f3));
        }(c10, d10, { cookies: { get: (b11) => a10.cookies.get(b11)?.value, set(c11, d11, e11) {
          a10.cookies.set({ name: c11, value: d11, ...e11 }), (b10 = aI.next({ request: a10 })).cookies.set({ name: c11, value: d11, ...e11 });
        }, remove(c11, d11) {
          a10.cookies.set({ name: c11, value: "", ...d11 }), (b10 = aI.next({ request: a10 })).cookies.set({ name: c11, value: "", ...d11 });
        } } }), { data: { user: f2 } } = await e10.auth.getUser();
        if (!f2 && !a10.nextUrl.pathname.startsWith("/login") && !a10.nextUrl.pathname.startsWith("/register") && !a10.nextUrl.pathname.startsWith("/verify-email") && !a10.nextUrl.pathname.startsWith("/forgot-password") && !a10.nextUrl.pathname.startsWith("/reset-password") && !a10.nextUrl.pathname.startsWith("/instructions") && !a10.nextUrl.pathname.startsWith("/terms") && !a10.nextUrl.pathname.startsWith("/privacy") && !a10.nextUrl.pathname.startsWith("/faq") && !a10.nextUrl.pathname.startsWith("/help") && "/" !== a10.nextUrl.pathname) {
          let b11 = a10.nextUrl.clone();
          return b11.pathname = "/login", aI.redirect(b11);
        }
        return b10;
      }
      RegExp("\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at __next_root_layout_boundary__ \\([^\\n]*\\)"), RegExp("\\n\\s+at __next_metadata_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_viewport_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_outlet_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_instant_validation_boundary__[\\n\\s]");
      let fs = "experimental-edge";
      async function ft(a10) {
        return await fr(a10);
      }
      let fu = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
      Object.values({ NOT_FOUND: 404, FORBIDDEN: 403, UNAUTHORIZED: 401 });
      let fv = { ...T }, fw = "/middleware", fx = (0, fv.middleware || fv.default);
      class fy extends Error {
        constructor(a10) {
          super(a10), this.stack = "";
        }
      }
      if ("function" != typeof fx) throw new fy(`The Middleware file "${fw}" must export a function named \`middleware\` or a default function.`);
      let fz = (a10) => b2({ ...a10, IncrementalCache: cG, incrementalCacheHandler: null, page: fw, handler: async (...a11) => {
        try {
          return await fx(...a11);
        } catch (e10) {
          let b10 = a11[0], c10 = new URL(b10.url), d10 = c10.pathname + c10.search;
          throw await X(e10, { path: d10, method: b10.method, headers: Object.fromEntries(b10.headers.entries()) }, { routerKind: "Pages Router", routePath: "/proxy", routeType: "proxy", revalidateReason: void 0 }), e10;
        }
      } });
      async function fA(a10, b10) {
        let c10 = await fz({ request: { url: a10.url, method: a10.method, headers: aj(a10.headers), nextConfig: { basePath: "", i18n: "", trailingSlash: false, experimental: { cacheLife: { default: { stale: 300, revalidate: 900, expire: 4294967294 }, seconds: { stale: 30, revalidate: 1, expire: 60 }, minutes: { stale: 300, revalidate: 60, expire: 3600 }, hours: { stale: 300, revalidate: 3600, expire: 86400 }, days: { stale: 300, revalidate: 86400, expire: 604800 }, weeks: { stale: 300, revalidate: 604800, expire: 2592e3 }, max: { stale: 300, revalidate: 2592e3, expire: 31536e3 } }, authInterrupts: false, clientParamParsingOrigins: [] } }, page: { name: fw }, body: "GET" !== a10.method && "HEAD" !== a10.method ? a10.body ?? void 0 : void 0, waitUntil: b10.waitUntil, requestMeta: b10.requestMeta, signal: b10.signal || new AbortController().signal } });
        return null == b10.waitUntil || b10.waitUntil.call(b10, c10.waitUntil), c10.response;
      }
      let fB = fz;
    }, 852: (a) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "//");
        var b, c, d, e, f = {};
        f.parse = function(a2, c2) {
          if ("string" != typeof a2) throw TypeError("argument str must be a string");
          for (var e2 = {}, f2 = a2.split(d), g = (c2 || {}).decode || b, h = 0; h < f2.length; h++) {
            var i = f2[h], j = i.indexOf("=");
            if (!(j < 0)) {
              var k = i.substr(0, j).trim(), l = i.substr(++j, i.length).trim();
              '"' == l[0] && (l = l.slice(1, -1)), void 0 == e2[k] && (e2[k] = function(a3, b2) {
                try {
                  return b2(a3);
                } catch (b3) {
                  return a3;
                }
              }(l, g));
            }
          }
          return e2;
        }, f.serialize = function(a2, b2, d2) {
          var f2 = d2 || {}, g = f2.encode || c;
          if ("function" != typeof g) throw TypeError("option encode is invalid");
          if (!e.test(a2)) throw TypeError("argument name is invalid");
          var h = g(b2);
          if (h && !e.test(h)) throw TypeError("argument val is invalid");
          var i = a2 + "=" + h;
          if (null != f2.maxAge) {
            var j = f2.maxAge - 0;
            if (isNaN(j) || !isFinite(j)) throw TypeError("option maxAge is invalid");
            i += "; Max-Age=" + Math.floor(j);
          }
          if (f2.domain) {
            if (!e.test(f2.domain)) throw TypeError("option domain is invalid");
            i += "; Domain=" + f2.domain;
          }
          if (f2.path) {
            if (!e.test(f2.path)) throw TypeError("option path is invalid");
            i += "; Path=" + f2.path;
          }
          if (f2.expires) {
            if ("function" != typeof f2.expires.toUTCString) throw TypeError("option expires is invalid");
            i += "; Expires=" + f2.expires.toUTCString();
          }
          if (f2.httpOnly && (i += "; HttpOnly"), f2.secure && (i += "; Secure"), f2.sameSite) switch ("string" == typeof f2.sameSite ? f2.sameSite.toLowerCase() : f2.sameSite) {
            case true:
            case "strict":
              i += "; SameSite=Strict";
              break;
            case "lax":
              i += "; SameSite=Lax";
              break;
            case "none":
              i += "; SameSite=None";
              break;
            default:
              throw TypeError("option sameSite is invalid");
          }
          return i;
        }, b = decodeURIComponent, c = encodeURIComponent, d = /; */, e = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/, a.exports = f;
      })();
    }, 855: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      let d = c(284).__importDefault(c(827));
      class e {
        constructor(a2, { headers: b2 = {}, schema: c2, fetch: d2 }) {
          this.url = a2, this.headers = new Headers(b2), this.schema = c2, this.fetch = d2;
        }
        select(a2, b2) {
          let { head: c2 = false, count: e2 } = null != b2 ? b2 : {}, f = false, g = (null != a2 ? a2 : "*").split("").map((a3) => /\s/.test(a3) && !f ? "" : ('"' === a3 && (f = !f), a3)).join("");
          return this.url.searchParams.set("select", g), e2 && this.headers.append("Prefer", `count=${e2}`), new d.default({ method: c2 ? "HEAD" : "GET", url: this.url, headers: this.headers, schema: this.schema, fetch: this.fetch });
        }
        insert(a2, { count: b2, defaultToNull: c2 = true } = {}) {
          var e2;
          if (b2 && this.headers.append("Prefer", `count=${b2}`), c2 || this.headers.append("Prefer", "missing=default"), Array.isArray(a2)) {
            let b3 = a2.reduce((a3, b4) => a3.concat(Object.keys(b4)), []);
            if (b3.length > 0) {
              let a3 = [...new Set(b3)].map((a4) => `"${a4}"`);
              this.url.searchParams.set("columns", a3.join(","));
            }
          }
          return new d.default({ method: "POST", url: this.url, headers: this.headers, schema: this.schema, body: a2, fetch: null != (e2 = this.fetch) ? e2 : fetch });
        }
        upsert(a2, { onConflict: b2, ignoreDuplicates: c2 = false, count: e2, defaultToNull: f = true } = {}) {
          var g;
          if (this.headers.append("Prefer", `resolution=${c2 ? "ignore" : "merge"}-duplicates`), void 0 !== b2 && this.url.searchParams.set("on_conflict", b2), e2 && this.headers.append("Prefer", `count=${e2}`), f || this.headers.append("Prefer", "missing=default"), Array.isArray(a2)) {
            let b3 = a2.reduce((a3, b4) => a3.concat(Object.keys(b4)), []);
            if (b3.length > 0) {
              let a3 = [...new Set(b3)].map((a4) => `"${a4}"`);
              this.url.searchParams.set("columns", a3.join(","));
            }
          }
          return new d.default({ method: "POST", url: this.url, headers: this.headers, schema: this.schema, body: a2, fetch: null != (g = this.fetch) ? g : fetch });
        }
        update(a2, { count: b2 } = {}) {
          var c2;
          return b2 && this.headers.append("Prefer", `count=${b2}`), new d.default({ method: "PATCH", url: this.url, headers: this.headers, schema: this.schema, body: a2, fetch: null != (c2 = this.fetch) ? c2 : fetch });
        }
        delete({ count: a2 } = {}) {
          var b2;
          return a2 && this.headers.append("Prefer", `count=${a2}`), new d.default({ method: "DELETE", url: this.url, headers: this.headers, schema: this.schema, fetch: null != (b2 = this.fetch) ? b2 : fetch });
        }
      }
      b.default = e;
    }, 918: (a) => {
      "use strict";
      var b = Object.defineProperty, c = Object.getOwnPropertyDescriptor, d = Object.getOwnPropertyNames, e = Object.prototype.hasOwnProperty, f = {}, g = { RequestCookies: () => n, ResponseCookies: () => o, parseCookie: () => j, parseSetCookie: () => k, stringifyCookie: () => i };
      for (var h in g) b(f, h, { get: g[h], enumerable: true });
      function i(a2) {
        var b2;
        let c2 = ["path" in a2 && a2.path && `Path=${a2.path}`, "expires" in a2 && (a2.expires || 0 === a2.expires) && `Expires=${("number" == typeof a2.expires ? new Date(a2.expires) : a2.expires).toUTCString()}`, "maxAge" in a2 && "number" == typeof a2.maxAge && `Max-Age=${a2.maxAge}`, "domain" in a2 && a2.domain && `Domain=${a2.domain}`, "secure" in a2 && a2.secure && "Secure", "httpOnly" in a2 && a2.httpOnly && "HttpOnly", "sameSite" in a2 && a2.sameSite && `SameSite=${a2.sameSite}`, "partitioned" in a2 && a2.partitioned && "Partitioned", "priority" in a2 && a2.priority && `Priority=${a2.priority}`].filter(Boolean), d2 = `${a2.name}=${encodeURIComponent(null != (b2 = a2.value) ? b2 : "")}`;
        return 0 === c2.length ? d2 : `${d2}; ${c2.join("; ")}`;
      }
      function j(a2) {
        let b2 = /* @__PURE__ */ new Map();
        for (let c2 of a2.split(/; */)) {
          if (!c2) continue;
          let a3 = c2.indexOf("=");
          if (-1 === a3) {
            b2.set(c2, "true");
            continue;
          }
          let [d2, e2] = [c2.slice(0, a3), c2.slice(a3 + 1)];
          try {
            b2.set(d2, decodeURIComponent(null != e2 ? e2 : "true"));
          } catch {
          }
        }
        return b2;
      }
      function k(a2) {
        if (!a2) return;
        let [[b2, c2], ...d2] = j(a2), { domain: e2, expires: f2, httponly: g2, maxage: h2, path: i2, samesite: k2, secure: n2, partitioned: o2, priority: p } = Object.fromEntries(d2.map(([a3, b3]) => [a3.toLowerCase().replace(/-/g, ""), b3]));
        {
          var q, r, s = { name: b2, value: decodeURIComponent(c2), domain: e2, ...f2 && { expires: new Date(f2) }, ...g2 && { httpOnly: true }, ..."string" == typeof h2 && { maxAge: Number(h2) }, path: i2, ...k2 && { sameSite: l.includes(q = (q = k2).toLowerCase()) ? q : void 0 }, ...n2 && { secure: true }, ...p && { priority: m.includes(r = (r = p).toLowerCase()) ? r : void 0 }, ...o2 && { partitioned: true } };
          let a3 = {};
          for (let b3 in s) s[b3] && (a3[b3] = s[b3]);
          return a3;
        }
      }
      a.exports = ((a2, f2, g2, h2) => {
        if (f2 && "object" == typeof f2 || "function" == typeof f2) for (let i2 of d(f2)) e.call(a2, i2) || i2 === g2 || b(a2, i2, { get: () => f2[i2], enumerable: !(h2 = c(f2, i2)) || h2.enumerable });
        return a2;
      })(b({}, "__esModule", { value: true }), f);
      var l = ["strict", "lax", "none"], m = ["low", "medium", "high"], n = class {
        constructor(a2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = a2;
          const b2 = a2.get("cookie");
          if (b2) for (const [a3, c2] of j(b2)) this._parsed.set(a3, { name: a3, value: c2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...a2) {
          let b2 = "string" == typeof a2[0] ? a2[0] : a2[0].name;
          return this._parsed.get(b2);
        }
        getAll(...a2) {
          var b2;
          let c2 = Array.from(this._parsed);
          if (!a2.length) return c2.map(([a3, b3]) => b3);
          let d2 = "string" == typeof a2[0] ? a2[0] : null == (b2 = a2[0]) ? void 0 : b2.name;
          return c2.filter(([a3]) => a3 === d2).map(([a3, b3]) => b3);
        }
        has(a2) {
          return this._parsed.has(a2);
        }
        set(...a2) {
          let [b2, c2] = 1 === a2.length ? [a2[0].name, a2[0].value] : a2, d2 = this._parsed;
          return d2.set(b2, { name: b2, value: c2 }), this._headers.set("cookie", Array.from(d2).map(([a3, b3]) => i(b3)).join("; ")), this;
        }
        delete(a2) {
          let b2 = this._parsed, c2 = Array.isArray(a2) ? a2.map((a3) => b2.delete(a3)) : b2.delete(a2);
          return this._headers.set("cookie", Array.from(b2).map(([a3, b3]) => i(b3)).join("; ")), c2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((a2) => `${a2.name}=${encodeURIComponent(a2.value)}`).join("; ");
        }
      }, o = class {
        constructor(a2) {
          var b2, c2, d2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = a2;
          const e2 = null != (d2 = null != (c2 = null == (b2 = a2.getSetCookie) ? void 0 : b2.call(a2)) ? c2 : a2.get("set-cookie")) ? d2 : [];
          for (const a3 of Array.isArray(e2) ? e2 : function(a4) {
            if (!a4) return [];
            var b3, c3, d3, e3, f2, g2 = [], h2 = 0;
            function i2() {
              for (; h2 < a4.length && /\s/.test(a4.charAt(h2)); ) h2 += 1;
              return h2 < a4.length;
            }
            for (; h2 < a4.length; ) {
              for (b3 = h2, f2 = false; i2(); ) if ("," === (c3 = a4.charAt(h2))) {
                for (d3 = h2, h2 += 1, i2(), e3 = h2; h2 < a4.length && "=" !== (c3 = a4.charAt(h2)) && ";" !== c3 && "," !== c3; ) h2 += 1;
                h2 < a4.length && "=" === a4.charAt(h2) ? (f2 = true, h2 = e3, g2.push(a4.substring(b3, d3)), b3 = h2) : h2 = d3 + 1;
              } else h2 += 1;
              (!f2 || h2 >= a4.length) && g2.push(a4.substring(b3, a4.length));
            }
            return g2;
          }(e2)) {
            const b3 = k(a3);
            b3 && this._parsed.set(b3.name, b3);
          }
        }
        get(...a2) {
          let b2 = "string" == typeof a2[0] ? a2[0] : a2[0].name;
          return this._parsed.get(b2);
        }
        getAll(...a2) {
          var b2;
          let c2 = Array.from(this._parsed.values());
          if (!a2.length) return c2;
          let d2 = "string" == typeof a2[0] ? a2[0] : null == (b2 = a2[0]) ? void 0 : b2.name;
          return c2.filter((a3) => a3.name === d2);
        }
        has(a2) {
          return this._parsed.has(a2);
        }
        set(...a2) {
          let [b2, c2, d2] = 1 === a2.length ? [a2[0].name, a2[0].value, a2[0]] : a2, e2 = this._parsed;
          return e2.set(b2, function(a3 = { name: "", value: "" }) {
            return "number" == typeof a3.expires && (a3.expires = new Date(a3.expires)), a3.maxAge && (a3.expires = new Date(Date.now() + 1e3 * a3.maxAge)), (null === a3.path || void 0 === a3.path) && (a3.path = "/"), a3;
          }({ name: b2, value: c2, ...d2 })), function(a3, b3) {
            for (let [, c3] of (b3.delete("set-cookie"), a3)) {
              let a4 = i(c3);
              b3.append("set-cookie", a4);
            }
          }(e2, this._headers), this;
        }
        delete(...a2) {
          let [b2, c2] = "string" == typeof a2[0] ? [a2[0]] : [a2[0].name, a2[0]];
          return this.set({ ...c2, name: b2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(i).join("; ");
        }
      };
    }, 987: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      var d = { interceptTestApis: function() {
        return h;
      }, wrapRequestHandler: function() {
        return i;
      } };
      for (var e in d) Object.defineProperty(b, e, { enumerable: true, get: d[e] });
      let f = c(643), g = c(318);
      function h() {
        return (0, g.interceptFetch)(c.g.fetch);
      }
      function i(a2) {
        return (b2, c2) => (0, f.withRequest)(b2, g.reader, () => a2(b2, c2));
      }
    }, 990: (a, b, c) => {
      var d, e = { 226: function(e2, f2) {
        !function(g2) {
          "use strict";
          var h = "function", i = "undefined", j = "object", k = "string", l = "major", m = "model", n = "name", o = "type", p = "vendor", q = "version", r = "architecture", s = "console", t = "mobile", u = "tablet", v = "smarttv", w = "wearable", x = "embedded", y = "Amazon", z = "Apple", A = "ASUS", B = "BlackBerry", C = "Browser", D = "Chrome", E = "Firefox", F = "Google", G = "Huawei", H = "Microsoft", I = "Motorola", J = "Opera", K = "Samsung", L = "Sharp", M = "Sony", N = "Xiaomi", O = "Zebra", P = "Facebook", Q = "Chromium OS", R = "Mac OS", S = function(a2, b2) {
            var c2 = {};
            for (var d2 in a2) b2[d2] && b2[d2].length % 2 == 0 ? c2[d2] = b2[d2].concat(a2[d2]) : c2[d2] = a2[d2];
            return c2;
          }, T = function(a2) {
            for (var b2 = {}, c2 = 0; c2 < a2.length; c2++) b2[a2[c2].toUpperCase()] = a2[c2];
            return b2;
          }, U = function(a2, b2) {
            return typeof a2 === k && -1 !== V(b2).indexOf(V(a2));
          }, V = function(a2) {
            return a2.toLowerCase();
          }, W = function(a2, b2) {
            if (typeof a2 === k) return a2 = a2.replace(/^\s\s*/, ""), typeof b2 === i ? a2 : a2.substring(0, 350);
          }, X = function(a2, b2) {
            for (var c2, d2, e3, f3, g3, i2, k2 = 0; k2 < b2.length && !g3; ) {
              var l2 = b2[k2], m2 = b2[k2 + 1];
              for (c2 = d2 = 0; c2 < l2.length && !g3 && l2[c2]; ) if (g3 = l2[c2++].exec(a2)) for (e3 = 0; e3 < m2.length; e3++) i2 = g3[++d2], typeof (f3 = m2[e3]) === j && f3.length > 0 ? 2 === f3.length ? typeof f3[1] == h ? this[f3[0]] = f3[1].call(this, i2) : this[f3[0]] = f3[1] : 3 === f3.length ? typeof f3[1] !== h || f3[1].exec && f3[1].test ? this[f3[0]] = i2 ? i2.replace(f3[1], f3[2]) : void 0 : this[f3[0]] = i2 ? f3[1].call(this, i2, f3[2]) : void 0 : 4 === f3.length && (this[f3[0]] = i2 ? f3[3].call(this, i2.replace(f3[1], f3[2])) : void 0) : this[f3] = i2 || void 0;
              k2 += 2;
            }
          }, Y = function(a2, b2) {
            for (var c2 in b2) if (typeof b2[c2] === j && b2[c2].length > 0) {
              for (var d2 = 0; d2 < b2[c2].length; d2++) if (U(b2[c2][d2], a2)) return "?" === c2 ? void 0 : c2;
            } else if (U(b2[c2], a2)) return "?" === c2 ? void 0 : c2;
            return a2;
          }, Z = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, $ = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [q, [n, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [q, [n, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [n, q], [/opios[\/ ]+([\w\.]+)/i], [q, [n, J + " Mini"]], [/\bopr\/([\w\.]+)/i], [q, [n, J]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [n, q], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [q, [n, "UC" + C]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [q, [n, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [q, [n, "WeChat"]], [/konqueror\/([\w\.]+)/i], [q, [n, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [q, [n, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [q, [n, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[n, /(.+)/, "$1 Secure " + C], q], [/\bfocus\/([\w\.]+)/i], [q, [n, E + " Focus"]], [/\bopt\/([\w\.]+)/i], [q, [n, J + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [q, [n, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [q, [n, "Dolphin"]], [/coast\/([\w\.]+)/i], [q, [n, J + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [q, [n, "MIUI " + C]], [/fxios\/([-\w\.]+)/i], [q, [n, E]], [/\bqihu|(qi?ho?o?|360)browser/i], [[n, "360 " + C]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[n, /(.+)/, "$1 " + C], q], [/(comodo_dragon)\/([\w\.]+)/i], [[n, /_/g, " "], q], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [n, q], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [n], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[n, P], q], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [n, q], [/\bgsa\/([\w\.]+) .*safari\//i], [q, [n, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [q, [n, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [q, [n, D + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[n, D + " WebView"], q], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [q, [n, "Android " + C]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [n, q], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [q, [n, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [q, n], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [n, [q, Y, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [n, q], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[n, "Netscape"], q], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [q, [n, E + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [n, q], [/(cobalt)\/([\w\.]+)/i], [n, [q, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[r, "amd64"]], [/(ia32(?=;))/i], [[r, V]], [/((?:i[346]|x)86)[;\)]/i], [[r, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[r, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[r, "armhf"]], [/windows (ce|mobile); ppc;/i], [[r, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[r, /ower/, "", V]], [/(sun4\w)[;\)]/i], [[r, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[r, V]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [m, [p, K], [o, u]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [m, [p, K], [o, t]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [m, [p, z], [o, t]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [m, [p, z], [o, u]], [/(macintosh);/i], [m, [p, z]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [m, [p, L], [o, t]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [m, [p, G], [o, u]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [m, [p, G], [o, t]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[m, /_/g, " "], [p, N], [o, t]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[m, /_/g, " "], [p, N], [o, u]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [m, [p, "OPPO"], [o, t]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [m, [p, "Vivo"], [o, t]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [m, [p, "Realme"], [o, t]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [m, [p, I], [o, t]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [m, [p, I], [o, u]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [m, [p, "LG"], [o, u]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [m, [p, "LG"], [o, t]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [m, [p, "Lenovo"], [o, u]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[m, /_/g, " "], [p, "Nokia"], [o, t]], [/(pixel c)\b/i], [m, [p, F], [o, u]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [m, [p, F], [o, t]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [m, [p, M], [o, t]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[m, "Xperia Tablet"], [p, M], [o, u]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [m, [p, "OnePlus"], [o, t]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [m, [p, y], [o, u]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[m, /(.+)/g, "Fire Phone $1"], [p, y], [o, t]], [/(playbook);[-\w\),; ]+(rim)/i], [m, p, [o, u]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [m, [p, B], [o, t]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [m, [p, A], [o, u]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [m, [p, A], [o, t]], [/(nexus 9)/i], [m, [p, "HTC"], [o, u]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [p, [m, /_/g, " "], [o, t]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [m, [p, "Acer"], [o, u]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [m, [p, "Meizu"], [o, t]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [p, m, [o, t]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [p, m, [o, u]], [/(surface duo)/i], [m, [p, H], [o, u]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [m, [p, "Fairphone"], [o, t]], [/(u304aa)/i], [m, [p, "AT&T"], [o, t]], [/\bsie-(\w*)/i], [m, [p, "Siemens"], [o, t]], [/\b(rct\w+) b/i], [m, [p, "RCA"], [o, u]], [/\b(venue[\d ]{2,7}) b/i], [m, [p, "Dell"], [o, u]], [/\b(q(?:mv|ta)\w+) b/i], [m, [p, "Verizon"], [o, u]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [m, [p, "Barnes & Noble"], [o, u]], [/\b(tm\d{3}\w+) b/i], [m, [p, "NuVision"], [o, u]], [/\b(k88) b/i], [m, [p, "ZTE"], [o, u]], [/\b(nx\d{3}j) b/i], [m, [p, "ZTE"], [o, t]], [/\b(gen\d{3}) b.+49h/i], [m, [p, "Swiss"], [o, t]], [/\b(zur\d{3}) b/i], [m, [p, "Swiss"], [o, u]], [/\b((zeki)?tb.*\b) b/i], [m, [p, "Zeki"], [o, u]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[p, "Dragon Touch"], m, [o, u]], [/\b(ns-?\w{0,9}) b/i], [m, [p, "Insignia"], [o, u]], [/\b((nxa|next)-?\w{0,9}) b/i], [m, [p, "NextBook"], [o, u]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[p, "Voice"], m, [o, t]], [/\b(lvtel\-)?(v1[12]) b/i], [[p, "LvTel"], m, [o, t]], [/\b(ph-1) /i], [m, [p, "Essential"], [o, t]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [m, [p, "Envizen"], [o, u]], [/\b(trio[-\w\. ]+) b/i], [m, [p, "MachSpeed"], [o, u]], [/\btu_(1491) b/i], [m, [p, "Rotor"], [o, u]], [/(shield[\w ]+) b/i], [m, [p, "Nvidia"], [o, u]], [/(sprint) (\w+)/i], [p, m, [o, t]], [/(kin\.[onetw]{3})/i], [[m, /\./g, " "], [p, H], [o, t]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [m, [p, O], [o, u]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [m, [p, O], [o, t]], [/smart-tv.+(samsung)/i], [p, [o, v]], [/hbbtv.+maple;(\d+)/i], [[m, /^/, "SmartTV"], [p, K], [o, v]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[p, "LG"], [o, v]], [/(apple) ?tv/i], [p, [m, z + " TV"], [o, v]], [/crkey/i], [[m, D + "cast"], [p, F], [o, v]], [/droid.+aft(\w)( bui|\))/i], [m, [p, y], [o, v]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [m, [p, L], [o, v]], [/(bravia[\w ]+)( bui|\))/i], [m, [p, M], [o, v]], [/(mitv-\w{5}) bui/i], [m, [p, N], [o, v]], [/Hbbtv.*(technisat) (.*);/i], [p, m, [o, v]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[p, W], [m, W], [o, v]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[o, v]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [p, m, [o, s]], [/droid.+; (shield) bui/i], [m, [p, "Nvidia"], [o, s]], [/(playstation [345portablevi]+)/i], [m, [p, M], [o, s]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [m, [p, H], [o, s]], [/((pebble))app/i], [p, m, [o, w]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [m, [p, z], [o, w]], [/droid.+; (glass) \d/i], [m, [p, F], [o, w]], [/droid.+; (wt63?0{2,3})\)/i], [m, [p, O], [o, w]], [/(quest( 2| pro)?)/i], [m, [p, P], [o, w]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [p, [o, x]], [/(aeobc)\b/i], [m, [p, y], [o, x]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [m, [o, t]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [m, [o, u]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[o, u]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[o, t]], [/(android[-\w\. ]{0,9});.+buil/i], [m, [p, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [q, [n, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [q, [n, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [n, q], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [q, n]], os: [[/microsoft (windows) (vista|xp)/i], [n, q], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [n, [q, Y, Z]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[n, "Windows"], [q, Y, Z]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[q, /_/g, "."], [n, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[n, R], [q, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [q, n], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [n, q], [/\(bb(10);/i], [q, [n, B]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [q, [n, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [q, [n, E + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [q, [n, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [q, [n, "watchOS"]], [/crkey\/([\d\.]+)/i], [q, [n, D + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[n, Q], q], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [n, q], [/(sunos) ?([\w\.\d]*)/i], [[n, "Solaris"], q], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [n, q]] }, _ = function(a2, b2) {
            if (typeof a2 === j && (b2 = a2, a2 = void 0), !(this instanceof _)) return new _(a2, b2).getResult();
            var c2 = typeof g2 !== i && g2.navigator ? g2.navigator : void 0, d2 = a2 || (c2 && c2.userAgent ? c2.userAgent : ""), e3 = c2 && c2.userAgentData ? c2.userAgentData : void 0, f3 = b2 ? S($, b2) : $, s2 = c2 && c2.userAgent == d2;
            return this.getBrowser = function() {
              var a3, b3 = {};
              return b3[n] = void 0, b3[q] = void 0, X.call(b3, d2, f3.browser), b3[l] = typeof (a3 = b3[q]) === k ? a3.replace(/[^\d\.]/g, "").split(".")[0] : void 0, s2 && c2 && c2.brave && typeof c2.brave.isBrave == h && (b3[n] = "Brave"), b3;
            }, this.getCPU = function() {
              var a3 = {};
              return a3[r] = void 0, X.call(a3, d2, f3.cpu), a3;
            }, this.getDevice = function() {
              var a3 = {};
              return a3[p] = void 0, a3[m] = void 0, a3[o] = void 0, X.call(a3, d2, f3.device), s2 && !a3[o] && e3 && e3.mobile && (a3[o] = t), s2 && "Macintosh" == a3[m] && c2 && typeof c2.standalone !== i && c2.maxTouchPoints && c2.maxTouchPoints > 2 && (a3[m] = "iPad", a3[o] = u), a3;
            }, this.getEngine = function() {
              var a3 = {};
              return a3[n] = void 0, a3[q] = void 0, X.call(a3, d2, f3.engine), a3;
            }, this.getOS = function() {
              var a3 = {};
              return a3[n] = void 0, a3[q] = void 0, X.call(a3, d2, f3.os), s2 && !a3[n] && e3 && "Unknown" != e3.platform && (a3[n] = e3.platform.replace(/chrome os/i, Q).replace(/macos/i, R)), a3;
            }, this.getResult = function() {
              return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
            }, this.getUA = function() {
              return d2;
            }, this.setUA = function(a3) {
              return d2 = typeof a3 === k && a3.length > 350 ? W(a3, 350) : a3, this;
            }, this.setUA(d2), this;
          };
          _.VERSION = "1.0.35", _.BROWSER = T([n, q, l]), _.CPU = T([r]), _.DEVICE = T([m, p, o, s, t, v, u, w, x]), _.ENGINE = _.OS = T([n, q]), typeof f2 !== i ? (e2.exports && (f2 = e2.exports = _), f2.UAParser = _) : c.amdO ? void 0 === (d = function() {
            return _;
          }.call(b, c, b, a)) || (a.exports = d) : typeof g2 !== i && (g2.UAParser = _);
          var aa = typeof g2 !== i && (g2.jQuery || g2.Zepto);
          if (aa && !aa.ua) {
            var ab = new _();
            aa.ua = ab.getResult(), aa.ua.get = function() {
              return ab.getUA();
            }, aa.ua.set = function(a2) {
              ab.setUA(a2);
              var b2 = ab.getResult();
              for (var c2 in b2) aa.ua[c2] = b2[c2];
            };
          }
        }("object" == typeof window ? window : this);
      } }, f = {};
      function g(a2) {
        var b2 = f[a2];
        if (void 0 !== b2) return b2.exports;
        var c2 = f[a2] = { exports: {} }, d2 = true;
        try {
          e[a2].call(c2.exports, c2, c2.exports, g), d2 = false;
        } finally {
          d2 && delete f[a2];
        }
        return c2.exports;
      }
      g.ab = "//", a.exports = g(226);
    } }, (a) => {
      var b = a(a.s = 833);
      (_ENTRIES = "u" < typeof _ENTRIES ? {} : _ENTRIES).middleware_middleware = b;
    }]);
  }
});

// node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
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
  "node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/static|_next\\/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*))(\\.json)?[\\/#\\?]?$"] }];
    require_edge_runtime_webpack();
    require_middleware();
  }
});

// node_modules/@opennextjs/aws/dist/utils/promise.js
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

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/resolve.js
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

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
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

// node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto2 from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";

// node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "webpack": null, "typescript": { "ignoreBuildErrors": false }, "typedRoutes": false, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.js", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": true, "compress": true, "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 14400, "formats": ["image/webp"], "maximumRedirects": 3, "maximumResponseBody": 5e7, "dangerouslyAllowLocalIP": false, "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "attachment", "localPatterns": [{ "pathname": "**", "search": "" }], "remotePatterns": [{ "protocol": "https", "hostname": "**.supabase.co" }], "qualities": [75], "unoptimized": false, "customCacheHandler": false }, "devIndicators": { "position": "bottom-left" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "excludeDefaultMomentLocales": true, "reactProductionProfiling": false, "reactStrictMode": true, "reactMaxHeadersLength": 6e3, "httpAgentOptions": { "keepAlive": true }, "logging": { "serverFunctions": true, "browserToTerminal": "warn" }, "compiler": {}, "expireTime": 31536e3, "staticPageGenerationTimeout": 60, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "outputFileTracingRoot": "/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Translation", "cacheComponents": false, "cacheLife": { "default": { "stale": 300, "revalidate": 900, "expire": 4294967294 }, "seconds": { "stale": 30, "revalidate": 1, "expire": 60 }, "minutes": { "stale": 300, "revalidate": 60, "expire": 3600 }, "hours": { "stale": 300, "revalidate": 3600, "expire": 86400 }, "days": { "stale": 300, "revalidate": 86400, "expire": 604800 }, "weeks": { "stale": 300, "revalidate": 604800, "expire": 2592e3 }, "max": { "stale": 300, "revalidate": 2592e3, "expire": 31536e3 } }, "cacheHandlers": {}, "experimental": { "appNewScrollHandler": false, "useSkewCookie": false, "cssChunking": true, "multiZoneDraftMode": false, "appNavFailHandling": false, "prerenderEarlyExit": true, "serverMinification": true, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "cachedNavigations": false, "partialFallbacks": false, "dynamicOnHover": false, "varyParams": false, "prefetchInlining": false, "preloadEntriesOnStart": true, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "proxyPrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 11, "memoryBasedWorkersCount": false, "imgOptConcurrency": null, "imgOptTimeoutInSeconds": 7, "imgOptMaxInputPixels": 268402689, "imgOptSequentialRead": null, "imgOptSkipMetadata": null, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "typedEnv": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "authInterrupts": false, "webpackMemoryOptimizations": false, "optimizeServerReact": true, "strictRouteTypes": false, "viewTransition": false, "removeUncaughtErrorAndRejectionListeners": false, "validateRSCRequestHeaders": false, "staleTimes": { "dynamic": 0, "static": 300 }, "reactDebugChannel": true, "serverComponentsHmrCache": true, "staticGenerationMaxConcurrency": 8, "staticGenerationMinPagesPerWorker": 25, "transitionIndicator": false, "gestureTransition": false, "inlineCss": false, "useCache": false, "globalNotFound": false, "browserDebugInfoInTerminal": "warn", "lockDistDir": true, "proxyClientMaxBodySize": 10485760, "hideLogsAfterAbort": false, "mcpServer": true, "turbopackFileSystemCacheForDev": true, "turbopackFileSystemCacheForBuild": false, "turbopackInferModuleSideEffects": true, "turbopackPluginRuntimeStrategy": "childProcesses", "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "effect", "@effect/schema", "@effect/platform", "@effect/platform-node", "@effect/platform-browser", "@effect/platform-bun", "@effect/sql", "@effect/sql-mssql", "@effect/sql-mysql2", "@effect/sql-pg", "@effect/sql-sqlite-node", "@effect/sql-sqlite-bun", "@effect/sql-sqlite-wasm", "@effect/sql-sqlite-react-native", "@effect/rpc", "@effect/rpc-http", "@effect/typeclass", "@effect/experimental", "@effect/opentelemetry", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "htmlLimitedBots": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight", "bundlePagesRouterDependencies": false, "configFileName": "next.config.js", "turbopack": { "root": "/Users/muhammedelnaggar/Desktop/Rafrs/Sites (translation and Experince)/Translation" }, "distDirRoot": ".next", "_originalRewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] } };
var BuildId = "bbTQNXS_h6WO3YpqLoXTu";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "priority": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_global-error", "regex": "^/_global\\-error(?:/)?$", "routeKeys": {}, "namedRegex": "^/_global\\-error(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/admin/dashboard", "regex": "^/admin/dashboard(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/dashboard(?:/)?$" }, { "page": "/admin/monitoring", "regex": "^/admin/monitoring(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/monitoring(?:/)?$" }, { "page": "/admin/notifications", "regex": "^/admin/notifications(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/notifications(?:/)?$" }, { "page": "/admin/profile", "regex": "^/admin/profile(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/profile(?:/)?$" }, { "page": "/admin/reports", "regex": "^/admin/reports(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/reports(?:/)?$" }, { "page": "/admin/settings", "regex": "^/admin/settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/settings(?:/)?$" }, { "page": "/admin/statistics", "regex": "^/admin/statistics(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/statistics(?:/)?$" }, { "page": "/admin/submissions", "regex": "^/admin/submissions(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/submissions(?:/)?$" }, { "page": "/admin/users", "regex": "^/admin/users(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/users(?:/)?$" }, { "page": "/admin/verification-requests", "regex": "^/admin/verification\\-requests(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/verification\\-requests(?:/)?$" }, { "page": "/api/auth/login", "regex": "^/api/auth/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/login(?:/)?$" }, { "page": "/api/auth/logout", "regex": "^/api/auth/logout(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/logout(?:/)?$" }, { "page": "/api/auth/me", "regex": "^/api/auth/me(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/me(?:/)?$" }, { "page": "/api/auth/register", "regex": "^/api/auth/register(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/register(?:/)?$" }, { "page": "/api/auth/reset-password-direct", "regex": "^/api/auth/reset\\-password\\-direct(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/reset\\-password\\-direct(?:/)?$" }, { "page": "/api/auth/verify-email", "regex": "^/api/auth/verify\\-email(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/verify\\-email(?:/)?$" }, { "page": "/faq", "regex": "^/faq(?:/)?$", "routeKeys": {}, "namedRegex": "^/faq(?:/)?$" }, { "page": "/forgot-password", "regex": "^/forgot\\-password(?:/)?$", "routeKeys": {}, "namedRegex": "^/forgot\\-password(?:/)?$" }, { "page": "/help", "regex": "^/help(?:/)?$", "routeKeys": {}, "namedRegex": "^/help(?:/)?$" }, { "page": "/instructions", "regex": "^/instructions(?:/)?$", "routeKeys": {}, "namedRegex": "^/instructions(?:/)?$" }, { "page": "/login", "regex": "^/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/login(?:/)?$" }, { "page": "/privacy", "regex": "^/privacy(?:/)?$", "routeKeys": {}, "namedRegex": "^/privacy(?:/)?$" }, { "page": "/register", "regex": "^/register(?:/)?$", "routeKeys": {}, "namedRegex": "^/register(?:/)?$" }, { "page": "/researcher/dashboard", "regex": "^/researcher/dashboard(?:/)?$", "routeKeys": {}, "namedRegex": "^/researcher/dashboard(?:/)?$" }, { "page": "/researcher/notifications", "regex": "^/researcher/notifications(?:/)?$", "routeKeys": {}, "namedRegex": "^/researcher/notifications(?:/)?$" }, { "page": "/researcher/profile", "regex": "^/researcher/profile(?:/)?$", "routeKeys": {}, "namedRegex": "^/researcher/profile(?:/)?$" }, { "page": "/researcher/settings", "regex": "^/researcher/settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/researcher/settings(?:/)?$" }, { "page": "/researcher/submissions", "regex": "^/researcher/submissions(?:/)?$", "routeKeys": {}, "namedRegex": "^/researcher/submissions(?:/)?$" }, { "page": "/researcher/submit", "regex": "^/researcher/submit(?:/)?$", "routeKeys": {}, "namedRegex": "^/researcher/submit(?:/)?$" }, { "page": "/reset-password", "regex": "^/reset\\-password(?:/)?$", "routeKeys": {}, "namedRegex": "^/reset\\-password(?:/)?$" }, { "page": "/terms", "regex": "^/terms(?:/)?$", "routeKeys": {}, "namedRegex": "^/terms(?:/)?$" }, { "page": "/verify-email", "regex": "^/verify\\-email(?:/)?$", "routeKeys": {}, "namedRegex": "^/verify\\-email(?:/)?$" }], "dynamic": [{ "page": "/admin/submissions/[id]", "regex": "^/admin/submissions/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/submissions/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/admin/users/[id]", "regex": "^/admin/users/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/users/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/users/[id]/verification", "regex": "^/api/admin/users/([^/]+?)/verification(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/users/(?<nxtPid>[^/]+?)/verification(?:/)?$" }, { "page": "/researcher/submissions/[id]", "regex": "^/researcher/submissions/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/researcher/submissions/(?<nxtPid>[^/]+?)(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [{ "source": "/:path*.html", "headers": [{ "key": "X-Content-Type-Options", "value": "nosniff" }], "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))?\\.html(?:/)?$" }];
var PrerenderManifest = { "version": 4, "routes": { "/_global-error": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_global-error", "dataRoute": "/_global-error.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "ae096cacf228e90707bc28729bf6a35a", "previewModeSigningKey": "0dd875593f290717a661c5e5ceac6dade3dd1ed0997fb11bafaf5855c9b61258", "previewModeEncryptionKey": "0971e75eb2bf599c800f69443f855ed00fd3173ff925cac9eef96659348b8f01" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge-runtime-webpack.js", "server/middleware.js"], "entrypoint": "server/middleware.js", "name": "middleware", "page": "/", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/static|_next\\/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*))(\\.json)?[\\/#\\?]?$", "originalSource": "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "bbTQNXS_h6WO3YpqLoXTu", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "6JayUTSXnZPslDCyKMgaPF4WxvHm6+wQhPqkw0kKPWE=", "__NEXT_PREVIEW_MODE_ID": "ae096cacf228e90707bc28729bf6a35a", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "0dd875593f290717a661c5e5ceac6dade3dd1ed0997fb11bafaf5855c9b61258", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "0971e75eb2bf599c800f69443f855ed00fd3173ff925cac9eef96659348b8f01" } } }, "functions": {}, "sortedMiddleware": ["/"] };
var AppPathRoutesManifest = { "/_not-found/page": "/_not-found", "/_global-error/page": "/_global-error", "/api/admin/users/[id]/verification/route": "/api/admin/users/[id]/verification", "/api/auth/login/route": "/api/auth/login", "/api/auth/logout/route": "/api/auth/logout", "/api/auth/me/route": "/api/auth/me", "/api/auth/register/route": "/api/auth/register", "/api/auth/reset-password-direct/route": "/api/auth/reset-password-direct", "/api/auth/verify-email/route": "/api/auth/verify-email", "/admin/dashboard/page": "/admin/dashboard", "/admin/notifications/page": "/admin/notifications", "/admin/profile/page": "/admin/profile", "/admin/reports/page": "/admin/reports", "/admin/settings/page": "/admin/settings", "/admin/statistics/page": "/admin/statistics", "/admin/submissions/[id]/page": "/admin/submissions/[id]", "/admin/submissions/page": "/admin/submissions", "/admin/users/[id]/page": "/admin/users/[id]", "/admin/users/page": "/admin/users", "/admin/verification-requests/page": "/admin/verification-requests", "/faq/page": "/faq", "/forgot-password/page": "/forgot-password", "/help/page": "/help", "/instructions/page": "/instructions", "/login/page": "/login", "/page": "/", "/privacy/page": "/privacy", "/register/page": "/register", "/researcher/dashboard/page": "/researcher/dashboard", "/researcher/notifications/page": "/researcher/notifications", "/researcher/profile/page": "/researcher/profile", "/researcher/settings/page": "/researcher/settings", "/researcher/submissions/[id]/page": "/researcher/submissions/[id]", "/researcher/submissions/page": "/researcher/submissions", "/researcher/submit/page": "/researcher/submit", "/reset-password/page": "/reset-password", "/terms/page": "/terms", "/verify-email/page": "/verify-email", "/admin/monitoring/page": "/admin/monitoring" };
var FunctionsConfigManifest = { "version": 1, "functions": {} };
var PagesManifest = { "/500": "pages/500.html" };
process.env.NEXT_BUILD_ID = BuildId;
process.env.NEXT_PREVIEW_MODE_ID = PrerenderManifest?.preview?.previewModeId;

// node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();
import { ReadableStream as ReadableStream3 } from "node:stream/web";

// node_modules/@opennextjs/aws/dist/utils/binary.js
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

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
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

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
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

// node_modules/@opennextjs/aws/dist/core/routing/queue.js
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

// node_modules/@opennextjs/aws/dist/core/routing/util.js
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
function normalizeLocationHeader(location, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location)) {
    return location;
  }
  const locationURL = new URL(location);
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

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// node_modules/@opennextjs/aws/dist/utils/cache.js
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

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
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

// node_modules/path-to-regexp/dist.es2015/index.js
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

// node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
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

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
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

// node_modules/@opennextjs/aws/dist/core/routing/middleware.js
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

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
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

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
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
