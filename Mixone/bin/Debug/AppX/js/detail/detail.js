
//var commentTemplate = WinJS.Utilities.markSupportedForProcessing(function commentTemplate(itemPromise) {

//});


(function () {

    'use strict';

    //var commentArray = [];
    //var commentContentDiv = '';
    WinJS.Binding.optimizeBindingReferences = true;

    WinJS.UI.Pages.define("/www/detail/detail.html", {
        // 每当用户导航至此页面时都要调用此功能。它
        // 使用应用程序的数据填充页面元素。
        ready: function (element, options) {
            //var showLog = document.getElementById('detailShow');
            //if (options && options.item) {
            //    showLog.textContent = options.item;
            //}
            var guid = '', from = '';
            var detailSrc = document.getElementById('detailSource');
            var listView = element.querySelector('#detaillistview').winControl;
            if (options && options.src && options.src.id) {
                guid = options.src.id.slice(4);
                from = options.src.id.slice(0, 4);
                detailSrc.textContent = '（' + options.src.source + '）';
                console.log(from + '---' + guid);
                //getComments(from, guid, element);
            }


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

})();