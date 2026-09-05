/**
 * Healthcare Modern Website - Unified JavaScript
 * Production Frontend Interactivity
 */

/* ==========================================================================
   1. GLOBAL MOBILE MENU TOGGLE
   ========================================================================== */
let toggleMenu = () => {
    jQuery('.mobinav').toggleClass('open');
    jQuery('.mobinav-backdrop').toggleClass('active');
    
    const isOpen = jQuery('.mobinav').hasClass('open');
    jQuery('.showhide, .mobileMenuToggle').attr('aria-expanded', isOpen);
    
    if (isOpen) {
        jQuery('body').css('overflow', 'hidden');
    } else {
        jQuery('body').css('overflow', '');
    }
};

/* ==========================================================================
   2. STICKY HEADER NAVIGATION
   ========================================================================== */
let stickyNav = () => {
    if (jQuery(window).scrollTop() > 10) {
        jQuery('.head-sec').addClass("f-nav");
    } else {
        jQuery('.head-sec').removeClass("f-nav");
    }
};

/* ==========================================================================
   3. SWIPER CUSTOM SLIDE CLASSES
   ========================================================================== */
function setSlideClasses(swiper) {
    if (!swiper || !swiper.slides) return;
    const slides = swiper.slides;
    const total = slides.length;

    slides.forEach(slide => {
        slide.classList.remove(
            'slide-prev-2',
            'slide-prev-3',
            'slide-next-2',
            'slide-next-3'
        );
    });

    let active = swiper.activeIndex;
    let prev2 = (active - 2 + total) % total;
    let prev3 = (active - 3 + total) % total;
    let next2 = (active + 2) % total;
    let next3 = (active + 3) % total;

    if (slides[prev2]) slides[prev2].classList.add('slide-prev-2');
    if (slides[prev3]) slides[prev3].classList.add('slide-prev-3');
    if (slides[next2]) slides[next2].classList.add('slide-next-2');
    if (slides[next3]) slides[next3].classList.add('slide-next-3');
}

/* ==========================================================================
   4. SERVICES MOBILE OWL CAROUSEL
   ========================================================================== */
function mobilesliders() {
    if (jQuery('.practice-blocks').length === 0) return;

    if (jQuery(window).width() <= 991) {
        if (!jQuery('.practice-blocks').hasClass('owl-loaded')) {
            jQuery('.practice-blocks')
                .addClass('owl-carousel')
                .owlCarousel({
                    loop: true,
                    autoplay: true,
                    autoplayTimeout: 3500,
                    autoplayHoverPause: true,
                    touchDrag: true,
                    items: 1,
                    mouseDrag: true,
                    nav: true,
                    navText: ['←', '→'],
                    dots: false
                });
        }
    } else {
        if (jQuery('.practice-blocks').hasClass('owl-loaded')) {
            jQuery('.practice-blocks')
                .trigger('destroy.owl.carousel')
                .removeClass('owl-carousel');
        }
    }
}

/* ==========================================================================
   5. DOCUMENT READY INITIALIZATION
   ========================================================================== */
