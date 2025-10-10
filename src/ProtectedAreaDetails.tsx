import { Component, createEffect, For, Show } from "solid-js";

export const ProtectedAreaDetails: Component<{ areas: {}[] }> = (props) => {

    return (
        <Show when={props.areas.length}>
            <div class="text-xl text-white/80 font-semibold mt-2">
                {props.areas[0]["site_name"]} -
                <span class="text-lg text-white/60">{props.areas[0]["site_id"]}</span>
            </div>
            <div class="flex pb-20">
                <div class="w-3/5">
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
                <div></div>
            </div>
        </Show>

    )
}