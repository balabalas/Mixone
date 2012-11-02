// 有关“空白”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    //I add it here! (Allen Heavey 2012/10/27)
    var defaultUrl = '/www/init/index.html';
    var nav = WinJS.Navigation,
        MixOne = MixOne || {};

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: 此应用程序刚刚启动。在此处初始化
                //您的应用程序。
                //return WinJS.Navigation.navigate(defaultUrl);
                
                if (MixOne && MixOne.etc && MixOne.etc.checkNetwork) {
                    MixOne.etc.checkNetwork();
                }

            } else {
                // TODO: 此应用程序已从挂起状态重新激活。
                // 在此处恢复应用程序状态。

                var _url = WinJS.Application.sessionState.lastUrl || defaultUrl;
                return nav.navigate(_url);
            }

            checkLogin();

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
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

        var statusStore = localStorage.getItem('Status'),
            status = {},
            token = '',
            uid = '',
            o = {},
            target = MixOne.Status;
        
        if (statusStore !== null && statusStore !== undefined) {
            status = JSON.parse(statusStore);
        }

        if (status !== null && status !== {}) {
            if (status['Sina']) {
                o.token = status['Sina']['token'];
                o.uid = status['Sina']['uid'];
                MixOne.etc.getUser('sina', o);
            }

            if (status['TX']) {
                o.token = status['TX']['token'];
                o.uid = status['TX']['uid'];
                o.refresh_token = status['TX']['refresh_token'];
                MixOne.etc.getUser('tx', o);
            }

            if (status['RR']) {
                o.token = status['RR']['token'];
                o.uid = status['RR']['uid'];
                MixOne.etc.getUser('rr', o);
            }

        }
        else {
            target['Sina']['login'] = false;
            target['TX']['login'] = false;
            target['RR']['login'] = false;
        }
    }



    app.oncheckpoint = function (args) {
        // TODO: 即将挂起此应用程序。在此处保存
        //需要在挂起中保留的任何状态。您可以使用
        // WinJS.Application.sessionState 对象，该对象将在
        //挂起中自动保存和恢复。如果您需要在
        //挂起应用程序之前完成异步操作，请调用
        // args.setPromise()。

        WinJS.Application.sessionState.lastUrl = nav.location;

        if (MixOne) {
            if (MixOne.Status) {
                var loginStatus = JSON.stringify(MixOne.Status);
                localStorage.setItem('Status',loginStatus);
            }
        }
        app.sessionState.history = nav.history;
    };

    app.start();
})();
