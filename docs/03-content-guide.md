# 3. Content guide

**All** text on the screen and the list of photos/videos for each section live in one file:

**[`src/content/content.json`](../src/content/content.json)**

You edit it, build, and publish ([deployment](05-deployment.md)). No code changes are needed for normal content updates. Photos and videos themselves are uploaded separately with the media tool ([media guide](04-media-guide.md)), which prints the JSON snippets you paste here.

> **Tips for editing JSON safely**
> - Use a code editor (VS Code) — it highlights mistakes as you type.
> - Every text value is in double quotes `"…"`. To use a double quote inside text, write `\"`. Curly quotes `’ “ ”` are fine as-is.
> - Items in a list are separated by commas, but **no comma after the last item**.
> - A new line inside text is written `\n` (a blank line is `\n\n`).
> - After editing run `npm run build`. If the JSON is broken, the build fails and tells you the line.

## File structure

```jsonc
{
  "countries": [ /* one entry per map pin → country page */ ],
  "stories":   [ /* More Stories cards → story pages */ ],
  "team1":     [ /* leadership at the top of the Team page */ ],
  "team2":     [ /* team groups: "IMETA Core Team", "OPU Champions" */ ]
}
```

The exact types are defined in [`src/content/index.ts`](../src/content/index.ts).

---

## Countries

```jsonc
{
  "id": 6,                       // unique number
  "country": "South Africa",     // MUST match the map pin name exactly; also the URL (/world/South Africa)
  "title": "Stop Rabies",        // not shown on screen (kept for reference)
  "articles": [ /* one per tab, shown in this order */ ]
}
```

### Article (a tab on the country page)

```jsonc
{
  "heading": "Dustbin Donation Initiative – Diepsloot Primary School",
  "coverImage": { /* image entry */ },     // big photo on the left
  "videos": [ /* video entries */ ],       // optional — shown first in the media row
  "images": [ /* image entries */ ],       // optional — shown after videos
  "article": "First paragraph…\n\nSecond paragraph…\n• Bullet one\n• Bullet two",
  "lists": [                               // optional — bullet lists under the text
    { "listHead": "As of October 2025, we", "listPoints": ["Point one", "Point two"] }
  ],
  "subArticles": [                         // optional — small headed sections under the lists
    { "heading": "Innovation :", "article": "Text…" }
  ]
}
```

Rules and behaviour:

| Field | Notes |
|---|---|
| `heading` | Tab label. **Must be unique within the country.** If it contains ` – ` (space, en dash, space), the map card shows only the part before it (e.g. "Dustbin Donation Initiative"); the full heading shows on the tab. |
| `article` | Line breaks are kept (`\n`). You can write bullets as `• ` lines inside the text. |
| `lists` | `listHead` is shown bold with a colon added automatically — don't end it with `:`. |
| `coverImage` | Any image entry. Usually the first/best photo of the article. |
| `videos` / `images` | Order in the array = order in the media row. Omit both for a text-only article (the text box then fills the height). |

### Add a new article to an existing country
1. Upload its photos/videos ([media guide](04-media-guide.md)).
2. Copy an existing article object in that country's `articles` array, paste it after the last one (add a comma between them), and replace `heading`, `article`, `coverImage`, `images`, `videos`.
3. Build and check `/world/<Country>`: a new tab appears; the map card lists it automatically.

### Add a new country
1. Add a country object to `countries` (new `id`, exact `country` name, at least one article).
2. Add a **pin** for it in [`src/components/Map.tsx`](../src/components/Map.tsx) — the `markers` array:
   ```ts
   { id: 9, country: "Morocco", top: "40%", left: "46%" },
   ```
   `top`/`left` are percentages of the map image. Adjust by eye with `npm run dev` until the pin tip sits on the country. `country` must match `content.json` exactly.

### Remove an article or country
Delete its object from the JSON (watch the commas). For a country, also delete its pin from `markers`. The uploaded media stay in storage (harmless).

---

## Stories (More Stories page)

```jsonc
{
  "id": 1,
  "title": "Volunteering Activities",   // card title, page title and URL (/more/Volunteering Activities) — keep unique
  "slug": "openness-respect-opportunity", // optional URL segment used instead of the title (use when the title has dots/odd characters)
  "coverText": "Short summary on the card…",   // truncated on the card
  "text": "",                            // optional intro paragraph on the story page ("" = none)
  "coverImage": { /* image entry */ },
  "videos": [ /* video entries */ ],     // optional
  "images": [ /* image entries */ ],
  "lists": [ { "listHead": "Ever since 2023, we have", "listPoints": ["…", "…"] } ],
  "tabs": [ /* optional extra tabs on the story page */ ]
}
```

