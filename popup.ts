function addUrlTab(elem: chrome.tabs.Tab): HTMLDivElement {
  /** Operate on single Element to create and add a tab in
   * the list after the title Elem
   */
  const tabUrl: HTMLDivElement = document.createElement('div') as HTMLDivElement;
    tabUrl.className = 'tab-url';
    const elemUrlVar = elem.url || 'Untitled';
    
    tabUrl.textContent = elemUrlVar;
    tabUrl.setAttribute('title', elemUrlVar);
    const tabUrlReloadIco: HTMLElement = document.createElement('i') as HTMLElement;
    tabUrlReloadIco.className = 'fa-solid fa-rotate-right';
    tabUrlReloadIco.innerHTML = "&#8635;";
    tabUrl.appendChild(tabUrlReloadIco);
    tabUrlReloadIco.addEventListener('click', () => {
      if (elem.id !== undefined) {
        chrome.tabs.reload(elem.id);
      }
    });
    const tabUrlCloseIco: HTMLElement = document.createElement('i') as HTMLElement;
    tabUrlCloseIco.className = 'fa-solid fa-xmark';
    tabUrlCloseIco.innerHTML = "&times;";
    tabUrl.appendChild(tabUrlCloseIco);
    tabUrlCloseIco.addEventListener('click', () => {
      if (elem.id !== undefined) {
        chrome.tabs.remove(elem.id);
      }
    });
  return tabUrl;
}

function displayTabs(tabs: chrome.tabs.Tab[]): void {
  const tabList: HTMLElement = document.getElementById('tab-list') as HTMLElement;
  const h1Elem: HTMLElement = document.querySelector('h1') as HTMLElement;

  h1Elem.textContent = `Found ${tabs.length} OpenQA tab${tabs.length !== 1 ? 's' : ''}`;

  if (tabs.length === 0) {
    h1Elem.textContent = 'No OpenQA tabs found';
    return;
  }
  //chrome.action.setBadgeText({ text: tabs.length.toString() });

  tabList.innerHTML = '';
  
  tabs.forEach(tab => {
    const tabItem: HTMLDivElement = document.createElement('div');
    tabItem.className = 'tab-item';

    const tabTitle: HTMLDivElement = document.createElement('div');
    tabTitle.className = 'tab-title';
    tabTitle.textContent = tab.title || 'Untitled';
    const tabUrl = addUrlTab(tab);
    
    tabItem.appendChild(tabTitle);
    tabItem.appendChild(tabUrl);

    tabItem.addEventListener('click', () => {
      if (tab.id !== undefined) {
        chrome.tabs.update(tab.id, { active: true });
      }
      if (tab.windowId !== undefined) {
        chrome.windows.update(tab.windowId, { focused: true });
      }
    });

    tabList.appendChild(tabItem);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[Popup] DOM loaded, sending message to background');
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getOpenQATabs' });
    console.log('[Popup] Received response:', response);
    if (response && response.tabs) {
      console.log('[Popup] Displaying', response.tabs.length, 'tabs');
      displayTabs(response.tabs);
    } else {
      console.error('[Popup] No tabs received from background');
    }
  } catch (error) {
    console.error('[Popup] Error fetching tabs:', error);
  }
});
