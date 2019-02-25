var fssInit = function(userOptions){

    // Set options using any custom settings the user had passed in, else use defaults
    var fssOptions = {
        wrapper: userOptions.wrapper ? $(userOptions.wrapper) : $('.fss-wrapper'),
        inner: userOptions.inner ? $(userOptions.inner) : $('.fss-inner'),
        toggle: userOptions.toggle ? $(userOptions.toggle) : $('.fss-toggle'),
        headerHeight: userOptions.headerHeight ? userOptions.headerHeight : null // TODO: Test with passing in values
    }

    var navOpenState = false;

    // If the user doesn't pass a height value, get the height of the element manually
    if (!fssOptions.headerHeight) {

        // Make sure the inner element is hidden so that it isn't included in height calculations
        fssOptions.inner.hide();
        fssOptions.headerHeight = fssOptions.wrapper.outerHeight(true);

    }

    // Set the wrapper element to the calculated max height and add the default height: 100% value
    fssOptions.wrapper.css({
        'height': '100%',
        'max-height': fssOptions.headerHeight,
    });

    // Unhide the inner element so that it can be seen when the wrapper is set to full height
    fssOptions.inner.show();

    // Add inactive class to the body. This can be used for styling etc.
    $('body').addClass('fss-inactive');
    fssOptions.wrapper.addClass('fss-closed');

    /*****************/
    /* Main function */
    /*****************/
    // Watch the toggle element for a click and then do stuff
    fssOptions.toggle.click(function (e) {
        e.preventDefault();

        fssOptions.wrapper.toggleClass('fss-closed').toggleClass('fss-open');

        if (navOpenState) {
            // If nav is currently open

            $('body').css({
                'height': 'auto',
                'overflow': 'visible'
            }).toggleClass('fss-active').toggleClass('fss-inactive');

            navOpenState = false;

        } else {
            // If nav is currently closed

            $('body').css({
                'height': '100%',
                'overflow': 'hidden'
            }).toggleClass('fss-active').toggleClass('fss-inactive');

            navOpenState = true;

        }

    });
};

$(document).ready(function(){

    fssInit({
        wrapper: '.js-header',
        inner: '.js-nav'
    });

});
