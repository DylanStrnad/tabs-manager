chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'restore-tabs') {
        (async () => {
            for (const sessionId of message.sessionIds) {
                    await chrome.sessions.restore(sessionId);
            }
            sendResponse({ restored: message.sessionIds.length });
        })();
    }
    if (message.action === 'restore-windows') {
        (async () => {
            for (const sessionId of message.sessionIds) {
                    await chrome.sessions.restore(sessionId);
            }
            sendResponse({ restored: message.sessionIds.length });
        })();
    }
});