/**
 * ============================================================================
 * PORTFOLIO CLIENT APPLICATION (Theme, Accent Picker & Local Project Loader)
 * ============================================================================
 */

// Fallback dataset in case local file:// origin blocks fetch API
const FALLBACK_PROJECTS = [
  {
    id: "canned-tomato-soup",
    title: "Warm Microwaved Campbell's Tomato Soup Bowl",
    version: "v5.0-steaming-bowl",
    category: "Microwave Prepared",
    image: "assets/images/canned-tomato-soup.jpg",
    alt: "AI-generated cooked bowl of steaming creamy Campbell's tomato soup next to the metal can",
    description: "Rich, creamy condensed tomato soup prepared to piping-hot perfection in the microwave, garnished with fresh herbs and served in a ceramic bowl beside the classic tin can.",
    cookTime: "3 mins",
    complexity: "Microwave & Garnish",
    heatLevel: "Warm & Creamy",
    tags: ["Campbell's", "Steaming Soup", "Microwave Cooked", "AI-Generated Visual"]
  },
  {
    id: "sausages-pack",
    title: "Sizzling Pan-Seared Beef Breakfast Sausages",
    version: "v2.4-crisp-seared",
    category: "Skillet Seared",
    image: "assets/images/sausages-pack.jpg",
    alt: "AI-generated plate of sizzling golden-brown 100% beef breakfast sausages next to the Brown 'N Serve box",
    description: "Juicy 100% beef breakfast sausage links seared on a medium-high stovetop skillet until crisp and golden-brown, plated fresh with herbs beside the retail box.",
    cookTime: "6 mins",
    complexity: "Skillet Sear & Flip",
    heatLevel: "Savory Herbs",
    tags: ["100% Beef", "Skillet Seared", "Sizzling Plate", "AI-Generated Visual"]
  },
  {
    id: "egg-carton-pack",
    title: "Golden Sunny-Side Farm Eggs",
    version: "v2.0-sunny-platter",
    category: "Skillet Fried",
    image: "assets/images/egg-carton-pack.jpg",
    alt: "AI-generated plate of freshly cooked sunny-side-up fried eggs with golden yolks next to a 24-egg carton",
    description: "Fresh farm eggs fried in a sizzling skillet with crispy edges and rich golden runny yolks, seasoned with cracked pepper and fresh herbs beside the 24-egg carton.",
    cookTime: "4 mins",
    complexity: "Crack & Fry",
    heatLevel: "Fresh & Golden",
    tags: ["Sunny-Side", "Fresh Farm Eggs", "Pan Fried", "AI-Generated Visual"]
  },
  {
    id: "mixed-vegetables",
    title: "Steamed Rainbow Mixed Vegetables Bowl",
    version: "v1.4-blanched-fresh",
    category: "Boiled & Steamed",
    image: "assets/images/mixed-vegetables.jpg",
    alt: "AI-generated steaming bowl of freshly boiled mixed vegetables next to the Steamfresh bag",
    description: "A colorful bowl of sweet corn, tender green peas, diced carrots, and cut green beans, freshly boiled in hot water and finished with a buttery glaze beside the pouch.",
    cookTime: "4 mins",
    complexity: "Boil & Glaze",
    heatLevel: "Steamed Fresh",
    tags: ["Steamed Bowl", "Boiled Veggies", "Corn & Peas", "AI-Generated Visual"]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  initThemeManager();
  initAccentPicker();
  initProjectsRenderer();
});

/**
 * 1. THEME MANAGER (Dark / Light Mode)
 */
function initThemeManager() {
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const storedTheme = localStorage.getItem("culinary-theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  const initialTheme = storedTheme || (systemPrefersDark ? "dark" : "light");
  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      localStorage.setItem("culinary-theme", nextTheme);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const themeIconContainer = document.getElementById("themeIcon");
  if (themeIconContainer) {
    if (theme === "dark") {
      // Moon icon
      themeIconContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      `;
    } else {
      // Sun icon
      themeIconContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2"/>
          <path d="M12 20v2"/>
          <path d="m4.93 4.93 1.41 1.41"/>
          <path d="m17.66 17.66 1.41 1.41"/>
          <path d="M2 12h2"/>
          <path d="M20 12h2"/>
          <path d="m6.34 17.66-1.41 1.41"/>
          <path d="m19.07 4.93-1.41 1.41"/>
        </svg>
      `;
    }
  }
}

/**
 * 2. ACCENT COLOR PICKER
 */
function initAccentPicker() {
  const accentButtons = document.querySelectorAll(".palette-picker__btn");
  const storedAccent = localStorage.getItem("culinary-accent") || "chili";
  
  applyAccent(storedAccent);

  accentButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const accent = btn.getAttribute("data-accent-value");
      if (accent) {
        applyAccent(accent);
        localStorage.setItem("culinary-accent", accent);
      }
    });
  });
}

function applyAccent(accent) {
  document.documentElement.setAttribute("data-accent", accent);
  document.querySelectorAll(".palette-picker__btn").forEach(btn => {
    if (btn.getAttribute("data-accent-value") === accent) {
      btn.classList.add("palette-picker__btn--active");
    } else {
      btn.classList.remove("palette-picker__btn--active");
    }
  });
}

/**
 * 3. PROJECTS RENDERER (Multi-column grid populated from JSON / fallback)
 */
async function initProjectsRenderer() {
  const gridContainer = document.getElementById("projectsGrid");
  if (!gridContainer) return;

  let projects = FALLBACK_PROJECTS;

  try {
    const response = await fetch("assets/data/projects.json");
    if (response.ok) {
      projects = await response.json();
    }
  } catch (e) {
    // Falls back seamlessly to embedded array if opened locally with file://
  }

  renderProjects(projects, gridContainer);
}

function renderProjects(projects, container) {
  container.innerHTML = projects.map(p => `
    <article class="project-card" id="dish-${p.id}">
      <div class="project-card__media">
        <img 
          class="project-card__img" 
          src="${p.image}" 
          alt="${p.alt}" 
          loading="lazy" 
          width="800" 
          height="600"
        />
        <div class="project-card__badge-pill">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          ${p.category}
        </div>
        <div class="project-card__ai-badge" title="AI-Generated Demonstration Visual">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/>
          </svg>
          <span>AI Generated</span>
        </div>
      </div>

      <div class="project-card__content">
        <header class="project-card__header">
          <h3 class="project-card__title">${p.title}</h3>
          <span class="project-card__version">${p.version}</span>
        </header>

        <!-- Descriptive sentence requirement -->
        <div class="project-card__description-box">
          <span class="project-card__description-label">Dish Specification & Overview</span>
          <p class="project-card__description-text">${p.description}</p>
        </div>

        <div class="project-card__specs">
          <div class="spec-item">
            <span class="spec-item__label">Prep Time</span>
            <span class="spec-item__value">${p.cookTime}</span>
          </div>
          <div class="spec-item">
            <span class="spec-item__label">Complexity</span>
            <span class="spec-item__value">${p.complexity}</span>
          </div>
          <div class="spec-item">
            <span class="spec-item__label">Flavor Profile</span>
            <span class="spec-item__value">${p.heatLevel}</span>
          </div>
        </div>

        <!-- Tags without hashtags -->
        <div class="project-card__tags">
          ${p.tags.map(tag => `<span class="tag-badge">${tag}</span>`).join("")}
        </div>
      </div>
    </article>
  `).join("");
}
