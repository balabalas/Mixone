
(function () {

    'use strict';

    var page = WinJS.UI.Pages.define("/www/news/news.html", {
        ready: function (element, options) {
            var listView = element.querySelector('#basicMessageListView').winControl;
            listView.forceLayout();
        }
    });

})();

