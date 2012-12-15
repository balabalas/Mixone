
(function () {

    'use strict';

    document.addEventListener('load', function () {
        var detailListview = document.getElementById('detaillistview');
        var containerItem = detailListview.getElementsByClassName('win-container'),
            commentText = detailListview.getElementsByClassName('commentItemText'),
            commentLen = commentText.length;

        for (var i = 0; i < commentLen; i++) {
            var cmLen = commentText[i].textContent.length;
            if (cmLen > 60) {
                console.log("comment text length is " + cmLen);
                containerItem[i].style.height = cmLen / 5 + 'vh';
            }
        }

    });

})();