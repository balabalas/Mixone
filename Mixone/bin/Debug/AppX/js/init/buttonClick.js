
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
        var s = MixOne.Status,
            loginFlag = false;

        if (s) {
            if (s['Sina'] && s['Sina']['login']) loginFlag = true;
            if (s['TX'] && s['TX']['login']) loginFlag = true;
            if (s['RR'] && s['RR']['login']) loginFlag = true;
        }
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
}());