// Saves options to chrome.storage
function saveOptions() {
  chrome.storage.sync.set({
    enDashBg: document.getElementById('en-bg').value,
    enDashFg: document.getElementById('en-fg').value,
    emDashBg: document.getElementById('em-bg').value,
    emDashFg: document.getElementById('em-fg').value,
    enDashEnable: document.getElementById('en-enable').checked,
    emDashEnable: document.getElementById('em-enable').checked
  }, function() {
    document.getElementById('status').textContent = 'Options saved!';
    setTimeout(() => { document.getElementById('status').textContent = ''; }, 800);
  });
}

// Restores select box, color, and enable state using the preferences stored in chrome.storage.
function restoreOptions() {
  chrome.storage.sync.get({
    enDashBg: '#ffff00',
    enDashFg: '#000000',
    emDashBg: '#ffb347',
    emDashFg: '#000000',
    enDashEnable: true,
    emDashEnable: true
  }, function(items) {
    if (document.getElementById('en-bg')) document.getElementById('en-bg').value = items.enDashBg;
    if (document.getElementById('en-fg')) document.getElementById('en-fg').value = items.enDashFg;
    if (document.getElementById('em-bg')) document.getElementById('em-bg').value = items.emDashBg;
    if (document.getElementById('em-fg')) document.getElementById('em-fg').value = items.emDashFg;
    if (document.getElementById('en-enable')) document.getElementById('en-enable').checked = items.enDashEnable;
    if (document.getElementById('em-enable')) document.getElementById('em-enable').checked = items.emDashEnable;

    // Update preview after restoring options
    updatePreview();
  });
}

// Store the original preview text to avoid encoding issues
let originalPreviewText = '';

// Live preview logic for dash highlighting
function updatePreview() {
  const enEnabled = document.getElementById('en-enable')?.checked ?? true;
  const emEnabled = document.getElementById('em-enable')?.checked ?? true;
  const enBg = document.getElementById('en-bg')?.value || '#ffff00';
  const enFg = document.getElementById('en-fg')?.value || '#000000';
  const emBg = document.getElementById('em-bg')?.value || '#ffb347';
  const emFg = document.getElementById('em-fg')?.value || '#000000';
  const preview = document.getElementById('dash-preview');
  if (!preview) return;

  // Use stored original text if available, otherwise get it from the element
  if (!originalPreviewText) {
    originalPreviewText = preview.textContent;
  }

  // Reset to original text content
  preview.textContent = originalPreviewText;

  // Apply highlighting using DOM manipulation (similar to content.js)
  const EN_DASH = '\u2013'; // –
  const EM_DASH = '\u2014'; // —

  // Get all text nodes in the preview
  const walker = document.createTreeWalker(
    preview,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
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
  textNodes.forEach(function(textNode) {
    const text = textNode.textContent;

    // Check if text contains any dashes
    if (!text.includes(EN_DASH) && !text.includes(EM_DASH)) {
      return;
    }

    // Create a document fragment to build the new content
    const fragment = document.createDocumentFragment();

    // Split text by dashes while preserving them
    const parts = text.split(new RegExp(`([${EN_DASH}${EM_DASH}])`, 'g'));

    parts.forEach(function(part) {
      if (part === EN_DASH) {
        if (enEnabled) {
          const span = document.createElement('span');
          span.style.cssText = `background-color:${enBg}; color:${enFg}; border-radius:4px; padding:0 2px;`;
          span.textContent = EN_DASH;
          fragment.appendChild(span);
        } else {
          fragment.appendChild(document.createTextNode(EN_DASH));
        }
      } else if (part === EM_DASH) {
        if (emEnabled) {
          const span = document.createElement('span');
          span.style.cssText = `background-color:${emBg}; color:${emFg}; border-radius:4px; padding:0 2px;`;
          span.textContent = EM_DASH;
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
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Store the original preview text before any modifications
  const preview = document.getElementById('dash-preview');
  if (preview) {
    originalPreviewText = preview.textContent;
  }

  restoreOptions();
  [
    'en-bg', 'en-fg', 'em-bg', 'em-fg', 'en-enable', 'em-enable'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function() {
        saveOptions();
        updatePreview();
      });
      el.addEventListener('change', function() {
        saveOptions();
        updatePreview();
      });
    }
  });
});
