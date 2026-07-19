async function collapseGroups(){
    let tabs = await chrome.tabs.query({currentWindow: true});
    //check if tabs exist
    const windowId = tabs.length > 0 ? tabs[0].windowId : undefined;
    let groups = await chrome.tabGroups.query({windowId});
    if(document.querySelector("#apply-all-windows").checked){
        groups = await chrome.tabGroups.query({});
    }
    const updatePromises = groups.map(g =>
    chrome.tabGroups.update(g.id, {collapsed: true})
    );
    await Promise.all(updatePromises);
}

async function expandGroups(){
    console.log("expandGroups");
    let tabs = await chrome.tabs.query({currentWindow: true});
    //check if tabs exist
    const windowId = tabs.length > 0 ? tabs[0].windowId : undefined;
    let groups = await chrome.tabGroups.query({windowId});
    if(document.querySelector("#apply-all-windows").checked){
        groups = await chrome.tabGroups.query({});
    }
    const updatePromises = groups.map(g =>
    chrome.tabGroups.update(g.id, {collapsed: false})
    );
    await Promise.all(updatePromises);
}

const expandGroupsButton = document.querySelector("#expand-groups");
expandGroupsButton.addEventListener("click", expandGroups);

const collapseGroupsButton = document.querySelector("#collapse-groups");
collapseGroupsButton.addEventListener("click", collapseGroups);


