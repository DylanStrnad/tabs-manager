async function ungroupTabs(){
    // apply to all windows if checked
    if(document.querySelector("#btncheck1").checked){
        await ungroupTabsAllWindows();
    } else {
        const tabs = await chrome.tabs.query({currentWindow: true});
        const tabIds = [];
        for (const tab of tabs) {
            if(tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE){
                tabIds.push(tab.id);
            }
        }
        await chrome.tabs.ungroup(tabIds);
    }
}

async function ungroupTabsAllWindows(){
    const tabs = await chrome.tabs.query({});
        const tabIds = [];
        for (const tab of tabs) {
            if(tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE){
                tabIds.push(tab.id);
            }
        }
        await chrome.tabs.ungroup(tabIds);
}

const button = document.querySelector("#ungroup");
button.addEventListener("click", ungroupTabs);
