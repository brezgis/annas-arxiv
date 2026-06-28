/* annas-arxiv — renders items.json onto the shelf
   Five item types:
     paper  → Penguin-style typographic cover (papers, no real cover)
     book   → a real, photographed cover image
     album  → square album art, sitting like a CD on the shelf
     object → a transparent PNG standing on the shelf as a physical thing
     thing  → typographic "great ideas" cover (link-only places)
   Every item's hover bubble (.note) carries a real quote or a line of Anna's. */

const FIELDS = {
  linguistics:   { label: "Linguistics",    color: "var(--c-linguistics)" },  // orange
  computation:   { label: "Computation",    color: "var(--c-topology)"    },  // teal — NLP/ML + TDA
  psychology:    { label: "Psychology",     color: "var(--c-psychology)"  },  // plum
  philosophy:    { label: "Philosophy",     color: "var(--c-philosophy)"  },  // blue
  socialscience: { label: "Social Science", color: "var(--c-logic)"       },  // purple
  delight:       { label: "Delights",       color: "var(--c-place)"       },  // terracotta — places
};

// custom roundel glyph (where Penguin puts the penguin)
const ROUNDEL = "α";

function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function bandColor(field) {
  return (FIELDS[field] && FIELDS[field].color) || "var(--c-linguistics)";
}

/* ----- Penguin Classic (papers) ----- */
function paperCover(it) {
  const len = it.title.length;
  const titleClass = len > 48 ? " title--xlong" : len > 30 ? " title--long" : "";
  const author = it.author
    ? `<span class="rule"></span><p class="author">${esc(it.author)}</p>` : "";
  return `
    <div class="cover cover--penguin" style="--band:${bandColor(it.field)}">
      <div class="band band-top"><span class="series">anna's arxiv</span></div>
      <div class="panel">
        <h3 class="title${titleClass}">${esc(it.title)}</h3>
        ${author}
      </div>
      <div class="band band-bottom">
        <span class="roundel">${ROUNDEL}</span>
        ${it.year ? `<span class="year">${esc(it.year)}</span>` : ""}
      </div>
    </div>`;
}

/* ----- Great Ideas (link-only things) ----- */
function thingCover(it) {
  return `
    <div class="cover cover--idea" style="--band:${bandColor(it.field)}">
      <div class="idea-frame">
        <span class="series">a thing anna likes</span>
        <h3 class="title">${esc(it.title)}</h3>
        <p class="author">${esc(it.author || "")}</p>
      </div>
    </div>`;
}

/* ----- a real, photographed book cover ----- */
function bookCover(it) {
  return `
    <div class="cover cover--book">
      <img src="${esc(it.cover)}" alt="${esc(it.title)} — cover" loading="lazy">
    </div>`;
}

/* ----- album art, sitting like a CD ----- */
function albumCover(it) {
  return `
    <div class="cover cover--album">
      <span class="album-disc" aria-hidden="true"></span>
      <img src="${esc(it.cover)}" alt="${esc(it.title)} — album art" loading="lazy">
    </div>`;
}

/* ----- a transparent object standing on the shelf ----- */
function objectArt(it) {
  return `<img class="object-art" src="${esc(it.image)}" alt="${esc(it.title)}" loading="lazy">`;
}

function bookEl(it) {
  const tag = it.link ? "a" : "div";
  const href = it.link ? ` href="${esc(it.link)}" target="_blank" rel="noopener"` : "";
  let inner, mod = "";
  switch (it.type) {
    case "book":   inner = bookCover(it);  mod = "book--cover";  break;
    case "album":  inner = albumCover(it); mod = "book--album";  break;
    case "object": inner = objectArt(it);  mod = "book--object" + (it.variant ? " object--" + it.variant : ""); break;
    case "thing":  inner = thingCover(it);                       break;
    default:       inner = paperCover(it);
  }
  return `<${tag} class="book ${mod}"${href} tabindex="0">${inner}${noteHTML(it)}</${tag}>`;
}

/* the hover bubble: a real text quote (papers/books) gets curly quotes + the
   citation outside the closing quote; anything else (places, objects) is just
   Anna's own line, shown plain with no quotation marks */
function fmtNote(s) {
  // preserve line breaks (lyrics) as <br>
  return esc(s).replace(/\n/g, "<br>");
}

function noteHTML(it) {
  if (!it.note) return "";
  // text quotes (papers, books) and lyrics (albums) get curly quotes + any cite;
  // Anna's own lines (places, objects) show plain
  if (it.type === "paper" || it.type === "book" || it.type === "album") {
    const cite = it.cite ? ` <span class="cite">${esc(it.cite)}</span>` : "";
    return `<span class="note">“${fmtNote(it.note)}”${cite}</span>`;
  }
  return `<span class="note note--plain">${fmtNote(it.note)}</span>`;
}

function renderLegend(usedFields) {
  // fill the swatch container, leaving the heading and wallpaper note intact
  const el = document.querySelector(".legend-rows") || document.querySelector(".legend");
  if (!el) return;
  el.innerHTML = [...usedFields].map(f => {
    const meta = FIELDS[f]; if (!meta) return "";
    return `<span><i style="background:${meta.color}"></i>${meta.label}</span>`;
  }).join("");
}

async function build() {
  const grid = document.querySelector(".shelf-grid");
  let data;
  try {
    const res = await fetch("items.json", { cache: "no-store" });
    data = await res.json();
  } catch (e) {
    grid.innerHTML = `<p style="grid-column:1/-1;opacity:.6">Couldn't load items.json — ${esc(e.message)}</p>`;
    return;
  }
  const items = (data.items || []).filter(it => it && it.title);
  grid.innerHTML = items.map(bookEl).join("");
  renderLegend(new Set(items.map(it => it.field).filter(Boolean)));
}

build();
