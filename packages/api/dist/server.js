/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../../node_modules/whatwg-fetch/fetch.js":
/*!************************************************!*\
  !*** ../../node_modules/whatwg-fetch/fetch.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DOMException": () => (/* binding */ DOMException),
/* harmony export */   "Headers": () => (/* binding */ Headers),
/* harmony export */   "Request": () => (/* binding */ Request),
/* harmony export */   "Response": () => (/* binding */ Response),
/* harmony export */   "fetch": () => (/* binding */ fetch)
/* harmony export */ });
var global =
  (typeof globalThis !== 'undefined' && globalThis) ||
  (typeof self !== 'undefined' && self) ||
  (typeof global !== 'undefined' && global)

var support = {
  searchParams: 'URLSearchParams' in global,
  iterable: 'Symbol' in global && 'iterator' in Symbol,
  blob:
    'FileReader' in global &&
    'Blob' in global &&
    (function() {
      try {
        new Blob()
        return true
      } catch (e) {
        return false
      }
    })(),
  formData: 'FormData' in global,
  arrayBuffer: 'ArrayBuffer' in global
}

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj)
}

if (support.arrayBuffer) {
  var viewClasses = [
    '[object Int8Array]',
    '[object Uint8Array]',
    '[object Uint8ClampedArray]',
    '[object Int16Array]',
    '[object Uint16Array]',
    '[object Int32Array]',
    '[object Uint32Array]',
    '[object Float32Array]',
    '[object Float64Array]'
  ]

  var isArrayBufferView =
    ArrayBuffer.isView ||
    function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
}

function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name)
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
    throw new TypeError('Invalid character in header field name: "' + name + '"')
  }
  return name.toLowerCase()
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return value
}

// Build a destructive iterator for the value list
function iteratorFor(items) {
  var iterator = {
    next: function() {
      var value = items.shift()
      return {done: value === undefined, value: value}
    }
  }

  if (support.iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator
    }
  }

  return iterator
}

function Headers(headers) {
  this.map = {}

  if (headers instanceof Headers) {
    headers.forEach(function(value, name) {
      this.append(name, value)
    }, this)
  } else if (Array.isArray(headers)) {
    headers.forEach(function(header) {
      this.append(header[0], header[1])
    }, this)
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function(name) {
      this.append(name, headers[name])
    }, this)
  }
}

Headers.prototype.append = function(name, value) {
  name = normalizeName(name)
  value = normalizeValue(value)
  var oldValue = this.map[name]
  this.map[name] = oldValue ? oldValue + ', ' + value : value
}

Headers.prototype['delete'] = function(name) {
  delete this.map[normalizeName(name)]
}

Headers.prototype.get = function(name) {
  name = normalizeName(name)
  return this.has(name) ? this.map[name] : null
}

Headers.prototype.has = function(name) {
  return this.map.hasOwnProperty(normalizeName(name))
}

Headers.prototype.set = function(name, value) {
  this.map[normalizeName(name)] = normalizeValue(value)
}

Headers.prototype.forEach = function(callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this)
    }
  }
}

Headers.prototype.keys = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push(name)
  })
  return iteratorFor(items)
}

Headers.prototype.values = function() {
  var items = []
  this.forEach(function(value) {
    items.push(value)
  })
  return iteratorFor(items)
}

Headers.prototype.entries = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push([name, value])
  })
  return iteratorFor(items)
}

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries
}

function consumed(body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'))
  }
  body.bodyUsed = true
}

function fileReaderReady(reader) {
  return new Promise(function(resolve, reject) {
    reader.onload = function() {
      resolve(reader.result)
    }
    reader.onerror = function() {
      reject(reader.error)
    }
  })
}

function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsArrayBuffer(blob)
  return promise
}

function readBlobAsText(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsText(blob)
  return promise
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf)
  var chars = new Array(view.length)

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i])
  }
  return chars.join('')
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0)
  } else {
    var view = new Uint8Array(buf.byteLength)
    view.set(new Uint8Array(buf))
    return view.buffer
  }
}

function Body() {
  this.bodyUsed = false

  this._initBody = function(body) {
    /*
      fetch-mock wraps the Response object in an ES6 Proxy to
      provide useful test harness features such as flush. However, on
      ES5 browsers without fetch or Proxy support pollyfills must be used;
      the proxy-pollyfill is unable to proxy an attribute unless it exists
      on the object before the Proxy is created. This change ensures
      Response.bodyUsed exists on the instance, while maintaining the
      semantic of setting Request.bodyUsed in the constructor before
      _initBody is called.
    */
    this.bodyUsed = this.bodyUsed
    this._bodyInit = body
    if (!body) {
      this._bodyText = ''
    } else if (typeof body === 'string') {
      this._bodyText = body
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body
    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString()
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer)
      // IE 10-11 can't handle a DataView body.
      this._bodyInit = new Blob([this._bodyArrayBuffer])
    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
      this._bodyArrayBuffer = bufferClone(body)
    } else {
      this._bodyText = body = Object.prototype.toString.call(body)
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8')
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type)
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
      }
    }
  }

  if (support.blob) {
    this.blob = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as blob')
      } else {
        return Promise.resolve(new Blob([this._bodyText]))
      }
    }

    this.arrayBuffer = function() {
      if (this._bodyArrayBuffer) {
        var isConsumed = consumed(this)
        if (isConsumed) {
          return isConsumed
        }
        if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
          return Promise.resolve(
            this._bodyArrayBuffer.buffer.slice(
              this._bodyArrayBuffer.byteOffset,
              this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
            )
          )
        } else {
          return Promise.resolve(this._bodyArrayBuffer)
        }
      } else {
        return this.blob().then(readBlobAsArrayBuffer)
      }
    }
  }

  this.text = function() {
    var rejected = consumed(this)
    if (rejected) {
      return rejected
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob)
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text')
    } else {
      return Promise.resolve(this._bodyText)
    }
  }

  if (support.formData) {
    this.formData = function() {
      return this.text().then(decode)
    }
  }

  this.json = function() {
    return this.text().then(JSON.parse)
  }

  return this
}

// HTTP methods whose capitalization should be normalized
var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

function normalizeMethod(method) {
  var upcased = method.toUpperCase()
  return methods.indexOf(upcased) > -1 ? upcased : method
}

function Request(input, options) {
  if (!(this instanceof Request)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
  }

  options = options || {}
  var body = options.body

  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError('Already read')
    }
    this.url = input.url
    this.credentials = input.credentials
    if (!options.headers) {
      this.headers = new Headers(input.headers)
    }
    this.method = input.method
    this.mode = input.mode
    this.signal = input.signal
    if (!body && input._bodyInit != null) {
      body = input._bodyInit
      input.bodyUsed = true
    }
  } else {
    this.url = String(input)
  }

  this.credentials = options.credentials || this.credentials || 'same-origin'
  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers)
  }
  this.method = normalizeMethod(options.method || this.method || 'GET')
  this.mode = options.mode || this.mode || null
  this.signal = options.signal || this.signal
  this.referrer = null

  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
    throw new TypeError('Body not allowed for GET or HEAD requests')
  }
  this._initBody(body)

  if (this.method === 'GET' || this.method === 'HEAD') {
    if (options.cache === 'no-store' || options.cache === 'no-cache') {
      // Search for a '_' parameter in the query string
      var reParamSearch = /([?&])_=[^&]*/
      if (reParamSearch.test(this.url)) {
        // If it already exists then set the value with the current time
        this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime())
      } else {
        // Otherwise add a new '_' parameter to the end with the current time
        var reQueryString = /\?/
        this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime()
      }
    }
  }
}

Request.prototype.clone = function() {
  return new Request(this, {body: this._bodyInit})
}

function decode(body) {
  var form = new FormData()
  body
    .trim()
    .split('&')
    .forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
  return form
}

function parseHeaders(rawHeaders) {
  var headers = new Headers()
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
  // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
  // https://github.com/github/fetch/issues/748
  // https://github.com/zloirock/core-js/issues/751
  preProcessedHeaders
    .split('\r')
    .map(function(header) {
      return header.indexOf('\n') === 0 ? header.substr(1, header.length) : header
    })
    .forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
  return headers
}

Body.call(Request.prototype)

function Response(bodyInit, options) {
  if (!(this instanceof Response)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
  }
  if (!options) {
    options = {}
  }

  this.type = 'default'
  this.status = options.status === undefined ? 200 : options.status
  this.ok = this.status >= 200 && this.status < 300
  this.statusText = options.statusText === undefined ? '' : '' + options.statusText
  this.headers = new Headers(options.headers)
  this.url = options.url || ''
  this._initBody(bodyInit)
}

Body.call(Response.prototype)

Response.prototype.clone = function() {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url
  })
}

Response.error = function() {
  var response = new Response(null, {status: 0, statusText: ''})
  response.type = 'error'
  return response
}

var redirectStatuses = [301, 302, 303, 307, 308]

Response.redirect = function(url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError('Invalid status code')
  }

  return new Response(null, {status: status, headers: {location: url}})
}

var DOMException = global.DOMException
try {
  new DOMException()
} catch (err) {
  DOMException = function(message, name) {
    this.message = message
    this.name = name
    var error = Error(message)
    this.stack = error.stack
  }
  DOMException.prototype = Object.create(Error.prototype)
  DOMException.prototype.constructor = DOMException
}

function fetch(input, init) {
  return new Promise(function(resolve, reject) {
    var request = new Request(input, init)

    if (request.signal && request.signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    var xhr = new XMLHttpRequest()

    function abortXhr() {
      xhr.abort()
    }

    xhr.onload = function() {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      }
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
      var body = 'response' in xhr ? xhr.response : xhr.responseText
      setTimeout(function() {
        resolve(new Response(body, options))
      }, 0)
    }

    xhr.onerror = function() {
      setTimeout(function() {
        reject(new TypeError('Network request failed'))
      }, 0)
    }

    xhr.ontimeout = function() {
      setTimeout(function() {
        reject(new TypeError('Network request failed'))
      }, 0)
    }

    xhr.onabort = function() {
      setTimeout(function() {
        reject(new DOMException('Aborted', 'AbortError'))
      }, 0)
    }

    function fixUrl(url) {
      try {
        return url === '' && global.location.href ? global.location.href : url
      } catch (e) {
        return url
      }
    }

    xhr.open(request.method, fixUrl(request.url), true)

    if (request.credentials === 'include') {
      xhr.withCredentials = true
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false
    }

    if ('responseType' in xhr) {
      if (support.blob) {
        xhr.responseType = 'blob'
      } else if (
        support.arrayBuffer &&
        request.headers.get('Content-Type') &&
        request.headers.get('Content-Type').indexOf('application/octet-stream') !== -1
      ) {
        xhr.responseType = 'arraybuffer'
      }
    }

    if (init && typeof init.headers === 'object' && !(init.headers instanceof Headers)) {
      Object.getOwnPropertyNames(init.headers).forEach(function(name) {
        xhr.setRequestHeader(name, normalizeValue(init.headers[name]))
      })
    } else {
      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })
    }

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr)

      xhr.onreadystatechange = function() {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr)
        }
      }
    }

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
  })
}

fetch.polyfill = true

if (!global.fetch) {
  global.fetch = fetch
  global.Headers = Headers
  global.Request = Request
  global.Response = Response
}


/***/ }),

/***/ "./src/pcgc_schema/datasets/GnomadConstraintType.js":
/*!**********************************************************!*\
  !*** ./src/pcgc_schema/datasets/GnomadConstraintType.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_0__);


const GnomadConstraintType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'GnomADConstraint',
  fields: {
    // Expected
    exp_lof: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    exp_mis: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    exp_syn: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    // Observed
    obs_lof: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    obs_mis: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    obs_syn: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    // Observed/Expected
    oe_lof: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    oe_lof_lower: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    oe_lof_upper: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    oe_mis: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    oe_mis_lower: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    oe_mis_upper: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    oe_syn: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    oe_syn_lower: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    oe_syn_upper: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    // Z
    lof_z: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    mis_z: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    syn_z: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    // Other
    gene_issues: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    pLI: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    pNull: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    pRec: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
  },
})

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GnomadConstraintType);


/***/ }),

/***/ "./src/pcgc_schema/datasets/GnomadStructuralVariantDetailsType.js":
/*!************************************************************************!*\
  !*** ./src/pcgc_schema/datasets/GnomadStructuralVariantDetailsType.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_0__);


const GnomadStructuralVariantPopulationDataType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'GnomadStructuralVariantPopulationData',
  fields: {
    id: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    ac: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
    an: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
    ac_hom: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
  },
})

const GnomadStructuralVariantConsequenceType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'GnomadStructuralVariantConsequence',
  fields: {
    consequence: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    genes: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
  },
})

const GnomadStructuralVariantCopyNumberDataType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'GnomadStructuralVariantCopyNumberData',
  fields: {
    copy_number: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
    ac: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
  },
})

const GnomadStructuralVariantDetailsType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'GnomadStructuralVariantDetails',
  fields: {
    algorithms: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    alts: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    ac: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    ac_hom: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    an: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    chrom: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    consequences: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(GnomadStructuralVariantConsequenceType) },
    copy_numbers: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(GnomadStructuralVariantCopyNumberDataType) },
    cpx_intervals: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    cpx_type: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    end_chrom: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    end_pos: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
    evidence: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    filters: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    genes: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    length: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    populations: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(GnomadStructuralVariantPopulationDataType) },
    pos: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
    qual: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    type: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    variant_id: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
  },
})

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GnomadStructuralVariantDetailsType);


/***/ }),

/***/ "./src/pcgc_schema/datasets/MitoVariantDetailsType.js":
/*!************************************************************!*\
  !*** ./src/pcgc_schema/datasets/MitoVariantDetailsType.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _types_mito_variant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types/mito_variant */ "./src/pcgc_schema/types/mito_variant.js");
/* harmony import */ var _transcriptConsequence__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transcriptConsequence */ "./src/pcgc_schema/datasets/transcriptConsequence.js");
/* harmony import */ var _haplogroups__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./haplogroups */ "./src/pcgc_schema/datasets/haplogroups.js");


//import { UserVisibleError } from '../../errors'

//import { resolveReads, ReadDataType } from '../shared/reads'



//import { MultiNucleotideVariantSummaryType } from './gnomadMultiNucleotideVariants'


/*
const PopulationType = new GraphQLObjectType({
  name: 'VariantPopulation',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    ac: { type: new GraphQLNonNull(GraphQLInt) },
    an: { type: new GraphQLNonNull(GraphQLInt) },
    ac_hemi: { type: new GraphQLNonNull(GraphQLInt) },
    ac_hom: { type: new GraphQLNonNull(GraphQLInt) },
    //subpopulations: { type: new GraphQLList(GnomadSubpopulationType) },
  },
})
*/

const MitoVariantDetailsType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'MitoVariantDetails',
  interfaces: [_types_mito_variant__WEBPACK_IMPORTED_MODULE_1__.MitoVariantInterface],
  fields: {
    // variant interface fields
    alt: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    chrom: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    pos: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
    ref: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    variantId: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    xpos: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat) },

    //colocatedVariants: { type: new GraphQLList(GraphQLString) },
        
    //flags: { type: new GraphQLList(GraphQLString) },
    spark_genome: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
        name: 'MitoVariantDetailsGenomeData',
        fields: {
          ac: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
          an: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
          ac_het: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
          ac_hom: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
          max_heteroplasmy: {type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat }          
        },
      }),
    },

    ssc_genome: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
        name: 'MitoVariantDetailsGenomeDataX',
        fields: {
          ac: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
          an: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
          ac_het: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
          ac_hom: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
          max_heteroplasmy: {type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat }          
        },
      }),
    },
    
    sortedTranscriptConsequences: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(_transcriptConsequence__WEBPACK_IMPORTED_MODULE_2__.TranscriptConsequenceType) },
    haplogroups: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(_haplogroups__WEBPACK_IMPORTED_MODULE_3__.HaplogroupType)},
    populations: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(_haplogroups__WEBPACK_IMPORTED_MODULE_3__.PopulationType)},

  },
  isTypeOf: variantData => variantData.gqlType === 'MitoVariantDetails',
})

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MitoVariantDetailsType);


/***/ }),

/***/ "./src/pcgc_schema/datasets/VariantDetailsType.js":
/*!********************************************************!*\
  !*** ./src/pcgc_schema/datasets/VariantDetailsType.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _types_variant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types/variant */ "./src/pcgc_schema/types/variant.js");
/* harmony import */ var _transcriptConsequence__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transcriptConsequence */ "./src/pcgc_schema/datasets/transcriptConsequence.js");


//import { UserVisibleError } from '../../errors'

//import { resolveReads, ReadDataType } from '../shared/reads'

//import { MultiNucleotideVariantSummaryType } from './gnomadMultiNucleotideVariants'


const HistogramType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'Histogram',
  fields: {
    bin_edges: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat) },
    bin_freq: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat) },
    n_larger: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    n_smaller: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
  },
})

/*
const GnomadSubpopulationType = new GraphQLObjectType({
  name: 'GnomadVariantSubpopulation',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    ac: { type: new GraphQLNonNull(GraphQLInt) },
    an: { type: new GraphQLNonNull(GraphQLInt) },
    ac_hom: { type: new GraphQLNonNull(GraphQLInt) },
  },
})
*/

const PopulationType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'VariantPopulation',
  fields: {
    id: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    ac: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
    an: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
    ac_hemi: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
    ac_hom: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
    //subpopulations: { type: new GraphQLList(GnomadSubpopulationType) },
  },
})

/*
const VariantGenotypeQuality = new GraphQLObjectType({
  name: 'VariantGenotypeQuality',
  fields: {
    bin_edges: { type: new GraphQLList(GraphQLFloat)},
    bin_freq: { type: new GraphQLList(GraphQLFloat)},
    n_larger: { type: GraphQLInt},
    n_smaller: { type: GraphQLInt}
  }
})
*/

const InSilicoPredictorsType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'InSilicoPredictors',
  fields: {
    cadd: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat},
    splice_ai: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat},
    revel: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString},
    primate_ai: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat},
  }
})

const MayoVariantType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'MayoVariant',
  fields: {
    variant_id: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt},
    MayoVariantID: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt},    
    VariantTypeName: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString},
    ClinicalSignificanceShortName: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString},
  }
})


const GnomadVariantQualityMetricsType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'GnomadVariantQualityMetrics',
  fields: {
    
    alleleBalance: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
        name: 'GnomadVariantAlleleBalance',
        fields: {
          alt: { type: HistogramType },
        },
      }),
    },
    genotypeDepth: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
        name: 'GnomadVariantGenotypeDepth',
        fields: {
          all: { type: HistogramType },
          alt: { type: HistogramType },
        },
      }),
    },    
    genotypeQuality: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
        name: 'GnomadVariantGenotypeQuality',
        fields: {
          all: { type: HistogramType },
          alt: { type: HistogramType },
        },
      }),
    },
    /*
    siteQualityMetrics: {
      type: new GraphQLObjectType({
        name: 'GnomadVariantSiteQualityMetrics',
        fields: {
          BaseQRankSum: { type: GraphQLFloat },
          ClippingRankSum: { type: GraphQLFloat },
          DP: { type: GraphQLInt },
          FS: { type: GraphQLFloat },
          InbreedingCoeff: { type: GraphQLFloat },
          MQ: { type: GraphQLFloat },
          MQRankSum: { type: GraphQLFloat },
          pab_max: { type: GraphQLFloat },
          QD: { type: GraphQLFloat },
          ReadPosRankSum: { type: GraphQLFloat },
          RF: { type: GraphQLFloat },
          SiteQuality: { type: GraphQLFloat },
          SOR: { type: GraphQLFloat },
          VQSLOD: { type: GraphQLFloat },
        },
      }),
    },*/
  },
})

/*
const GnomadVariantFilteringAlleleFrequencyType = new GraphQLObjectType({
  name: 'GnomadVariantFilteringAlleleFrequency',
  fields: {
    popmax: { type: GraphQLFloat },
    popmax_population: { type: GraphQLString },
  },
})

*/

//const GnomadVariantDetailsType = new GraphQLObjectType({
//  name: 'GnomadVariantDetails',

const VariantDetailsType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'VariantDetails',
  interfaces: [_types_variant__WEBPACK_IMPORTED_MODULE_1__.VariantInterface],
  fields: {
    // variant interface fields
    alt: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    chrom: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    pos: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
    ref: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    variantId: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    xpos: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat) },

    /*
    // gnomAD specific fields
    age_distribution: {
      type: new GraphQLObjectType({
        name: 'GnomadVariantDetailsAgeDistribution',
        fields: {
          het: { type: HistogramType },
          hom: { type: HistogramType },
        },
      }),
    },
    
    multiNucleotideVariants: { type: new GraphQLList(MultiNucleotideVariantSummaryType) },
    */

    colocatedVariants: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    gnomadPopFreq: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(PopulationType) },
    gnomadAF: {type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat},
    
    bpkd_exome: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
        name: 'VariantDetailsExomeData',
        fields: {
          ac: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
          an: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
          //ac_hemi: { type: GraphQLInt },
          ac_hom: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },


          ac_male: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
          an_male: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
          ac_male_hom: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },

          ac_female: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
          an_female: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
          ac_female_hom: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
                
          //faf95: { type: GnomadVariantFilteringAlleleFrequencyType },
          //faf99: { type: GnomadVariantFilteringAlleleFrequencyType },
          //filters: { type: new GraphQLList(GraphQLString) },
          populations: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(PopulationType) },
          /*
          qualityMetrics: {
            genotype_quality: { type: VariantGenotypeQuality}
          }
         */ 
          
          qualityMetrics: { type: GnomadVariantQualityMetricsType },
          /*
          reads: {
            type: new GraphQLList(ReadDataType),
            resolve: async obj => {
              if (!process.env.READS_DIR) {
                return null
              }
              try {
                return await resolveReads(
                  process.env.READS_DIR,
                  'gnomad_r2_1/combined_bams_exomes',
                  obj
                )
              } catch (err) {
                throw new UserVisibleError('Unable to load reads data')
              }
            },
          },*/
        },
      }),
    },


    /*
    spark_exome: {
      type: new GraphQLObjectType({
        name: 'VariantDetailsExomeData',
        fields: {
          ac: { type: GraphQLInt },
          an: { type: GraphQLInt },
          //ac_hemi: { type: GraphQLInt },
          ac_hom: { type: GraphQLInt },


          ac_male: { type: GraphQLInt },
          an_male: { type: GraphQLInt },
          ac_male_hom: { type: GraphQLInt },

          ac_female: { type: GraphQLInt },
          an_female: { type: GraphQLInt },
          ac_female_hom: { type: GraphQLInt },
                
          //faf95: { type: GnomadVariantFilteringAlleleFrequencyType },
          //faf99: { type: GnomadVariantFilteringAlleleFrequencyType },
          //filters: { type: new GraphQLList(GraphQLString) },
          populations: { type: new GraphQLList(PopulationType) },
          
          qualityMetrics: {
            genotype_quality: { type: VariantGenotypeQuality}
          }
          
          
          qualityMetrics: { type: GnomadVariantQualityMetricsType },
          
          reads: {
            type: new GraphQLList(ReadDataType),
            resolve: async obj => {
              if (!process.env.READS_DIR) {
                return null
              }
              try {
                return await resolveReads(
                  process.env.READS_DIR,
                  'gnomad_r2_1/combined_bams_exomes',
                  obj
                )
              } catch (err) {
                throw new UserVisibleError('Unable to load reads data')
              }
            },
          },
        },
      }),
    },
    
    
    //flags: { type: new GraphQLList(GraphQLString) },
    spark_genome: {
      type: new GraphQLObjectType({
        name: 'GnomadVariantDetailsGenomeData',
        fields: {
          ac: { type: GraphQLInt },
          an: { type: GraphQLInt },
          // ac_hemi: { type: GraphQLInt },
          ac_hom: { type: GraphQLInt },
          // faf95: { type: GnomadVariantFilteringAlleleFrequencyType },
          // faf99: { type: GnomadVariantFilteringAlleleFrequencyType },
          // filters: { type: new GraphQLList(GraphQLString) },


          ac_male: { type: GraphQLInt },
          an_male: { type: GraphQLInt },
          ac_male_hom: { type: GraphQLInt },

          ac_female: { type: GraphQLInt },
          an_female: { type: GraphQLInt },
          ac_female_hom: { type: GraphQLInt },

          populations: { type: new GraphQLList(PopulationType) },
          
          
          qualityMetrics: { type: GnomadVariantQualityMetricsType },
          reads: {
            type: new GraphQLList(ReadDataType),
            resolve: async obj => {
              if (!process.env.READS_DIR) {
                return null
              }
              try {
                return await resolveReads(
                  process.env.READS_DIR,
                  'gnomad_r2_1/combined_bams_genomes',
                  obj
                )
              } catch (err) {
                throw new UserVisibleError('Unable to load reads data')
              }
            },
          },
        },
      }),
    },

    
    ssc_genome: {
      type: new GraphQLObjectType({
        name: 'GnomadVariantDetailsGenomeDataX',
        fields: {
          ac: { type: GraphQLInt },
          an: { type: GraphQLInt },
          ac_hom: { type: GraphQLInt },
          ac_male: { type: GraphQLInt },
          an_male: { type: GraphQLInt },
          ac_male_hom: { type: GraphQLInt },

          ac_female: { type: GraphQLInt },
          an_female: { type: GraphQLInt },
          ac_female_hom: { type: GraphQLInt },

          populations: { type: new GraphQLList(PopulationType) },
          
        },
      }),
    },
    */
    
    mayo_variant_details: {type: MayoVariantType},
    gnomad_faf95_popmax: {type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat},
    gnomad_faf95_population: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    rsid: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    clinvarAlleleID: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    //denovoHC: { type: GraphQLString },
    sortedTranscriptConsequences: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(_transcriptConsequence__WEBPACK_IMPORTED_MODULE_2__.TranscriptConsequenceType) },
    in_silico_predictors: { type: InSilicoPredictorsType}
  },
  isTypeOf: variantData => variantData.gqlType === 'VariantDetails',
})

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VariantDetailsType);


