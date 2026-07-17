const button_1 = document.querySelector("#sort-by-most-recent");

async function sortTabGroups(groups, tabs, order){
  let index = 0;
  if (order === "most-recent") {
    const groupAccessTime = await Promise.all(groups.map(async (group) => {
      const groupTabs = await chrome.tabs.query({ groupId: group.id });
      const lastAccessed = Math.max(...groupTabs.map(t => t.lastAccessed || 0));
      return { group, groupTabs, lastAccessed };  // plain object, not modifying the group
    }));

    const sortedGroups = [...groupAccessTime].sort((a, b) =>
        (b.lastAccessed || 0) - (a.lastAccessed || 0)
    );
    for (const { group, groupTabs } of sortedGroups) {
      await chrome.tabGroups.move(group.id, {index: index});

      //sort tabs inside the tabGroup
      const sortedTabs = [...groupTabs].sort((a, b) =>
          (b.lastAccessed || 0) - (a.lastAccessed || 0)
      );
      //move tabs to sorted order
      for (const tab of sortedTabs) {
        await chrome.tabs.move(tab.id, {
          index: index
        });
        index++;
      }
    }
  } else if (order === "least-recent") {
    const groupAccessTime = await Promise.all(groups.map(async (group) => {
      const groupTabs = await chrome.tabs.query({ groupId: group.id });
      const lastAccessed = Math.min(...groupTabs.map(t => t.lastAccessed || 0));
      return { group, groupTabs, lastAccessed };  // plain object, not modifying the group
    }));

    const sortedGroups = [...groupAccessTime].sort((a, b) =>
        (a.lastAccessed || 0) - (b.lastAccessed || 0)
    );
    for (const { group, groupTabs } of sortedGroups) {
      await chrome.tabGroups.move(group.id, {index: index});
      //sort tabs inside the tabGroup
      const sortedTabs = [...groupTabs].sort((a, b) =>
          (a.lastAccessed || 0) - (b.lastAccessed || 0)
      );
      //move tabs to sorted order
      for (const tab of sortedTabs) {
        await chrome.tabs.move(tab.id, {
          index: index
        });
        index++; 
      }
    }
  }
  return index;
}

button_1.addEventListener("click", async () => {
  let tabs;
  let groups;
  if(document.querySelector("#apply-all-windows").checked){
      tabs = await chrome.tabs.query({});
      groups = await chrome.tabGroups.query({});
  } else {
      tabs = await chrome.tabs.query({currentWindow: true});
      //get windowId of current window
      const windowId = tabs.length > 0 ? tabs[0].windowId : undefined;
      groups = await chrome.tabGroups.query({windowId});
  }

  let index = await sortTabGroups(groups, tabs, "most-recent");

  //sorts the tabs
  const sortedTabs = [...tabs].sort((a, b) =>
      (b.lastAccessed || 0) - (a.lastAccessed || 0)
  );

  for (let i = 0; i < sortedTabs.length; i++) {
    if (sortedTabs[i].groupId !== -1) {
      continue; // Skip tabs that are already in a group
    }
    await chrome.tabs.move(sortedTabs[i].id, {
      index: index + i
    });
  }
});

const button_2 = document.querySelector("#sort-by-least-recent");

button_2.addEventListener("click", async () => {
  let tabs;
  let groups;
  if(document.querySelector("#apply-all-windows").checked){ //
      tabs = await chrome.tabs.query({});
      groups = await chrome.tabGroups.query({});

  } else {
      tabs = await chrome.tabs.query({currentWindow: true});
      //get windowId of current window
      const windowId = tabs.length > 0 ? tabs[0].windowId : undefined;
      groups = await chrome.tabGroups.query({windowId});
  }

  let index = await sortTabGroups(groups, tabs, "least-recent");

   //sorts the tabs
  const sortedTabs = [...tabs].sort((a, b) =>
      (a.lastAccessed || 0) - (b.lastAccessed || 0)
  );

  for (let i = 0; i < sortedTabs.length; i++) {
    if (sortedTabs[i].groupId !== -1) {
      continue; // Skip tabs that are already in a group
    }
    await chrome.tabs.move(sortedTabs[i].id, {
      index: index + i
    });
  }

});
