import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

// CRUD API calls - Bookings
export const getBookings = () => api.get("/bookings");
export const createBooking = (data) => api.post("/bookings", data);
export const updateBooking = (id, data) => api.put(`/bookings/${id}`, data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);

// CRUD API calls - Customers
export const getCustomers = () => api.get("/customers");
export const getCustomer = (id) => api.get(`/customers/${id}`);
export const createCustomer = (data) => api.post("/customers", data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

// Auth API calls
export const signupUser = (data) => api.post("/auth/signup", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getUsers = () => api.get("/auth/users");

// FS Demo API calls
export const fsDemo = {
  list: () => api.get("/fs/list"),
  create: (filename, content) => api.post("/fs/create", { filename, content }),
  read: (filename) => api.get("/fs/read", { params: { filename } }),
  append: (filename, content) => api.post("/fs/append", { filename, content }),
  modify: (filename, content) => api.post("/fs/modify", { filename, content }),
  rename: (oldFilename, newFilename) => api.post("/fs/rename", { oldFilename, newFilename }),
  remove: (filename) => api.delete("/fs/delete", { data: { filename } }),
};

export default api;