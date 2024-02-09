import { Accessor, Component, Show, batch, createEffect, createSignal, onMount } from "solid-js";
import { BasicWeek, Filters } from "./types";


interface OverviewDetailsProps {
    data: Accessor<BasicWeek[]>
    filters: Filters
}

export const OverviewDetails: Component<OverviewDetailsProps> = ({ data, filters }) => {
    const [count, setCount] = createSignal<number>(0);
    const [avg, setAvg] = createSignal<string>();
    const [over, setOver] = createSignal<number>();
    const [numFallow, setNumFallow] = createSignal<number>();

    createEffect(() => {
        const d = filters.organizations.length
            ? data()
                .filter(bw => (!filters.fallow ? !bw.isFallow : true) && !bw.organizations.every(o => !filters.organizations.includes(o)))
            : data()
                .filter(bw => !filters.fallow ? !bw.isFallow : true);

        batch(() => {
            setCount(d.length);
            setAvg((d.reduce((a, c) => a + (c.lice ?? 0), 0) / d.length).toFixed(2));
            setOver(d.reduce((a, c) => a + (c.lice > 0.5 ? 1 : 0), 0));
            setNumFallow(d.reduce((a, c) => a + (c.isFallow ? 1 : 0), 0));
        })
    })

    return (
        <div class="pl-64 ml-4 mt-10 flex justify-between">
            <NumberDisplay value={count()} subtitle="Number of sites" />
            <NumberDisplay value={avg()} subtitle="Avg. lice count" />
            <NumberDisplay value={over()} subtitle="Sites with lice > 0.5" />
            <NumberDisplay value={numFallow()} subtitle="Number of fallow sites" />
        </div>
    )
}

const NumberDisplay: Component<{ value: number | string, subtitle: string }> = (props) => {
    return (
        <div class="text-center">
            <h1 class="text-white text-4xl">{props.value}</h1>
            <h2 class="text-iliad">{props.subtitle}</h2>
        </div>
    )
}