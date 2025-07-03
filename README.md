# GitHub dash highlighter Chrome extension

A Chrome extension that highlights en dashes (–) and em dashes (—) on GitHub pages to make them more visible.

## Features

- 🔍 Automatically detects en dashes and em dashes on GitHub pages
- 🎨 Highlights en dashes with black background and white text
- 🌟 Highlights em dashes with yellow background
- ⚡ Works on dynamically loaded content
- 🎯 Only runs on github.com (not subdomains)

## Installation

Since this extension is not published on the Chrome Web Store, you'll need to install it manually:

### Step 1: Download the Extension

1. Click the green **"Code"** button above
2. Select **"Download ZIP"**
3. Extract the ZIP file to a folder on your computer
4. Remember the location of this folder

### Step 2: Enable Developer Mode in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Toggle **"Developer mode"** ON (switch in the top right)
3. You should now see additional buttons appear

### Step 3: Load the Extension

1. Click the **"Load unpacked"** button
2. Navigate to and select the folder where you extracted the extension
3. The extension should now appear in your extensions list

### Step 4: Verify Installation

1. Refresh this page, or go to any GitHub page with dashes (like a pull request or issue)
2. Look for highlighted dashes:
   - En dashes (–) will have black background with white text
   - Em dashes (—) will have yellow background

## Usage

The extension works automatically once installed. Simply browse GitHub normally:

- View pull requests with dash-separated ranges
- Read issues and comments containing dashes
- Review documentation with proper typography

## Examples

The extension will highlight dashes in content like:
- Date ranges: "January 1–15, 2024"
- Time ranges: "2:00–3:30 PM"
- Page ranges: "See pages 10–25"
- Emphasis: "This is important—pay attention"

## Technical Details

- **Permissions**: Only accesses github.com pages (not subdomains like docs.github.com)
- **Performance**: Uses efficient DOM traversal to minimize impact
- **Compatibility**: Works with dynamically loaded content
- **Privacy**: No data collection or external requests
- **Limitations**: Dashes are not highlighted in edit mode (e.g. text input boxes)

## Troubleshooting

**Extension not working?**
- Make sure you're on a github.com page (not docs.github.com or other subdomains)
- Check that the extension is enabled in `chrome://extensions/`
- Try refreshing the page

**Dashes not highlighting?**
- Ensure the text contains actual en dashes (–) or em dashes (—), not regular hyphens (-)
- The extension only processes visible text content
- The extension does not highlight dashes in edit mode (i.e. when you are editing a page or adding a comment)

**Performance issues?**
- The extension is optimized for performance, but very large pages might see slight delays

## Contributing

Feel free to submit issues or pull requests if you find bugs or want to suggest improvements!

## License

MIT License - see LICENSE file for details.

## Version History

- **v1.0.0** - Initial release
  - Basic en dash and em dash highlighting
  - GitHub-only scope
  - Dynamic content support
