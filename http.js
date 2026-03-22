/** @typedef {import("./types").ResponseType} ResponseType */
/** @typedef {import("./types").HttpOptions} HttpOptions */

class HttpError extends Error {
  /**
   * @param {string} message
   * @param {{ status: number, statusText: string, url: string, body?: unknown }} details
   */
  constructor(message, details) {
    super(message);
    this.name = 'HttpError';
    this.status = details.status;
    this.statusText = details.statusText;
    this.url = details.url;
    this.body = details.body;
  }
}

/**
 * @param {HeadersInit | undefined} headers
 * @param {string} headerName
 * @returns {boolean}
 */
function hasHeader(headers, headerName) {
  if (!headers) {
    return false;
  }

  if (headers instanceof Headers) {
    return headers.has(headerName);
  }

  const normalizedHeaderName = headerName.toLowerCase();

  if (Array.isArray(headers)) {
    return headers.some(([key]) => key.toLowerCase() === normalizedHeaderName);
  }

  return Object.keys(headers).some((key) => key.toLowerCase() === normalizedHeaderName);
}

/**
 * Only plain objects and arrays should be JSON-serialized automatically.
 * @param {unknown} body
 * @returns {boolean}
 */
function shouldSerializeBody(body) {
  if (body == null || typeof body === 'string') {
    return false;
  }

  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    return false;
  }

  if (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) {
    return false;
  }

  if (typeof Blob !== 'undefined' && body instanceof Blob) {
    return false;
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
      return false;
    }
  }

  return Array.isArray(body) || Object.prototype.toString.call(body) === '[object Object]';
}

/**
 * @param {Response} response
 * @returns {Promise<unknown>}
 */
async function parseErrorBody(response) {
  const rawBody = await response.text();

  if (!rawBody) {
    return undefined;
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return rawBody;
  }
}

// Function to send an HTTP request using fetch
/**
 * @param {string} url
 * @param {HttpOptions} [options={}]
 * @returns {Promise<Response>}
 */
async function httpRequest(url, options = {}) {
  const shouldSerialize = shouldSerializeBody(options.body);
  const config = {
    ...options,
    headers: new Headers(options.headers),
  };

  if (shouldSerialize && !hasHeader(options.headers, 'Content-Type')) {
    config.headers.set('Content-Type', 'application/json');
  }

  if (shouldSerialize) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new HttpError(`HTTP ${response.status}: ${response.statusText}`, {
      status: response.status,
      statusText: response.statusText,
      url,
      body: await parseErrorBody(response),
    });
  }

  return response;
}

// Function to parse response based on type
/**
 * @template TResponse
 * @param {Response} response
 * @param {ResponseType} [type='json']
 * @returns {Promise<TResponse>}
 */
async function parseResponse(response, type = 'json') {
  switch (type.toLowerCase()) {
    case 'json': {
      if ([204, 205, 304].includes(response.status)) {
        return undefined;
      }

      const rawBody = await response.text();

      if (!rawBody) {
        return undefined;
      }

      return JSON.parse(rawBody);
    }
    case 'text':
      return await response.text();
    case 'blob':
      return await response.blob();
    case 'formdata':
      return await response.formData();
    case 'arrayBuffer':
    case 'arraybuffer':
      return await response.arrayBuffer();
    default:
      return await response.json(); // Default to JSON
  }
}

// Function to send an HTTP GET request
/**
 * @template TResponse
 * @param {string} url
 * @param {ResponseType} [type='json']
 * @param {HttpOptions} [options={}]
 * @returns {Promise<TResponse>}
 */
async function httpGET(url, type = 'json', options = {}) {
  const response = await httpRequest(url, { method: 'GET', ...options });
  return await parseResponse(response, type);
}

// Function to send an HTTP POST request
/**
 * @template TResponse, TBody
 * @param {string} url
 * @param {TBody} body
 * @param {ResponseType} [type='json']
 * @param {HttpOptions} [options={}]
 * @returns {Promise<TResponse>}
 */
async function httpPOST(url, body, type = 'json', options = {}) {
  const response = await httpRequest(url, { 
    method: 'POST', 
    body, 
    ...options 
  });
  return await parseResponse(response, type);
}

// Function to send an HTTP PUT request
/**
 * @template TResponse, TBody
 * @param {string} url
 * @param {TBody} body
 * @param {ResponseType} [type='json']
 * @param {HttpOptions} [options={}]
 * @returns {Promise<TResponse>}
 */
async function httpPUT(url, body, type = 'json', options = {}) {
  const response = await httpRequest(url, { 
    method: 'PUT', 
    body, 
    ...options 
  });
  return await parseResponse(response, type);
}

// Function to send an HTTP PATCH request
/**
 * @template TResponse, TBody
 * @param {string} url
 * @param {TBody} body
 * @param {ResponseType} [type='json']
 * @param {HttpOptions} [options={}]
 * @returns {Promise<TResponse>}
 */
async function httpPATCH(url, body, type = 'json', options = {}) {
  const response = await httpRequest(url, { 
    method: 'PATCH', 
    body, 
    ...options 
  });
  return await parseResponse(response, type);
}

// Function to send an HTTP DELETE request
/**
 * @template TResponse
 * @param {string} url
 * @param {ResponseType} [type='json']
 * @param {HttpOptions} [options={}]
 * @returns {Promise<TResponse>}
 */
async function httpDELETE(url, type = 'json', options = {}) {
  const response = await httpRequest(url, { method: 'DELETE', ...options });
  return await parseResponse(response, type);
}

export { HttpError, httpGET, httpPOST, httpPUT, httpPATCH, httpDELETE };