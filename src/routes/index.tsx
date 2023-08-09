import { component$, useContext } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import styles from "./index.module.css"
import Timer from "~/components/timer/timer";
import Activity from "~/components/activity/activity";
import { ActivityContext } from "./layout";


export default component$(() => {
    const ctx = useContext(ActivityContext)

    return (
        <>
            <div class={styles.container}>
                <h1>Activity Tracker</h1>
                <div class={styles.timer}>
                    <Timer/>
                </div>
                <div class={styles.activities}>
                    {ctx.activities.map((activity) => {
                        return <Activity activity={activity} key={activity.id}/>
                    }).reverse()}
                </div>
            </div>
        </>
    );
});

export const head: DocumentHead = {
    title: "Activity Tracker",
    meta: [
        {
            name: "Track your activities",
            content: "Track your activities",
        },
    ],
};
