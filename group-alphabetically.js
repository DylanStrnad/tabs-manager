async function groupAlphabetically() {
    if(document.querySelector("#apply-all-windows").checked){
        await groupAlphabeticallyAllWindows();
    } else {
        const tabs = await chrome.tabs.query({currentWindow: true}); //only apply to current window

        //to store the groups of tabs
        const groups = {};

        //sort tabs by first letter and store in groups. a group defined by a letter (a-z)
        for (const tab of tabs) {
            const title = tab.title;
            //default key
            let key = '#'; 
            const match = title.match(/[a-z]/i);
            if (match){
                //update key if letter
                key = match[0].toUpperCase(); 
            }

            //initialize an array for the key if not already
            if (!groups[key]) {
                groups[key] = [];
            }

            groups[key].push(tab);
        }

        for (const [letter, tabs] of Object.entries(groups)){
            const tabIds = tabs.map(tab =>tab.id); 

            //make groupId, containing the tabs
            const groupId = await chrome.tabs.group({
                tabIds
            });

            //create group with letter
            await chrome.tabGroups.update(groupId, {
                title: letter
            });
        }
    }
   
}

async function groupAlphabeticallyAllWindows(){
    const tabs = await chrome.tabs.query({}); //only apply to current window

    //to store the groups of tabs
    const allWindows = {};

    //sort tabs by first letter and store in groups. a group defined by a letter (a-z)
    for (const tab of tabs) {
        const windowID = tab.windowId;
        if(!allWindows[windowID]){
            allWindows[windowID] = {};
        }


        const title = tab.title;
        //default key
        let key = '#'; 
        const match = title.match(/[a-z]/i);
        if (match){
            //update key if letter
            key = match[0].toUpperCase(); 
        }

        if(!allWindows[windowID][key]){
            allWindows[windowID][key] = [];
        }
        allWindows[windowID][key].push(tab);
    }
    for (const [windowID, groups] of Object.entries(allWindows)){
        for (const [letter, tabs] of Object.entries(groups)){
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
                title: letter
            });
        }
    }
        
}

const button = document.querySelector("#group-alphabetically");
button.addEventListener("click", groupAlphabetically);
