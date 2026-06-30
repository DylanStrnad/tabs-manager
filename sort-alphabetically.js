const button = document.querySelector("#sort-alphabetically");

button.addEventListener("click", async () => {
  let tabs = await chrome.tabs.query({currentWindow: true});
  const windowId = tabs.length > 0 ? tabs[0].windowId : undefined;
  let groups = await chrome.tabGroups.query({windowId});
  if(document.querySelector("#btncheck1").checked){
    tabs = await chrome.tabs.query({});
    groups = await chrome.tabGroups.query({});
  }

  //there are tab groups
  if(groups.length > 0){
    const sortedGroups = [...groups].sort((a, b) =>
    (a.title || "").localeCompare(b.title || "", undefined, {
      sensitivity: "base"
    })
    );

    //console.log(sortedGroups.map(g => g.title));
    let groupIndex = 0;
    for (const group of sortedGroups) {
      // move the whole group to the desired index
      await chrome.tabGroups.move(group.id, { index: groupIndex });

      // count how many tabs belong to this group (needed for the next index)
      const groupTabs = await chrome.tabs.query({ groupId: group.id });
      groupIndex += groupTabs.length; // advance past the moved group
    }

    //sort tabs not in groups
    const ungroupedTabs = tabs.filter(
      tab => tab.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE
    );
    const sortedTabs = [...ungroupedTabs].sort((a, b) =>
      (a.title || "").localeCompare(b.title || "", undefined, {
        sensitivity: "base"
      })
    );
    for (let index = groupIndex; index < sortedTabs.length + groupIndex; index++) {
      await chrome.tabs.move(sortedTabs[index - groupIndex].id, {
        index
      });
    }
  } else {
    //sort the tabs normally
    const sortedTabs = [...tabs].sort((a, b) =>
        (a.title || "").localeCompare(b.title || "", undefined, {
          sensitivity: "base"
        })
      );

    for (let index = 0; index < sortedTabs.length; index++) {
      await chrome.tabs.move(sortedTabs[index].id, {
        index
      });
    }
  }

});