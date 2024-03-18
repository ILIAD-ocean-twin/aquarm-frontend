import { Accessor, Component, For, Show, batch, createEffect, createResource, createSignal, untrack } from "solid-js";
import { BasicWeek } from "./types";
import { LineChart } from "./components/LineChart";
import { CorrelationMatrix } from "./components/Matrix";
import { useState } from "./state";
import { Spinner } from "./components/Spinner";
import { fetchHistoricData } from "./utils";
import { API_URL } from "./constants";

interface MultiSelectDetailsProps {
  sites: Accessor<BasicWeek[]>
}

export const MultiSelectDetails: Component<MultiSelectDetailsProps> = ({ sites }) => {
  const [state, setState] = useState();

  const [historicData] = createResource(
    () => [state.selectedSites, state.time.year, state.time.week],
    fetchHistoricData);

  const [connectivityData] = createResource(
    () => state.selectedSites,
    fetchConnectivityData);

  const deselect = (siteId: number) => {
    setState("selectedSites", c => c.filter(c => c != siteId));
  }

  const names = () => sites().reduce((p, c) => { p[c.id] = c.name; return p; }, {})

  const [lice, setLice] = createSignal({ series: [], ticks: [] });
  const [temp, setTemp] = createSignal({ series: [], ticks: [] });

  createEffect(() => {
    const data = historicData();
    if (!data)
      return;

    const tempSeries = [];
    const liceSeries = [];

    untrack(() => {
      for (let loc of state.selectedSites) {
        tempSeries.push({
          type: 'line',
          name: names()[loc],
          data: data[loc].map(l => l.seaTemperature)
        });
        liceSeries.push({
          type: 'line',
          name: names()[loc],
          data: data[loc].map(l => l.avgAdultFemaleLice)
        });
      }
    });

    const ticks = Object.values(data)[0].map(d => `W${d.week}/${d.year}`);

    batch(() => {
      setTemp({ series: tempSeries, ticks });
      setLice({ series: liceSeries, ticks });
    })
  })

  return (
    <div class="mt-4">
      <div class="flex gap-2 h-9">
        <For each={state.selectedSites}>{s =>
          <div
            class="text-white flex font-bold text-xl bg-slate-600 rounded-full px-4 py-1">
            {names()[s]}
            <div class="ml-3 cursor-pointer mt-[-1px] text-white/50 hover:text-white/30"
              onclick={() => deselect(s)}>
              x
            </div>
          </div>
        }</For>
        <Show when={connectivityData.loading}>
          <div>
            <Spinner />
          </div>
        </Show>
      </div>

      <div class="pb-12 mt-4 w-full">
        <div>
          <h3 class="text-white/80 font-semibold text-xl mb-1">Lice counts <span class="text-sm">(Adult female lice)</span></h3>
          <div class="h-[360px] w-full">
            <LineChart data={lice} />
          </div>
        </div>
        <div>
          <h3 class="text-white/80 font-semibold text-xl mb-1">Sea temperature <span class="text-sm">(°C)</span></h3>
          <div class="h-[360px] w-full">
            <LineChart data={temp} />
          </div>
        </div>
        <div class="">
          <h3 class="text-white/80 font-semibold text-xl mb-2">Connectivity</h3>
          <Show when={connectivityData()} fallback={"loading..."}>
            <CorrelationMatrix matrix={connectivityData} sites={sites} />
          </Show>
        </div>
      </div>
    </div>
  )
}

const fetchConnectivityData = async (locs: number[]) =>
  fetch(API_URL + `/connectivity?localities=${locs.join(",")}`)
    .then(resp => resp.json());
