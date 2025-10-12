import { Component, createEffect, For, Show } from "solid-js";
import chroma from 'chroma-js';

const colorScale = chroma.scale('OrRd');

interface ProtectedAreaDetailsProps {
    area: any
    maxConn: number
    connectivityLookup: {}
    areaNameLookup: {}
}

export const ProtectedAreaDetails: Component<ProtectedAreaDetailsProps> = (props) => {
    const connectivity = () => {
        const area = props.area;
        if (area) {
            const conns = props.connectivityLookup[area["site_id"]];
            if (conns?.length ?? false) {
                return conns.toSorted((a, b) => a[1] < b[1]);
            }
        }
        return [];
    }

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