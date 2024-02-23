import { LAYERS } from "./constants"

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

export interface Filters {
    fallow: boolean
    organizations: string[]
}

export interface SiteSelection {
    id: number
    coords: number[]
}

export type LayerName = typeof LAYERS[number];