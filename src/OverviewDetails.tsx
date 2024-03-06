import { Accessor, Component, InitializedResource, Show, batch, createEffect, createSignal } from "solid-js";
import { BasicWeek } from "./types";
import { useState } from "./state";


interface OverviewDetailsProps {
    data: InitializedResource<BasicWeek[]>
}

export const OverviewDetails: Component<OverviewDetailsProps> = ({ data }) => {
    const [count, setCount] = createSignal<number>(0);
    const [avg, setAvg] = createSignal<string>();
    const [over, setOver] = createSignal<number>();
    const [numFallow, setNumFallow] = createSignal<number>();

    const [state, _] = useState();

    createEffect(() => {
        const d = state.filters.organizations.length
            ? data()
                .filter(bw => (!state.filters.fallow ? !bw.isFallow : true) && !bw.organizations.every(o => !state.filters.organizations.includes(o)))
            : data()
                .filter(bw => !state.filters.fallow ? !bw.isFallow : true);

        batch(() => {
            setCount(d.length);
            setAvg((d.reduce((a, c) => a + (c.lice ?? 0), 0) / d.length).toFixed(2));
            setOver(d.reduce((a, c) => a + (c.lice > 0.5 ? 1 : 0), 0));
            setNumFallow(d.reduce((a, c) => a + (c.isFallow ? 1 : 0), 0));
        })
    })

    return (
        <div class="pl-64 ml-4 mt-10 flex justify-between">
            <NumberDisplay value={count()} subtitle="Number of sites" loading={data.loading} />
            <NumberDisplay value={avg()} subtitle="Avg. lice count" loading={data.loading} />
            <NumberDisplay value={over()} subtitle="Sites with lice > 0.5" loading={data.loading} />
            <NumberDisplay value={numFallow()} subtitle="Number of fallow sites" loading={data.loading} />
        </div>
    )
}

const NumberDisplay: Component<{ value: number | string, subtitle: string, loading: boolean }> = (props) => {
    return (
        <div class="text-center">
            <Show when={!props.loading} fallback={<Spinner />}>
                <h1 class="text-white text-4xl">{props.value}</h1>
            </Show>
            <h2 class="text-iliad">{props.subtitle}</h2>
        </div>
    )
}

const Spinner: Component = () => (
    <svg class="animate-spin h-6 w-6 my-2 mx-auto fill-none rounded-full text-white text-4xl" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);