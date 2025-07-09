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
  });
}

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
  let html = preview.textContent
    .replace(/\u2013|–/g, enEnabled ? `<span style="background:${enBg};color:${enFg};border-radius:4px;padding:0 2px;">–</span>` : '–')
    .replace(/\u2014|—/g, emEnabled ? `<span style="background:${emBg};color:${emFg};border-radius:4px;padding:0 2px;">—</span>` : '—');
  preview.innerHTML = html.replace(/\n/g, '<br>');
}

document.addEventListener('DOMContentLoaded', function() {
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
  updatePreview();
});
