


(function () {

    'use strict';

    var news = MixOne.News,
        sinaLength = news.Sina.length,
        txLength = news.TX.length,
        rrLength = news.RR.length,
        msg = [];

    if (sinaLength > 0) msg = msg.concat(news.Sina);
    if (txLength > 0) msg = msg.concat(news.TX);
    if (rrLength > 0) msg = msg.concat(news.RR);
    console.log('msg length is ' + msg.length);

    if (msg.length === 0) {
        //here msg Array can concat old messages;
    }

    if (msg.length > 0) {
        msg.sort(function (a, b) {
            if (typeof a !== 'object') {
                return 0;
            }
            if (typeof b !== 'object') {
                return 0;
            }
            return b.time - a.time;
        });
    }

    var dataList = new WinJS.Binding.List(msg);

    var dataSource = {
        itemList: dataList
    };

    WinJS.Namespace.define('AllMessages', dataSource);

})();
