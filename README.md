# Darias Website

Official website of Darias.

Created by Derya Toklu.

Live: https://dariast34.github.io

## Tech stack

HTML, CSS, and vanilla JavaScript. No build step, no backend, no database.

## Structure

- `js/apps-data.js` — apps, games, and product links
- `js/config.js` — site config, including `contactEmail`
- `js/i18n.js` — Turkish / English strings
- `css/styles.css` — design system
- Static pages under `/apps`, `/games`, `/windows`, `/about`, `/privacy`

Add a new Android product by appending an object to `DARIAS_APPS`. Add a Windows product to `DARIAS_WINDOWS_APPS`. Leave empty URLs as `""`.

## Local preview

From the project root:

```bash
python -m http.server 8080
```

Open http://127.0.0.1:8080

## Deployment

GitHub Pages serves the `main` branch from `/` (repository root).

Remote: https://github.com/dariast34/dariast34.github.io
