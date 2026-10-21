# For My Love — Birthday Surprise Website

A responsive romantic birthday experience built with semantic HTML5, CSS3, and vanilla JavaScript.

## Run locally
Open `index.html` in a modern browser. No build step or framework is required.

## Personalize it
1. Change the image paths in the hero and memory gallery to use your own photos.
2. Update the love letter in `script.js` (`letterText`).
3. Edit the timeline milestones and modal message in `index.html`.
4. Change colors in `:root` at the top of `style.css`.

## Add photos
The hero photo and four memory photos are loaded from the `img/` folder. Replace the corresponding `src` values in `index.html` to use different files, keeping them in that folder. Tap a memory photo to open its larger preview.

## Notes
- Google Fonts are optional; system fallbacks are included.
- The visual-effects canvas is capped at 550 particles and uses one animation loop.
- The candle relights automatically five seconds after it is blown out.
- `prefers-reduced-motion` is respected.
- Use photos you have permission to share, and test on a phone before sending the link.
