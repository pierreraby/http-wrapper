// Function to send an HTTP request using fetch
async function httpRequest(url, options = {}) {
  // Prepare default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Merge headers properly
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Serialize body if it's an object and not already a string or FormData
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error('HTTP request failed:', error);
    throw error;
  }
}

// Function to parse response based on type
async function parseResponse(response, type = 'json') {
  switch (type.toLowerCase()) {
    case 'json':
      return await response.json();
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
async function httpGET(url, type = 'json', options = {}) {
  const response = await httpRequest(url, { method: 'GET', ...options });
  return await parseResponse(response, type);
}

// Function to send an HTTP POST request
async function httpPOST(url, body, type = 'json', options = {}) {
  const response = await httpRequest(url, { 
    method: 'POST', 
    body, 
    ...options 
  });
  return await parseResponse(response, type);
}

// Function to send an HTTP PUT request
async function httpPUT(url, body, type = 'json', options = {}) {
  const response = await httpRequest(url, { 
    method: 'PUT', 
    body, 
    ...options 
  });
  return await parseResponse(response, type);
}

// Function to send an HTTP PATCH request
async function httpPATCH(url, body, type = 'json', options = {}) {
  const response = await httpRequest(url, { 
    method: 'PATCH', 
    body, 
    ...options 
  });
  return await parseResponse(response, type);
}

// Function to send an HTTP DELETE request
async function httpDELETE(url, type = 'json', options = {}) {
  const response = await httpRequest(url, { method: 'DELETE', ...options });
  return await parseResponse(response, type);
}

export { httpGET, httpPOST, httpPUT, httpPATCH, httpDELETE };