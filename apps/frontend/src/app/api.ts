import { paths } from "@/api";
import createClient from "openapi-fetch";

const api = createClient<paths>({ baseUrl: import.meta.env.VITE_API_URL, mode: "cors" });

export default api;
