window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');

    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');

    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');

    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function () {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';

            setTimeout(function () {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function (err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function () {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function () {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');

    if (carouselVideos.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });

    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

$(document).ready(function () {
    // Check for click events on the navbar burger icon

    var options = {
        slidesToScroll: 1,
        slidesToShow: 1,
        loop: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
    }

    // Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    bulmaSlider.attach();

    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();

})

// Sticky navigation
const navToggle = document.querySelector('.site-nav-toggle');
const navLinks = document.querySelector('.site-nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
        const isOpen = navLinks.classList.toggle('is-open');

        navToggle.setAttribute(
            'aria-expanded',
            String(isOpen)
        );
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

const navigationLinks = Array.from(
    document.querySelectorAll('.site-nav-links a[href^="#"]')
);

const observedSections = navigationLinks
    .map(function (link) {
        return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

if (
    navigationLinks.length > 0 &&
    observedSections.length > 0 &&
    'IntersectionObserver' in window
) {
    const sectionObserver = new IntersectionObserver(
        function (entries) {
            const visibleEntry = entries
                .filter(function (entry) {
                    return entry.isIntersecting;
                })
                .sort(function (first, second) {
                    return second.intersectionRatio -
                        first.intersectionRatio;
                })[0];

            if (!visibleEntry) {
                return;
            }

            navigationLinks.forEach(function (link) {
                const isActive =
                    link.getAttribute('href') ===
                    '#' + visibleEntry.target.id;

                link.classList.toggle('is-active', isActive);
            });
        },
        {
            rootMargin: '-25% 0px -60% 0px',
            threshold: [0, 0.1, 0.25, 0.5]
        }
    );

    observedSections.forEach(function (section) {
        sectionObserver.observe(section);
    });
}

function updateNavigationAtPageTop() {
    const designSection = document.querySelector(
        '#action-interface-design'
    );

    if (!designSection) {
        return;
    }

    const designTop = designSection.getBoundingClientRect().top;
    const navigationHeight =
        document.querySelector('.site-header')?.offsetHeight || 0;

    if (designTop > navigationHeight + 80) {
        navigationLinks.forEach(function (link) {
            link.classList.remove('is-active');
        });
    }
}

window.addEventListener('scroll', updateNavigationAtPageTop);
window.addEventListener('resize', updateNavigationAtPageTop);

updateNavigationAtPageTop();

// Auto-play cross-scene comparison videos when visible
const comparisonVideos = document.querySelectorAll(
    '.comparison-video-card video'
);

if (
    comparisonVideos.length > 0 &&
    'IntersectionObserver' in window
) {
    const comparisonVideoObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                const video = entry.target;

                if (entry.isIntersecting) {
                    video.play().catch(function () {
                        // Autoplay may be blocked by the browser.
                    });
                } else {
                    video.pause();
                }
            });
        },
        {
            threshold: 0.55
        }
    );

    comparisonVideos.forEach(function (video) {
        comparisonVideoObserver.observe(video);
    });
}