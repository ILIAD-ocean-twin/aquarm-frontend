import { API_URL } from "./constants";
import { HistoricSiteData, JellyfishObservation } from "./types";

export async function fetchHistoricData([locs, year, week]: [number[], number, number]): Promise<Record<string, HistoricSiteData[]>> {
  return fetch(API_URL + `/lice?localities=${locs.join(",")}&from_year=${year - 1}&from_week=${week}&to_year=${year}&to_week=${week}`)
    .then(resp => resp.json())
    .then(data => {
      for (let d in data) {
        data[d].sort(compareYearWeek);
        data[d].avgAdultFemaleLice = data[d].avgAdultFemaleLice ?? 0;
      }
      return data;
    });
}

function compareYearWeek(a: HistoricSiteData, b: HistoricSiteData) {
  if (a.year != b.year)
    return a.year - b.year;
  else
    return a.week - b.week;
}

export async function fetchJellyfish(year: number, week: number): Promise<JellyfishObservation[]> {
  return fetch(API_URL + `/jellyfish?year=${year}&week=${week}`)
    .then(resp => resp.json() as Promise<JellyfishObservation[]>);
}