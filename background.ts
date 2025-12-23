chrome.tabs.onUpdated.addListener(updateBadge);
chrome.tabs.onRemoved.addListener(updateBadge);

async function updateBadge() {
  const tabs = await chrome.tabs.query({});
  const openqaTabs = tabs.filter(tab => tab.url && tab.url.includes('/openqa'));
  const count = openqaTabs.length;

  chrome.action.setBadgeText({ text: count > 0 ? count.toString() : '' });
  chrome.action.setBadgeBackgroundColor({ color: '#FF6B35' });
}

// Update badge immediately when extension loads
updateBadge();

