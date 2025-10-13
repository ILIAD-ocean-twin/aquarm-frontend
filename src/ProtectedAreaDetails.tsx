import { Component, createEffect, createSignal, For, Resource, Show } from "solid-js";
import chroma from 'chroma-js';

const colorScale = chroma.scale('OrRd').padding([0.25, 0.1]);;

interface ProtectedAreaDetailsProps {
    area: any
    maxConn: number
    connectivityLookup: Record<string, Record<string, number>>
    areaNameLookup: {}
    observations: Record<string, Record<string, number>>
}

export const ProtectedAreaDetails: Component<ProtectedAreaDetailsProps> = (props) => {
    const connectivity = () => {
        const area = props.area;
        if (area) {
            const conns = props.connectivityLookup[area["site_id"]];
            if (conns && Object.keys(conns).length > 0) {
                return Object.entries(conns)
                    .sort(([, a], [, b]) => b - a);
            }
        }
        return [];
    };

    return (
        <Show when={props.area != undefined}>
            <div class="text-xl text-white/80 font-semibold mt-2">
                {props.area["site_name"]} -
                <span class="text-lg text-white/60">{props.area["site_id"]}</span>
            </div>
            <div class="flex justify-between pb-20">
                <div class="w-3/5 pr-3">
                    <h3 class="text-iliad font-semibold mt-2">Designation</h3>
                    <p class="text-white/80">{props.area["designation"]}</p>

                    <h3 class="text-iliad font-semibold mt-2">Purpose</h3>
                    <p class="text-white/80">{props.area["purpose"]}</p>

                    <h3 class="text-iliad font-semibold mt-2">Protection focus</h3>
                    <p class="text-white/80">{props.area["protection_focus"]}</p>

                    <h3 class="text-iliad font-semibold mt-2">Restrictions</h3>
                    <p class="text-white/80" innerHTML={props.area["restrictions"]}></p>

                    <h3 class="text-iliad font-semibold mt-2">Allowed</h3>
                    <p class="text-white/80" innerHTML={props.area["allowed"]}></p>

                    <h3 class="text-iliad font-semibold mt-2">Species of concern</h3>
                    <p class="text-white/80">{props.area["species_of_concern"]}</p>

                    <h3 class="text-iliad font-semibold mt-2">Managing authority</h3>
                    <p class="text-white/80">{props.area["managing_authority"]}</p>

                    <h3 class="text-iliad font-semibold mt-2">Regulation name</h3>
                    <p class="text-white/80">{props.area["regulation_name"]}</p>
                </div>
                <div class="pl-3 w-2/5">
                    <h3 class="text-iliad font-semibold mt-2">Top five connected protected areas</h3>
                    <ol class="list-decimal list-inside">
                        <For each={connectivity().slice(0, 5)}>{
                            conn => <li class="text-white/80">
                                {props.areaNameLookup[conn[0]]}
                                <ConnectivityIndicator value={conn[1]} maxValue={props.maxConn} />
                            </li>
                        }</For>
                        <Show when={connectivity().length == 0}>
                            <div class="text-white/30">Our latest drift simulation shows no connectivity for this area</div>
                        </Show>
                        <Show when={props.observations && props.area["site_name"] == "Lundy"}>
                            <Observations observations={props.observations} />
                        </Show>
                    </ol>
                </div>
            </div>
        </Show>
    )
}

const ConnectivityIndicator: Component<{ value: number, maxValue: number }> = (props) =>
    <div
        class="size-3 bg-red-500 ml-3 inline-block"
        style={{ "background": colorScale(props.value / props.maxValue) }}
    />

const Observations: Component<{ observations: Record<string, Record<string, number>> }> = ({ observations }) => {
    const years = Object.keys(observations).map(k => parseInt(k)).sort((a, b) => b - a)
    const mostRecentYear = Math.max(...years);
    const [year, setYear] = createSignal(mostRecentYear.toString());

    return (
        <div class="mt-6">
            <h3 class="text-iliad font-semibold mt-2">Specie observations in the area
                <select
                    onChange={ev => setYear(ev.target.value)}
                    class="px-2 py-1 ml-3 inline-block rounded text-white/90 bg-slate-500/80">
                    <For each={Array.from(new Set(years))}>
                        {y => <option value={y}>{y}</option>}
                    </For>
                </select>
            </h3>
            <div class="text-white/80">
                <For each={Object.entries(observations[year()]).sort(([, a], [, b]) => b - a)}>
                    {(s) =>
                        <div>{s[0]} - {s[1]}</div>
                    }
                </For>
            </div>
        </div>
    )
}