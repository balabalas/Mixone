
(function () {

    'use strict';

    var loginStatus = localStorage.getItem('loginFlag'),
    _status = null;

    if (loginStatus && loginStatus.length > 4) {
        _status = JSON.parse(loginStatus);
    }

    var page = WinJS.UI.Pages.define("/www/init/status.html", {
        ready: function (element, options) {
            _checkLogin(element);
            var logBox = document.getElementById('logBox');

        }
    });

    function _checkLogin(e) {
        var _container = document.getElementById('statusBox'),
            loginOrNot = document.getElementById('loginOrNot'),
            loginFlag = false;
        loginFlag = _status.TX.login || _status.Sina.login || _status.RR.login;

        if (loginFlag) {
            loginOrNot.textContent = '您已经登陆了：'
            //create a box to store element;
            var c = document.createElement('div');
            if (_status.Sina && _status.Sina.login) {
                var sinaWeibo = document.createElement('div'),
                    sinaAvart = document.createElement('img'),
                    sinaName = document.createElement('span');

                sinaAvart.src = '/images/avarts/sina.png';
                sinaName.textContent = _status.Sina.username || ' ';
                sinaWeibo.appendChild(sinaAvart).appendChild(sinaName);
                c.appendChild(sinaWeibo);
            }

            if (_status.TX && _status.TX.login) {
                var txWeibo = document.createElement('div'),
                    txAvart = document.createElement('img'),
                    txName = document.createElement('span');
                
                txAvart.src = '/images/avarts/tx.png';
                txName.textContent = _status.TX.username;
                txWeibo.appendChild(txAvart).appendChild(txName);
                c.appendChild(txWeibo);
            }
            if (_status.RR && _status.RR.login) {
                var rrNews = document.createElement('div'),
                    rrAvart = document.createElement('img'),
                    rrName = document.createElement('span');

                rrAvart.src = '/images/avarts/renren.png';
                rrName.textContent = _status.RR.username;
                rrNews.appendChild(rrAvart).appendChild(rrName);
                c.appendChild(rrNews);
            }
            if (_status.KX && _status.KX.login) {
                var kxNews = document.createElement('div'),
                    kxAvart = document.createElement('img'),
                    kxName = document.createElement('span');
                kxAvart.src = '/images/avarts/kx.png';
                kxName.textContent = _status.KX.username;
                kxNews.appendChild(kxAvart).appendChild(kxName);
                c.appendChild(kxNews);
            }
            _container.appendChild(c);

        }
        else {
            loginOrNot.textContent = '您还没有登陆任何账号';
        }

    }


})();