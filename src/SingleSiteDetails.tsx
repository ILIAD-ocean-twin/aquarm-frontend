import { Component, Show, createEffect, createResource } from "solid-js";
import { BasicWeek } from "./types";
import { Windrose } from "./components/windrose";
import { WeekLineChart } from "./components/weeklyPlot";
import { useState } from "./state";
import { Spinner } from "./components/Spinner";


interface SingleSiteDetailsProps {
    site: BasicWeek
}

export const SingleSiteDetails: Component<SingleSiteDetailsProps> = (props) => {
    const [state, _] = useState();

    const [windData] = createResource(
        [props.site.lat, props.site.lon],
        fetchWindForecast);

    const [liceData] = createResource(
        () => [state.selectedSites[0], state.time.year, state.time.week],
        fetchLiceData);

    const seaTemp = () => {
        if (!liceData.loading) {
            const data = liceData()[props.site.id];
            const temp = data[data.length - 1].seaTemperature?.toFixed(1);
            return temp ? temp + "°c" : "NA";
        }
        else
            return undefined;
    }

    let marinogram: HTMLImageElement;
    let meteogram: HTMLImageElement;

    createEffect(() => {
        // meteogram.src = `https://www.yr.no/en/content/${props.site.lat},${props.site.lon}/meteogram.svg?mode=dark`;
        // marinogram.src = `https://jtimeseries.k8s.met.no/jtimeseries-webservices/marinogram?latitude=${props.site.lat}&longitude=${props.site.lon}&waterTemperature=true&airTemperature=true&dewpointTemperature=true&pressure=true&waveHeight=true&waveDirection=true&currentDirection=true&currentSpeed=true&windDirection=true&windSpeed=true&timezone=Europe%2FOslo&language=en`;
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
                        <NumberDisplay value={seaTemp()} subtitle="Sea temperature" />
                    </div>
                    <div>
                        <h3 class="text-white/80 font-semibold text-xl mb-1">Meteogram</h3>
                        <img class="rounded-md" ref={meteogram} />
                    </div>
                </div>

                <div>
                    <h3 class="text-white/80 font-semibold text-xl mb-1">Marinogram</h3>
                    <img class="rounded-md" ref={marinogram} />
                </div>

                <div>
                    <h3 class="text-white/80 font-semibold text-xl mb-1">Lice counts <span class="text-sm">(Adult female lice)</span></h3>
                    <div class="h-[480px]">
                        <Show when={!liceData.loading} fallback={"loading..."}>
                            <WeekLineChart liceData={liceData} sites={[props.site]} />
                        </Show>
                    </div>
                </div>
                <div>
                    <h3 class="text-white/80 font-semibold text-xl">Wind rose <span class="text-sm">(9-day forecast)</span></h3>
                    <div class="h-[480px]">
                        <Show when={!windData.loading} fallback={"loading..."}>
                            <Windrose data={windData()} />
                        </Show>
                    </div>
                </div>
            </div>
        </div>
    )
}

const NumberDisplay: Component<{ value: number | string | undefined, subtitle: string }> = (props) => {
    return (
        <div>
            <h1 class="text-white text-4xl">{props.value ?? <Spinner />}</h1>
            <h2 class="text-iliad mt-[-5px]">{props.subtitle}</h2>
        </div>
    )
}

const fetchWindForecast = ([lat, lon]) =>
    fetch(`/windrose?lat=${lat}&lon=${lon}`).then(r => r.json());

const fetchLiceData = ([id, year, week]) =>
    fetch(`/lice?localities=${id}&from_year=${year - 1}&from_week=${week}&to_year=${year}&to_week=${week}`)
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
        });