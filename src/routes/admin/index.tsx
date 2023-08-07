import { component$, $, useStore, useVisibleTask$, useSignal } from "@builder.io/qwik"
import styles from "./index.module.css"
import type { ActivitiyStore } from ".."

export default component$(() => {
    const newCategory = useSignal("");
    const toDelete = useSignal("");
    const store = useStore<ActivitiyStore>({
        activities: [],
        lastEnd: Date.now(),
        categories: []
    });

    useVisibleTask$(() => {
        const storedActivities = localStorage.getItem("activities");
        const storedLastEnd = localStorage.getItem("lastEnd");
        const storedCategories = localStorage.getItem("categories");
        if (storedActivities) store.activities = JSON.parse(storedActivities);
        if (storedLastEnd) store.lastEnd = parseInt(storedLastEnd);
        if (storedCategories) store.categories = JSON.parse(storedCategories);
    });

    const reset = $(() => {
        localStorage.clear();
        localStorage.setItem("lastEnd", Date.now().toString());
    });

    const addCategory = $(() => {
        console.log(store.categories)
        if (store.categories.findIndex((category) => category === newCategory.value) == -1) {
            store.categories.push(newCategory.value);
            localStorage.setItem("categories", JSON.stringify(store.categories));
        }
    });

    const deleteCategory = $(() => {
        const index = store.categories.findIndex((category) => category === toDelete.value)
        if(index != -1)
        {
            store.categories.splice(index, 1);
            localStorage.setItem("categories", JSON.stringify(store.categories));
        }
    });

    return (
        <div class={styles.container}>
            <h2>Add/Remove categories</h2>
            <div class={styles.category}>
                <div class={styles.add}>
                    <input type="text" id="category" name="category" value={newCategory.value} onInput$={(el) => newCategory.value = (el.target as HTMLInputElement).value} />
                    <button onClick$={addCategory}>Add</button>
                </div>
                <div class={styles.delete}>
                    <select name="categories" id="categories" onChange$={(el) => toDelete.value = el.target.value}>
                        {store.categories.map((category) => {
                            return <option value={category} key={category}>{category}</option>
                        })}
                    </select>
                    <button onClick$={deleteCategory}>Delete</button>
                </div>
            </div>
            <div class={styles.reset}>
                <button onClick$={reset} id="reset">Reset</button>
            </div>
        </div>
    )
})

