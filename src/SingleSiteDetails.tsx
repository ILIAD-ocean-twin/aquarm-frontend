import { Component, Show, createSignal, onMount } from "solid-js";
import { BasicWeek } from "./types";
import { Windrose } from "./components/windrose";


interface SingleSiteDetailsProps {
    site: BasicWeek
}

export const SingleSiteDetails: Component<SingleSiteDetailsProps> = ({ site }) => {
    const [windData, setWindData] = createSignal<any>();
    let marinogram: HTMLImageElement;
    let meteogram: HTMLDivElement;

    onMount(() => {
        fetch(`/windrose?lat=${site.lat}&lon=${site.lon}`)
            .then(r => r.json())
            .then(setWindData);
        marinogram.src = `https://jtimeseries.k8s.met.no/jtimeseries-webservices/marinogram?latitude=${site.lat}&longitude=${site.lon}&waterTemperature=true&airTemperature=true&dewpointTemperature=true&pressure=true&waveHeight=true&waveDirection=true&currentDirection=true&currentSpeed=true&windDirection=true&windSpeed=true&timezone=Europe%2FOslo&language=en`;
    })

    return (
        <div class="pl-64 ml-4 mt-4">
            <h2 class="text-white font-bold text-2xl">{site.name}</h2>

            <div class="grid grid-cols-2 gap-6 gap-y-8 mt-2 w-full justify-stretch">
                <div>
                    <h3 class="text-white/80 font-semibold text-xl mb-1">Lice counts</h3>
                </div>
                <div ref={meteogram}>
                    <h3 class="text-white/80 font-semibold text-xl mb-1">Meteogram</h3>
                    <img class="rounded-md" src={`https://www.yr.no/en/content/70.54,11.23/meteogram.svg?mode=dark`} />
                </div>

                <div>
                    <Show when={windData()}>
                        <>
                            <h3 class="text-white/80 font-semibold text-xl">Wind rose <span class="text-sm">(9-day forecast)</span></h3>
                            <div class="h-[508px]">
                                <Windrose
                                    radialBins={['Flau vind', 'Svak vind', 'Lett bris', 'Laber bris', 'Frisk bris', 'Liten kuling', 'Stiv kuling', 'Sterk kuling', 'Liten storm', 'Full storm', 'Sterk storm', 'Orkan']}
                                    angleBins={['Ø', 'NØ', 'N', 'NV', 'V', 'SV', 'S', 'SØ']}
                                    data={windData()}
                                />
                            </div>
                        </>
                    </Show>
                </div>

                <div>
                    <h3 class="text-white/80 font-semibold text-xl mb-1">Marinogram</h3>
                    <img class="rounded-md" ref={marinogram} />
                </div>
            </div>
        </div>
    )
}

