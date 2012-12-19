/*
 * MixOne.js 
 * main javascript file. 
 * defined a lot of value and method for Global object: MixOne
 * 
 **/
(function () {

    'use strict';

    var MixOne = MixOne || {};
    var number = 30;

    MixOne.etc = {
        checkNetwork: checkNetwork,
        getIP: getIpAddress
    };
    MixOne.News = {
        Sina: [],
        TX: [],
        RR: []
    };

    MixOne.Serve = {
        TX: {
            getNews: getTXWeibo,
            refreshToken: refreshTXToken,
            getCode: getTXCode,
            getToken: getTXToken,
            getUser: getTXUser
        },
        Sina: {
            getNews: getSinaWeibo,
            getCode: getSinaCode,
            getToken: getSinaToken,
            getUser: getSinaUser
        },
        RR: {
            getToken: getRRToken
        },
        KX: {}
    };

    MixOne.loginPromise = [];

    function _init() {
        /**
         * If has local store item status
         *     then get it and init MixOne.Status with it.
         * else
         *     reinit MixOne.Status as default.
         **/
        var _status = localStorage.getItem('status');
        if (_status && _status !== '[object Object]') {
            var _preStatus = JSON.parse(_status);

            if (typeof _preStatus === 'object') {
                MixOne.Status = _preStatus;
            }
        }
        else {
            _initStatus();
        }
        /**
         * If has local store item auth.
         *     then get it and init MixOne.Auth with it.
         * else 
         *     reinit MixOne.Auth as default.
         **/
        var oauth = localStorage.getItem('auth');
        if (oauth !== null && oauth !== undefined && oauth !== '[object Object]') {
            if (oauth.length > 6) {
                var auth = JSON.parse(oauth);
                MixOne.Auth = auth;
            }
        }
        else {
            _initAuth();
        }
        /***
         * add notConnect method to MixOne.etc to alert user network is not availible.
         */
        MixOne.etc.notConnect = _networkNotConnect;
    }

    function _initAuth() {
        MixOne.Auth = {
            TX: {
                appkey: '801257753',
                appsecret: '5b90cf75a29585174bef45bf2e1548d4',
                codeURL: 'https://open.t.qq.com/cgi-bin/oauth2/authorize',
                redirectURL: 'http://www.dmdgeeker.com',
                tokenURL: 'https://open.t.qq.com/cgi-bin/oauth2/access_token',
                ipaddress: '',
                refreshToken: ''
            },
            Sina: {
                appkey: '3654626002',
                appsecret: 'a13b68086cc9b399a28a324e85e49e97',
                codeURL: 'https://api.weibo.com/oauth2/authorize',
                redirectURL: 'https://api.weibo.com/oauth2/default.html',
                tokenURL: 'https://api.weibo.com/oauth2/access_token'
            },
            RR: {
                appkey: '63df73f39cd84f28959aaa0bc0da4734',
                appsecret: '0a4958793e8247be91adb6cda2019dcd',
                codeURL: 'https://graph.renren.com/oauth/authorize',
                tokenURL: 'https://graph.renren.com/oauth/authorize',
                redirectURL: 'http://graph.renren.com/oauth/login_success.html',

            },
            KX: {}
        };
    }

    function _initStatus() {
        MixOne.Status = {
            Sina: {
                login: false
            },
            TX: {
                login: false
            },
            RR: {
                login: false
            },
            KX: {
                login: false
            }
        };
    }

    function _networkNotConnect() {
        var msg = new Windows.UI.Popups.MessageDialog('请检查网络连接状态！', '未连接网络');
        msg.commands.append(new Windows.UI.Popups.UICommand('确定', function (command) {

        }));
        msg.defaultCommandIndex = 1;
        msg.cancelCommandIndex = 1;
        msg.showAsync();
    }
    
    /**
    * useless!!!
    * refreshTXToken do the same things!
    */
    function _txRefreshToken() {
        var _url = 'https://open.t.qq.com/cgi_bin/oauth2/access_token?client_id=' +
            MixOne.Auth.TX.appkey + '&grant_type=refresh_token&refresh_token=' +
            MixOne.Auth.TX.refreshToken,
            ajax = new XMLHttpRequest(),
            t = MixOne.Auth.TX;

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
            return false;
        }
        else {
            return true;
        }
    }

    /**
     * get ip address
     * cause tencent weibo need it to oauth.
     */
    function getIpAddress(myurl) {

        if (!myurl) myurl = 'http://iframe.ip138.com/ic.asp';
        var exp = /([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})/g,
            ipaddress = '',
            xhr = new XMLHttpRequest();

        xhr.open('GET', myurl, false);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 304) {
                    var r = xhr.responseText;
                    if (!exp.test(r)) {
                        if (myurl === 'http://iframe.ip138.com/ipcity.asp') {
                            getIpAddress('http://jsonip.com/');
                        }

                        return;
                    }
                    else {
                        ipaddress = r.match(exp)[0];
                    }
                        
                    if (MixOne.Auth.TX && ipaddress) {
                        MixOne.Auth.TX.ipaddress = ipaddress;
                    }
                    localStorage.setItem('ipaddress', ipaddress);
                }
                else if (myurl === 'http://iframe.ip138.com/ipcity.asp') {
                    getIpAddress('http://jsonip.com/');
                    return;
                }
            }
        }

        xhr.onerror = function () {
            var preIP = localStorage.getItem('ipaddress');
            if (preIP !== null && exp.test(preIP)) {
                ipaddress = preIP;
            }
        }

        xhr.timeout = 10000;
        xhr.ontimeout = function () {
            var preIP = localStorage.getItem('ipaddress');
            if (preIP !== null && exp.test(preIP)) {
                ipaddress = preIP;
            }
        }

        xhr.send(null);
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
                            if (resText !== null && resText.length > 5) {
                                o.token = JSON.parse(resText)['access_token'];
                                o.uid = JSON.parse(resText)['uid'];
                                getSinaUser();
                            }
                        }()); break;
                        case 'tx': (function () {
                            if (resText !== null && resText.length > 5) {
                                var error = resText.slice(0, 5);
                                if (error === 'error') return false;
                                o.token = resText.split('&')[0].split('=')[1];
                                o.refreshToken = resText.split('&')[2].split('=')[1];
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
        var ip = '', o = {},
            tx = MixOne.Auth.TX,
            xhr = new XMLHttpRequest(),
            lastTime = 0;
        
        if (!tx.ipaddress) {
            getIpAddress();
        }

        if (tx.ipaddress && tx.ipaddress.length > 4) {
            ip = tx.ipaddress;
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
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var res = JSON.parse(xhr.responseText)['data'],
                        info = [],
                        len = 0;

                    if (res !== null && res !== undefined) info = res['info'];
                    len = info.length;
                    if (len > 0) {
                        MixOne.Auth.TX.lastTime = info[0]['timestamp'];
                    }

                    if (MixOne.News.TX.length > 0) MixOne.News.TX = [];

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
    function getTXUser() {

        var tx = MixOne.Auth.TX,
            xhr = new XMLHttpRequest();
        if (!tx.openid) return false;
        var url = 'https://open.t.qq.com/api/user/info?access_token=' + tx.token + 
            '&oauth_consumer_key=' + tx.appkey + '&openid=' + tx.openid + '&clientip= ' +
            tx.ipaddress + '&oauth_version=2.a' + '&scope=all' + '&format=json';

        xhr.onreadystatechange = function () {
            var o = {};
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var res = JSON.parse(xhr.responseText);
                    if (res) {
                        tx.username = res['data']['nick'];
                        tx.login = true;
                        MixOne.Status.TX.username = tx.username;
                        MixOne.Status.TX.login = true;
                        o.name = tx.username;
                        o.type = 'tx';
                        MixOne.loginPromise.TX = o;
                        console.log('mixone.js--> getTXUser: tx usrname = ' + tx.username);
                    }
                    else {
                        MixOne.Status.TX.login = false;
                        MixOne.Auth.TX.login = false;
                    }
                }
                else {
                    MixOne.Status.TX.login = false;
                    tx.login = false;
                }
            }
        }

        xhr.open('GET',url,false);
        xhr.send(null);
    }
    /**
     * convert time from millionseconds to regular format.
     **/
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

        if (!MixOne.Auth) {
            var oauth = localStorage.getItem('auth');
            if(oauth !== null && oauth !== undefined)
                MixOne.Auth = oauth;
        }

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
                    if (len > 0 && MixOne.News.Sina.length > 0) {
                        MixOne.News.Sina = [];
                    }
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
                        /**
                        * 这里出现了一个错误(Error)
                        * 当一条微博被删除后，依然可以取到text
                        * 但是，后面的screen_name就不能取到了。因而需要try...catch...
                        * 
                        */
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
    function getSinaUser() {
        if (!MixOne.Auth.Sina.uid) return;
        var url = 'https://api.weibo.com/2/users/show.json' + '?access_token=' +
            MixOne.Auth.Sina.token + '&uid=' + MixOne.Auth.Sina.uid,
            xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if (xhr.status === 200) {
                    var res = JSON.parse(xhr.responseText);
                    MixOne.loginPromise.Sina = {};

                    MixOne.Auth.Sina.username = res['screen_name'];
                    MixOne.Status.Sina.username = res['screen_name'];
                    MixOne.Status.Sina.login = true;
                    MixOne.Auth.Sina.login = true;
                    //MixOne.Status.Sina.avart = 'url';
                    console.log('mixone.js-->sina username:'+MixOne.Status.Sina.username);

                    MixOne.loginPromise.Sina.name = res['screen_name'];
                    MixOne.loginPromise.Sina.type = 'sina';
                    localStorage.setItem('status', JSON.stringify(MixOne.Status));
                    localStorage.setItem('auth', JSON.stringify(MixOne.Auth));
                }
                else {
                    MixOne.Auth.Sina.login = false;
                    MixOne.Status.Sina.login = false;
                    
                }
            }
        }

        xhr.open('GET', url, false);
        xhr.send(null);
        
    }
    /* for renren */

    function _initMixone() {

        if (checkNetwork()) {
            try {
                //setTimeout();
                getIpAddress();
            }
            catch (err) {
                console.log("line: 649; mixone.js get ipaddress error :"+err);
            }
        }
            

        WinJS.Namespace.define('MixOne', MixOne);
    }

    _init();
    _initMixone();
})();