jQuery(document).ready(function () {

    // --- Sticky Nav Initial & Listener ---
    stickyNav();
    jQuery(window).scroll(function () {
        stickyNav();
        checkCounters();
        toggleBackToTop();
    });

    // --- Mobile Submenu Handler ---
    if (!jQuery('.mobinav .menu-item-has-children span.drop').length) {
        jQuery('.mobinav .menu-item-has-children')
            .append('<span class="drop close"></span>');
    }
    jQuery('.mobinav .menu-item-has-children ul.sub-menu')
        .hide();

    jQuery(document).delegate(
        ".mobinav .menu-item-has-children span.drop",
        "click",
        function () {
            jQuery(this)
                .siblings('.sub-menu')
                .slideToggle('slow');

            jQuery(this)
                .parent('li')
                .siblings('li')
                .find('.drop')
                .addClass('close')
                .removeClass('open');

            jQuery(this)
                .parent('li')
                .siblings('li')
                .find('.sub-menu')
                .slideUp('slow');

            if (jQuery(this).hasClass('close')) {
                jQuery(this)
                    .addClass('open')
                    .removeClass('close');
            } else {
                jQuery(this)
                    .addClass('close')
                    .removeClass('open');
            }
        }
    );

    // --- Backdrop click closes mobile nav ---
    jQuery(document).on('click', '.mobinav-backdrop', function () {
        toggleMenu();
    });

    // --- Testimonial Slider (Owl Carousel) ---
    if (jQuery('.testi-blck').length && typeof jQuery.fn.owlCarousel !== 'undefined') {
        jQuery('.testi-blck').owlCarousel({
            loop: true,
            touchDrag: true,
            mouseDrag: true,
            nav: true,
            navText: ['←', '→'],
            dots: false,
            autoplayHoverPause: true,
            items: 1,
            margin: 0,
            autoplay: true,
            autoplayTimeout: 5000
        });
    }

    // --- Services Mobile Slider ---
    mobilesliders();
    jQuery(window).resize(function () {
        mobilesliders();
    });

    // --- Doctors Slider (Swiper) ---
    if (jQuery('.slider.doctors-slider').length && typeof Swiper !== 'undefined') {
        const slider = new Swiper('.slider', {
            loop: true,
            speed: 500,
            centeredSlides: false,
            slidesPerView: 4,
            spaceBetween: 60,
            navigation: {
                prevEl: '.button-prev',
                nextEl: '.button-next'
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                    spaceBetween: 10
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 24
                },
                1200: {
                    slidesPerView: 4,
                    spaceBetween: 30
                },
                1500: {
                    slidesPerView: 4,
                    spaceBetween: 60
                }
            },
            on: {
                init: function () {
                    setSlideClasses(this);
                },
                slideChange: function () {
                    setSlideClasses(this);
                }
            }
        });
    }

    // --- Doctor Specialty Filter (doctors.html) ---
    jQuery('.doctor-filter-bar .filter-btn').on('click', function () {
        jQuery('.doctor-filter-bar .filter-btn').removeClass('active');
        jQuery(this).addClass('active');

        const filterValue = jQuery(this).data('filter');

        if (filterValue === 'all') {
            jQuery('.doctor-item').fadeIn(300).removeClass('hidden');
        } else {
            jQuery('.doctor-item').each(function () {
                const category = jQuery(this).data('category');
                if (category === filterValue) {
                    jQuery(this).fadeIn(300).removeClass('hidden');
                } else {
                    jQuery(this).fadeOut(200).addClass('hidden');
                }
            });
        }
    });

    // --- Appointment Form Validation & Confirmation ---
    jQuery('#appointmentForm').on('submit', function (e) {
        e.preventDefault();

        let valid = true;
        const form = jQuery(this);

        form.find('input[required], select[required]').each(function () {
            if (!jQuery(this).val()) {
                valid = false;
                jQuery(this).css('border-color', '#ef4444');
            } else {
                jQuery(this).css('border-color', '#e2e8f0');
            }
        });

        if (valid) {
            form.slideUp(300, function () {
                jQuery('#appointmentSuccessBanner').addClass('visible').slideDown(400);
            });
        }
    });

    // --- Contact Form Validation & Confirmation ---
    jQuery('#contactForm').on('submit', function (e) {
        e.preventDefault();
        let valid = true;
        const form = jQuery(this);

        form.find('input[required], textarea[required]').each(function () {
            if (!jQuery(this).val()) {
                valid = false;
                jQuery(this).css('border-color', '#ef4444');
            } else {
                jQuery(this).css('border-color', '#e2e8f0');
            }
        });

        if (valid) {
            form.slideUp(300, function () {
                jQuery('#contactSuccessBanner').show().slideDown(400);
            });
        }
    });

    // --- Newsletter Form Validation ---
    jQuery('.newsletter-form').on('submit', function (e) {
        e.preventDefault();
        const input = jQuery(this).find('input[type="email"]');
        const email = input.val().trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let msg = jQuery(this).find('.newsletter-msg');
        if (!msg.length) {
            jQuery(this).append('<div class="newsletter-msg"></div>');
            msg = jQuery(this).find('.newsletter-msg');
        }

        if (regex.test(email)) {
            msg.removeClass('error').addClass('success').text('Thank you for subscribing! Check your inbox soon.');
            input.val('');
            setTimeout(() => { msg.fadeOut(400, () => msg.text('').show()); }, 5000);
        } else {
            msg.removeClass('success').addClass('error').text('Please enter a valid email address.');
        }
    });

    // --- Active Menu Item Highlighting ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    jQuery('.primary-menu a, .footer-menu a').each(function () {
        const href = jQuery(this).attr('href');
        if (href === currentPath) {
            jQuery(this).parent('li').addClass('active');
        }
    });

    // --- Back-to-Top Button Creation & Click ---
    if (!jQuery('.back-to-top').length) {
        jQuery('body').append('<button type="button" class="back-to-top" aria-label="Back to top">↑</button>');
    }

    jQuery(document).on('click', '.back-to-top', function () {
        jQuery('html, body').animate({ scrollTop: 0 }, 500);
    });

    // --- Initial Counter Check ---
    checkCounters();
});

