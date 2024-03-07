import { Component, Show, createEffect, createSignal } from "solid-js";
import { BasicWeek } from "./types";
import { Windrose } from "./components/windrose";
import { WeekLineChart } from "./components/weeklyPlot";
import { useState } from "./state";


interface SingleSiteDetailsProps {
    site: BasicWeek
}

export const SingleSiteDetails: Component<SingleSiteDetailsProps> = (props) => {
    const [windData, setWindData] = createSignal<any>();
    const [liceData, setLiceData] = createSignal<any>();

    const [state, _] = useState();

    const seaTemp = () => {
        if (liceData())
            return liceData()[props.site.id][liceData()[props.site.id].length - 1].seaTemperature?.toFixed(1) ?? "NA";
        else
            return "";
    }

    let marinogram: HTMLImageElement;
    let meteogram: HTMLDivElement;

    createEffect(() => {
        fetch(`/windrose?lat=${props.site.lat}&lon=${props.site.lon}`)
            .then(r => r.json())
            .then(setWindData);

        fetch(`/lice?localities=${props.site.id}&from_year=${state.time.year - 1}&from_week=${state.time.week}&to_year=${state.time.year}&to_week=${state.time.week}`)
            .then(resp => resp.json())
            .then(data => {
                for (let d in data) {
                    data[d].sort((a, b) => {
                        if (a.year != b.year)
                            return a.year - b.year;
                        else
                            return a.week - b.week;
                    })
                }
                return data;
            })
            .then(setLiceData);

        marinogram.src = `https://jtimeseries.k8s.met.no/jtimeseries-webservices/marinogram?latitude=${props.site.lat}&longitude=${props.site.lon}&waterTemperature=true&airTemperature=true&dewpointTemperature=true&pressure=true&waveHeight=true&waveDirection=true&currentDirection=true&currentSpeed=true&windDirection=true&windSpeed=true&timezone=Europe%2FOslo&language=en`;
    })

    return (
        <div class="pl-64 ml-4 mt-4">
            <div class="flex gap-2 items-center">
                <div class="text-white font-bold text-2xl">{props.site.name}</div>
                <div class="bg-neutral-800 text-neutral-300 text-sm px-2 py-[2px] rounded">
                    week {state.time.week}
                </div>
            </div>

            <div class="grid grid-cols-2 gap-x-8 gap-y-6 pb-12 mt-2 w-full justify-stretch">
                <div class="flex flex-col justify-between">
                    <div class="flex gap-8 py-4">
                        <NumberDisplay value={props.site.lice?.toFixed(2) ?? "NA"} subtitle="Adult female lice" />
                        <NumberDisplay value={`${seaTemp()}°c`} subtitle="Sea temperature" />
                    </div>
                    <div ref={meteogram}>
                        <h3 class="text-white/80 font-semibold text-xl mb-1">Meteogram</h3>
                        <img class="rounded-md" src={`https://www.yr.no/en/content/70.54,11.23/meteogram.svg?mode=dark`} />
                    </div>
                </div>

                <div>
                    <h3 class="text-white/80 font-semibold text-xl mb-1">Marinogram</h3>
                    <img class="rounded-md" ref={marinogram} />
                </div>

                <div>
                    <h3 class="text-white/80 font-semibold text-xl mb-1">Lice counts <span class="text-sm">(Adult female lice)</span></h3>
                    <div class="h-[480px]">
                        <Show when={liceData()} fallback={"loading..."}>
                            <WeekLineChart liceData={liceData} sites={[props.site]} />
                        </Show>
                    </div>
                </div>
                <div>
                    <h3 class="text-white/80 font-semibold text-xl">Wind rose <span class="text-sm">(9-day forecast)</span></h3>
                    <div class="h-[480px]">
                        <Show when={windData()} fallback={"loading..."}>
                            <Windrose data={windData()} />
                        </Show>
                    </div>
                </div>
            </div>
        </div>
    )
}

const NumberDisplay: Component<{ value: number | string, subtitle: string }> = (props) => {
    return (
        <div>
            <h1 class="text-white text-4xl">{props.value}</h1>
            <h2 class="text-iliad mt-[-5px]">{props.subtitle}</h2>
        </div>
    )
}