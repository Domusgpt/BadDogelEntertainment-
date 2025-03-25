/**
 * article-transitions.js
 * 
 * Implements sophisticated transitions and scroll-based effects
 * for article pages to enhance the reading experience.
 * 
 * Features:
 * 1. Reading progress indicator
 * 2. Parallax effects for header and images
 * 3. Progressive content reveal
 * 4. Smooth scroll handling
 * 5. Tableaux-based animations on scroll position
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all article transition components
  initReadingProgress();
  initParallaxEffects();
  initScrollReveal();
  initSmoothScrolling();
  initTableauxAnimations();
  initStickyElements();
  initRelatedContentTransitions();
});

/**
 * Reading Progress Indicator
 * Creates and manages a progress bar showing reading position
 * - Lines 25-79
 */
function initReadingProgress() {
  // Check if we're on an article page
  const articleContent = document.querySelector('.article-content');
  if (!articleContent) return;
  
  // Create progress indicator if it doesn't exist
  let progressBar = document.querySelector('.reading-progress');
  
  if (!progressBar) {
    // Create progress container
    const progressContainer = document.createElement('div');
    progressContainer.className = 'reading-progress-container';
    
    // Create actual progress bar
    progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    
    // Append to container
    progressContainer.appendChild(progressBar);
    
    // Add to document
    document.body.appendChild(progressContainer);
  }
  
  // Calculate and update reading progress on scroll
  window.addEventListener('scroll', () => {
    // Get required measurements
    const windowHeight = window.innerHeight;
    const documentHeight = articleContent.offsetHeight;
    const scrollTop = window.scrollY;
    const contentTop = getOffsetTop(articleContent);
    const contentBottom = contentTop + documentHeight;
    
    // Calculate progress percentage
    let progress = 0;
    
    // Only calculate progress when we've reached the article content
    if (scrollTop >= contentTop) {
      // Calculate how much of the content has been scrolled
      const scrollPosition = scrollTop - contentTop;
      const visibleContentHeight = documentHeight - windowHeight;
      
      if (visibleContentHeight > 0) {
        // Calculate progress as percentage of content scrolled
        progress = Math.min(scrollPosition / visibleContentHeight, 1);
      }
    }
    
    // Apply progress to progress bar with transition
    progressBar.style.transform = `scaleX(${progress})`;
    
    // Update data attribute for potential CSS styling
    progressBar.setAttribute('data-progress', Math.round(progress * 100));
    
    // Add class when complete
    if (progress >= 0.99) {
      progressBar.classList.add('completed');
    } else {
      progressBar.classList.remove('completed');
    }
  });
}

/**
 * Helper function to get element's offset from top of document
 * Accounts for nested offsets more reliably than offsetTop
 * @param {HTMLElement} element - Element to get offset for
 * @return {number} - Pixel offset from top of document
 * - Lines 85-98
 */
function getOffsetTop(element) {
  let offsetTop = 0;
  
  while(element) {
    offsetTop += element.offsetTop;
    element = element.offsetParent;
  }
  
  return offsetTop;
}

/**
 * Parallax Effects
 * Creates depth through differential scrolling of elements
 * - Lines 103-149
 */
function initParallaxEffects() {
  // Select elements that should have parallax effect
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (parallaxElements.length === 0) return;
  
  // Banner image special handling
  const heroBanner = document.querySelector('.article-hero');
  if (heroBanner) {
    // Add parallax attribute if not already present
    if (!heroBanner.hasAttribute('data-parallax')) {
      heroBanner.setAttribute('data-parallax', '0.3');
    }
    
    // Add to parallax elements if not already included
    if (!parallaxElements.includes(heroBanner)) {
      parallaxElements.push(heroBanner);
    }
  }
  
  // Function to update parallax positions
  const updateParallax = () => {
    const scrollTop = window.pageYOffset;
    
    parallaxElements.forEach(element => {
      // Get parallax speed factor from data attribute
      const speed = parseFloat(element.getAttribute('data-parallax')) || 0.2;
      
      // Skip if element is not yet in view
      if (isElementInView(element)) {
        // Calculate parallax offset
        const offset = scrollTop * speed;
        
        // Apply transform
        element.style.transform = `translateY(${offset}px)`;
        
        // Adjust opacity for header banner (fade out as user scrolls)
        if (element === heroBanner) {
          // Calculate distance scrolled into the banner
          const elementHeight = element.offsetHeight;
          const scrollProgress = Math.min(scrollTop / elementHeight, 1);
          
          // Apply fade effect to banner contents
          const bannerContent = element.querySelector('.hero-content');
          if (bannerContent) {
            bannerContent.style.opacity = 1 - scrollProgress * 1.5;
          }
        }
      }
    });
  };
  
  // Update on scroll
  window.addEventListener('scroll', updateParallax);
  
  // Initial update
  updateParallax();
}