/***/ }),

/***/ "./src/pcgc_schema/datasets/clinvar.js":
/*!*********************************************!*\
  !*** ./src/pcgc_schema/datasets/clinvar.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ClinvarVariantType": () => (/* binding */ ClinvarVariantType),
/* harmony export */   "fetchClinvarVariantsInGene": () => (/* binding */ fetchClinvarVariantsInGene),
/* harmony export */   "fetchClinvarVariantsInTranscript": () => (/* binding */ fetchClinvarVariantsInTranscript)
/* harmony export */ });
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities_region__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utilities/region */ "./src/utilities/region.js");
/* harmony import */ var _types_exon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../types/exon */ "./src/pcgc_schema/types/exon.js");
/* harmony import */ var _types_variant__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../types/variant */ "./src/pcgc_schema/types/variant.js");
/* harmony import */ var _utilities_elasticsearch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utilities/elasticsearch */ "./src/utilities/elasticsearch.js");








const ClinvarVariantType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'ClinvarVariant',
  interfaces: [_types_variant__WEBPACK_IMPORTED_MODULE_3__.VariantInterface],
  fields: {
    // common variant fields
    alt: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    chrom: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    pos: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
    ref: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    variantId: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    xpos: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat) },
    // ClinVar specific fields
    alleleId: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    clinicalSignificance: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    goldStars: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    majorConsequence: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
  },
  isTypeOf: variantData => variantData.dataset === 'clinvar',
})


const rangeQueriesForRegions = (regions, padding = 75) => {
  const paddedRegions = regions.map(region => ({
    xstart: region.xstart - padding,
    xstop: region.xstop + padding,
  }))

  const queryRegions = (0,_utilities_region__WEBPACK_IMPORTED_MODULE_1__.mergeOverlappingRegions)(
    paddedRegions.sort((r1, r2) => r1.xstart - r2.xstart)
  )

  return queryRegions.map(
    ({ xstart, xstop }) => ({ range: { xpos: { gte: xstart, lte: xstop } } })
  )
}


const fetchClinvarVariantsInGene = async (geneId, ctx) => {
  const geneExons = await (0,_types_exon__WEBPACK_IMPORTED_MODULE_2__.lookupExonsByGeneId)(ctx.database.gnomad, geneId)
  const filteredExons = geneExons.filter(exon => exon.feature_type === 'CDS')
  const rangeQueries = rangeQueriesForRegions(filteredExons)

  const results = await (0,_utilities_elasticsearch__WEBPACK_IMPORTED_MODULE_4__.fetchAllSearchResults)(
    ctx.database.elastic,
    {
      index: 'clinvar_grch38',
      //type: 'variant',
      body: {
        query: {
          bool: {
            filter: [
              { term: { gene_ids: geneId } },
              { bool: { should: rangeQueries } },
            ],
          },
        }
      },
      size: 10000,
      sort: 'xpos:asc',
      _source: [
        'allele_id',
        'alt',
        'chrom',
        'clinical_significance',
        'gene_id_to_consequence_json',
        'gold_stars',
        'pos',
        'ref',
        'variant_id',
        'xpos',
      ],
    }
  )

  //console.log(results)

  return results.map((hit) => {
    const doc = hit._source
    const majorConsequence = JSON.parse(doc.gene_id_to_consequence_json)[geneId]

    return {
      // common variant fields
      alt: doc.alt,
      chrom: doc.chrom,
      pos: doc.pos,
      ref: doc.ref,
      variantId: doc.variant_id,
      xpos: doc.xpos,
      dataset: 'clinvar',
      // ClinVar specific fields
      alleleId: doc.allele_id,
      clinicalSignificance: doc.clinical_significance,
      goldStars: doc.gold_stars,
      majorConsequence,
    }
  })
}


const fetchClinvarVariantsInTranscript = async (transcriptId, ctx) => {
  const transcriptExons = await (0,_types_exon__WEBPACK_IMPORTED_MODULE_2__.lookupExonsByTranscriptId)(ctx.database.gnomad, transcriptId)
  const filteredExons = transcriptExons.filter(exon => exon.feature_type === 'CDS')
  const rangeQueries = rangeQueriesForRegions(filteredExons)

  const results = await (0,_utilities_elasticsearch__WEBPACK_IMPORTED_MODULE_4__.fetchAllSearchResults)(
    ctx.database.elastic,
    {
      index: 'clinvar_grch38',
      type: 'variant',
      body: {
        query: {
          bool: {
            filter: [
              { term: { transcript_ids: transcriptId } },
              { bool: { should: rangeQueries } },
            ],
          },
        }
      },
      size: 10000,
      sort: 'xpos:asc',
      _source: [
        'allele_id',
        'alt',
        'chrom',
        'clinical_significance',
        'gold_stars',
        'pos',
        'ref',
        'transcript_id_to_consequence_json',
        'variant_id',
        'xpos',
      ],
    }
  )

  return results.map((hit) => {
    const doc = hit._source
    const majorConsequence = JSON.parse(doc.transcript_id_to_consequence_json)[transcriptId]

    return {
      // common variant fields
      alt: doc.alt,
      chrom: doc.chrom,
      pos: doc.pos,
      ref: doc.ref,
      variantId: doc.variant_id,
      xpos: doc.xpos,
      dataset: 'clinvar',
      // ClinVar specific fields
      alleleId: doc.allele_id,
      clinicalSignificance: doc.clinical_significance,
      goldStars: doc.gold_stars,
      majorConsequence,
    }
  })
}


/***/ }),

/***/ "./src/pcgc_schema/datasets/countVariantsInRegion.js":
/*!***********************************************************!*\
  !*** ./src/pcgc_schema/datasets/countVariantsInRegion.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// The cardinality aggregation returns only an approximate count.
// It is accurate enough for the purposes of determining whether or not to
// return individual variants for a region.
// https://www.elastic.co/guide/en/elasticsearch/guide/current/cardinality.html
const countVariantsInRegion = async (ctx, { chrom, start, stop }, subset) => {
  const response = await ctx.database.elastic.search({
    index: 'pcgc_exomes,spark_genomes',
    type: 'variant',
    body: {
      query: {
        bool: {
          filter: [
            { term: { chrom } },
            {
              range: {
                pos: {
                  gte: start,
                  lte: stop,
                },
              },
            },
            // FIXME: This should query based on the requested subset's AC
            // However, there is no non_cancer field for genomes and we need to query
            // across both indices for the cardinality aggregation to work.
            // Using this workaround since since this function is used only to get an
            // approximate count of variants to determine whether or not to show variants
            // on the region page.
            // A possible solution is adding a non_cancer field to the genomes index as
            // an alias to the gnomad field.
            // https://www.elastic.co/guide/en/elasticsearch/reference/current/alias.html
            //{ range: { [`gnomad.AC_raw`]: { gt: 0 } } },
          ],
        },
      },
      aggs: {
        unique_variants: {
          cardinality: {
            field: 'variant_id',
          },
        },
      },
    },
    size: 0,
  })

  return response.aggregations.unique_variants.value
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (countVariantsInRegion);


/***/ }),

/***/ "./src/pcgc_schema/datasets/fetchGnomadConstraintByTranscript.js":
/*!***********************************************************************!*\
  !*** ./src/pcgc_schema/datasets/fetchGnomadConstraintByTranscript.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const fetchGnomadConstraintByTranscript = async (ctx, transcriptId) => {
  const response = await ctx.database.elastic.search({
    index: 'gnomad_constraint_2_1_1',
    //type: 'constraint',
    body: {
      query: {
        bool: {
          filter: {
            term: { transcript_id: transcriptId },
          },
        },
      },
    },
    size: 1,
  })

  const doc = response.hits.hits[0]

  // eslint-disable-next-line no-underscore-dangle
  return doc ? doc._source : null
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fetchGnomadConstraintByTranscript);


/***/ }),

/***/ "./src/pcgc_schema/datasets/fetchGnomadStructuralVariantDetails.js":
/*!*************************************************************************!*\
  !*** ./src/pcgc_schema/datasets/fetchGnomadStructuralVariantDetails.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../errors */ "./src/pcgc_schema/errors.js");


const fetchGnomadStructuralVariantDetails = async (ctx, variantId) => {
  const response = await ctx.database.elastic.search({
    index: 'gnomad_structural_variants',
    type: 'variant',
    body: {
      query: {
        bool: {
          filter: {
            term: { variant_id: variantId },
          },
        },
      },
    },
  })

  if (response.hits.hits.length === 0) {
    throw new _errors__WEBPACK_IMPORTED_MODULE_0__.UserVisibleError('Variant not found')
  }

  const variant = response.hits.hits[0]._source // eslint-disable-line no-underscore-dangle

  return {
    algorithms: variant.algorithms,
    alts: variant.alts,
    ac: variant.ac.total,
    ac_hom: variant.type === 'MCNV' ? null : variant.n_homalt.total,
    an: variant.an.total,
    chrom: variant.chrom,
    consequences: Object.keys(variant.consequences).map(csq => ({
      consequence: csq,
      genes: variant.consequences[csq],
    })),
    copy_numbers:
      variant.type === 'MCNV'
        ? variant.alts.map((alt, i) => ({
            copy_number: parseInt(alt.slice(4, alt.length - 1), 10),
            ac: variant.mcnv_ac.total[i],
          }))
        : null,
    cpx_intervals: variant.cpx_intervals,
    cpx_type: variant.cpx_type,
    end_chrom: variant.end_chrom,
    end_pos: variant.end_pos,
    evidence: variant.evidence,
    filters: variant.filters,
    genes: variant.genes || [],
    length: variant.length,
    populations: ['afr', 'amr', 'eas', 'eur', 'oth'].map(popId => ({
      id: popId.toUpperCase(),
      ac: variant.ac[popId] || 0,
      an: variant.an[popId] || 0,
      ac_hom: variant.type === 'MCNV' ? null : variant.n_homalt[popId],
    })),
    pos: variant.pos,
    qual: variant.qual,
    type: variant.type,
    variant_id: variant.variant_id,
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fetchGnomadStructuralVariantDetails);


/***/ }),

/***/ "./src/pcgc_schema/datasets/fetchGnomadStructuralVariantsByGene.js":
/*!*************************************************************************!*\
  !*** ./src/pcgc_schema/datasets/fetchGnomadStructuralVariantsByGene.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utilities_elasticsearch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utilities/elasticsearch */ "./src/utilities/elasticsearch.js");
/* harmony import */ var _rankedSVGeneConsequences__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rankedSVGeneConsequences */ "./src/pcgc_schema/datasets/rankedSVGeneConsequences.js");



const fetchGnomadStructuralVariantsByGene = async (ctx, { gene_name: geneName }) => {
  const hits = await (0,_utilities_elasticsearch__WEBPACK_IMPORTED_MODULE_0__.fetchAllSearchResults)(ctx.database.elastic, {
    index: 'gnomad_structural_variants',
    type: 'variant',
    size: 10000,
    _source: [
      'ac.total',
      'af.total',
      'an.total',
      'chrom',
      'consequences',
      'end_chrom',
      'end_pos',
      'filters',
      'intergenic',
      'length',
      'n_homalt.total',
      'pos',
      'type',
      'variant_id',
    ],
    body: {
      query: {
        bool: {
          filter: {
            term: { genes: geneName },
          },
        },
      },
      sort: [{ pos: { order: 'asc' } }],
    },
  })

  return hits.map(hit => {
    const variant = hit._source // eslint-disable-line no-underscore-dangle

    let majorConsequence = _rankedSVGeneConsequences__WEBPACK_IMPORTED_MODULE_1__["default"].find(
      csq => variant.consequences[csq] && variant.consequences[csq].includes(geneName)
    )
    if (!majorConsequence && variant.intergenic) {
      majorConsequence = 'intergenic'
    }

    return {
      ac: variant.ac.total,
      ac_hom: variant.type === 'MCNV' ? null : variant.n_homalt.total,
      an: variant.an.total,
      af: variant.af.total,
      chrom: variant.chrom,
      end_chrom: variant.end_chrom,
      end_pos: variant.end_pos,
      consequence: majorConsequence,
      filters: variant.filters,
      length: variant.length,
      pos: variant.pos,
      type: variant.type,
      variant_id: variant.variant_id,
    }
  })
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fetchGnomadStructuralVariantsByGene);


/***/ }),

/***/ "./src/pcgc_schema/datasets/fetchGnomadStructuralVariantsByRegion.js":
/*!***************************************************************************!*\
  !*** ./src/pcgc_schema/datasets/fetchGnomadStructuralVariantsByRegion.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utilities_elasticsearch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utilities/elasticsearch */ "./src/utilities/elasticsearch.js");
/* harmony import */ var _rankedSVGeneConsequences__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rankedSVGeneConsequences */ "./src/pcgc_schema/datasets/rankedSVGeneConsequences.js");



const fetchGnomadStructuralVariantsByRegion = async (
  ctx,
  { chrom, start, stop, xstart, xstop }
) => {
  const hits = await (0,_utilities_elasticsearch__WEBPACK_IMPORTED_MODULE_0__.fetchAllSearchResults)(ctx.database.elastic, {
    index: 'gnomad_structural_variants',
    type: 'variant',
    size: 10000,
    _source: [
      'ac.total',
      'af.total',
      'an.total',
      'chrom',
      'consequences',
      'end_chrom',
      'end_pos',
      'filters',
      'intergenic',
      'length',
      'n_homalt.total',
      'pos',
      'type',
      'variant_id',
    ],
    body: {
      query: {
        bool: {
          filter: [
            
            {
              range: {
                xpos: {
                  lte: xstop,
                },
              },
            },
            
            {
              range: {
                end_xpos: {
                  gte: xstart,
                },
              },
            },

            /*
            {
              range: {
                end_xpos: {
                  gte: xstart,
                },
              },
            },
          */
          ],
        },
      },
      sort: [{ pos: { order: 'asc' } }],
    },
  })

  console.log(xstart)
  console.log(xstop)
  console.log(hits)

  const variants = hits.map(hit => {
    const variant = hit._source // eslint-disable-line no-underscore-dangle

    //if(variant.pos >= start){
    //  console.log(variant.pos)
    //}

    let majorConsequence = _rankedSVGeneConsequences__WEBPACK_IMPORTED_MODULE_1__["default"].find(csq => variant.consequences[csq])
    if (!majorConsequence && variant.intergenic) {
      majorConsequence = 'intergenic'
    }

    return {
      ac: variant.ac.total,
      ac_hom: variant.type === 'MCNV' ? null : variant.n_homalt.total,
      an: variant.an.total,
      af: variant.af.total,
      chrom: variant.chrom,
      end_chrom: variant.end_chrom,
      end_pos: variant.end_pos,
      consequence: majorConsequence,
      filters: variant.filters,
      length: variant.length,
      pos: variant.pos,
      type: variant.type,
      variant_id: variant.variant_id,
    }
  })

  return variants.filter(variant => {
    // Only include insertions if the start point falls within the requested region.
    
    //return variant.chrom === chrom && variant.pos >= start && variant.pos <= stop
    return variant.chrom === chrom 


    /*
    if (variant.type === 'INS') {
      return variant.chrom === chrom && variant.pos >= start && variant.pos <= stop
    }

    
    // Only include interchromosomal variants (CTX, BNDs, a few INS and CPX) if one of the endpoints
    // falls within the requested region.
    if (variant.type === 'BND' || variant.type === 'CTX' || variant.chrom !== variant.end_chrom) {
      return (
        (variant.chrom === chrom && variant.pos >= start && variant.pos <= stop) ||
        (variant.end_chrom === chrom && variant.end_pos >= start && variant.end_pos <= stop)
      )
    }*/
    

    return true
  })
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fetchGnomadStructuralVariantsByRegion);


/***/ }),

/***/ "./src/pcgc_schema/datasets/fetchMitoVariantDetails.js":
/*!*************************************************************!*\
  !*** ./src/pcgc_schema/datasets/fetchMitoVariantDetails.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var whatwg_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! whatwg-fetch */ "../../node_modules/whatwg-fetch/fetch.js");
//import { UserVisibleError } from '../../errors'
//import { fetchGnomadMNVSummariesByVariantId } from './gnomadMultiNucleotideVariants'
//import { request } from "graphql-request"


//import fetch from 'node-fetch'


/*
const formatHistogram = histogramData => ({
  bin_edges: histogramData.bin_edges.split('|').map(s => Number(s)),
  bin_freq: histogramData.bin_freq.split('|').map(s => Number(s)),
  n_larger: histogramData.n_larger,
  n_smaller: histogramData.n_smaller,
})

*/

//const POPULATIONS = ['afr', 'amr', 'asj', 'eas', 'fin', 'nfe', 'oth', 'sas']
const POPULATIONS = ['afr', 'amr', 'eas', 'eur', 'oth', 'sas']

/*
const SUBPOPULATIONS = {
  afr: ['female', 'male'],
  amr: ['female', 'male'],
  asj: ['female', 'male'],
  eas: ['female', 'male', 'jpn', 'kor', 'oea'],
  fin: ['female', 'male'],
  nfe: ['female', 'male', 'bgr', 'est', 'nwe', 'onf', 'seu', 'swe'],
  oth: ['female', 'male'],
  sas: ['female', 'male'],
}
*/

const formatPopulations = variantData =>
  POPULATIONS.map(popId => ({
    id: popId.toUpperCase(),
    ac: variantData.AC_adj[popId] || 0,
    an: variantData.AN_adj[popId] || 0,
    ac_hom: variantData.nhomalt_adj[popId] || 0,

    //ac: (variantData.AC_adj[popId] || {}).total || 0,
    //an: (variantData.AN_adj[popId] || {}).total || 0,
    //ac_hemi: variantData.nonpar ? (variantData.AC_adj[popId] || {}).male || 0 : 0,
    //ac_hom: (variantData.nhomalt_adj[popId] || {}).total || 0,

    /*
    subpopulations: SUBPOPULATIONS[popId].map(subPopId => ({
      id: subPopId.toUpperCase(),
      ac: (variantData.AC_adj[popId] || {})[subPopId] || 0,
      an: (variantData.AN_adj[popId] || {})[subPopId] || 0,
      ac_hom: (variantData.nhomalt_adj[popId] || {})[subPopId] || 0,
    })),*/

  }))

/*
const formatFilteringAlleleFrequency = (variantData, fafField) => {
  const fafData = variantData[fafField]
  const { total, ...populationFAFs } = variantData[fafField]

  let popmaxFAF = -Infinity
  let popmaxPopulation = null

  Object.keys(populationFAFs)
    // gnomAD 2.1.0 calculated FAF for singleton variants.
    // This filters out those invalid FAFs.
    .filter(popId => variantData.AC_adj[popId].total > 1)
    .forEach(popId => {
      if (populationFAFs[popId] > popmaxFAF) {
        popmaxFAF = fafData[popId]
        popmaxPopulation = popId.toUpperCase()
      }
    })

  if (popmaxFAF === -Infinity) {
    popmaxFAF = null
  }

  return {
    popmax: popmaxFAF,
    popmax_population: popmaxPopulation,
  }
}
*/

const fetchVariantData = async (ctx, variantId) => {

 

   const genomeData = await ctx.database.elastic.search({
    index: 'spark_mito',
    //type: 'variant',
    _source: [
      'alt',
      'chrom',
      'filters',
      'pos',
      'ref',
      'sortedTranscriptConsequences',
      'haplogroups',
      'populations',
      'variant_id',
      'xpos',
      'ac',
      'af',
      'an',
      'ac_het',
      'ac_hom',
      'max_heteroplasmy'
    ],
    body: {
      query: {
        bool: {
          filter: [
            { term: { variant_id: variantId } },
            //{ range: { [`${requestSubset}.AC_raw`]: { gt: 0 } } },
          ],
        },
      },
    },
    size: 1,
  })

   /*
  return { exomeData: exomeData.hits.hits[0] ? exomeData.hits.hits[0]._source : undefined , 
           genomeData: genomeData.hits.hits[0] ? genomeData.hits.hits[0]._source : undefined,
           sscGenomeData: sscGenomeData.hits.hits[0] ? sscGenomeData.hits.hits[0]._source : undefined }
  */

  return { genomeData: genomeData.hits.hits[0] ? genomeData.hits.hits[0]._source : undefined }


}


