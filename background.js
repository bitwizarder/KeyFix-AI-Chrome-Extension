// Keyboard shortcut handler. The page content script performs the edit locally.
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "convert-selection") return;
  try {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (tab?.id == null) return;
    await chrome.tabs.sendMessage(tab.id, { type: "KEYFIX_CONVERT_SELECTION" });
  } catch (_) {
    // Restricted Chrome pages and pages without the content script are intentionally ignored.
  }
});
