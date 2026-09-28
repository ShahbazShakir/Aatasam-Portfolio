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

## Activate the audit form (Formspree)

1. Sign up free at https://formspree.io with aatasamq@gmail.com
2. Click "New form", name it "Ad audit requests"
3. Copy the form endpoint, it looks like `https://formspree.io/f/abcdwxyz`
4. In `index.html`, find `https://formspree.io/f/YOUR_FORM_ID` and replace it with your endpoint
5. Deploy, submit one test entry, then confirm your email in Formspree when it asks

Until step 4 is done the form shows a friendly "email me instead" message.

## Things to replace

- Profile photo: `assets/profile.jpg` (480x480 square crop). Replace the file to change it.
- Testimonials: the three cards marked "Placeholder" in the Client words section
- Domain: replace every `YOUR-DOMAIN.com` in the `<head>` of `index.html` with your real domain
- Calendly: set in one place, `CALENDLY_URL` at the top of `script.js`
- WhatsApp: search `wa.me/923239947520` in `index.html` (4 links, same URL)
