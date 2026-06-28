# annas-arxiv

A skeuomorphic, Penguin-Classics–styled bookshelf of the papers — and the odd
thing — Anna keeps coming back to. A pun on *Anna's Archive*.

Lives at **library.brezgis.com**, reached via a quiet button on
brezgis.com → Шара-бара.

Static site, no build step: plain HTML/CSS/JS, fonts from Google Fonts.

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

The shelf auto-fills columns to the window width and grows new planks on its own.
