/**
 * pattern-integration.js
 * 
 * This script handles the integration of visual patterns throughout the
 * Bad Dog Entertainment website, including:
 * - Dynamic pattern positioning
 * - Interactive pattern effects
 * - Category-specific pattern loading
 * - Scroll-based pattern transformations
 */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Configuration object for category-specific patterns
  const patternConfig = {
    chemical: {
      colors: ['#00ffcc', '#00ccaa', '#009988'],
      density: 0.8,
      speed: 1.2,
      scale: 1.5,
      opacity: 0.15
    },
    afterhours: {
      colors: ['#ff0066', '#cc0055', '#990033'],
      density: 1.0,
      speed: 0.8,
      scale: 1.2,
      opacity: 0.12
    },
    exotic: {
      colors: ['#ffcc00', '#ffaa00', '#ff8800'],
      density: 0.6,
      speed: 0.5,
      scale: 1.0,
      opacity: 0.1
    },
    luxury: {
      colors: ['#0066ff', '#0044cc', '#002299'],
      density: 0.5,
      speed: 0.3,
      scale: 1.8,
      opacity: 0.08
    },
    degenerate: {
      colors: ['#ff3300', '#cc2200', '#991100'],
      density: 1.2,
      speed: 1.5,
      scale: 0.9,
      opacity: 0.18
    }
  };

  // Get current category from body class or default to 'afterhours'
  const getCurrentCategory = () => {
    const bodyClasses = document.body.classList;
    const categories = Object.keys(patternConfig);
    
    for (const category of categories) {
      if (bodyClasses.contains(category)) {
        return category;
      }
    }
    
    // Default if no match found
    return 'afterhours';
  };

  // Initialize pattern elements
  const initializePatterns = () => {
    const currentCategory = getCurrentCategory();
    const config = patternConfig[currentCategory];
    
    // Apply pattern backgrounds based on category
    document.querySelectorAll('.pattern-background').forEach(element => {
      // Remove any existing category classes
      Object.keys(patternConfig).forEach(category => {
        element.classList.remove(`pattern-${category}`);
      });
      
      // Add current category class
      if (!element.classList.contains(`pattern-${currentCategory}`)) {
        element.classList.add(`pattern-${currentCategory}`);
      }
      
      // Set custom properties based on configuration
      element.style.opacity = config.opacity;
    });
    
    // Initialize interactive patterns
    initializeInteractivePatterns(currentCategory, config);
    
    // Initialize scroll-based pattern effects
    initializeScrollPatterns();
  };

  // Create and manage interactive SVG patterns
  const initializeInteractivePatterns = (category, config) => {
    const interactivePatternContainers = document.querySelectorAll('.interactive-pattern');
    
    if (interactivePatternContainers.length === 0) return;
    
    interactivePatternContainers.forEach(container => {
      // Clear any existing patterns
      container.innerHTML = '';
      
      // Create SVG element
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('class', 'pattern-svg');
      
      // Determine number of elements based on container size and density
      const containerRect = container.getBoundingClientRect();
      const containerArea = containerRect.width * containerRect.height;
      const elementCount = Math.floor(containerArea / 10000 * config.density);
      
      // Generate pattern elements
      for (let i = 0; i < elementCount; i++) {
        createPatternElement(svg, category, config);
      }
      
      container.appendChild(svg);
      
      // Add mouse interaction
      addMouseInteraction(container, svg);
    });
  };

  // Create individual pattern SVG elements
  const createPatternElement = (svg, category, config) => {
    const patternElements = {
      chemical: () => {
        // Create hexagon/molecular structure
        const hexagon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const size = 20 * config.scale;
        const points = [];
        
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const x = size * Math.cos(angle);
          const y = size * Math.sin(angle);
          points.push(`${x},${y}`);
        }
        
        hexagon.setAttribute('points', points.join(' '));
        hexagon.setAttribute('fill', 'none');
        hexagon.setAttribute('stroke', getRandomItem(config.colors));
        hexagon.setAttribute('stroke-width', '1');
        
        // Position randomly within SVG
        const parentSize = svg.getBoundingClientRect();
        const x = Math.random() * parentSize.width;
        const y = Math.random() * parentSize.height;
        
        hexagon.setAttribute('transform', `translate(${x}, ${y})`);
        
        // Add animation
        const animateRotation = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
        animateRotation.setAttribute('attributeName', 'transform');
        animateRotation.setAttribute('type', 'rotate');
        animateRotation.setAttribute('from', '0');
        animateRotation.setAttribute('to', '360');
        animateRotation.setAttribute('dur', `${10 / config.speed}s`);
        animateRotation.setAttribute('repeatCount', 'indefinite');
        
        hexagon.appendChild(animateRotation);
        return hexagon;
      },
      
      afterhours: () => {
        // Create sound wave/frequency visualization
        const soundWave = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const width = 50 * config.scale;
        const height = 20 * config.scale;
        
        // Create waveform path
        let path = `M0,${height/2}`;
        const steps = 10;
        
        for (let i = 1; i <= steps; i++) {
          const x = (width / steps) * i;
          const y = height/2 + Math.sin(i * Math.PI) * (height/2) * Math.random();
          path += ` L${x},${y}`;
        }
        
        soundWave.setAttribute('d', path);
        soundWave.setAttribute('fill', 'none');
        soundWave.setAttribute('stroke', getRandomItem(config.colors));
        soundWave.setAttribute('stroke-width', '1.5');
        
        // Position randomly
        const parentSize = svg.getBoundingClientRect();
        const x = Math.random() * parentSize.width;
        const y = Math.random() * parentSize.height;
        
        soundWave.setAttribute('transform', `translate(${x}, ${y})`);
        
        // Add pulsing animation
        const animateOpacity = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animateOpacity.setAttribute('attributeName', 'opacity');
        animateOpacity.setAttribute('values', '0.1;0.8;0.1');
        animateOpacity.setAttribute('dur', `${3 / config.speed}s`);
        animateOpacity.setAttribute('repeatCount', 'indefinite');
        
        soundWave.appendChild(animateOpacity);
        return soundWave;
      },
      
      exotic: () => {
        // Create organic shapes for exotic food
        const organicShape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const size = 25 * config.scale;
        
        // Generate random bezier curve
        let path = 'M0,0 ';
        const points = 6;
        const radius = size;
        
        for (let i = 0; i <= points; i++) {
          const angle = (Math.PI * 2 / points) * i;
          const variance = 0.4 * Math.random() + 0.8; // 0.8 to 1.2
          
          const x = Math.cos(angle) * radius * variance;
          const y = Math.sin(angle) * radius * variance;
          
          if (i === 0) {
            path += `M${x},${y} `;
          } else {
            const prevAngle = (Math.PI * 2 / points) * (i - 1);
            const cpRadius = radius * 0.7;
            
            const cp1x = Math.cos(prevAngle + Math.PI/6) * cpRadius;
            const cp1y = Math.sin(prevAngle + Math.PI/6) * cpRadius;
            
            const cp2x = Math.cos(angle - Math.PI/6) * cpRadius;
            const cp2y = Math.sin(angle - Math.PI/6) * cpRadius;
            
            path += `C${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y} `;
          }
        }
        
        path += 'Z';
        organicShape.setAttribute('d', path);
        organicShape.setAttribute('fill', getRandomItem(config.colors));
        organicShape.setAttribute('fill-opacity', '0.3');
        organicShape.setAttribute('stroke', getRandomItem(config.colors));
        organicShape.setAttribute('stroke-width', '0.5');
        
        // Position randomly
        const parentSize = svg.getBoundingClientRect();
        const x = Math.random() * parentSize.width;
        const y = Math.random() * parentSize.height;
        
        organicShape.setAttribute('transform', `translate(${x}, ${y})`);
        
        // Add floating animation
        const animatePosition = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
        animatePosition.setAttribute('path', `M0,0 Q${10*Math.random()},${15*Math.random()} 0,${30*Math.random()}`);
        animatePosition.setAttribute('dur', `${20 / config.speed}s`);
        animatePosition.setAttribute('repeatCount', 'indefinite');
        
        organicShape.appendChild(animatePosition);
        return organicShape;
      },
      
      luxury: () => {
        // Create luxury geometric patterns
        const luxuryElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const size = 30 * config.scale;
        
        // Create diamond shape
        const diamond = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        diamond.setAttribute('points', `0,${-size/2} ${size/2},0 0,${size/2} ${-size/2},0`);
        diamond.setAttribute('fill', 'none');
        diamond.setAttribute('stroke', getRandomItem(config.colors));
        diamond.setAttribute('stroke-width', '1');
        
        // Add inner lines for facets
        const facet1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        facet1.setAttribute('x1', '0');
        facet1.setAttribute('y1', '0');
        facet1.setAttribute('x2', `${size/2}`);
        facet1.setAttribute('y2', '0');
        facet1.setAttribute('stroke', getRandomItem(config.colors));
        facet1.setAttribute('stroke-width', '0.5');
        
        const facet2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        facet2.setAttribute('x1', '0');
        facet2.setAttribute('y1', '0');
        facet2.setAttribute('x2', '0');
        facet2.setAttribute('y2', `${size/2}`);
        facet2.setAttribute('stroke', getRandomItem(config.colors));
        facet2.setAttribute('stroke-width', '0.5');
        
        luxuryElement.appendChild(diamond);
        luxuryElement.appendChild(facet1);
        luxuryElement.appendChild(facet2);
        
        // Position randomly
        const parentSize = svg.getBoundingClientRect();
        const x = Math.random() * parentSize.width;
        const y = Math.random() * parentSize.height;
        
        luxuryElement.setAttribute('transform', `translate(${x}, ${y})`);
        
        // Add subtle rotation animation
        const animateRotation = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
        animateRotation.setAttribute('attributeName', 'transform');
        animateRotation.setAttribute('type', 'rotate');
        animateRotation.setAttribute('from', '0');
        animateRotation.setAttribute('to', '360');
        animateRotation.setAttribute('dur', `${30 / config.speed}s`);
        animateRotation.setAttribute('repeatCount', 'indefinite');
        
        luxuryElement.appendChild(animateRotation);
        return luxuryElement;
      },
      
      degenerate: () => {
        // Create chaotic, distorted shapes
        const degenerateElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const size = 25 * config.scale;
        
        // Generate random jagged path
        let path = '';
        const points = 8;
        
        for (let i = 0; i < points; i++) {
          const angle = (Math.PI * 2 / points) * i;
          const variance = 1.5 * Math.random() + 0.5; // 0.5 to 2.0
          
          const x = Math.cos(angle) * size * variance;
          const y = Math.sin(angle) * size * variance;
          
          if (i === 0) {
            path += `M${x},${y} `;
          } else {
            path += `L${x},${y} `;
          }
        }
        
        path += 'Z';
        degenerateElement.setAttribute('d', path);
        degenerateElement.setAttribute('fill', 'none');
        degenerateElement.setAttribute('stroke', getRandomItem(config.colors));
        degenerateElement.setAttribute('stroke-width', '2');
        degenerateElement.setAttribute('stroke-linecap', 'round');
        degenerateElement.setAttribute('stroke-linejoin', 'round');
        
        // Position randomly
        const parentSize = svg.getBoundingClientRect();
        const x = Math.random() * parentSize.width;
        const y = Math.random() * parentSize.height;
        
        degenerateElement.setAttribute('transform', `translate(${x}, ${y})`);
        
        // Add distortion animation
        const animatePathD = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        
        // Generate second random path for animation
        let path2 = '';
        for (let i = 0; i < points; i++) {
          const angle = (Math.PI * 2 / points) * i;
          const variance = 1.5 * Math.random() + 0.5; // 0.5 to 2.0
          
          const x = Math.cos(angle) * size * variance;
          const y = Math.sin(angle) * size * variance;
          
          if (i === 0) {
            path2 += `M${x},${y} `;
          } else {
            path2 += `L${x},${y} `;
          }
        }
        path2 += 'Z';
        
        animatePathD.setAttribute('attributeName', 'd');
        animatePathD.setAttribute('values', `${path};${path2};${path}`);
        animatePathD.setAttribute('dur', `${5 / config.speed}s`);
        animatePathD.setAttribute('repeatCount', 'indefinite');
        
        degenerateElement.appendChild(animatePathD);
        return degenerateElement;
      }
    };
    
    // Create element based on category
    const element = patternElements[category]();
    svg.appendChild(element);
  };

  // Add mouse interaction to pattern containers
  const addMouseInteraction = (container, svg) => {
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate normalized position (0-1)
      const normalizedX = x / rect.width;
      const normalizedY = y / rect.height;
      
      // Get SVG elements
      const elements = svg.querySelectorAll('*');
      
      // Apply subtle transformations based on mouse position
      elements.forEach(element => {
        if (element.tagName === 'animate' || element.tagName === 'animateTransform' || element.tagName === 'animateMotion') {
          return; // Skip animation elements
        }
        
        // Get current transform
        const currentTransform = element.getAttribute('transform') || '';
        
        // Extract translation if it exists
        let translateX = 0;
        let translateY = 0;
        
        const translateMatch = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        if (translateMatch) {
          translateX = parseFloat(translateMatch[1]);
          translateY = parseFloat(translateMatch[2]);
        }
        
        // Apply subtle movement based on mouse position
        const moveX = (normalizedX - 0.5) * 10;
        const moveY = (normalizedY - 0.5) * 10;
        
        // Update transform attribute
        element.setAttribute('transform', `translate(${translateX + moveX}, ${translateY + moveY})`);
      });
    });
  };

  // Initialize scroll-based pattern effects
  const initializeScrollPatterns = () => {
    // Get all pattern elements that should react to scroll
    const scrollPatterns = document.querySelectorAll('.scroll-pattern');
    
    if (scrollPatterns.length === 0) return;
    
    // Update patterns on scroll
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      scrollPatterns.forEach(pattern => {
        const rect = pattern.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        
        // Calculate how far the element is from the center of the viewport
        const distanceFromCenter = Math.abs(elementCenter - windowHeight / 2);
        const maxDistance = windowHeight / 2 + rect.height / 2;
        
        // Calculate parallax effect (1 at center, 0 at edge of visibility)
        const parallaxFactor = 1 - Math.min(distanceFromCenter / maxDistance, 1);
        
        // Apply transform based on scroll position
        if (rect.top < windowHeight && rect.bottom > 0) {
          // Element is visible
          const translateY = scrollY * 0.05; // Parallax speed
          const scale = 0.95 + (parallaxFactor * 0.1); // Scale between 0.95 and 1.05
          const rotate = (scrollY % 360) * 0.02; // Subtle rotation
          
          pattern.style.transform = `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`;
          pattern.style.opacity = 0.05 + (parallaxFactor * 0.1); // Adjust opacity based on visibility
        }
      });
    });
  };

  // Add pattern backgrounds to category sections
  const addCategoryPatterns = () => {
    const categorySections = document.querySelectorAll('.category-section');
    
    categorySections.forEach(section => {
      // Check if section already has a pattern background
      if (section.querySelector('.pattern-background')) return;
      
      // Determine category
      let category = null;
      Object.keys(patternConfig).forEach(cat => {
        if (section.classList.contains(cat)) {
          category = cat;
        }
      });
      
      if (!category) return;
      
      // Create pattern background
      const patternBg = document.createElement('div');
      patternBg.classList.add('pattern-background', `pattern-${category}`);
      
      // Add to section as first child
      section.insertBefore(patternBg, section.firstChild);
    });
  };

  // Helper function to get random item from array
  const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Generate and load SVG patterns
  const generatePatternSVG = (category) => {
    const config = patternConfig[category];
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 200 200');
    
    // Create pattern definition
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    
    pattern.setAttribute('id', `pattern-${category}`);
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    pattern.setAttribute('width', '200');
    pattern.setAttribute('height', '200');
    
    // Add elements to pattern based on category
    const elements = 10;
    for (let i = 0; i < elements; i++) {
      const element = createPatternElement(svg, category, config);
      pattern.appendChild(element);
    }
    
    defs.appendChild(pattern);
    svg.appendChild(defs);
    
    // Add rectangle filled with pattern
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', `url(#pattern-${category})`);
    
    svg.appendChild(rect);
    
    return svg;
  };

  // Export SVG as data URL
  const svgToDataURL = (svg) => {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const svgBase64 = btoa(svgString);
    return `data:image/svg+xml;base64,${svgBase64}`;
  };

  // Initialize all patterns
  const init = () => {
    // Add pattern backgrounds to category sections
    addCategoryPatterns();
    
    // Initialize all pattern elements
    initializePatterns();
    
    // Re-initialize patterns on window resize
    window.addEventListener('resize', initializePatterns);
  };

  // Run initialization
  init();
});
