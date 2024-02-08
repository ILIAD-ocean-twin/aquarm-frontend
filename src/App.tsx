import { createSignal, type Component, For, onMount, createEffect, Accessor } from 'solid-js';
import { createStore } from "solid-js/store";
import { MapContainer } from './MapContainer';
import { BasicWeek, Filters, SiteSelection } from './types';
import { Select, createOptions } from "@thisbeyond/solid-select";
import "@thisbeyond/solid-select/style.css";


const App: Component = () => {
  const [data, setData] = createSignal<BasicWeek[]>([]);
  const [filters, setFilters] = createStore<Filters>({ fallow: true, organizations: [] });
  const [orgs, setOrgs] = createSignal<string[]>([]);

  const [timeSelection, setTimeSelection] = createSignal<{ year: number, week: number }>({ year: 2023, week: 52 });

  const [selectedSites, setSelectedSites] = createSignal<SiteSelection[]>([]);

  const toggleFallow = () => {
    setFilters({ fallow: !filters.fallow });
  }

  const setSelectedOrgs = (orgs: string[]) => {
    setFilters({ organizations: orgs })
  }

  onMount(() => {
    fetch("/basic-all/2023/52")
      .then(d => d.json() as Promise<BasicWeek[]>)
      .then(d => d.filter(bw => bw.placement == "SJØ"))
      .then(setData);
  });

  createEffect(() => {
    fetch(`/basic-all/${timeSelection().year}/${timeSelection().week}`)
      .then(d => d.json() as Promise<BasicWeek[]>)
      .then(d => d.filter(bw => bw.placement == "SJØ"))
      .then(setData);
  })

  createEffect(() => {
    setOrgs([...data().reduce((agg, cur) => {
      cur.organizations?.forEach(org => agg.add(org));
      return agg;
    }, new Set<string>())]);
  })

  return (
    <div class="container mx-auto mt-6 ">
      <div class="flex gap-4">
        <div class="w-64 text-white">

          <h2 class="w-12 inline-block mb-3">Year:</h2>
          <input class="bg-slate-500 p-1" type='number' value={timeSelection().year}
            onChange={(e) => setTimeSelection({ year: e.target.valueAsNumber, week: timeSelection().week })}
          />

          <h2 class="w-12 inline-block mb-3">Week:</h2>
          <input class="bg-slate-500 p-1" type="number" value={timeSelection().week}
            onChange={(e) => setTimeSelection({ week: e.target.valueAsNumber, year: timeSelection().year })}
          />

          <label class="select-none mb-3">
            Show fallow:
            <input
              class="ml-2 cursor-pointer"
              checked={filters.fallow}
              onchange={() => toggleFallow()}
              type="checkbox" />
          </label>

          <div class="mb-3 text-black">
            <h2 class="text-white mb-1 mt-3">Owner organization:</h2>
            <Select class='bg-slate-500 rounded text-sm' multiple {...createOptions(orgs())} onChange={setSelectedOrgs} />
          </div>

        </div>
        <div class="grow h-[800px]">
          <MapContainer data={data} filters={filters} selectedSites={selectedSites} setSelectedSites={setSelectedSites} />
        </div>
      </div>
      {selectedSites().map(s => `[${s.id}, ${s.coords}], `)}
    </div>
  );
};

export default App;
