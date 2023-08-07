import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead, Link } from "@builder.io/qwik-city";
import styles from "./index.module.css"
import Timer from "~/components/timer/timer";
export interface Activity {
    start: number;
    end: number;
    name: string;
    category: string;
}

export interface ActivitiyStore {
    activities: Activity[];
    lastEnd: number;
    categories: string[];
}

export default component$(() => {
    const store = useStore<ActivitiyStore>({
        activities: [],
        lastEnd: Date.now(),
        categories: ["Free-time", "Sleep", "Hygiene", "Work"]
    })

    useVisibleTask$(() => {
        const storedActivities = localStorage.getItem("activities");
        const storedLastEnd = localStorage.getItem("lastEnd");
        const storedCategories = localStorage.getItem("categories");
        if(storedActivities) store.activities = JSON.parse(storedActivities);
        if(storedLastEnd) store.lastEnd = parseInt(storedLastEnd);
        if(storedCategories) store.categories = JSON.parse(storedCategories);
    })

    return (
        <>
            <div class={styles.container}>
                <h1>Activity Tracker</h1>
                <Timer store={store}/>
                <Link href="/admin" >Test</Link>
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