/**
 * Progressive Content Reveal
 * Reveals content elements as user scrolls down
 * - Lines 154-202
 */
function initScrollReveal() {
  // Select all elements to be revealed on scroll
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length === 0) return;
  
  // Add reveal classes to article content elements if not already tagged
  const articleParagraphs = document.querySelectorAll('.article-content p:not(.lead):not(.reveal-on-scroll)');
  articleParagraphs.forEach((paragraph, index) => {
    // Add reveal class
    paragraph.classList.add('reveal-on-scroll');
    
    // Add sequential delay based on position
    paragraph.style.transitionDelay = `${index * 0.05}s`;
  });
  
  // Same for headings, figures, and blockquotes
  const articleElements = document.querySelectorAll('.article-content h2, .article-content h3, .article-content figure, .article-content blockquote');
  articleElements.forEach(element => {
    if (!element.classList.contains('reveal-on-scroll')) {
      element.classList.add('reveal-on-scroll');
    }
  });
  
  // Reveal function - checks if element is in viewport and reveals it
  const revealOnScroll = () => {
    revealElements.forEach(element => {
      // Calculate element position relative to viewport
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150; // How many pixels from bottom of viewport to trigger reveal
      
      // Reveal element when it comes into view
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('revealed');
      } else {
        // Optionally hide again when scrolling back up
        // element.classList.remove('revealed');
      }
    });
  };
  
  // Listen for scroll events
  window.addEventListener('scroll', revealOnScroll);
  
  // Check positions on page load
  revealOnScroll();
}

/**
 * Smooth Scrolling
 * Implements smooth scrolling to anchors and reader position memory
 * - Lines 207-251
 */
function initSmoothScrolling() {
  // Select all anchor links within the article
  const anchorLinks = document.querySelectorAll('.article-content a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Get the target element
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Get header height for offset
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        
        // Calculate scroll position
        const targetPosition = getOffsetTop(targetElement) - headerHeight - 20;
        
        // Perform smooth scroll
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without refreshing the page
        window.history.pushState(null, null, `#${targetId}`);
      }
    });
  });
  
  // Store scroll position before leaving page
  window.addEventListener('beforeunload', () => {
    // Store current article and scroll position
    const articleId = document.querySelector('.article-content')?.id;
    if (articleId) {
      localStorage.setItem('lastArticleId', articleId);
      localStorage.setItem('lastScrollPosition', window.pageYOffset);
    }
  });
  
  // Restore scroll position when returning to same article
  const storedArticleId = localStorage.getItem('lastArticleId');
  const currentArticleId = document.querySelector('.article-content')?.id;
  
  if (storedArticleId && storedArticleId === currentArticleId) {
    const storedPosition = parseInt(localStorage.getItem('lastScrollPosition'), 10);
    if (!isNaN(storedPosition)) {
      // Restore position with slight delay to ensure page is fully loaded
      setTimeout(() => {
        window.scrollTo(0, storedPosition);
      }, 100);
    }
  }
}

/**
 * Tableaux Animations
 * Creates engaging visual narratives through scroll-driven scene changes
 * Only activates for premium "visual story" articles
 * - Lines 256-324
 */
