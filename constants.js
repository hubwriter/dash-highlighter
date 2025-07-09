// Shared constants for the Dash Highlighter extension
const DASH_HIGHLIGHTER_CONSTANTS = {
    // Default font family that matches content.js getStyle() function
    DEFAULT_FONT_FAMILY: "math, 'Times New Roman', fantasy, serif",

    // Default settings
    DEFAULTS: {
        urlPatterns: 'https://github.com/*',
        fontFamily: 'default',
        enDashBg: '#7083e1',  // blue background for en dashes
        enDashFg: '#ffffff',  // white text for en dashes
        emDashBg: '#ffff00',  // yellow background for em dashes
        emDashFg: '#b614c2',  // purple text for em dashes
        enDashEnable: true,
        emDashEnable: true
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DASH_HIGHLIGHTER_CONSTANTS;
}
