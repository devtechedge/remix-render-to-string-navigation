# renderToString output cannot be navigated by the client runtime

Minimal reproduction for [remix-run/remix#11808](https://github.com/remix-run/remix/issues/11808).

`renderToString` strips the `<!-- rmx:flush document -->` marker from its output. The client
runtime only takes the full-document-reload path when it sees that marker, so a link click
between two `renderToString` pages updates the URL and then silently leaves the old document in
place.

## Run it

Requires Node 24.3 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:44100.

Page A carries a client entry (the click counter), so the Remix runtime is active and intercepts
same-document link clicks. Two links leave A:

- `/stream`, rendered with `context.render()` (`renderToStream`) - **navigates**
- `/string`, rendered with `renderToString()` - **URL changes, document does not**

## Automated check

```sh
npx playwright install chromium
npm run verify
```

`verify.mjs` opens the app in Chromium, clicks each link, and prints the URL, document title, and
`#heading` text before and after the click.

Current output against `@remix-run/ui` 0.9.0:

```json
--- clicked #link-stream ---
{ "before": { "url": "/", "title": "A", "heading": "A" },
  "after":  { "url": "/stream", "title": "B", "heading": "B" },
  "navigated": true }

--- clicked #link-string ---
{ "before": { "url": "/", "title": "A", "heading": "A" },
  "after":  { "url": "/string", "title": "A", "heading": "A" },
  "navigated": false }
```

Note that `navigated: false` comes with no console output and no `pageerror`. The failure is only
observable through `navigation.addEventListener('navigateerror', ...)` or the `error` event on the
runtime returned by `run()`.

## Where the marker goes missing

```sh
curl -s localhost:44100/stream | tail -c 60
# </body></html><!-- rmx:flush document -->

curl -s localhost:44100/string | tail -c 60
# </body></html>
```

Both responses are `200` and both are complete documents. Only one carries the marker.

## Layout

| File | Purpose |
| --- | --- |
| `app/actions/controller.tsx` | Serves `/` and `/stream` with `context.render()`, `/string` with `renderToString()` |
| `app/actions/home-page.tsx` | Page A, with a client entry and both links |
| `app/actions/destination-page.tsx` | Page B, identical for both destinations |
| `app/actions/public/click-counter.tsx` | Client entry that puts the runtime on page A |
| `verify.mjs` | Playwright script that clicks both links and reports the result |