function initTableauxAnimations() {
  // Check if current article has tableaux feature
  const tableauxContainer = document.querySelector('.tableaux-container');
  if (!tableauxContainer) return;
  
  // Get all scene elements
  const scenes = tableauxContainer.querySelectorAll('.tableaux-scene');
  if (scenes.length === 0) return;
  
  // Calculate scene positions and dimensions
  const sceneData = Array.from(scenes).map(scene => {
    return {
      element: scene,
      top: getOffsetTop(scene),
      height: scene.offsetHeight,
      animations: Array.from(scene.querySelectorAll('[data-animate]')),
      backgroundElement: scene.querySelector('.scene-background'),
      textElements: scene.querySelectorAll('.scene-text > *')
    };
  });
  
  // Function to update scenes based on scroll position
  const updateScenes = () => {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const windowBottom = scrollTop + windowHeight;
    
    sceneData.forEach(scene => {
      // Calculate visibility percentage of scene
      const sceneTop = scene.top;
      const sceneBottom = sceneTop + scene.height;
      
      // Scene starting to enter viewport from bottom
      const enteringFromBottom = windowBottom > sceneTop && scrollTop < sceneTop;
      
      // Scene fully in viewport
      const fullyVisible = scrollTop < sceneTop && windowBottom > sceneBottom;
      
      // Scene starting to exit viewport from top
      const exitingFromTop = scrollTop > sceneTop && scrollTop < sceneBottom;
      
      // Scene completely above viewport
      const aboveViewport = scrollTop > sceneBottom;
      
      // Scene completely below viewport
      const belowViewport = windowBottom < sceneTop;
      
      // Calculate how far through the scene we've scrolled (0 to 1)
      let progressThroughScene = 0;
      
      if (enteringFromBottom) {
        // Entering scene from bottom - calculate intro progress (0 to 0.5)
        progressThroughScene = Math.min((windowBottom - sceneTop) / (windowHeight / 2), 0.5);
      } else if (fullyVisible) {
        // Fully visible - halfway through animation
        progressThroughScene = 0.5;
      } else if (exitingFromTop) {
        // Exiting from top - calculate exit progress (0.5 to 1)
        progressThroughScene = 0.5 + Math.min((scrollTop - sceneTop) / (windowHeight / 2), 0.5);
      } else if (aboveViewport) {
        // Already scrolled past - complete
        progressThroughScene = 1;
      }
      
      // Apply animation states based on progress
      applySceneAnimations(scene, progressThroughScene);
    });
  };
  
  // Function to apply animations based on scene progress
  const applySceneAnimations = (scene, progress) => {
    // Animate background parallax
    if (scene.backgroundElement) {
      // Parallax effect moving at half the scroll speed
      const parallaxOffset = (progress - 0.5) * 30;
      scene.backgroundElement.style.transform = `translateY(${parallaxOffset}%)`;
      
      // Adjust opacity based on progress
      const opacity = progress <= 0.1 ? progress * 10 : 
                      progress >= 0.9 ? (1 - progress) * 10 : 1;
      scene.backgroundElement.style.opacity = opacity;
    }
    
    // Animate text elements with sequential fade-in
    scene.textElements.forEach((element, index) => {
      // Calculate staggered appearance threshold
      const appearAt = 0.2 + (index * 0.1);
      const fadeOut = 0.7;
      
      // Calculate opacity based on progress
      const opacity = progress < appearAt ? 0 :
                      progress < appearAt + 0.1 ? (progress - appearAt) * 10 :
                      progress > fadeOut ? (1 - (progress - fadeOut) * 3) : 1;
      
      // Apply styles
      element.style.opacity = opacity;
      
      // Add transform for more dynamic appearance
      const translateY = progress < appearAt ? 20 :
                         progress < appearAt + 0.1 ? 20 - (progress - appearAt) * 200 : 0;
      
      element.style.transform = `translateY(${translateY}px)`;
    });
    
    // Apply custom animations to elements with data-animate attribute
    scene.animations.forEach(element => {
      const animationType = element.getAttribute('data-animate');
      const startPoint = parseFloat(element.getAttribute('data-animate-start') || 0.2);
      const endPoint = parseFloat(element.getAttribute('data-animate-end') || 0.8);
      
      // Calculate animation progress within its range
      let animationProgress = 0;
      
      if (progress < startPoint) {
        animationProgress = 0;
      } else if (progress > endPoint) {
        animationProgress = 1;
      } else {
        animationProgress = (progress - startPoint) / (endPoint - startPoint);
      }
      
      // Apply animation based on type
      applyAnimation(element, animationType, animationProgress);
    });
  };
  
  // Function to apply specific animation types
  const applyAnimation = (element, type, progress) => {
    switch (type) {
      case 'fade-in':
        element.style.opacity = progress;
        break;
        
      case 'slide-in-left':
        const leftDistance = 100 - (progress * 100);
        element.style.transform = `translateX(-${leftDistance}%)`;
        element.style.opacity = progress;
        break;
        
      case 'slide-in-right':
        const rightDistance = 100 - (progress * 100);
        element.style.transform = `translateX(${rightDistance}%)`;
        element.style.opacity = progress;
        break;
        
      case 'zoom-in':
        const scale = 0.5 + (progress * 0.5);
        element.style.transform = `scale(${scale})`;
        element.style.opacity = progress;
        break;
        
      case 'rotate':
        const rotation = 360 * progress;
        element.style.transform = `rotate(${rotation}deg)`;
        break;
        
      default:
        // No animation or custom animation handled via CSS
        break;
    }
  };
  
  // Add scroll listener
  window.addEventListener('scroll', updateScenes);
  
  // Calculate initial positions on page load
  window.addEventListener('load', () => {
    // Recalculate scene positions
    sceneData.forEach(scene => {
      scene.top = getOffsetTop(scene.element);
      scene.height = scene.element.offsetHeight;
    });
    
    // Initial update
    updateScenes();
  });
  
  // Recalculate on window resize
  window.addEventListener('resize', () => {
    // Recalculate scene positions
    sceneData.forEach(scene => {
      scene.top = getOffsetTop(scene.element);
      scene.height = scene.element.offsetHeight;
    });
    
    // Update scenes
    updateScenes();
  });
}

