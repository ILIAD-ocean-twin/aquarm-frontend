import { Accessor, Component, Show, createEffect, createSignal, onMount } from "solid-js";
import { BasicWeek } from "./types";
import { WeekLineChart, mapLiceData } from "./components/weeklyPlot";
import { CorrelationMatrix } from "./Matrix";


interface MultiSelectDetailsProps {
    sites: Accessor<BasicWeek[]>
    time: {
        year: number
        week: number
    }
}

export const MultiSelectDetails: Component<MultiSelectDetailsProps> = (props) => {

    const [liceData, setLiceData] = createSignal<any>();
    // const [connData, setConnData] = createSignal<any>();

    createEffect(() => {
        const locs = props.sites().map(s => s.id)
        fetch(`/lice?localities=${locs.join(",")}&from_year=${props.time.year - 1}&from_week=${props.time.week}&to_year=${props.time.year}&to_week=${props.time.week}`)
            .then(resp => resp.json())
            .then(setLiceData);
        /*
        fetch(`/connectivity?localities=${locs}`)
            .then(resp => resp.json())
            .then(data => {
                console.log(data)
                setConnData(data)
            })
        */
    })

    return (
        <div class="pl-64 ml-4 mt-4">
            <h2 class="text-white font-bold text-2xl">{props.sites().map(s => s.name + " - ")}</h2>

            <div class="gridgap-x-8 gap-y-6 pb-12 mt-2 w-full justify-stretch">
                <div>
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
<Show when={connData()} fallback={"loading..."}>
   <CorrelationMatrix {...connData()} />
</Show>
*/