const fetchColocatedVariants = async (ctx, variantId) => {
  const parts = variantId.split('-')
  const chrom = parts[0]
  const pos = Number(parts[1])

  /*
  const requests = [
    { index: 'gnomad_exomes_2_1_1', subset },
    // All genome samples are non_cancer, so separate non-cancer numbers are not stored
    { index: 'gnomad_genomes_2_1_1', subset: subset === 'non_cancer' ? 'gnomad' : subset },
  ]

  const [exomeResponse, genomeResponse] = await Promise.all(
    requests.map(({ index, subset: requestSubset }) =>
      ctx.database.elastic.search({
        index,
        type: 'variant',
        _source: ['variant_id'],
        body: {
          query: {
            bool: {
              filter: [
                { term: { chrom } },
                { term: { pos } },
                { range: { [`${requestSubset}.AC_raw`]: { gt: 0 } } },
              ],
            },
          },
        },
      })
    )
  )
  */

  const exomeResponse = await ctx.database.elastic.search({
  //await ctx.database.elastic.search({
    index: 'pcgc_exomes',
    type: 'variant',
    _source: ['variant_id'],
    body: {
      query: {
        bool: {
          filter: [
            { term: { chrom } },
            { term: { pos } },
            { range: { ['AC_raw']: { gt: 0 } } },
          ],
        },
      },
    },
  })

  const genomeResponse = await ctx.database.elastic.search({
  //await ctx.database.elastic.search({
    index: 'spark_genomes',
    type: 'variant',
    _source: ['variant_id'],
    body: {
      query: {
        bool: {
          filter: [
            { term: { chrom } },
            { term: { pos } },
          ],
        },
      },
    },
  })


  //console.log(exomeResponse)
  //console.log(genomeResponse)



  

  // eslint-disable no-underscore-dangle
  const exomeVariants = exomeResponse.hits.hits.map(doc => doc._source.variant_id)
  const genomeVariants = genomeResponse.hits.hits.map(doc => doc._source.variant_id)
  // eslint-enable no-underscore-dangle 

  //console.log(exomeVariants)
  //console.log(genomeVariants)

  const combinedVariants = exomeVariants.concat(genomeVariants)

  //return combinedVariants

  
  return combinedVariants
    .filter(otherVariantId => otherVariantId !== variantId)
    .sort()
    .filter(
      (otherVariantId, index, allOtherVariantIds) =>
        otherVariantId !== allOtherVariantIds[index + 1]
    )

  


}



const fetchRSID = async (ctx, variantId) => {

  const query = `{
    variant(variantId: "${variantId}", dataset: gnomad_r3){
      rsid
      variantId    
    }
  }
  ` 

  try{
    //const gnomad_data = await request("https://gnomad.broadinstitute.org/api", query)

    const gnomad_data = await fetch("https://gnomad.broadinstitute.org/api", {
      body: JSON.stringify({
        query
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }}).then(response => response.json())

    return gnomad_data.json()
  }catch(error){
    return undefined
  }

}

const fetchGnomadPopFreq = async (ctx, variantId) => {

  const query = `{
    variant(variantId: "${variantId}", dataset: gnomad_r3){
      ... on VariantDetails{
        genome{
          ac
          an
          faf95 {
            popmax
            popmax_population
          }

          populations{
            id
            ac
            an
            ac_hemi
            ac_hom
          }
        }
      }
    }
  }
  ` 

  try{
    //const gnomad_data = await request("https://gnomad.broadinstitute.org/api", query)    
    const gnomad_data = await fetch("https://gnomad.broadinstitute.org/api", {
      body: JSON.stringify({
        query
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }}).then(response => response.json())

    //console.log(gnomad_data.variant.genome.populations)

    return gnomad_data.variant.genome
    //return gnomad_data
  }catch(error){
    return undefined
  }

}




const fetchMitoVariantDetails = async (ctx, variantId) => {


  const { genomeData } = await fetchVariantData(ctx, variantId)


  const sharedData = genomeData 

  const sharedVariantFields = {
    alt: sharedData.alt,
    chrom: sharedData.chrom,
    pos: sharedData.pos,
    ref: sharedData.ref,
    variantId: sharedData.variant_id,
    xpos: sharedData.xpos,
  }

  /*
  const [colocatedVariants, multiNucleotideVariants] = await Promise.all([
    fetchColocatedVariants(ctx, variantId, subset),
    fetchGnomadMNVSummariesByVariantId(ctx, variantId),
  ])
  */

  //const colocatedVariants = await fetchColocatedVariants(ctx, variantId)
  // console.log(colocatedVariants)
  console.log(sharedData)
  return {
    gqlType: 'MitoVariantDetails',
    // variant interface fields
    ...sharedVariantFields,

    //colocatedVariants,
    
    //flags: ['lcr', 'segdup', 'lc_lof', 'lof_flag'].filter(flag => sharedData.flags[flag]),
    spark_genome: genomeData
      ? {
          ...sharedVariantFields,
          
          ac: genomeData.ac,
          an: genomeData.an,
          ac_hom: genomeData.ac_hom,
          ac_het: genomeData.ac_het,
          max_heteroplasmy: genomeData.max_heteroplasmy          
        }
      : null,

    sortedTranscriptConsequences: sharedData.sortedTranscriptConsequences || [],
    haplogroups: sharedData.haplogroups || [],
    populations: sharedData.populations || [],    
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fetchMitoVariantDetails);


/***/ }),

/***/ "./src/pcgc_schema/datasets/fetchMitoVariantsByGene.js":
/*!*************************************************************!*\
  !*** ./src/pcgc_schema/datasets/fetchMitoVariantsByGene.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utilities_elasticsearch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utilities/elasticsearch */ "./src/utilities/elasticsearch.js");
/* harmony import */ var _utilities_region__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utilities/region */ "./src/utilities/region.js");
/* harmony import */ var _types_exon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../types/exon */ "./src/pcgc_schema/types/exon.js");
/* harmony import */ var _shapeMitoVariantSummary__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shapeMitoVariantSummary */ "./src/pcgc_schema/datasets/shapeMitoVariantSummary.js");
/* harmony import */ var _mergeMitoVariants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mergeMitoVariants */ "./src/pcgc_schema/datasets/mergeMitoVariants.js");




//import { request } from "graphql-request"
//import fetch from 'node-fetch'

/*
import {
  annotateVariantsWithMNVFlag,
  fetchGnomadMNVsByIntervals,
} from './gnomadMultiNucleotideVariants'
*/

//import mergePcgcAndGnomadVariantSummaries from './mergePcgcAndGnomadVariants'
//import mergeExomeAndGenomeVariantSummaries from './mergeExomeAndGenomeVariants'
//import mergeSSCVariants from './mergeSSCVariants'





/*
const annotateVariantsWithDenovoFlag = (variants, dnms) => {
  const dnmsVariantIds = new Set(dnms.reduce((acc, dnms) => acc.concat(dnms.variant_id), []))

  variants.forEach(variant => {
    if (dnmsVariantIds.has(variant.variantId)) {
      variant.flags.push('denovo')
    }
  })

  return variants
}


const fetchDenovos = async (ctx, geneId) => {

  const hits = await fetchAllSearchResults(ctx.database.elastic, {

    index: 'autism_dnms',
    type: 'variant',
    size: 10000,
    _source: [
      'variant_id',
      'high_confidence_dnm',
    ],
    body: {
      query: {
        bool: {
          filter: [
            { term: { ANN_GENEID: geneId } },
          ],
        },
      },
      sort: [{ POS: { order: 'asc' } }],
    },
  })

  return hits.map(hit => hit._source) // eslint-disable-line no-underscore-dangle
}
*/
const fetchMitoVariantsByGene = async (ctx, geneId, canonicalTranscriptId, subset) => {
  const geneExons = await (0,_types_exon__WEBPACK_IMPORTED_MODULE_2__.lookupExonsByGeneId)(ctx.database.gnomad, geneId)
  const filteredRegions = geneExons.filter(exon => exon.feature_type === 'CDS')
  const sortedRegions = filteredRegions.sort((r1, r2) => r1.xstart - r2.xstart)
  const padding = 75
  const paddedRegions = sortedRegions.map(r => ({
    ...r,
    start: r.start - padding,
    stop: r.stop + padding,
    xstart: r.xstart - padding,
    xstop: r.xstop + padding,
  }))

  const mergedRegions = (0,_utilities_region__WEBPACK_IMPORTED_MODULE_1__.mergeOverlappingRegions)(paddedRegions)

  const rangeQueries = mergedRegions.map(region => ({
    range: {
      pos: {
        gte: region.start,
        lte: region.stop,
      },
    },
  }))


  const hits = await (0,_utilities_elasticsearch__WEBPACK_IMPORTED_MODULE_0__.fetchAllSearchResults)(ctx.database.elastic, { 
//      index: 'pcgc_chr20_test',
      index: 'mito_test4',
      //type: 'variant',
      size: 10000,
      _source: [
        'alt',
        'chrom',
        'pos',
        'ref',
        'sortedTranscriptConsequences',
        'variant_id',
        'xpos',
        'ac',
        'ac_het',
        'ac_hom',
        'an',
        'af',
        'max_heteroplasmy',
        'filters',
        /*
        'AC_adj',
        'AN_adj',
        'nhomalt_adj',
        'alt',
        'chrom',
        'filters',
        'flags',
        //'nonpar',
        'pos',
        'ref',
        'rsid',
        'sortedTranscriptConsequences',
        'variant_id',
        'xpos',
        'AC',
        'AN',
        'AF',
        'nhomalt',
        'AC_raw',
        'AN_raw',
        'AF_raw',
        'nhomalt_raw',
        'AC_proband',
        'AN_proband',
        'AF_proband'*/

      ],
      /*
      body: {
        query : {
          nested: {
            path: 'sortedTranscriptConsequences',
            query:{
              match: {
                'sortedTranscriptConsequences.gene_id': geneId
              }
            }
          }
        },*/
        
      body: {
        query: {
          bool: {
            filter: [
              {
                nested: {
                  path: 'sortedTranscriptConsequences',
                  query: {
                    term: { 'sortedTranscriptConsequences.gene_id': geneId },
                  },
                },
              },
              { bool: { should: rangeQueries } },
              { range: { ['ac']: { gt: 0 } } },
            ],
          },
        },
        sort: [{ pos: { order: 'asc' } }],
      },
    })

  //console.log(hits)
  


  const sparkVariants = hits.map((0,_shapeMitoVariantSummary__WEBPACK_IMPORTED_MODULE_3__["default"])({ type: 'gene', geneId }))

  const ssc_hits = await (0,_utilities_elasticsearch__WEBPACK_IMPORTED_MODULE_0__.fetchAllSearchResults)(ctx.database.elastic, { 
//      index: 'pcgc_chr20_test',
      index: 'ssc_mito',
      //type: 'variant',
      size: 10000,
      _source: [
        'alt',
        'chrom',
        'pos',
        'ref',
        'sortedTranscriptConsequences',
        'variant_id',
        'xpos',
        'ac',
        'ac_het',
        'ac_hom',
        'an',
        'af',
        'max_heteroplasmy',
        'filters',
      ],
      body: {
        query: {
          bool: {
            filter: [
              {
                nested: {
                  path: 'sortedTranscriptConsequences',
                  query: {
                    term: { 'sortedTranscriptConsequences.gene_id': geneId },
                  },
                },
              },
              { bool: { should: rangeQueries } },
              { range: { ['ac']: { gt: 0 } } },
            ],
          },
        },
        sort: [{ pos: { order: 'asc' } }],
      },
    })



  const sscVariants = ssc_hits.map((0,_shapeMitoVariantSummary__WEBPACK_IMPORTED_MODULE_3__["default"])({ type: 'gene', geneId }))

  const allVariants = (0,_mergeMitoVariants__WEBPACK_IMPORTED_MODULE_4__["default"])(sparkVariants, sscVariants)

  //return sparkVariants
  return allVariants
  //return sscVariants

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fetchMitoVariantsByGene);


/***/ }),

/***/ "./src/pcgc_schema/datasets/fetchVariantDetails.js":
/*!*********************************************************!*\
  !*** ./src/pcgc_schema/datasets/fetchVariantDetails.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var whatwg_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! whatwg-fetch */ "../../node_modules/whatwg-fetch/fetch.js");
//import { UserVisibleError } from '../../errors'
//import { fetchGnomadMNVSummariesByVariantId } from './gnomadMultiNucleotideVariants'
//import { request } from "graphql-request"
//import fetch from 'node-fetch'


const formatHistogram = histogramData => ({
  bin_edges: histogramData.bin_edges.split('|').map(s => Number(s)),
  bin_freq: histogramData.bin_freq.split('|').map(s => Number(s)),
  n_larger: histogramData.n_larger,
  n_smaller: histogramData.n_smaller,
})



//const POPULATIONS = ['afr', 'amr', 'asj', 'eas', 'fin', 'nfe', 'oth', 'sas']
const POPULATIONS = ['afr', 'amr', 'eas', 'eur', 'oth', 'sas']

/*
const SUBPOPULATIONS = {
  afr: ['female', 'male'],
  amr: ['female', 'male'],
  asj: ['female', 'male'],
  eas: ['female', 'male', 'jpn', 'kor', 'oea'],
  fin: ['female', 'male'],
  nfe: ['female', 'male', 'bgr', 'est', 'nwe', 'onf', 'seu', 'swe'],
  oth: ['female', 'male'],
  sas: ['female', 'male'],
}
*/

const formatPopulations = variantData =>
  POPULATIONS.map(popId => ({
    id: popId.toUpperCase(),
    ac: variantData.AC_adj[popId] || 0,
    an: variantData.AN_adj[popId] || 0,
    ac_hom: variantData.nhomalt_adj[popId] || 0,

    //ac: (variantData.AC_adj[popId] || {}).total || 0,
    //an: (variantData.AN_adj[popId] || {}).total || 0,
    //ac_hemi: variantData.nonpar ? (variantData.AC_adj[popId] || {}).male || 0 : 0,
    //ac_hom: (variantData.nhomalt_adj[popId] || {}).total || 0,

    /*
    subpopulations: SUBPOPULATIONS[popId].map(subPopId => ({
      id: subPopId.toUpperCase(),
      ac: (variantData.AC_adj[popId] || {})[subPopId] || 0,
      an: (variantData.AN_adj[popId] || {})[subPopId] || 0,
      ac_hom: (variantData.nhomalt_adj[popId] || {})[subPopId] || 0,
    })),*/

  }))

/*
const formatFilteringAlleleFrequency = (variantData, fafField) => {
  const fafData = variantData[fafField]
  const { total, ...populationFAFs } = variantData[fafField]

  let popmaxFAF = -Infinity
  let popmaxPopulation = null

  Object.keys(populationFAFs)
    // gnomAD 2.1.0 calculated FAF for singleton variants.
    // This filters out those invalid FAFs.
    .filter(popId => variantData.AC_adj[popId].total > 1)
    .forEach(popId => {
      if (populationFAFs[popId] > popmaxFAF) {
        popmaxFAF = fafData[popId]
        popmaxPopulation = popId.toUpperCase()
      }
    })

  if (popmaxFAF === -Infinity) {
    popmaxFAF = null
  }

  return {
    popmax: popmaxFAF,
    popmax_population: popmaxPopulation,
  }
}
*/

const fetchVariantData = async (ctx, variantId) => {

/*
  const requests = [
    { index: 'gnomad_exomes_2_1_1', subset },
    // All genome samples are non_cancer, so separate non-cancer numbers are not stored
    { index: 'gnomad_genomes_2_1_1', subset: subset === 'non_cancer' ? 'gnomad' : subset },
  ]
*/

/*
  const [exomeData, genomeData] = await Promise.all(
    requests.map(({ index, subset: requestSubset }) =>
      ctx.database.elastic
        .search({
          index,
          type: 'variant',
          _source: [
            requestSubset,
            'ab_hist_alt',
            'allele_info',
            'alt',
            'chrom',
            'dp_hist_all',
            'dp_hist_alt',
            'filters',
            'flags',
            'gnomad_age_hist_het',
            'gnomad_age_hist_hom',
            'gq_hist_all',
            'gq_hist_alt',
            'nonpar',
            'pab_max',
            'pos',
            'qual',
            'ref',
            'rf_tp_probability',
            'rsid',
            'sortedTranscriptConsequences',
            'variant_id',
            'xpos',
          ],
          body: {
            query: {
              bool: {
                filter: [
                  { term: { variant_id: variantId } },
                  { range: { [`${requestSubset}.AC_raw`]: { gt: 0 } } },
                ],
              },
            },
          },
          size: 1,
        })
        .then(response => response.hits.hits[0])
        // eslint-disable-next-line no-underscore-dangle
        .then(doc => (doc ? { ...doc._source, ...doc._source[requestSubset] } : undefined))
    )
  )
  */


  /*
  return {
    exomeData,
    genomeData,
  }
  */

  //console.log("In here 2")

  const exomeData = await ctx.database.elastic.search({
  //await ctx.database.elastic.search({
    //index: 'bpkd_exomes',
    index: 'pkd_exomes',
    _source: [
//      requestSubset,
//      'ab_hist_alt',
//      'allele_info',
      'alt',
      'chrom',
//      'dp_hist_all',
//      'dp_hist_alt',
      'filters',
//      'flags',
//      'gnomad_age_hist_het',
//      'gnomad_age_hist_hom',
//      'gq_hist_all',
//      'gq_hist_alt',
//      'nonpar',
//      'pab_max',
      'pos',
//      'qual',
      'ref',
//      'rf_tp_probability',
//      'rsid',
      'sortedTranscriptConsequences',
      'variant_id',
      'xpos',
      'AC_adj',
      'AN_adj',
      'AF_adj',
      'nhomalt_adj',
      'AC',
      'AF',
      'AN',
      'nhomalt',
      'AC_raw',
      'AN_raw',
      'AF_raw',
      'AC_male',
      'AN_male',
      'nhomalt_male',
      'AC_female',
      'AN_female',
      'nhomalt_female',
      'genotype_quality',
      'genotype_depth',
      'allele_balance',
      'in_silico_predictors'
    ],
    body: {
      query: {
        bool: {
          filter: [
            { term: { variant_id: variantId } },
            //{ range: { [`${requestSubset}.AC_raw`]: { gt: 0 } } },
          ],
        },
      },
    },
    size: 1,
  })
  //.then(function (response){
    //console.log("In here 3") 
    //console.log(response.hits.hits[0]._source)
    //return response.hits.hits[0]._source

  //})
  //.then(response => console.log(response.hits.hits[0]))
  //.then(response => return response.hits.hits[0])
  //.then(doc => (doc ? { ...doc._source } : undefined))
  //.then(response => response.hits.hits[0])
  console.log("Showing exome data")
  //console.log(exomeData.hits.hits[0]._source)

  //return esHit => {
  //  return esHit.hits.hits[0]
  //}
  //console.log("In here 3.1") 
  /*
  const genomeData = await ctx.database.elastic.search({
    index: 'spark_genomes',
    type: 'variant',
    _source: [
      'alt',
      'chrom',
      'filters',
      'pos',
      'ref',
      'sortedTranscriptConsequences',
      'variant_id',
      'xpos',
      'AC_adj',
      'AN_adj',
      'AF_adj',
      'nhomalt_adj',
      'AC',
      'AF',
      'AN',
      'nhomalt',
      'AC_raw',
      'AN_raw',
      'AF_raw',
      'AC_male',
      'AN_male',
      'nhomalt_male',
      'AC_female',
      'AN_female',
      'nhomalt_female',
    ],
    body: {
      query: {
        bool: {
          filter: [
            { term: { variant_id: variantId } },
            //{ range: { [`${requestSubset}.AC_raw`]: { gt: 0 } } },
          ],
        },
      },
    },
    size: 1,
  })

 const sscGenomeData = await ctx.database.elastic.search({
    index: 'ssc_genomes',
    type: 'variant',
    _source: [
      'alt',
      'chrom',
      'filters',
      'pos',
      'ref',
      'sortedTranscriptConsequences',
      'variant_id',
      'xpos',
      'AC_adj',
      'AN_adj',
      'AF_adj',
      'nhomalt_adj',
      'AC',
      'AF',
      'AN',
      'nhomalt',
      'AC_raw',
      'AN_raw',
      'AF_raw',
      'AC_male',
      'AN_male',
      'nhomalt_male',
      'AC_female',
      'AN_female',
      'nhomalt_female',
    ],
    body: {
      query: {
        bool: {
          filter: [
            { term: { variant_id: variantId } },
            //{ range: { [`${requestSubset}.AC_raw`]: { gt: 0 } } },
          ],
        },
      },
    },
    size: 1,
  })
  */
  //console.log(exomeData.hits.hits[0]._source) 

  //console.log("In here 3") 
  //console.log(genomeData.hits.hits[0]) 

  //console.log("In here 4") 
  console.log(exomeData)

  return exomeData.hits.hits[0]._source

  /*
  return { exomeData: exomeData.hits.hits[0] ? exomeData.hits.hits[0]._source : undefined , 
           genomeData: genomeData.hits.hits[0] ? genomeData.hits.hits[0]._source : undefined,
           sscGenomeData: sscGenomeData.hits.hits[0] ? sscGenomeData.hits.hits[0]._source : undefined }
  */

}


const fetchColocatedVariants = async (ctx, variantId) => {
  const parts = variantId.split('-')
  const chrom = parts[0]
  const pos = Number(parts[1])

  /*
  const requests = [
    { index: 'gnomad_exomes_2_1_1', subset },
    // All genome samples are non_cancer, so separate non-cancer numbers are not stored
    { index: 'gnomad_genomes_2_1_1', subset: subset === 'non_cancer' ? 'gnomad' : subset },
  ]

  const [exomeResponse, genomeResponse] = await Promise.all(
    requests.map(({ index, subset: requestSubset }) =>
      ctx.database.elastic.search({
        index,
        type: 'variant',
        _source: ['variant_id'],
        body: {
          query: {
            bool: {
              filter: [
                { term: { chrom } },
                { term: { pos } },
                { range: { [`${requestSubset}.AC_raw`]: { gt: 0 } } },
              ],
            },
          },
        },
      })
    )
  )
  */

  const exomeResponse = await ctx.database.elastic.search({
  //await ctx.database.elastic.search({
    //index: 'bpkd_exomes',
    index: 'pkd_exomes',
    //type: 'variant',
    _source: ['variant_id'],
    body: {
      query: {
        bool: {
          filter: [
            { term: { chrom } },
            { term: { pos } },
            { range: { ['AC_raw']: { gt: 0 } } },
          ],
        },
      },
    },
  })

  /*
  const genomeResponse = await ctx.database.elastic.search({
  //await ctx.database.elastic.search({
    index: 'spark_genomes',
    type: 'variant',
    _source: ['variant_id'],
    body: {
      query: {
        bool: {
          filter: [
            { term: { chrom } },
            { term: { pos } },
          ],
        },
      },
    },
  })
  */

  //console.log(exomeResponse)
  //console.log(genomeResponse)



  

  // eslint-disable no-underscore-dangle
  const exomeVariants = exomeResponse.hits.hits.map(doc => doc._source.variant_id)
  //const genomeVariants = genomeResponse.hits.hits.map(doc => doc._source.variant_id)
  // eslint-enable no-underscore-dangle 

  //console.log(exomeVariants)
  //console.log(genomeVariants)

  //const combinedVariants = exomeVariants.concat(genomeVariants)
  const combinedVariants = exomeVariants

  //return combinedVariants

  
  return combinedVariants
    .filter(otherVariantId => otherVariantId !== variantId)
    .sort()
    .filter(
      (otherVariantId, index, allOtherVariantIds) =>
        otherVariantId !== allOtherVariantIds[index + 1]
    )

  


}



