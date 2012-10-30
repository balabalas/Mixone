
(function () {

    var page = WinJS.UI.Pages.define("/www/init/index.html", {
        ready: function (element, options) {
            addButtonClick();
        }
    });

    function addButtonClick() {
        var cmb = document.getElementById('checkMessage'),
            acb = document.getElementById('addAccount'),
            pfb = document.getElementById('prefrence'),
            abm = document.getElementById('aboutMixone');

        cmb.addEventListener('click', messageClick, false);
        acb.addEventListener('click', addAccount, false);
        pfb.addEventListener('click', modifyPrefrence, false);
        abm.addEventListener('click', aboutMixone, false);
    }

    function messageClick(e) {
        e.preventDefault();

        var news = MixOne.News,
            sinaLength = news.Sina.length,
            txLength = news.TX.length,
            rrLength = news.RR.length,
            msg = [];

        if (sinaLength > 0) msg = msg.concat(news.Sina);
        if (txLength > 0) msg = msg.concat(news.TX);
        if (rrLength > 0) msg = msg.concat(news.RR);
        console.log('sina length : ' + news.Sina.length);
        console.log('msg length:' + msg.length);
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

        WinJS.Namespace.define('AllMessages', dataList);

        WinJS.Navigation.navigate('/www/news/news.html');
    }

    function addAccount(e) {
        e.preventDefault();
        if (checkNetwork()) {
            WinJS.Navigation.navigate('/www/login/login.html');
        }
    }

    function modifyPrefrence(e) {
        e.preventDefault();


    }

    function aboutMixone(e) {
        e.preventDefault();
        WinJS.Navigation.navigate('/www/about/index.html');
    }

    function checkNetwork() {
        var s = MixOne.etc.checkNetwork();

        if (s === 'no') {
            var msg = new Windows.UI.Popups.MessageDialog("请确定您的网络保持连接", "网络出错了");
            msg.commands.append(new Windows.UI.Popups.UICommand("确定", function (command) {

            }));
            //msg.commands.append(new Windows.UI.Popups.UICommand("", function (command) {

            //})
            msg.defaultCommandIndex = 1;
            msg.showAsync();
            return false;
        }
        else if (s === 'yes') {
            return true;
        }
    }

}());