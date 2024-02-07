export interface BasicWeek {
    id: number
    name: string
    lat: number
    lon: number
    rank: number,
    isFallow: boolean,
    lice?: number
    organizations?: string[]
    purposes?: string[]
    productionTypes?: string[]
    species?: string[]
    placement?: string
}

export interface Filters {
    fallow: boolean
    organizations: string[]
}