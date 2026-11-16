// Bootstrap form validation
(function () {
  'use strict'
  var forms = document.querySelectorAll('.needs-validation')
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        } else {
          event.preventDefault();
          alert("Thank you for contacting me!");
          form.reset();
        }
        form.classList.add('was-validated')
      }, false)
    })
})();

    // JavaScript to ensure only one video plays at a time
    const videos = document.querySelectorAll('video');

    videos.forEach((video) => {
      video.addEventListener('play', () => {
        // Pause all other videos
        videos.forEach((otherVideo) => {
          if (otherVideo !== video) {
            otherVideo.pause();
          }
        });
      });
    });

// DOM ready extras: typing effect, reveal-on-scroll, animated skill bars
document.addEventListener('DOMContentLoaded', () => {
  // Typing effect simple implementation
  const typingEl = document.querySelector('.typing');
  if (typingEl) {
    const wordsAttr = typingEl.getAttribute('data-words');
    try {
      const words = JSON.parse(wordsAttr);
      let idx = 0;
      let char = 0;
      let deleting = false;
      const typeSpeed = 80;

      function tick() {
        const current = words[idx % words.length];
        if (!deleting) {
          typingEl.textContent = current.slice(0, char + 1);
          char++;
          if (char === current.length) {
            deleting = true;
            setTimeout(tick, 900);
            return;
          }
        } else {
          typingEl.textContent = current.slice(0, char - 1);
          char--;
          if (char === 0) {
            deleting = false;
            idx++;
          }
        }
        setTimeout(tick, deleting ? typeSpeed / 2 : typeSpeed);
      }

      tick();
    } catch (e) {
      // ignore
    }
  }

  const revealGroups = [
    '#about .about-layout > *',
    '#projects .projects-heading',
    '#projects .project-filters',
    '#education .journey-panel-heading',
    '#education .journey-card',
    '#education .certificate-card',
    '#skills .skills-title',
    '#skills .skills-grid > *',
    '#blog .blog-heading',
    '#blog .blog-more-link',
    '#video .video-showcase-heading',
    '#video .video-item',
    '#contact .container > *'
  ];

  revealGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add('reveal');
      element.style.setProperty('--reveal-delay', `${Math.min(index, 3) * 90}ms`);
    });
  });

  // Reveal section content as it enters the viewport.
  const revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealables.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealables.forEach(el => io.observe(el));
  } else {
    // fallback: show all
    revealables.forEach(el => el.classList.add('show'));
  }

  // Animate skills progress bars when in view
  const progressBars = document.querySelectorAll('.progress-bar[data-target]');
  if ('IntersectionObserver' in window && progressBars.length) {
    const pbObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const target = parseInt(bar.getAttribute('data-target'), 10) || parseInt(bar.getAttribute('aria-valuenow'), 10) || 0;
          // animate the bar
          bar.style.width = target + '%';
          bar.setAttribute('aria-valuenow', target);
          bar.textContent = `${target}%`;
          pbObserver.unobserve(bar);
          console.debug('Progress bar animated:', bar.id || '(no id)', target);
        }
      });
    }, { threshold: 0.25 });

    // helper to check if element is already visible enough
    function isVisibleEnough(el, threshold) {
      const rect = el.getBoundingClientRect();
      const viewHeight = window.innerHeight || document.documentElement.clientHeight;
      // visible if top is before bottom of viewport and at least threshold portion is within
      const visibleHeight = Math.min(rect.bottom, viewHeight) - Math.max(rect.top, 0);
      return visibleHeight > 0 && (visibleHeight / rect.height) >= threshold;
    }

    // Observe or animate immediately if already visible
    progressBars.forEach(bar => {
      try {
        if (isVisibleEnough(bar, 0.25)) {
          const target = parseInt(bar.getAttribute('data-target'), 10) || parseInt(bar.getAttribute('aria-valuenow'), 10) || 0;
          bar.style.width = target + '%';
          bar.setAttribute('aria-valuenow', target);
          bar.textContent = `${target}%`;
          console.debug('Progress bar animated immediately:', bar.id || '(no id)', target);
        } else {
          pbObserver.observe(bar);
        }
      } catch (err) {
        console.error('Error animating progress bar', err);
      }
    });
  } else {
    // Fallback: set widths immediately
    progressBars.forEach(p => {
      const t = parseInt(p.getAttribute('data-target'), 10) || parseInt(p.getAttribute('aria-valuenow'), 10) || 0;
      p.style.width = t + '%';
      p.setAttribute('aria-valuenow', t);
      p.textContent = `${t}%`;
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('site_theme');
  const initialTheme = savedTheme === 'light' ? 'light' : 'dark';

  function setTheme(theme) {
    const isLight = theme === 'light';
    document.body.dataset.theme = theme;
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} theme`);
      themeToggle.title = `Switch to ${isLight ? 'dark' : 'light'} theme`;
      themeToggle.innerHTML = `<i class="bi ${isLight ? 'bi-moon-fill' : 'bi-sun-fill'}" aria-hidden="true"></i>`;
    }
    localStorage.setItem('site_theme', theme);
  }

  setTheme(initialTheme);
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTheme(document.body.dataset.theme === 'light' ? 'dark' : 'light');
    });
  }

  const navLinks = [...document.querySelectorAll('.custom-navbar .nav-link[href^="#"]')];
  const navSections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean)
    .sort((a, b) => a.offsetTop - b.offsetTop);

  function updateActiveNav() {
    if (!navSections.length) return;

    const activationLine = window.innerHeight * 0.3;
    let activeSection = navSections[0];

    for (const section of navSections) {
      if (section.getBoundingClientRect().top <= activationLine) {
        activeSection = section;
      } else {
        break;
      }
    }

    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      activeSection = navSections[navSections.length - 1];
    }

    navLinks.forEach((link) => {
      const isActive = link.hash === `#${activeSection.id}`;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  let navUpdateScheduled = false;
  function scheduleActiveNavUpdate() {
    if (navUpdateScheduled) return;
    navUpdateScheduled = true;
    window.requestAnimationFrame(() => {
      navUpdateScheduled = false;
      updateActiveNav();
    });
  }

  updateActiveNav();
  window.addEventListener('scroll', scheduleActiveNavUpdate, { passive: true });
  window.addEventListener('resize', scheduleActiveNavUpdate);
  window.addEventListener('hashchange', scheduleActiveNavUpdate);

  const projectFilters = document.querySelectorAll('[data-project-filter]');
  const projects = document.querySelectorAll('.project-entry[data-category]');

  projectFilters.forEach((filter) => {
    filter.addEventListener('click', () => {
      const selectedCategory = filter.dataset.projectFilter;

      projectFilters.forEach((button) => {
        const isSelected = button === filter;
        button.classList.toggle('is-active', isSelected);
        button.setAttribute('aria-pressed', String(isSelected));
      });

      projects.forEach((project) => {
        project.hidden = selectedCategory !== 'all' && project.dataset.category !== selectedCategory;
      });
    });
  });

  const blogFilters = document.querySelectorAll('[data-blog-filter]');
  const blogPosts = document.querySelectorAll('.blog-card[data-blog-category]');

  blogFilters.forEach((filter) => {
    filter.addEventListener('click', () => {
      const selectedCategory = filter.dataset.blogFilter;

      blogFilters.forEach((button) => {
        const isSelected = button === filter;
        button.classList.toggle('is-active', isSelected);
        button.setAttribute('aria-pressed', String(isSelected));
      });

      blogPosts.forEach((post) => {
        post.hidden = selectedCategory !== 'all' && post.dataset.blogCategory !== selectedCategory;
      });
    });
  });

});

// Diagnostic summary to help debug runtime issues — view in browser console
(function runtimeDiagnostics() {
  try {
    const projectCount = document.querySelectorAll('.project-entry').length;
    const themeToggle = !!document.getElementById('theme-toggle');
    const progressBars = document.querySelectorAll('.progress-bar[data-target]').length;
    const revealCount = document.querySelectorAll('.reveal').length;
    const cvLink = !!document.getElementById('cv-download');
    const siteTheme = localStorage.getItem('site_theme') || 'dark';
    console.info('Diagnostics: projects=%d, themeToggle=%s, progressBars=%d, revealItems=%d, cvLink=%s, site_theme=%s',
      projectCount, themeToggle, progressBars, revealCount, cvLink, siteTheme);
  } catch (e) {
    console.error('Diagnostics failed', e);
  }
})();