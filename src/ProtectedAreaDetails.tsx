import { Component, createEffect, For, Show } from "solid-js";

interface ProtectedAreaDetailsProps {
    areas: {}[]
    maxConn: number
    lookup: {}
}

export const ProtectedAreaDetails: Component<ProtectedAreaDetailsProps> = (props) => {

    const connectivity = () => {
        const areas = props.areas;
        if (areas.length) {
            const area = areas[0];
            const conns = props.lookup[area["site_id"]];
            if (conns?.length ?? false) {
                return conns.toSorted((a, b) => a[1] < b[1])
            }
        }
        return []
    }

    return (
        <Show when={props.areas.length}>
            <div class="text-xl text-white/80 font-semibold mt-2">
                {props.areas[0]["site_name"]} -
                <span class="text-lg text-white/60">{props.areas[0]["site_id"]}</span>
            </div>
            <div class="flex justify-between pb-20">
                <div class="w-3/5 pr-3">
                    <h3 class="text-iliad font-semibold mt-2">Designation</h3>
                    <p class="text-white/80">{props.areas[0]["designation"]}</p>

                    <h3 class="text-iliad font-semibold mt-2">Purpose</h3>
                    <p class="text-white/80">{props.areas[0]["purpose"]}</p>

                    <h3 class="text-iliad font-semibold mt-2">Protection focus</h3>
                    <p class="text-white/80">{props.areas[0]["protection_focus"]}</p>

                    <h3 class="text-iliad font-semibold mt-2">Restrictions</h3>
                    <p class="text-white/80" innerHTML={props.areas[0]["restrictions"]}></p>

                    <h3 class="text-iliad font-semibold mt-2">Allowed</h3>
                    <p class="text-white/80" innerHTML={props.areas[0]["allowed"]}></p>

                    <h3 class="text-iliad font-semibold mt-2">Species of concern</h3>
                    <p class="text-white/80">{props.areas[0]["species_of_concern"]}</p>

                    <h3 class="text-iliad font-semibold mt-2">Managing authority</h3>
                    <p class="text-white/80">{props.areas[0]["managing_authority"]}</p>

                    <h3 class="text-iliad font-semibold mt-2">Regulation name</h3>
                    <p class="text-white/80">{props.areas[0]["regulation_name"]}</p>
                </div>
                <div class="pl-3 w-2/5">
                    <h3 class="text-iliad font-semibold mt-2">Connectivity to other protected areas</h3>
                    <For each={connectivity()}>{
                        conn => <div class="text-white/80">{conn[0]}: {conn[1]}</div>
                    }</For>
                    {props.maxConn}
                </div>
            </div>
        </Show>

    )
}