/**
 * Sticky Elements
 * Manages elements that should stick to viewport while scrolling
 * - Lines 428-478
 */
function initStickyElements() {
  // Find sidebar and other sticky elements
  const stickyElements = document.querySelectorAll('[data-sticky]');
  if (stickyElements.length === 0) return;
  
  // Get header height for offset calculation
  const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
  
  // Calculate initial positions
  const elementData = Array.from(stickyElements).map(element => {
    // Get parent container for reference
    const container = element.closest('[data-sticky-container]') || 
                      element.parentElement;
    
    return {
      element: element,
      parent: container,
      originalTop: getOffsetTop(element),
      originalStyle: {
        position: element.style.position,
        top: element.style.top,
        width: element.style.width
      },
      // Get offset from data attribute or default to header height plus 20px
      offset: parseInt(element.getAttribute('data-sticky-offset'), 10) || (headerHeight + 20)
    };
  });
  
  // Function to update sticky elements
  const updateStickyElements = () => {
    const scrollTop = window.pageYOffset;
    
    elementData.forEach(data => {
      // Get current parent dimensions and position
      const parentRect = data.parent.getBoundingClientRect();
      const parentTop = getOffsetTop(data.parent);
      const parentBottom = parentTop + data.parent.offsetHeight;
      
      // Element original dimensions
      const elementHeight = data.element.offsetHeight;
      
      // Calculate positions
      const stickyStart = data.originalTop - data.offset;
      const stickyEnd = parentBottom - elementHeight - data.offset;
      
      // Set width to match parent
      if (!data.element.style.width) {
        data.element.style.width = `${parentRect.width}px`;
      }
      
      if (scrollTop < stickyStart) {
        // Not yet reached sticky position - reset to original
        data.element.style.position = data.originalStyle.position;
        data.element.style.top = data.originalStyle.top;
        data.element.classList.remove('is-sticky', 'is-at-bottom');
      } else if (scrollTop >= stickyStart && scrollTop < stickyEnd) {
        // In sticky range - fix to viewport
        data.element.style.position = 'fixed';
        data.element.style.top = `${data.offset}px`;
        data.element.classList.add('is-sticky');
        data.element.classList.remove('is-at-bottom');
      } else {
        // Past sticky range - stick to bottom of parent
        data.element.style.position = 'absolute';
        data.element.style.top = `${stickyEnd + data.offset - parentTop}px`;
        data.element.classList.remove('is-sticky');
        data.element.classList.add('is-at-bottom');
      }
    });
  };
  
  // Update on scroll
  window.addEventListener('scroll', updateStickyElements);
  
  // Update on resize to recalculate positions
  window.addEventListener('resize', () => {
    // Reset element widths to recalculate
    elementData.forEach(data => {
      // Reset width to recalculate
      data.element.style.width = '';
      
      // Force reflow
      void data.element.offsetWidth;
      
      // Update original top position
      data.originalTop = getOffsetTop(data.element);
    });
    
    // Update sticky elements
    updateStickyElements();
  });
  
  // Initial update
  updateStickyElements();
}

/**
 * Related Content Transitions
 * Handles animations for the "More Articles" section
 * - Lines 483-522
 */
function initRelatedContentTransitions() {
  // Get the related articles section
  const relatedSection = document.querySelector('.more-articles');
  if (!relatedSection) return;
  
  // Add intersection observer to trigger animations when section comes into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Section is now visible - trigger animation
        animateRelatedArticles();
        
        // Disconnect observer after animation is triggered
        observer.disconnect();
      }
    });
  }, {
    // Trigger when 20% of the element is visible
    threshold: 0.2
  });
  
  // Observe the related section
  observer.observe(relatedSection);
  
  // Function to animate related articles with staggered timing
  function animateRelatedArticles() {
    const articles = relatedSection.querySelectorAll('.article-card');
    
    // Add animation class to section title first
    const sectionTitle = relatedSection.querySelector('.section-title');
    if (sectionTitle) {
      sectionTitle.classList.add('animated');
    }
    
    // Animate articles with staggered delay
    articles.forEach((article, index) => {
      // Set initial state
      article.style.opacity = '0';
      article.style.transform = 'translateY(30px)';
      
      // Force browser to process the above style
      void article.offsetWidth;
      
      // Add transition properties
      article.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      article.style.transitionDelay = `${0.2 + (index * 0.1)}s`;
      
      // Trigger animation
      article.style.opacity = '1';
      article.style.transform = 'translateY(0)';
    });
  }
}

/**
 * Helper function to check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @return {boolean} - True if element is at least partially visible
 * - Lines 527-537
 */
function isElementInView(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
    rect.top < (window.innerHeight || document.documentElement.clientHeight)
  );
}
