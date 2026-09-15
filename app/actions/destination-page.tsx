import type { Handle, SerializableProps } from 'remix/ui'

import { Document } from './document.tsx'

export interface DestinationPageProps extends SerializableProps {
  title: string
  servedBy: string
}

export function DestinationPage(handle: Handle<DestinationPageProps>) {
  return () => {
    let { title, servedBy } = handle.props

    return (
      <Document title={title}>
        <main>
          <h1 id="heading">{title}</h1>
          <p id="served-by">served by {servedBy}</p>
          <p>
            <a href="/">back to A</a>
          </p>
        </main>
      </Document>
    )
  }
}