const fetchRSID = async (ctx, variantId) => {

  const query = `{
    variant(variantId: "${variantId}", dataset: gnomad_r3){
      rsid
      variantId    
    }
  }
  ` 

  try{
    //const gnomad_data = await request("https://gnomad.broadinstitute.org/api", query)

    const gnomad_data = await fetch("https://gnomad.broadinstitute.org/api", {
      body: JSON.stringify({
        query
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }}).then(response => response.json())


    return gnomad_data
  }catch(error){
    return undefined
  }

}

const fetchGnomadPopFreq = async (ctx, variantId) => {

  const query = `{
    variant(variantId: "${variantId}", dataset: gnomad_r3){
      ... on VariantDetails{
        genome{
          ac
          an
          faf95 {
            popmax
            popmax_population
          }

          populations{
            id
            ac
            an
            ac_hemi
            ac_hom
          }
        }
      }
    }
  }
  ` 

  try{
    //const gnomad_data = await request("https://gnomad.broadinstitute.org/api", query)    

    const gnomad_data = await fetch("https://gnomad.broadinstitute.org/api", {
      body: JSON.stringify({
        query
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }}).then(response => response.json())

    //console.log(gnomad_data.variant.genome.populations)

    return gnomad_data.variant.genome
    //return gnomad_data
  }catch(error){
    return undefined
  }

}




const fetchVariantDetails = async (ctx, variantId) => {
  //const { exomeData, genomeData } = await fetchGnomadVariantData(ctx, variantId, subset)


  //if (!exomeData && !genomeData) {
  //  throw new UserVisibleError('Variant not found')
  //}

  //const sharedData = exomeData || genomeData

  //console.log("In here 1")
  //const exomeData = await fetchVariantData(ctx, variantId)
  //console.log("In here 4")
  //console.log(exomeData)


  //const { exomeData, genomeData, sscGenomeData } = await fetchVariantData(ctx, variantId)
  const exomeData  = await fetchVariantData(ctx, variantId)


  //console.log(sscGenomeData) 

  // const sharedData = exomeData


  const clinVarES = await ctx.database.elastic.search({
    index: 'clinvar_grch38',
    //type: 'variant',
    _source: [
      'allele_id',
      'alt',
      'chrom',
      'clinical_significance',
      'gene_id_to_consequence_json',
      'gold_stars',
      'pos',
      'ref',
      'variant_id',
      'xpos',
    ],
    body: {
      query: {
        bool: {
          filter: [
            { term: { variant_id: variantId } },
          ],
        },
      }
    },
    size: 1,
  })

  
  const clinVarData = clinVarES.hits.hits[0] ? clinVarES.hits.hits[0]._source : undefined
  //console.log(clinVarData)


  const mayoDB = await ctx.database.elastic.search({
    index: 'mayo_database',
    _source: [
      'variant_id',
      'MayoVariantID',
      'VariantTypeName',
      'ClinicalSignificanceShortName'
    ],
    body: {
      query: {
        bool: {
          filter: [
            { term: { variant_id: variantId } },
          ],
        },
      }
    },
    size: 1,
  })

  
  const mayoData = mayoDB.hits.hits[0] ? mayoDB.hits.hits[0]._source : undefined
  //console.log(mayoData)
  
  /*
  const denovoES = await ctx.database.elastic.search({
    index: 'autism_dnms',
    type: 'variant',
    _source: [
      'variant_id',
      'high_confidence_dnm',
    ],
    body: {
      query: {
        bool: {
          filter: [
            { term: { variant_id: variantId } },
          ],
        },
      }
    },
    size: 1,
  })

  
  const denovoData = denovoES.hits.hits[0] ? denovoES.hits.hits[0]._source : undefined
  */
  //console.log("In here")
  //console.log(denovoData)

  


  /*
  const query = `{
    variant(variantId: "${variantId}", dataset: gnomad_r3){
      rsid
      variantId    
    }
  }
  `
  const gnomad_data = undefined
    


  try{
    console.log("In here1")
    gnomad_data = await request("https://gnomad.broadinstitute.org/api", query)
  //console.log(gnomad_data.data)

  }catch(error){
  }
  */

  const gnomad_data = await fetchRSID(ctx, variantId)
  //console.log("Showing gnomod rsID data")
  //console.log(gnomad_data)  

  const gnomad_pop_data = await fetchGnomadPopFreq(ctx, variantId)

  //console.log("Showing gnomod population data")
  //console.log(gnomad_pop_data)

  //const sharedData = exomeData || genomeData || sscGenomeData
  const sharedData = exomeData
  //console.log(sharedData)

  const sharedVariantFields = {
    alt: sharedData.alt,
    chrom: sharedData.chrom,
    pos: sharedData.pos,
    ref: sharedData.ref,
    variantId: sharedData.variant_id,
    xpos: sharedData.xpos,
  }

  /*
  const [colocatedVariants, multiNucleotideVariants] = await Promise.all([
    fetchColocatedVariants(ctx, variantId, subset),
    fetchGnomadMNVSummariesByVariantId(ctx, variantId),
  ])
  */

  const colocatedVariants = await fetchColocatedVariants(ctx, variantId)
  // console.log(colocatedVariants)
  //console.log(exomeData.genotype_depth.all_raw)

  return {
    gqlType: 'VariantDetails',
    // variant interface fields
    ...sharedVariantFields,
    // gnomAD specific fields

    /*
    age_distribution: {
      het: formatHistogram(sharedData.gnomad_age_hist_het),
      hom: formatHistogram(sharedData.gnomad_age_hist_hom),
    },
    colocatedVariants,
    multiNucleotideVariants,
    */

    colocatedVariants,
    gnomadPopFreq: gnomad_pop_data ? gnomad_pop_data.populations : null,
    gnomadAF: gnomad_pop_data ? gnomad_pop_data.ac/gnomad_pop_data.an : null,
    

    bpkd_exome: exomeData
      ? {
          // Include variant fields so that the reads data resolver can access them.
          ...sharedVariantFields,
          //ac: exomeData.AC_adj.total,
          //an: exomeData.AN_adj.total,
          //ac_hemi: exomeData.nonpar ? exomeData.AC_adj.male : 0,
          //ac_hom: exomeData.nhomalt_adj.total,

          ac: exomeData.AC,
          an: exomeData.AN,
          //ac_hemi: exomeData.nonpar ? exomeData.AC_adj.male : 0,
          ac_hom: exomeData.nhomalt,

          ac_male: exomeData.AC_male,
          an_male: exomeData.AN_male,
          ac_male_hom: exomeData.nhomalt_male,


          ac_female: exomeData.AC_female,
          an_female: exomeData.AN_female,
          ac_female_hom: exomeData.nhomalt_female,
          
          //faf95: formatFilteringAlleleFrequency(exomeData, 'faf95_adj'),
          //faf99: formatFilteringAlleleFrequency(exomeData, 'faf99_adj'),
          //filters: exomeData.filters,
          populations: formatPopulations(exomeData),
                    
          qualityMetrics: {
            
            alleleBalance: {
              //alt: formatHistogram(exomeData.ab_hist_alt),
              alt: exomeData.allele_balance.alt_adj,
            },
            
            genotypeDepth: {
              //all: formatHistogram(exomeData.genotype_depth.all_raw),
              //alt: formatHistogram(exomeData.genotype_depth.alt_raw),
              all: exomeData.genotype_depth.all_adj,
              alt: exomeData.genotype_depth.alt_adj,

            },            
            genotypeQuality: {
              //all: formatHistogram(exomeData.gq_hist_all),
              //alt: formatHistogram(exomeData.gq_hist_alt),

              all: exomeData.genotype_quality.all_adj,
              alt: exomeData.genotype_quality.alt_adj,

            },

            /*
            siteQualityMetrics: {
              ...exomeData.allele_info,
              pab_max: exomeData.pab_max,
              RF: exomeData.rf_tp_probability,
              SiteQuality: exomeData.qual,
            },*/
          },

        }
      : null,


    /*
    spark_exome: exomeData
      ? {
          // Include variant fields so that the reads data resolver can access them.
          ...sharedVariantFields,
          //ac: exomeData.AC_adj.total,
          //an: exomeData.AN_adj.total,
          //ac_hemi: exomeData.nonpar ? exomeData.AC_adj.male : 0,
          //ac_hom: exomeData.nhomalt_adj.total,

          ac: exomeData.AC,
          an: exomeData.AN,
          //ac_hemi: exomeData.nonpar ? exomeData.AC_adj.male : 0,
          ac_hom: exomeData.nhomalt,

          ac_male: exomeData.AC_male,
          an_male: exomeData.AN_male,
          ac_male_hom: exomeData.nhomalt_male,


          ac_female: exomeData.AC_female,
          an_female: exomeData.AN_female,
          ac_female_hom: exomeData.nhomalt_female,
          
          //faf95: formatFilteringAlleleFrequency(exomeData, 'faf95_adj'),
          //faf99: formatFilteringAlleleFrequency(exomeData, 'faf99_adj'),
          //filters: exomeData.filters,
          populations: formatPopulations(exomeData),
                    
          qualityMetrics: {
            
            alleleBalance: {
              //alt: formatHistogram(exomeData.ab_hist_alt),
              alt: exomeData.allele_balance.alt_raw,
            },
            
            genotypeDepth: {
              //all: formatHistogram(exomeData.genotype_depth.all_raw),
              //alt: formatHistogram(exomeData.genotype_depth.alt_raw),
              all: exomeData.genotype_depth.all_raw,
              alt: exomeData.genotype_depth.alt_raw,

            },            
            genotypeQuality: {
              //all: formatHistogram(exomeData.gq_hist_all),
              //alt: formatHistogram(exomeData.gq_hist_alt),

              all: exomeData.genotype_quality.all_raw,
              alt: exomeData.genotype_quality.alt_raw,

            },

            
            siteQualityMetrics: {
              ...exomeData.allele_info,
              pab_max: exomeData.pab_max,
              RF: exomeData.rf_tp_probability,
              SiteQuality: exomeData.qual,
            },
          },

        }
      : null,

    
    //flags: ['lcr', 'segdup', 'lc_lof', 'lof_flag'].filter(flag => sharedData.flags[flag]),
    spark_genome: genomeData
      ? {
          // Include variant fields so that the reads data resolver can access them.
          ...sharedVariantFields,
          //ac: genomeData.AC_adj.total,
          //an: genomeData.AN_adj.total,
          //ac_hemi: genomeData.nonpar ? genomeData.AC_adj.male : 0,
          //ac_hom: genomeData.nhomalt_adj.total,
          //faf95: formatFilteringAlleleFrequency(genomeData, 'faf95_adj'),
          //faf99: formatFilteringAlleleFrequency(genomeData, 'faf99_adj'),
          //filters: genomeData.filters,
          
          ac: genomeData.AC,
          an: genomeData.AN,
          //ac_hemi: exomeData.nonpar ? exomeData.AC_adj.male : 0,
          ac_hom: genomeData.nhomalt,

          ac_male: genomeData.AC_male,
          an_male: genomeData.AN_male,
          ac_male_hom: genomeData.nhomalt_male,


          ac_female: genomeData.AC_female,
          an_female: genomeData.AN_female,
          ac_female_hom: genomeData.nhomalt_female,


          populations: formatPopulations(genomeData),
          
          
          qualityMetrics: {
            alleleBalance: {
              alt: formatHistogram(genomeData.ab_hist_alt),
            },
            genotypeDepth: {
              all: formatHistogram(genomeData.dp_hist_all),
              alt: formatHistogram(genomeData.dp_hist_alt),
            },
            genotypeQuality: {
              all: formatHistogram(genomeData.gq_hist_all),
              alt: formatHistogram(genomeData.gq_hist_alt),
            },
            siteQualityMetrics: {
              ...genomeData.allele_info,
              pab_max: genomeData.pab_max,
              RF: genomeData.rf_tp_probability,
              SiteQuality: genomeData.qual,
            },
          },
        }
      : null,

    ssc_genome: sscGenomeData
      ? {
          // Include variant fields so that the reads data resolver can access them.
          ...sharedVariantFields,
          //ac: genomeData.AC_adj.total,
          //an: genomeData.AN_adj.total,
          //ac_hemi: genomeData.nonpar ? genomeData.AC_adj.male : 0,
          //ac_hom: genomeData.nhomalt_adj.total,
          //faf95: formatFilteringAlleleFrequency(genomeData, 'faf95_adj'),
          //faf99: formatFilteringAlleleFrequency(genomeData, 'faf99_adj'),
          //filters: genomeData.filters,
          
          ac: sscGenomeData.AC,
          an: sscGenomeData.AN,
          //ac_hemi: exomeData.nonpar ? exomeData.AC_adj.male : 0,
          ac_hom: sscGenomeData.nhomalt,

          ac_male: sscGenomeData.AC_male,
          an_male: sscGenomeData.AN_male,
          ac_male_hom: sscGenomeData.nhomalt_male,


          ac_female: sscGenomeData.AC_female,
          an_female: sscGenomeData.AN_female,
          ac_female_hom: sscGenomeData.nhomalt_female,


          populations: formatPopulations(sscGenomeData),
          
        }
      : null,
    */

    //rsid: sharedData.rsid,
    //faf95: { popmax: 0.00000514, popmax_population: 'NFE' }
    mayo_variant_details: mayoData ? mayoData : null,
    gnomad_faf95_popmax: gnomad_pop_data ? gnomad_pop_data.faf95.popmax : null,
    gnomad_faf95_population: gnomad_pop_data ? gnomad_pop_data.faf95.popmax_population : null,

    rsid: gnomad_data.data.variant ? gnomad_data.data.variant.rsid : null,
    //rsid: null,
    clinvarAlleleID:  clinVarData ? clinVarData.allele_id : null,
    //denovoHC: denovoData ? denovoData.high_confidence_dnm : null,
    sortedTranscriptConsequences: sharedData.sortedTranscriptConsequences || [],
    in_silico_predictors: exomeData ? exomeData.in_silico_predictors : null
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fetchVariantDetails);


/***/ }),

/***/ "./src/pcgc_schema/datasets/fetchVariantsByGene.js":
/*!*********************************************************!*\
  !*** ./src/pcgc_schema/datasets/fetchVariantsByGene.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utilities_elasticsearch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utilities/elasticsearch */ "./src/utilities/elasticsearch.js");
/* harmony import */ var _utilities_region__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utilities/region */ "./src/utilities/region.js");
/* harmony import */ var _types_exon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../types/exon */ "./src/pcgc_schema/types/exon.js");
/* harmony import */ var node_fetch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! node-fetch */ "node-fetch");
/* harmony import */ var node_fetch__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_fetch__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _mergePcgcAndGnomadVariants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mergePcgcAndGnomadVariants */ "./src/pcgc_schema/datasets/mergePcgcAndGnomadVariants.js");
/* harmony import */ var _mergeExomeAndGenomeVariants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./mergeExomeAndGenomeVariants */ "./src/pcgc_schema/datasets/mergeExomeAndGenomeVariants.js");
/* harmony import */ var _mergeSSCVariants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./mergeSSCVariants */ "./src/pcgc_schema/datasets/mergeSSCVariants.js");
/* harmony import */ var _shapeGnomadVariantSummary__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./shapeGnomadVariantSummary */ "./src/pcgc_schema/datasets/shapeGnomadVariantSummary.js");




//import { request } from "graphql-request"


//import 'whatwg-fetch'

/*
import {
  annotateVariantsWithMNVFlag,
  fetchGnomadMNVsByIntervals,
} from './gnomadMultiNucleotideVariants'
*/







const annotateVariantsWithMayoFlag = (variants, mayo) => {
  const mayoVariantIds = new Set(mayo.reduce((acc, mayo) => acc.concat(mayo.variant_id), []))

  variants.forEach(variant => {
    if (mayoVariantIds.has(variant.variantId)) {
      variant.flags.push('mayo')
    }
  })

  return variants
}


const fetchMayoVariants = async (ctx, geneId) => {

  const hits = await (0,_utilities_elasticsearch__WEBPACK_IMPORTED_MODULE_0__.fetchAllSearchResults)(ctx.database.elastic, {

    index: 'mayo_database',
    size: 10000,
    _source: [
      'variant_id',
      'MayoVariantID',
    ],
    body: {
      query: {
        bool: {
          filter: [
            { term: { GeneName: geneId } },
          ],
        },
      },
      sort: [{ pos: { order: 'asc' } }],
    },
  })

  return hits.map(hit => hit._source) // eslint-disable-line no-underscore-dangle
}

const fetchVariantsByGene = async (ctx, geneId, canonicalTranscriptId, subset) => {
  const geneExons = await (0,_types_exon__WEBPACK_IMPORTED_MODULE_2__.lookupExonsByGeneId)(ctx.database.gnomad, geneId)
  const filteredRegions = geneExons.filter(exon => exon.feature_type === 'CDS')
  const sortedRegions = filteredRegions.sort((r1, r2) => r1.xstart - r2.xstart)
  const padding = 75
  const paddedRegions = sortedRegions.map(r => ({
    ...r,
    start: r.start - padding,
    stop: r.stop + padding,
    xstart: r.xstart - padding,
    xstop: r.xstop + padding,
  }))

  const mergedRegions = (0,_utilities_region__WEBPACK_IMPORTED_MODULE_1__.mergeOverlappingRegions)(paddedRegions)

  const rangeQueries = mergedRegions.map(region => ({
    range: {
      pos: {
        gte: region.start,
        lte: region.stop,
      },
    },
  }))

  const hits = await (0,_utilities_elasticsearch__WEBPACK_IMPORTED_MODULE_0__.fetchAllSearchResults)(ctx.database.elastic, { 
      //index: 'bpkd_exomes',
      index: 'pkd_exomes',
      size: 10000,
      _source: [
        'AC_adj',
        'AN_adj',
        'nhomalt_adj',
        'alt',
        'chrom',
        'filters',
        'flags',
        //'nonpar',
        'pos',
        'ref',
        'rsid',
        'sortedTranscriptConsequences',
        'variant_id',
        'xpos',
        'AC',
        'AN',
        'AF',
        'nhomalt',
        'AC_raw',
        'AN_raw',
        'AF_raw',
        'nhomalt_raw',
        'AC_proband',
        'AN_proband',
        'AF_proband'
      ],
      /*
      body: {
        query : {
          nested: {
            path: 'sortedTranscriptConsequences',
            query:{
              match: {
                'sortedTranscriptConsequences.gene_id': geneId
              }
            }
          }
        },*/
      body: {
        query: {
          bool: {
            filter: [
              {
                nested: {
                  path: 'sortedTranscriptConsequences',
                  query: {
                    term: { 'sortedTranscriptConsequences.gene_id': geneId },
                  },
                },
              },
              { bool: { should: rangeQueries } },
              //{ range: { ['AC_raw']: { gt: 0 } } },
              { range: { ['AC']: { gt: 0 } } },
 
            ],
          },
        },
        sort: [{ pos: { order: 'asc' } }],
      },
    })


  console.log("Done making first query - bpkd_exomes")
  const exomeVariants = hits.map((0,_shapeGnomadVariantSummary__WEBPACK_IMPORTED_MODULE_7__["default"])({ type: 'gene', geneId }))
  //console.log(exomeVariants)


  //const allVariants = mergeSSCVariants(sparkVariants, ssc_genomeVariants)

  const query = `{
    gene(gene_id: "${geneId}" reference_genome: GRCh38) {
      gene_id
      symbol
      variants(dataset: gnomad_r3){
        pos
        variantId
        rsid
        exome{
          ac
          an
        }
        genome{
          ac
          an
        }
      }
    }
  }
  `

  console.log("About to request data from gnomAD")
  
  const gnomad_data = await node_fetch__WEBPACK_IMPORTED_MODULE_3___default()("https://gnomad.broadinstitute.org/api", {
    body: JSON.stringify({
      query
    }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }}).then(response => response.json())

  const combinedVariants = (0,_mergePcgcAndGnomadVariants__WEBPACK_IMPORTED_MODULE_4__["default"])(exomeVariants,gnomad_data.data.gene.variants)
  //console.log(gnomad_data.data.gene.symbol)
  //const dnms = await fetchDenovos(ctx,geneId)
  //annotateVariantsWithDenovoFlag(combinedVariants,dnms)
  const mayo = await fetchMayoVariants(ctx,gnomad_data.data.gene.symbol)
  //console.log(mayo)
  annotateVariantsWithMayoFlag(combinedVariants,mayo)

  return combinedVariants
  

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fetchVariantsByGene);


/***/ }),

/***/ "./src/pcgc_schema/datasets/fetchVariantsByRegion.js":
/*!***********************************************************!*\
  !*** ./src/pcgc_schema/datasets/fetchVariantsByRegion.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utilities_elasticsearch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utilities/elasticsearch */ "./src/utilities/elasticsearch.js");
/* harmony import */ var _utilities_variant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utilities/variant */ "./src/utilities/variant.js");
/* harmony import */ var _shapeGnomadVariantSummary__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shapeGnomadVariantSummary */ "./src/pcgc_schema/datasets/shapeGnomadVariantSummary.js");
/* harmony import */ var _mergeExomeAndGenomeVariants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mergeExomeAndGenomeVariants */ "./src/pcgc_schema/datasets/mergeExomeAndGenomeVariants.js");
/* harmony import */ var _mergePcgcAndGnomadVariants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mergePcgcAndGnomadVariants */ "./src/pcgc_schema/datasets/mergePcgcAndGnomadVariants.js");


//import { request } from "graphql-request"

//import fetch from 'node-fetch'

/*
import {
  annotateVariantsWithMNVFlag,
  fetchGnomadMNVsByIntervals,
} from './gnomadMultiNucleotideVariants'
*/

//import mergeExomeAndGenomeVariantSummaries from './mergeExomeAndGenomeVariantSummaries'




