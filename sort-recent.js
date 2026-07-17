const button_1 = document.querySelector("#sort-by-most-recent");

button_1.addEventListener("click", async () => {
  let tabs;
  if(document.querySelector("#apply-all-windows").checked){
      tabs = await chrome.tabs.query({});
  } else {
      tabs = await chrome.tabs.query({currentWindow: true});
  }
  const sortedTabs = [...tabs].sort((a, b) =>
      (b.lastAccessed || 0) - (a.lastAccessed || 0)
  );
  for (let index = 0; index < sortedTabs.length; index++) {
    await chrome.tabs.move(sortedTabs[index].id, {
      index
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
   //if tab groups exist, sort the tab groups, then sort tabs outside the tab groups
  // const sortedTabs = [...tabs].sort((a, b) =>
  //     (a.lastAccessed || 0) - (b.lastAccessed || 0)
  // );
  // for (let index = 0; index < sortedTabs.length; index++) {
  //   await chrome.tabs.move(sortedTabs[index].id, {
  //     index
  //   });
  // }
  const groupAccessTime = await Promise.all(groups.map(async (group) => {
    const groupTabs = await chrome.tabs.query({ groupId: group.id });
    const lastAccessed = Math.min(...groupTabs.map(t => t.lastAccessed || 0));
    return { group, groupTabs, lastAccessed };  // plain object, not modifying the group
  }));

  const sortedGroups = [...groupAccessTime].sort((a, b) =>
      (a.lastAccessed || 0) - (b.lastAccessed || 0)
  );

  let groupIndex = 0;
  for (const { group, groupTabs } of sortedGroups) {
    await chrome.tabGroups.move(group.id, {index: groupIndex});
    groupIndex += groupTabs.length; // advance past the moved group
  }
  //sort the tabs inside the tab groups in lest recent order
});
