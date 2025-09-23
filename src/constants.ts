import Projection from "ol/proj/Projection"

export const dataProj = new Projection({
  code: "EPSG:4326",
  units: "degrees"
})

export const mapProj = new Projection({
  code: "EPSG:3857",
  units: "m"
})

interface FrontendConfig {
  API_URL: string;
  RAZZER_URL: string;
}

declare global {
  interface Window {
    config: FrontendConfig;
  }
}

const apiUrl = typeof window !== "undefined" && window.config?.VITE_API_URL
  ? window.config.VITE_API_URL
  : import.meta.env.VITE_API_URL;
const razzerUrl = typeof window !== "undefined" && window.config?.VITE_RAZZER_URL
  ? window.config.VITE_RAZZER_URL
  : import.meta.env.VITE_RAZZER_URL;

export const API_URL = apiUrl;
export const RAZZER_URL = razzerUrl;
