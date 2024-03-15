import Projection from "ol/proj/Projection"

export const dataProj = new Projection({
  code: "EPSG:4326",
  units: "degrees"
})

export const mapProj = new Projection({
  code: "EPSG:3857",
  units: "m"
})

export const API_URL = import.meta.env.VITE_API_ENDPOINT;
export const REPORTS_URL = API_URL + "/Report";
