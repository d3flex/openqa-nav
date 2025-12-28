import getOpenQATabs from './utils.js';

// Define updateBadge function first
async function updateBadge() {
  const openqaTabs = await getOpenQATabs();
  const count = openqaTabs.length;

  chrome.action.setBadgeText({ text: count > 0 ? count.toString() : '' });
  chrome.action.setBadgeBackgroundColor({ color: '#FF6B35' });
}

// Listen for tab changes to update badge
chrome.tabs.onUpdated.addListener(updateBadge);
chrome.tabs.onRemoved.addListener(updateBadge);
chrome.tabs.onCreated.addListener(updateBadge);

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log('[Background] Received message:', request);
  if (request.action === 'getOpenQATabs') {
    getOpenQATabs().then(tabs => {
      console.log('[Background] Sending tabs:', tabs.length);
      sendResponse({ tabs });
    });
    return true; // Keep channel open for async response
  }
});

// Update badge immediately when extension loads
updateBadge();