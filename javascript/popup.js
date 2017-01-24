function TabTimerPopup() {}

(function() {
  function getCurrentTabs(callback) {
    let queryInfo = {
      currentWindow: true
    };
    chrome.tabs.query(queryInfo, function(tabs) {
      callback(tabs);
    });
  }

  function insertRow(tabIndex, tabLogo, tabTotalTime = 0) {
    let table = document.getElementById('tabTable');
    let row = table.insertRow(tabIndex);
    let indexText = document.createTextNode(`TAB${tabIndex+1}`);
    let timeText = document.createTextNode(`${tabTotalTime}`);
    let img = document.createElement('img');

    img.src = tabLogo;
    row.insertCell(0).appendChild(indexText);
    let cell = row.insertCell(1);
    cell.id = "imgCell";
    cell.appendChild(img);
    row.insertCell(2).appendChild(timeText);
  } 

  this.createRows = function() {
    getCurrentTabs(function(tabs) {
      let bgPage = chrome.extension.getBackgroundPage();
      let tabTimes = bgPage.TabTimerBackground.getTabTimes();
      for(let i = 0; i < tabs.length; i++) {
        let tab = tabs[i];
        insertRow(tab.index, tab.favIconUrl, tabTimes[tab.id]);
      }
    });
  };
}).apply(TabTimerPopup);

document.addEventListener('DOMContentLoaded', function() {
  let bgPage = chrome.extension.getBackgroundPage();
  bgPage.TabTimerBackground.updateTotalTime();
  TabTimerPopup.createRows();
});
