(function() {
    var pageHeader = document.querySelector('.page-header');
    var pageHeaderNav = pageHeader.querySelector('.page-header__nav')
    var pageHeaderToggler = pageHeader.querySelector('.page-header__toggler');

    pageHeaderToggler.addEventListener('click', function() {
        pageHeaderNav.classList.toggle('page-header__nav_opened');
        pageHeaderToggler.classList.toggle('page-header__toggler_active');
    });

    pageHeader.classList.add('page-header_toggling');
})();