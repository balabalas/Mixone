(function () {
    "use strict";

    var canNavigate = false;

    var oauth = MixOne.Auth || JSON.parse(localStorage.getItem('auth')),
    _status = MixOne.Status || JSON.parse(localStorage.getItem('status')),
    loginPromise = MixOne.loginPromise;
    /**
     * Bug issue init_1!
     * code here will be execute twice.
     * need to fix!
     **/
    var page = WinJS.UI.Pages.define("/www/init/index.html", {
        // 每当用户导航至此页面时都要调用此功能。它
        // 使用应用程序的数据填充页面元素。
        ready: function (element, options) {
            // TODO: 在此处初始化页面。
            addButtonClick();
            _checkLogin();
            var d1 = new Date();
            console.log("Hello everyone1-->" +　d1.getTime());
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
        WinJS.Navigation.navigate('/www/news/news.html');
    }

    function addAccount() {
        //if (MixOne.etc.checkNetwork()) {
            WinJS.Navigation.navigate('/www/login/login.html');
        //}
    }

    function modifyPrefrence(e) {
        WinJS.Navigation.navigate('/www/setting/setting.html');
    }

    function aboutMixone(e) {
        WinJS.Navigation.navigate('/www/about/index.html');
    }

    function checkNetwork() {
        var s = MixOne.etc.checkNetwork();

        if (s) {
            var msg = new Windows.UI.Popups.MessageDialog("请确定您的网络保持连接", "网络出错了");
            msg.commands.append(new Windows.UI.Popups.UICommand("确定", function (command) {

            }));
            //msg.commands.append(new Windows.UI.Popups.UICommand("", function (command) {

            //})
            msg.defaultCommandIndex = 1;
            msg.showAsync();
            return false;
        }
        else{
            return true;
        }
    }

    function _checkLogin() {

        var _container = document.getElementById('statusBox'),
            loginOrNot = document.createElement('p'),
            _loginInfo = MixOne.loginPromise;

        console.log('init.js line 65 --> start to checkLogin!');
        var s = MixOne.Status;
        var o = {},
            c = document.createElement('div'),
            loginFlag = false,
            auth = MixOne.Auth || JSON.parse(localStorage.getItem('auth'));
        console.log("init.js line 71 : "+JSON.stringify(MixOne.Status));
        console.log("init.js line 72 : "+JSON.stringify(MixOne.Auth));
        if (s) {
            if (s['Sina'] && s['Sina']['login']) {
                loginFlag = true;
                o.sina = true;
                if(_loginInfo['Sina']){
                    var sinaWeibo = document.createElement('div'),
                    sinaAvart = document.createElement('img'),
                    sinaName = document.createElement('span');

                    /**
                    *  !!!TODO: add a class to div block.
                    *  make sure align center;
                    */
                    sinaAvart.src = '/images/avarts/sina.png';
                    sinaName.textContent = _loginInfo['Sina'].name || 'sina';
                    sinaWeibo.appendChild(sinaAvart);
                    sinaWeibo.appendChild(sinaName);
                    c.appendChild(sinaWeibo);
                }
            }
            else {
                
            }
            if (s['TX'] && s['TX']['login']) {
                loginFlag = true;
                o.tx = true;
                if(_loginInfo['TX']){
                    var txWeibo = document.createElement('div'),
                    txAvart = document.createElement('img'),
                    txName = document.createElement('span');

                    txAvart.src = '/images/avarts/tx.png';
                    txName.textContent = _loginInfo['TX'].name;
                    txWeibo.appendChild(txAvart);
                    txWeibo.appendChild(txName);
                    c.appendChild(txWeibo);
                }
            }
            if (s['RR'] && s['RR']['login']) {
                loginFlag = true;
                o.rr = true;

                if(_loginInfo['RR']){
                    var txWeibo = document.createElement('div'),
                    txAvart = document.createElement('img'),
                    txName = document.createElement('span');

                    txAvart.src = '/images/avarts/tx.png';
                    txName.textContent = o.name;
                    txWeibo.appendChild(txAvart);
                    txWeibo.appendChild(txName);
                    c.appendChild(txWeibo);
                }
            }


            if (loginFlag) {
                //try to get news!
                getMessages(o);
                //display the login info
                _container.appendChild(loginOrNot);
                _container.appendChild(c);
            }
            else {
                console.log('not login:init.js:_checkLogin');
                loginOrNot.textContent = '您还没有登陆任何账号';
                _container.appendChild(loginOrNot);
            }
        }
        else {
            console.log('init.js --> s:'+JSON.stringify(s));
            return false;
        }

        console.log('init.js --> return flag ' + loginFlag);
        canNavigate = loginFlag;
    }

    function _notLogin() {
        var msg = new Windows.UI.Popups.MessageDialog('请添加账号', '未登陆');
        msg.commands.append(new Windows.UI.Popups.UICommand('添加账号', function (command) {
            WinJS.Navigation.navigate('/www/login/login.html');
        }));
        msg.commands.append(new Windows.UI.Popups.UICommand('确定', function (command) {
            
        }));
        msg.defaultCommandIndex = 1;
        msg.cancelCommandIndex = 1;
        msg.showAsync();
    }

    function getMessages(o) {
        var server = null;
        if (MixOne && MixOne.Serve) {
            server = MixOne.Serve;
        }
        else {
            return false;
        }

        if (o.sina) server.Sina.getNews();
        if (o.tx) server.TX.getNews();
        if (o.rr) server.RR.getNews();
    }

    function checkLogin() {
        var _container = document.getElementById('statusBox'),
            loginOrNot = document.createElement('p'),
            loginFlag = false;

        if (loginPromise && loginPromise.length > 0) {
            loginOrNot.textContent = '您已经登陆了：';
            //create a box to store element;
            var c = document.createElement('div'),
                _sina = loginPromise.Sina || {},
                _tx   = loginPromise.TX || {},
                _rr   = login;
                
            if (o.type === 'sina') {
                var sinaWeibo = document.createElement('div'),
                sinaAvart = document.createElement('img'),
                sinaName = document.createElement('span');

                sinaAvart.src = '/images/avarts/sina.png';
                sinaName.textContent = o.name || 'sina';
                sinaWeibo.appendChild(sinaAvart);
                sinaWeibo.appendChild(sinaName);
                c.appendChild(sinaWeibo);
            }
            else if (o.type === 'tx') {
                var txWeibo = document.createElement('div'),
                txAvart = document.createElement('img'),
                txName = document.createElement('span');

                txAvart.src = '/images/avarts/tx.png';
                txName.textContent = o.name;
                txWeibo.appendChild(txAvart);
                txWeibo.appendChild(txName);
                c.appendChild(txWeibo);
            }
            else if (o.type === 'rr') {
                var rrNews = document.createElement('div'),
                rrAvart = document.createElement('img'),
                rrName = document.createElement('span');

                rrAvart.src = '/images/avarts/renren.png';
                rrName.textContent = _status.RR.username;
                rrNews.appendChild(rrAvart).appendChild(rrName);
                c.appendChild(rrNews);
            }
            else if (o.type === 'kx') {
                var kxNews = document.createElement('div'),
                kxAvart = document.createElement('img'),
                kxName = document.createElement('span');
                kxAvart.src = '/images/avarts/kx.png';
                kxName.textContent = o.name;
                kxNews.appendChild(kxAvart).appendChild(kxName);
                c.appendChild(kxNews);
            }
        }
        else {
            console.log('not login:init.js:checkLogin');
            loginOrNot.textContent = '您还没有登陆任何账号';
            _container.appendChild(loginOrNot);
        }

        _container.appendChild(loginOrNot);
        _container.appendChild(c);

    }


})();