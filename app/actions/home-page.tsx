import { Document } from './document.tsx'
import { ClickCounter } from './public/click-counter.tsx'

export function HomePage() {
  return () => (
    <Document title="A">
      <main>
        <h1 id="heading">A</h1>
        <p>
          The counter below is a client entry, so the Remix runtime is active on this page and
          intercepts same-document link clicks.
        </p>
        <p>
          <ClickCounter />
        </p>
        <ul>
          <li>
            <a id="link-stream" href="/stream">
              go to /stream (rendered with renderToStream)
            </a>
          </li>
          <li>
            <a id="link-string" href="/string">
              go to /string (rendered with renderToString)
            </a>
          </li>
        </ul>
      </main>
    </Document>
  )
}
