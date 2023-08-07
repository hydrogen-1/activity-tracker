import { component$ } from "@builder.io/qwik";
import styles from "./activity.module.css"
import type { ActivitiyStore, Activity } from "~/routes";
import { formatTime } from "~/services/time-formatter"

interface ActivityProps {
    activity: Activity;
    store: ActivitiyStore;
}

export default component$((props: ActivityProps) => {
    const startDate = new Date(props.activity.start)
    const endDate = new Date(props.activity.end)
    return (
        <div class={styles.card}>
            <p class={styles.dates}>
                {startDate.toLocaleTimeString()} -
                {endDate.toLocaleTimeString()}
            </p>
            <p class={styles.duration}>
                {formatTime(Math.floor((endDate.getTime() - startDate.getTime())/1000))}
            </p>
            <p class={styles.category}>{props.activity.category}</p>
            <p class={styles.name}>{props.activity.name}</p>
        </div>
    );
})