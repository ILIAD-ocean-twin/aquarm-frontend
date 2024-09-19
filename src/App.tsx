import { type Component, createEffect, Switch, Match, createResource, onMount } from 'solid-js';
import { MapContainer } from './MapContainer';
import { BasicWeek, OimEntry } from './types';
import { SingleSiteDetails } from './SingleSiteDetails';
import { OverviewDetails } from './OverviewDetails';
import { MultiSelectDetails } from './MultiSelectDetails';
import { useState } from './state';
import { IDataLayer } from './layers/IDataLayer';
import { MunicipalityLayer } from './layers/MunicipalityLayer';
import { ProductionAreaLayer } from './layers/ProductionAreaLayer';
import { OceanTempLayer } from './layers/OceanTempLayer';
import { WeatherWarningLayer } from './layers/RiskLayer';
import { TrajectoryLayer } from './layers/TrajectoryLayer';
import { API_URL } from './constants';
import { CurrentRatingLayer } from './layers/CurrentRatingLayer';
import { TemperatureRatingLayer } from './layers/TemperatureRatingLayer';
import { SalinityRatingLayer } from './layers/SalinityRatingLayer';
import { StormRatingLayer } from './layers/StormRatingLayer';
import { JellyfishLayer } from './layers/JellyfishLayer';


const App: Component = () => {
  const [state, setState] = useState();
  const [data] = createResource(() => [state.time.year, state.time.week], fetchBasic, { initialValue: [] })
  const selectedData = () => data().filter(d => state.selectedSites.includes(d.id));
  const numSelected = () => state.selectedSites.length;

  const layers: IDataLayer[] = [
    new JellyfishLayer(state.time.year, state.time.week),
    new WeatherWarningLayer(),
    new OceanTempLayer(state.time.year, state.time.week),
    new TrajectoryLayer(),
    new MunicipalityLayer(),
    new ProductionAreaLayer(),
    new StormRatingLayer(),
    new TemperatureRatingLayer(),
    new SalinityRatingLayer(),
  ];

  onMount(() => {
    fetchOimTerms()
      .then(terms => setState("oim", terms))
  })

  createEffect(() => {
    const orgs = [...data().reduce((agg, cur) => {
      cur.organizations?.forEach(org => agg.add(org));
      return agg;
    }, new Set<string>())];

    setState("allOrganizations", orgs);
  })

  return (
    <>
      <nav class="font-nunito bg-black/20 text-white py-1">
        <div class="flex justify-between container mx-auto">
          <div>ILIAD Aquaculture Pilot</div>
          <div class="grow text-center">
            <span class="text-amber-400"> Intended for demonstration only: </span>
            <span class="text-amber-500"> There may be errors and inaccuracies present in the datasets and visualizations</span>
          </div>
        </div>
      </nav>

      <div class="container mx-auto mt-6 font-nunito">
        <div class="h-[800px]">
          <MapContainer data={data} dataLayers={layers} />
        </div>

        <Switch>
          <Match when={numSelected() == 0}>
            <OverviewDetails data={data} />
          </Match>
          <Match when={numSelected() == 1}>
            <SingleSiteDetails site={selectedData()[0]} />
          </Match>
          <Match when={numSelected() > 1}>
            <MultiSelectDetails sites={selectedData} />
          </Match>
        </Switch>
      </div>
    </>
  );
};

const fetchBasic = async (time: number[]) =>
  fetch(API_URL + `/basic-all/${time[0]}/${time[1]}`)
    .then(d => d.json() as Promise<BasicWeek[]>)
    .then(d => d.filter(bw => bw.placement == "SJØ"));

const fetchOimTerms = async () =>
  fetch(API_URL + "/oim")
    .then(d => d.json())

export default App;