

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
            console.log('status is ' + status);
            console.log('login status is ' + status.Sina.login);
        }
        else if(mx && mx.Sina) {
            var s = mx.Sina;
            s.getCode();
            console.log('sina is not login');
            var stoken = setInterval(function () {
                flag += 1;
                if (flag >= 2000) {
                    clearInterval(stoken);
                    console.log('get sina code fail');
                    return false;
                }
                if (s.code !== null && s.code !== undefined) {
                    console.log(s.code);
                }
                if (s.code && s.code.length > 4) {
                    console.log('start to get token!');
                    s.getToken();
                    clearInterval(stoken);
                    console.log('get sina code success!');
                }

            }, 100);

            var sweibo = setInterval(function () {
                wflag += 1;
                if (wflag >= 4000) {
                    clearInterval(sweibo);
                    console.log('get sina token fail');
                    return false;
                }
                if (s.token && s.token.length > 4) {
                    s.getNews();
                    clearInterval(sweibo);
                    status.Sina.login = true;
                    console.log('get sina token success!');
                }
            }, 100);
        }

        
        

    }

    function loginTX() {

    }

    function loginRR() {

    }


}());

