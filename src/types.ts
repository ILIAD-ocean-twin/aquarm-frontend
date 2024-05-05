export interface BasicWeek {
  id: number
  name: string
  lat: number
  lon: number
  rank: number,
  isFallow: boolean,
  siteId: number,
  lice?: number
  organizations?: string[]
  purposes?: string[]
  productionTypes?: string[]
  species?: string[]
  placement?: string
}

export interface ConnectivityData {
  localities: number[]
  connectivity_matrix: number[][]
}

export type TimeSelection = { year: number, week: number };

export interface Filters {
  fallow: boolean
  organizations: string[]
}

export interface HistoricSiteData {
  year: number,
  week: number,
  avgAdultFemaleLice: number | null,
  avgMobileLice: number | null,
  rank: number | null
  seaTemperature: number
}

export interface OimEntry {
  "name (no)": string
  "name (en)": string
  "description (no)": string
  "description (en)": string
}