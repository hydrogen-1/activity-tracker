import { component$, $, useSignal, useTask$, useVisibleTask$, useContext } from "@builder.io/qwik"
import styles from "./timer.module.css"
import { ActivityContext } from "~/routes/layout"
import { formatTime } from "~/services/time-formatter"
import { v4 } from "uuid"

export default component$(() => {
    const store = useContext(ActivityContext);
    const activity = useSignal("");
    const category = useSignal("none");
    const elapsedTime = useSignal(Date.now() - store.lastEnd);

    const stopCurrent = $(() => {
        const currentTime = Date.now();
        store.activities.push({
            id: v4(),
            start: store.lastEnd,
            end: currentTime,
            name: activity.value,
            category: category.value
        })
        store.lastEnd = currentTime;
        elapsedTime.value = 0;

        localStorage.setItem("activities", JSON.stringify(store.activities));
        localStorage.setItem("lastEnd", store.lastEnd.toString());
    });

    useTask$(({ track, cleanup }) => {
        track(() => elapsedTime.value);
        const timer = setTimeout(() => (
            elapsedTime.value++
        ), 1000);
        cleanup(() => clearTimeout(timer));
    });

    useVisibleTask$(() => {
        elapsedTime.value = (Date.now() - store.lastEnd) / 1000
    })

    return (
        <div class={styles.container}>
            <p>{formatTime(elapsedTime.value)}</p>
            <button onClick$={stopCurrent}>🛑</button>
            <div class={styles.inputs}>
                <label for="activity">Activity: </label>
                <input type="text" id="activity" value={activity.value} onInput$={(el) => activity.value = (el.target as HTMLInputElement).value.trim()}/>
                <label for="category">Category: </label>
                <select name="category" id="category" value={category.value} onChange$={(el) => category.value = el.target.value}>
                    <option value="none">none</option>
                    {store.categories.map((category) => {
                        return <option value={category} key={category}>{category}</option>
                    })}
                </select>
            </div>
        </div>
    );
})
