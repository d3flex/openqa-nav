async function getOpenQATabs() {
  const tabs = await chrome.tabs.query({});

  const openqaTabs = tabs.filter(tab => {
    return tab.url && tab.url.includes('/openqa');
  });

  return openqaTabs;
}

function addUrlTab(elem) {
  /** Operate on single Element to create and add a tab in
   * the list after the title Elem
   */
  const tabUrl = document.createElement('div');
    tabUrl.className = 'tab-url';
    tabUrl.textContent = elem.url;
    tabUrl.setAttribute('title', elem.url);
    tabUrlReloadIco = document.createElement('i');
    tabUrlReloadIco.className = 'fa-solid fa-rotate-right';
    tabUrlReloadIco.innerHTML = "&#8635;";
    tabUrl.appendChild(tabUrlReloadIco);
    tabUrlReloadIco.addEventListener('click', () => {
      chrome.tabs.reload(elem.id);
    });
    tabUrlCloseIco = document.createElement('i');
    tabUrlCloseIco.className = 'fa-solid fa-xmark';
    tabUrlCloseIco.innerHTML = "&times;";
    tabUrl.appendChild(tabUrlCloseIco);
    tabUrlCloseIco.addEventListener('click', () => {
      chrome.tabs.remove(elem.id);
    });
  return tabUrl;
}

function displayTabs(tabs) {
  const tabList = document.getElementById('tab-list');
  const h1Elem = document.querySelector('h1');

  h1Elem.textContent = `Found ${tabs.length} OpenQA tab${tabs.length !== 1 ? 's' : ''}`;

  if (tabs.length === 0) {
    h1Elem.textContent = 'No OpenQA tabs found';
    return;
  }

  tabList.innerHTML = '';
  
  tabs.forEach(tab => {
    const tabItem = document.createElement('div');
    tabItem.className = 'tab-item';

    const tabTitle = document.createElement('div');
    tabTitle.className = 'tab-title';
    tabTitle.textContent = tab.title || 'Untitled';
    tabUrl = addUrlTab(tab);
    
    tabItem.appendChild(tabTitle);
    tabItem.appendChild(tabUrl);

    tabItem.addEventListener('click', () => {
      chrome.tabs.update(tab.id, { active: true });
      chrome.windows.update(tab.windowId, { focused: true });
    });

    tabList.appendChild(tabItem);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const tabs = await getOpenQATabs();
  displayTabs(tabs);
});