const fetchVariantsByRegion = async (ctx, { chrom, start, stop }, subset) => {


  const hits = await (0,_utilities_elasticsearch__WEBPACK_IMPORTED_MODULE_0__.fetchAllSearchResults)(ctx.database.elastic, { 
//      index: 'pcgc_chr20_test',
    index: 'pcgc_exomes',
    type: 'variant',
    size: 10000,
    _source: [
      'AC_adj',
      'AN_adj',
      'nhomalt_adj',
      'alt',
      'chrom',
      'filters',
      'flags',
      //'nonpar',
      'pos',
      'ref',
      'rsid',
      'sortedTranscriptConsequences',
      'variant_id',
      'xpos',
      'AC',
      'AN',
      'AF',
      'nhomalt',
      'AC_raw',
      'AN_raw',
      'AF_raw',
      'nhomalt_raw',
      'AC_proband',
      'AN_proband',
      'AF_proband'
    ],
      /*
      body: {
        query: {
          bool: {
            filter: [
              {
                nested: {
                  path: 'sortedTranscriptConsequences',
                  query: {
                    term: { 'sortedTranscriptConsequences.gene_id': geneId },
                  },
                },
              },
              { bool: { should: rangeQueries } },
              { range: { ['AC_raw']: { gt: 0 } } },
            ],
          },
        },
        sort: [{ pos: { order: 'asc' } }],
      */
    body: {
      query: {
        bool: {
          filter: [
            { term: { chrom } },
            {
              range: {
                pos: {
                  gte: start,
                  lte: stop,
                },
              },
            },
            { range: { ['AC_raw']: { gt: 0 } } },
          ],
        },
      },
      sort: [{ pos: { order: 'asc' } }],
    },
  })

  const exomeVariants = hits.map((0,_shapeGnomadVariantSummary__WEBPACK_IMPORTED_MODULE_2__["default"])({ type: 'region'}))
  //console.log(exomeVariants)

  const ghits = await (0,_utilities_elasticsearch__WEBPACK_IMPORTED_MODULE_0__.fetchAllSearchResults)(ctx.database.elastic, { 
    index: 'ssc_genomes',
    type: 'variant',
    size: 10000,
    _source: [
      'AC_adj',
      'AN_adj',
      'nhomalt_adj',
      'alt',
      'chrom',
      'filters',
      'flags',        
      'pos',
      'ref',
      'rsid',        
      'sortedTranscriptConsequences',
      'variant_id',
      'xpos',
      'AC',
      'AN',
      'AF',
      'nhomalt',
      'AC_raw',
      'AN_raw',
      'AF_raw',
      'nhomalt_raw',
      'AC_proband',
      'AN_proband',
      'AF_proband'
    ],
    /*
    body: {
      query : {
        nested: {
          path: 'sortedTranscriptConsequences',
          query:{
            match: {
              'sortedTranscriptConsequences.gene_id': geneId
            }
          }
        }
      },
      sort: [{ pos: { order: 'asc' } }],
    },
    */
    body: {
      query: {
        bool: {
          filter: [
            { term: { chrom } },
            {
              range: {
                pos: {
                  gte: start,
                  lte: stop,
                },
              },
            },
          ],
        },
      },
      sort: [{ pos: { order: 'asc' } }],
    },
  })

  const genomeVariants = ghits.map((0,_shapeGnomadVariantSummary__WEBPACK_IMPORTED_MODULE_2__["default"])({ type: 'region'}))
  //console.log(genomeVariants)

  const exomeAndGenomeVariants = (0,_mergeExomeAndGenomeVariants__WEBPACK_IMPORTED_MODULE_3__["default"])(exomeVariants, genomeVariants)



  const query = `{
    region(start: ${start}, stop: ${stop}, chrom: "${chrom}", reference_genome: GRCh38) {
      variants(dataset: gnomad_r3){
        pos
        variantId
        rsid
        exome{
          ac
          an
        }
        genome{
          ac
          an
        }
      }
    }
  }
  `
  //request("http://gnomad.broadinstitute.org/api", query).then(console.log).catch(console.error)
  //console.log("In here 33")
  //const gnomad_data = request("http://gnomad.broadinstitute.org/api", query).then(console.log).catch(console.error)

  //const gnomad_data = await request("https://gnomad.broadinstitute.org/api", query)
  //console.log(gnomad_data.region.variants)

  //const combinedVariants = mergePcgcAndGnomadVariantSummaries(exomeVariants,gnomad_data.gene.variants)
  
  //const combinedVariants = mergePcgcAndGnomadVariantSummaries(exomeAndGenomeVariants,gnomad_data.region.variants)
  //console.log(combinedVariants)
  //return combinedVariants

  return exomeAndGenomeVariants

  /*
  const requests = [
    { index: 'gnomad_exomes_2_1_1', subset },
    // All genome samples are non_cancer, so separate non-cancer numbers are not stored
    { index: 'gnomad_genomes_2_1_1', subset: subset === 'non_cancer' ? 'gnomad' : subset },
  ]

  const [exomeVariants, genomeVariants] = await Promise.all(
    requests.map(async ({ index, subset }) => {
      const hits = await fetchAllSearchResults(ctx.database.elastic, {
        index,
        type: 'variant',
        size: 10000,
        _source: [
          `${subset}.AC_adj`,
          `${subset}.AN_adj`,
          `${subset}.nhomalt_adj`,
          'alt',
          'chrom',
          'filters',
          'flags',
          'nonpar',
          'pos',
          'ref',
          'rsid',
          'sortedTranscriptConsequences',
          'variant_id',
          'xpos',
        ],
        body: {
          query: {
            bool: {
              filter: [
                { term: { chrom } },
                {
                  range: {
                    pos: {
                      gte: start,
                      lte: stop,
                    },
                  },
                },
                { range: { [`${subset}.AC_raw`]: { gt: 0 } } },
              ],
            },
          },
          sort: [{ pos: { order: 'asc' } }],
        },
      })

      return hits.map(shapeGnomadVariantSummary(subset, { type: 'region' }))
    })
  )

  const combinedVariants = mergeExomeAndGenomeVariantSummaries(exomeVariants, genomeVariants)

  // TODO: This can be fetched in parallel with exome/genome data
  const mnvs = await fetchGnomadMNVsByIntervals(ctx, [
    { xstart: getXpos(chrom, start), xstop: getXpos(chrom, stop) },
  ])
  annotateVariantsWithMNVFlag(combinedVariants, mnvs)

  return combinedVariants
  */
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fetchVariantsByRegion);


/***/ }),

/***/ "./src/pcgc_schema/datasets/haplogroups.js":
/*!*************************************************!*\
  !*** ./src/pcgc_schema/datasets/haplogroups.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HaplogroupType": () => (/* binding */ HaplogroupType),
/* harmony export */   "PopulationType": () => (/* binding */ PopulationType)
/* harmony export */ });
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_0__);



const HaplogroupType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'Haplogroup',
  fields: {
    id: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    an: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    ac_het: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    ac_hom: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
  },
})


const PopulationType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'Population',
  fields: {
    id: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    an: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    ac_het: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    ac_hom: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
  },
})


/***/ }),

/***/ "./src/pcgc_schema/datasets/mergeExomeAndGenomeVariants.js":
/*!*****************************************************************!*\
  !*** ./src/pcgc_schema/datasets/mergeExomeAndGenomeVariants.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const mergeExomeAndGenomeVariantSummaries = (exomeVariants, genomeVariants) => {
  const mergedVariants = []

  
  while (exomeVariants.length || genomeVariants.length) {
    const currentExomeVariant = exomeVariants[0]
    const currentGenomeVariant = genomeVariants[0]

    if (currentGenomeVariant === undefined) {
      mergedVariants.push(exomeVariants.shift())
    } else if (currentExomeVariant === undefined) {
      mergedVariants.push(genomeVariants.shift())
    } else if (currentExomeVariant.pos < currentGenomeVariant.pos) {
      mergedVariants.push(exomeVariants.shift())
    } else if (currentGenomeVariant.pos < currentExomeVariant.pos) {
      mergedVariants.push(genomeVariants.shift())
    } else {
      const currentPosition = currentExomeVariant.pos

      const exomeVariantsAtThisPosition = []
      while (exomeVariants.length && exomeVariants[0].pos === currentPosition) {
        exomeVariantsAtThisPosition.push(exomeVariants.shift())
      }
      const genomeVariantsAtThisPosition = []
      while (genomeVariants.length && genomeVariants[0].pos === currentPosition) {
        genomeVariantsAtThisPosition.push(genomeVariants.shift())
      }

      exomeVariantsAtThisPosition.sort((v1, v2) => v1.variantId.localeCompare(v2.variantId))
      genomeVariantsAtThisPosition.sort((v1, v2) => v1.variantId.localeCompare(v2.variantId))

      while (exomeVariantsAtThisPosition.length || genomeVariantsAtThisPosition.length) {
        const currentExomeVariantAtThisPosition = exomeVariantsAtThisPosition[0]
        const currentGenomeVariantAtThisPosition = genomeVariantsAtThisPosition[0]

        if (currentGenomeVariantAtThisPosition === undefined) {
          mergedVariants.push(exomeVariantsAtThisPosition.shift())
        } else if (currentExomeVariantAtThisPosition === undefined) {
          mergedVariants.push(genomeVariantsAtThisPosition.shift())
        } else if (
          currentExomeVariantAtThisPosition.variantId.localeCompare(
            currentGenomeVariantAtThisPosition.variantId
          ) < 0
        ) {
          mergedVariants.push(exomeVariantsAtThisPosition.shift())
        } else if (
          currentExomeVariantAtThisPosition.variantId.localeCompare(
            currentGenomeVariantAtThisPosition.variantId
          ) > 0
        ) {
          mergedVariants.push(genomeVariantsAtThisPosition.shift())
        } else {
          mergedVariants.push({
            ...exomeVariantsAtThisPosition.shift(),
            //genome: genomeVariantsAtThisPosition.shift().genome,
            spark_genome: genomeVariantsAtThisPosition.shift().spark_genome,

          })
        }
      }
    }
  }
  
  return mergedVariants
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mergeExomeAndGenomeVariantSummaries);


/***/ }),

/***/ "./src/pcgc_schema/datasets/mergeMitoVariants.js":
/*!*******************************************************!*\
  !*** ./src/pcgc_schema/datasets/mergeMitoVariants.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const mergeExomeAndsscVariantsummaries = (sparkVariants, sscVariants) => {
  const mergedVariants = []

  
  while (sparkVariants.length || sscVariants.length) {
    const currentSparkVariant = sparkVariants[0]
    const currentSscVariant = sscVariants[0]

    if (currentSscVariant === undefined) {
      mergedVariants.push(sparkVariants.shift())
    } else if (currentSparkVariant === undefined) {
      mergedVariants.push(sscVariants.shift())
    } else if (currentSparkVariant.pos < currentSscVariant.pos) {
      mergedVariants.push(sparkVariants.shift())
    } else if (currentSscVariant.pos < currentSparkVariant.pos) {
      mergedVariants.push(sscVariants.shift())
    } else {
      const currentPosition = currentSparkVariant.pos

      const sparkVariantsAtThisPosition = []
      while (sparkVariants.length && sparkVariants[0].pos === currentPosition) {
        sparkVariantsAtThisPosition.push(sparkVariants.shift())
      }
      const sscVariantsAtThisPosition = []
      while (sscVariants.length && sscVariants[0].pos === currentPosition) {
        sscVariantsAtThisPosition.push(sscVariants.shift())
      }

      sparkVariantsAtThisPosition.sort((v1, v2) => v1.variantId.localeCompare(v2.variantId))
      sscVariantsAtThisPosition.sort((v1, v2) => v1.variantId.localeCompare(v2.variantId))

      while (sparkVariantsAtThisPosition.length || sscVariantsAtThisPosition.length) {
        const currentSparkVariantAtThisPosition = sparkVariantsAtThisPosition[0]
        const currentSscVariantAtThisPosition = sscVariantsAtThisPosition[0]

        if (currentSscVariantAtThisPosition === undefined) {
          mergedVariants.push(sparkVariantsAtThisPosition.shift())
        } else if (currentSparkVariantAtThisPosition === undefined) {
          mergedVariants.push(sscVariantsAtThisPosition.shift())
        } else if (
          currentSparkVariantAtThisPosition.variantId.localeCompare(
            currentSscVariantAtThisPosition.variantId
          ) < 0
        ) {
          mergedVariants.push(sparkVariantsAtThisPosition.shift())
        } else if (
          currentSparkVariantAtThisPosition.variantId.localeCompare(
            currentSscVariantAtThisPosition.variantId
          ) > 0
        ) {
          mergedVariants.push(sscVariantsAtThisPosition.shift())
        } else {
          mergedVariants.push({
            ...sparkVariantsAtThisPosition.shift(),
            //genome: sscVariantsAtThisPosition.shift().genome,
            ssc_genome: sscVariantsAtThisPosition.shift().ssc_genome,

          })
        }
      }
    }
  }
  
  return mergedVariants
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mergeExomeAndsscVariantsummaries);


/***/ }),

/***/ "./src/pcgc_schema/datasets/mergePcgcAndGnomadVariants.js":
/*!****************************************************************!*\
  !*** ./src/pcgc_schema/datasets/mergePcgcAndGnomadVariants.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const mergePcgcAndGnomadVariantSummaries = (pcgcVariants, gnomadVariants) => {
  const mergedVariants = []

  while (pcgcVariants.length) {
    const currentPcgcVariant = pcgcVariants[0]
    const currentGnomadVariant = gnomadVariants[0]

    if (currentGnomadVariant === undefined) {
      mergedVariants.push(pcgcVariants.shift())
    } 
    else if (currentPcgcVariant === undefined) {
      //mergedVariants.push(genomeVariants.shift())
      gnomadVariants.shift()

    } 
    else if (currentPcgcVariant.pos < currentGnomadVariant.pos) {
      mergedVariants.push(pcgcVariants.shift())
    } 
    else if (currentGnomadVariant.pos < currentPcgcVariant.pos) {
      gnomadVariants.shift()      
      //mergedVariants.push(genomeVariants.shift())
    } 

    else {
      const currentPosition = currentPcgcVariant.pos

      const pcgcVariantsAtThisPosition = []
      
      while (pcgcVariants.length && pcgcVariants[0].pos === currentPosition) {
        pcgcVariantsAtThisPosition.push(pcgcVariants.shift())
      }
      const gnomadVariantsAtThisPosition = []
      
      while (gnomadVariants.length && gnomadVariants[0].pos === currentPosition) {
        gnomadVariantsAtThisPosition.push(gnomadVariants.shift())
      }

      pcgcVariantsAtThisPosition.sort((v1, v2) => v1.variantId.localeCompare(v2.variantId))
      gnomadVariantsAtThisPosition.sort((v1, v2) => v1.variantId.localeCompare(v2.variantId))

      while (pcgcVariantsAtThisPosition.length || gnomadVariantsAtThisPosition.length) {
        const currentPcgcVariantAtThisPosition = pcgcVariantsAtThisPosition[0]
        const currentGnomadVariantAtThisPosition = gnomadVariantsAtThisPosition[0]

        if (currentGnomadVariantAtThisPosition === undefined) {
          mergedVariants.push(pcgcVariantsAtThisPosition.shift())
        } 
        else if (currentPcgcVariantAtThisPosition === undefined) {
          //mergedVariants.push(genomeVariantsAtThisPosition.shift())
          gnomadVariantsAtThisPosition.shift()
        } 
        else if (currentPcgcVariantAtThisPosition.variantId.localeCompare(currentGnomadVariantAtThisPosition.variantId) < 0) {
          mergedVariants.push(pcgcVariantsAtThisPosition.shift())
        } 
        else if (currentPcgcVariantAtThisPosition.variantId.localeCompare(currentGnomadVariantAtThisPosition.variantId) > 0) {
          //mergedVariants.push(genomeVariantsAtThisPosition.shift())
          gnomadVariantsAtThisPosition.shift()
        } 
        else {
          const tmp_gnomad = gnomadVariantsAtThisPosition.shift()
          const tmp_push = pcgcVariantsAtThisPosition.shift()
          

          if(tmp_gnomad.exome){
            tmp_push.ac_gnomad += tmp_gnomad.exome.ac
            tmp_push.an_gnomad += tmp_gnomad.exome.an
            //console.log(tmp_push.variantId)
            //console.log(tmp_gnomad.exome.ac)
            //console.log(tmp_push.exome.ac_gnomad)
            //console.log(tmp_push)
          }

          if(tmp_gnomad.genome){
            tmp_push.ac_gnomad += tmp_gnomad.genome.ac
            tmp_push.an_gnomad += tmp_gnomad.genome.an
            //console.log(tmp_push.variantId)
            //console.log(tmp_gnomad.exome.ac)
            //console.log(tmp_push.exome.ac_gnomad)
            //console.log(tmp_push)
          }

          // take rsid from gnomAD
          if(tmp_gnomad.rsid){
            tmp_push.rsid = tmp_gnomad.rsid
          }

          mergedVariants.push(tmp_push)

          /*
          mergedVariants.push({
            ...pcgcVariantsAtThisPosition.shift(),
            //gnomad_ac: gnomadVariantsAtThisPosition.shift().exome.ac,
          })*/
        }
      }
    }
  }


  /* 
  while (exomeVariants.length || genomeVariants.length) {
    const currentExomeVariant = exomeVariants[0]
    const currentGenomeVariant = genomeVariants[0]

    if (currentGenomeVariant === undefined) {
      mergedVariants.push(exomeVariants.shift())
    } else if (currentExomeVariant === undefined) {
      mergedVariants.push(genomeVariants.shift())
    } else if (currentExomeVariant.pos < currentGenomeVariant.pos) {
      mergedVariants.push(exomeVariants.shift())
    } else if (currentGenomeVariant.pos < currentExomeVariant.pos) {
      mergedVariants.push(genomeVariants.shift())
    } else {
      const currentPosition = currentExomeVariant.pos

      const exomeVariantsAtThisPosition = []
      while (exomeVariants.length && exomeVariants[0].pos === currentPosition) {
        exomeVariantsAtThisPosition.push(exomeVariants.shift())
      }
      const genomeVariantsAtThisPosition = []
      while (genomeVariants.length && genomeVariants[0].pos === currentPosition) {
        genomeVariantsAtThisPosition.push(genomeVariants.shift())
      }

      exomeVariantsAtThisPosition.sort((v1, v2) => v1.variantId.localeCompare(v2.variantId))
      genomeVariantsAtThisPosition.sort((v1, v2) => v1.variantId.localeCompare(v2.variantId))

      while (exomeVariantsAtThisPosition.length || genomeVariantsAtThisPosition.length) {
        const currentExomeVariantAtThisPosition = exomeVariantsAtThisPosition[0]
        const currentGenomeVariantAtThisPosition = genomeVariantsAtThisPosition[0]

        if (currentGenomeVariantAtThisPosition === undefined) {
          mergedVariants.push(exomeVariantsAtThisPosition.shift())
        } else if (currentExomeVariantAtThisPosition === undefined) {
          mergedVariants.push(genomeVariantsAtThisPosition.shift())
        } else if (
          currentExomeVariantAtThisPosition.variantId.localeCompare(
            currentGenomeVariantAtThisPosition.variantId
          ) < 0
        ) {
          mergedVariants.push(exomeVariantsAtThisPosition.shift())
        } else if (
          currentExomeVariantAtThisPosition.variantId.localeCompare(
            currentGenomeVariantAtThisPosition.variantId
          ) > 0
        ) {
          mergedVariants.push(genomeVariantsAtThisPosition.shift())
        } else {
          mergedVariants.push({
            ...exomeVariantsAtThisPosition.shift(),
            genome: genomeVariantsAtThisPosition.shift().genome,
          })
        }
      }
    }
  }
  */
  return mergedVariants
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mergePcgcAndGnomadVariantSummaries);


/***/ }),

/***/ "./src/pcgc_schema/datasets/mergeSSCVariants.js":
/*!******************************************************!*\
  !*** ./src/pcgc_schema/datasets/mergeSSCVariants.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const mergeSSCVariants = (exomeVariants, genomeVariants) => {
  const mergedVariants = []

  
  while (exomeVariants.length || genomeVariants.length) {
    const currentExomeVariant = exomeVariants[0]
    const currentGenomeVariant = genomeVariants[0]

    if (currentGenomeVariant === undefined) {
      mergedVariants.push(exomeVariants.shift())
    } else if (currentExomeVariant === undefined) {
      mergedVariants.push(genomeVariants.shift())
    } else if (currentExomeVariant.pos < currentGenomeVariant.pos) {
      mergedVariants.push(exomeVariants.shift())
    } else if (currentGenomeVariant.pos < currentExomeVariant.pos) {
      mergedVariants.push(genomeVariants.shift())
    } else {
      const currentPosition = currentExomeVariant.pos

      const exomeVariantsAtThisPosition = []
      while (exomeVariants.length && exomeVariants[0].pos === currentPosition) {
        exomeVariantsAtThisPosition.push(exomeVariants.shift())
      }
      const genomeVariantsAtThisPosition = []
      while (genomeVariants.length && genomeVariants[0].pos === currentPosition) {
        genomeVariantsAtThisPosition.push(genomeVariants.shift())
      }

      exomeVariantsAtThisPosition.sort((v1, v2) => v1.variantId.localeCompare(v2.variantId))
      genomeVariantsAtThisPosition.sort((v1, v2) => v1.variantId.localeCompare(v2.variantId))

      while (exomeVariantsAtThisPosition.length || genomeVariantsAtThisPosition.length) {
        const currentExomeVariantAtThisPosition = exomeVariantsAtThisPosition[0]
        const currentGenomeVariantAtThisPosition = genomeVariantsAtThisPosition[0]

        if (currentGenomeVariantAtThisPosition === undefined) {
          mergedVariants.push(exomeVariantsAtThisPosition.shift())
        } else if (currentExomeVariantAtThisPosition === undefined) {
          mergedVariants.push(genomeVariantsAtThisPosition.shift())
        } else if (
          currentExomeVariantAtThisPosition.variantId.localeCompare(
            currentGenomeVariantAtThisPosition.variantId
          ) < 0
        ) {
          mergedVariants.push(exomeVariantsAtThisPosition.shift())
        } else if (
          currentExomeVariantAtThisPosition.variantId.localeCompare(
            currentGenomeVariantAtThisPosition.variantId
          ) > 0
        ) {
          mergedVariants.push(genomeVariantsAtThisPosition.shift())
        } else {
          mergedVariants.push({
            ...exomeVariantsAtThisPosition.shift(),
            //genome: genomeVariantsAtThisPosition.shift().genome,
            ssc_genome: genomeVariantsAtThisPosition.shift().ssc_genome,

          })
        }
      }
    }
  }
  
  return mergedVariants
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mergeSSCVariants);


/***/ }),

/***/ "./src/pcgc_schema/datasets/rankedSVGeneConsequences.js":
/*!**************************************************************!*\
  !*** ./src/pcgc_schema/datasets/rankedSVGeneConsequences.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const rankedSVGeneConsequences = [
  'lof',
  'copy_gain',
  'dup_lof',
  'msv_exon_ovr',
  'dup_partial',
  'utr',
  'promoter',
  'inv_span',
  'intronic',
]

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (rankedSVGeneConsequences);


/***/ }),

