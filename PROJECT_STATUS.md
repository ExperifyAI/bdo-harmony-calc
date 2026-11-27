# BDO Companion — project status

Updated 2026-11-27. Region: MENA.

## Completed
- Added Recipes navigation and searchable, method-filtered, paginated output recipes and manufacture groups to existing index.html. Existing modules unchanged.
- Default loads data/recipe-catalog.json when present; falls back to existing 33-record crafting seed. Supports local JSON or previous extraction HTML import. Consistent manufacture ingredient matches override XML; conflicting matches retain XML and are labeled. No assumed yields.
- UI commit: fdba6e9c01ede9ea21afe0e052c9e22ecd4223c3.

## P0 outstanding
- Full recovered extraction contains 3,267 output recipes, 7,079 manufacture records and 75,407 item names. Extracted as recipe-catalog.json; must be committed to data/recipe-catalog.json. Current GitHub connection accepts inline text only and runtime cannot resolve github.com, so the multi-megabyte file was not transferred. Local import is a temporary workaround, not a deployed full catalog.
- Verify production Vercel deployment and browser smoke test after full data upload. UI commit status observed: [{"context":"Vercel","state":"success","target_url":"https://vercel.com/experify-ais-projects/bdo-harmony-calc/88u3bwUik4dZDfjsXUchuVD7ED7P"}].
- Existing alchemy calculator intentionally separate; no profitability assumptions extended to new data.
