/**
 * content-filter.js
 * 
 * Advanced filtering system for category pages with animations
 * and dynamic content loading capabilities.
 * 
 * This script handles:
 * 1. Category filtering with animated transitions
 * 2. Dynamic content loading with pagination
 * 3. Filter state persistence across page reloads
 * 4. URL parameter handling for direct filter access
 */

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the filtering system
  initContentFilter();
  
  // Initialize load more functionality
  initLoadMore();
  
  // Handle URL parameters for direct filter access
  handleUrlParameters();
});

/**
 * Initialize content filtering system
 * - Sets up event listeners for filter buttons
 * - Configures animated transitions between filter states
 * - Lines 25-116
 */
function initContentFilter() {
  // Get all filter toggle buttons
  const filterToggles = document.querySelectorAll('.filter-toggle');
  
  // Get all article cards that can be filtered
  const articleCards = document.querySelectorAll('.article-card');
  
  // Exit if no filter elements exist on page
  if (filterToggles.length === 0 || articleCards.length === 0) return;
  
  // Set up filter button event listeners
  filterToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      // Get selected category from data attribute
      const selectedCategory = toggle.dataset.category;
      
      // Update active button state
      filterToggles.forEach(btn => btn.classList.remove('active'));
      toggle.classList.add('active');
      
      // Store selected filter in session storage for persistence
      sessionStorage.setItem('selectedFilter', selectedCategory);
      
      // Update URL with selected filter for shareable links
      updateUrlParameter('filter', selectedCategory);
      
      // Apply filtering with animation
      filterContent(selectedCategory, articleCards);
    });
  });
  
  // Restore previously selected filter if available
  const savedFilter = sessionStorage.getItem('selectedFilter');
  if (savedFilter) {
    const savedToggle = document.querySelector(`.filter-toggle[data-category="${savedFilter}"]`);
    if (savedToggle && !savedToggle.classList.contains('active')) {
      // Simulate click on the saved filter button
      savedToggle.click();
    }
  }
}

/**
 * Filter content with animation
 * @param {string} category - The category to filter by ('all' or specific category)
 * @param {NodeList} articles - Collection of article elements to filter
 * - Lines 84-116
 */
function filterContent(category, articles) {
  // Create a container for layout shift prevention
  const container = document.querySelector('.article-grid');
  const containerHeight = container.offsetHeight;
  
  // Set container height during transition to prevent layout shift
  container.style.height = `${containerHeight}px`;
  
  // Keep track of visible articles count for layout adjustment
  let visibleCount = 0;
  
  // Process each article with staggered animation
  articles.forEach((article, index) => {
    // Determine if article should be shown based on category
    const shouldShow = category === 'all' || article.classList.contains(category);
    
    // Apply different transition delays for staggered effect
    const delay = shouldShow ? index * 50 : 0;
    
    if (shouldShow) {
      // For articles that should be visible
      setTimeout(() => {
        article.style.opacity = '0';
        article.style.transform = 'translateY(20px)';
        
        // Force browser to process the above style before changing
        void article.offsetWidth;
        
        article.style.display = '';
        
        // Trigger fade-in animation after a short delay
        setTimeout(() => {
          article.style.opacity = '1';
          article.style.transform = 'translateY(0)';
        }, 20);
        
        visibleCount++;
      }, delay);
    } else {
      // For articles that should be hidden
      article.style.opacity = '0';
      article.style.transform = 'translateY(10px)';
      
      // Hide after fade-out animation completes
      setTimeout(() => {
        article.style.display = 'none';
      }, 300);
    }
  });
  
  // Reset container height after transition completes
  setTimeout(() => {
    container.style.height = '';
  }, 500);
}

/**
 * Update URL parameter without page reload
 * @param {string} key - Parameter key to update
 * @param {string} value - Parameter value to set
 * - Lines 123-148
 */
function updateUrlParameter(key, value) {
  // Get current URL and parse parameters
  const url = new URL(window.location.href);
  
  if (value === 'all') {
    // Remove parameter when filter is set to 'all'
    url.searchParams.delete(key);
  } else {
    // Set or update parameter
    url.searchParams.set(key, value);
  }
  
  // Update URL without reloading the page
  window.history.pushState({}, '', url);
}

/**
 * Handle URL parameters when page loads
 * Enables direct links to filtered views
 * - Lines 153-175
 */
function handleUrlParameters() {
  // Get current URL and parse parameters
  const url = new URL(window.location.href);
  const filterParam = url.searchParams.get('filter');
  
  // If filter parameter exists, activate the corresponding filter
  if (filterParam) {
    const filterToggle = document.querySelector(`.filter-toggle[data-category="${filterParam}"]`);
    
    if (filterToggle && !filterToggle.classList.contains('active')) {
      // Simulate click on the filter button
      filterToggle.click();
    }
  }
}

/**
 * Initialize load more functionality
 * Handles pagination and dynamic content loading
 * - Lines 180-252
 */
