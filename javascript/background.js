function TabTimerBackground() {}

(function () {
  let tabTimes = {};
  let prevActiveTimeStamp = null;
  let prevActiveId = null;

  function getActiveTab(callback) {
    let queryInfo = {
      active: true,
      currentWindow: true
    };
    
    chrome.tabs.query(queryInfo, function(tabs) {
      callback(tabs[0]);
    });
  }

  this.updateTotalTime = function(tabID = prevActiveId) {
    let currTime = Math.floor(Date.now() / 1000);
    let timeDiff = Math.abs(currTime - prevActiveTimeStamp);
    if (prevActiveId != null){
      if(prevActiveId in tabTimes) {
        tabTimes[prevActiveId] = tabTimes[prevActiveId] + timeDiff;
      } else {
        tabTimes[prevActiveId] = timeDiff;
      }
    }
    prevActiveId = tabID;
    prevActiveTimeStamp = currTime;
  }

  this.initialize = function() {
    getActiveTab(function(tab) {
      prevActiveId = tab.id;
      prevActiveTimeStamp = Math.floor(Date.now() / 1000);
    });
  }

  this.getTabTimes = function () {
    return tabTimes;
  }

  this.removeTab = function (tabID) {
    delete tabTimes[`${tabID}`];
    if (tabID == prevActiveId){
      prevActiveId = null;
      prevActiveTimeStamp = null;
    }
  }

}).apply(TabTimerBackground);

chrome.tabs.onActiveChanged.addListener(function(tabID, info, tab) {
  TabTimerBackground.updateTotalTime(tabID);
});

chrome.tabs.onRemoved.addListener(function(tabID, info) {
  TabTimerBackground.removeTab(tabID);
});

TabTimerBackground.initialize();
