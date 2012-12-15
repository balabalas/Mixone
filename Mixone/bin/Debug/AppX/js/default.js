// 有关“空白”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application,
        networkInfo = Windows.Networking.Connectivity.NetworkInformation;
    var activation = Windows.ApplicationModel.Activation;
    //I add it here! (Allen Heavey 2012/10/27)
    var defaultUrl = '/www/init/index.html';
    var nav = WinJS.Navigation,
        loginPromise = {};

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {

            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: 此应用程序刚刚启动。在此处初始化
                //您的应用程序。
                //return WinJS.Navigation.navigate(defaultUrl);
                if (MixOne && MixOne.etc && MixOne.etc.checkNetwork) {
                    console.log("network is " + MixOne.etc.checkNetwork());
                    console.log('after checking network status!');
                }

                //return WinJS.Navigation.navigate(defaultUrl);

            } else {
                // TODO: 此应用程序已从挂起状态重新激活。
                // 在此处恢复应用程序状态。
                var _url = WinJS.Application.sessionState.lastUrl || defaultUrl;
                return nav.navigate(_url);
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                
                var connect = networkInfo.getInternetConnectionProfile();
                if (connect !== null) {
                    checkLogin();
                }
                else {
                    _initNotLogin();
                }

                MixOne.loginPromise = loginPromise;
                MixOne.etc.checkLogin = checkLogin;

                //if (nav.location) {
                //    nav.history.current.initialPlaceholder = true;
                //    return nav.navigate(nav.location, nav.state);
                //} else {
                //    return nav.navigate(Application.navigator.home);
                //}

                return nav.navigate(defaultUrl);

            }));
        }
    };

    WinJS.Navigation.addEventListener("navigated", function (evt) {
        var url = evt.detail.location;
        var host = document.getElementById("contentHost");
        // Call unload method on current scenario, if there is one
        host.winControl && host.winControl.unload && host.winControl.unload();
        WinJS.Utilities.empty(host);
        WinJS.UI.Pages.render(url, host).done(function () {
            WinJS.Application.sessionState.lastUrl = url;
        });
    });

    function _initNotLogin() {
        /*
         * init login status
         * all set false!
         **/

        var status = MixOne.Status,
            auth = MixOne.Auth;

        if (status.Sina) status.Sina.login = false;
        if (status.TX) status.TX.login = false;
        if (status.RR) status.RR.login = false;
        if (auth.Sina) auth.Sina.login = false;
        if (auth.TX) auth.TX.login = false;
        if (auth.RR) auth.RR.login = false;
    }

    function checkLogin() {

        var status = MixOne.Status,
            auth = MixOne.Auth,
            dataPromise = [],
            xhrArray = [];

        _initNotLogin();

        if (status !== null && auth !== null) {
            if (status['Sina'] && auth['Sina'] ) {
                var sina_url = 'https://api.weibo.com/2/users/show.json' + '?access_token=' + auth.Sina.token + '&uid=' + auth.Sina.uid;

                var sina_xhr = new XMLHttpRequest();
                try{
                    sina_xhr.open("GET", sina_url, false);
                }
                catch (err) {
                    console.log("sina err: " + err);
                }
                

                sina_xhr.onreadystatechange = function () {

                    if (sina_xhr.readyState === 4) {
                        if (sina_xhr.status === 200 || sina_xhr.status === 304) {
                            var res = '', o = {};
                            res = JSON.parse(sina_xhr.responseText);
                            o.name = res['screen_name'];
                            o.type = 'sina';

                            loginPromise.Sina = o;
                        }
                        else {
                            auth.Sina.login = false;
                            status.Sina.login = false;
                        }

                        console.log("sina xhr login --> " + (new Date().getTime()));
                    }                    
                }

                sina_xhr.onerror = function () {
                    console.log("get sina user info error!　");
                }

                sina_xhr.timeout = 20000;
                sina_xhr.ontimeout = function () {
                    console.log("detect auth status timeout!");
                }

                sina_xhr.send(null);
            }

            if (status['TX'] && auth['TX']) {
                var tx = auth['TX'],
                    tx_xhr = new XMLHttpRequest();
                var tx_url = 'https://open.t.qq.com/api/user/info?access_token=' + tx.token + '&oauth_consumer_key=' + tx.appkey + '&openid=' + tx.openid + '&clientip= ' + tx.ipaddress + '&oauth_version=2.a' + '&scope=all' + '&format=json';

                try{
                    tx_xhr.open("GET", tx_url, false);
                }
                catch (err){
                    console.log("tx err: "+err);
                }

                tx_xhr.onreadystatechange = function () {
                    if (tx_xhr.readyState === 4) {
                        if (tx_xhr.status === 200 || tx_xhr.status === 304) {
                            var res = JSON.parse(tx_xhr.responseText), o = {};
                            if (res.data === null || res.data === 'null') return;
                            o.name = res['data']['nick'];
                            o.type = 'tx';
                            status.TX.username = o.name;
                            status.TX.login = true;

                            loginPromise.TX = o;
                        }
                        else {
                            auth.TX.login = false;
                            status.TX.login = false;
                        }
                        console.log("tx xhr login --> " + (new Date().getTime()));
                    }
                }

                tx_xhr.onerror = function () {
                    console.log("get tx user info error! ");
                }
                
                tx_xhr.timeout = 20000;
                tx_xhr.ontimeout = function () {
                    console.log("get TX auth status timeout!");
                }
                
                tx_xhr.send(null);
            }

            //if (status['RR'] && auth['RR']) {
            //    var rr_url = '';
            //    WinJS.xhr({ url: rr_url }).then(function (req) {
            //        console.log('enter renren xhr: default.js');
            //        if (req.status === 200) {
            //            if (req.responseText !== null) {
            //                var o = {}, res = JSON.parse(req.responseText);
            //                loginPromise.RR = o;
            //            }
            //            else {
            //                auth.RR.loign = false;
            //                status.RR.login = false;
            //            }
            //        }
            //        else {
            //            auth.RR.loign = false;
            //            status.RR.login = false;
            //        }
            //    });
            //}
        }

    }

    app.oncheckpoint = function (args) {
        // TODO: 即将挂起此应用程序。在此处保存
        //需要在挂起中保留的任何状态。您可以使用
        // WinJS.Application.sessionState 对象，该对象将在
        //挂起中自动保存和恢复。如果您需要在
        //挂起应用程序之前完成异步操作，请调用
        // args.setPromise()。
        console.log('default-->应用挂起');
        WinJS.Application.sessionState.lastUrl = nav.location;

        if (MixOne) {
            if (MixOne.Status) {
                var loginStatus = JSON.stringify(MixOne.Status);
                localStorage.setItem('status', loginStatus);
                console.log('setItem status :' + loginStatus);
            }
            if (MixOne.Auth) {
                localStorage.setItem('auth',JSON.stringify(MixOne.Auth));
            }
        }
        app.sessionState.history = nav.history;
    };

    app.start();
})();
