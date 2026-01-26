# Dash Highlighter - Copilot Instructions

## Repository Overview

**Dash Highlighter** is a Chrome browser extension (Manifest V3) that highlights en dashes (–) and em dashes (—) on web pages to make them more visible. It's a small, focused project with ~810 lines of code across JavaScript, HTML, and CSS files.

**Technology Stack:**
- **Runtime:** Chrome Extension (Manifest V3)
- **Languages:** JavaScript (ES2021), HTML5, CSS3
- **Build Tools:** npm, ESLint v9.35.0
- **Node Version:** >= 16 (tested with Node 18 in CI, Node 20 locally)
- **Project Size:** Small (~4 JS files, ~810 total LOC)

## Build & Validation Commands

### Installation & Setup

**ALWAYS run `npm ci` instead of `npm install` for clean, reproducible builds:**
```bash
npm ci
```
- Takes ~1 second to complete
- CI workflow uses `npm ci` - match this locally
- `npm install` also works but may produce different lock file states

### Linting (ESLint)

**ALWAYS run ESLint before committing code changes:**
```bash
npm run lint
```
- Runs: `npx eslint "**/*.js"`
- Takes ~1-2 seconds
- Produces warnings (no-console) but no errors in baseline code
- Console warnings are acceptable and expected (extension uses console.log for debugging)
- Errors will cause CI to fail; warnings will not

**Auto-fix linting issues:**
```bash
npm run lint:fix
```

### Testing

**No automated test suite exists.** Manual testing workflow:
1. Load extension unpacked in Chrome at `chrome://extensions/` (enable Developer Mode)
2. Open `test.html` in browser or navigate to GitHub
3. Verify en dashes (–) and em dashes (—) are highlighted
4. Check browser console for extension debug messages
5. Test options page: right-click extension icon → Options

## Continuous Integration

### GitHub Actions Workflow

**Workflow:** `.github/workflows/eslint-pr-check.yml`
**Triggers:** Pull requests to `main` branch, manual dispatch
**Node Version:** 18 (specified in workflow)
**Steps:**
1. Checkout code (`actions/checkout@v4`)
2. Setup Node.js 18 (`actions/setup-node@v4` with npm cache)
3. Install dependencies with `npm ci`
4. Run ESLint via reviewdog (`reviewdog/action-eslint@v1`)
   - Reports inline comments on PR diffs
   - **Fails on errors** (`fail_on_error: true`)
   - **Allows warnings** (`fail_level: error`)
   - Only checks added/modified lines (`filter_mode: added`)

**To avoid CI failures:**
- Run `npm run lint` locally before pushing
- Fix all ESLint errors (but warnings are OK)
- Ensure Node >= 16

## Project Structure

### Root Directory Files

```
dash-highlighter/
├── .github/
│   └── workflows/
│       └── eslint-pr-check.yml    # CI workflow
├── manifest.json                   # Chrome extension manifest (v3)
├── content.js                      # Main extension logic (249 lines)
├── constants.js                    # Shared constants & defaults (22 lines)
├── options.js                      # Options page logic (155 lines)
├── options.html                    # Extension options UI (95 lines)
├── styles.css                      # Styling for options page (204 lines)
├── test.html                       # Manual test page (48 lines)
├── icon16.png, icon48.png, icon128.png  # Extension icons
├── package.json                    # npm config with lint scripts
├── package-lock.json               # Dependency lock file
├── eslint.config.mjs               # ESLint 9+ flat config (37 lines)
├── .gitignore                      # Ignores node_modules/, npm logs
├── CODEOWNERS                      # @hubwriter
├── LICENSE                         # MIT License
└── README.md                       # User documentation
```

### Key Source Files

**manifest.json:**
- Chrome Extension Manifest V3
- Permissions: `storage`, `host_permissions: <all_urls>`
- Content scripts: loads `constants.js` then `content.js` on all URLs at `document_end`
- Options page: `options.html`

