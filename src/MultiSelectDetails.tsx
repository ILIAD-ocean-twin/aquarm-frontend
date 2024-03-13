import { Accessor, Component, For, Show, createResource } from "solid-js";
import { BasicWeek } from "./types";
import { WeeklyLiceChart } from "./components/WeeklyLiceChart";
import { CorrelationMatrix } from "./components/Matrix";
import { useState } from "./state";
import { Spinner } from "./components/Spinner";
import { fetchLiceData } from "./utils";
import { WeeklyTemperatureChart } from "./components/WeeklyTemperatureChart";


interface MultiSelectDetailsProps {
    sites: Accessor<BasicWeek[]>
}

export const MultiSelectDetails: Component<MultiSelectDetailsProps> = ({ sites }) => {
    const [state, setState] = useState();
    const [liceData] = createResource(
        () => [state.selectedSites, state.time.year, state.time.week],
        fetchLiceData);

    const [connectivityData] = createResource(
        () => state.selectedSites,
        fetchConnectivityData);

    const deselect = (siteId: number) => {
        setState("selectedSites", c => c.filter(c => c != siteId));
    }

    return (
        <div class="pl-64 ml-4 mt-4">
            <div class="flex gap-2 h-9">
                <For each={sites()}>{s =>
                    <div
                        class="text-white flex font-bold text-xl bg-slate-600 rounded-full px-4 py-1">
                        {s.name}
                        <div class="ml-3 cursor-pointer mt-[-1px] text-white/50 hover:text-white/30"
                            onclick={() => deselect(s.id)}>
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
                        <Show when={liceData()} fallback={"loading..."}>
                            <WeeklyLiceChart liceData={liceData} sites={sites()} />
                        </Show>
                    </div>
                </div>
                <div>
                    <h3 class="text-white/80 font-semibold text-xl mb-1">Sea temperature <span class="text-sm">(°C)</span></h3>
                    <div class="h-[360px] w-full">
                        <Show when={liceData()} fallback={"loading..."}>
                            <WeeklyTemperatureChart liceData={liceData} sites={sites()} />
                        </Show>
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
    fetch(`/connectivity?localities=${locs.join(",")}`)
        .then(resp => resp.json());
