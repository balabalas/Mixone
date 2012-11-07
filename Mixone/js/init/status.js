
(function () {

    'use strict';

    var oauth = MixOne.Auth || JSON.parse(localStorage.getItem('auth')),
        _status = MixOne.Status || JSON.parse(localStorage.getItem('status'));

    var loginPromise = MixOne.loginPromise;

    var page = WinJS.UI.Pages.define("/www/init/index.html", {
        ready: function (element, options) {
            _checkLogin(element);
            WinJS.UI.processAll(element);
        }
    });
    function _checkLogin(e) {
        var _container = document.getElementById('statusBox'),
            loginOrNot = document.createElement('p'),
            loginFlag = false;

        if (loginPromise && loginPromise.length > 0) {
            loginOrNot.textContent = '您已经登陆了：';
            //create a box to store element;
            var c = document.createElement('div');
            console.log('loginPromise.length is not zero');
            for (var i = 0, len = loginPromise.length; i < len; i++) {
                var o = loginPromise[i];
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
                    txWeibo.appendChild(txAvart).appendChild(txName);
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

            _container.appendChild(loginOrNot);
            _container.appendChild(c);

        }
        else {
            console.log('not login:status.js:_checkLogin');
            loginOrNot.textContent = '您还没有登陆任何账号';
            _container.appendChild(loginOrNot);
        }

    }


})();