function initLoadMore() {
  const loadMoreBtn = document.querySelector('.load-more');
  
  // Exit if button doesn't exist
  if (!loadMoreBtn) return;
  
  // Set up initial pagination state
  const paginationState = {
    currentPage: 1,
    perPage: 8, // Articles per page
    totalPages: 3, // This would come from the server in a real implementation
    isLoading: false
  };
  
  // Add click event listener to load more button
  loadMoreBtn.addEventListener('click', async () => {
    // Prevent multiple simultaneous requests
    if (paginationState.isLoading) return;
    
    // Update button state to indicate loading
    paginationState.isLoading = true;
    loadMoreBtn.textContent = 'Loading...';
    loadMoreBtn.disabled = true;
    
    try {
      // In a real implementation, this would fetch data from a server
      // For demo purposes, we'll simulate a network request
      await simulateNetworkRequest();
      
      // Generate new content (in a real app, this would use data from the server)
      const newArticles = generateMoreArticles();
      
      // Append new content to the article grid
      const articleGrid = document.querySelector('.article-grid');
      if (articleGrid) {
        articleGrid.insertAdjacentHTML('beforeend', newArticles);
        
        // Initialize any new components in the added content
        initNewlyAddedContent();
      }
      
      // Update pagination state
      paginationState.currentPage++;
      
      // Hide load more button if we've reached the last page
      if (paginationState.currentPage >= paginationState.totalPages) {
        loadMoreBtn.style.display = 'none';
      }
    } catch (error) {
      console.error('Error loading more content:', error);
      loadMoreBtn.textContent = 'Error loading content. Try again.';
    } finally {
      // Reset button state
      paginationState.isLoading = false;
      loadMoreBtn.disabled = false;
      
      if (paginationState.currentPage < paginationState.totalPages) {
        loadMoreBtn.textContent = 'Load More Articles';
      }
    }
  });
}

/**
 * Simulate network request with delay
 * This is a placeholder for actual API calls
 * @returns {Promise} - Resolves after a delay
 * - Lines 258-266
 */
function simulateNetworkRequest() {
  return new Promise(resolve => {
    // Simulate network delay
    setTimeout(resolve, 800);
  });
}

/**
 * Generate HTML for additional articles
 * In a real implementation, this would use data from API
 * @returns {string} - HTML string for new articles
 * - Lines 272-344
 */
function generateMoreArticles() {
  // This is placeholder content for demonstration
  // In a real app, this would be generated from API data
  return `
    <article class="article-card pharmaceutical animate-on-scroll">
      <a href="article.html" class="article-link">
        <div class="card-image paywall-blur">
          <img src="https://source.unsplash.com/random/600x400/?pills" alt="Article image">
        </div>
        <div class="card-content">
          <h3>The Ethics of Pharmaceutical Tourism: Where Americans Go When FDA Says No</h3>
          <p class="excerpt">Inside the luxury medical tourism industry catering to wealthy Americans seeking treatments unavailable or unapproved in the US.</p>
          <div class="article-meta">
            <span class="metadata">14 Min Read</span>
          </div>
        </div>
      </a>
    </article>
    
    <article class="article-card culture animate-on-scroll">
      <a href="article.html" class="article-link">
        <div class="card-image paywall-blur">
          <img src="https://source.unsplash.com/random/600x400/?art,psychedelic" alt="Article image">
        </div>
        <div class="card-content">
          <h3>When Collectors Buy Art Based on Their Drug of Choice</h3>
          <p class="excerpt paywall-text">How different substances influence aesthetic preferences and shape private collections worth millions.</p>
          <div class="article-meta">
            <span class="metadata">9 Min Read</span>
          </div>
        </div>
      </a>
    </article>
    
    <article class="article-card designer animate-on-scroll">
      <a href="article.html" class="article-link">
        <div class="card-image paywall-blur">
          <img src="https://source.unsplash.com/random/600x400/?chemistry,lab" alt="Article image">
        </div>
        <div class="card-content">
          <h3>The Biohacker Billionaires Redesigning Their Own Biochemistry</h3>
          <p class="excerpt">Meet the tech elite who view their bodies as systems to be optimized through custom compounds and genetic manipulation.</p>
          <div class="article-meta">
            <span class="metadata">16 Min Read</span>
          </div>
        </div>
      </a>
    </article>
  `;
}

/**
 * Initialize components in newly added content
 * Ensures dynamic content behaves the same as initial content
 * - Lines 350-372
 */
function initNewlyAddedContent() {
  // Get all newly added articles
  const newArticles = document.querySelectorAll('.article-card:not(.initialized)');
  
  newArticles.forEach(article => {
    // Mark as initialized to avoid reprocessing
    article.classList.add('initialized');
    
    // Initialize animation for newly added elements
    if (article.classList.contains('animate-on-scroll')) {
      // Check if element is already in viewport
      const rect = article.getBoundingClientRect();
      const isInViewport = (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9
      );
      
      if (isInViewport) {
        article.classList.add('animated');
      }
    }
    
    // Apply current filter if one is active
    const activeFilter = document.querySelector('.filter-toggle.active');
    if (activeFilter && activeFilter.dataset.category !== 'all') {
      const selectedCategory = activeFilter.dataset.category;
      
      // Hide article if it doesn't match the active filter
      if (!article.classList.contains(selectedCategory)) {
        article.style.display = 'none';
      }
    }
  });
}
