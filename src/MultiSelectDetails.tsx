import { Accessor, Component, For, Setter, Show, createEffect, createSignal } from "solid-js";
import { BasicWeek, SiteSelection } from "./types";
import { WeekLineChart } from "./components/weeklyPlot";
import { CorrelationMatrix } from "./components/Matrix";
import { useState } from "./state";


interface MultiSelectDetailsProps {
    sites: Accessor<BasicWeek[]>
    selectedSites: Accessor<SiteSelection[]>
    setSelectedSites: Setter<SiteSelection[]>
}

export const MultiSelectDetails: Component<MultiSelectDetailsProps> = (props) => {
    const [liceData, setLiceData] = createSignal<any>();
    const [connData, setConnData] = createSignal<any>();

    const [state, _] = useState();

    createEffect(() => {
        const locs = props.sites().map(s => s.id)
        updateLiceData(locs);
        updateConnectivityData(locs);
    })

    const updateLiceData = async (locs: number[]) => {
        fetch(`/lice?localities=${locs.join(",")}&from_year=${state.time.year - 1}&from_week=${state.time.week}&to_year=${state.time.year}&to_week=${state.time.week}`)
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
            })
            .then(setLiceData);
    }

    const updateConnectivityData = async (locs: number[]) => {
        fetch(`/connectivity?localities=${locs}`)
            .then(resp => resp.json())
            .then(setConnData);
    }

    const deselect = (siteId: number) => {
        props.setSelectedSites(props.selectedSites().filter(s => s.id !== siteId))
    }

    return (
        <div class="pl-64 ml-4 mt-4">
            <div class="flex gap-2">
                <For each={props.sites()}>{s =>
                    <div
                        class="text-white font-bold text-xl bg-slate-600 rounded-full px-4 py-1">
                        {s.name}
                        <div class="inline-block ml-2 cursor-pointer"
                            onclick={() => deselect(s.id)}>

                        </div>
                    </div>
                }</For>
            </div>

            <div class="pb-12 mt-2 w-full">
                <div class="">
                    <h3 class="text-white/80 font-semibold text-xl mb-2">Connectivity</h3>
                    <Show when={connData()} fallback={"loading..."}>
                        <CorrelationMatrix matrix={connData} sites={props.sites} />
                    </Show>
                </div>

                <div class="mt-10">
                    <h3 class="text-white/80 font-semibold text-xl mb-1">Lice counts</h3>
                    <div class="h-[508px] w-full">
                        <Show when={liceData()} fallback={"loading..."}>
                            <WeekLineChart liceData={liceData} sites={props.sites()} />
                        </Show>
                    </div>
                </div>
            </div>
        </div>
    )
}
/*
const SitePill: Component<{ name: string }> = ({ name }) => (
    <div>
        {name} {props.sites().map(s => s.name).join(" - ")}
    </div>
)*/