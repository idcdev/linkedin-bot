/**
 * Delay function using Promise
 */
export function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * Generates a random delay between min and max
 */
export function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Generates random mouse movements before an action
 */
export async function warmupMouseMovements(page) {
  const viewportSize = await page.viewport();
  if (!viewportSize) return;
  
  // Random number of movements (2-5)
  const moves = 2 + Math.floor(Math.random() * 3);
  
  for (let i = 0; i < moves; i++) {
    // Generates random coordinates
    const x = Math.floor(Math.random() * viewportSize.width);
    const y = Math.floor(Math.random() * viewportSize.height);
    
    // Moves the mouse
    await page.mouse.move(x, y);
    await delay(randomDelay(200, 1000));
    
    // Sometimes makes a small circular movement
    if (Math.random() < 0.3) {
      const radius = 20;
      const steps = 20;
      for (let j = 0; j < steps; j++) {
        const angle = (j / steps) * 2 * Math.PI;
        const circleX = x + radius * Math.cos(angle);
        const circleY = y + radius * Math.sin(angle);
        await page.mouse.move(circleX, circleY);
        await delay(20);
      }
    }
  }
  
  // Sometimes makes a random scroll
  if (Math.random() < 0.3) {
    await page.mouse.wheel({ deltaY: randomDelay(-100, 100) });
    await delay(randomDelay(500, 1000));
  }
}

/**
 * Gets the viewport center point
 */
async function getViewportCenter(page) {
  try {
    const viewport = await page.viewport();
    if (viewport) {
      return {
        x: viewport.width / 2,
        y: viewport.height / 2
      };
    }
  } catch {
    console.log('Using default dimensions for viewport');
  }
  
  // Default values if viewport can't be obtained
  return {
    x: 960,  // Half of 1920
    y: 540   // Half of 1080
  };
}

/**
 * Generates a control point for the Bezier curve
 */
function generateControlPoint(start, end) {
  const midPoint = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2
  };
  
  // Adds some random variation
  const variance = 100; // pixels of variation
  return {
    x: midPoint.x + (Math.random() - 0.5) * variance,
    y: midPoint.y + (Math.random() - 0.5) * variance
  };
}

/**
 * Calculates a point on the Bezier curve
 */
function bezierPoint(t, p0, p1, p2) {
  const x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x;
  const y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y;
  return { x, y };
}

/**
 * Moves the mouse following a natural curve
 */
async function moveMouseInCurve(page, start, end, steps = 50) {
  const controlPoint = generateControlPoint(start, end);
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const point = bezierPoint(t, start, controlPoint, end);
    await page.mouse.move(point.x, point.y);
    
    // Increasing the delay between movements to be more visible
    await delay(randomDelay(20, 50));

    // Updates the visual cursor position
    await page.evaluate(({x, y}) => {
      const cursor = document.getElementById('puppeteer-mouse-cursor');
      if (cursor) {
        cursor.style.transform = `translate(${x - 10}px, ${y - 10}px)`;
      }
    }, point);
  }
}

/**
 * Simulates human typing with variable speed
 */
export async function typeHumanLike(page, selector, text) {
  // Warms up with random movements
  await warmupMouseMovements(page);
  
  const element = await page.waitForSelector(selector);
  
  // Moves the mouse to the field before typing
  const box = await element.boundingBox();
  if (box) {
    const x = box.x + (box.width * 0.3);
    const y = box.y + (box.height * 0.5);
    await page.mouse.move(x, y);
    await delay(randomDelay(100, 300));
  }
  
  // Clicks on the field
  await page.click(selector);
  await delay(randomDelay(200, 500));
  
  // Types the text
  for (let i = 0; i < text.length; i++) {
    await page.type(selector, text[i], { delay: randomDelay(30, 100) });
    
    // Occasionally makes a short pause
    if (Math.random() < 0.05) {
      await delay(randomDelay(100, 200));
    }
  }
}

/**
 * Moves the mouse in a more natural way
 */
export async function moveMouseHumanLike(page, selector) {
  const element = await page.waitForSelector(selector);
  const box = await element.boundingBox();
  
  if (box) {
    // Random point within the element
    const targetX = box.x + (box.width * Math.random());
    const targetY = box.y + (box.height * Math.random());
    
    // Starts from the viewport center
    const start = await getViewportCenter(page);
    const end = { x: targetX, y: targetY };
    
    // Moves the mouse in a natural curve
    await moveMouseInCurve(page, start, end);
  }
}

/**
 * Move the mouse and click on an element
 */
export async function clickHumanLike(page, selector, options = {}) {
  const {
    shouldHover = true,
    hoverDelay = [300, 1000],
    postClickDelay = [200, 800]
  } = options;

  // Warms up with random movements
  await warmupMouseMovements(page);

  // Waits for the element to be available
  const element = await page.waitForSelector(selector);
  const box = await element.boundingBox();

  if (box) {
    // Moves the mouse to a random point near the center of the element
    const x = box.x + (box.width * (0.3 + Math.random() * 0.4));
    const y = box.y + (box.height * (0.3 + Math.random() * 0.4));
    
    // Moves the mouse with small intermediate movements
    const currentPosition = { x: 0, y: 0 };
    const steps = 3 + Math.floor(Math.random() * 3); // 3-5 steps
    
    for (let i = 0; i < steps; i++) {
      const stepX = currentPosition.x + ((x - currentPosition.x) * ((i + 1) / steps));
      const stepY = currentPosition.y + ((y - currentPosition.y) * ((i + 1) / steps));
      
      // Adds small variation in each step
      const variance = 20;
      const varX = stepX + (Math.random() - 0.5) * variance;
      const varY = stepY + (Math.random() - 0.5) * variance;
      
      await page.mouse.move(varX, varY);
      await delay(randomDelay(50, 150));
    }
    
    // Moves to the final position
    await page.mouse.move(x, y);

    // Simulates hover if necessary
    if (shouldHover) {
      await delay(randomDelay(...hoverDelay));
      
      // Small movement during hover
      if (Math.random() < 0.3) {
        const hoverRadius = 5;
        await page.mouse.move(x + hoverRadius, y + hoverRadius);
        await delay(randomDelay(100, 300));
        await page.mouse.move(x, y);
      }
    }

    // Clicks
    await page.mouse.click(x, y);

    // Waits a little after the click
    await delay(randomDelay(...postClickDelay));
  }
}

/**
 * Simulates scroll like a human
 */
export async function scrollHumanLike(page, distance) {
  const scrollSteps = Math.floor(distance / randomDelay(20, 40));
  
  for (let i = 0; i < scrollSteps; i++) {
    await page.mouse.wheel({ deltaY: randomDelay(20, 40) });
    await delay(randomDelay(50, 150));
    
    // Occasionally makes a longer pause
    if (Math.random() < 0.1) {
      await delay(randomDelay(500, 1000));
    }
  }
}

/**
 * Adds random mouse movements
 */
export async function addRandomMouseMovements(page) {
  const viewportSize = await page.viewport();
  if (!viewportSize) return;
  
  const moves = randomDelay(3, 7);
  const start = await getViewportCenter(page);
  
  for (let i = 0; i < moves; i++) {
    const targetX = Math.floor(Math.random() * viewportSize.width);
    const targetY = Math.floor(Math.random() * viewportSize.height);
    
    const end = { x: targetX, y: targetY };
    
    // Moves the mouse in a natural curve
    await moveMouseInCurve(page, start, end);
    await delay(randomDelay(200, 500));
  }
} 