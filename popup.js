
/*---
  Find Bookmarks and add all items to #bookmarks
-----*/
function dumpNode(bookmarkNodes) {
  for (var i = 0; i < bookmarkNodes.length; i++) {
    node = bookmarkNodes[i]
    if (node.children && node.children.length > 0) {
      dumpNode(node.children)
    } else {
      $("#bookmarks").append($("<option>").val(
        node.title
      ).text(node.title));
    }
  }
}
/* ---
  Button add new settings
  ----*/
function add_config() {
  var key = $("#keys").val()
  var bookmark = $("#bookmarks").val()
  newconf = {
    "shortcut": key,
    "name": bookmark
  }
  var setting = $("#settings").val()
  if (setting == "") {
    // 新JSONで初期化
    setting = JSON.stringify([newconf], null, 2)
  } else {
    // 既存JSONに追加
    parsedJSON = JSON.parse(setting)
    parsedJSON.push(newconf)
    setting = JSON.stringify(parsedJSON, null, 2)
  }
  $("#settings").val(setting)
  // フォーカスを末尾に移す
  var len = setting.length;
  $("#settings").focus()
  $("#settings").setSelectionRange(len, len)

  save_and_apply_config()
}
function load_and_apply_config() {
  chrome.storage.sync.get(
    "bookmarklet_caller_config", function (items) {
      $("#settings").val(items.bookmarklet_caller_config)
      applyconfig(items.bookmarklet_caller_config)
    });
}
function save_and_apply_config() {
  var setting = $("#settings").val()
  chrome.storage.sync.set(
    { "bookmarklet_caller_config": setting },
    function () {
    });
  applyconfig(setting)
}
function applyconfig(setting) {
  try {
    const parsedJSON = JSON.parse(setting);
  } catch (e) {
    // Error handling
    $("#result").val("ERR:" + e);
    return
  }
  // apply shortcut key
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "UpdateAndApply" }, function (result) {
      $('#result').val(result);
    });
  });
}
document.addEventListener('DOMContentLoaded', function () {
  $(function () {
    $("input[type=submit], a, button")
      .button()
      .click(function (event) {
        event.preventDefault();
      });
  });
  $('#bookmarks').empty();
  chrome.bookmarks.getTree(
    function (nodes) {
      dumpNode(nodes)
    });
  load_and_apply_config()
  $("#settings").bind('input propertychange', function () {
    save_and_apply_config()
  });
  $('#add').on('click', function () {
    add_config()
  });
});
