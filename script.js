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
          toggleIcon.src = 'files/5rec.png';
          logoImg.src = 'files/logo.png';
        } else {
          header.classList.add('nav-hidden');
          toggleIcon.src = 'files/5rec-bw.png';
          logoImg.src = 'files/logo-black.png';
        }
      } else {
        // Desktop: links are shown if header is NOT nav-hidden
        if (!header.classList.contains('nav-hidden')) {
          toggleIcon.src = 'files/5rec.png';
          logoImg.src = 'files/logo.png';
        } else {
          toggleIcon.src = 'files/5rec-bw.png';
          logoImg.src = 'files/logo-black.png';
        }
      }
    };

    const toggleMenu = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', !isExpanded);
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
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

    // Close menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
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
          if (link.getAttribute('href') === `#${sectionId}`) {
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
});
