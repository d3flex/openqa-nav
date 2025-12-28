async function getOpenQATabs(): Promise<chrome.tabs.Tab[]> {
  const tabs = await chrome.tabs.query({});
  return tabs.filter(tab => tab.url?.includes('/openqa'));
}

export default getOpenQATabs;
