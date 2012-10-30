
(function () {

    'use strict';

    var page = WinJS.UI.Pages.define("/www/news/news.html", {
        ready: function (element, options) {
            var listView = element.querySelector('#basicMessageListView').winControl;
            listView.forceLayout();
        }
    });

    function fillPage() {
        //for (var i = 0; i < len; i++) {
        //    var liBox = document.createElement('li'),
        //        _avart = document.createElement('div'),
        //        _avartImg = document.createElement('img'),
        //        _textContent = document.createElement('div'),
        //        _text1p = document.createElement('p'),
        //        _screenName = document.createElement('span'),
        //        _commaSpan = document.createElement('span'),
        //        _textNode = document.createTextNode(msg[i]['text']),
        //        _fromAndTime = document.createElement('div'),
        //        _fromP = document.createElement('p'),
        //        _clearDiv = document.createElement('div');
        //    liBox.id = msg[i]['id'];
        //    liBox.className = 'clearfix';
        //    _avart.className = 'userAvart';
        //    _avartImg.setAttribute('src', msg[i]['avart']);
        //    _avart.appendChild(_avartImg);

        //    _screenName.className = 'screen_name';
        //    _screenName.textContent = msg[i]['name'];
        //    _commaSpan.textContent = ':';
        //    _text1p.appendChild(_screenName).appendChild(_commaSpan).appendChild(_textNode);
        //    _textContent.appendChild(_text1p);
        //    if (msg[i]['retweet']) {
        //        var _retweet = document.createElement('div'),
        //            _atSpan = document.createElement('span'),
        //            _retweetUsr = document.createElement('span'),
        //            _reCommaSpan = document.createElement('span'),
        //            _reText = document.createElement('span');
        //        _retweet.className = 'retweeted';
        //        _atSpan.textContent = '@';
        //        _retweetUsr.textContent = msg[i]['retweet']['name'];
        //        _reCommaSpan.textContent = ':';
        //        _reText.textContent = msg[i]['retweet']['text'];
        //        _retweet.appendChild(_atSpan).appendChild(_retweetUsr).appendChild(_reCommaSpan).appendChild(_reText);
        //        _textContent.appendChild(_retweet);
        //    }

        //    _fromAndTime.className = 'fromeAndTime';
        //    if (msg[i]['source'] === 'sina') {
        //        _fromP.textContent = '新浪微博';
        //    }
        //    else if (msg[i]['source'] === 'tx') {
        //        _fromP.textContent = '腾讯微博';
        //    }
        //    else if (msg[i]['source'] === 'rr') {
        //        _fromP.textContent = '人人网';
        //    }
        //    _fromAndTime.appendChild(_fromP);
        //    _textContent.appendChild(_fromAndTime);
        //    _clearDiv.className = 'clearfix';
        //    liBox.appendChild(_avart).appendChild(_textContent).appendChild(_clearDiv);
        //    box.appendChild(liBox);
        //}

    }

})();

