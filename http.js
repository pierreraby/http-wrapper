// Function to send an HTTP request using fetch
// This function uses currying to allow for easy customization of the request type and options
async function myfetch(url, options = {}) {
  console.log(options);

  try {
    let response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error : ${response.status} ${response.statusText}`);
    }

    return (type) => {
      switch (type.toLocaleLowerCase()) {
        case "json":
          return response.json();
        case "text":
          return response.text();
        case "blob":
          return response.blob();
        case "formdata":
          return response.formData();
        default:
          return response.arrayBuffer();
      }
    }   
    
  } catch (error) {
    console.error('Fetch error :', error);
    throw error;
  }

}

// Function to send an HTTP GET request
async function httpGET(url, type = 'json', options) {
  return (await myfetch(url, options)) (type);
}

// Function to send an HTTP POST request
async function httpPOST(url, body, type = 'json', options) {
  return (await myfetch(url, { method: 'POST' ,body, ...options})) (type);
}

// Function to send an HTTP PUT request
async function httpPUT(url, body, type = 'json', options) {
  return (await myfetch(url, { method: 'PUT', body, ...options})) (type);
}

// Function to send an HTTP PATCH request
async function httpPATCH(url, body, type = 'json', options) {
  return (await myfetch(url, { method: 'PATCH', body, ...options})) (type);
}

// Function to send an HTTP DELETE request
async function httpDELETE(url, type = 'json', options) {
  return (await myfetch(url, { method: 'DELETE', ...options})) (type);
}

export { httpGET, httpPOST, httpPUT, httpPATCH, httpDELETE };