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

async function httpGET(url, type = 'json', options) {
  return (await myfetch(url, options)) (type);
}

async function httpPOST(url, body, type = 'json', options) {
  return (await myfetch(url, { method: 'POST' ,body, ...options})) (type);
}

async function httpPUT(url, body, type = 'json', options) {
  return (await myfetch(url, { method: 'PUT', body, ...options})) (type);
}

async function httpPATCH(url, body, type = 'json', options) {
  return (await myfetch(url, { method: 'PATCH', body, ...options})) (type);
}

async function httpDELETE(url, type = 'json', options) {
  return (await myfetch(url, { method: 'DELETE', ...options})) (type);
}

export { httpGET, httpPOST, httpPUT, httpPATCH, httpDELETE };