import { component$, $ } from "@builder.io/qwik"

export default component$(() => {
    const reset = $(() => {
        localStorage.clear()
        localStorage.setItem("lastEnd", Date.now().toString())
    })
    return (
        <>
            <button onClick$={reset}>Reset</button>
        </>
    )
})

