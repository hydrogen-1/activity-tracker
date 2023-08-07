import { component$, $, useSignal, useTask$, useVisibleTask$ } from "@builder.io/qwik"
import styles from "./timer.module.css"
import type { ActivitiyStore } from "~/routes"

interface TimerProps {
    store: ActivitiyStore
}

export default component$((props: TimerProps) => {
    const activity = useSignal("");
    const category = useSignal("");
    const elapsedTime = useSignal(Date.now() - props.store.lastEnd);

    const stopCurrent = $(() => {
        const currentTime = Date.now();
        props.store.activities.push({
            start: props.store.lastEnd,
            end: currentTime,
            name: activity.value,
            category: category.value
        })
        props.store.lastEnd = currentTime;
        elapsedTime.value = 0;

        localStorage.setItem("activities", JSON.stringify(props.store.activities));
        localStorage.setItem("lastEnd", props.store.lastEnd.toString());
    });

    const formatTime = $((duration: number) => {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    });

    useTask$(({ track, cleanup }) => {
        track(() => elapsedTime.value);
        const timer = setTimeout(() => (
            elapsedTime.value++
        ), 1000);
        cleanup(() => clearTimeout(timer));
    });

    useVisibleTask$(() => {
        console.log(Date.now(), props.store.lastEnd)
        elapsedTime.value = (Date.now() - props.store.lastEnd) / 1000
    })

    return (
        <div class={styles.container}>
            <p>{formatTime(elapsedTime.value)}</p>
            <button onClick$={stopCurrent}>🛑</button>
            <div class={styles.inputs}>
                <label for="activity">Activity: </label>
                <input type="text" id="activity" value={activity.value} onInput$={(el) => activity.value = (el.target as HTMLInputElement).value.trim()}/>
                <label for="category">Category: </label>
                <select name="category" id="category" onChange$={(el) => category.value = el.target.value}>
                    {props.store.categories.map((category) => {
                        return <option value={category} key={category}>{category}</option>
                    })}
                </select>
            </div>
        </div>
    );
})
