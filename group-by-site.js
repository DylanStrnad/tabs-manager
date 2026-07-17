async function groupBySite() {
    if(document.querySelector("#apply-all-windows").checked){
        await groupBySiteAllWindows();
    } else {
        const tabs = await chrome.tabs.query({currentWindow: true});

        //to store the groups of tabs
        const groups = {};
        
        for (const tab of tabs) {
            const url = tab.url;
            let host = new URL(url).host;

            //remove www from group name if it exists
            host = host.replace(/^www\./i, '');
            console.log(host);
            let key = host;


            if (!groups[key]) {
                groups[key] = [];
            }

            groups[key].push(tab);
        }

        for (const [host, tabs] of Object.entries(groups)){
            const tabIds = tabs.map(tab =>tab.id); 

            //make groupId, containing the tabs
            const groupId = await chrome.tabs.group({
                tabIds
            });

            //create group with letter
            await chrome.tabGroups.update(groupId, {
                title: host
            });
        }
    }
}

async function groupBySiteAllWindows(){
    const tabs = await chrome.tabs.query({}); //only apply to current window

    //to store the groups of tabs
    const allWindows = {};

    //sort tabs by first letter and store in groups. a group defined by a letter (a-z)
    for (const tab of tabs) {
        const windowID = tab.windowId;
        if(!allWindows[windowID]){
            allWindows[windowID] = {};
        }

        const url = tab.url;
        let host = new URL(url).host;
        //remove www from group name if it exists
        host = host.replace(/^www\./i, '');
        console.log(host);
        let key = host;

        if(!allWindows[windowID][key]){
            allWindows[windowID][key] = [];
        }
        allWindows[windowID][key].push(tab);
    }
    for (const [windowID, groups] of Object.entries(allWindows)){
        for (const [host, tabs] of Object.entries(groups)){
            const tabIds = tabs.map(tab =>tab.id); 

            //make groupId, containing the tabs
            const groupId = await chrome.tabs.group({
                tabIds,
                createProperties: {
                    windowId: Number(windowID)
                }
            });

            //create group with letter
            await chrome.tabGroups.update(groupId, {
                title: host
            });
        }
    }
        
}

const button = document.querySelector("#group-by-site");
button.addEventListener("click", groupBySite);