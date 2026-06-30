

const button_1 = document.querySelector("#sort-by-most-recent");
button_1.addEventListener("click", async () => {
  let tabs;
  if(document.querySelector("#btncheck1").checked){
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
  if(document.querySelector("#btncheck1").checked){
      tabs = await chrome.tabs.query({});
  } else {
      tabs = await chrome.tabs.query({currentWindow: true});
  }
  const sortedTabs = [...tabs].sort((a, b) =>
      (a.lastAccessed || 0) - (b.lastAccessed || 0)
  );
  for (let index = 0; index < sortedTabs.length; index++) {
    await chrome.tabs.move(sortedTabs[index].id, {
      index
    });
  }
});