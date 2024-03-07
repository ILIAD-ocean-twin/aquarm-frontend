import { createSignal, type Component, For, createEffect, Switch, Match, createResource } from 'solid-js';
import { createStore } from "solid-js/store";
import { MapContainer } from './MapContainer';
import { BasicWeek, SiteSelection } from './types';
import { Select, createOptions } from "@thisbeyond/solid-select";
import "@thisbeyond/solid-select/style.css";
import { SingleSiteDetails } from './SingleSiteDetails';
import { OverviewDetails } from './OverviewDetails';
import { MultiSelectDetails } from './MultiSelectDetails';
import { LAYERS } from './constants';
import { useState } from './state';


const App: Component = () => {
  const [state, setState] = useState();
  const [data] = createResource(() => [state.time.year, state.time.week], fetchBasic, { initialValue: [] })

  const [selectedSites, setSelectedSites] = createSignal<SiteSelection[]>([]);
  const [selectedData, setSelectedData] = createSignal<BasicWeek[]>([]);

  const [layers, setLayers] = createStore(
    LAYERS.map(name => ({ name, visible: false }))
  );

  const toggleLayer = (layer: string) => {
    setLayers(l => l.name === layer, "visible", visible => !visible);
  }

  const setSelectedOrgs = (orgs: string[]) => {
    setState("filters", "organizations", orgs)
  }

  createEffect(() => {
    const ids = selectedSites().map(s => s.id);
    setSelectedData(data().filter(d => ids.includes(d.id)));
  })

  createEffect(() => {
    const orgs = [...data().reduce((agg, cur) => {
      cur.organizations?.forEach(org => agg.add(org));
      return agg;
    }, new Set<string>())];

    setState("filters", "organizations", orgs);
  })

  return (
    <div class="container mx-auto mt-6 font-nunito">
      <div class="flex gap-4">
        <div class="w-64 text-white">
          <h2 class="text-lg font-semibold text-iliad mb-2">Filters</h2>
          <div class="flex flex-col gap-4">
            <div>
              <h2 class="w-14 inline-block">Year</h2>
              <input
                class="bg-slate-500 p-1 w-20 rounded"
                type='number'
                value={state.time.year}
                min={2012}
                max={2024}
                onChange={e => setState("time", "year", e.target.valueAsNumber)}
              />
            </div>

            <div>
              <h2 class="w-14 inline-block">Week</h2>
              <input
                class="bg-slate-500 p-1 w-20 rounded"
                type="number"
                value={state.time.week}
                min={1}
                max={52}
                onChange={e => setState("time", "week", e.target.valueAsNumber)}
              />
            </div>

            <label class="select-none">
              Show fallow:
              <input
                class="ml-2 cursor-pointer"
                checked={state.filters.fallow}
                onchange={() => setState("filters", "fallow", !state.filters.fallow)}
                type="checkbox" />
            </label>

            <div class="mb-3 text-black">
              <h2 class="text-white mb-1">Owner organization:</h2>
              <Select class='bg-slate-500 rounded text-sm' multiple {...createOptions(state.filters.organizations)} onChange={setSelectedOrgs} />
            </div>
          </div>

          <h2 class="text-lg font-semibold text-iliad my-2">Data layers</h2>
          <div class="flex flex-col gap-4">

            <For each={layers}>
              {dl =>
                <label class="select-none">
                  {dl.name}:
                  <input
                    class="ml-2 cursor-pointer"
                    checked={dl.visible}
                    onchange={() => toggleLayer(dl.name)}
                    type="checkbox" />
                </label>
              }
            </For>
          </div>

        </div>
        <div class="grow h-[800px]">
          <MapContainer data={data} dataLayers={layers} setSelectedSites={setSelectedSites} />
        </div>
      </div>

      <Switch>
        <Match when={selectedData().length == 0}>
          <OverviewDetails data={data} />
        </Match>
        <Match when={selectedData().length == 1}>
          <SingleSiteDetails site={selectedData()[0]} />
        </Match>
        <Match when={selectedData().length > 1}>
          <MultiSelectDetails sites={selectedData} setSelectedSites={setSelectedSites} selectedSites={selectedSites} />
        </Match>
      </Switch>
    </div>
  );
};

const fetchBasic = async (time: number[]) =>
  fetch(`/basic-all/${time[0]}/${time[1]}`)
    .then(d => d.json() as Promise<BasicWeek[]>)
    .then(d => d.filter(bw => bw.placement == "SJØ"));

export default App;