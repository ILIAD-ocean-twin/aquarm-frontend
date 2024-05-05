import { Component, createSignal, Show } from "solid-js";
import { Modal } from "./Modal";
import { useState } from "../state";

export const OimTerm: Component<{ term: string, title?: string }> = (props) => {
    const [state] = useState();
    const [open, setOpen] = createSignal<boolean>(false);

    const term = () => state.oim[props.term]

    return (
        <Show when={term()}>
            <span
                onClick={() => setOpen(!open())}
                class="underline decoration-dashed cursor-pointer"
                title="OIM-term"
            >
                {props.title ?? term()["name (en)"]}
            </span>
            <Show when={open()}>
                <Modal onClose={() => setOpen(false)}>
                    <h1 class="font-mono font-bold text-orange-600">{props.term}</h1>
                    <div class="text-sm">
                        <h2 class="font-semibold">Name (en):</h2>
                        <p>{term()["name (en)"]}</p>

                        <h2 class="font-semibold mt-2">Name (no):</h2>
                        <p>{term()["name (no)"]}</p>

                        <h2 class="font-semibold mt-2">Description (en):</h2>
                        <p>{term()["description (en)"]}</p>

                        <h2 class="font-semibold mt-2">Description (no):</h2>
                        <p>{term()["description (no)"]}</p>
                    </div>
                </Modal>
            </Show>
        </Show>
    )
}