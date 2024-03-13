import Projection from "ol/proj/Projection"

export const dataProj = new Projection({
  code: "EPSG:4326",
  units: "degrees"
})

export const mapProj = new Projection({
  code: "EPSG:3857",
  units: "m"
})

export const LAYERS = [
  "Weather warnings",
  "Trajectory simulations",
  "Sea temperature",
  "Production areas",
  "Municipalities"
] as const;