import {
  component$,
  $,
  useSignal,
  useTask$,
  useVisibleTask$,
  useContext,
} from "@builder.io/qwik";
import styles from "./timer.module.css";
import { ActivityContext } from "~/routes/layout";
import { formatTime } from "~/services/time-formatter";
import { v4 } from "uuid";

export default component$(() => {
  const ctx = useContext(ActivityContext);
  const activity = useSignal("");
  const category = useSignal("none");
  const elapsedTime = useSignal(Date.now() - ctx.lastEnd);

  const stopCurrent = $(() => {
    const currentTime = Date.now();
    ctx.activities.push({
      id: v4(),
      start: ctx.lastEnd,
      end: currentTime,
      name: activity.value,
      category: category.value,
    });
    ctx.lastEnd = currentTime;
    elapsedTime.value = 0;

    localStorage.setItem("activities", JSON.stringify(ctx.activities));
    localStorage.setItem("lastEnd", ctx.lastEnd.toString());
  });

  useTask$(({ track, cleanup }) => {
    track(() => elapsedTime.value);
    const timer = setTimeout(
      () => (elapsedTime.value = (Date.now() - ctx.lastEnd) / 1000),
      1000
    );
    cleanup(() => clearTimeout(timer));
  });

  useVisibleTask$(() => {
    elapsedTime.value = (Date.now() - ctx.lastEnd) / 1000;
  });

  const reset = $(() => {
    ctx.lastEnd = Date.now();
    elapsedTime.value = 0;
    localStorage.setItem("lastEnd", ctx.lastEnd.toString());
  });

  return (
    <div class={styles.container}>
      <p>{formatTime(elapsedTime.value)}</p>
      <div class={styles.buttons}>
        <button onClick$={reset}>🔄</button>
        <button onClick$={stopCurrent}>🛑</button>
      </div>
      <div class={styles.inputs}>
        <label for="activity">Activity: </label>
        <input
          type="text"
          id="activity"
          value={activity.value}
          onInput$={(el) =>
            (activity.value = (el.target as HTMLInputElement).value.trim())
          }
        />
        <label for="category">Category: </label>
        <select
          name="category"
          id="category"
          value={category.value}
          onChange$={(el) => (category.value = el.target.value)}
        >
          <option value="none">none</option>
          {ctx.categories.map((category) => {
            return (
              <option value={category} key={category}>
                {category}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
});
