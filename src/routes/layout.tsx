import { component$, createContextId, Slot, useContextProvider, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export interface Activity {
  id: string
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

export const ActivityContext = createContextId<ActivitiyStore>("activities")

export default component$(() => {
  const store = useStore<ActivitiyStore>({
    activities: [],
    categories: ["Free time", "Work", "Hygiene", "Sleep"],
    lastEnd: Date.now()
  })
  useContextProvider(ActivityContext, store);


  useVisibleTask$(() => {
    const storedActivities = localStorage.getItem("activities");
    const storedLastEnd = localStorage.getItem("lastEnd");
    const storedCategories = localStorage.getItem("categories");
    if (storedActivities) store.activities = JSON.parse(storedActivities);
    if (storedLastEnd) store.lastEnd = parseInt(storedLastEnd);
    if (storedCategories) store.categories = JSON.parse(storedCategories);
    if (!storedCategories) {
      localStorage.setItem("categories", JSON.stringify(store.categories))
    }
  });

  return (
    <div class="content">
      <Slot />
      <div class="footer">
        <Link href="/">Home</Link>
        <Link href="/admin" >Administration</Link>
      </div>
    </div>
  )
});
