
var myListTemplate = WinJS.Utilities.markSupportedForProcessing(function myListTemplate(itemPromise) {
    return itemPromise.then(function (item) {
        var result = document.createElement('div'),
            mainContain = document.createElement('div');
        result.className = 'itemList';
        result.style.overflow = 'hidden';
        mainContain.className = 'textMainContainer';

        var imageContainer = document.createElement('div');
        imageContainer.className = 'userAvart';
        var avart = document.createElement('img');
        avart.src = item.data.avart;   //user's avart
        avart.alt = '';
        imageContainer.appendChild(avart);
        mainContain.appendChild(imageContainer);

        var textContent = document.createElement('div'),
            tweetText = document.createElement('div');
        textContent.className = 'textContent';
        tweetText.className = 'tweetMessage';
        var screen_name = document.createElement('span');
        screen_name.className = 'screen_name';
        screen_name.textContent = item.data.name; //user's name
        tweetText.appendChild(screen_name);

        var commaSpan = document.createElement('span');
        commaSpan.textContent = ' : ';
        tweetText.appendChild(commaSpan);

        var textTweet = document.createElement('span');
        textTweet.className = 'textTweet';
        textTweet.textContent = item.data.text; // tweet's text;
        tweetText.appendChild(textTweet);
        textContent.appendChild(tweetText);


        if (item.data && item.data.retweet) {
            var retweet = document.createElement('div'),
                atSpan = document.createElement('span'),
                retweetUser = document.createElement('span'),
                retweetText = document.createElement('span'),
                reCommaSpan = document.createElement('span');
            retweet.className = 'retweeted';
            atSpan.textContent = '@';
            reCommaSpan.textContent = ' : ';
            retweetUser.className = 'retweetUser';
            retweetUser.textContent = item.data.retweet.name;
            retweetText.textContent = item.data.retweet.text;

            retweet.appendChild(atSpan);
            retweet.appendChild(retweetUser);
            retweet.appendChild(reCommaSpan);
            retweet.appendChild(retweetText);
            textContent.appendChild(retweet);
        }

        mainContain.appendChild(textContent);
        result.appendChild(mainContain);

        function getComments(type, id) {

            var url = '',
                commentArray = [],
                xhr = new XMLHttpRequest();
            switch (type) {
                case 'sina': url = 'https://api.weibo.com/2/comments/show.json' +
                        '?access_token=' + MixOne.Auth.Sina.token +
                        '&id=' + id; break;
                case 'txwb': url = ''; break;
                case 'rrxx': url = ''; break;
                default: url = '';
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var resText = xhr.responseText;
                        if (resText === null || resText === undefined) return;
                        if ('sina' === type) {
                            var res = JSON.parse(resText)['comments'],
                                len = res.length;
                            console.log('sina length is ' + len);
                            commentArray = [];
                            for (var i = 0; i < len; i++) {
                                var o = {};
                                o.text = res[i]['text'];
                                o.avart = res[i]['user']['profile_image_url'];
                                o.name = res[i]['user']['screen_name'];
                                commentArray.push(o);
                            }
                            //end of get comments.
                        }
                        else if ('txwb' === type) {
                            commentArray = [];
                        }
                        else if ('rrxx' === type) {
                            commentArray = [];
                        }
                        console.log('comment length is '+commentArray.length);
                        var comments = new WinJS.Binding.List(commentArray),
                            dataSource = {
                                itemList: comments
                            };
                        WinJS.Namespace.define('Comments', dataSource);
                        WinJS.Navigation.navigate('/www/detail/detail.html', { src: item.data });
                    }
                    else {
                        console.log('get comment status is ' + xhr.status);
                    }
                }
            }

            xhr.open('GET', url, false);
            xhr.send(null);
        }

        var messageTime = document.createElement('div'),
            timeSpan = document.createElement('span');
        timeSpan.textContent = item.data.date + '  ' + item.data.source;
        messageTime.className = 'fromeAndTime';
        messageTime.appendChild(timeSpan);

        result.appendChild(messageTime);
        result.addEventListener('click', function () {
            var source = item.data.id.slice(0, 4),
                id = item.data.id.slice(4);
            getComments(source, id);
            
        });

        return result;
    });
});

(function () {

    'use strict';

    var page = WinJS.UI.Pages.define("/www/news/news.html", {
        ready: function (element, options) {
            upDateMsg();
            WinJS.UI.processAll(element);
        },
        updateLayout: function (element, viewState, lastViewState) {
            WinJS.UI.processAll(element);
        }
    });

    //document.addEventListener('DOMContentLoaded', upDateMsg, false);

    function upDateMsg() {
        var news = MixOne.News,
        sinaLength = news.Sina.length,
        txLength = news.TX.length,
        rrLength = news.RR.length,
        msg = [];

        if (sinaLength > 0) msg = msg.concat(news.Sina);
        if (txLength > 0) msg = msg.concat(news.TX);
        if (rrLength > 0) msg = msg.concat(news.RR);
        console.log('msg length is ' + msg.length);

        if (msg.length === 0) {
            //here msg Array can concat old messages;
        }

        if (msg.length > 0) {
            msg.sort(function (a, b) {
                if (typeof a !== 'object') {
                    return 0;
                }
                if (typeof b !== 'object') {
                    return 0;
                }
                return b.time - a.time;
            });
        }

        var dataList = new WinJS.Binding.List(msg);

        var dataSource = {
            itemList: dataList
        };

        WinJS.Namespace.define('AllMessages', dataSource);
        WinJS.UI.processAll();
    }

})();

