(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-site-header]');

  if (header) {
    let compact = false;
    let ticking = false;

    const setHeaderState = () => {
      const scrollPosition = Math.max(window.scrollY, 0);

      if (!compact && scrollPosition > 96) compact = true;
      if (compact && scrollPosition < 24) compact = false;

      header.classList.toggle('is-compact', compact);
      ticking = false;
    };

    const requestHeaderUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(setHeaderState);
    };

    setHeaderState();
    window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
  }

  const issueSelect = document.querySelector('[data-issue-select]');
  const otherIssue = document.querySelector('[data-other-issue]');

  if (issueSelect && otherIssue) {
    const otherField = otherIssue.closest('.hero-form-other');
    const updateOtherField = () => {
      const isOther = issueSelect.value === 'other';
      otherField.hidden = !isOther;
      otherIssue.required = isOther;
      if (!isOther) otherIssue.value = '';
    };

    issueSelect.addEventListener('change', updateOtherField);
    updateOtherField();
  }

  const lightbox = document.querySelector('.gallery-lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const lightboxCaption = lightbox?.querySelector('figcaption');
  const galleryItems = document.querySelectorAll('[data-gallery-image]');

  if (lightbox && lightboxImage && lightboxCaption) {
    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        lightboxImage.src = item.dataset.galleryImage;
        lightboxImage.alt = item.dataset.galleryAlt || '';
        lightboxCaption.textContent = item.dataset.galleryCaption || '';

        if (typeof lightbox.showModal === 'function') lightbox.showModal();
      });
    });

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) lightbox.close();
    });

    lightbox.addEventListener('close', () => {
      lightboxImage.removeAttribute('src');
      lightboxImage.alt = '';
      lightboxCaption.textContent = '';
    });
  }

  if (reducedMotion || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('has-reveal');
  const targets = document.querySelectorAll(
    '.services-heading, .service, .about-heading, .about-photo, .about-story, .about-facts, .projects-heading, .project, .blog-heading, .post-card, .reviews-heading, .review-card, .footer-main'
  );

  targets.forEach((target, index) => {
    target.classList.add('reveal');
    target.style.setProperty('--reveal-delay', `${Math.min((index % 5) * 65, 260)}ms`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  targets.forEach((target) => observer.observe(target));
})();
