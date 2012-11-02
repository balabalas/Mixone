
var MixOne;

(function(){
    'use strict';

    MixOne = {};
    MixOne.Status = {};
    MixOne.etc = {
        checkNetwork: checkNetwork,
        getUser: getUserInfo
    };
    MixOne.News = {};

    MixOne.News.Sina = new Array();
    MixOne.News.TX = [];
    MixOne.News.RR = [];
    console.log('first: '+ MixOne.News.Sina instanceof Array);

    var settings = localStorage.getItem('settings'),
        number = 20;

    if (settings) {
        var setting = JSON.parse(settings);
        number = setting.number || 20;
    }

    MixOne.Auth = {
        TX: {
            appkey: '801257753',
            appsecret: '5b90cf75a29585174bef45bf2e1548d4',
            codeURL: 'https://open.t.qq.com/cgi-bin/oauth2/authorize',
            redirectURL: 'http://www.mixone.org',
            tokenURL: 'https://open.t.qq.com/cgi-bin/oauth2/access_token',
            ipaddress: '',
            refreshToken: '',
            refreshTXToken: refreshTXToken,
            getCode: getTXCode,
            getToken: getTXToken,
            getNews: getTXWeibo
        },
        Sina: {
            appkey: '3654626002',
            appsecret: 'a13b68086cc9b399a28a324e85e49e97',
            codeURL: 'https://api.weibo.com/oauth2/authorize',
            redirectURL: 'https://api.weibo.com/oauth2/default.html',
            tokenURL: 'https://api.weibo.com/oauth2/access_token',
            getCode: getSinaCode,
            getToken: getSinaToken,
            getNews: getSinaWeibo
        },
        RR: {
            appkey: '63df73f39cd84f28959aaa0bc0da4734',
            appsecret: '0a4958793e8247be91adb6cda2019dcd',
            codeURL: 'https://graph.renren.com/oauth/authorize',
            tokenURL: 'https://graph.renren.com/oauth/authorize',
            redirectURL:'http://graph.renren.com/oauth/login_success.html',
            getToken: getRRToken
        },
        KX: {}
    };

    MixOne.Status.TX = {};
    MixOne.Status.Sina = {};
    MixOne.Status.RR = {};
    MixOne.Status.KX = {};
    MixOne.Serve = {
        TX: {
            getNews: getTXWeibo
        },
        Sina: {
            getNews: getSinaWeibo,

        },
        RR: {},
        KX: {}
    }

    function initMixone() {
        getIpAddress();
        WinJS.Namespace.define('MixOne',MixOne);
    }

    /**
    * Get user info
    *
    **/
    function getUserInfo(type,o) {

        var url = '',
            target = {};
        switch (type) {
            case 'sina': (function () {
                url = 'https://api.weibo.com/2/users/show.json?access_token=' +
                    o.token + '&uid=' + o.uid;
                target = MixOne.Status.Sina;
            })(); break;
            case 'tx': (function () {
                url = '';
                target = MixOne.Status.TX;
            })(); break;
            case 'rr': (function () {
                url = '';
                target = MixOne.Status.RR;
            })(); break;
            default: url = '';
        }

        var xhr = new XMLHttpRequest();
        xhr.timeout = 10000;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var res = xhr.responseText;
                    if (res !== null && res !== undefined) {
                        var data = JSON.parse(res);
                        target.login = true;
                        target.token = o.token;
                        target.uid = o.uid;
                        _getPersonInfo(data,target);
                    }
                }
                else {
                    //when get the wrong messages.
                    if (type === 'tx') {
                        _txRefreshToken(target);
                    }
                    else {
                        target.login = false;
                    }
                }
            }
        }

        xhr.open('GET',url,false);
        xhr.send(null);

        function _getPersonInfo(res,t) {
            if (type === 'sina') t.username = res['screen_name'];
            else if (type === 'tx') t.username = res['data']['nick'];
            else if(type === 'rr') t.username = res[''];
        }

        function _txRefreshToken(t) {
            var _url = 'https://open.t.qq.com/cgi_bin/oauth2/access_token?client_id=' + 
                MixOne.Auth.TX.appkey + '&grant_type=refresh_token& refresh_token=' + 
                o['refresh_token'],
                ajax = new XMLHttpRequest();

            ajax.onreadystatechange = function () {
                if (ajax.readyState === 4) {
                    if (ajax.status === 200) {
                        var res = ajax.responseText.split('&');
                        t.login = true;
                        t.access_token = res[0].split('=')[1];
                        t.refresh_token = res[2].split('=')[1];
                        t.username = res[3].split('=')[1];
                    }
                    else {
                        t.login = false;
                    }
                }
                
            }

            ajax.open('GET', _url, false);
            ajax.send(null);
        }
    }

    /*
    * get renren token.
    ***/
    function getRRToken() {
        var r = MixOne.Auth.RR;
        var url = r.codeURL + '?client_id=' + r.appkey + '&redirect_uri=' + 
            r.redirectURL + '&response_type=token';
        
        getAuthCode(url,r,'rr');
    }



    function checkNetwork() {
        var networkInfo = Windows.Networking.Connectivity.NetworkInformation,
            internetProfile = networkInfo.getInternetConnectionProfile();

        if (internetProfile === null) {

            //var msg = new Windows.UI.Popups.MessageDialog("请确定您的网络保持连接", "网络出错了");
            //msg.commands.append(new Windows.UI.Popups.UICommand("确定", function (command) {

            //}));
            ////msg.commands.append(new Windows.UI.Popups.UICommand("", function (command) {

            ////}));

            //msg.defaultCommandIndex = 1;
            //msg.showAsync();

            return 'no';
        }
        else {
            return 'yes';
        }

    }
    /***
    * server check.
    */
    function checkServerNetwork(uri) {
        var uri = 'http://api.weibo.com/oauth2/authorize';


    }

    //get ip address
    function getIpAddress(myurl) {

        if (!myurl) myurl = 'http://iframe.ip138.com/ipcity.asp';
        var exp = /([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})/g,
            ipaddress = '';
        WinJS.xhr({
            tyep: 'GET',
            url: myurl
        }).done(function (res) {
            if (res.status === 200) {
                ipaddress = res.response.match(exp)[0];
                if (MixOne.Auth.TX) MixOne.Auth.TX.ipaddress = ipaddress;
                localStorage.setItem('ipaddress',ipaddress);
            }
            else if (myurl === 'http://iframe.ip138.com/ipcity.asp') {
                getIpAddress('http://jsonip.com/');
            }
        }, function (err) {
            checkNetwork();
        });
    }
    //get code for all
    function getAuthCode(url, o, type) {

        var eURL = o.redirectURL;

        var startURL = new Windows.Foundation.Uri(url);
        var endURL = new Windows.Foundation.Uri(eURL);

        Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(Windows.Security.Authentication.Web.WebAuthenticationOptions.none, startURL, endURL).done(function (res) {

            var data = res.responseData;
            //data may be null
            if(data && data.length > 8){
                switch (type) {
                    case 'sina': (function () {
                        o.code = data.match(/(\?)(.)+/g)[0].slice(1);
                        console.log('return sina code is ' + o.code);
                    }()); break;
                    case 'tx': (function () {
                        var adds = data.split('?')[1],
                            addArray = adds.split('&'),
                            len = addArray.length;

                        for (var i = 0; i < len; i++) {
                            var res = addArray[i].split('=');
                            if (res[0] === 'code') {
                                o.code = res[1];
                            }
                            else if (res[0] === 'openid') {
                                o.openid = res[1];
                            }
                            else if (res[0] === 'openkey') {
                                o.openkey = res[1];
                            }
                        }
                    }()); break;
                    case 'rr': (function () {
                        var resToken = data.split('#')[1].split('&')[0].split('=')[1];
                        o.token = resToken;
                        console.log(resToken);
                    }()); break;
                    default: (function () {

                    }());
                }

        }
        }, function (err) {
            
        });
    }
    //get token for all
    function getAuthToken(url,o, type) {

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var resText = xhr.responseText;
                    switch (type) {
                        case 'sina': (function () {
                          if(resText !== null && resText.length > 5)
                            o.token = JSON.parse(resText)['access_token'];
                        }()); break;
                        case 'tx': (function () {
                            if (resText !== null && resText.length > 5) {
                                var error = resText.slice(0, 5);
                                if (error === 'error') return false;
                                o.token = resText.split('&')[0].split('=')[1];
                                o.refreshToken = resText.split('&')[2].split('=')[1];

                                console.log('token is ' + o.token);
                            }

                        }()); break;
                        case 'rr': (function () {

                        }()); break;
                        default: (function () {

                        }()); break;
                    }
                }
            }
        }

        xhr.open('POST', url);
        xhr.send(null);

    }
    /*
      tecent weibo 
    */
    function getTXCode(){
        var tx = MixOne.Auth.TX;
        var url = tx.codeURL + '?client_id=' + tx.appkey + '&response_type=code&redirect_uri='
        + tx.redirectURL;

        getAuthCode(url, tx, 'tx');

    }
    function getTXToken() {

        var tx = MixOne.Auth.TX;
        var url = tx.tokenURL + '?client_id=' + tx.appkey + '&client_secret=' +
            tx.appsecret + '&redirect_uri=' + tx.redirectURL + '&grant_type=authorization_code'
            + '&code=' + tx.code;

        getAuthToken(url,tx,'tx');
    }
    function getTXWeibo(flag) {
        var ip = '', ipInfo = localStorage.getItem('ipaddress'), o = {},
            tx = MixOne.Auth.TX,
            xhr = new XMLHttpRequest(),
            lastTime = 0;
            
        if (tx.ipaddress && tx.ipaddress.length > 4) {
            ip = tx.ipaddress;
        }
        else if (ipInfo && ipInfo.length > 4) {
            ip = ipInfo;
        }

        if (!flag) flag = 0;
        else if (flag === 2) {
            if (MixOne.Auth.TX.lastTime) {
                lastTime = MixOne.Auth.TX.lastTime || 0;
            }
        }

        var url = 'http://open.t.qq.com/api/statuses/home_timeline?oauth_consumer_key=' +
            tx.appkey + '&access_token=' + tx.token + '&openid=' + tx.openid + '&clientip='+
            +ip + '&oauth_version=2.a&scope=all&' + 'reqnum=' + number + '&' +
            'format=json&pageflage='+flag+'&pagetime='+lastTime+'&type=0&contenttype=0';
        console.log(url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var res = JSON.parse(xhr.responseText)['data'],
                        info = res['info'],
                        len = info.length;
                    if (len > 0) {
                        MixOne.Auth.TX.lastTime = info[0]['timestamp'];
                    }

                    for (var i = 0; i < len; i++) {
                        var o = {};
                        o.id = 'txwb' + info[i]['id'];
                        o.name = info[i]['nick'];
                        o.text = info[i]['text'];
                        o.avart = info[i]['head'].replace(/\\/g, '') + '/50';
                        o.time = info[i]['timestamp'];
                        o.date = _timeToDate(o.time);
                        o.repostCount = info[i]['count'];
                        o.commentCount = info[i]['mcount'];
                        o.source = '腾讯微博';
                        if (info[i]['image']) {
                            o.image = info[i]['image'][0].replace(/\\/g,'') + '/160';
                        }

                        if (info[i]['source']) {
                            var source = info[i]['source'];
                            o.retweet = {};
                            o.retweet.name = source['nick'];
                            o.retweet.text = source['text'];
                            if (source['image']) {
                                o.retweet.image = source['image'][0].replace(/\\/g, '') + '/160';
                            }

                        }
                        MixOne.News.TX.push(o);
                        
                    }

                    
                }
            }
        }

        xhr.open('GET', url, false);
        xhr.send(null);

    }
    function refreshTXToken() {
        var tx = MixOne.Auth.TX,
            url = '';
        if (tx && tx.refreshToken) {
            url = tx.tokenURL + '?client_id=' + tx.appkey + '&grant_type=refresh_token' +
            '&refresh_token=' + tx.refreshToken;
            getAuthToken(url, tx, 'tx');
        }
        else {
            return 'fail';
        }
        
    }

    function _timeToDate(time) {
        if (time < 1351700000000) {
            time = time * 1000;
        }

        var d = new Date(time),
            today = '';

        var year = d.getFullYear(),
            month = d.getMonth() + 1,
            day = d.getDate(),
            hour = d.getHours(),
            minute = d.getMinutes(),
            second = d.getSeconds();

        today = year + '/' + month + '/' + day + '  ' + hour + ':' + minute;
        return today;
    }

    //for sina auth
    function getSinaCode() {

        var s = MixOne.Auth.Sina;
        var url = s.codeURL + '?client_id=' + s.appkey + '&response_type=code' +
            '&redirect_uri=' + s.redirectURL;

        getAuthCode(url, s, 'sina');
    }
    function getSinaToken() {

        var s = MixOne.Auth.Sina;
        var url = s.tokenURL + '?client_id=' + s.appkey + '&client_secret=' + s.appsecret +
            '&grant_type=authorization_code' + '&redirect_uri=' + s.redirectURL + '&' + s.code;

        getAuthToken(url, s, 'sina');
    }
    function getSinaWeibo(flag) {

        var s = MixOne.Auth.Sina;
        var url = 'https://api.weibo.com/2/statuses/home_timeline.json?access_token=' +
            s.token + '&count=' + number,
            xhr = new XMLHttpRequest();

        if (!flag) flag = 0;
        else if (MixOne.Auth.Sina) {
            if (MixOne.Auth.Sina.lastTime) flag = MixOne.Auth.Sina.lastTime;
        }

        url += '&since_id=' + flag;

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var resJSON = xhr.responseText,
                        response = JSON.parse(resJSON),
                        len = 0,
                        res;

                    if (response !== null){
                        res = response['statuses'];
                        len = res.length;
                        if(res.length > 0)
                        MixOne.Auth.Sina.lastTime = res[0]['id'];
                    }
                    console.log('sina res len is ' + len);
                    for (var i = 0; i < len; i++) {
                        var o = {};

                        o.id = 'sina' + res[i]['id'];
                        o.name = res[i]['user']['screen_name'];
                        o.text = res[i]['text'];
                        o.avart = res[i]['user']['profile_image_url'];
                        o.time = ((new Date(res[i]['created_at'].replace(' +0800', ''))).getTime()) / 1000;
                        o.date = _timeToDate(o.time);
                        o.repostCount = res[i]['reposts_count'];
                        o.commentCount = res[i]['comments_count'];
                        o.source = '新浪微博';
                        if (res[i]['bmiddle_pic']) {
                            o.image = res[i]['bmiddle_pic'];
                        }

                        if (res[i]['retweeted_status']) {
                            var twe = res[i]['retweeted_status'];
                            o.retweet = {};
                            o.retweet.text = twe['text'];
                            o.retweet.name = twe['user']['screen_name'];
                            if (twe['bmiddle_pic']) {
                                o.retweet.image = twe['bmiddle_pic'];
                            }
                        }

                        MixOne.News.Sina.push(o);
                    }

                }
            }
        }

        xhr.open('GET', url);
        xhr.send(null);

    }
    function getSinaComment(id) {
        var url = 'https://api.weibo.com/2/comments/show.json?access_token=' +
            MixOne.Auth.token + '&id=' + id,
            xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {

        }


    }
    /* for renren */




    var page = WinJS.UI.Pages.define("/www/default.html", {
        ready: function (element, options) {
            initMixone();
        }
    });

}());