/***/ "./src/pcgc_schema/datasets/shapeGnomadVariantSummary.js":
/*!***************************************************************!*\
  !*** ./src/pcgc_schema/datasets/shapeGnomadVariantSummary.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
//import POPULATIONS from './populations'

const POPULATIONS = ['afr', 'amr', 'eas', 'eur', 'oth', 'sas']


const getFlags = (variantData, transcriptConsequence) => {
  const flags = []

  if (variantData.flags.lcr) {
    flags.push('lcr')
  }

  if (variantData.flags.segdup) {
    flags.push('segdup')
  }

  if (variantData.flags.lof_flag) {
    flags.push('lof_flag')
  }

  // gnomAD 2.1 variants may have an LC LoF flag if they have some LoF category VEP anotations
  // on non-protein-coding transcripts. However, other transcript consequences will be sorted
  // above the non-coding consequences. Checking the displayed consequence's category here
  // prevents the case where an LC LoF flag will be shown next to a missense/synonymous/other
  // VEP annotation on the gene page.
  // See #364.
  const isLofOnNonCodingTranscript =
    transcriptConsequence.lof === 'NC' ||
    (transcriptConsequence.category === 'lof' && !transcriptConsequence.lof)
  if (
    variantData.flags.lc_lof &&
    transcriptConsequence.category === 'lof' &&
    !isLofOnNonCodingTranscript
  ) {
    flags.push('lc_lof')
  }

  // This flag isn't working properly
  /*
  if (isLofOnNonCodingTranscript) {
    flags.push('nc_transcript')
  }
  */

  return flags
}

const shapeGnomadVariantSummary = (context) => {
  
  let getConsequence
  switch (context.type) {
    case 'gene':
      getConsequence = variant =>
        (variant.sortedTranscriptConsequences || []).find(csq => csq.gene_id === context.geneId)
      break
    case 'region':
      getConsequence = variant => (variant.sortedTranscriptConsequences || [])[0]
      break
    case 'transcript':
      getConsequence = variant =>
        (variant.sortedTranscriptConsequences || []).find(
          csq => csq.transcript_id === context.transcriptId
        )
      break
    default:
      throw Error(`Invalid context for shapeGnomadVariantSummary: ${context.type}`)
  }
  

  // console.log("In function")
  return esHit => {
    // eslint-disable-next-line no-underscore-dangle
    const variantData = esHit._source
    // console.log(variantData)

    
    // eslint-disable-next-line no-underscore-dangle
    const isExomeVariant = esHit._index === 'spark_exomes'

    //const isExomeVariant = esHit._index === 'pcgc_exomes'

    /*
    const ac = variantData[subsetKey].AC_adj.total
    const an = variantData[subsetKey].AN_adj.total
    */
    const transcriptConsequence = getConsequence(variantData) || {}
    

    //console.log(variantData.AN_adj['eur'])
    const data_block = {
      
      //ac: variantData.AC_raw,
      //ac_hom: variantData.nhomalt_raw,
      //an: variantData.AN_raw,
      //af: variantData.AF_raw,        

      ac: variantData.AC,
      ac_hom: variantData.nhomalt,
      an: variantData.AN,
      af: variantData.AF,        
      
      ac_proband: variantData.AC_proband,
      an_proband: variantData.AN_proband,
      af_proband: variantData.AF_proband,

      filters: variantData.filters || [],
      populations: POPULATIONS.map(popId => ({
        id: popId.toUpperCase(),
        ac: variantData.AC_adj[popId] || 0,
        an: variantData.AN_adj[popId] || 0,
        //an: variantData.AN_adj[popId],

        //ac_hemi: variantData.nonpar ? (variantData[subsetKey].AC_adj[popId] || {}).male || 0 : 0,
        ac_hom: variantData.nhomalt_adj[popId] || 0,
      }))
    }

    return {
      // Variant ID fields
      alt: variantData.alt,
      chrom: variantData.chrom,
      pos: variantData.pos,
      ref: variantData.ref,
      variantId: variantData.variant_id,
      xpos: variantData.xpos,
      // Other fields
      
      consequence: transcriptConsequence.major_consequence,
      consequence_in_canonical_transcript: !!transcriptConsequence.canonical,
      flags: getFlags(variantData, transcriptConsequence),
      //flags: [],
      hgvs: transcriptConsequence.hgvs,
      hgvsc: transcriptConsequence.hgvsc ? transcriptConsequence.hgvsc.split(':')[1] : null,
      hgvsp: transcriptConsequence.hgvsp ? transcriptConsequence.hgvsp.split(':')[1] : null,
      rsid: variantData.rsid,
      ac_gnomad: 0,
      an_gnomad: 0,

      //bpkd_exome: esHit._index === 'bpkd_exomes' ? data_block : null,
      bpkd_exome: esHit._index === 'pkd_exomes' ? data_block : null,

      //spark_genome: esHit._index === 'spark_genomes' ? data_block : null,
      //spark_exome: esHit._index === 'spark_exomes' ? data_block : null,
      //ssc_genome: esHit._index === 'ssc_genomes' ? data_block : null,
      
      //spark_exome{
      //[isExomeVariant ? 'spark_genome' : 'spark_exome']: null,
      //[isExomeVariant ? 'spark_exome' : 'spark_genome']: {
      //[esHit._index === 'pcgc_exomes' ? 'spark_genome' : 'spark_exome']

      //[esHit._index === 'pcgc_exomes' ? 'spark_exome' : 'spark_genome'] : { 

      //exome: {
        /*
        ac: variantData.AC,
        ac_hom: variantData.nhomalt,
        an: variantData.AN,
        af: variantData.AF,
        */
        //ac_hemi: variantData.nonpar ? variantData[subsetKey].AC_adj.male : 0,
        //af: an ? ac / an : 0,

        /*
        ac: variantData.AC_raw,
        ac_hom: variantData.nhomalt_raw,
        an: variantData.AN_raw,
        af: variantData.AF_raw,        

        ac_proband: variantData.AC_proband,
        an_proband: variantData.AN_proband,
        af_proband: variantData.AF_proband,

        filters: variantData.filters || [],
        populations: POPULATIONS.map(popId => ({
          id: popId.toUpperCase(),
          ac: variantData.AC_adj[popId] || 0,
          an: variantData.AN_adj[popId] || 0,
          //an: variantData.AN_adj[popId],

          //ac_hemi: variantData.nonpar ? (variantData[subsetKey].AC_adj[popId] || {}).male || 0 : 0,
          ac_hom: variantData.nhomalt_adj[popId] || 0,
        })),
      },*/

    } //return

  }// return eHit

}// function

//sudo lsof -i -P -n | grep LISTEN
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (shapeGnomadVariantSummary);


/***/ }),

/***/ "./src/pcgc_schema/datasets/shapeMitoVariantSummary.js":
/*!*************************************************************!*\
  !*** ./src/pcgc_schema/datasets/shapeMitoVariantSummary.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
//import POPULATIONS from './populations'

const POPULATIONS = ['afr', 'amr', 'eas', 'eur', 'oth', 'sas']


const getFlags = (variantData, transcriptConsequence) => {
  const flags = []

  if (variantData.flags.lcr) {
    flags.push('lcr')
  }

  if (variantData.flags.segdup) {
    flags.push('segdup')
  }

  if (variantData.flags.lof_flag) {
    flags.push('lof_flag')
  }

  // gnomAD 2.1 variants may have an LC LoF flag if they have some LoF category VEP anotations
  // on non-protein-coding transcripts. However, other transcript consequences will be sorted
  // above the non-coding consequences. Checking the displayed consequence's category here
  // prevents the case where an LC LoF flag will be shown next to a missense/synonymous/other
  // VEP annotation on the gene page.
  // See #364.
  const isLofOnNonCodingTranscript =
    transcriptConsequence.lof === 'NC' ||
    (transcriptConsequence.category === 'lof' && !transcriptConsequence.lof)
  if (
    variantData.flags.lc_lof &&
    transcriptConsequence.category === 'lof' &&
    !isLofOnNonCodingTranscript
  ) {
    flags.push('lc_lof')
  }

  // This flag isn't working properly
  /*
  if (isLofOnNonCodingTranscript) {
    flags.push('nc_transcript')
  }
  */

  return flags
}

const shapeMitoVariantSummary = (context) => {
  
  let getConsequence
  switch (context.type) {
    case 'gene':
      getConsequence = variant =>
        (variant.sortedTranscriptConsequences || []).find(csq => csq.gene_id === context.geneId)
      break
    case 'region':
      getConsequence = variant => (variant.sortedTranscriptConsequences || [])[0]
      break
    case 'transcript':
      getConsequence = variant =>
        (variant.sortedTranscriptConsequences || []).find(
          csq => csq.transcript_id === context.transcriptId
        )
      break
    default:
      throw Error(`Invalid context for shapeGnomadVariantSummary: ${context.type}`)
  }
  

  // console.log("In function")
  return esHit => {
    // eslint-disable-next-line no-underscore-dangle
    const variantData = esHit._source
    // console.log(variantData)

    
    // eslint-disable-next-line no-underscore-dangle
    //const isExomeVariant = esHit._index === 'pcgc_exomes'

    /*
    const ac = variantData[subsetKey].AC_adj.total
    const an = variantData[subsetKey].AN_adj.total
    */
    const transcriptConsequence = getConsequence(variantData) || {}
    

    //console.log(variantData.AN_adj['eur'])
    
    const data_block = {
      ac: variantData.ac,
      ac_hom: variantData.ac_hom,
      ac_het: variantData.ac_het,
      an: variantData.an,
      af: variantData.af,
      max_heteroplasmy: variantData.max_heteroplasmy        

      //ac_proband: variantData.AC_proband,
      //an_proband: variantData.AN_proband,
      //af_proband: variantData.AF_proband,

      //filters: variantData.filters || [],
      /*
      populations: POPULATIONS.map(popId => ({
        id: popId.toUpperCase(),
        ac: variantData.AC_adj[popId] || 0,
        an: variantData.AN_adj[popId] || 0,
        //an: variantData.AN_adj[popId],

        //ac_hemi: variantData.nonpar ? (variantData[subsetKey].AC_adj[popId] || {}).male || 0 : 0,
        ac_hom: variantData.nhomalt_adj[popId] || 0,
      }))
      */
    }
    

    return {
      // Variant ID fields
      alt: variantData.alt,
      chrom: variantData.chrom,
      pos: variantData.pos,
      ref: variantData.ref,
      variantId: variantData.variant_id,
      xpos: variantData.xpos,
      // Other fields
      
      consequence: transcriptConsequence.major_consequence,
      consequence_in_canonical_transcript: !!transcriptConsequence.canonical,
      //flags: getFlags(variantData, transcriptConsequence),
      flags: [],
      hgvs: transcriptConsequence.hgvs,
      hgvsc: transcriptConsequence.hgvsc ? transcriptConsequence.hgvsc.split(':')[1] : null,
      hgvsp: transcriptConsequence.hgvsp ? transcriptConsequence.hgvsp.split(':')[1] : null,
      
      //rsid: variantData.rsid,
      //ac_gnomad: 0,
      //an_gnomad: 0,

      spark_genome: esHit._index === 'mito_test4' ? data_block : null,
      ssc_genome: esHit._index === 'ssc_mito' ? data_block : null,


    } //return

  }// return eHit

}// function

//sudo lsof -i -P -n | grep LISTEN
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (shapeMitoVariantSummary);


/***/ }),

/***/ "./src/pcgc_schema/datasets/transcriptConsequence.js":
/*!***********************************************************!*\
  !*** ./src/pcgc_schema/datasets/transcriptConsequence.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TranscriptConsequenceType": () => (/* binding */ TranscriptConsequenceType)
/* harmony export */ });
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_0__);



const TranscriptConsequenceType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'TranscriptConsequence',
  fields: {
    amino_acids: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    biotype: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    canonical: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLBoolean },
    category: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    cdna_start: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    cdna_end: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    codons: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    consequence_terms: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    domains: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    gene_id: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    gene_symbol: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    gene_symbol_source: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    hgvs: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    hgvsc: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    hgvsp: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    lof: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    lof_flags: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    lof_filter: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    lof_info: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    major_consequence: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    major_consequence_rank: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    polyphen_prediction: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    protein_id: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    sift_prediction: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    transcript_id: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
  },
})


/***/ }),

/***/ "./src/pcgc_schema/errors.js":
/*!***********************************!*\
  !*** ./src/pcgc_schema/errors.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UserVisibleError": () => (/* binding */ UserVisibleError)
/* harmony export */ });
class UserVisibleError extends Error {
  constructor(...args) {
    super(...args)
    this.name = 'UserVisibleError'
    this.extensions = {
      isUserVisible: true,
    }
  }
}


/***/ }),

/***/ "./src/pcgc_schema/index.js":
/*!**********************************!*\
  !*** ./src/pcgc_schema/index.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities_variant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utilities/variant */ "./src/utilities/variant.js");
/* harmony import */ var _datasets_fetchGnomadStructuralVariantDetails__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./datasets/fetchGnomadStructuralVariantDetails */ "./src/pcgc_schema/datasets/fetchGnomadStructuralVariantDetails.js");
/* harmony import */ var _datasets_GnomadStructuralVariantDetailsType__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./datasets/GnomadStructuralVariantDetailsType */ "./src/pcgc_schema/datasets/GnomadStructuralVariantDetailsType.js");
/* harmony import */ var _types_gene__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./types/gene */ "./src/pcgc_schema/types/gene.js");
/* harmony import */ var _types_transcript__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./types/transcript */ "./src/pcgc_schema/types/transcript.js");
/* harmony import */ var _types_mito_gene__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./types/mito_gene */ "./src/pcgc_schema/types/mito_gene.js");
/* harmony import */ var _types_region__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./types/region */ "./src/pcgc_schema/types/region.js");
/* harmony import */ var _types_search__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./types/search */ "./src/pcgc_schema/types/search.js");
/* harmony import */ var _types_variant__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./types/variant */ "./src/pcgc_schema/types/variant.js");
/* harmony import */ var _types_mito_variant__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./types/mito_variant */ "./src/pcgc_schema/types/mito_variant.js");
/* harmony import */ var _datasets_fetchVariantDetails__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./datasets/fetchVariantDetails */ "./src/pcgc_schema/datasets/fetchVariantDetails.js");
/* harmony import */ var _datasets_fetchMitoVariantDetails__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./datasets/fetchMitoVariantDetails */ "./src/pcgc_schema/datasets/fetchMitoVariantDetails.js");
/* harmony import */ var _datasets_VariantDetailsType__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./datasets/VariantDetailsType */ "./src/pcgc_schema/datasets/VariantDetailsType.js");
/* harmony import */ var _datasets_MitoVariantDetailsType__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./datasets/MitoVariantDetailsType */ "./src/pcgc_schema/datasets/MitoVariantDetailsType.js");





/*
import { AggregateQualityMetricsType } from './datasets/aggregateQualityMetrics'
import {
  MultiNucleotideVariantDetailsType,
  fetchGnomadMNVDetails,
} from './datasets/gnomad_r2_1/gnomadMultiNucleotideVariants'

import fetchGnomadStructuralVariantDetails from './datasets/gnomad_sv_r2/fetchGnomadStructuralVariantDetails'
import GnomadStructuralVariantDetailsType from './datasets/gnomad_sv_r2/GnomadStructuralVariantDetailsType'

*/
















//import { datasetArgumentTypeForMethod } from './datasets/datasetArgumentTypes'
//import datasetsConfig, { datasetSpecificTypes } from './datasets/datasetsConfig'








const rootType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'Root',
  description: `
The fields below allow for different ways to look up PCGC data. Click on the the Gene, Variant, or Region types to see more information.
  `,
  fields: () => ({
/*
    aggregateQualityMetrics: {
      type: AggregateQualityMetricsType,
      args: {
        dataset: { type: datasetArgumentTypeForMethod('fetchAggregateQualityMetrics') },
      },
      resolve: (obj, args, ctx) => {
        const fetchAggregateQualityMetrics =
          datasetsConfig[args.dataset].fetchAggregateQualityMetrics
        return fetchAggregateQualityMetrics(ctx)
      },
    },
*/    
    gene: {
      description: 'Look up variant data by gene name. Example: ACTA1.',
      type: _types_gene__WEBPACK_IMPORTED_MODULE_4__["default"],
      args: {
        gene_name: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
        gene_id: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
        filter: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
      },
      resolve: (obj, args, ctx) => {
        if (args.gene_name) {
          return (0,_types_gene__WEBPACK_IMPORTED_MODULE_4__.lookupGeneByName)(ctx.database.gnomad, args.gene_name)
        }
        if (args.gene_id) {
          return (0,_types_gene__WEBPACK_IMPORTED_MODULE_4__.lookupGeneByGeneId)(ctx.database.gnomad, args.gene_id)
        }
        return 'No lookup found'
      },
    },

    mito_gene: {
      description: 'Look up variant data by mitochondrial gene name. Example: MT-CO1.',
      type: _types_mito_gene__WEBPACK_IMPORTED_MODULE_6__["default"],
      args: {
        gene_name: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
        gene_id: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
        filter: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
      },
      resolve: (obj, args, ctx) => {
        if (args.gene_name) {
          return (0,_types_gene__WEBPACK_IMPORTED_MODULE_4__.lookupGeneByName)(ctx.database.gnomad, args.gene_name)
        }
        if (args.gene_id) {
          return (0,_types_gene__WEBPACK_IMPORTED_MODULE_4__.lookupGeneByGeneId)(ctx.database.gnomad, args.gene_id)
        }
        return 'No lookup found'
      },
    },


    transcript: {
      description: 'Look up variant data by transcript ID. Example: ENST00000407236.',
      type: _types_transcript__WEBPACK_IMPORTED_MODULE_5__["default"],
      args: {
        transcript_id: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
      },
      resolve: (obj, args, ctx) => {
        return (0,_types_transcript__WEBPACK_IMPORTED_MODULE_5__.lookupTranscriptsByTranscriptId)(ctx.database.gnomad, args.transcript_id)
      },
    },
    /*
    multiNucleotideVariant: {
      type: MultiNucleotideVariantDetailsType,
      args: {
        variantId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (obj, args, ctx) => fetchGnomadMNVDetails(ctx, args.variantId),
    },
    */

    region: {
      description: 'Look up data by start/stop. Example: (start: 55505222, stop: 55505300, chrom: 1).',
      type: _types_region__WEBPACK_IMPORTED_MODULE_7__["default"],
      args: {
        start: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
        stop: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
        chrom: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
      },
      resolve: (obj, args) => ({
        start: args.start,
        stop: args.stop,
        chrom: args.chrom,
        xstart: (0,_utilities_variant__WEBPACK_IMPORTED_MODULE_1__.getXpos)(args.chrom, args.start),
        xstop: (0,_utilities_variant__WEBPACK_IMPORTED_MODULE_1__.getXpos)(args.chrom, args.stop),
        regionSize: args.stop - args.start,
      }),
    },

    searchResults: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(_types_search__WEBPACK_IMPORTED_MODULE_8__.SearchResultType),
      args: {
        query: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
      },
      resolve: (obj, args, ctx) => (0,_types_search__WEBPACK_IMPORTED_MODULE_8__.resolveSearchResults)(ctx, args.query),
    },

    
    structural_variant: {
      type: _datasets_GnomadStructuralVariantDetailsType__WEBPACK_IMPORTED_MODULE_3__["default"],
      args: {
        variantId: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
      },
      resolve: (obj, args, ctx) => (0,_datasets_fetchGnomadStructuralVariantDetails__WEBPACK_IMPORTED_MODULE_2__["default"])(ctx, args.variantId),
    },
    
    
    variant: {
      description: 'Look up a single variant or rsid. Example: 1-55516888-G-GA.',
      type: _types_variant__WEBPACK_IMPORTED_MODULE_9__.VariantInterface,
      args: {
        // dataset: { type: datasetArgumentTypeForMethod('fetchVariantDetails') },
        variantId: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
      },
      resolve: (obj, args, ctx) => {
        //const { dataset, variantId } = args
        //const fetchVariantDetails = datasetsConfig[dataset].fetchVariantDetails
        return (0,_datasets_fetchVariantDetails__WEBPACK_IMPORTED_MODULE_11__["default"])(ctx, args.variantId)
      },
    },

    mito_variant: {
      description: 'Look up a single variant or rsid. Example: 1-55516888-G-GA.',
      type: _types_mito_variant__WEBPACK_IMPORTED_MODULE_10__.MitoVariantInterface,
      args: {
        // dataset: { type: datasetArgumentTypeForMethod('fetchVariantDetails') },
        variantId: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
      },
      resolve: (obj, args, ctx) => {
        //const { dataset, variantId } = args
        //const fetchVariantDetails = datasetsConfig[dataset].fetchVariantDetails
        return (0,_datasets_fetchMitoVariantDetails__WEBPACK_IMPORTED_MODULE_12__["default"])(ctx, args.variantId)
      },
    },


    
  }),
})

const Schema = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLSchema({
  query: rootType,
  types: [_datasets_VariantDetailsType__WEBPACK_IMPORTED_MODULE_13__["default"], _datasets_MitoVariantDetailsType__WEBPACK_IMPORTED_MODULE_14__["default"]],
  //types: datasetSpecificTypes,
})

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Schema);


/***/ }),

/***/ "./src/pcgc_schema/types/exon.js":
/*!***************************************!*\
  !*** ./src/pcgc_schema/types/exon.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "lookupExonsByGeneId": () => (/* binding */ lookupExonsByGeneId),
/* harmony export */   "lookupExonsByStartStop": () => (/* binding */ lookupExonsByStartStop),
/* harmony export */   "lookupExonsByTranscriptId": () => (/* binding */ lookupExonsByTranscriptId)
/* harmony export */ });
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_0__);
/* eslint-disable camelcase */
/* eslint-disable quote-props */



const exonType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'Exon',
  fields: () => ({
    _id: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    start: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    transcript_id: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    feature_type: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    strand: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    stop: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    chrom: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    gene_id: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
  }),
})

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (exonType);


const lookupExonsByTranscriptId = (db, transcript_id) =>
  db.collection('exons').find({ transcript_id }).toArray()

const lookupExonsByStartStop = (db, start, stop) =>
  db.collection('exons').find({ start: { '$gte': Number(start), '$lte': Number(stop) } }).toArray()

const lookupExonsByGeneId = (db, gene_id) =>
  db.collection('exons').find({ gene_id }).toArray()


/***/ }),

/***/ "./src/pcgc_schema/types/gene.js":
/*!***************************************!*\
  !*** ./src/pcgc_schema/types/gene.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "fetchGenesByInterval": () => (/* binding */ fetchGenesByInterval),
/* harmony export */   "lookupGeneByGeneId": () => (/* binding */ lookupGeneByGeneId),
/* harmony export */   "lookupGeneByName": () => (/* binding */ lookupGeneByName)
/* harmony export */ });
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities_redis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utilities/redis */ "./src/utilities/redis.js");
/* harmony import */ var _datasets_fetchGnomadStructuralVariantsByGene__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../datasets/fetchGnomadStructuralVariantsByGene */ "./src/pcgc_schema/datasets/fetchGnomadStructuralVariantsByGene.js");
/* harmony import */ var _structuralVariant__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./structuralVariant */ "./src/pcgc_schema/types/structuralVariant.js");
/* harmony import */ var _datasets_clinvar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../datasets/clinvar */ "./src/pcgc_schema/datasets/clinvar.js");
/* harmony import */ var _transcript__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./transcript */ "./src/pcgc_schema/types/transcript.js");
/* harmony import */ var _exon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./exon */ "./src/pcgc_schema/types/exon.js");
/* harmony import */ var _variant__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./variant */ "./src/pcgc_schema/types/variant.js");
/* harmony import */ var _datasets_fetchVariantsByGene__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../datasets/fetchVariantsByGene */ "./src/pcgc_schema/datasets/fetchVariantsByGene.js");
/* eslint-disable camelcase */





