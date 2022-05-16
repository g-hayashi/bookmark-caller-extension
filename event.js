// from content.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == 'FireAction') {
    chrome.bookmarks.search({ title: request.title }, function (item) {
      if (item && item.length > 0) {
        url = item[0].url
        if (url.indexOf('javascript:') === 0) {
          code = decodeURIComponent(url.replace('javascript:', ''))
          sendResponse("script " + code)
        } else {
          chrome.tabs.update(
            sender.tab.id,
            { url: decodeURI(url) }
          )
          sendResponse("move to " + decodeURI(url))
        }
      } else {
        sendResponse("failure no matching bookmark")
      }
    })
    return true;
  }
});
