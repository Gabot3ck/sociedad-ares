// === NAVBAR CONTROLLER CLASS ===
class PureNavbarController {
  constructor() {
    this.navbar = document.querySelector(".wrapper-section");
    this.navLinks = document.querySelectorAll(".nav-link:not(.external-link)");
    this.sections = document.querySelectorAll("section[id]");
    this.indicator = document.querySelector(".nav-indicator");
    this.navbarToggle = document.getElementById("navbarToggle");
    this.navbarNav = document.getElementById("navbarNav");
    this.isScrolling = false;
    this.currentSection = "inicio";

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupScrollDetection();
    this.setupSmoothScrolling();
    this.setupMobileMenu();
    this.setupScrollAnimations();
    this.updateActiveSection();
    this.moveIndicator(document.querySelector(".nav-link.active"));
  }

  setupEventListeners() {
    // Resize handler
    window.addEventListener(
      "resize",
      this.debounce(() => {
        this.updateIndicatorPosition();
      }, 250)
    );

    // Load handler
    window.addEventListener("load", () => {
      this.updateActiveSection();
    });
  }

  setupScrollDetection() {
    let scrollTimeout;
    let ticking = false;

    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Navbar scroll effect
          if (window.scrollY > 50) {
            this.navbar.classList.add("scrolled");
          } else {
            this.navbar.classList.remove("scrolled");
          }

          // Update active section
          if (!this.isScrolling) {
            this.updateActiveSection();
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });
  }

  setupSmoothScrolling() {
    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          this.isScrolling = true;

          // Close mobile menu if open
          this.closeMobileMenu();

          // Smooth scroll to section
          const offsetTop = targetSection.offsetTop - 80;
          this.smoothScrollTo(offsetTop, 800);

          // Update active state immediately for better UX
          this.setActiveLink(targetId);

          // Reset scrolling flag after animation
          setTimeout(() => {
            this.isScrolling = false;
          }, 900);
        }
      });
    });
  }

  smoothScrollTo(target, duration) {
    const start = window.pageYOffset;
    const distance = target - start;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = this.easeInOutQuad(timeElapsed, start, distance, duration);
      window.scrollTo(0, run);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }

  easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  updateActiveSection() {
    let current = "";
    const scrollPos = window.scrollY + 120;

    this.sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    if (current && current !== this.currentSection) {
      this.currentSection = current;
      this.setActiveLink(current);
    }
  }

  setActiveLink(sectionId) {
    this.navLinks.forEach((link) => {
      const isActive = link.getAttribute("data-section") === sectionId;

      if (isActive) {
        link.classList.add("active");
        this.moveIndicator(link);
      } else {
        link.classList.remove("active");
      }
    });
  }

  moveIndicator(activeLink) {
    if (!activeLink || window.innerWidth <= 768) {
      this.indicator.classList.remove("show");
      return;
    }

    const linkRect = activeLink.getBoundingClientRect();
    const navRect = activeLink.closest(".navbar-nav").getBoundingClientRect();

    const left = linkRect.left - navRect.left + linkRect.width / 2 - 20;
    const width = 40;

    this.indicator.style.left = `${left}px`;
    this.indicator.style.width = `${width}px`;
    this.indicator.classList.add("show");
  }

  updateIndicatorPosition() {
    const activeLink = document.querySelector(".nav-link.active");
    if (activeLink) {
      this.moveIndicator(activeLink);
    }
  }

  setupMobileMenu() {
    this.navbarToggle.addEventListener("click", () => {
      this.toggleMobileMenu();
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !this.navbar.contains(e.target) &&
        this.navbarNav.classList.contains("show")
      ) {
        this.closeMobileMenu();
      }
    });

    // Close mobile menu on window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.navbarToggle.classList.toggle("active");

    if (this.navbarNav.classList.contains("show")) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.navbarNav.classList.add("show");
    this.navbarNav.classList.add("animate__animated", "animate__fadeInDown");

    // Remove animation classes after animation
    setTimeout(() => {
      this.navbarNav.classList.remove(
        "animate__animated",
        "animate__fadeInDown"
      );
    }, 600);
  }

  closeMobileMenu() {
    this.navbarToggle.classList.remove("active");
    this.navbarNav.classList.remove("show");
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target.querySelector(".fade-in-up");
        if (entry.isIntersecting) {
          element.classList.add("animate");
          element.classList.add("animate__animated", "animate__fadeInUp");
        }
      });
    }, observerOptions);

    this.sections.forEach((section) => {
      observer.observe(section);
    });
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

class HeroController {
  constructor() {
    this.hero = document.querySelector(".hero");
    this.heroText = document.querySelector(".hero-text");

    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupCTATracking();
  }


  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate__animated", "animate__fadeInUp");
        }
      });
    }, observerOptions);

    // Observar elementos que necesiten animación adicional
    const elementsToObserve = document.querySelectorAll(".hero-badge");
    elementsToObserve.forEach((el) => observer.observe(el));
  }

  setupCTATracking() {
    const ctaButton = document.querySelector(".hero-cta");

    if (ctaButton) {
      ctaButton.addEventListener("click", (e) => {
        // Efecto de ripple
        this.createRippleEffect(e, ctaButton);

        // Pequeño delay para el efecto visual
        setTimeout(() => {
          // El navegador seguirá el enlace normalmente
        }, 150);
      });
    }
  }
}



// === INITIALIZE APP ===
document.addEventListener("DOMContentLoaded", () => {
  // Initialize navbar controller
  new PureNavbarController();

  new HeroController();

  // Remove loading bar after page loads
  setTimeout(() => {
    const loadingBar = document.querySelector(".loading-bar");
    if (loadingBar) {
      loadingBar.remove();
    }
  }, 2000);

  // Add some interactive feedback
  document.querySelectorAll(".external-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      // Add loading effect for external links
      link.style.opacity = "0.7";
      link.style.transform = "scale(0.95)";

      setTimeout(() => {
        link.style.opacity = "";
        link.style.transform = "";
      }, 200);
    });
  });
});

// === PERFORMANCE OPTIMIZATION ===
// Preload critical resources
const preloadLink = document.createElement("link");
preloadLink.rel = "preload";
preloadLink.as = "style";
preloadLink.href =
  "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css";
document.head.appendChild(preloadLink);
