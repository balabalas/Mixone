
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

    function messageClick() {      
        if (_checkLogin()) WinJS.Navigation.navigate('/www/news/news.html');
        else {
            _notLogin();
        }
    }

    function addAccount() {
        if (checkNetwork()) {
            WinJS.Navigation.navigate('/www/login/login.html');
        }
    }

    function modifyPrefrence(e) {
        e.preventDefault();
        WinJS.Navigation.navigate('/www/detail/detail.html');
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

    function _checkLogin() {

        console.log('start to checkLogin!');
        var s = MixOne.Status || JSON.parse(localStorage.getItem('status'));
        var o = {},
            loginFlag = false,
            auth = MixOne.Auth || JSON.parse(localStorage.getItem('auth'));
        if (s && auth) {
            if (s['Sina'] && s['Sina']['login'] && auth.Sina.login) {
                loginFlag = true;
                o.sina = true;
            }
            if (s['TX'] && s['TX']['login'] && auth.TX.login) {
                loginFlag = true;
                o.tx = true;
            }
            if (s['RR'] && s['RR']['login'] && auth.RR.login) {
                loginFlag = true;
                o.rr = true;
            }

            if (loginFlag) getMessages(o);
        }
        else {
            return false;
        }

        console.log('return flag ' + loginFlag);
        return loginFlag;
    }

    function _notLogin() {
        var msg = new Windows.UI.Popups.MessageDialog('请添加账号', '未登陆');
        msg.commands.append(new Windows.UI.Popups.UICommand('添加账号', function (command) {
            WinJS.Navigation.navigate('/www/login/login.html');
        }));
        msg.commands.append(new Windows.UI.Popups.UICommand('确定', function (command) {
            
        }));
        msg.defaultCommandIndex = 1;
        msg.showAsync();

    }

    function getMessages(o) {
        var server = null;
        if (MixOne && MixOne.Serve) {
            server = MixOne.Serve;
        }
        else {
            return;
        }

        if (o.sina) server.Sina.getNews();
        if (o.tx) server.TX.getNews();
        if (o.rr) server.RR.getNews();
    }
}());