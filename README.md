# Aatasam Farooq: portfolio site

Single page site in plain HTML, CSS and JavaScript. No build step.

```
index.html      page content
styles.css      all styling
script.js       nav, Calendly popup, lightbox, scroll animations, audit form
assets/         images, favicon, social share image
_private/       unblurred originals, NOT published (client names / account IDs visible)
vercel.json / .vercelignore / netlify.toml   deploy settings
```

## Preview locally

Open `index.html` in a browser, or run a tiny local server from this folder:

```
python3 -m http.server 8000
```

then visit http://localhost:8000

## Deploy

**Vercel:** import the GitHub repo, framework preset "Other", no build command, output directory `.` (root).
`.vercelignore` keeps `_private/` off the live site.

**Netlify:** "Add new site" > "Import from Git" and pick this repo. `netlify.toml` already sets
everything and deletes `_private/` from the deployed copy.
Do not use Netlify drag and drop with this whole folder, because that skips the config and would publish `_private/`.

## Audit form (Formspree)

The form posts to `https://formspree.io/f/mkjgybpo` (set in the `action` attribute of `#audit-form`
in `index.html`). Submissions go to the email on that Formspree form. `script.js` sends it with
fetch, so visitors stay on the page and see a success or error message.

## Things to replace

- Profile photo: `assets/profile.jpg` (480x480 square crop). Replace the file to change it.
- Domain: replace every `YOUR-DOMAIN.com` in the `<head>` of `index.html` with your real domain
- Calendly: set in one place, `CALENDLY_URL` at the top of `script.js`
- WhatsApp: search `wa.me/923239947520` in `index.html` (4 links, same URL)
