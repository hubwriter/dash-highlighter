// Content script to highlight dashes
(function() {
    'use strict';

    // Unicode characters for dashes
    const EN_DASH = '\u2013'; // –
    const EM_DASH = '\u2014'; // —

    // Styles for highlighting
    const EN_DASH_STYLE = 'font-family: math, "Times New Roman", fantasy, serif; background-color:black; color:white';
    const EM_DASH_STYLE = 'font-family: math, "Times New Roman", fantasy, serif; background-color:yellow';

    // Create a unique class name to avoid conflicts
    const PROCESSED_CLASS = 'dash-highlighter-processed';

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
                // Create span for en dash
                const span = document.createElement('span');
                span.style.cssText = EN_DASH_STYLE;
                span.textContent = EN_DASH;
                span.classList.add(PROCESSED_CLASS);
                fragment.appendChild(span);
            } else if (part === EM_DASH) {
                // Create span for em dash
                const span = document.createElement('span');
                span.style.cssText = EM_DASH_STYLE;
                span.textContent = EM_DASH;
                span.classList.add(PROCESSED_CLASS);
                fragment.appendChild(span);
            } else if (part.length > 0) {
                // Regular text
                fragment.appendChild(document.createTextNode(part));
            }
        });

        // Replace the original text node with the fragment
        textNode.parentNode.replaceChild(fragment, textNode);
    }

    // Run when page loads
    function init() {
        // Initial highlighting
        highlightDashes();

        // Set up mutation observer for dynamically added content
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
                clearTimeout(init.debounceTimer);
                init.debounceTimer = setTimeout(highlightDashes, 100);
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
        init();
    }
})();
