// script.js (ES6)
// Handles: nav resizing + progress indicator + active link highlight + carousel + modals + small interactions

document.addEventListener('DOMContentLoaded', () => {
    // elements

    const nav = document.querySelector('.navbar');
    const navProgress = document.getElementById('navProgress').querySelector('span');
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const sections = navLinks.map(a => document.getElementById(a.dataset.target)).filter(sec => sec!== null);
    const yearSpan = document.getElementById('year');
    yearSpan.textContent = new Date().getFullYear();
  
    // 1) NAVBAR RESIZE on scroll + progress bar
    const NAV_TOP_HEIGHT = 92;
    const NAV_SMALL_HEIGHT = 60;
    window.addEventListener('scroll', () => {
      // nav resize
      if (window.scrollY > 20) nav.classList.add('small'); else nav.classList.remove('small');
  
      // progress indicator width
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / Math.max(docHeight, 1)) * 100;
      navProgress.style.width = `${Math.min(Math.max(scrolled, 0), 100)}%`;
  
      // active link highlight logic:
      // We want to highlight the section just under the bottom of the navigation bar
      const navRect = nav.getBoundingClientRect();
      const navBottomY = navRect.bottom + window.scrollY + 1; // bottom edge in page coords
      let activeIndex = 0;
      sections.forEach((sec, i) => {
        const rect = sec.getBoundingClientRect();
        const topY = rect.top + window.scrollY;
        const bottomY = rect.bottom + window.scrollY;
        // If the top of section is at or above navBottomY and its bottom is below navBottomY, it's under the nav bottom
        if (topY <= navBottomY && bottomY >= navBottomY) {
          activeIndex = i;
        }
        // If at the very bottom of the page, ensure last menu item highlighted
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 2) {
          activeIndex = sections.length - 1;
        }
      });
      navLinks.forEach((a, i) => {
        if (i === activeIndex) a.classList.add('active'); else a.classList.remove('active');
      });
    }, { passive: true });
  
    // trigger initial scroll handler
    window.dispatchEvent(new Event('scroll'));
  
    // 2) Smooth scrolling for nav links (CSS already sets smooth)
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(link.dataset.target);
        if (!target) return;
        // compute offset to account for sticky nav height
        const navHeight = nav.getBoundingClientRect().height;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 6;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  
    // 3) Carousel basic functionality
    const track = document.getElementById('carouselTrack');
    const slides = Array.from(track.querySelectorAll('.slide'));
    const leftBtn = document.querySelector('.carousel-arrow.left');
    const rightBtn = document.querySelector('.carousel-arrow.right');
    let index = 0;
    const updateCarousel = () => {
      const width = track.getBoundingClientRect().width;
      track.style.transform = `translateX(-${index * width}px)`;
    };
    window.addEventListener('resize', updateCarousel);
    updateCarousel();
    leftBtn.addEventListener('click', () => { index = (index - 1 + slides.length) % slides.length; updateCarousel(); });
    rightBtn.addEventListener('click', () => { index = (index + 1) % slides.length; updateCarousel(); });
  
    // autoplay carousel with pause on hover
    let autoplay = setInterval(() => { index = (index + 1) % slides.length; updateCarousel(); }, 4000);
    document.getElementById('carousel').addEventListener('mouseenter', () => clearInterval(autoplay));
    document.getElementById('carousel').addEventListener('mouseleave', () => {
      autoplay = setInterval(() => { index = (index + 1) % slides.length; updateCarousel(); }, 4000);
    });
  
    // 4) Modal management
    const modalBackdrop = document.getElementById('modalBackdrop');
    const openButtons = Array.from(document.querySelectorAll('[data-modal-open]'));
    const closeButtons = Array.from(document.querySelectorAll('[data-modal-close]'));
  
    function openModal(id) {
      modalBackdrop.classList.add('open');
      const modal = document.getElementById(id);
      document.querySelectorAll('.modal').forEach(m => m.setAttribute('aria-hidden','true'));
      modal.setAttribute('aria-hidden','false');
      modal.classList.add('open');
      modalBackdrop.setAttribute('aria-hidden', 'false');
      // trap focus for accessibility could be added
    }
    function closeModal() {
      modalBackdrop.classList.remove('open');
      document.querySelectorAll('.modal').forEach(m => { m.setAttribute('aria-hidden','true'); m.classList.remove('open'); });
      modalBackdrop.setAttribute('aria-hidden', 'true');
    }
  
    openButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.modalOpen;
        openModal(id);
      });
    });
    closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  
    // 5) Newsletter form simple handling
    const newsletter = document.getElementById('newsletterForm');
    if (newsletter) {
      newsletter.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thanks! (Subscription simulated.)');
        newsletter.reset();
      });
    }
  
    // 6) Reservation form handling
    const resForm = document.getElementById('reservationForm');
    if (resForm) {
      resForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Reservation request sent (simulated).');
        closeModal();
      });
    }
  });
  