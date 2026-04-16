import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("userToken");
      window.dispatchEvent(new Event("auth-changed"));
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────

export const registerUser = (name, email, password) =>
  api.post("/auth/register", { name, email, password }).then((r) => r.data);

export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password }).then((r) => r.data);

// ── Doctors ───────────────────────────────────────────────────────────────────

export const getCities = () =>
  api.get("/doctors/cities").then((r) => r.data);

export const getDoctors = (filters = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== "" && v !== null && v !== undefined)
  );
  return api.get("/doctors", { params }).then((r) => r.data);
};

export const getDoctor = (id) =>
  api.get(`/doctors/${id}`).then((r) => r.data);

export const getDoctorSlots = (doctorId, date) =>
  api.get(`/doctors/${doctorId}/slots`, { params: { date } }).then((r) => r.data);

// ── Appointments ──────────────────────────────────────────────────────────────

export const bookAppointment = (doctor_id, date, slot_time) =>
  api.post("/appointments", { doctor_id, date, slot_time }).then((r) => r.data);

export const getMyAppointments = () =>
  api.get("/appointments/mine").then((r) => r.data);

export const cancelAppointment = (id) =>
  api.delete(`/appointments/${id}`).then((r) => r.data);

// ── NPI ───────────────────────────────────────────────────────────────────────

export const searchNPI = (params = {}) =>
  api.get("/npi/search", { params }).then((r) => r.data);
