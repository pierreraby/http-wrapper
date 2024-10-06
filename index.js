import { httpDELETE, httpGET, httpPATCH, httpPOST, httpPUT } from "./http.js";

const url = "https://jsonplaceholder.typicode.com/posts";
const type = "json";
const options = {'content-type': 'application/json'};

// without additional error handling
const GETresult = await httpGET(url, type, options);
console.log(GETresult);

const POSTresult = await httpPOST(url, { title: "foo", body: "bar", userId: 1 }, type, options);
console.log(POSTresult);

const PUTresult = await httpPUT(`${url}/1`, { title: "foo", body: "bar", userId: 1 }, type, options);
console.log(PUTresult);

const PATCHresult = await httpPATCH(`${url}/1`, { title: "foo" }, type, options);
console.log(PATCHresult);

const DELETEresult = await httpDELETE(`${url}/1`, type, options);
console.log(DELETEresult);


// handling errors again here for additional logging/actions
httpGET(url, type, options)
  .then(data => console.log(data))
  .catch(error => console.error(error));

// POST, PUT, PATCH, DELETE for testing and example
httpPOST(url, { title: "foo", body: "bar", userId: 1 }, type, options)
  .then(data => console.log(data))
  .catch(error => console.error(error));

httpPUT(`${url}/1`, { title: "foo", body: "bar", userId: 1 }, type, options)
  .then(data => console.log(data))
  .catch(error => console.error(error));

httpPATCH(`${url}/1`, { title: "foo" }, type, options)
  .then(data => console.log(data))
  .catch(error => console.error(error));

httpDELETE(`${url}/1`, type, options)
  .then(data => console.log(data))
  .catch(error => console.error(error));