/* ==========================================================================
   6. STATISTIC COUNTER ANIMATION
   ========================================================================== */
let countersAnimated = false;
function checkCounters() {
    if (countersAnimated || !jQuery('.hm-stats').length) return;

    const statsElem = jQuery('.hm-stats');
    const docViewTop = jQuery(window).scrollTop();
    const docViewBottom = docViewTop + jQuery(window).height();
    const elemTop = statsElem.offset().top;

    if (docViewBottom >= elemTop + 50) {
        countersAnimated = true;
        jQuery('.stat-number').each(function () {
            const $this = jQuery(this);
            const countTo = parseInt($this.data('count'), 10);
            const suffix = $this.data('suffix') || '';

            jQuery({ countNum: 0 }).animate({
                countNum: countTo
            }, {
                duration: 2000,
                easing: 'swing',
                step: function () {
                    $this.text(Math.floor(this.countNum) + suffix);
                },
                complete: function () {
                    $this.text(this.countNum + suffix);
                }
            });
        });
    }
}

/* ==========================================================================
   7. BACK TO TOP TOGGLE
   ========================================================================== */
function toggleBackToTop() {
    if (jQuery(window).scrollTop() > 400) {
        jQuery('.back-to-top').addClass('show');
    } else {
        jQuery('.back-to-top').removeClass('show');
    }
}

/* =========================================================
   FAQ ACCORDION - SINGLE VERSION
   ========================================================= */

jQuery(function ($) {

    $('.accordion-section-title').on('click', function (e) {
        e.preventDefault();

        var $this = $(this);
        var $section = $this.closest('.accordion-section');
        var $content = $section.find('.accordion-section-content').first();

        // Close if currently open
        if ($this.hasClass('active')) {

            $this.removeClass('active');

            $content
                .stop(true, true)
                .slideUp(300)
                .removeClass('open');

        } else {

            // Close every other FAQ
            $('.accordion-section-title')
                .removeClass('active');

            $('.accordion-section-content')
                .stop(true, true)
                .slideUp(300)
                .removeClass('open');

            // Open clicked FAQ
            $this.addClass('active');

            $content
                .stop(true, true)
                .slideDown(300)
                .addClass('open');
        }
    });

    // First FAQ open by default
    $('.accordion-section:first-child')
        .find('.accordion-section-title')
        .addClass('active');

    $('.accordion-section:first-child')
        .find('.accordion-section-content')
        .first()
        .show()
        .addClass('open');

});