**Tabs.** If a story has `tabs`, its page shows a tab bar: the first tab is the story's own content
(labelled with its `title`), followed by one tab per entry. Each tab has the same fields as a story
minus `id`/`slug`/`coverText`/`tabs`: `title` (tab label), `text`, `coverImage`, `images`, optional
`videos` and `lists`. Switching tab swaps the cover image, text, lists and media row. Example:
"Volunteering Activities" has a "Making More Health" tab.

Notes:
- The More Stories page shows cards side by side; two or three stories fit best.
- The story page (or tab) titled **"Making More Health"** appends the sentence *"Continuing the journey in 2024."* after its text. This is hard-coded in `src/pages/StoryPage.tsx` — edit it there if it needs to change.

### Add a video/photo to a story
Upload it, then append the printed entry to that story's `videos` or `images` array.

---

## Team

### `team1` — leadership (top of the Team page)
The **first** entry is shown alone on the first row; the rest on the second row.

```jsonc
{
  "name": "Derek O’Leary",
  "occupation": "CMD - IMETA",                       // short line on the card
  "des": "Country Managing Director, IMETA",         // full title in the pop-up
  "image": { /* image entry */ }                      // or "" for the grey placeholder avatar
}
```

`des` tip: text in parentheses moves to a second line in the pop-up, e.g.
`"Communications Senior Manager India ( India OPU Champion )"`.

### `team2` — groups
```jsonc
[
  { "teamName": "IMETA Core Team", "team": [ /* members */ ] },
  { "teamName": "OPU Champions",   "team": [ /* members */ ] }
]
```
The first group is on the left, the second on the right. Members use the same format as `team1`.

**Team photos:** square portraits work best (they are shown square). Upload with `npm run media:add` and paste the entry as `image`.

---

## Media entry formats

You never write these by hand — `npm run media:add` prints them. For reference:

**Image entry** (used in `coverImage`, `images`, team `image`)
```json
{ "type": "image", "full": "m/3631d748bc982056/full.webp", "thumb": "m/3631d748bc982056/thumb.webp", "width": 2048, "height": 1536 }
```

**Video entry** (used in `videos`) — the video plus a poster image:
```json
{
  "src":   { "type": "video", "hls": "m/777a548544ba171e/master.m3u8", "width": 1920, "height": 1080, "duration": 93, "levels": ["src", "720p"] },
  "thumb": { "type": "image", "full": "m/11f41fc89614039e/full.webp", "thumb": "m/11f41fc89614039e/thumb.webp", "width": 1920, "height": 1080 },
  "caption": "Openness"
}
```
`width`/`height` must be the real size (the tool fills them in) — the viewer uses them to draw the frame at the right shape before the media loads.

---

## Other text that is in code (not in content.json)

| Text | File |
|---|---|
| Page title "India, Middle East, Turkey, and Africa (IMETA)" | `src/pages/MapPage.tsx` |
| IMETA card + modal text | `src/pages/MapPage.tsx` (appears twice: card and modal) |
| **Disclaimer date** "*The data provided on this platform are updated as of October 27, 2025*" | `src/pages/MapPage.tsx` — update it with each content refresh |
| Button labels "More Stories", "SD4G IMETA Team" | `src/pages/MapPage.tsx` |
| "More Stories" heading | `src/pages/MoreStories.tsx` |
| "Click To Explore" on the globe | `src/pages/GlobePage.tsx` |
| Browser tab title | `index.html` (`<title>`) |

Search the project for the exact sentence (VS Code: <kbd>Ctrl/Cmd</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd>) to find anything else.

## Content update checklist

- [ ] Media uploaded and entries pasted (no `originals/` keys — only `m/…`)
- [ ] Headings unique per country; country names match pins
- [ ] Disclaimer date updated in `MapPage.tsx`
- [ ] `npm run build` passes
- [ ] Checked in `npm run dev` / `npm run preview`: tabs, map card, media row, lightbox
- [ ] Published via PR `dev → main` ([deployment](05-deployment.md))
