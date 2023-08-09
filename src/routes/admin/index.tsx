import { component$, $, useSignal, useContext } from "@builder.io/qwik"
import styles from "./index.module.css"
import { ActivityContext } from "../layout";

export default component$(() => {
    const newCategory = useSignal("");
    const toDelete = useSignal("");
    const ctx = useContext(ActivityContext)

    const reset = $(() => {
        localStorage.clear();
        localStorage.setItem("lastEnd", Date.now().toString());
    });

    const addCategory = $(() => {
        if (ctx.categories.findIndex((category) => category === newCategory.value) == -1) {
            ctx.categories.push(newCategory.value);
            localStorage.setItem("categories", JSON.stringify(ctx.categories));
        }
    });

    const deleteCategory = $(() => {
        const index = ctx.categories.findIndex((category) => category === toDelete.value)
        if(index != -1)
        {
            ctx.categories.splice(index, 1);
            localStorage.setItem("categories", JSON.stringify(ctx.categories));
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
                        {ctx.categories.map((category) => {
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

