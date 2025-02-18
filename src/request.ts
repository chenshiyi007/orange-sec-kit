import axios from "axios";

const myAxios = axios.create({
  baseURL: "http://127.0.0.1:33333",
  timeout: 3000,
  //withCredentials: true,
});

// Add a request interceptor
myAxios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
myAxios.interceptors.response.use(
   function (response) {
  //   // Any status code that lie within the range of 2xx cause this function to trigger
  //   // Do something with response data
    return response;
   },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default myAxios;