/*
import { datasetArgumentTypeForMethod } from '../datasets/datasetArgumentTypes'
import datasetsConfig from '../datasets/datasetsConfig'
import fetchGnomadStructuralVariantsByGene from '../datasets/gnomad_sv_r2/fetchGnomadStructuralVariantsByGene'
*/





// import { UserVisibleError } from '../errors'






/*
import constraintType, { lookUpConstraintByTranscriptId } from './constraint'

import { PextRegionType, fetchPextRegionsByGene } from './pext'
import {
  RegionalMissenseConstraintRegionType,
  fetchExacRegionalMissenseConstraintRegions,
} from './regionalConstraint'

*/





const geneType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'Gene',
  fields: () => ({
    _id: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    omim_description: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    gene_id: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    omim_accession: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    chrom: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    strand: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    full_gene_name: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    gene_name_upper: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    other_names: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    canonical_transcript: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    start: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    stop: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    xstop: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    xstart: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    gene_name: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    composite_transcript: {
      type: _transcript__WEBPACK_IMPORTED_MODULE_5__.CompositeTranscriptType,
      resolve: (obj, args, ctx) => (0,_transcript__WEBPACK_IMPORTED_MODULE_5__.fetchCompositeTranscriptByGene)(ctx, obj),
    },
    
    clinvar_variants: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(_datasets_clinvar__WEBPACK_IMPORTED_MODULE_4__.ClinvarVariantType),
      args: {
        transcriptId: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
      },
      resolve: (obj, args, ctx) => {
        return args.transcriptId
          ? (0,_datasets_clinvar__WEBPACK_IMPORTED_MODULE_4__.fetchClinvarVariantsInTranscript)(args.transcriptId, ctx)
          : (0,_datasets_clinvar__WEBPACK_IMPORTED_MODULE_4__.fetchClinvarVariantsInGene)(obj.gene_id, ctx)
      },
    },
    /*
    pext: {
      type: new GraphQLList(PextRegionType),
      resolve: (obj, args, ctx) => fetchPextRegionsByGene(ctx, obj.gene_id),
    },*/
    transcript: {
      type: _transcript__WEBPACK_IMPORTED_MODULE_5__["default"],
      resolve: (obj, args, ctx) =>
        (0,_transcript__WEBPACK_IMPORTED_MODULE_5__.lookupTranscriptsByTranscriptId)(ctx.database.gnomad, obj.canonical_transcript, obj.gene_name),
    },
    transcripts: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(_transcript__WEBPACK_IMPORTED_MODULE_5__["default"]),
      resolve: (obj, args, ctx) =>
        (0,_transcript__WEBPACK_IMPORTED_MODULE_5__.lookupAllTranscriptsByGeneId)(ctx.database.gnomad, obj.gene_id),
    },
    exons: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(_exon__WEBPACK_IMPORTED_MODULE_6__["default"]),
      resolve: (obj, args, ctx) => (0,_exon__WEBPACK_IMPORTED_MODULE_6__.lookupExonsByGeneId)(ctx.database.gnomad, obj.gene_id),
    },
    /*
    exacv1_constraint: {
      type: constraintType,
      resolve: (obj, args, ctx) =>
        lookUpConstraintByTranscriptId(ctx.database.gnomad, obj.canonical_transcript),
    },
    exac_regional_missense_constraint_regions: {
      type: new GraphQLList(RegionalMissenseConstraintRegionType),
      resolve: (obj, args, ctx) => fetchExacRegionalMissenseConstraintRegions(ctx, obj.gene_name),
    },
    */
    structural_variants: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(_structuralVariant__WEBPACK_IMPORTED_MODULE_3__.StructuralVariantSummaryType),
      resolve: async (obj, args, ctx) => (0,_datasets_fetchGnomadStructuralVariantsByGene__WEBPACK_IMPORTED_MODULE_2__["default"])(ctx, obj),
    },
    
    variants: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(_variant__WEBPACK_IMPORTED_MODULE_7__.VariantSummaryType),
      args: {
        //dataset: { type: datasetArgumentTypeForMethod('fetchVariantsByGene') },
        transcriptId: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
      },
      resolve: (obj, args, ctx) => {

        /*
        if (args.transcriptId) {
          const fetchVariantsByTranscript = datasetsConfig[args.dataset].fetchVariantsByTranscript
          return fetchVariantsByTranscript(ctx, args.transcriptId, obj)
        }
        */

        console.log(obj.gene_id)
        console.log(obj.chrom)
        //const fetchVariantsByGene = datasetsConfig[args.dataset].fetchVariantsByGene

        
        return (0,_utilities_redis__WEBPACK_IMPORTED_MODULE_1__.withCache)(ctx, `gene_cache:${obj.gene_id}`, async () => {
          return (0,_datasets_fetchVariantsByGene__WEBPACK_IMPORTED_MODULE_8__["default"])(ctx, obj.gene_id, obj.canonical_transcript)
        })
        

        //return fetchVariantsByGene(ctx, obj.gene_id, obj.canonical_transcript)
      },
    },
  }),
})

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (geneType);

const lookupGeneByGeneId = (db, gene_id) =>
  db.collection('genes').findOne({ gene_id })

const lookupGeneByName = async (db, geneName) => {
  const gene = await db.collection('genes').findOne({ gene_name_upper: geneName.toUpperCase() })
  if (!gene) {
    throw new UserVisibleError('Gene not found')
  }
  return gene
}

const fetchGenesByInterval = (ctx, { xstart, xstop }) =>
  ctx.database.gnomad
    .collection('genes')
    .find({ $and: [{ xstart: { $lte: xstop } }, { xstop: { $gte: xstart } }] })
    .toArray()


/***/ }),

/***/ "./src/pcgc_schema/types/gtex.js":
/*!***************************************!*\
  !*** ./src/pcgc_schema/types/gtex.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GtexTissueExpressionsType": () => (/* binding */ GtexTissueExpressionsType),
/* harmony export */   "fetchGtexTissueExpressionsByTranscript": () => (/* binding */ fetchGtexTissueExpressionsByTranscript)
/* harmony export */ });
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_0__);


const GtexTissueExpressionsType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'GtexTissueExpressions',
  fields: {
    adiposeSubcutaneous: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    adiposeVisceralOmentum: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    adrenalGland: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    arteryAorta: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    arteryCoronary: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    arteryTibial: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    bladder: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    brainAmygdala: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    brainAnteriorcingulatecortexBa24: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    brainCaudateBasalganglia: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    brainCerebellarhemisphere: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    brainCerebellum: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    brainCortex: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    brainFrontalcortexBa9: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    brainHippocampus: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    brainHypothalamus: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    brainNucleusaccumbensBasalganglia: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    brainPutamenBasalganglia: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    brainSpinalcordCervicalc1: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    brainSubstantianigra: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    breastMammarytissue: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    cellsEbvTransformedlymphocytes: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    cellsTransformedfibroblasts: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    cervixEctocervix: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    cervixEndocervix: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    colonSigmoid: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    colonTransverse: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    esophagusGastroesophagealjunction: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    esophagusMucosa: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    esophagusMuscularis: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    fallopianTube: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    heartAtrialappendage: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    heartLeftventricle: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    kidneyCortex: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    liver: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    lung: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    minorSalivaryGland: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    muscleSkeletal: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    nerveTibial: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    ovary: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    pancreas: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    pituitary: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    prostate: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    skinNotsunexposedSuprapubic: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    skinSunexposedLowerleg: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    smallIntestineTerminalileum: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    spleen: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    stomach: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    testis: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    thyroid: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    uterus: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    vagina: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    wholeBlood: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    transcriptId: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    geneId: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
  },
})

const fetchGtexTissueExpressionsByTranscript = async (ctx, transcriptId) => {

  transcriptId = transcriptId.concat("*")
  // query: "ENST00000342665*"


  const response = await ctx.database.elastic.search({
    index: 'gtex_tissue_tpms_by_transcript',
    //type: 'tissue_tpms',
    size: 1,
    body: {
        query : {
            query_string: {
                default_field: 'transcriptId',
                query: transcriptId
            }
        }
    },
  })

  //console.log(transcriptId)
/*
  const response = await ctx.database.elastic.search({
    index: 'gtex_tissue_tpms_by_transcript',
    type: 'tissue_tpms',
    size: 1,
    body: {
      query: {
        bool: {
          filter: {
            term: { transcriptId },
          },
        },
      },
    },
  })
*/

  const doc = response.hits.hits[0]
  //console.log(doc)

  return doc ? doc._source : null // eslint-disable-line no-underscore-dangle
}


/***/ }),

/***/ "./src/pcgc_schema/types/mito_gene.js":
/*!********************************************!*\
  !*** ./src/pcgc_schema/types/mito_gene.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _datasets_fetchGnomadStructuralVariantsByGene__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../datasets/fetchGnomadStructuralVariantsByGene */ "./src/pcgc_schema/datasets/fetchGnomadStructuralVariantsByGene.js");
/* harmony import */ var _structuralVariant__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./structuralVariant */ "./src/pcgc_schema/types/structuralVariant.js");
/* harmony import */ var _datasets_clinvar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../datasets/clinvar */ "./src/pcgc_schema/datasets/clinvar.js");
/* harmony import */ var _transcript__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./transcript */ "./src/pcgc_schema/types/transcript.js");
/* harmony import */ var _exon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./exon */ "./src/pcgc_schema/types/exon.js");
/* harmony import */ var _mito_variant__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./mito_variant */ "./src/pcgc_schema/types/mito_variant.js");
/* harmony import */ var _datasets_fetchMitoVariantsByGene__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../datasets/fetchMitoVariantsByGene */ "./src/pcgc_schema/datasets/fetchMitoVariantsByGene.js");
/* eslint-disable camelcase */




/*
import { datasetArgumentTypeForMethod } from '../datasets/datasetArgumentTypes'
import datasetsConfig from '../datasets/datasetsConfig'
import fetchGnomadStructuralVariantsByGene from '../datasets/gnomad_sv_r2/fetchGnomadStructuralVariantsByGene'
*/





// import { UserVisibleError } from '../errors'






/*
import constraintType, { lookUpConstraintByTranscriptId } from './constraint'

import { PextRegionType, fetchPextRegionsByGene } from './pext'
import {
  RegionalMissenseConstraintRegionType,
  fetchExacRegionalMissenseConstraintRegions,
} from './regionalConstraint'

*/





const mitoGeneType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'MitoGene',
  fields: () => ({
    _id: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    omim_description: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    gene_id: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    omim_accession: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    chrom: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    strand: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    full_gene_name: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    gene_name_upper: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    other_names: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    canonical_transcript: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    start: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    stop: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    xstop: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    xstart: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    gene_name: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    composite_transcript: {
      type: _transcript__WEBPACK_IMPORTED_MODULE_4__.CompositeTranscriptType,
      resolve: (obj, args, ctx) => (0,_transcript__WEBPACK_IMPORTED_MODULE_4__.fetchCompositeTranscriptByGene)(ctx, obj),
    },
    
    clinvar_variants: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(_datasets_clinvar__WEBPACK_IMPORTED_MODULE_3__.ClinvarVariantType),
      args: {
        transcriptId: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
      },
      resolve: (obj, args, ctx) => {
        return args.transcriptId
          ? (0,_datasets_clinvar__WEBPACK_IMPORTED_MODULE_3__.fetchClinvarVariantsInTranscript)(args.transcriptId, ctx)
          : (0,_datasets_clinvar__WEBPACK_IMPORTED_MODULE_3__.fetchClinvarVariantsInGene)(obj.gene_id, ctx)
      },
    },
    /*
    pext: {
      type: new GraphQLList(PextRegionType),
      resolve: (obj, args, ctx) => fetchPextRegionsByGene(ctx, obj.gene_id),
    },*/
    transcript: {
      type: _transcript__WEBPACK_IMPORTED_MODULE_4__["default"],
      resolve: (obj, args, ctx) =>
        (0,_transcript__WEBPACK_IMPORTED_MODULE_4__.lookupTranscriptsByTranscriptId)(ctx.database.gnomad, obj.canonical_transcript, obj.gene_name),
    },
    transcripts: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(_transcript__WEBPACK_IMPORTED_MODULE_4__["default"]),
      resolve: (obj, args, ctx) =>
        (0,_transcript__WEBPACK_IMPORTED_MODULE_4__.lookupAllTranscriptsByGeneId)(ctx.database.gnomad, obj.gene_id),
    },
    exons: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(_exon__WEBPACK_IMPORTED_MODULE_5__["default"]),
      resolve: (obj, args, ctx) => (0,_exon__WEBPACK_IMPORTED_MODULE_5__.lookupExonsByGeneId)(ctx.database.gnomad, obj.gene_id),
    },
    /*
    exacv1_constraint: {
      type: constraintType,
      resolve: (obj, args, ctx) =>
        lookUpConstraintByTranscriptId(ctx.database.gnomad, obj.canonical_transcript),
    },
    exac_regional_missense_constraint_regions: {
      type: new GraphQLList(RegionalMissenseConstraintRegionType),
      resolve: (obj, args, ctx) => fetchExacRegionalMissenseConstraintRegions(ctx, obj.gene_name),
    },
    */

    /*
    structural_variants: {
      type: new GraphQLList(StructuralVariantSummaryType),
      resolve: async (obj, args, ctx) => fetchGnomadStructuralVariantsByGene(ctx, obj),
    },
    */

    variants: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(_mito_variant__WEBPACK_IMPORTED_MODULE_6__.MitoVariantSummaryType),
      args: {
        //dataset: { type: datasetArgumentTypeForMethod('fetchVariantsByGene') },
        transcriptId: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
      },
      resolve: (obj, args, ctx) => {

        /*
        if (args.transcriptId) {
          const fetchVariantsByTranscript = datasetsConfig[args.dataset].fetchVariantsByTranscript
          return fetchVariantsByTranscript(ctx, args.transcriptId, obj)
        }
        */

        console.log(obj.gene_id)
        console.log(obj.chrom)
        //const fetchVariantsByGene = datasetsConfig[args.dataset].fetchVariantsByGene
        return (0,_datasets_fetchMitoVariantsByGene__WEBPACK_IMPORTED_MODULE_7__["default"])(ctx, obj.gene_id, obj.canonical_transcript)
      },
    },
  }),
})

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mitoGeneType);

/*
export const lookupGeneByGeneId = (db, gene_id) =>
  db.collection('genes').findOne({ gene_id })

export const lookupGeneByName = async (db, geneName) => {
  const gene = await db.collection('genes').findOne({ gene_name_upper: geneName.toUpperCase() })
  if (!gene) {
    throw new UserVisibleError('Gene not found')
  }
  return gene
}

export const fetchGenesByInterval = (ctx, { xstart, xstop }) =>
  ctx.database.gnomad
    .collection('genes')
    .find({ $and: [{ xstart: { $lte: xstop } }, { xstop: { $gte: xstart } }] })
    .toArray()
*/




/***/ }),

/***/ "./src/pcgc_schema/types/mito_variant.js":
/*!***********************************************!*\
  !*** ./src/pcgc_schema/types/mito_variant.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MitoVariantInterface": () => (/* binding */ MitoVariantInterface),
/* harmony export */   "MitoVariantSummaryType": () => (/* binding */ MitoVariantSummaryType)
/* harmony export */ });
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_0__);


const MitoVariantInterface = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInterfaceType({
  name: 'MitoVariant',
  fields: {
    alt: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    chrom: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    pos: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
    ref: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    variantId: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    xpos: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat) },
  },
})

const MitoVariantSequencingDataType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'MitoVariantSequencingData',
  fields: {
    ac: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    ac_het: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    ac_hom: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    an: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    af: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    max_heteroplasmy : { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    
    //ac_proband: { type: GraphQLInt },
    //an_proband: { type: GraphQLInt },
    //af_proband: { type: GraphQLFloat },
    
    filters: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    /*
    populations: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'VariantPopulations',
          fields: {
            id: { type: new GraphQLNonNull(GraphQLString) },
            ac: { type: new GraphQLNonNull(GraphQLInt) },
            an: { type: new GraphQLNonNull(GraphQLInt) },
            //ac_hemi: { type: new GraphQLNonNull(GraphQLInt) },
            ac_hom: { type: new GraphQLNonNull(GraphQLInt) },
          },
        })
      ),
    },
    */

  },
})


const MitoVariantSummaryType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'MitoVariantSummary',
  fields: {
    // Variant ID fields
    alt: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    chrom: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    pos: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
    ref: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    variantId: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    xpos: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat) },
    // Other fields
    consequence: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    consequence_in_canonical_transcript: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLBoolean },
    flags: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    hgvs: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    hgvsc: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    hgvsp: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    //rsid: { type: GraphQLString },

    //ac_gnomad: { type: GraphQLInt },
    //an_gnomad: { type: GraphQLInt },    

    // will keep with this name for future
    //spark_exome: { type: VariantSequencingDataType },
    spark_genome: { type: MitoVariantSequencingDataType },
    ssc_genome: { type: MitoVariantSequencingDataType },
    //ssc_genome: { type: VariantSequencingDataType },
    // genome: { type: VariantSequencingDataType },
  },
})


/***/ }),

/***/ "./src/pcgc_schema/types/region.js":
/*!*****************************************!*\
  !*** ./src/pcgc_schema/types/region.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../errors */ "./src/pcgc_schema/errors.js");
/* harmony import */ var _gene__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gene */ "./src/pcgc_schema/types/gene.js");
/* harmony import */ var _variant__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./variant */ "./src/pcgc_schema/types/variant.js");
/* harmony import */ var _datasets_countVariantsInRegion__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../datasets/countVariantsInRegion */ "./src/pcgc_schema/datasets/countVariantsInRegion.js");
/* harmony import */ var _datasets_fetchVariantsByRegion__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../datasets/fetchVariantsByRegion */ "./src/pcgc_schema/datasets/fetchVariantsByRegion.js");
/* harmony import */ var _structuralVariant__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./structuralVariant */ "./src/pcgc_schema/types/structuralVariant.js");
/* harmony import */ var _datasets_fetchGnomadStructuralVariantsByRegion__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../datasets/fetchGnomadStructuralVariantsByRegion */ "./src/pcgc_schema/datasets/fetchGnomadStructuralVariantsByRegion.js");


//import { datasetArgumentTypeForMethod, AnyDatasetArgumentType } from '../datasets/datasetArgumentTypes'
//import datasetsConfig from '../datasets/datasetsConfig'
//import coverageType, { fetchCoverageByRegion } from './coverage'











// Individual variants will only be returned if a region has fewer than this many variants
const FETCH_INDIVIDUAL_VARIANTS_LIMIT = 30000

const regionType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'Region',
  fields: () => ({
    start: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    stop: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    xstart: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    xstop: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    chrom: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    regionSize: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },

    genes: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(_gene__WEBPACK_IMPORTED_MODULE_2__["default"]),
      resolve: (obj, args, ctx) =>
        (0,_gene__WEBPACK_IMPORTED_MODULE_2__.fetchGenesByInterval)(ctx, {
          xstart: obj.xstart,
          xstop: obj.xstop,
        }),
    },
    
    /*
    exome_coverage: {
      type: new GraphQLList(coverageType),
      args: {
        dataset: { type: AnyDatasetArgumentType },
      },
      resolve: (obj, args, ctx) => {
        const { index, type } = datasetsConfig[args.dataset].exomeCoverageIndex
        if (!index) {
          return []
        }
        return fetchCoverageByRegion(ctx, {
          index,
          type,
          region: obj,
        })
      },
    },
    genome_coverage: {
      type: new GraphQLList(coverageType),
      args: {
        dataset: { type: AnyDatasetArgumentType },
      },
      resolve: (obj, args, ctx) => {
        const { index, type } = datasetsConfig[args.dataset].genomeCoverageIndex
        if (!index) {
          return []
        }
        return fetchCoverageByRegion(ctx, {
          index,
          type,
          region: obj,
        })
      },
    },
    */
    structural_variants: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(_structuralVariant__WEBPACK_IMPORTED_MODULE_6__.StructuralVariantSummaryType),
      resolve: async (obj, args, ctx) => (0,_datasets_fetchGnomadStructuralVariantsByRegion__WEBPACK_IMPORTED_MODULE_7__["default"])(ctx, obj),
    },
    
    
    
    variants: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(_variant__WEBPACK_IMPORTED_MODULE_3__.VariantSummaryType),
      /*
      args: {
        dataset: { type: datasetArgumentTypeForMethod('fetchVariantsByRegion') },
      },
      */
      resolve: async (obj, args, ctx) => {
        //const countVariantsInRegion = datasetsConfig[args.dataset].countVariantsInRegion
        //const fetchVariantsByRegion = datasetsConfig[args.dataset].fetchVariantsByRegion

        const numVariantsInRegion = await (0,_datasets_countVariantsInRegion__WEBPACK_IMPORTED_MODULE_4__["default"])(ctx, obj)

        if (numVariantsInRegion > FETCH_INDIVIDUAL_VARIANTS_LIMIT) {
          throw (0,_errors__WEBPACK_IMPORTED_MODULE_1__.UserVisibleError)(
            `Individual variants can only be returned for regions with fewer than ${FETCH_INDIVIDUAL_VARIANTS_LIMIT} variants`
          )
        }
        return (0,_datasets_fetchVariantsByRegion__WEBPACK_IMPORTED_MODULE_5__["default"])(ctx, obj)
      },
    },
    
  }),
})

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (regionType);


/***/ }),

/***/ "./src/pcgc_schema/types/search.js":
/*!*****************************************!*\
  !*** ./src/pcgc_schema/types/search.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SearchResultType": () => (/* binding */ SearchResultType),
/* harmony export */   "isRegionId": () => (/* binding */ isRegionId),
/* harmony export */   "isVariantId": () => (/* binding */ isVariantId),
/* harmony export */   "normalizeRegionId": () => (/* binding */ normalizeRegionId),
/* harmony export */   "normalizeVariantId": () => (/* binding */ normalizeVariantId),
/* harmony export */   "resolveSearchResults": () => (/* binding */ resolveSearchResults)
/* harmony export */ });
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);



const SearchResultType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'SearchResult',
  fields: {
    label: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    url: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
  },
})

const REGION_ID_REGEX = /^(chr)?(\d+|x|y|m|mt)[-:]([0-9]+)([-:]([0-9]+)?)?$/i

const isRegionId = str => {
  const match = REGION_ID_REGEX.exec(str)
  if (!match) {
    return false
  }

  const chrom = match[2].toLowerCase()
  const chromNumber = Number(chrom)
  if (!Number.isNaN(chromNumber) && (chromNumber < 1 || chromNumber > 22)) {
    return false
  }

  const start = match[3]
  const end = match[5]

  if (end && end < start) {
    return false
  }

  return true
}

const normalizeRegionId = regionId => {
  const parts = regionId.split(/[-:]/)
  const chrom = parts[0].toUpperCase().replace(/^CHR/, '')
  let start = Number(parts[1])
  let end

  if (parts[2]) {
    end = Number(parts[2])
  } else {
    end = start + 20
    start = Math.max(start - 20, 0)
  }

  return `${chrom}-${start}-${end}`
}

