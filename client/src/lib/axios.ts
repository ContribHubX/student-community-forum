import Axios from "axios";

export const api = Axios.create({
  baseURL: "http://localhost:3000",
  //baseURL: "http://192.168.43.200:3000",
  withCredentials: true,
});
