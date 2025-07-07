(function ($) {
    "use strict";

    // Superfish on nav menu
    $('.nav-menu').superfish({
        animation: {opacity: 'show'},
        speed: 400
    });
    
    
    // Typed Initiate
    if ($('.top-header h2').length == 1) {
        var typed_strings = $('.top-header p').text();
        var typed = new Typed('.top-header h2', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }


    // Mobile Navigation
    if ($('#nav-menu-container').length) {
        var $mobile_nav = $('#nav-menu-container').clone().prop({id: 'mobile-nav'});
        $mobile_nav.find('> ul').attr({'class': '', 'id': ''});
        $('body').append($mobile_nav);
        $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
        $('body').append('<div id="mobile-body-overly"></div>');
        $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

        $(document).on('click', '.menu-has-children i', function (e) {
            $(this).next().toggleClass('menu-item-active');
            $(this).nextAll('ul').eq(0).slideToggle();
            $(this).toggleClass("fa-chevron-up fa-chevron-down");
        });

        $(document).on('click', '#mobile-nav-toggle', function (e) {
            $('body').toggleClass('mobile-nav-active');
            $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
            $('#mobile-body-overly').toggle();
        });

        $(document).click(function (e) {
            var container = $("#mobile-nav, #mobile-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
                    $('#mobile-body-overly').fadeOut();
                }
            }
        });
    } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
        $("#mobile-nav, #mobile-nav-toggle").hide();
    }
    
    
    // Smooth scrolling on the navbar links
    $(".nav-menu a, #mobile-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top
            }, 1500, 'easeInOutExpo');
            
            if ($(this).parents('.nav-menu').length) {
                $('.nav-menu .menu-active').removeClass('menu-active');
                $(this).closest('li').addClass('menu-active');
            }
        }
    });


    // Stick the header at top on scroll
    $(".header").sticky({topSpacing: 0, zIndex: '50'});


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Skills section
    $('.skills').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // jQuery counterUp
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 1000
    });


    // Porfolio isotope and filter
    $(document).ready(function () {
        var $portfolioContainer = $('.portfolio-container');
    
        $portfolioContainer.isotope({
            filter: '.web-dev', // Default filter to web development
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows'
        });
    
        $('#portfolio-flters li').on('click', function () {
            $('#portfolio-flters li').removeClass('filter-active');
            $(this).addClass('filter-active');
    
            var filterValue = $(this).attr('data-filter');
            $portfolioContainer.isotope({ filter: filterValue });
        });
    });


    // Testimonials carousel
    $(".testimonials-carousel").owlCarousel({
        autoplay: true,
        dots: true,
        loop: true,
        items: 1
    });

    // Update the footer with the current year
    function updateFooterYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // Call the function to update the year
    updateFooterYear();

    // Portfolio isotope, sorting, and pagination
    var itemsPerPage = 9;
    var allData = [];
    var filteredData = [];
    var currentSort = "dateAdded";

    // Render portfolio items
    function renderPage(page, dataArray) {
        var start = (page - 1) * itemsPerPage;
        var end = start + itemsPerPage;
        var itemsToShow = dataArray.slice(start, end);
        var $container = $('.portfolio-container');
        $container.empty();

        $.each(itemsToShow, function (index, item) {
            var html =
                '<div class="col-lg-4 col-md-6 portfolio-item ' + item.category + '">' +
                    '<div class="portfolio-wrap">' +
                        '<figure>' +
                            '<img src="' + item.img + '" class="img-fluid" alt="">' +
                            '<a href="' + item.previewLink + '" data-lightbox="portfolio" data-title="' + item.title + '" class="link-preview" title="Preview"><i class="fa fa-eye"></i></a>' +
                            '<a href="' + item.detailsLink + '" class="link-details" title="More Details"><i class="fa fa-link"></i></a>' +
                            '<h4 class="portfolio-title">' + item.title + ' <span>' + item.type + '</span></h4>' +
                        '</figure>' +
                    '</div>' +
                '</div>';
            $container.append(html);
        });

        $container.isotope('reloadItems').isotope({ sortBy: currentSort });
    }

    // Pagination controls
    function renderPagination(dataArray) {
        var totalPages = Math.ceil(dataArray.length / itemsPerPage);
        var $pagination = $('.pagination');
        $pagination.empty();

        for (var i = 1; i <= totalPages; i++) {
            $('<button class="page-btn">' + i + '</button>')
                .on('click', function () {
                    renderPage(parseInt($(this).text()), filteredData);
                })
                .appendTo($pagination);
        }
    }

    // Sort data
    function sortData(sortBy) {
        currentSort = sortBy;
        filteredData.sort(function (a, b) {
            if (sortBy === "name") return a.title.localeCompare(b.title);
            if (sortBy === "type") return a.type.localeCompare(b.type);
            return new Date(b.dateAdded) - new Date(a.dateAdded);
        });
        renderPage(1, filteredData);
    }

    // Load data
    $.getJSON('portfolio-data.json', function (data) {
        allData = data;
        filteredData = allData;
        renderPage(1, filteredData);
        renderPagination(filteredData);
    });

    // Category filtering
    $('#portfolio-flters li').on('click', function () {
        $('#portfolio-flters li').removeClass('filter-active');
        $(this).addClass('filter-active');
        var filterValue = $(this).attr('data-filter');
        filteredData = (filterValue === '*') ? allData : allData.filter(item => item.category === filterValue.substring(1));
        sortData(currentSort);
        renderPagination(filteredData);
    });

    // Sorting option
    $('#sort-options').on('change', function () {
        sortData($(this).val());
    });

    // Initialize Isotope container
    $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });

})(jQuery);

