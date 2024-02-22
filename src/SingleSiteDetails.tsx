import { Component, Show, createSignal, onMount } from "solid-js";
import { BasicWeek } from "./types";
import { Windrose } from "./components/windrose";
import { WeekLineChart, mapLiceData } from "./components/weeklyPlot";


interface SingleSiteDetailsProps {
    site: BasicWeek
    time: {
        year: number
        week: number
    }
}

export const SingleSiteDetails: Component<SingleSiteDetailsProps> = ({ site, time }) => {
    const [windData, setWindData] = createSignal<any>();
    const [liceData, setLiceData] = createSignal<any>();

    let marinogram: HTMLImageElement;
    let meteogram: HTMLDivElement;

    onMount(() => {
        fetch(`/windrose?lat=${site.lat}&lon=${site.lon}`)
            .then(r => r.json())
            .then(setWindData);

        fetch(`/lice?localities=${site.id}&from_year=${time.year - 1}&from_week=${time.week}&to_year=${time.year}&to_week=${time.week}`)
            .then(resp => resp.json())
            .then(setLiceData);

        marinogram.src = `https://jtimeseries.k8s.met.no/jtimeseries-webservices/marinogram?latitude=${site.lat}&longitude=${site.lon}&waterTemperature=true&airTemperature=true&dewpointTemperature=true&pressure=true&waveHeight=true&waveDirection=true&currentDirection=true&currentSpeed=true&windDirection=true&windSpeed=true&timezone=Europe%2FOslo&language=en`;
    })

    return (
        <div class="pl-64 ml-4 mt-4">
            <h2 class="text-white font-bold text-2xl">{site.name}</h2>

            <div class="grid grid-cols-2 gap-x-8 gap-y-6 pb-12 mt-2 w-full justify-stretch">
                <div>
                    <h3 class="text-white/80 font-semibold text-xl mb-1">Lice counts</h3>
                    <div class="h-[508px]">
                        <Show when={liceData()} fallback={"loading..."}>
                            <WeekLineChart liceData={liceData} sites={[site]} />
                        </Show>
                    </div>

                </div>
                <div>
                    <h3 class="text-white/80 font-semibold text-xl">Wind rose <span class="text-sm">(9-day forecast)</span></h3>
                    <div class="h-[508px]">
                        <Show when={windData()} fallback={"loading..."}>
                            <Windrose data={windData()} />
                        </Show>
                    </div>
                </div>

                <div ref={meteogram}>
                    <h3 class="text-white/80 font-semibold text-xl mb-1">Meteogram</h3>
                    <img class="rounded-md" src={`https://www.yr.no/en/content/70.54,11.23/meteogram.svg?mode=dark`} />
                </div>
                <div>
                    <h3 class="text-white/80 font-semibold text-xl mb-1">Marinogram</h3>
                    <img class="rounded-md" ref={marinogram} />
                </div>
            </div>
        </div>
    )
}
