//restores tabs
async function restoreTabs() {
    //const tabs = document.querySelector("#apply-all-windows").checked ? await chrome.sessions.getRecentlyClosed() : await chrome.sessions.getRecentlyClosed();
    //const tabs = await chrome.sessions.getRecentlyClosed();
    const sessions = await chrome.sessions.getRecentlyClosed();
    const cutOffInMinutes = parseInt(document.querySelector('#time-tab-closed').value);
    const cutOffTime = Date.now() - (cutOffInMinutes * 60 * 1000);
    const sessionIds = [];
    for (const session of sessions) {
        //restore tabs that were closed within cutoff time
        if(session.lastModified*1000 >= cutOffTime){
            if (session.tab) {
                sessionIds.push(session.tab.sessionId);
            }
        }
    }
    chrome.runtime.sendMessage({ action: 'restore-tabs', sessionIds });

}
const restoreTabsButton = document.querySelector("#restore-tabs");
restoreTabsButton.addEventListener("click", restoreTabs);

async function restoreWindows() {
    const sessions = await chrome.sessions.getRecentlyClosed();
    const cutOffInMinutes = parseInt(document.querySelector('#time-window-closed').value);
    const cutOffTime = Date.now() - (cutOffInMinutes * 60 * 1000);
    const sessionIds = [];
    for (const session of sessions) {
        //restore windows that were closed within cutoff time
        if(session.lastModified*1000 >= cutOffTime){
            if (session.window) {
                sessionIds.push(session.window.sessionId);
            }
        }
    }
    chrome.runtime.sendMessage({ action: 'restore-windows', sessionIds });
}
const restoreWindowsButton = document.querySelector("#restore-windows");
restoreWindowsButton.addEventListener("click", restoreWindows);