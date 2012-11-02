

(function () {

    'use strict';

    var mx = null,
        status = null;

    if (MixOne && MixOne.Auth) {
        mx = MixOne.Auth;
        console.log('mx is MixOne.Auth now!');
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

        if (status && status.Sina && status.Sina.login) {
            e.preventDefault();
        }
        else if(mx && mx.Sina) {
            var s = mx.Sina;
            s.getCode();
            var stoken = setInterval(function () {
                flag += 1;
                if (flag >= 2000) {
                    clearInterval(stoken);
                    //Here can insert a popMessage.

                    return false;
                }
                if (s.code !== null && s.code !== undefined) {
                }
                if (s.code && s.code.length > 4) {
                    s.getToken();
                    clearInterval(stoken);
                }

            }, 50);

            var sweibo = setInterval(function () {
                wflag += 1;
                if (wflag >= 4000) {
                    clearInterval(sweibo);
                    return false;
                }
                if (s.token && s.token.length > 4) {
                    s.getNews();
                    status.Sina.login = true;
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

            var t = mx.TX;
            t.getCode();

            var ttoken = setInterval(function () {
                codeFlag += 1;
                if (codeFlag >= 2000) {
                    clearInterval(ttoken);
                    return false;
                }

                if (t.code !== null && t.code !== undefined) {

                }

                if (t.code && t.code.length > 4) {
                    t.getToken();
                    clearInterval(ttoken);
                }

            },50);

            var tWeibo = setInterval(function () {
                tokenFlag += 1;
                if (tokenFlag >= 4000) {
                    clearInterval(tWeibo);
                    return false;
                }

                if (t.token && t.token.length > 4) {
                    status.TX.login = true;
                    t.getNews();
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

