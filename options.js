// Saves options to chrome.storage
function saveOptions(e) {
  e.preventDefault();
  chrome.storage.sync.set({
    enDashBg: document.getElementById('en-bg').value,
    enDashFg: document.getElementById('en-fg').value,
    emDashBg: document.getElementById('em-bg').value,
    emDashFg: document.getElementById('em-fg').value
  }, function() {
    document.getElementById('status').textContent = 'Options saved!';
    setTimeout(() => { document.getElementById('status').textContent = ''; }, 1000);
  });
}

// Restores select box and color state using the preferences stored in chrome.storage.
function restoreOptions() {
  chrome.storage.sync.get({
    enDashBg: '#ffff00',
    enDashFg: '#000000',
    emDashBg: '#ffb347',
    emDashFg: '#000000'
  }, function(items) {
    document.getElementById('en-bg').value = items.enDashBg;
    document.getElementById('en-fg').value = items.enDashFg;
    document.getElementById('em-bg').value = items.emDashBg;
    document.getElementById('em-fg').value = items.emDashFg;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('options-form').addEventListener('submit', saveOptions);
