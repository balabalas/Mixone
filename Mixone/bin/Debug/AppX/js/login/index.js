

(function () {

    'use strict';

    var mx = null,
        status = null,
        ms = null;

    if (MixOne && MixOne.Auth) {
        mx = MixOne.Auth;
    }
    if (MixOne && MixOne.Serve) {
        ms = MixOne.Serve;
    }

    if (MixOne && MixOne.Status) {
        status = MixOne.Status;
    }

    var page = WinJS.UI.Pages.define("/www/login/login.html", {
        ready: function (element, options) {
            var sinaButton = document.getElementById('addSina'),
            txButton = document.getElementById('addTX'),
            rrButton = document.getElementById('addRR');

            sinaButton.addEventListener('click', loginSina, false);
            txButton.addEventListener('click', loginTX, false);
            rrButton.addEventListener('click', loginRR, false);
        }
    });

    function loginSina(e) {

        var flag = 0,
            wflag = 0;

        if (status && status.Sina && status.Sina.login && mx.Sina.login) {
            e.preventDefault();
            return;
        }
        else if(mx && mx.Sina) {
            var s = mx.Sina, sms = ms.Sina;
            s.code = null;
            sms.getCode();
            var stoken = setInterval(function () {
                flag += 1;
                if (flag >= 2000) {
                    clearInterval(stoken);
                    return;
                }
                if (s.code !== null && s.code !== undefined) {
                    console.log('login:s.code-'+s.code);
                }
                if (s.code && s.code.length > 4) {
                    s.token = null;
                    sms.getToken();
                    clearInterval(stoken);
                }

            }, 50);

            var sweibo = setInterval(function () {
                wflag += 1;
                if (wflag >= 4000) {
                    clearInterval(sweibo);
                    return;
                }
                if (s.token && s.token.length > 4) {
                    sms.getNews();
                    status.Sina.login = true;
                    localStorage.setItem('status', JSON.stringify(status));
                    localStorage.setItem('auth', JSON.stringify(mx));
                    MixOne.etc.checkLogin();
                    clearInterval(sweibo);
                }
            }, 50);
        }
    }

    function loginTX(e) {
        var codeFlag = 0,
            tokenFlag = 0;

        if (status && status.TX && status.TX.login) {
            e.preventDefault();
        }
        else if (mx && mx.TX) {

            var t = mx.TX,
                mst = MixOne.Serve.TX;
            mst.getCode();

            var ttoken = setInterval(function () {
                codeFlag += 1;
                if (codeFlag >= 3000) {
                    clearInterval(ttoken);
                    return false;
                }

                if (t.code && t.code.length > 4) {
                    mst.getToken();
                    clearInterval(ttoken);
                }

            },50);

            var tWeibo = setInterval(function () {
                tokenFlag += 1;
                if (tokenFlag >= 5000) {
                    clearInterval(tWeibo);
                    return false;
                }

                if (t.token && t.token.length > 4) {
                    status.TX.login = true;
                    mst.getNews();
                    mst.getUser();
                    localStorage.setItem('status', JSON.stringify(status));
                    MixOne.etc.checkLogin();
                    clearInterval(tWeibo);
                }

            },50);

        }
        else {
            e.preventDefault();
        }

    }

    function loginRR() {
        console.log('start to login renren');
        if (status && status.RR && status.RR.login) {
            e.preventDefault();
        }
        else if (mx && mx.RR) {
            mx.RR.getToken();
        }


    }


}());

