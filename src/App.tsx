import { createSignal, type Component, For, createEffect, Switch, Match } from 'solid-js';
import { createStore } from "solid-js/store";
import { MapContainer } from './MapContainer';
import { BasicWeek, Filters, SiteSelection } from './types';
import { Select, createOptions } from "@thisbeyond/solid-select";
import "@thisbeyond/solid-select/style.css";
import { SingleSiteDetails } from './SingleSiteDetails';
import { OverviewDetails } from './OverviewDetails';
import { MultiSelectDetails } from './MultiSelectDetails';
import { LAYERS } from './constants';


const App: Component = () => {
  const [data, setData] = createSignal<BasicWeek[]>([]);
  const [filters, setFilters] = createStore<Filters>({ fallow: true, organizations: [] });
  const [orgs, setOrgs] = createSignal<string[]>([]);
  const [timeSelection, setTimeSelection] = createSignal<{ year: number, week: number }>({ year: 2024, week: 6 });
  const [selectedSites, setSelectedSites] = createSignal<SiteSelection[]>([]);
  const [selectedData, setSelectedData] = createSignal<BasicWeek[]>([]);

  const [layers, setLayers] = createStore(
    LAYERS.map(name => ({ name, visible: false }))
  );

  const toggleLayer = (layer: string) => {
    setLayers(l => l.name === layer, "visible", visible => !visible);
  }

  const toggleFallow = () => {
    setFilters({ fallow: !filters.fallow });
  }

  const setSelectedOrgs = (orgs: string[]) => {
    setFilters({ organizations: orgs })
  }

  createEffect(async () => {
    fetch(`/basic-all/${timeSelection().year}/${timeSelection().week}`)
      .then(d => d.json() as Promise<BasicWeek[]>)
      .then(d => d.filter(bw => bw.placement == "SJØ"))
      .then(setData);
  })

  createEffect(() => {
    const ids = selectedSites().map(s => s.id);
    setSelectedData(data().filter(d => ids.includes(d.id)));
  })

  createEffect(() => {
    setOrgs([...data().reduce((agg, cur) => {
      cur.organizations?.forEach(org => agg.add(org));
      return agg;
    }, new Set<string>())]);
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
                class="bg-slate-500 p-1 w-20"
                type='number'
                value={timeSelection().year}
                min={2012}
                max={2024}
                onChange={(e) => setTimeSelection({ year: e.target.valueAsNumber, week: timeSelection().week })}
              />
            </div>

            <div>
              <h2 class="w-14 inline-block">Week:</h2>
              <input
                class="bg-slate-500 p-1 w-20"
                type="number"
                value={timeSelection().week}
                min={1}
                max={52}
                onChange={(e) => setTimeSelection({ week: e.target.valueAsNumber, year: timeSelection().year })}
              />
            </div>

            <label class="select-none">
              Show fallow:
              <input
                class="ml-2 cursor-pointer"
                checked={filters.fallow}
                onchange={() => toggleFallow()}
                type="checkbox" />
            </label>

            <div class="mb-3 text-black">
              <h2 class="text-white mb-1">Owner organization:</h2>
              <Select class='bg-slate-500 rounded text-sm' multiple {...createOptions(orgs())} onChange={setSelectedOrgs} />
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
          <MapContainer data={data} dataLayers={layers} timeSelection={timeSelection} filters={filters} selectedSites={selectedSites} setSelectedSites={setSelectedSites} />
        </div>
      </div>

      <Switch>
        <Match when={selectedData().length == 0}>
          <OverviewDetails data={data} filters={filters} />
        </Match>
        <Match when={selectedData().length == 1}>
          <SingleSiteDetails site={selectedData()[0]} time={timeSelection()} />
        </Match>
        <Match when={selectedData().length > 1}>
          <MultiSelectDetails sites={selectedData()} time={timeSelection()} />
        </Match>
      </Switch>
    </div>
  );
};

export default App;
