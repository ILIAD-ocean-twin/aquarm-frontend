import { Accessor, Component, For, Show, createEffect, createResource, createSignal } from "solid-js";
import { BasicWeek } from "./types";
import { WeekLineChart } from "./components/weeklyPlot";
import { CorrelationMatrix } from "./components/Matrix";
import { useState } from "./state";
import { Spinner } from "./components/Spinner";


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
            <div class="flex gap-2">
                <For each={sites()}>{s =>
                    <div
                        class="text-white font-bold text-xl bg-slate-600 rounded-full px-4 py-1">
                        {s.name}
                        <div class="inline-block ml-2 cursor-pointer"
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

            <div class="pb-12 mt-2 w-full">
                <div class="">
                    <h3 class="text-white/80 font-semibold text-xl mb-2">Connectivity</h3>
                    <Show when={connectivityData()} fallback={"loading..."}>
                        <CorrelationMatrix matrix={connectivityData} sites={sites} />
                    </Show>
                </div>

                <div class="mt-10">
                    <h3 class="text-white/80 font-semibold text-xl mb-1">Lice counts</h3>
                    <div class="h-[508px] w-full">
                        <Show when={liceData()} fallback={"loading..."}>
                            <WeekLineChart liceData={liceData} sites={sites()} />
                        </Show>
                    </div>
                </div>
            </div>
        </div>
    )
}

const fetchLiceData = async ([locs, year, week]: [number[], number, number]) =>
    fetch(`/lice?localities=${locs.join(",")}&from_year=${year - 1}&from_week=${week}&to_year=${year}&to_week=${week}`)
        .then(resp => resp.json())
        .then(data => {
            for (let d in data) {
                data[d].sort((a, b) => {
                    if (a.year != b.year)
                        return a.year - b.year;
                    else
                        return a.week - b.week;
                })
                data[d].avgAdultFemaleLice = data[d].avgAdultFemaleLice ?? 0;
            }
            return data;
        });

const fetchConnectivityData = async (locs: number[]) =>
    fetch(`/connectivity?localities=${locs.join(",")}`)
        .then(resp => resp.json());
