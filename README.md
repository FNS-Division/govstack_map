# GovStack Global Demo

An interactive world map demo built with React + Vite, displaying GovStack global activities and focal points parsed directly from an Excel spreadsheet — no backend required.

## Features

- **Global Map** — Full-screen Leaflet map with country-activity pins and focal-point markers
- **Filters** — Sidebar filters by Region, Status, Activity, and Focal Point + text search
- **Popups** — Card-style popups with all row details on marker click
- **Unmapped Panel** — Any row whose location can't be geocoded is listed in a dismissible panel
- **Sub-pages** — Searchable, sortable, paginated tables for Experts, Assets, and Input Sheet
- **No backend / No API keys** — Everything runs in the browser

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Map | Leaflet + React-Leaflet |
| Excel | xlsx (SheetJS) |
| Tiles | OpenStreetMap (free, no key) |

## Project Structure

```
src/
├── App.tsx                    # Root with BrowserRouter + DataProvider
├── main.tsx                   # Entry point, CSS imports
├── context/
│   └── DataContext.tsx        # Loads and exposes all sheet data
├── routes/
│   ├── GlobalMap.tsx          # Map page with filter logic
│   └── SheetPage.tsx          # Generic sheet table page
├── components/
│   ├── Layout.tsx             # Top nav + page shell
│   ├── MapView.tsx            # Leaflet map with markers
│   ├── FilterSidebar.tsx      # Left sidebar with filters
│   ├── MarkerPopup.tsx        # Popup card component
│   ├── DataTable.tsx          # Searchable table component
│   └── UnmappedPanel.tsx      # Unmapped rows panel
├── data/
│   └── countryCoordinates.ts  # Static lat/lng lookup
└── utils/
    ├── excelLoader.ts         # Fetch + parse Excel via xlsx
    ├── normalizeRows.ts       # Column name normalization
    └── markerOffset.ts        # Offset duplicate markers
public/
└── data/
    └── GovStack Global .xlsx  # Source data file
```

## Local Development

### Prerequisites

- Node.js 18+

### Run

```bash
cd govstack-demo
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build
# output in dist/
```

### Preview production build

```bash
npm run preview
```

## Deploying to Render (Static Site)

1. Push this folder to a GitHub repository.
2. On [Render](https://render.com), create a new **Static Site**.
3. Connect your repository.
4. Set the following:

| Setting | Value |
|---------|-------|
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

5. Click **Deploy**. Render will build and serve the site automatically.

> **Note:** The Excel file is in `public/data/` so it is included in the build output and loaded at runtime by the browser. No server-side processing is needed.

## Adding More Countries

Edit `src/data/countryCoordinates.ts` and add entries in the format:

```ts
"Country Name": [latitude, longitude],
```

Any country/location not in this file will appear in the **Unmapped Rows** panel on the map.

## Sheet Naming

The app looks for sheets by keyword (case-insensitive):

| Page | Keyword matched |
|------|----------------|
| Global Map | `global view` or `global` |
| Focal Points | `focal point` |
| Experts | `expert` |
| Assets | `asset` |
| Input Sheet | `input` |

If your sheet names change, update the keyword matches in `src/routes/GlobalMap.tsx` and `src/routes/SheetPage.tsx`.
