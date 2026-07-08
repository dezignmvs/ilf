document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. SCROLL HEADER CLASS
  // ==========================================================================
  const header = document.getElementById('header');
  const navMenu = document.getElementById('nav-menu');
  
  let lastScrollY = window.scrollY;
  
  const handleHeaderScroll = () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll direction (only if mobile menu is closed)
    const isMenuOpen = navMenu && navMenu.classList.contains('active');
    if (!isMenuOpen) {
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.classList.add('header-hidden');
      } else if (currentScrollY < lastScrollY) {
        header.classList.remove('header-hidden');
      }
    }
    
    // Always show header at the top of the page
    if (currentScrollY <= 10) {
      header.classList.remove('header-hidden');
    }
    
    lastScrollY = currentScrollY;
  };
  
  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll(); // Init status on load

  // ==========================================================================
  // 2. NAVIGATION TOGGLE (MOBILE DRAWER / DESKTOP HIDE)
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const toggleIcon = document.getElementById('toggle-icon');
  const logoImg = document.getElementById('logo-img');
  
  if (mobileToggle && navMenu) {
    // Dynamically toggle toggleIcon and logoImg based on navigation visibility
    const updateHeaderState = () => {
      const isMobile = window.innerWidth <= 768;
      if (!toggleIcon || !logoImg) return;

      if (isMobile) {
        // Mobile: links are shown if navMenu is active
        if (navMenu.classList.contains('active')) {
          header.classList.remove('nav-hidden');
        } else {
          header.classList.add('nav-hidden');
        }
        
        // Use dark assets on the white header background on mobile
        toggleIcon.src = 'files/5rec-bw.png';
        logoImg.src = 'files/logo-black.png';
      } else {
        // Desktop
        if (header.classList.contains('nav-hidden')) {
          // Nav is hidden, so header is transparent/white on desktop
          toggleIcon.src = 'files/5rec-bw.png';
          logoImg.src = 'files/logo-black.png';
        } else {
          // Nav is visible, so header is the blue pill on desktop
          toggleIcon.src = 'files/5rec.png';
          logoImg.src = 'files/logo.png';
        }
      }
    };

    const toggleMenu = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        const nextState = !isExpanded;
        mobileToggle.setAttribute('aria-expanded', nextState);
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Disable body scroll when full-screen menu is open
        if (nextState) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      } else {
        // Desktop toggle
        header.classList.toggle('nav-hidden');
      }
      updateHeaderState();
    };

    const closeMenu = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        updateHeaderState();
      }
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking nav links (except dropdown toggle)
    navLinks.forEach(link => {
      if (!link.classList.contains('dropdown-toggle')) {
        link.addEventListener('click', closeMenu);
      }
    });

    // Close menu when clicking dropdown items (e.g. Committee)
    document.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (navMenu.classList.contains('active') && 
          !navMenu.contains(event.target) && 
          !mobileToggle.contains(event.target)) {
        closeMenu();
      }
    });

    // Run initial state setup
    updateHeaderState();

    // Listen to resize to keep states consistent
    window.addEventListener('resize', updateHeaderState);
  }

  // ==========================================================================
  // 3. SMOOTH SCROLL WITH OFFSET FOR HEADER
  // ==========================================================================
  const headerHeight = header ? header.offsetHeight : 70;
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Calculate offset position (element top minus header height & margin)
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerHeight - 20;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================================================
  // 4. ACTIVE LINK HIGHLIGHTER ON SCROLL
  // ==========================================================================
  const sections = document.querySelectorAll('section');
  
  const highlightNavigation = () => {
    let scrollPosition = window.scrollY + headerHeight + 100; // Add threshold
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (sectionId && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          const href = link.getAttribute('href');
          if (href === `#${sectionId}` || href.endsWith(`#${sectionId}`)) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  // Optimize scroll tracking using requestAnimationFrame
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        highlightNavigation();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Highlight on page load
  highlightNavigation();

  // Toggle mobile dropdown on click (support multiple toggles if present)
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        e.preventDefault(); // Prevent navigating to hash link
        const parent = toggle.closest('.nav-item-dropdown');
        if (parent) {
          parent.classList.toggle('active');
          const arrow = toggle.querySelector('.nav-arrow');
          if (arrow) {
            if (parent.classList.contains('active')) {
              arrow.style.transform = 'rotate(180deg)';
            } else {
              arrow.style.transform = 'none';
            }
          }
        }
      }
    });
  });

  // ==========================================================================
  // 5. NEWS & EVENTS CAROUSEL SLIDER
  // ==========================================================================
  const carousel = document.getElementById('news-carousel');
  const prevBtn = document.getElementById('news-prev');
  const nextBtn = document.getElementById('news-next');

  if (carousel && prevBtn && nextBtn) {
    // Dynamic scroll step calculation
    const getScrollStep = () => {
      const firstCard = carousel.querySelector('.news-card');
      if (firstCard) {
        const style = window.getComputedStyle(carousel);
        const gap = parseInt(style.gap) || 24;
        return firstCard.offsetWidth + gap;
      }
      return 364;
    };

    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({
        left: -getScrollStep(),
        behavior: 'smooth'
      });
    });

    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({
        left: getScrollStep(),
        behavior: 'smooth'
      });
    });

    // Control button states based on scroll position
    const updateButtonState = () => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      const isAtStart = carousel.scrollLeft <= 5;
      const isAtEnd = carousel.scrollLeft >= maxScroll - 5;

      prevBtn.style.opacity = isAtStart ? '0.35' : '1';
      prevBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';
      
      nextBtn.style.opacity = isAtEnd ? '0.35' : '1';
      nextBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
    };

    carousel.addEventListener('scroll', updateButtonState);
    window.addEventListener('resize', updateButtonState);
    
    // Initial calculation on load/interaction
    setTimeout(updateButtonState, 150);
  }

  // Handle smooth scroll on load if there's a hash in the URL (e.g. navigation from news page)
  const checkHashAndScroll = () => {
    const hash = window.location.hash;
    if (hash && hash !== '#') {
      try {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          setTimeout(() => {
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerHeight - 20;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }, 150);
        }
      } catch (e) {
        console.error("Invalid hash target selector", e);
      }
    }
  };
  window.addEventListener('load', checkHashAndScroll);
});
