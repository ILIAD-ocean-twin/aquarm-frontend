import { Component, createSignal, Show } from "solid-js";
import { Modal } from "./Modal";

export const OimTerm: Component<{ term: string }> = (props) => {
    const [open, setOpen] = createSignal<boolean>(false);
    return (
        <>
            <span
                onClick={() => setOpen(!open())}
                class="underline decoration-dashed cursor-pointer"
                title="OIM-term"
            >
                {props.term}
            </span>
            <Show when={open()}>
                <Modal onClose={() => setOpen(false)}>
                    <span>{props.term}</span>
                </Modal>
            </Show>
        </>
    )
}