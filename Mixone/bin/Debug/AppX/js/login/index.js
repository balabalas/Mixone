

(function () {

    'use strict';

    var mx = MixOne.Auth || {},
        status = MixOne.Status || {},
        ms = MixOne.Serve || {};

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

        if (!MixOne.etc.checkNetwork()) {
            return;
        }

        if (status && status.Sina && status.Sina.login) {
            e.preventDefault();
            console.log('sina has login!: login.index.js');
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
                    sms.getUser();
                    sms.getNews();
                    clearInterval(sweibo);
                }
            }, 50);
        }
    }

    function loginTX(e) {
        var codeFlag = 0,
            tokenFlag = 0;

        if (status && status.TX && status.TX.login) {
            console.log('tx has login: login.index.js');
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

                    mst.getUser();
                    mst.getNews();

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
            console.log('renren has login: login.index.js');
            e.preventDefault();
        }
        else if (mx && mx.RR) {
            mx.RR.getToken();
        }


    }


}());

