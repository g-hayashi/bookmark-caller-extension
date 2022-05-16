var global_config

function doAction(combo) {
  // comboには入力したショートカットキーが入る
  var title = ""
  for (i = 0; i < global_config.length; i++) {
    if (global_config[i].shortcut == combo) {
      title = global_config[i].name
      break
    }
  }
  console.log("do action " + title)
  chrome.runtime.sendMessage({ message: "FireAction", title: title },
    function (result) {
      if (result.indexOf('script ') === 0) {
        code = result.replace('script ', '')
        eval(code)
      }
    })

}

function applyConfig() {
  chrome.storage.sync.get("bookmarklet_caller_config", function (config) {
    Mousetrap.reset();
    var parseJSON = JSON.parse(config.bookmarklet_caller_config)
    global_config = parseJSON
    for (var i = 0; i < parseJSON.length; i++) {
      Mousetrap.bind(parseJSON[i].shortcut, function (e, combo) {
        if (e.preventDefault) {
          e.preventDefault();
        }
        doAction(combo);
      }, 'keydown');
    }
  });
}

$(function () { applyConfig() });

// from popup.html
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // 画面で選択されている部分を文字列で取得する
  if (request.message == "UpdateAndApply") {
    result = applyConfig()
    sendResponse("updated");
  }
  return true;
});