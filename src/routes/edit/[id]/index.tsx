import {
  component$,
  useContext,
  useSignal,
  useVisibleTask$,
  $,
} from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { ActivityContext } from "~/routes/layout";
import styles from "./index.module.css";
import { inputTime } from "~/services/time-formatter";

export default component$(() => {
  const ctx = useContext(ActivityContext);
  const id = useLocation().params.id;
  const start = useSignal("");
  const end = useSignal("");
  const name = useSignal("");
  const category = useSignal("");
  const nav = useNavigate();

  const findActivity = $(() => {
    return ctx.activities.find((x) => {
      return x.id == id;
    });
  });

  useVisibleTask$(async () => {
    const activity = await findActivity();
    if (activity) {
      start.value = await inputTime(activity.start);
      end.value = await inputTime(activity.end);
      name.value = activity.name;
      category.value = activity.category;
    }
  });

  const updateStart = $(async (el: HTMLInputElement) => {
    start.value = el.value;
    const activity = await findActivity();
    const date = new Date(el.value);
    if (activity) activity.start = date.getTime();
  });

  const updateEnd = $(async (el: HTMLInputElement) => {
    end.value = el.value;
    const activity = await findActivity();
    const date = new Date(el.value);
    if (activity) activity.end = date.getTime();
  });

  const updateName = $(async (el: HTMLInputElement) => {
    name.value = el.value;
    const activity = await findActivity();
    if (activity) activity.name = el.value;
  });

  const updateCategory = $(async (el: HTMLInputElement) => {
    category.value = el.value;
    const activity = await findActivity();
    if (activity) activity.category = el.value;
  });

  const deleteActivity = $(() => {
    const index = ctx.activities.findIndex((x) => {
      return x.id === id;
    });
    if (index != -1){
        ctx.activities.splice(index, 1);
        nav('/')
    }
  });

  return (
    <div class={styles.container}>
      <div class={styles.start}>
        <label for="start">Start</label>
        <input
          type="datetime-local"
          name="start"
          id="start"
          value={start.value}
          onChange$={(el) => updateStart(el.target)}
          max={end.value}
        />
      </div>
      <div class={styles.end}>
        <label for="end">End</label>
        <input
          type="datetime-local"
          name="end"
          id="end"
          value={end.value}
          onChange$={(el) => updateEnd(el.target)}
          min={start.value}
        />
      </div>
      <div class={styles.name}>
        <label for="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name.value}
          onChange$={(el) => updateName(el.target)}
        />
      </div>
      <div class={styles.category}>
        <label for="category">Category</label>
        <input
          type="text"
          name="category"
          id="category"
          value={category.value}
          list="categories"
          onChange$={(el) => updateCategory(el.target)}
        />
        <datalist id="categories">
          {ctx.categories.map((category) => {
            return (
              <option value={category} key={category}>
                {category}
              </option>
            );
          })}
        </datalist>
      </div>
      <div class={styles.delete}>
        <button onClick$={deleteActivity}>Delete entry</button>
      </div>
    </div>
  );
});
