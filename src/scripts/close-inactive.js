//close all inactive tabs
async function closeInactiveTabs() {
    const tabs = document.querySelector("#apply-all-windows").checked ? await chrome.tabs.query({}) : await chrome.tabs.query({currentWindow: true});
    
    const cutOffInMinutes = parseInt(document.querySelector('#inactive-time').value);
    const cutOffTime = Date.now() - cutOffInMinutes * 60 * 1000;
    for (const tab of tabs) {
        if(tab.lastAccessed < cutOffTime){
            chrome.tabs.remove(tab.id);
        }
    }

}
const closeInactiveButton = document.querySelector("#close-inactive");
closeInactiveButton.addEventListener("click", closeInactiveTabs);