**content.js (main extension logic):**
- Highlights dashes using DOM tree walker and `<span>` wrappers
- Loads user settings from `chrome.storage.sync`
- URL pattern matching to control which sites are active
- MutationObserver for dynamic content (AJAX/SPA sites)
- Real-time settings updates via storage change listener
- Uses ESLint globals: `chrome`, `document`, `window`, `console`, etc.

**constants.js:**
- Defines `DASH_HIGHLIGHTER_CONSTANTS` object
- Default settings: colors, fonts, URL patterns, enable flags
- Default URL pattern: `https://github.com/*` (GitHub only)
- Exports for use in other files

**options.js:**
- Options page interactivity
- Saves/restores settings to/from `chrome.storage.sync`
- Live preview of dash highlighting using DOM manipulation
- Updates settings on user input/change events

**eslint.config.mjs:**
- ESLint 9+ flat config format
- ES2021 syntax
- Browser globals defined (chrome, document, window, console, etc.)
- Rules: `no-unused-vars: error`, `no-undef: error`, `no-console: warn`
- Special config for `constants.js` to allow module.exports

### Architecture

**Extension Type:** Content script-based Chrome Extension
**Execution Model:**
1. Content scripts (`constants.js` → `content.js`) inject into matching web pages
2. On page load, load settings from `chrome.storage.sync`
3. Check URL against user-configured patterns
4. If match, highlight dashes via DOM tree walker
5. Set up MutationObserver for dynamic content
6. Listen for settings changes and re-highlight in real-time

**No build/compile step** - extension runs directly from source files.

## Development Workflow

### Making Code Changes

1. **Always install dependencies first:**
   ```bash
   npm ci
   ```

2. **Edit JavaScript files** (content.js, options.js, constants.js)
   - Follow existing code style
   - Use ES2021 syntax, `'use strict';` mode
   - Console warnings are acceptable for debugging

3. **Lint your changes:**
   ```bash
   npm run lint
   ```
   - Fix any **errors** (warnings are OK)
   - Use `npm run lint:fix` for auto-fixable issues

4. **Manual testing:**
   - Load/reload extension in Chrome: `chrome://extensions/` → "Load unpacked"
   - Test on `test.html` or GitHub pages
   - Check browser console for extension logs
   - Test options page functionality

5. **Verify no new ESLint errors** before committing

### Common Pitfalls

**ESLint Configuration:**
- Project uses **ESLint 9+ flat config** (`eslint.config.mjs`)
- Old `.eslintrc` format will not work
- Must define browser globals (chrome, document, etc.) in config

**npm ci vs npm install:**
- CI uses `npm ci` - use this locally for consistency
- `npm ci` requires existing `package-lock.json`
- Faster and more reliable for clean installs

**Chrome Extension Testing:**
- Changes require reloading extension at `chrome://extensions/`
- Content script changes need page reload too
- Check console in both extension background and page contexts

**URL Pattern Matching:**
- Default pattern: `https://github.com/*`
- Wildcard `*` matches any characters
- Empty pattern or `*` alone = all URLs
- Extension exits early if URL doesn't match

**Console Warnings:**
- ESLint warns about console.log statements
- These are intentional for debugging the extension
- **Do not remove console statements** - they're part of extension functionality
- CI allows warnings, only fails on errors

## Security & Dependencies

**npm audit warning:**
- `js-yaml` has moderate vulnerability (prototype pollution)
- Comes from eslint dependency chain
- Not a runtime issue (dev dependency only)
- Can ignore or run `npm audit fix` if desired

**No runtime dependencies** - extension uses only browser APIs.

## File Size & Performance

- Total source: ~810 lines of code
- Main logic: content.js (~249 lines)
- Lightweight, no frameworks
- Optimized DOM traversal to minimize page impact

## Summary

Trust these instructions for build and validation workflows. This is a simple Chrome extension project with:
- **No build step** (runs directly from source)
- **Lint with ESLint** before committing (`npm run lint`)
- **Install with npm ci** for reproducible builds
- **Manual testing** in Chrome browser
- **Console warnings are OK**, but fix all errors

Only search for additional information if these instructions are incomplete or found to be incorrect.