const VARIANT_ID_REGEX = /^(chr)?(\d+|x|y|m|mt)[-:]([0-9]+)[-:]([acgt]+)[-:]([acgt]+)$/i

const isVariantId = str => {
  const match = VARIANT_ID_REGEX.exec(str)
  if (!match) {
    return false
  }

  const chrom = match[2].toLowerCase()
  const chromNumber = Number(chrom)
  if (!Number.isNaN(chromNumber) && (chromNumber < 1 || chromNumber > 22)) {
    return false
  }

  return true
}

const normalizeVariantId = variantId =>
  variantId
    .toUpperCase()
    .replace(/:/g, '-')
    .replace(/^CHR/, '')

const resolveSearchResults = async (ctx, query) => {
  
  //console.log(query)
  if (isVariantId(query)) {
    const variantId = normalizeVariantId(query)
    return [
      {
        label: variantId,
        url: `/variant/${variantId}`,
      },
    ]
  }

  if (isRegionId(query)) {
    const regionId = normalizeRegionId(query)
    return [
      {
        label: regionId,
        url: `/region/${regionId}`,
      },
    ]
  }

  const startsWithQuery = { $regex: `^${(0,lodash__WEBPACK_IMPORTED_MODULE_1__.escapeRegExp)(query).toUpperCase()}` }

  if (/^ensg[0-9]/i.test(query)) {
    const matchingGenes = await ctx.database.gnomad
      .collection('genes')
      .find({ gene_id: startsWithQuery })
      .limit(5)
      .toArray()

    return matchingGenes.map(gene => ({
      label: `${gene.gene_id} (${gene.gene_name_upper})`,
      url: `/gene/${gene.gene_id}`,
    }))
  }

  if (/^enst[0-9]/i.test(query)) {
    const matchingTranscripts = await ctx.database.gnomad
      .collection('transcripts')
      .find({ transcript_id: startsWithQuery })
      .limit(5)
      .toArray()

    return matchingTranscripts.map(transcript => ({
      label: `${transcript.transcript_id}`,
      url: `/gene/${transcript.gene_id}/transcript/${transcript.transcript_id}`,
    }))
  }

  const matchingGenes = await ctx.database.gnomad
    .collection('genes')
    .find({
      $or: [{ gene_name_upper: startsWithQuery }, { other_names: startsWithQuery }],
    })
    .limit(5)
    .toArray()

  const geneNameCounts = {}
  matchingGenes.forEach(gene => {
    if (geneNameCounts[gene.gene_name_upper] === undefined) {
      geneNameCounts[gene.gene_name_upper] = 0
    }
    geneNameCounts[gene.gene_name_upper] += 1
  })

  const geneResults = matchingGenes.map(gene => ({
    label:
      geneNameCounts[gene.gene_name_upper] > 1
        ? `${gene.gene_name_upper} (${gene.gene_id})`
        : gene.gene_name_upper,
    url: `/gene/${gene.gene_id}`,
  }))

  if (geneResults.length < 5 && /^rs[0-9]/i.test(query)) {
    const response = await ctx.database.elastic.search({
      index: 'gnomad_exomes_2_1_1,gnomad_genomes_2_1_1',
      type: 'variant',
      _source: ['rsid', 'variant_id'],
      body: {
        query: {
          term: { rsid: query.toLowerCase() },
        },
      },
      size: 5 - geneResults.length,
    })

    const variantResults = response.hits.hits.map(doc => ({
      label: `${doc._source.variant_id} (${doc._source.rsid})`, // eslint-disable-line no-underscore-dangle
      url: `/variant/${doc._source.variant_id}`, // eslint-disable-line no-underscore-dangle
    }))

    return geneResults.concat(variantResults)
  }

  return geneResults
}


/***/ }),

/***/ "./src/pcgc_schema/types/structuralVariant.js":
/*!****************************************************!*\
  !*** ./src/pcgc_schema/types/structuralVariant.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StructuralVariantSummaryType": () => (/* binding */ StructuralVariantSummaryType)
/* harmony export */ });
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_0__);


const StructuralVariantSummaryType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'StructuralVariantSummary',
  fields: {
    ac: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    ac_hom: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    an: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    af: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    chrom: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    end_chrom: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    end_pos: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
    consequence: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    filters: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    length: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    pos: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
    type: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    variant_id: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
  },
})


/***/ }),

/***/ "./src/pcgc_schema/types/transcript.js":
/*!*********************************************!*\
  !*** ./src/pcgc_schema/types/transcript.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CompositeTranscriptType": () => (/* binding */ CompositeTranscriptType),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "fetchCompositeTranscriptByGene": () => (/* binding */ fetchCompositeTranscriptByGene),
/* harmony export */   "lookupAllTranscriptsByGeneId": () => (/* binding */ lookupAllTranscriptsByGeneId),
/* harmony export */   "lookupTranscriptsByTranscriptId": () => (/* binding */ lookupTranscriptsByTranscriptId)
/* harmony export */ });
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities_region__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utilities/region */ "./src/utilities/region.js");
/* harmony import */ var _exon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./exon */ "./src/pcgc_schema/types/exon.js");
/* harmony import */ var _gtex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gtex */ "./src/pcgc_schema/types/gtex.js");
/* harmony import */ var _datasets_fetchGnomadConstraintByTranscript__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../datasets/fetchGnomadConstraintByTranscript */ "./src/pcgc_schema/datasets/fetchGnomadConstraintByTranscript.js");
/* harmony import */ var _datasets_GnomadConstraintType__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../datasets/GnomadConstraintType */ "./src/pcgc_schema/datasets/GnomadConstraintType.js");
/* eslint-disable camelcase */



/*
import { withCache } from '../../utilities/redis'
*/



/*
import { AnyDatasetArgumentType } from '../datasets/datasetArgumentTypes'
import datasetsConfig from '../datasets/datasetsConfig'
import coverageType, { fetchCoverageByTranscript } from './coverage'
*/







const transcriptType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'Transcript',
  fields: () => ({
    _id: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    start: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    transcript_id: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    strand: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    stop: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    xstart: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    chrom: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    gene_id: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    gene_name: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    xstop: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    exons: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(_exon__WEBPACK_IMPORTED_MODULE_2__["default"]),
      resolve: (obj, args, ctx) =>
       (0,_exon__WEBPACK_IMPORTED_MODULE_2__.lookupExonsByTranscriptId)(ctx.database.gnomad, obj.transcript_id),
    },

/*
    exome_coverage: {
      type: new GraphQLList(coverageType),
      args: {
        dataset: { type: AnyDatasetArgumentType },
      },
      resolve: async (obj, args, ctx) => {
        const { index, type } = datasetsConfig[args.dataset].exomeCoverageIndex
        if (!index) {
          return []
        }
        return withCache(ctx, `coverage:transcript:${index}:${obj.transcript_id}`, async () => {
          const exons = await lookupExonsByTranscriptId(ctx.database.gnomad, obj.transcript_id)
          return fetchCoverageByTranscript(ctx, {
            index,
            type,
            chrom: obj.chrom,
            exons,
          })
        })
      },
    },
    genome_coverage: {
      type: new GraphQLList(coverageType),
      args: {
        dataset: { type: AnyDatasetArgumentType },
      },
      resolve: async (obj, args, ctx) => {
        const { index, type } = datasetsConfig[args.dataset].genomeCoverageIndex
        if (!index) {
          return []
        }
        return withCache(ctx, `coverage:transcript:${index}:${obj.transcript_id}`, async () => {
          const exons = await lookupExonsByTranscriptId(ctx.database.gnomad, obj.transcript_id)
          return fetchCoverageByTranscript(ctx, {
            index,
            type,
            chrom: obj.chrom,
            exons,
          })
        })
      },
    },*/
    
    gnomad_constraint: {
      type: _datasets_GnomadConstraintType__WEBPACK_IMPORTED_MODULE_5__["default"],
      resolve: (obj, args, ctx) => (0,_datasets_fetchGnomadConstraintByTranscript__WEBPACK_IMPORTED_MODULE_4__["default"])(ctx, obj.transcript_id),
    },
    
    gtex_tissue_tpms_by_transcript: {
      type: _gtex__WEBPACK_IMPORTED_MODULE_3__.GtexTissueExpressionsType,
      resolve: (obj, args, ctx) => (0,_gtex__WEBPACK_IMPORTED_MODULE_3__.fetchGtexTissueExpressionsByTranscript)(ctx, obj.transcript_id),
    },
  }),
})

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (transcriptType);

const lookupTranscriptsByTranscriptId = (db, transcript_id, gene_name) =>
  new Promise((resolve) => {
    db.collection('transcripts').findOne({ transcript_id })
      .then(data => resolve({ ...data, gene_name }))
  })

const lookupAllTranscriptsByGeneId = (db, gene_id) =>
  db.collection('transcripts').find({ gene_id }).toArray()


const CompositeTranscriptType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'CompositeTranscript',
  fields: {
    exons: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(_exon__WEBPACK_IMPORTED_MODULE_2__["default"]) },

/*
    exome_coverage: {
      type: new GraphQLList(coverageType),
      args: {
        dataset: { type: AnyDatasetArgumentType },
      },
      resolve: (obj, args, ctx) => {
        const { index, type } = datasetsConfig[args.dataset].exomeCoverageIndex
        if (!index) {
          return []
        }
        return withCache(ctx, `coverage:gene:${index}:${obj.gene_id}`, () =>
          fetchCoverageByTranscript(ctx, {
            index,
            type,
            chrom: obj.chrom,
            exons: obj.exons,
          })
        )
      },
    },
    genome_coverage: {
      type: new GraphQLList(coverageType),
      args: {
        dataset: { type: AnyDatasetArgumentType },
      },
      resolve: (obj, args, ctx) => {
        const { index, type } = datasetsConfig[args.dataset].genomeCoverageIndex
        if (!index) {
          return []
        }
        return withCache(ctx, `coverage:gene:${index}:${obj.gene_id}`, () =>
          fetchCoverageByTranscript(ctx, {
            index,
            type,
            chrom: obj.chrom,
            exons: obj.exons,
          })
        )
      },
    },*/
  },
})

const fetchCompositeTranscriptByGene = async (ctx, gene) => {
  const allExons = await (0,_exon__WEBPACK_IMPORTED_MODULE_2__.lookupExonsByGeneId)(ctx.database.gnomad, gene.gene_id)
  const sortedExons = allExons.sort((r1, r2) => r1.start - r2.start)

  const cdsExons = allExons.filter(exon => exon.feature_type === 'CDS')
  const utrExons = allExons.filter(exon => exon.feature_type === 'UTR')

  const cdsCompositeExons = (0,_utilities_region__WEBPACK_IMPORTED_MODULE_1__.mergeOverlappingRegions)(cdsExons)
  const utrCompositeExons = (0,_utilities_region__WEBPACK_IMPORTED_MODULE_1__.mergeOverlappingRegions)(utrExons)

  /**
   * There are 3 feature types in the exons collection: "CDS", "UTR", and "exon".
   * There are "exon" regions that cover the "CDS" and "UTR" regions and also
   * some (non-coding) transcripts that contain only "exon" regions.
   * This filters the "exon" regions to only those that are in non-coding transcripts.
   *
   * This makes the UI for selecting visible regions easier, since it can filter
   * on "CDS" or "UTR" feature type without having to also filter out the "exon" regions
   * that duplicate the "CDS" and "UTR" regions.
   */
  const codingTranscripts = new Set(
    allExons
      .filter(exon => exon.feature_type === 'CDS' || exon.feature_type === 'UTR')
      .map(exon => exon.transcript_id)
  )

  const nonCodingTranscriptExons = sortedExons.filter(
    exon => !codingTranscripts.has(exon.transcript_id)
  )

  const nonCodingTranscriptCompositeExons = (0,_utilities_region__WEBPACK_IMPORTED_MODULE_1__.mergeOverlappingRegions)(nonCodingTranscriptExons)

  return {
    gene_id: gene.gene_id,
    chrom: gene.chrom,
    exons: [...cdsCompositeExons, ...utrCompositeExons, ...nonCodingTranscriptCompositeExons],
  }
}


/***/ }),

/***/ "./src/pcgc_schema/types/variant.js":
/*!******************************************!*\
  !*** ./src/pcgc_schema/types/variant.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VariantInterface": () => (/* binding */ VariantInterface),
/* harmony export */   "VariantSummaryType": () => (/* binding */ VariantSummaryType)
/* harmony export */ });
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_0__);


const VariantInterface = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInterfaceType({
  name: 'Variant',
  fields: {
    alt: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    chrom: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    pos: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
    ref: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    variantId: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    xpos: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat) },
  },
})

const VariantSequencingDataType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'VariantSequencingData',
  fields: {
    ac: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    //ac_hemi: { type: GraphQLInt },
    ac_hom: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    an: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    af: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    ac_proband: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    an_proband: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    af_proband: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat },
    filters: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },

    populations: {
      type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(
        new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
          name: 'VariantPopulations',
          fields: {
            id: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
            ac: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
            an: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
            //ac_hemi: { type: new GraphQLNonNull(GraphQLInt) },
            ac_hom: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
          },
        })
      ),
    },
  },
})

const VariantSummaryType = new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLObjectType({
  name: 'VariantSummary',
  fields: {
    // Variant ID fields
    alt: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    chrom: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    pos: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt) },
    ref: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    variantId: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    xpos: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLNonNull(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLFloat) },
    // Other fields
    consequence: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    consequence_in_canonical_transcript: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLBoolean },
    flags: { type: new graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLList(graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString) },
    hgvs: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    hgvsc: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    hgvsp: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },
    rsid: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLString },

    ac_gnomad: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },
    an_gnomad: { type: graphql__WEBPACK_IMPORTED_MODULE_0__.GraphQLInt },    

    // will keep with this name for future
    bpkd_exome: { type: VariantSequencingDataType },
    //spark_genome: { type: VariantSequencingDataType },
    //ssc_genome: { type: VariantSequencingDataType },
    // genome: { type: VariantSequencingDataType },
  },
})


/***/ }),

/***/ "./src/utilities/elasticsearch.js":
/*!****************************************!*\
  !*** ./src/utilities/elasticsearch.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchAllSearchResults": () => (/* binding */ fetchAllSearchResults)
/* harmony export */ });
/**
 * Search and then scroll to retrieve all pages of search results.
 *
 * @param {elasticsearch.Client} esClient Elasticsearch client
 * @param {Object} searchParams Argument to elasticsearch.Client#search
 * @return {Object[]} Combined list of hits from all responses
 */
async function fetchAllSearchResults(esClient, searchParams) {
  let allResults = []
  const responseQueue = []

  const size = searchParams.size || 1000
  const scroll = searchParams.scroll || '30s'
  
  // You can also retrieve hits.total as a number in the rest response by adding rest_total_hits_as_int=true
  // https://www.elastic.co/guide/en/elasticsearch/reference/current/breaking-changes-7.0.html#hits-total-now-object-search-response
  // Change between Elastic Search 7 and 6
  const rest_total_hits_as_int=true

  //console.log(searchParams)

  responseQueue.push(
    await esClient.search({
      ...searchParams,
      scroll,
      size,
      rest_total_hits_as_int
    })
  )


  while (responseQueue.length) {
    const response = responseQueue.shift()
    allResults = allResults.concat(response.hits.hits)

    //console.log(response)

    //if (allResults.length === response.hits.total) {
    if (allResults.length === response.hits.total.value) {
      // eslint-disable-next-line no-await-in-loop
      await esClient.clearScroll({
        scrollId: response._scroll_id,
      })
      break
    }

    responseQueue.push(
      // eslint-disable-next-line no-await-in-loop
      await esClient.scroll({
        scroll,
        scrollId: response._scroll_id,
      })
    )
  }
  

  return allResults
}


/***/ }),

/***/ "./src/utilities/redis.js":
/*!********************************!*\
  !*** ./src/utilities/redis.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "withCache": () => (/* binding */ withCache)
/* harmony export */ });
const withCache = async (ctx, cacheKey, fn) => {
  const cachedValue = await ctx.database.redis.get(cacheKey)
  if (cachedValue) {
    return JSON.parse(cachedValue)
  }

  const value = await fn()

  await ctx.database.redis.set(cacheKey, JSON.stringify(value))

  return value
}


/***/ }),

/***/ "./src/utilities/region.js":
/*!*********************************!*\
  !*** ./src/utilities/region.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "extendRegions": () => (/* binding */ extendRegions),
/* harmony export */   "mergeOverlappingRegions": () => (/* binding */ mergeOverlappingRegions),
/* harmony export */   "totalRegionSize": () => (/* binding */ totalRegionSize)
/* harmony export */ });
const extendRegions = (amount, regions) =>
  regions.map(({ start, stop, xstart, xstop, ...rest }) => ({
    ...rest,
    start: start - amount,
    stop: stop + amount,
    xstart: xstart - amount,
    xstop: xstop + amount,
  }))

/**
 * Create a minimal representation of a set of regions.
 * xstart and xstop are inclusive.
 *
 * @example
 * // returns { xstart: 0, xstop: 10 }
 * mergeOverlappingRegions([{ xstart: 0, xstop: 7 }, { xstart: 3, xstop: 10 }])
 *
 * @param {Object[]} sortedRegions - Regions ordered by xstart
 * @param {number} sortedRegions[].xstart
 * @param {number} sortedRegions[].xstop
 */
const mergeOverlappingRegions = sortedRegions => {
  if (sortedRegions.length === 0) {
    return []
  }

  const mergedRegions = [{ ...sortedRegions[0] }]

  let previousRegion = mergedRegions[0]

  for (let i = 1; i < sortedRegions.length; i += 1) {
    const nextRegion = sortedRegions[i]

    if (nextRegion.xstart <= previousRegion.xstop + 1) {
      if (nextRegion.xstop > previousRegion.xstop) {
        previousRegion.stop = nextRegion.stop
        previousRegion.xstop = nextRegion.xstop
      }
    } else {
      previousRegion = { ...nextRegion }
      mergedRegions.push(previousRegion)
    }
  }

  return mergedRegions
}

const totalRegionSize = regions =>
  regions.reduce((acc, { start, stop }) => acc + stop - start, 0)


/***/ }),

/***/ "./src/utilities/variant.js":
/*!**********************************!*\
  !*** ./src/utilities/variant.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getXpos": () => (/* binding */ getXpos)
/* harmony export */ });
const getXpos = (chr, pos) => {
  const autosomes = Array.from(new Array(22), (x, i) => `chr${i + 1}`)
  const chromosomes = [...autosomes, 'chrX', 'chrY', 'chrM']
  const chromosomeCodes = chromosomes.reduce((acc, chrom, i) => {
    return { ...acc, [chrom]: i + 1 }
  }, {})
  const chrStart = chromosomeCodes[`chr${chr}`] * 1e9
  const xpos = chrStart + Number(pos)
  return xpos
}


/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("compression");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ "elasticsearch":
/*!********************************!*\
  !*** external "elasticsearch" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("elasticsearch");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "express-graphql":
/*!**********************************!*\
  !*** external "express-graphql" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("express-graphql");

/***/ }),

/***/ "graphql":
/*!**************************!*\
  !*** external "graphql" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("graphql");

/***/ }),

/***/ "graphql-disable-introspection":
/*!************************************************!*\
  !*** external "graphql-disable-introspection" ***!
  \************************************************/
/***/ ((module) => {

module.exports = require("graphql-disable-introspection");

/***/ }),

/***/ "ioredis":
/*!**************************!*\
  !*** external "ioredis" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("ioredis");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("lodash");

/***/ }),

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("mongodb");

/***/ }),

/***/ "node-fetch":
/*!*****************************!*\
  !*** external "node-fetch" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("node-fetch");

/***/ }),

/***/ "serve-static":
/*!*******************************!*\
  !*** external "serve-static" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("serve-static");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/server.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var compression__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! compression */ "compression");
/* harmony import */ var compression__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(compression__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mongodb */ "mongodb");
/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var elasticsearch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! elasticsearch */ "elasticsearch");
/* harmony import */ var elasticsearch__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(elasticsearch__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var express_graphql__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! express-graphql */ "express-graphql");
/* harmony import */ var express_graphql__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(express_graphql__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! cors */ "cors");
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var ioredis__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ioredis */ "ioredis");
/* harmony import */ var ioredis__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(ioredis__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var serve_static__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! serve-static */ "serve-static");
/* harmony import */ var serve_static__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(serve_static__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _pcgc_schema__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pcgc_schema */ "./src/pcgc_schema/index.js");
/* harmony import */ var graphql_disable_introspection__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! graphql-disable-introspection */ "graphql-disable-introspection");
/* harmony import */ var graphql_disable_introspection__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(graphql_disable_introspection__WEBPACK_IMPORTED_MODULE_9__);












const app = express__WEBPACK_IMPORTED_MODULE_0___default()()
app.use(compression__WEBPACK_IMPORTED_MODULE_1___default()())
app.use(cors__WEBPACK_IMPORTED_MODULE_5___default()())

// eslint-disable-line prettier/prettier
;(async () => {
  try {
    const mongoClient = await mongodb__WEBPACK_IMPORTED_MODULE_2__.MongoClient.connect(process.env.GNOMAD_MONGO_URL, {
      useNewUrlParser: true,
    })

    const elastic = new (elasticsearch__WEBPACK_IMPORTED_MODULE_3___default().Client)({
      apiVersion: '7.6',
      host: process.env.ELASTICSEARCH_URL,
    })

    const redisConnectionConfig =
      process.env.NODE_ENV === 'development'
        ? { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }
        : {
            sentinels: [
              { host: 'redis-sentinel', port: 26379 },
              { host: 'redis-sentinel', port: 26379 },
            ],
            name: 'mymaster',
          }

    const redis = new (ioredis__WEBPACK_IMPORTED_MODULE_6___default())(redisConnectionConfig)

    app.use(
      [/^\/$/, /^\/api\/?$/],
      express_graphql__WEBPACK_IMPORTED_MODULE_4___default()({
        schema: _pcgc_schema__WEBPACK_IMPORTED_MODULE_8__["default"],
        graphiql: true,
        validationRules: [(graphql_disable_introspection__WEBPACK_IMPORTED_MODULE_9___default())],
        context: {
          database: {
            gnomad: mongoClient.db(),
            elastic,
            redis,
          },
        },
        customFormatErrorFn: error => {
          console.log(error)
          const message =
            error.extensions && error.extensions.isUserVisible
              ? error.message
              : 'An unknown error occurred'
          return { message }
        },
      })
    )

    if (process.env.READS_DIR) {
      app.use(['/reads', '/api/reads'], serve_static__WEBPACK_IMPORTED_MODULE_7___default()(process.env.READS_DIR, { acceptRanges: true }))
    }

    app.get('/health', (req, res) => {
      res.json({})
    })

    app.listen(process.env.GRAPHQL_PORT, () => {
      console.log(`Listening on ${process.env.GRAPHQL_PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
})()

})();

/******/ })()
;
//# sourceMappingURL=server.js.map