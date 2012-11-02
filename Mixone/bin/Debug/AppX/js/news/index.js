
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

        //var timeAndComment = document.createElement('div'),
        //    timeSpan = document.createElement('span'),
        //    btnGroup = document.createElement('div'),
        //    inTimeAndComment = document.createElement('div'),
        //    commentTextSpan = document.createElement('span'),
        //    retweetTextSpan = document.createElement('span'),
        //    commentCountSpan = document.createElement('span'),
        //    retweetCountSpan = document.createElement('span'),
        //    backSpan = document.createElement('span'),
        //    backSpan2 = document.createElement('span');
        //timeAndComment.className = 'fromeAndTime';
        //timeSpan.className = 'messageTime';
        //timeSpan.textContent = item.data.time;
        //inTimeAndComment.className = 'inTimeAndComment';
        //btnGroup.className = 'buttonGroup';
        //commentTextSpan.textContent = '评论（';
        //retweetTextSpan.textContent = '转发（';
        //backSpan.textContent = '）';
        //backSpan2.textContent = '）';
        //commentCountSpan.textContent = item.data.commentCount;
        //retweetCountSpan.textContent = item.data.repostCount;
        //btnGroup.appendChild(commentTextSpan);
        //btnGroup.appendChild(commentCountSpan)
        //btnGroup.appendChild(backSpan);
        //btnGroup.appendChild(retweetTextSpan);
        //btnGroup.appendChild(retweetCountSpan);
        //btnGroup.appendChild(backSpan2);
        //inTimeAndComment.appendChild(timeSpan);
        //inTimeAndComment.appendChild(btnGroup);
        //timeAndComment.appendChild(inTimeAndComment);

        var messageTime = document.createElement('div'),
            timeSpan = document.createElement('span');
        timeSpan.textContent = item.data.date + '  ' + item.data.source;
        messageTime.className = 'fromeAndTime';
        messageTime.appendChild(timeSpan);

        result.appendChild(messageTime);
        result.addEventListener('click', function () {
            WinJS.Navigation.navigate('/www/detail/detail.html', {src: item.data});
        });

        return result;
    });
});





(function () {

    'use strict';

    var page = WinJS.UI.Pages.define("/www/news/news.html", {
        ready: function (element, options) {
            WinJS.UI.processAll(element);
            
        }
    });

    document.addEventListener('DOMContentLoaded',pageLoad,false);

    function pageLoad() {
        WinJS.UI.processAll();
    }

})();

