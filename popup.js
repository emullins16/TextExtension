const toggle = document.getElementById('toggle');

chrome.storage.local.get(['enabled'], (result) => {
    toggle.checked = result.enabled ?? true; // Set default state, honestly im lost which one is default by now but i think its on?
});

toggle.addEventListener('change', () => {
    chrome.storage.local.set({ enabled: toggle.checked }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => location.reload()
            });
        });
    });
});
