import { clientEntry, on } from 'remix/ui'

export const ClickCounter = clientEntry(import.meta.url, function ClickCounter(handle) {
  let count = 0

  return () => (
    <button
      id="counter"
      type="button"
      mix={on('click', () => {
        count += 1
        handle.update()
      })}
    >
      clicked {count} times
    </button>
  )
})
