// 有关“空白”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;
    var thatTime = (new Date()).toString();
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    //I add it here! (Allen Heavey 2012/10/27)
    var defaultUrl = '/www/init/index.html';
    var nav = WinJS.Navigation,
        splash = null;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {

            splash = args.detail.splashScreen;
            MixOne.coordinates = splash.imageLocation;

            splash.addEventListener('dismissed', onSplashScreenDismissed, false);
            ExtendedSplash.show(splash);
            window.addEventListener('resize', onResize, false);

            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: 此应用程序刚刚启动。在此处初始化
                //您的应用程序。
                //return WinJS.Navigation.navigate(defaultUrl);
                if (MixOne && MixOne.etc && MixOne.etc.checkNetwork) {
                    console.log('start to check network!');
                    MixOne.etc.checkNetwork();
                }

            } else {
                // TODO: 此应用程序已从挂起状态重新激活。
                // 在此处恢复应用程序状态。
                console.log('restart the application!');
                var _url = WinJS.Application.sessionState.lastUrl || defaultUrl;
                return nav.navigate(_url);
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                //checkLogin();
                MixOne.etc.checkLogin = checkLogin;
                return new WinJS.Promise.as(checkLogin());

            }).then(function () {
                ExtendedSplash.remove();
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
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

    function checkLogin() {

        var statusStore = localStorage.getItem('status'),
            oauth = localStorage.getItem('auth'),
            status = null,
            auth = null,
            dataPromise = [],
            target = MixOne.Status;

        var loginPromise = [],
            xhrArray = [];

        if (statusStore !== null && statusStore !== '[object Object]') {
            status = JSON.parse(statusStore);
        }
        if (oauth !== null && oauth !== ['object Object']) {
            auth = JSON.parse(oauth);
        }

        if (status !== null && auth !== null) {
            if (status['Sina'] && status['Sina']['login'] && auth['Sina'] && auth['Sina']['login']) {
                var sina_url = 'https://api.weibo.com/2/users/show.json' + '?access_token='
                    + auth.Sina.token + '&uid=' + auth.Sina.uid;

                WinJS.xhr({ url: sina_url }).then(function (req) {
                    if (req.status === 200) {
                        var res = '', o = {};
                        if (req.responseText !== null) {
                            res = JSON.parse(req.responseText);
                            o.name = res['screen_name'];
                            o.type = 'sina';

                            loginPromise.push(o);
                        }
                        else {
                            MixOne.Auth.Sina.login = false;
                            MixOne.Status.Sina.login = false;
                        }
                    }
                    else {
                        MixOne.Auth.Sina.login = false;
                        MixOne.Status.Sina.login = false;
                    }
                });
            }

            if (status['TX'] && status['TX']['login'] && auth['TX'] && auth['TX']['login']) {
                var tx = auth['TX'];
                var tx_url = 'https://open.t.qq.com/api/user/info?access_token=' + tx.token +
            '&oauth_consumer_key=' + tx.appkey + '&openid=' + tx.openid + '&clientip= ' +
            tx.ipaddress + '&oauth_version=2.a' + '&scope=all' + '&format=json';

                WinJS.xhr({ url: tx_url }).then(function (req) {
                    var o = {};
                    if (req.status === 200) {
                        if (req.responseText !== null) {
                            var res = JSON.parse(req.responseText);

                            o.name = res['data']['nick'];
                            o.type = 'tx';
                            MixOne.Status.TX.username = o.name;
                            MixOne.Status.TX.login = true;

                            loginPromise.push(o);
                        }
                        else {
                            MixOne.Auth.TX.login = false;
                            MixOne.Status.TX.login = false;
                        }
                    }
                    else {
                        MixOne.Auth.TX.login = false;
                        MixOne.Status.TX.login = false;
                    }
                });

            }

            if (status['RR'] && status['RR']['login'] && auth['RR'] && auth['RR']['login']) {
                var rr_url = '';
                WinJS.xhr({ url: rr_url }).then(function (req) {
                    if (req.status === 200) {
                        if (req.responseText !== null) {
                            var o = {}, res = JSON.parse(req.responseText);

                            loginPromise.push(o);
                        }
                        else {
                            MixOne.Auth.RR.loign = false;
                            MixOne.Status.RR.login = false;
                        }
                    }
                    else {
                        MixOne.Auth.RR.loign = false;
                        MixOne.Status.RR.login = false;
                    }
                });
            }
        }
        else {
            target['Sina']['login'] = false;
            target['TX']['login'] = false;
            target['RR']['login'] = false;
            localStorage.setItem('status', JSON.stringify(target));
        }

        if (loginPromise.length === 0) {
            MixOne.Status.Sina.login = false;
            MixOne.Status.TX.login = false;
            MixOne.Status.RR.login = false;
            MixOne.Auth.Sina.login = false;
            MixOne.Auth.TX.login = false;
            MixOne.Auth.RR.login = false;
        }

        localStorage.setItem('status',JSON.stringify(MixOne.Status));

        MixOne.loginPromise = loginPromise;

    }

    function onSplashScreenDismissed(e) {
        MixOne.dismissed = true;

    }

    function onResize() {
        // Safely update the extended splash screen image coordinates. This function will be fired in response to snapping, unsnapping, rotation, etc...
        if (splash) {
            // Update the coordinates of the splash screen image.
            MixOne.coordinates = splash.imageLocation;
            ExtendedSplash.updateImageLocation(splash);
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
        }
        app.sessionState.history = nav.history;
    };

    app.start();
})();
