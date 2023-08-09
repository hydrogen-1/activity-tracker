import { component$ } from "@builder.io/qwik";
import styles from "./activity.module.css"
import { formatTime } from "~/services/time-formatter"
import { useNavigate } from "@builder.io/qwik-city";
import type { Activity } from "~/routes/layout";

interface ActivityProps {
    activity: Activity;
}

export default component$((props: ActivityProps) => {
    const nav = useNavigate();
    const startDate = new Date(props.activity.start)
    const endDate = new Date(props.activity.end)
    return (
        <div class={styles.card} onClick$={async () => nav(`/edit/${props.activity.id}`)}>
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