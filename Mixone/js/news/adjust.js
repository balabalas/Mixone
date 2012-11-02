
(function () {
    var textMainContainer = document.getElementsByClassName('textMainContainer');

    for (var i = 0; i < textMainContainer.length; i++) {
        if (textMainContainer[i].style.height >= 200) {
            textMainContainer[i].style.height = 200 + 'px';
        }
    }


})();

