
(function () {

    'use strict';

    var commentArray = [];

    WinJS.UI.Pages.define("/www/detail/detail.html", {
        // 每当用户导航至此页面时都要调用此功能。它
        // 使用应用程序的数据填充页面元素。
        ready: function (element, options) {
            //var showLog = document.getElementById('detailShow');
            //if (options && options.item) {
            //    showLog.textContent = options.item;
            //}
            var guid = '', source = '';

            if (options && options.src && options.src.id) {
                guid = options.src.id.slice(4);
                source = options.src.id.slice(0,4);
                console.log(source + '---' +guid);
            }

            getComments(source,guid);

            /**
            * log all values in options.src
            * can't use options.src.length
            */
            //if (options && options.src) {
            //    for (var i in options.src) {
            //        console.log(options.src[i]);
            //    }
                
            //}

        },

        unload: function () {
            // TODO: 响应导航到其他页。
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: 响应 viewState 的更改。
        }
    });

    function getComments(type,id) {

        var url = '',
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
                    if(resText === null || resText === undefined) return;
                    if ('sina' === type) {
                        var res = JSON.parse(resText)['comments'],
                            len = res.length;
                        console.log('sina length is ' + len);
                        commentArray = [];
                        for (var i = len - 1; i >= 0; i++) {
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


                }
                else {
                    console.log('get comment status is ' + xhr.status);
                }
            }
        }

        xhr.open('GET',url,false);
        xhr.send(null);
    }

    var comments = WinJS.Binding.List(commentArray);



})();