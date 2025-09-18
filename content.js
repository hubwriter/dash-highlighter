// Content script to highlight dashes
// Enhanced with ESLint PR workflow
(function() {
    'use strict';

    // Unicode characters for dashes
    const EN_DASH = '\u2013'; // –
    const EM_DASH = '\u2014'; // —

    // Default styles for highlighting
    const DEFAULTS = DASH_HIGHLIGHTER_CONSTANTS.DEFAULTS

    // Create a unique class name to avoid conflicts
    const PROCESSED_CLASS = 'dash-highlighter-processed';

    // Store user styles and enable flags
    let userStyles = { ...DEFAULTS };

    // Check if current URL matches the user's URL patterns
    function shouldRunOnCurrentUrl(urlPatterns) {
        const currentUrl = window.location.href;
        const patterns = urlPatterns;

        // If no patterns specified, run on all URLs
        if (!patterns || patterns.trim() === '' {
            return true;
        }

        // Split by commas and trim whitespace
        const patternList = patterns.split(',').map(p => p.trim()).filter(p => p);

        // Check each pattern
        for (const pattern of patternList) {
            if (matchesPattern(currentUrl, pattern)) {
                return true;
            }
        }

        return false;
    }

    // Simple pattern matching function
    function matchesPattern(url, pattern) {
        // Convert glob pattern to regex
        const regexPattern = pattern
            .replace(/[.+^${}()|[\]\\]/g, '\\$&') // Escape special regex chars except *
            .replace(/\*/g, '.*'); // Convert * to .*

        const regex = new RegExp('^' + regexPattern + '$');
        return regex.test(url);
    }

    function getStyle(dashType) {
        // Use stored font family, or default if not set or set to 'default'
        const fontFamily = (userStyles.fontFamily === 'default' || !userStyles.fontFamily)
            ? DASH_HIGHLIGHTER_CONSTANTS.DEFAULT_FONT_FAMILY
            : userStyles.fontFamily;

        if (dashType === 'en') {
            return `font-family: ${fontFamily}; background-color:${userStyles.enDashBg}; color:${userStyles.enDashFg}`;
        } else {
            return `font-family: ${fontFamily}; background-color:${userStyles.emDashBg}; color:${userStyles.emDashFg}`;
        }
    }

    function highlightDashes() {
        // Get all text nodes in the document
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Skip if parent already processed or is script/style
                    const parent = node.parentNode;
                    if (parent.classList && parent.classList.contains(PROCESSED_CLASS)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // Only process if text contains dashes
                    if (node.textContent.includes(EN_DASH) || node.textContent.includes(EM_DASH)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_REJECT;
                }
            }
        );

        const textNodes = [];
        let node;

        // Collect all text nodes that need processing
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        // Process each text node
        textNodes.forEach(processTextNode);
    }

    function processTextNode(textNode) {
        const text = textNode.textContent;

        // Check if text contains any dashes
        if (!text.includes(EN_DASH) && !text.includes(EM_DASH)) {
            return;
        }

        // Create a document fragment to build the new content
        const fragment = document.createDocumentFragment();

        // Split text by dashes while preserving them
        const parts = text.split(new RegExp(`([${EN_DASH}${EM_DASH}])`, 'g'));

        parts.forEach(part => {
            if (part === EN_DASH) {
                if (userStyles.enDashEnable !== false) { // highlight if enabled (default true)
                    const span = document.createElement('span');
                    span.style.cssText = getStyle('en');
                    span.textContent = EN_DASH;
                    span.classList.add(PROCESSED_CLASS);
                    fragment.appendChild(span);
                } else {
                    fragment.appendChild(document.createTextNode(EN_DASH));
                }
            } else if (part === EM_DASH) {
                if (userStyles.emDashEnable !== false) { // highlight if enabled (default true)
                    const span = document.createElement('span');
                    span.style.cssText = getStyle('em');
                    span.textContent = EM_DASH;
                    span.classList.add(PROCESSED_CLASS);
                    fragment.appendChild(span);
                } else {
                    fragment.appendChild(document.createTextNode(EM_DASH));
                }
            } else if (part.length > 0) {
                fragment.appendChild(document.createTextNode(part));
            }
        });

        // Replace the original text node with the fragment
        textNode.parentNode.replaceChild(fragment, textNode);
    }

    // Run when page loads
    function init() {
        console.log('Dash Highlighter: Content script loaded on', window.location.href);

        // Load user options from chrome.storage
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
            chrome.storage.sync.get(DEFAULTS, function(items) {
                userStyles = items;
                console.log('Dash Highlighter: Loaded settings', items);

                // Check if extension should run on current URL
                if (!shouldRunOnCurrentUrl(items.urlPatterns)) {
                    console.log('Dash Highlighter: URL does not match patterns, exiting');
                    return; // Exit early if URL doesn't match patterns
                }

                console.log('Dash Highlighter: URL matches patterns, starting highlighting');
                highlightDashes();
                setupMutationObserver();
            });
        } else {
            // If no chrome storage, use defaults and check URL
            if (!shouldRunOnCurrentUrl(DEFAULTS.urlPatterns)) {
                console.log('Dash Highlighter: URL does not match default patterns, exiting');
                return;
            }
            console.log('Dash Highlighter: Using default settings, starting highlighting');
            highlightDashes();
            setupMutationObserver();
        }
    }

    // Set up mutation observer for dynamically added content
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            let shouldProcess = false;

            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if any added nodes contain text with dashes
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.TEXT_NODE) {
                            if (node.textContent.includes(EN_DASH) || node.textContent.includes(EM_DASH)) {
                                shouldProcess = true;
                            }
                        } else if (node.nodeType === Node.ELEMENT_NODE) {
                            const text = node.textContent || '';
                            if (text.includes(EN_DASH) || text.includes(EM_DASH)) {
                                shouldProcess = true;
                            }
                        }
                    });
                }
            });

            if (shouldProcess) {
                // Debounce to avoid excessive processing
                clearTimeout(setupMutationObserver.debounceTimer);
                setupMutationObserver.debounceTimer = setTimeout(highlightDashes, 100);
            }
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Add a small delay to ensure page is fully loaded
        setTimeout(init, 100);
    }

    // Listen for storage changes to update settings in real-time
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
        chrome.storage.onChanged.addListener(function(changes, namespace) {
            if (namespace === 'sync') {
                // Update user styles with new values
                for (let key in changes) {
                    if (changes[key].newValue !== undefined) {
                        userStyles[key] = changes[key].newValue;
                    }
                }

                // If URL patterns changed, check if we should still run
                if (changes.urlPatterns) {
                    if (!shouldRunOnCurrentUrl(changes.urlPatterns.newValue)) {
                        // If we shouldn't run anymore, we can't easily remove existing highlights
                        // but we can stop future processing
                        console.log('Dash Highlighter - URL patterns changed, extension disabled for this URL');
                        return;
                    }
                }

                // Re-highlight with new settings
                highlightDashes();
            }
        });
    }
})();
