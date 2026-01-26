# Dash Highlighter Chrome Extension

A Chrome extension that highlights en dashes (–) and em dashes (—) on web pages to make them more visible. Highly configurable with support for custom colors, fonts, and URL patterns.

## Features

- 🔍 Automatically detects en dashes and em dashes on web pages.
- 🎨 Configurable highlighting colors for both dash types.
- 🔤 Customizable fonts for highlighted dashes.
- ⚙️ Toggle highlighting on/off for each dash type.
- 🌐 URL pattern matching - choose which sites the extension runs on.
- ⚡ Works on dynamically loaded content (AJAX/SPA sites).
- 🎯 Real-time settings updates - no need to reload pages.

## Installation

Since this extension is not published on the Chrome Web Store, you'll need to install it manually:

### Step 1: Download the Extension

1. Click the green **"Code"** button above.
2. Select **"Download ZIP"**.
3. Extract the ZIP file to a folder on your computer.
4. Remember the location of this folder.

### Step 2: Enable Developer Mode in Chrome

1. Open Chrome and go to `chrome://extensions/`.
2. Toggle **"Developer mode"** ON (switch in the top right).
3. You should now see additional buttons appear.

### Step 3: Load the Extension

1. Click the **"Load unpacked"** button.
2. Navigate to and select the folder where you extracted the extension.
3. The extension should now appear in your extensions list.

### Step 4: Verify Installation

1. Go to [github.com/hubwriter/github-dash-highlighter/test.html](https://github.com/hubwriter/github-dash-highlighter/blob/main/test.html).
2. Look for highlighted dashes:
   - En dashes (–) will be highlighted in blue by default.
   - Em dashes (—) will be highlighted in yellow by default.

   You can change the highlighting colors in the extension's options. See "Configuration" below.

## Examples

The extension will highlight dashes in content like:
- Date ranges: "January 1–15, 2025."
- Time ranges: "2:00–3:30 PM."
- Page ranges: "See pages 10–25."
- Emphasis: "This is important—pay attention."

## Configuration

The extension is fully configurable, allowing you to customize highlighting colors, fonts, and enable/disable settings for both en dashes and em dashes.

### Accessing the Options Page

1. Open Chrome and go to `chrome://extensions/`.
2. Find the "Dash Highlighter" extension in your list.
3. Click the **"Details"** button on the extension card.
4. Scroll down and click **"Extension options"**.
5. The options page will open in a new tab where you can customize your settings.

Alternatively, you can:
1. Right-click the extension icon in your Chrome toolbar (if pinned).
2. Select **"Options"** from the context menu.

### Available Settings

- **URL Patterns**: Control which GitHub pages the extension runs on.
  - Default: `https://github.com/*` (all of GitHub).
  - Use `https://github.com/owner/repo/*` for specific repositories.
  - Use `*` or leave empty to run on all GitHub domains.
  - Supports wildcards and comma-separated patterns.
  - **Note**: Extension only has permissions for GitHub domains (github.com and subdomains).
- **Font Family**: Choose the font for highlighted dashes.
- **Colors**: Customize background and text colors for each dash type.
- **Enable/Disable**: Toggle highlighting for en dashes and em dashes individually.

### URL Pattern Examples

- `https://github.com/*` - All of GitHub.
- `https://github.com/owner/*` - All repositories for a specific owner.
- `https://github.com/owner/repo/*` - A specific repository only.
- `*` or empty - All GitHub domains (github.com and subdomains).

**Note**: The extension only has permissions for GitHub domains. To use on other sites, you would need to modify `manifest.json` and reload the extension.

## Technical Details

- **Permissions**: Restricted to GitHub domains only (github.com and subdomains) for security.
- **Performance**: Uses efficient DOM traversal to minimize impact.
- **Compatibility**: Works with dynamically loaded content.
- **Privacy**: No data collection or external requests.
- **Limitations**: Dashes are not highlighted in edit mode (e.g. text input boxes).

## Troubleshooting

**Extension not working?**
- Check that the current URL matches your configured URL patterns in the extension options.
- Make sure the extension is enabled in `chrome://extensions/`.
- Try refreshing the page.
- Check the browser console for debug messages from the extension.

**Dashes not highlighting?**
- Ensure the text contains actual en dashes (–) or em dashes (—), not regular hyphens (-).
- The extension only processes visible text content.
- The extension does not highlight dashes in edit mode (i.e. when you are editing a page or adding a comment).
- Verify that highlighting is enabled for the dash type in the extension options.

**Performance issues?**
- The extension is optimized for performance, but very large pages might see slight delays.

## Contributing

Feel free to submit issues or pull requests if you find bugs or want to suggest improvements!

### Development Setup

1. Clone the repository
2. Install development dependencies: `npm install`
3. Run ESLint: `npm run lint`
4. Fix ESLint issues: `npm run lint:fix`

### Code Quality

This project uses ESLint to maintain code quality. A GitHub Actions workflow automatically runs ESLint on pull requests to:

- ✅ Check for JavaScript errors and potential issues
- 📝 Show warnings and errors as comments in the PR diff view
- ❌ Prevent merging if any ESLint errors are found (warnings are allowed)

The workflow can also be run manually from the Actions tab in GitHub.

## License

MIT License - see LICENSE file for details.

## Version History

- **v1.1.0** - Configuation options
  - Add an options page for configuring highlighting etc.
  - Add files to support adding extension to Chrome Web Store.

- **v1.0.0** - Initial release.
  - Basic en dash and em dash highlighting.
  - GitHub-only scope.
  - Dynamic content support.
