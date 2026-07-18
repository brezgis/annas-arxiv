# annas-arxiv

A skeuomorphic, Penguin-Classics–styled bookshelf of the papers — and the odd
thing — Anna keeps coming back to. A pun on *Anna's Archive*.

![The shelf: Penguin-striped papers, real covers, a mixtape, a bag of coffee](docs/screenshot.png)

Lives at **[library.brezgis.com](https://library.brezgis.com)**, reached via a
quiet button on brezgis.com → Шара-бара.

Static site, no build step: plain HTML/CSS/JS, fonts from Google Fonts.

## Running it

`items.json` is fetched at runtime, so the shelf wants an actual server
rather than `file://`. Any static one will do:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

Hosting is the same idea at scale: put the files on any static host
(here, GitHub Pages — the `CNAME` file is the custom domain).

## Adding things

Everything is driven by [`items.json`](items.json). Each entry is one object:

| type | cover treatment |
|------|-----------------|
| `paper`  | Penguin cover (coloured band + cream panel + α roundel) |
| `book`   | a real, photographed cover image (`cover`) |
| `album`  | square album art, sitting like a CD (`cover`) |
| `object` | a transparent PNG standing on the shelf (`image`) |
| `thing`  | typographic "great ideas" cover (link-only places) |

Common keys: `title`, `author`, `year`, `link`, and `note` (the hover bubble —
a real quote for papers/books/albums, shown in curly quotes with `cite` outside;
or one of Anna's own lines for places/objects, shown plain).

`field` sets a paper's spine colour. Current palette:
`linguistics` · `computation` · `psychology` · `philosophy` · `socialscience` · `delight`.

So a new paper is one more object in `items`:

```json
{
  "type": "paper",
  "title": "A Paper Worth Shelving",
  "author": "Someone Wonderful",
  "year": 2026,
  "field": "computation",
  "link": "https://arxiv.org/abs/...",
  "note": "The sentence that made you keep it, quoted verbatim.",
  "cite": "(Wonderful, 2026)"
}
```

Reload, and it's on the shelf — no build step, nothing to regenerate.

The shelf auto-fills columns to the window width and grows new planks on its own.
