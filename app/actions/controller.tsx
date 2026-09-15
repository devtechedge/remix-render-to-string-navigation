import { createController } from 'remix/router'
import { createHtmlResponse } from 'remix/response/html'
import { renderToString } from 'remix/ui/server'

import { assets } from '../assets.ts'
import { routes } from '../routes.ts'
import { DestinationPage } from './destination-page.tsx'
import { Document } from './document.tsx'
import { HomePage } from './home-page.tsx'

export default createController(routes, {
  actions: {
    async assets(context) {
      return (await assets.fetch(context.request)) ?? new Response('Not Found', { status: 404 })
    },
    home(context) {
      return context.render(<HomePage />)
    },
    stream(context) {
      return context.render(
        <DestinationPage title="B" servedBy="context.render() / renderToStream" />,
      )
    },
    async string() {
      // packages/ui/src/server/README.md recommends renderToString when the full
      // output is needed before responding, e.g. for generating static pages.
      let html = await renderToString(
        <DestinationPage title="B" servedBy="renderToString()" />,
      )
      return createHtmlResponse(html)
    },
  },
})
