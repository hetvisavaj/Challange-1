// EcoSphere - Carbon Footprint Tracker App Logic

// STATE MANAGEMENT
let state = {
  carbonProfile: {
    transport: {
      driveDistance: 120, // miles/week
      vehicleType: 'petrol', // petrol, hybrid, electric, none
      publicTransit: 6, // hours/week
      flights: 1 // flights/year
    },
    energy: {
      electricityBill: 80, // $/month
      heatingSource: 'electric', // gas, electric, coal-oil
      renewableShare: 25 // %
    },
    diet: {
      dietType: 'low-meat' // heavy-meat, low-meat, vegetarian, vegan
    },
    waste: {
      recycleHabits: 'some', // none, some, full
      shoppingHabits: 'minimal' // minimal, average, high
    },
    computed: {
      transport: 1.09,
      energy: 2.36,
      diet: 1.50,
      waste: 0.70,
      total: 5.65,
      savedLifetime: 345 // kg CO2e
    }
  },
  userProgress: {
    ecoPoints: 1250,
    xp: 850,
    level: 3,
    streak: 5,
    streakHistory: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    lastWatered: null
  },
  quests: [
    {
      id: 'meatless-monday',
      title: 'Meatless Monday',
      desc: 'Substitute meat with plant-based alternatives for all meals today.',
      type: 'daily',
      points: 100,
      carbonSaved: 8, // kg CO2
      status: 'active',
      icon: 'fa-carrot',
      color: 'icon-green'
    },
    {
      id: 'bike-to-work',
      title: 'Cycle or Walk',
      desc: 'Commute via bike, scooter, or walking instead of driving your car.',
      type: 'daily',
      points: 120,
      carbonSaved: 6,
      status: 'active',
      icon: 'fa-bicycle',
      color: 'icon-blue'
    },
    {
      id: 'unplug-electronics',
      title: 'Standby Unplug',
      desc: 'Unplug chargers, gaming systems, and TVs before sleeping.',
      type: 'daily',
      points: 50,
      carbonSaved: 1.5,
      status: 'active',
      icon: 'fa-plug',
      color: 'icon-teal'
    },
    {
      id: 'cold-wash',
      title: 'Eco-Wash Laundry',
      desc: 'Wash a full load of laundry using the cold water cycle (30°C).',
      type: 'weekly',
      points: 150,
      carbonSaved: 3,
      status: 'active',
      icon: 'fa-soap',
      color: 'icon-orange'
    },
    {
      id: 'ditch-plastic',
      title: 'Zero Single-Use',
      desc: 'Avoid all single-use plastic water bottles, coffee cups, and bags this week.',
      type: 'weekly',
      points: 200,
      carbonSaved: 12,
      status: 'active',
      icon: 'fa-bag-shopping',
      color: 'icon-green'
    },
    {
      id: 'plant-actual-seed',
      title: 'Plant a Sprout',
      desc: 'Plant a seed, flower, herb, or small plant in your home or garden.',
      type: 'special',
      points: 500,
      carbonSaved: 30,
      status: 'active',
      icon: 'fa-tree',
      color: 'icon-orange'
    }
  ],
  badges: [
    {
      id: 'first-calc',
      name: 'Carbon Analyst',
      desc: 'Completed your first carbon calculations.',
      unlocked: true,
      icon: 'fa-calculator'
    },
    {
      id: 'streak-3',
      name: 'Streak Builder',
      desc: 'Achieved a 3-day continuous habit streak.',
      unlocked: true,
      icon: 'fa-fire'
    },
    {
      id: 'forest-start',
      name: 'Forest Sprout',
      desc: 'Planted your first tree in the virtual forest.',
      unlocked: true,
      icon: 'fa-seedling'
    },
    {
      id: 'quest-5',
      name: 'Habit Master',
      desc: 'Completed 5 EcoQuests.',
      unlocked: false,
      icon: 'fa-trophy'
    },
    {
      id: 'carbon-half',
      name: 'Carbon Slasher',
      desc: 'Reduced footprint below 4.0 tons CO₂e/year.',
      unlocked: false,
      icon: 'fa-scissors'
    }
  ],
  forestItems: [], // dynamic trees & plants
  simulator: {
    reduceDrive: 0,
    greenEnergy: 0,
    meatlessDays: 0,
    thermoShift: 0
  },
  shopItems: [
    { id: 'baobab', name: 'Baobab Tree', category: 'tree', cost: 150, unlocked: false, desc: 'A majestic, thick-trunked African tree that absorbs immense CO₂.', icon: 'fa-tree' },
    { id: 'jacaranda', name: 'Jacaranda Tree', category: 'tree', cost: 200, unlocked: false, desc: 'A stunning tropical tree displaying vibrant purple flower clusters.', icon: 'fa-tree' },
    { id: 'fox', name: 'Fennec Fox', category: 'animal', cost: 300, unlocked: false, desc: 'Spawns an adorable desert fox to roam the mountains of your forest.', icon: 'fa-paw' },
    { id: 'owl', name: 'Barn Owl', category: 'animal', cost: 350, unlocked: false, desc: 'Spawns a wise owl that flies or perches in the trees of your forest.', icon: 'fa-crow' },
    { id: 'cert_amazon', name: 'Amazon Offset', category: 'cert', cost: 500, unlocked: false, desc: 'Secures a certified offset to protect 100 sqm of Amazon rainforest.', icon: 'fa-shield-halved' }
  ],
  triviaQuiz: {
    completedToday: false,
    bank: [
      {
        q: "Which of these sectors contributes the most greenhouse gas emissions globally?",
        opts: ["Electricity & Heat Production", "Transportation", "Agriculture & Forestry", "Heavy Manufacturing"],
        correct: 0,
        exp: "Electricity and heat production accounts for roughly 25% of global emissions, making it the single largest contributor, closely followed by agriculture (24%) and transportation (14%)."
      },
      {
        q: "How much carbon dioxide does an average mature tree absorb per year?",
        opts: ["About 2 kg", "About 22 kg", "About 100 kg", "About 500 kg"],
        correct: 1,
        exp: "An average mature tree absorbs roughly 22 kg (48 lbs) of carbon dioxide annually, making reforestation one of the most powerful natural climate offset systems."
      },
      {
        q: "Which household appliance typically consumes the most energy?",
        opts: ["Refrigerator", "Heating and Cooling System", "Water Heater", "Washing Machine"],
        correct: 1,
        exp: "Heating and cooling systems make up about 47% of average residential energy consumption, followed by water heating (14%) and lighting."
      },
      {
        q: "What is the primary greenhouse gas released by landfills and food waste decomposing?",
        opts: ["Carbon Dioxide", "Nitrous Oxide", "Methane", "Ozone"],
        correct: 2,
        exp: "Methane is released as organic materials decompose in oxygen-depleted landfill environments. It is over 25 times more potent than CO2 at trapping heat in the atmosphere."
      }
    ]
  }
};

// EMISSION COEFFICIENTS
const COEFFS = {
  transport: {
    vehicle: {
      petrol: 0.404, // kg CO2e per mile (average car/SUV)
      hybrid: 0.210, // kg CO2e per mile
      electric: 0.080, // kg CO2e per mile (average grid offset)
      none: 0.0
    },
    transit: 0.150, // kg CO2e per passenger mile (assuming 15 miles/hr average speed)
    flight: 280 // kg CO2e per flight
  },
  energy: {
    elecMultiplier: 8, // estimated kWh per dollar spent
    elecEmissionRate: 0.35, // kg CO2e per kWh
    heating: {
      gas: 1.2, // tons CO2e per year
      electric: 0.6, // tons CO2e per year (heat pump)
      'coal-oil': 2.4 // tons CO2e per year
    }
  },
  diet: {
    'heavy-meat': 2.5, // tons CO2e per year
    'low-meat': 1.5, // tons CO2e per year
    vegetarian: 0.9, // tons CO2e per year
    vegan: 0.5 // tons CO2e per year
  },
  waste: {
    recycle: {
      none: 0.8, // tons CO2e per year
      some: 0.4, // tons CO2e per year
      full: 0.1 // tons CO2e per year
    },
    shopping: {
      minimal: 0.3, // tons CO2e per year
      average: 0.7, // tons CO2e per year
      high: 1.5 // tons CO2e per year
    }
  }
};

// INITIALIZATION
let sessionUser = null;

document.addEventListener('DOMContentLoaded', () => {
  // Attach event listeners to replace inline handlers for CSP compliance
  const authForm = document.getElementById('auth-form');
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      if (typeof handleAuthSubmit === 'function') handleAuthSubmit(e);
    });
  }

  const toggleAuthBtn = document.getElementById('btn-toggle-auth');
  if (toggleAuthBtn) {
    toggleAuthBtn.addEventListener('click', () => {
      if (typeof toggleAuthMode === 'function') toggleAuthMode();
    });
  }

  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (typeof handleLogout === 'function') handleLogout();
    });
  }

  // Event delegation for dynamically generated elements
  const questsGrid = document.getElementById('quests-grid-element');
  if (questsGrid) {
    questsGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.quest-action-btn');
      if (btn) {
        const questId = btn.getAttribute('data-quest-id');
        if (questId && typeof completeQuest === 'function') {
          completeQuest(questId);
        }
      }
    });
  }

  const shopGrid = document.getElementById('shop-items-grid');
  if (shopGrid) {
    shopGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.shop-buy-btn');
      if (btn) {
        const itemId = btn.getAttribute('data-item-id');
        if (itemId && typeof buyShopItem === 'function') {
          buyShopItem(itemId);
        }
      }
    });
  }

  const quizBox = document.getElementById('quiz-question-box');
  if (quizBox) {
    quizBox.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-try-next');
      if (btn) {
        if (typeof tryNextQuizQuestion === 'function') {
          tryNextQuizQuestion();
        }
      }
    });
  }

  initApp();
});

function initApp() {
  const session = localStorage.getItem('ecosphere_session');
  if (session) {
    sessionUser = session;
    // Hide auth overlay
    const authOverlay = document.getElementById('auth-overlay');
    if (authOverlay) authOverlay.style.display = 'none';

    // Update welcome header
    const headerTitle = document.getElementById('header-title');
    if (headerTitle) headerTitle.textContent = `Welcome Back, ${capitalize(sessionUser)}`;

    loadStateFromLocalStorage();
    setupNavigation();
    setupCalculator();
    setupQuests();
    setupSimulator();
    setupWateringSystem();
    
    // Calculate emissions and render initially
    recalculateEmissions(false);
    
    // Ensure Virtual Forest items are generated
    syncForestItems();
    
    renderAll();
  } else {
    // Show auth overlay
    const authOverlay = document.getElementById('auth-overlay');
    if (authOverlay) authOverlay.style.display = 'flex';
    
    // Setup basic navigation so routing triggers once they log in
    setupNavigation();
  }
}

// PERSISTENCE
function saveStateToLocalStorage() {
  if (sessionUser) {
    localStorage.setItem(`ecosphere_state_${sessionUser}`, JSON.stringify(state));
  }
}

function resetStateForNewUser() {
  state.carbonProfile = {
    transport: {
      driveDistance: 120,
      vehicleType: 'petrol',
      publicTransit: 6,
      flights: 1
    },
    energy: {
      electricityBill: 80,
      heatingSource: 'electric',
      renewableShare: 25
    },
    diet: {
      dietType: 'low-meat'
    },
    waste: {
      recycleHabits: 'some',
      shoppingHabits: 'minimal'
    },
    computed: {
      transport: 1.09,
      energy: 2.36,
      diet: 1.50,
      waste: 0.70,
      total: 5.65,
      savedLifetime: 0
    }
  };
  state.userProgress = {
    ecoPoints: 100,
    xp: 0,
    level: 1,
    streak: 1,
    streakHistory: [],
    lastWatered: null
  };
  state.forestItems = []; // start empty!
  state.quests.forEach(q => q.status = 'active');
  state.badges.forEach(b => b.unlocked = false);
  state.shopItems.forEach(i => i.unlocked = false);
  state.triviaQuiz.completedToday = false;
}

function validateStateSchema(loadedState) {
  if (!loadedState || typeof loadedState !== 'object') return false;
  
  // Verify main keys exist
  if (!loadedState.carbonProfile || typeof loadedState.carbonProfile !== 'object') return false;
  if (!loadedState.userProgress || typeof loadedState.userProgress !== 'object') return false;
  if (!Array.isArray(loadedState.quests)) return false;
  if (!Array.isArray(loadedState.badges)) return false;
  if (!Array.isArray(loadedState.forestItems)) return false;
  if (!Array.isArray(loadedState.shopItems)) return false;
  if (!loadedState.triviaQuiz || typeof loadedState.triviaQuiz !== 'object') return false;
  if (typeof loadedState.triviaQuiz.completedToday !== 'boolean') return false;
  if (!Array.isArray(loadedState.triviaQuiz.bank)) return false;

  const cp = loadedState.carbonProfile;
  const up = loadedState.userProgress;

  // Verify transport types and values
  if (!cp.transport || typeof cp.transport !== 'object') return false;
  if (typeof cp.transport.driveDistance !== 'number' || isNaN(cp.transport.driveDistance) || cp.transport.driveDistance < 0) return false;
  if (typeof cp.transport.publicTransit !== 'number' || isNaN(cp.transport.publicTransit) || cp.transport.publicTransit < 0) return false;
  if (typeof cp.transport.flights !== 'number' || isNaN(cp.transport.flights) || cp.transport.flights < 0) return false;
  if (!['petrol', 'hybrid', 'electric', 'none'].includes(cp.transport.vehicleType)) return false;

  // Verify energy types and values
  if (!cp.energy || typeof cp.energy !== 'object') return false;
  if (typeof cp.energy.electricityBill !== 'number' || isNaN(cp.energy.electricityBill) || cp.energy.electricityBill < 0) return false;
  if (typeof cp.energy.renewableShare !== 'number' || isNaN(cp.energy.renewableShare) || cp.energy.renewableShare < 0 || cp.energy.renewableShare > 100) return false;
  if (!['gas', 'electric', 'coal-oil'].includes(cp.energy.heatingSource)) return false;

  // Verify diet & waste
  if (!cp.diet || typeof cp.diet !== 'object') return false;
  if (!['heavy-meat', 'low-meat', 'vegetarian', 'vegan'].includes(cp.diet.dietType)) return false;

  if (!cp.waste || typeof cp.waste !== 'object') return false;
  if (!['none', 'some', 'full'].includes(cp.waste.recycleHabits)) return false;
  if (!['minimal', 'average', 'high'].includes(cp.waste.shoppingHabits)) return false;

  // Verify computed metrics
  if (!cp.computed || typeof cp.computed !== 'object') return false;
  if (typeof cp.computed.total !== 'number' || isNaN(cp.computed.total)) return false;

  // Verify userProgress
  if (typeof up.ecoPoints !== 'number' || isNaN(up.ecoPoints) || up.ecoPoints < 0) return false;
  if (typeof up.xp !== 'number' || isNaN(up.xp) || up.xp < 0) return false;
  if (typeof up.level !== 'number' || isNaN(up.level) || up.level < 1) return false;
  if (typeof up.streak !== 'number' || isNaN(up.streak) || up.streak < 0) return false;

  return true;
}

function loadStateFromLocalStorage() {
  if (!sessionUser) return;
  const saved = localStorage.getItem(`ecosphere_state_${sessionUser}`);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        // Fallback for new features to ensure old localStorage is cleanly upgraded
        if (!parsed.shopItems) parsed.shopItems = JSON.parse(JSON.stringify(state.shopItems));
        if (!parsed.triviaQuiz) parsed.triviaQuiz = JSON.parse(JSON.stringify(state.triviaQuiz));
        if (!parsed.forestItems) parsed.forestItems = [];
        
        if (validateStateSchema(parsed)) {
          state = parsed;
          return;
        }
      }
      console.warn('Invalid state schema detected in localStorage. Reverting to default values.');
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
    }
  } else {
    // New profile, reset state values
    resetStateForNewUser();
  }
}

// VIEW SWITCHER NAVIGATION & HASH ROUTING
function handleRouting() {
  const hash = window.location.hash.substring(1) || 'dashboard';
  const navButtons = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.view-section');

  // Verify hash view exists
  const targetBtn = document.querySelector(`.nav-item[data-view="${hash}"]`);
  const targetSec = document.getElementById(`view-${hash}`);

  if (!targetSec || !targetBtn) {
    window.location.hash = 'dashboard';
    return;
  }

  // Update Active Navigation classes
  navButtons.forEach(b => b.classList.remove('active'));
  targetBtn.classList.add('active');

  // Update View Sections active state
  sections.forEach(sec => sec.classList.remove('active'));
  targetSec.classList.add('active');

  // Trigger view-specific rendering
  if (hash === 'dashboard') {
    renderCharts();
    renderDashboardRecs();
  } else if (hash === 'forest') {
    renderForestEnvironment();
  } else if (hash === 'quests') {
    renderQuests();
    renderBadges();
  } else if (hash === 'simulator') {
    runSimulation();
  } else if (hash === 'leaderboard') {
    renderLeaderboard();
  } else if (hash === 'shop') {
    renderShop();
  } else if (hash === 'quiz') {
    renderQuiz();
  }
}

function setupNavigation() {
  const navButtons = document.querySelectorAll('.nav-item');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.dataset.view;
      window.location.hash = targetView;
    });
  });

  // Set up hash change listener
  window.removeEventListener('hashchange', handleRouting);
  window.addEventListener('hashchange', handleRouting);

  // Initialize once on DOM load
  handleRouting();

  // Initialize mobile menu controls
  setupMobileMenu();
}

function setupMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('btn-close-sidebar');
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const navItems = document.querySelectorAll('.nav-item');

  if (menuToggle && sidebar && backdrop) {
    const toggleSidebar = () => {
      sidebar.classList.toggle('open');
      backdrop.classList.toggle('open');
    };

    const closeSidebar = () => {
      sidebar.classList.remove('open');
      backdrop.classList.remove('open');
    };

    menuToggle.addEventListener('click', toggleSidebar);
    
    if (closeBtn) {
      closeBtn.addEventListener('click', closeSidebar);
    }

    backdrop.addEventListener('click', closeSidebar);

    // Close the sidebar when clicking any navigation link (view changes)
    navItems.forEach(item => {
      item.addEventListener('click', closeSidebar);
    });
  }
}

// EMISSION MATHEMATICS
function recalculateEmissions(shouldSave = true) {
  const profile = state.carbonProfile;
  
  // 1. Transportation
  const driveCoeff = COEFFS.transport.vehicle[profile.transport.vehicleType];
  const driveEmissions = (profile.transport.driveDistance * driveCoeff * 52) / 1000;
  
  // Transit: hr/wk * 15 miles/hr average * coefficient * 52 wks / 1000
  const transitEmissions = (profile.transport.publicTransit * 15 * COEFFS.transport.transit * 52) / 1000;
  const flightEmissions = (profile.transport.flights * COEFFS.transport.flight) / 1000;
  profile.computed.transport = parseFloat((driveEmissions + transitEmissions + flightEmissions).toFixed(2));

  // 2. Home Energy
  const electricityKwh = profile.energy.electricityBill * COEFFS.energy.elecMultiplier;
  const electricityEmissions = (electricityKwh * COEFFS.energy.elecEmissionRate * 12) / 1000;
  // Apply Renewable Solar/Wind discount
  const electricNet = electricityEmissions * (1 - profile.energy.renewableShare / 100);
  
  const heatEmissions = COEFFS.energy.heating[profile.energy.heatingSource];
  profile.computed.energy = parseFloat((electricNet + heatEmissions).toFixed(2));

  // 3. Diet
  profile.computed.diet = COEFFS.diet[profile.diet.dietType];

  // 4. Waste & Consumption
  const wasteEmissions = COEFFS.waste.recycle[profile.waste.recycleHabits];
  const consumptionEmissions = COEFFS.waste.shopping[profile.waste.shoppingHabits];
  profile.computed.waste = parseFloat((wasteEmissions + consumptionEmissions).toFixed(2));

  // Total
  profile.computed.total = parseFloat(
    (profile.computed.transport + profile.computed.energy + profile.computed.diet + profile.computed.waste).toFixed(2)
  );

  // Check achievements related to footprint
  checkBadges();

  if (shouldSave) {
    saveStateToLocalStorage();
  }
}

// CALCULATOR HANDLERS
let currentCalcStep = 1;
function setupCalculator() {
  const steps = document.querySelectorAll('.calc-step');
  const forms = document.querySelectorAll('.calc-form-step');
  const prevBtn = document.getElementById('calc-prev');
  const nextBtn = document.getElementById('calc-next');
  
  // Connect Sliders to Val displays and State
  setupSliderListener('input-drive', 'val-drive', ' miles', (v) => {
    state.carbonProfile.transport.driveDistance = parseInt(v);
    recalculateLiveGauge();
  });
  
  setupSliderListener('input-transit', 'val-transit', ' hours/wk', (v) => {
    state.carbonProfile.transport.publicTransit = parseInt(v);
    recalculateLiveGauge();
  });

  setupSliderListener('input-flights', 'val-flights', ' flights', (v) => {
    state.carbonProfile.transport.flights = parseInt(v);
    recalculateLiveGauge();
  });

  setupSliderListener('input-electricity', 'val-electricity', '/mo', (v) => {
    state.carbonProfile.energy.electricityBill = parseInt(v);
    recalculateLiveGauge();
  }, '$');

  setupSliderListener('input-renewable', 'val-renewable', '%', (v) => {
    state.carbonProfile.energy.renewableShare = parseInt(v);
    recalculateLiveGauge();
  });

  // Option Grids click handlers
  const optionBtns = document.querySelectorAll('.option-btn');
  optionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      const value = btn.dataset.value;
      
      // Toggle selector classes
      document.querySelectorAll(`.option-btn[data-group="${group}"]`).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      
      // Update State
      if (group === 'vehicle') state.carbonProfile.transport.vehicleType = value;
      else if (group === 'heating') state.carbonProfile.energy.heatingSource = value;
      else if (group === 'diet') state.carbonProfile.diet.dietType = value;
      else if (group === 'recycle') state.carbonProfile.waste.recycleHabits = value;
      else if (group === 'shopping') state.carbonProfile.waste.shoppingHabits = value;
      
      recalculateLiveGauge();
    });
  });

  // Sync Input Elements with current State values (in case loaded from LS)
  syncCalculatorInputsWithState();

  // Wizard Step Switching
  nextBtn.addEventListener('click', () => {
    if (currentCalcStep < 4) {
      changeStep(currentCalcStep + 1);
    } else {
      // Step 4 Complete -> Save and return to Dashboard
      recalculateEmissions(true);
      syncForestItems();
      
      // Increment points for updating calculator (if first time)
      if (!isBadgeUnlocked('first-calc')) {
        unlockBadge('first-calc');
        addXP(150);
        addEcoPoints(200);
        alert('🎉 Carbon Footprint profile saved! Unlocked badge "Carbon Analyst" and earned 200 EcoPoints.');
      } else {
        alert('🌿 Your Carbon Footprint profile has been successfully updated.');
      }
      
      // Navigate to dashboard
      document.getElementById('nav-dashboard').click();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentCalcStep > 1) {
      changeStep(currentCalcStep - 1);
    }
  });

  function changeStep(newStep) {
    currentCalcStep = newStep;
    
    // Update step indicator classes
    steps.forEach((s, idx) => {
      s.classList.remove('active', 'completed');
      if (idx + 1 < currentCalcStep) s.classList.add('completed');
      else if (idx + 1 === currentCalcStep) s.classList.add('active');
    });

    // Update Forms Active state
    forms.forEach(form => {
      form.classList.remove('active');
      if (parseInt(form.dataset.step) === currentCalcStep) {
        form.classList.add('active');
      }
    });

    // Controls status
    if (currentCalcStep === 1) {
      prevBtn.classList.add('disabled');
      prevBtn.disabled = true;
    } else {
      prevBtn.classList.remove('disabled');
      prevBtn.disabled = false;
    }

    if (currentCalcStep === 4) {
      nextBtn.innerHTML = 'Save Profile <i class="fa-solid fa-cloud-arrow-up"></i>';
    } else {
      nextBtn.innerHTML = 'Next <i class="fa-solid fa-chevron-right"></i>';
    }
  }

  // Live estimator logic
  recalculateLiveGauge();
}

function syncCalculatorInputsWithState() {
  const p = state.carbonProfile;
  
  // Set slider positions
  document.getElementById('input-drive').value = p.transport.driveDistance;
  document.getElementById('val-drive').textContent = p.transport.driveDistance + ' miles';
  
  document.getElementById('input-transit').value = p.transport.publicTransit;
  document.getElementById('val-transit').textContent = p.transport.publicTransit + ' hours/wk';

  document.getElementById('input-flights').value = p.transport.flights;
  document.getElementById('val-flights').textContent = p.transport.flights + ' flights';

  document.getElementById('input-electricity').value = p.energy.electricityBill;
  document.getElementById('val-electricity').textContent = '$' + p.energy.electricityBill + '/mo';

  document.getElementById('input-renewable').value = p.energy.renewableShare;
  document.getElementById('val-renewable').textContent = p.energy.renewableShare + '%';

  // Selected Option button sync helper
  const syncGroupBtn = (group, value) => {
    document.querySelectorAll(`.option-btn[data-group="${group}"]`).forEach(btn => {
      btn.classList.remove('selected');
      if (btn.dataset.value === value) btn.classList.add('selected');
    });
  };

  syncGroupBtn('vehicle', p.transport.vehicleType);
  syncGroupBtn('heating', p.energy.heatingSource);
  syncGroupBtn('diet', p.diet.dietType);
  syncGroupBtn('recycle', p.waste.recycleHabits);
  syncGroupBtn('shopping', p.waste.shoppingHabits);
}

function setupSliderListener(sliderId, valId, suffix, stateUpdater, prefix = '') {
  const slider = document.getElementById(sliderId);
  const valEl = document.getElementById(valId);
  if (!slider) return;
  
  slider.addEventListener('input', (e) => {
    const val = e.target.value;
    valEl.textContent = `${prefix}${val}${suffix}`;
    stateUpdater(val);
  });
}

function recalculateLiveGauge() {
  // We compute a temp emission rate without saving to state permanently.
  const profile = state.carbonProfile;
  const driveCoeff = COEFFS.transport.vehicle[profile.transport.vehicleType];
  const drive = (profile.transport.driveDistance * driveCoeff * 52) / 1000;
  const transit = (profile.transport.publicTransit * 15 * COEFFS.transport.transit * 52) / 1000;
  const flight = (profile.transport.flights * COEFFS.transport.flight) / 1000;
  
  const electricityKwh = profile.energy.electricityBill * COEFFS.energy.elecMultiplier;
  const electric = (electricityKwh * COEFFS.energy.elecEmissionRate * 12) / 1000 * (1 - profile.energy.renewableShare / 100);
  const heating = COEFFS.energy.heating[profile.energy.heatingSource];

  const diet = COEFFS.diet[profile.diet.dietType];
  const waste = COEFFS.waste.recycle[profile.waste.recycleHabits];
  const shopping = COEFFS.waste.shopping[profile.waste.shoppingHabits];

  const liveTotal = parseFloat((drive + transit + flight + electric + heating + diet + waste + shopping).toFixed(1));
  
  // Render live gauge
  const numText = document.getElementById('calc-live-num');
  if (numText) numText.textContent = liveTotal;

  const gaugeFill = document.getElementById('calc-live-fill');
  if (gaugeFill) {
    // max gauge represents 16 tons.
    const maxVal = 16;
    const percentage = Math.min(liveTotal / maxVal, 1);
    const radius = 40;
    const circ = 2 * Math.PI * radius; // 251.3
    const offset = circ - (percentage * circ);
    gaugeFill.style.strokeDasharray = circ;
    gaugeFill.style.strokeDashoffset = offset;
    
    // Change gauge color based on intensity
    if (liveTotal <= 3.0) {
      gaugeFill.style.stroke = '#34d399'; // Mint
    } else if (liveTotal <= 7.0) {
      gaugeFill.style.stroke = '#10b981'; // Emerald
    } else if (liveTotal <= 11.0) {
      gaugeFill.style.stroke = '#f59e0b'; // Amber
    } else {
      gaugeFill.style.stroke = '#ef4444'; // Red
    }
  }
}

// RENDERING ELEMENTS
function renderAll() {
  // Main Top Indicators
  document.getElementById('total-points').textContent = state.userProgress.ecoPoints.toLocaleString();
  document.getElementById('streak-count').textContent = state.userProgress.streak;
  
  // Level metrics
  document.querySelector('.level-badge').textContent = `Lv. ${state.userProgress.level}`;
  document.getElementById('level-progress').style.width = `${(state.userProgress.xp / 1000) * 100}%`;
  document.getElementById('current-xp').textContent = state.userProgress.xp;

  // Mini badge card footer
  const titles = ['Eco Explorer', 'Carbon Cutter', 'Green Warrior', 'Forest Guardian', 'Planet Hero'];
  const lvlIdx = Math.min(state.userProgress.level - 1, titles.length - 1);
  document.querySelector('.badge-title').textContent = titles[lvlIdx];
  document.querySelector('.badge-sub').textContent = `Level ${state.userProgress.level} Warrior`;

  // Dashboard calculations
  document.getElementById('dash-carbon-value').textContent = state.carbonProfile.computed.total;
  document.getElementById('dash-saved-value').textContent = state.carbonProfile.computed.savedLifetime;
  document.getElementById('dash-trees-value').textContent = state.forestItems.filter(i => i.category === 'tree').length;

  // Set national average comparison based on computed total
  const deltaText = document.querySelector('.card-carbon .metric-delta span');
  const deltaIcon = document.querySelector('.card-carbon .metric-delta i');
  const deltaContainer = document.querySelector('.card-carbon .metric-delta');
  
  const nationalAvg = 12.0; // ton avg
  const pctDiff = Math.round(((nationalAvg - state.carbonProfile.computed.total) / nationalAvg) * 100);
  
  if (pctDiff > 0) {
    deltaContainer.className = 'metric-delta positive';
    deltaIcon.className = 'fa-solid fa-arrow-trend-down';
    deltaText.textContent = `${pctDiff}% lower than national average`;
  } else {
    deltaContainer.className = 'metric-delta text-red';
    deltaIcon.className = 'fa-solid fa-arrow-trend-up';
    deltaText.textContent = `${Math.abs(pctDiff)}% higher than national average`;
  }

  // Draw Charts
  renderCharts();
  renderDashboardRecs();
  
  // Sync Virtual Forest counters
  updateForestHeaderCounters();
}

// SVG DATA VISUALIZATION
function renderCharts() {
  renderDonutChart();
  renderTrendChart();
}

function renderDonutChart() {
  const donutG = document.getElementById('donut-segments');
  const legendEl = document.getElementById('donut-legend');
  if (!donutG || !legendEl) return;
  
  donutG.innerHTML = '';
  legendEl.innerHTML = '';
  
  const c = state.carbonProfile.computed;
  const categories = [
    { name: 'Transport', val: c.transport, color: '#3b82f6', icon: 'fa-car' },
    { name: 'Home Energy', val: c.energy, color: '#10b981', icon: 'fa-house' },
    { name: 'Diet & Food', val: c.diet, color: '#34d399', icon: 'fa-utensils' },
    { name: 'Waste', val: c.waste, color: '#0d9488', icon: 'fa-trash-can' }
  ];
  
  const totalVal = c.total || 0.1; // avoid divide by zero
  document.getElementById('donut-center-num').textContent = totalVal;
  
  let currentOffset = 0;
  const radius = 70;
  const circumference = 2 * Math.PI * radius; // 439.8

  categories.forEach(cat => {
    const percentage = cat.val / totalVal;
    const dashArray = `${percentage * circumference} ${circumference}`;
    // Circle segment
    const segment = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    segment.setAttribute('cx', '100');
    segment.setAttribute('cy', '100');
    segment.setAttribute('r', radius.toString());
    segment.setAttribute('class', 'donut-segment');
    segment.setAttribute('stroke', cat.color);
    segment.setAttribute('stroke-dasharray', dashArray);
    segment.setAttribute('stroke-dashoffset', (-currentOffset).toString());
    segment.setAttribute('transform', 'rotate(-90 100 100)'); // Start at top
    
    // Simple tooltip showing amount
    segment.innerHTML = `<title>${cat.name}: ${cat.val} tons (${Math.round(percentage * 100)}%)</title>`;
    
    donutG.appendChild(segment);
    currentOffset += percentage * circumference;

    // Legend item
    const legItem = document.createElement('div');
    legItem.className = 'legend-item';
    legItem.innerHTML = `
      <div class="legend-label-group">
        <div class="legend-color-dot" style="background-color: ${cat.color};"></div>
        <span class="legend-text"><i class="fa-solid ${cat.icon} text-muted" style="margin-right: 4px;"></i> ${cat.name}</span>
      </div>
      <span class="legend-val">${cat.val} t</span>
    `;
    legendEl.appendChild(legItem);
  });
}

function renderTrendChart() {
  const areaPath = document.getElementById('trend-area-path');
  const linePath = document.getElementById('trend-line-path');
  const dotsG = document.getElementById('trend-dots');
  const monthsDiv = document.getElementById('trend-months');
  
  if (!linePath || !dotsG || !monthsDiv) return;
  
  dotsG.innerHTML = '';
  monthsDiv.innerHTML = '';
  
  // Historical trend data (Mocked relative to user's currently computed carbon footprint)
  const currentTotal = state.carbonProfile.computed.total;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  // Show historical reduction trend
  const historicalEmissions = [
    parseFloat((currentTotal * 1.35).toFixed(2)),
    parseFloat((currentTotal * 1.25).toFixed(2)),
    parseFloat((currentTotal * 1.18).toFixed(2)),
    parseFloat((currentTotal * 1.09).toFixed(2)),
    parseFloat((currentTotal * 1.05).toFixed(2)),
    currentTotal
  ];
  
  // Scale mapping parameters: X between 40 and 380, Y between 20 and 170
  const widthRange = 340; // 380 - 40
  const heightRange = 150; // 170 - 20
  const maxEmissions = Math.max(...historicalEmissions) * 1.1; // pad height
  
  const getCoordinates = (index, value) => {
    const x = 40 + (index / (months.length - 1)) * widthRange;
    // Lower emissions should plot LOWER in the screen, meaning HIGHER Y value in SVG coordinate layout
    // 0 emissions -> 170 Y (bottom). Max emissions -> 20 Y (top).
    const y = 170 - (value / maxEmissions) * heightRange;
    return { x, y };
  };

  let points = [];
  months.forEach((m, idx) => {
    const val = historicalEmissions[idx];
    const coords = getCoordinates(idx, val);
    points.push(coords);

    // Append Month text
    const label = document.createElement('span');
    label.textContent = m;
    monthsDiv.appendChild(label);

    // Draw interactive SVG points
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', coords.x.toString());
    dot.setAttribute('cy', coords.y.toString());
    dot.setAttribute('class', 'trend-point');
    dot.innerHTML = `<title>${m}: ${val} tons CO₂e</title>`;
    dotsG.appendChild(dot);
  });

  // Build SVG path commands
  // Line Path: M x0 y0 L x1 y1 ...
  let dLine = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    dLine += ` L ${points[i].x} ${points[i].y}`;
  }
  linePath.setAttribute('d', dLine);

  // Area Path: M x0 y0 L x1 y1 ... L xLast yBottom L x0 yBottom Z
  let dArea = `${dLine} L ${points[points.length - 1].x} 170 L ${points[0].x} 170 Z`;
  areaPath.setAttribute('d', dArea);

  // Gradient definitions (inject once if not present)
  let defs = document.querySelector('#trend-chart defs');
  if (!defs) {
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    document.getElementById('trend-chart').appendChild(defs);
  }
  
  if (!document.getElementById('trend-area-grad')) {
    defs.innerHTML = `
      <linearGradient id="trend-area-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.4"></stop>
        <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"></stop>
      </linearGradient>
    `;
  }
}

function renderDashboardRecs() {
  const container = document.getElementById('dashboard-recs');
  if (!container) return;
  container.innerHTML = '';

  const c = state.carbonProfile.computed;
  const recs = [];

  // Generate dynamic recommendations based on profile metrics
  if (c.transport > 2.0) {
    recs.push({
      title: 'Reduce Car Driving',
      desc: 'Vehicle fuels represent your largest emission source. Try carpooling, biking, or taking transit twice a week.',
      impact: 'Saves up to 850kg CO₂ / yr',
      icon: 'fa-car-side',
      color: 'icon-blue'
    });
  }
  if (state.carbonProfile.energy.renewableShare < 50) {
    recs.push({
      title: 'Upgrade Solar Grid share',
      desc: 'Switch to a green utility tariff or install home solar panels to transition your electricity away from coal.',
      impact: 'Saves up to 1,200kg CO₂ / yr',
      icon: 'fa-solar-panel',
      color: 'icon-orange'
    });
  }
  if (state.carbonProfile.diet.dietType === 'heavy-meat') {
    recs.push({
      title: 'Implement Meatless Days',
      desc: 'Beef and pork have heavy production impacts. Try swapping red meats for fish or legumes 3 days a week.',
      impact: 'Saves up to 450kg CO₂ / yr',
      icon: 'fa-utensils',
      color: 'icon-green'
    });
  }
  if (state.carbonProfile.waste.recycleHabits === 'none') {
    recs.push({
      title: 'Begin Organic Composting',
      desc: 'Food scraps decomposing in landfills produce methane. Start composting basic organic waste at home.',
      impact: 'Saves up to 200kg CO₂ / yr',
      icon: 'fa-recycle',
      color: 'icon-teal'
    });
  }

  // Fallbacks if user is already highly eco-conscious
  if (recs.length < 2) {
    recs.push({
      title: 'Eco-Temperature Settings',
      desc: 'Adjust your winter heating 2°F down and summer AC 2°F up to conserve massive gas/electric overheads.',
      impact: 'Saves up to 180kg CO₂ / yr',
      icon: 'fa-temperature-half',
      color: 'icon-teal'
    });
    recs.push({
      title: 'Encourage Community actions',
      desc: 'Engage in local cleanups or gift cards to sustainable shops to spread the ecosystem impact.',
      impact: 'Multiplier Impact',
      icon: 'fa-people-group',
      color: 'icon-green'
    });
  }

  // Draw two recommended cards
  recs.slice(0, 2).forEach(rec => {
    const card = document.createElement('div');
    card.className = 'rec-item';
    card.innerHTML = `
      <div class="rec-icon ${rec.color}">
        <i class="fa-solid ${rec.icon}"></i>
      </div>
      <div class="rec-details">
        <h4 class="rec-title">${rec.title}</h4>
        <span class="rec-desc">${rec.desc}</span>
        <span class="rec-impact">${rec.impact}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

// ECOQUESTS SYSTEM
function setupQuests() {
  // Filters click listener
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderQuests(btn.dataset.filter);
    });
  });

  // Render weekly streak tracker
  renderStreakDots();
}

function renderStreakDots() {
  const dotsContainer = document.getElementById('streak-dots-container');
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIndex = new Date().getDay(); // 0-6
  
  weekdays.forEach((day, idx) => {
    const dot = document.createElement('div');
    
    // Check if day is completed, active today, or future
    let statusClass = '';
    let iconHTML = day[0];
    
    if (state.userProgress.streakHistory.includes(day)) {
      statusClass = 'completed';
      iconHTML = '<i class="fa-solid fa-check"></i>';
    } else if (idx === todayIndex) {
      statusClass = 'active';
      iconHTML = '<i class="fa-solid fa-fire"></i>';
    }
    
    dot.className = `streak-dot ${statusClass}`;
    dot.innerHTML = iconHTML;
    dot.title = `${day} Status`;
    dotsContainer.appendChild(dot);
  });
}

function renderQuests(filter = 'all') {
  const grid = document.getElementById('quests-grid-element');
  if (!grid) return;
  grid.innerHTML = '';

  const activeQuests = state.quests.filter(q => {
    if (filter === 'all') return true;
    return q.type === filter;
  });

  activeQuests.forEach(quest => {
    const card = document.createElement('div');
    const isCompleted = quest.status === 'completed';
    card.className = `quest-card ${isCompleted ? 'claimed' : ''}`;
    
    // Progress calculation for display
    const progressVal = isCompleted ? 100 : 0;
    
    card.innerHTML = `
      <span class="quest-type-badge badge-${quest.type}">${quest.type}</span>
      <div class="quest-icon-box ${quest.color}">
        <i class="fa-solid ${quest.icon}"></i>
      </div>
      <h4>${quest.title}</h4>
      <p class="quest-desc">${quest.desc}</p>
      <div class="quest-points">+${quest.points} pts | Save ${quest.carbonSaved}kg CO₂</div>
      <div class="quest-progress-bar-bg">
        <div class="quest-progress-bar-fill" style="width: ${progressVal}%;"></div>
      </div>
      <button class="quest-action-btn" data-quest-id="${quest.id}" ${isCompleted ? 'disabled' : ''}>
        ${isCompleted ? '<i class="fa-solid fa-circle-check"></i> Claimed' : 'Complete Quest'}
      </button>
    `;
    grid.appendChild(card);
  });
}

// Global scope attachment for HTML onclick
window.completeQuest = function(questId) {
  const quest = state.quests.find(q => q.id === questId);
  if (!quest || quest.status === 'completed') return;

  // Update status
  quest.status = 'completed';
  
  // Award EcoPoints and XP
  addEcoPoints(quest.points);
  addXP(quest.points); // XP matches point yields
  
  // Subtract from lifetime carbon emissions
  state.carbonProfile.computed.savedLifetime += quest.carbonSaved;

  // Add streak checks
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayDayName = daysOfWeek[new Date().getDay()];
  if (!state.userProgress.streakHistory.includes(todayDayName)) {
    state.userProgress.streakHistory.push(todayDayName);
    state.userProgress.streak += 1;
  }

  // Plant a new tree if points crossed threshold
  syncForestItems();
  
  // Re-check achievements
  checkBadges();
  
  saveStateToLocalStorage();
  renderAll();
  renderQuests(document.querySelector('.filter-btn.active').dataset.filter);
  renderStreakDots();

  alert(`🌟 EcoQuest "${quest.title}" completed! \n+${quest.points} EcoPoints, saved ${quest.carbonSaved}kg CO₂!`);
};

// BADGES ACHIEVEMENTS LOCKER
function renderBadges() {
  const container = document.getElementById('badges-grid-element');
  if (!container) return;
  container.innerHTML = '';

  state.badges.forEach(badge => {
    const card = document.createElement('div');
    card.className = `badge-item ${badge.unlocked ? 'unlocked' : ''}`;
    
    card.innerHTML = `
      <div class="badge-icon" title="${badge.unlocked ? 'Unlocked!' : 'Locked'}">
        <i class="fa-solid ${badge.icon}"></i>
      </div>
      <div class="badge-name">${badge.name}</div>
      <div class="badge-desc">${badge.desc}</div>
    `;
    container.appendChild(card);
  });
}

function isBadgeUnlocked(badgeId) {
  const badge = state.badges.find(b => b.id === badgeId);
  return badge ? badge.unlocked : false;
}

function unlockBadge(badgeId) {
  const badge = state.badges.find(b => b.id === badgeId);
  if (badge && !badge.unlocked) {
    badge.unlocked = true;
    addXP(100); // Level bonus XP
    saveStateToLocalStorage();
  }
}

function checkBadges() {
  // 1. Streak badge
  if (state.userProgress.streak >= 3) {
    unlockBadge('streak-3');
  }
  // 2. Active tree badges
  const totalTrees = Math.floor(state.userProgress.ecoPoints / 100);
  if (totalTrees >= 1) {
    unlockBadge('forest-start');
  }
  // 3. Quests completed count
  const completedCount = state.quests.filter(q => q.status === 'completed').length;
  if (completedCount >= 5) {
    unlockBadge('quest-5');
  }
  // 4. Low Carbon Profile
  if (state.carbonProfile.computed.total <= 4.0) {
    unlockBadge('carbon-half');
  }
}

// LEVEL & POINT UTILITIES
function addEcoPoints(pts) {
  state.userProgress.ecoPoints += pts;
}

function addXP(amount) {
  state.userProgress.xp += amount;
  
  // Level up trigger at 1000 XP
  if (state.userProgress.xp >= 1000) {
    state.userProgress.level += 1;
    state.userProgress.xp -= 1000;
    
    // Level up reward
    alert(`⚡ LEVEL UP! You are now Level ${state.userProgress.level}!\nUnlocked new wildlife companion rewards in your Virtual Forest.`);
    
    // Level up check recursive just in case XP exceeds 2000
    if (state.userProgress.xp >= 1000) {
      addXP(0);
    }
  }
}

// VIRTUAL FOREST CORE GENERATION
function syncForestItems() {
  const totalPoints = state.userProgress.ecoPoints;
  const targetTreeCount = Math.floor(totalPoints / 100); // 1 tree per 100 points
  
  // Determine target plant/wildlife count based on level and streaks
  const targetPlantCount = Math.min(Math.floor(state.userProgress.streak * 1.5), 10);
  const targetAnimalCount = Math.max(state.userProgress.level - 1, 0); // 1 animal per level above 1
  
  let currentTrees = state.forestItems.filter(item => item.category === 'tree').length;
  let currentPlants = state.forestItems.filter(item => item.category === 'plant').length;
  let currentAnimals = state.forestItems.filter(item => item.category === 'animal').length;
  
  // Grow trees if needed
  while (currentTrees < targetTreeCount) {
    const types = ['oak', 'pine', 'cherry'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    // Select a random point on terrain
    const x = Math.floor(Math.random() * 700) + 50; // bounds: 50-750
    const terrainDetails = getTerrainHeightAndColorAtX(x);
    
    // Record tree details
    state.forestItems.push({
      id: `tree_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      category: 'tree',
      type: type,
      x: x,
      y: terrainDetails.y,
      scale: parseFloat((Math.random() * 0.4 + 0.6).toFixed(2)), // scale between 0.6 and 1.0
      terrain: terrainDetails.terrain,
      timestamp: new Date().toLocaleDateString(),
      details: `EcoPoint Growth Threshold`
    });
    currentTrees++;
  }

  // Grow plants if needed
  while (currentPlants < targetPlantCount) {
    const types = ['shrub', 'wildflower'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const x = Math.floor(Math.random() * 720) + 40;
    const terrainDetails = getTerrainHeightAndColorAtX(x);
    
    state.forestItems.push({
      id: `plant_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      category: 'plant',
      type: type,
      x: x,
      y: terrainDetails.y,
      scale: parseFloat((Math.random() * 0.3 + 0.4).toFixed(2)), // 0.4 to 0.7
      terrain: terrainDetails.terrain,
      timestamp: new Date().toLocaleDateString(),
      details: `Streak Habit Growth`
    });
    currentPlants++;
  }

  // Spawn animals if needed
  while (currentAnimals < targetAnimalCount) {
    const types = ['rabbit', 'deer', 'bird'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const x = Math.floor(Math.random() * 680) + 60;
    const terrainDetails = getTerrainHeightAndColorAtX(x);
    
    // Birds float in the sky
    const finalY = type === 'bird' ? Math.floor(Math.random() * 80) + 80 : terrainDetails.y;
    
    state.forestItems.push({
      id: `animal_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      category: 'animal',
      type: type,
      x: x,
      y: finalY,
      scale: parseFloat((Math.random() * 0.2 + 0.6).toFixed(2)),
      terrain: terrainDetails.terrain,
      timestamp: new Date().toLocaleDateString(),
      details: `Eco Warrior Level Unlock`
    });
    currentAnimals++;
  }
}

// Helpers to fit assets onto mountains/ground layers
function getTerrainHeightAndColorAtX(x) {
  // Approximate height maps of the hills inside SVG viewBox (800 x 400)
  // Back Hill: Y = 400 to 240 (roughly 270 center)
  // Mid Hill: Y = 400 to 290
  // Front Ground: Y = 400 to 340
  const terrainType = Math.random();
  if (terrainType < 0.25) {
    // Back hill
    // Equation: y = 260 + 50 * sin(x/200) approx
    const yVal = 260 + Math.sin(x / 120) * 30;
    return { y: parseFloat(yVal.toFixed(0)), terrain: 'back', color: '#1a4030' };
  } else if (terrainType < 0.6) {
    // Mid hill
    const yVal = 300 + Math.sin(x / 100) * 25;
    return { y: parseFloat(yVal.toFixed(0)), terrain: 'mid', color: '#1e5436' };
  } else {
    // Front Ground
    const yVal = 350 + Math.sin(x / 150) * 15;
    return { y: parseFloat(yVal.toFixed(0)), terrain: 'front', color: '#2d8249' };
  }
}

function updateForestHeaderCounters() {
  const trees = state.forestItems.filter(i => i.category === 'tree').length;
  const plants = state.forestItems.filter(i => i.category === 'plant').length;
  const animals = state.forestItems.filter(i => i.category === 'animal').length;
  
  const trText = document.getElementById('forest-tree-count');
  if (trText) trText.textContent = trees;
  
  const plText = document.getElementById('forest-shrub-count');
  if (plText) plText.textContent = plants;

  const anText = document.getElementById('forest-animal-count');
  if (anText) anText.textContent = animals;
  
  // Update planting log list
  const logList = document.getElementById('planting-log-list');
  if (logList) {
    logList.innerHTML = '';
    // Reverse chronological order
    const logs = [...state.forestItems].reverse().slice(0, 5);
    if (logs.length === 0) {
      logList.innerHTML = '<li style="font-size: 11px; color: var(--text-muted); text-align: center;">Your forest is ready to sprout! Earn points to plant.</li>';
    } else {
      logs.forEach(log => {
        const li = document.createElement('li');
        li.className = 'planting-list-item';
        
        let icon = '<i class="fa-solid fa-tree text-green"></i>';
        if (log.category === 'plant') icon = '<i class="fa-solid fa-seedling text-emerald"></i>';
        else if (log.category === 'animal') icon = '<i class="fa-solid fa-paw text-orange"></i>';
        
        li.innerHTML = `
          <div>
            ${icon} <span style="font-weight: 700; margin-left: 6px;">${capitalize(log.type)} ${capitalize(log.category)}</span>
          </div>
          <span class="time-stamp">${log.timestamp}</span>
        `;
        logList.appendChild(li);
      });
    }
  }
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// FOREST RENDERING ENGINES (SVG Drawing)
function renderForestEnvironment() {
  const foliageG = document.getElementById('forest-foliage');
  if (!foliageG) return;
  foliageG.innerHTML = '';
  
  // Sort items based on terrain layer depth: back hill first, then mid, then front (ground)
  const sortedItems = [...state.forestItems].sort((a, b) => {
    const layers = { 'back': 1, 'mid': 2, 'front': 3 };
    const aVal = layers[a.terrain] || 2;
    const bVal = layers[b.terrain] || 2;
    if (aVal !== bVal) return aVal - bVal;
    return a.y - b.y; // sort by Y coordinate height as a sub-depth
  });

  sortedItems.forEach(item => {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('transform', `translate(${item.x}, ${item.y}) scale(${item.scale})`);
    group.setAttribute('class', 'sway-element');
    
    // Injected assets custom models
    if (item.category === 'tree') {
      if (item.type === 'oak') {
        drawOakTree(group);
      } else if (item.type === 'pine') {
        drawPineTree(group);
      } else if (item.type === 'cherry') {
        drawCherryBlossom(group);
      } else if (item.type === 'baobab') {
        drawBaobab(group);
      } else if (item.type === 'jacaranda') {
        drawJacaranda(group);
      }
    } else if (item.category === 'plant') {
      if (item.type === 'shrub') {
        drawShrub(group);
      } else {
        drawWildflower(group);
      }
    } else if (item.category === 'animal') {
      if (item.type === 'rabbit') {
        drawRabbit(group);
      } else if (item.type === 'deer') {
        drawDeer(group);
      } else if (item.type === 'fox') {
        drawFox(group);
      } else if (item.type === 'owl') {
        drawOwl(group);
      } else {
        drawBird(group);
      }
    }
    
    foliageG.appendChild(group);
  });
}

// SVG Drawing Components
function drawOakTree(group) {
  // Trunk
  const trunk = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  trunk.setAttribute('d', 'M -4 0 L -2 -45 Q 0 -48 2 -45 L 4 0 Z');
  trunk.setAttribute('fill', '#5c4033');
  group.appendChild(trunk);
  
  // Foliage
  const canopy = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  canopy.setAttribute('d', 'M -18 -45 a 15 15 0 0 1 15 -10 a 18 18 0 0 1 20 -3 a 15 15 0 0 1 15 12 a 15 15 0 0 1 -3 18 a 15 15 0 0 1 -18 8 a 15 15 0 0 1 -20 -8 a 15 15 0 0 1 -9 -17 z');
  canopy.setAttribute('fill', '#14532d'); // Deep green
  group.appendChild(canopy);
  
  // Highlight
  const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  highlight.setAttribute('cx', '2');
  highlight.setAttribute('cy', '-50');
  highlight.setAttribute('r', '10');
  highlight.setAttribute('fill', '#166534');
  highlight.setAttribute('opacity', '0.6');
  group.appendChild(highlight);
}

function drawPineTree(group) {
  // Trunk
  const trunk = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  trunk.setAttribute('x', '-3');
  trunk.setAttribute('y', '-30');
  trunk.setAttribute('width', '6');
  trunk.setAttribute('height', '30');
  trunk.setAttribute('fill', '#483c32');
  group.appendChild(trunk);

  // Pine Triangles
  const leaves1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  leaves1.setAttribute('points', '-22,-25 0,-55 22,-25');
  leaves1.setAttribute('fill', '#064e3b'); // Dark pine green
  group.appendChild(leaves1);

  const leaves2 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  leaves2.setAttribute('points', '-18,-45 0,-70 18,-45');
  leaves2.setAttribute('fill', '#0f766e');
  group.appendChild(leaves2);

  const leaves3 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  leaves3.setAttribute('points', '-14,-60 0,-85 14,-60');
  leaves3.setAttribute('fill', '#115e59');
  group.appendChild(leaves3);
}

function drawCherryBlossom(group) {
  // Trunk
  const trunk = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  trunk.setAttribute('d', 'M -4 0 Q -6 -25 -2 -42 T 4 -60 L 6 -56 Q 3 -42 0 -22 Z');
  trunk.setAttribute('fill', '#3e2723');
  group.appendChild(trunk);

  // Pink Blossom canopy
  const blossom = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  blossom.setAttribute('d', 'M -14 -60 a 12 12 0 0 1 12 -12 a 15 15 0 0 1 18 -4 a 12 12 0 0 1 14 12 a 12 12 0 0 1 -4 14 a 12 12 0 0 1 -14 6 a 12 12 0 0 1 -16 -6 z');
  blossom.setAttribute('fill', '#f472b6'); // Cherry pink
  group.appendChild(blossom);

  // Small blossom detail dot
  const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  dot.setAttribute('cx', '5');
  dot.setAttribute('cy', '-62');
  dot.setAttribute('r', '8');
  dot.setAttribute('fill', '#f43f5e');
  dot.setAttribute('opacity', '0.7');
  group.appendChild(dot);
}

function drawShrub(group) {
  const shrub = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  shrub.setAttribute('d', 'M -10 0 a 8 8 0 0 1 6 -8 a 8 8 0 0 1 8 -2 a 8 8 0 0 1 8 4 a 8 8 0 0 1 -4 6 z');
  shrub.setAttribute('fill', '#065f46');
  group.appendChild(shrub);
}

function drawWildflower(group) {
  // Stem
  const stem = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  stem.setAttribute('x1', '0');
  stem.setAttribute('y1', '0');
  stem.setAttribute('x2', '0');
  stem.setAttribute('y2', '-14');
  stem.setAttribute('stroke', '#047857');
  stem.setAttribute('stroke-width', '2');
  group.appendChild(stem);

  // Leaves
  const leaf = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  leaf.setAttribute('d', 'M 0 -6 Q -5 -8 -2 -11 Z');
  leaf.setAttribute('fill', '#059669');
  group.appendChild(leaf);

  // Petals
  const colors = ['#f59e0b', '#ec4899', '#f43f5e', '#a855f7'];
  const petalColor = colors[Math.floor(Math.random() * colors.length)];
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 * Math.PI) / 180;
    const px = Math.sin(angle) * 3;
    const py = -14 + Math.cos(angle) * 3;
    const petal = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    petal.setAttribute('cx', px.toString());
    petal.setAttribute('cy', py.toString());
    petal.setAttribute('r', '3');
    petal.setAttribute('fill', petalColor);
    group.appendChild(petal);
  }
  
  // Center yellow dot
  const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  center.setAttribute('cx', '0');
  center.setAttribute('cy', '-14');
  center.setAttribute('r', '2.2');
  center.setAttribute('fill', '#fef08a');
  group.appendChild(center);
}

function drawRabbit(group) {
  // Body
  const body = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  body.setAttribute('cx', '0');
  body.setAttribute('cy', '-6');
  body.setAttribute('rx', '8');
  body.setAttribute('ry', '6');
  body.setAttribute('fill', '#a1a1aa');
  group.appendChild(body);

  // Head
  const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  head.setAttribute('cx', '-7');
  head.setAttribute('cy', '-10');
  head.setAttribute('r', '4');
  head.setAttribute('fill', '#a1a1aa');
  group.appendChild(head);

  // Ears
  const ear1 = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  ear1.setAttribute('cx', '-7');
  ear1.setAttribute('cy', '-16');
  ear1.setAttribute('rx', '1.2');
  ear1.setAttribute('ry', '4');
  ear1.setAttribute('fill', '#d4d4d8');
  group.appendChild(ear1);

  // Tail
  const tail = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  tail.setAttribute('cx', '7');
  tail.setAttribute('cy', '-8');
  tail.setAttribute('r', '2');
  tail.setAttribute('fill', '#e4e4e7');
  group.appendChild(tail);
}

function drawDeer(group) {
  // Legs
  const drawLeg = (x) => {
    const leg = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    leg.setAttribute('x1', x.toString());
    leg.setAttribute('y1', '0');
    leg.setAttribute('x2', x.toString());
    leg.setAttribute('y2', '-18');
    leg.setAttribute('stroke', '#b45309');
    leg.setAttribute('stroke-width', '2');
    group.appendChild(leg);
  };
  drawLeg(-8);
  drawLeg(-4);
  drawLeg(4);
  drawLeg(8);

  // Body
  const body = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  body.setAttribute('cx', '0');
  body.setAttribute('cy', '-22');
  body.setAttribute('rx', '12');
  body.setAttribute('ry', '7');
  body.setAttribute('fill', '#d97706'); // Orange/Brown deer
  group.appendChild(body);

  // Neck
  const neck = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  neck.setAttribute('d', 'M -10 -25 L -4 -38 L 0 -38 L -6 -22 Z');
  neck.setAttribute('fill', '#d97706');
  group.appendChild(neck);

  // Head
  const head = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  head.setAttribute('cx', '-3');
  head.setAttribute('cy', '-40');
  head.setAttribute('rx', '5');
  head.setAttribute('ry', '3.5');
  head.setAttribute('fill', '#b45309');
  group.appendChild(head);

  // Antlers (simplified)
  const antler = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  antler.setAttribute('d', 'M -2 -42 L 0 -48 M 0 -48 L 4 -52 M 0 -48 L -4 -50');
  antler.setAttribute('stroke', '#78350f');
  antler.setAttribute('stroke-width', '1.5');
  antler.setAttribute('fill', 'none');
  group.appendChild(antler);
}

function drawBird(group) {
  // Simple flapping flight path
  const bird = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  bird.setAttribute('d', 'M -8 -4 Q -4 -10 0 -4 Q 4 -10 8 -4 L 8 -6 Q 4 -12 0 -6 Q -4 -12 -8 -6 Z');
  bird.setAttribute('fill', '#a5f3fc');
  group.appendChild(bird);
}

// WATERING FOREST & INTERACTIVE RAIN
function setupWateringSystem() {
  const btn = document.getElementById('btn-water-forest');
  if (!btn) return;
  
  btn.addEventListener('click', () => {
    // Prevent double clicking while active
    if (btn.classList.contains('disabled')) return;
    
    btn.classList.add('disabled');
    btn.disabled = true;
    
    // Add XP & Points
    addXP(10);
    saveStateToLocalStorage();
    renderAll();
    
    // Trigger Rain animation
    triggerRainEffect();
  });
}

function triggerRainEffect() {
  const rainLayer = document.getElementById('rain-layer');
  if (!rainLayer) return;
  
  rainLayer.style.display = 'block';
  rainLayer.innerHTML = '';
  
  // Inject random falling raindrops in SVG
  const dropCount = 45;
  for (let i = 0; i < dropCount; i++) {
    const drop = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const x = Math.floor(Math.random() * 800);
    const length = Math.floor(Math.random() * 8) + 6;
    
    drop.setAttribute('x1', x.toString());
    drop.setAttribute('y1', '0');
    drop.setAttribute('x2', (x - 2).toString()); // slightly diagonal wind
    drop.setAttribute('y2', length.toString());
    drop.setAttribute('class', 'rain-drop');
    // Random offset delay so it falls smoothly
    drop.style.animationDelay = `${Math.random() * 0.8}s`;
    drop.style.animationDuration = `${Math.random() * 0.4 + 0.6}s`;
    
    rainLayer.appendChild(drop);
  }

  // Flash sky to symbolize cloud shift
  const skyTop = document.getElementById('sky-top');
  const skyBottom = document.getElementById('sky-bottom');
  if (skyTop && skyBottom) {
    skyTop.setAttribute('stop-color', '#0f172a'); // darker stormy blue
    skyBottom.setAttribute('stop-color', '#1e293b');
  }

  // After 4 seconds, rain stops, trees scale up slightly (grow), sky resets
  setTimeout(() => {
    rainLayer.style.display = 'none';
    
    if (skyTop && skyBottom) {
      skyTop.setAttribute('stop-color', '#141e30');
      skyBottom.setAttribute('stop-color', '#243b55');
    }
    
    // Trigger pulse scale growth effects on SVG tree elements
    const elements = document.querySelectorAll('.sway-element');
    elements.forEach(el => {
      el.style.transition = 'transform 0.5s ease';
      const origTransform = el.getAttribute('transform');
      // Scale up temporary pulse
      el.setAttribute('transform', `${origTransform} scale(1.15)`);
      setTimeout(() => {
        el.setAttribute('transform', origTransform);
      }, 500);
    });

    const btn = document.getElementById('btn-water-forest');
    if (btn) {
      btn.classList.remove('disabled');
      btn.disabled = false;
    }
  }, 4000);
}

// HABIT SIMULATOR SLIDERS
function setupSimulator() {
  setupSimSlider('sim-drive', 'sim-drive-val', '% reduce', runSimulation);
  setupSimSlider('sim-energy', 'sim-energy-val', '% renewable', runSimulation);
  setupSimSlider('sim-meatless', 'sim-meatless-val', ' days', runSimulation);
  setupSimSlider('sim-thermo', 'sim-thermo-val', ' °F', runSimulation);
}

function setupSimSlider(id, valId, suffix, callback) {
  const slider = document.getElementById(id);
  const valEl = document.getElementById(valId);
  if (!slider) return;

  slider.addEventListener('input', (e) => {
    const val = e.target.value;
    valEl.textContent = `${val}${suffix}`;
    
    // Update simulation state
    if (id === 'sim-drive') state.simulator.reduceDrive = parseInt(val);
    else if (id === 'sim-energy') state.simulator.greenEnergy = parseInt(val);
    else if (id === 'sim-meatless') state.simulator.meatlessDays = parseInt(val);
    else if (id === 'sim-thermo') state.simulator.thermoShift = parseInt(val);
    
    callback();
  });
}

function runSimulation() {
  const sim = state.simulator;
  const currentTotal = state.carbonProfile.computed.total;
  
  // Calculate simulated reductions relative to current baseline
  // 1. Driving reduction savings
  // baseline drive emissions
  const driveEm = (state.carbonProfile.transport.driveDistance * COEFFS.transport.vehicle[state.carbonProfile.transport.vehicleType] * 52) / 1000;
  const driveSaved = driveEm * (sim.reduceDrive / 100);
  // Fuel cost savings: gas $3.50/gallon, 25mpg = $0.14/mile.
  const milesSaved = state.carbonProfile.transport.driveDistance * (sim.reduceDrive / 100);
  const moneyDriveSaved = milesSaved * 52 * 0.14;

  // 2. Renewable Solar Grid Switch savings
  // baseline electricity emissions
  const elecKwh = state.carbonProfile.energy.electricityBill * COEFFS.energy.elecMultiplier;
  const elecEm = (elecKwh * COEFFS.energy.elecEmissionRate * 12) / 1000 * (1 - state.carbonProfile.energy.renewableShare / 100);
  const energySaved = elecEm * (sim.greenEnergy / 100);
  // Solar panel energy discount (assuming green grid lowers bill long-term by 10%)
  const moneyEnergySaved = state.carbonProfile.energy.electricityBill * 12 * 0.10 * (sim.greenEnergy / 100);

  // 3. Meatless days savings
  // Diet emission difference (Meat vs Vegan)
  const currentDietEm = COEFFS.diet[state.carbonProfile.diet.dietType];
  const veganDietEm = COEFFS.diet['vegan'];
  const maxDietDiff = Math.max(currentDietEm - veganDietEm, 0);
  const dietSaved = maxDietDiff * (sim.meatlessDays / 7);
  // Grocery savings (meat substitution saves roughly $5 per day)
  const moneyDietSaved = sim.meatlessDays * 5 * 52;

  // 4. Thermostat thermostat shift
  // 3% heating/cooling bill reduction per degree Fahrenheit shifted
  const energyBillTotal = state.carbonProfile.energy.electricityBill * 12; // yearly
  const thermostatSaved = energyBillTotal * (sim.thermoShift * 0.03); // dollars saved
  // Carbon saved: electricity + gas heating baseline emissions times 3% per degree
  const homeHeatingEm = COEFFS.energy.heating[state.carbonProfile.energy.heatingSource];
  const thermoCarbonSaved = (elecEm + homeHeatingEm) * (sim.thermoShift * 0.03);

  // Totals
  const totalCarbonSaved = parseFloat((driveSaved + energySaved + dietSaved + thermoCarbonSaved).toFixed(2));
  const totalMoneySaved = Math.round(moneyDriveSaved + moneyEnergySaved + moneyDietSaved + thermostatSaved);
  const simulatedFootprint = parseFloat(Math.max(currentTotal - totalCarbonSaved, 0.5).toFixed(2));
  const treesCount = Math.round(totalCarbonSaved * 50); // average mature tree absorbs 20kg (0.02 tons) per year. So 50 trees = 1 ton.

  // Render projection stats
  document.getElementById('sim-co2-saved').textContent = `${totalCarbonSaved.toFixed(2)} tons`;
  document.getElementById('sim-money-saved').textContent = `$${totalMoneySaved.toLocaleString()} / yr`;
  document.getElementById('sim-trees-saved').textContent = `${treesCount} trees`;

  // Render Bar Charts
  const currentFill = document.getElementById('sim-bar-current-fill');
  const projFill = document.getElementById('sim-bar-proj-fill');
  const currentNum = document.getElementById('sim-bar-current-num');
  const projNum = document.getElementById('sim-bar-proj-num');
  
  if (currentFill && projFill && currentNum && projNum) {
    currentNum.textContent = `${currentTotal.toFixed(2)} tons`;
    projNum.textContent = `${simulatedFootprint.toFixed(2)} tons`;

    // Scale widths relative to 12.0 tons max (national average baseline representation)
    const maxVal = Math.max(currentTotal, 12.0);
    const currPct = (currentTotal / maxVal) * 100;
    const projPct = (simulatedFootprint / maxVal) * 100;

    currentFill.style.width = `${currPct}%`;
    projFill.style.width = `${projPct}%`;
    
    // Animate box recommendation based on high items
    const bannerBox = document.getElementById('sim-action-box');
    if (bannerBox) {
      if (totalCarbonSaved > 1.5) {
        bannerBox.innerHTML = `
          <i class="fa-solid fa-trophy text-orange" style="font-size: 18px;"></i>
          <div>
            <strong>High Impact Sim!</strong> By making these shifts, you reduce your carbon output by <strong>${Math.round(totalCarbonSaved / currentTotal * 100)}%</strong> and save <strong>$${totalMoneySaved}</strong> annually! Go to Quests and complete actions to make this a reality!
          </div>
        `;
        bannerBox.style.borderColor = '#10b981';
        bannerBox.style.background = 'rgba(16, 185, 129, 0.08)';
      } else {
        bannerBox.innerHTML = `
          <i class="fa-solid fa-circle-info text-blue" style="font-size: 18px;"></i>
          <div>
            <strong>Start small to achieve big!</strong> Move the sliders above to model habit adjustments (e.g. reduce driving or eat less meat) and view projected rewards!
          </div>
        `;
        bannerBox.style.borderColor = 'rgba(34, 197, 94, 0.12)';
        bannerBox.style.background = 'rgba(255, 255, 255, 0.02)';
      }
    }
  }
}

// ----------------------------------------------------
// NEW EXPANSION FEATURES & AUTHENTICATION MECHANICS
// ----------------------------------------------------

// 1. Password Hashing via Web Crypto API (PBKDF2 with salt)
async function hashPassword(password, existingSalt = null) {
  const encoder = new TextEncoder();
  const salt = existingSalt ? Uint8Array.from(atob(existingSalt), c => c.charCodeAt(0)) : crypto.getRandomValues(new Uint8Array(16));
  const iterations = 100000;
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  const hashArray = Array.from(new Uint8Array(derivedBits));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const saltB64 = btoa(String.fromCharCode(...salt));
  return { hash: hashHex, salt: saltB64, iterations };
}

// 2. Authentication Toggle & Submit Handlers
function displayAuthError(message) {
  const errEl = document.getElementById('auth-error');
  if (errEl) {
    errEl.textContent = message;
    errEl.style.display = 'block';
    errEl.style.color = 'var(--accent-red)';
  }
}
let authMode = 'login'; // 'login' or 'register'

window.toggleAuthMode = function() {
  const title = document.getElementById('auth-title');
  const subtitle = document.getElementById('auth-subtitle');
  const submitBtn = document.getElementById('auth-submit-btn');
  const toggleText = document.getElementById('auth-toggle-text');
  const toggleBtn = document.getElementById('btn-toggle-auth');
  
  // Register service worker on initial load if supported
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(err => console.error('SW registration failed:', err));
}
if (authMode === 'login') {
    authMode = 'register';
    title.textContent = 'Create Account';
    subtitle.textContent = 'Register a new Eco Warrior profile with a password.';
    submitBtn.textContent = 'Register & Start';
    toggleText.textContent = 'Already have an account?';
    toggleBtn.textContent = 'Log in here';
  } else {
    authMode = 'login';
    title.textContent = 'Welcome Back';
    subtitle.textContent = 'Log in to track your carbon footprint and manage your forest.';
    submitBtn.textContent = 'Log In';
    toggleText.textContent = "Don't have an account?";
    toggleBtn.textContent = 'Register here';
  }
};

window.handleAuthSubmit = async function(event) {
  event.preventDefault();
  const usernameInput = document.getElementById('auth-username');
  const passwordInput = document.getElementById('auth-password');
  const errEl = document.getElementById('auth-error');
  if (errEl) errEl.style.display = 'none';
  
  const username = usernameInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  
  if (!username || !password) {
    displayAuthError('⚠️ Please fill in all fields.');
    return;
  }
  
  const usersJson = localStorage.getItem('ecosphere_users');
  let users = [];
  if (usersJson) {
    try {
      users = JSON.parse(usersJson);
    } catch (e) {
      users = [];
    }
  }
  
  const passwordHash = await hashPassword(password);
  
  if (authMode === 'register') {
    // Check if user already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        displayAuthError('❌ Username already exists.');
        return;
    }
    
    // Register new user with salted PBKDF2 hash
    const pwdObj = await hashPassword(password);
    users.push({ username, passwordHash: pwdObj });
    localStorage.setItem('ecosphere_users', JSON.stringify(users));
    
    // Save session
    localStorage.setItem('ecosphere_session', username);
    
    initApp();
  } else {
    // Login check
    const userRecord = users.find(u => u.username === username);
    // Login lockout check
    const lockKey = `ecosphere_lock_${username}`;
    const lockInfo = JSON.parse(localStorage.getItem(lockKey) || '{}');
    const now = Date.now();
    if (lockInfo.blockUntil && now < lockInfo.blockUntil) {
        const minutes = Math.ceil((lockInfo.blockUntil - now) / 60000);
        displayAuthError(`🔒 Account locked. Try again in ${minutes} minute(s).`);
        return;
    }
    if (!userRecord) {
        displayAuthError('❌ Invalid username or password. Please try again.');
        // Increment failed attempts
        const attempts = (lockInfo.attempts || 0) + 1;
        if (attempts >= 5) {
            lockInfo.blockUntil = now + 5 * 60 * 1000; // 5 minutes
            lockInfo.attempts = 0;
        } else {
            lockInfo.attempts = attempts;
        }
        localStorage.setItem(lockKey, JSON.stringify(lockInfo));
        return;
    }
    // Verify password using stored salt
    const stored = userRecord.passwordHash;
    const pwdCheck = await hashPassword(password, stored.salt);
    if (pwdCheck.hash === stored.hash) {
        // Successful login, clear lock info
        localStorage.removeItem(lockKey);
        localStorage.setItem('ecosphere_session', username);
        initApp();
    } else {
        displayAuthError('❌ Invalid username or password. Please try again.');
        const attempts = (lockInfo.attempts || 0) + 1;
        if (attempts >= 5) {
            lockInfo.blockUntil = now + 5 * 60 * 1000;
            lockInfo.attempts = 0;
        } else {
            lockInfo.attempts = attempts;
        }
        localStorage.setItem(lockKey, JSON.stringify(lockInfo));
    }
  }
  
  // Clear inputs
  usernameInput.value = '';
  passwordInput.value = '';
};

window.handleLogout = function() {
  // Clear session data
  localStorage.removeItem('ecosphere_session');
  sessionUser = null;
  // Show authentication overlay
  const authOverlay = document.getElementById('auth-overlay');
  if (authOverlay) authOverlay.style.display = 'flex';
  // Clear input fields and reset error
  const usernameInput = document.getElementById('auth-username');
  const passwordInput = document.getElementById('auth-password');
  const errEl = document.getElementById('auth-error');
  if (usernameInput) usernameInput.value = '';
  if (passwordInput) passwordInput.value = '';
  if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
  // Reset to login mode
  authMode = 'login';
  // Update overlay texts
  const title = document.getElementById('auth-title');
  const subtitle = document.getElementById('auth-subtitle');
  const submitBtn = document.getElementById('auth-submit-btn');
  const toggleText = document.getElementById('auth-toggle-text');
  const toggleBtn = document.getElementById('btn-toggle-auth');
  if (title) title.textContent = 'Welcome Back';
  if (subtitle) subtitle.textContent = 'Log in to track your carbon footprint and manage your forest.';
  if (submitBtn) submitBtn.textContent = 'Log In';
  if (toggleText) toggleText.textContent = "Don't have an account?";
  if (toggleBtn) toggleBtn.textContent = 'Register here';
  // Register service worker if supported
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.error('SW registration failed:', err));
  }
  // Reset hash to default view without reloading
  window.location.hash = '';
};

// 3. Leaderboard Rendering
const LEADERBOARD_WARRIORS = [
  { name: 'Chloe Vance', level: 5, badges: 3, saved: 480, points: 1550, isPlayer: false },
  { name: 'Julian Drake', level: 4, badges: 2, saved: 395, points: 1120, isPlayer: false },
  { name: 'Sarah Jenkins', level: 3, badges: 2, saved: 310, points: 940, isPlayer: false },
  { name: 'Liam Patel', level: 2, badges: 1, saved: 215, points: 680, isPlayer: false },
  { name: 'Elena Rostova', level: 1, badges: 1, saved: 95, points: 300, isPlayer: false }
];

function renderLeaderboard() {
  const body = document.getElementById('leaderboard-body');
  if (!body) return;
  body.innerHTML = '';

  const badgesUnlockedCount = state.badges.filter(b => b.unlocked).length;
  const playerRecord = {
    name: `You (${capitalize(sessionUser)})`,
    level: state.userProgress.level,
    badges: badgesUnlockedCount,
    saved: state.carbonProfile.computed.savedLifetime,
    points: state.userProgress.ecoPoints,
    isPlayer: true
  };

  const combined = [...LEADERBOARD_WARRIORS, playerRecord].sort((a, b) => b.saved - a.saved);

  combined.forEach((user, index) => {
    const tr = document.createElement('tr');
    if (user.isPlayer) {
      tr.className = 'leaderboard-current-user';
    }

    let rankDisplay = index + 1;
    if (index === 0) rankDisplay = '<i class="fa-solid fa-trophy rank-gold"></i>';
    else if (index === 1) rankDisplay = '<i class="fa-solid fa-trophy rank-silver"></i>';
    else if (index === 2) rankDisplay = '<i class="fa-solid fa-trophy rank-bronze"></i>';

    tr.innerHTML = `
      <td><div class="leaderboard-rank">${rankDisplay}</div></td>
      <td>
        <div class="user-col">
          <div class="avatar">${user.name[0]}</div>
          <span>${user.name}</span>
        </div>
      </td>
      <td><strong>Lv. ${user.level}</strong></td>
      <td><span class="badge-chip">${user.badges} Badges</span></td>
      <td><strong class="text-green">${user.saved.toLocaleString()} kg</strong></td>
      <td>${user.points.toLocaleString()} pts</td>
    `;
    body.appendChild(tr);
  });
}

// 4. Eco-Shop Rendering & Purchasing
function renderShop() {
  const grid = document.getElementById('shop-items-grid');
  const balance = document.getElementById('shop-points-balance');
  if (!grid || !balance) return;

  balance.textContent = `${state.userProgress.ecoPoints.toLocaleString()} pts`;
  grid.innerHTML = '';

  state.shopItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'glass-card shop-card';
    
    const isUnlocked = item.unlocked;
    const canBuy = state.userProgress.ecoPoints >= item.cost;
    
    let btnText = `Buy Card`;
    let btnClass = `shop-buy-btn`;
    let disabledAttr = '';

    if (isUnlocked) {
      btnText = `<i class="fa-solid fa-circle-check"></i> Unlocked`;
      btnClass += ' unlocked';
      disabledAttr = 'disabled';
    } else if (!canBuy) {
      btnText = `Low Points`;
      disabledAttr = 'disabled';
    } else {
      btnText = `Unlock Asset`;
    }

    let colorClass = 'icon-green';
    if (item.category === 'animal') colorClass = 'icon-orange';
    else if (item.category === 'cert') colorClass = 'icon-blue';

    card.innerHTML = `
      <span class="shop-card-badge badge-${item.category}">${item.category}</span>
      <div class="shop-icon-box ${colorClass}">
        <i class="fa-solid ${item.icon}"></i>
      </div>
      <h4>${item.name}</h4>
      <p class="shop-desc">${item.desc}</p>
      <div class="shop-cost-btn-group">
        <div class="shop-cost">
          <i class="fa-solid fa-seedling"></i>
          <span>${item.cost} pts</span>
        </div>
        <button class="${btnClass}" data-item-id="${item.id}" ${disabledAttr}>${btnText}</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

window.buyShopItem = function(itemId) {
  const item = state.shopItems.find(i => i.id === itemId);
  if (!item || item.unlocked) return;

  if (state.userProgress.ecoPoints < item.cost) {
    alert("❌ You don't have enough EcoPoints!");
    return;
  }

  // Deduct points
  state.userProgress.ecoPoints -= item.cost;
  item.unlocked = true;

  // Add to forest items if it's foliage/wildlife
  if (item.category === 'tree' || item.category === 'animal') {
    const x = Math.floor(Math.random() * 700) + 50;
    const terrainDetails = getTerrainHeightAndColorAtX(x);
    const finalY = item.id === 'owl' ? Math.floor(Math.random() * 80) + 80 : terrainDetails.y;

    state.forestItems.push({
      id: `${item.id}_${Date.now()}`,
      category: item.category,
      type: item.id,
      x: x,
      y: finalY,
      scale: item.category === 'tree' ? 1.15 : 0.8,
      terrain: terrainDetails.terrain,
      timestamp: new Date().toLocaleDateString(),
      details: `Unlocked from Rewards Locker`
    });
  }

  saveStateToLocalStorage();
  renderAll();
  renderShop();

  alert(`🎉 Success! You unlocked "${item.name}" for ${item.cost} EcoPoints! Check your Virtual Forest.`);
};

// 5. Daily Trivia Quiz
let currentQuestionIndex = 0;

function renderQuiz() {
  const box = document.getElementById('quiz-question-box');
  if (!box) return;
  box.innerHTML = '';

  if (state.triviaQuiz.completedToday) {
    box.innerHTML = `
      <div class="quiz-feedback-panel success" style="text-align: center; padding: 32px 20px;">
        <i class="fa-solid fa-circle-check text-green" style="font-size: 40px; margin-bottom: 16px;"></i>
        <h3 class="feedback-title success" style="justify-content: center; font-size: 18px;">Quiz Completed Today!</h3>
        <p class="feedback-explanation" style="margin-top: 8px; font-size: 13px;">
          Great job! You have already answered today's environmental trivia and earned your rewards. Come back tomorrow to test your knowledge again!
        </p>
      </div>
    `;
    return;
  }

  const qObj = state.triviaQuiz.bank[currentQuestionIndex];
  
  const questionDiv = document.createElement('div');
  questionDiv.className = 'quiz-question';
  questionDiv.textContent = `Q: ${qObj.q}`;
  box.appendChild(questionDiv);

  const optionsList = document.createElement('div');
  optionsList.className = 'quiz-options-list';

  qObj.opts.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.innerHTML = `<span class="opt-bullet" style="color: var(--accent-mint); font-weight: 800;">${String.fromCharCode(65 + idx)}.</span> ${opt}`;
    btn.addEventListener('click', () => submitQuizAnswer(idx));
    optionsList.appendChild(btn);
  });
  box.appendChild(optionsList);
}

window.submitQuizAnswer = function(idx) {
  const qObj = state.triviaQuiz.bank[currentQuestionIndex];
  const buttons = document.querySelectorAll('.quiz-opt-btn');
  
  buttons.forEach(btn => btn.disabled = true);

  const box = document.getElementById('quiz-question-box');
  const feedback = document.createElement('div');

  if (idx === qObj.correct) {
    buttons[idx].classList.add('correct');
    
    // Rewards
    addXP(100);
    addEcoPoints(150);
    state.triviaQuiz.completedToday = true;
    saveStateToLocalStorage();
    renderAll();

    feedback.className = 'quiz-feedback-panel success';
    feedback.innerHTML = `
      <div class="feedback-title success">
        <i class="fa-solid fa-circle-check"></i> Correct Answer! (+150 pts, +100 XP)
      </div>
      <p class="feedback-explanation">${qObj.exp}</p>
    `;
  } else {
    buttons[idx].classList.add('incorrect');
    buttons[qObj.correct].classList.add('correct');

    feedback.className = 'quiz-feedback-panel error';
    feedback.innerHTML = `
      <div class="feedback-title error">
        <i class="fa-solid fa-circle-xmark"></i> Incorrect Answer
      </div>
      <p class="feedback-explanation">
        That wasn't quite right. <strong>Explanation:</strong> ${qObj.exp}
      </p>
      <button class="btn btn-secondary btn-try-next" style="margin-top: 16px; padding: 6px 12px; font-size: 11px;">Try Another Question</button>
    `;
  }
  box.appendChild(feedback);
};

window.tryNextQuizQuestion = function() {
  currentQuestionIndex = (currentQuestionIndex + 1) % state.triviaQuiz.bank.length;
  renderQuiz();
};

// 6. SVG Tree & Wildlife Drawers
function drawBaobab(group) {
  // Thick trunk
  const trunk = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  trunk.setAttribute('d', 'M -12 0 L -8 -30 Q -6 -35 -4 -40 Q 0 -42 4 -40 Q 6 -35 8 -30 L 12 0 Z');
  trunk.setAttribute('fill', '#8d6e63');
  group.appendChild(trunk);

  // Branch stems
  const branches = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  branches.setAttribute('d', 'M -4 -40 L -12 -55 M 4 -40 L 12 -55 M 0 -40 L 0 -58');
  branches.setAttribute('stroke', '#8d6e63');
  branches.setAttribute('stroke-width', '4');
  group.appendChild(branches);

  // Flattened foliage ellipses
  const leafBlock = (cx, cy, r) => {
    const leaves = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    leaves.setAttribute('cx', cx);
    leaves.setAttribute('cy', cy);
    leaves.setAttribute('rx', (r * 1.6).toString());
    leaves.setAttribute('ry', r.toString());
    leaves.setAttribute('fill', '#14532d');
    group.appendChild(leaves);
  };
  leafBlock(-12, -55, 10);
  leafBlock(12, -55, 10);
  leafBlock(0, -58, 12);
}

function drawJacaranda(group) {
  // Trunk
  const trunk = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  trunk.setAttribute('d', 'M -3 0 Q -5 -20 -2 -38 Q 0 -42 3 -42 L 3 0 Z');
  trunk.setAttribute('fill', '#4e342e');
  group.appendChild(trunk);

  // Purple foliage canopy
  const canopy = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  canopy.setAttribute('d', 'M -16 -42 a 12 12 0 0 1 12 -12 a 14 14 0 0 1 14 -4 a 12 12 0 0 1 12 10 a 12 12 0 0 1 -4 14 a 12 12 0 0 1 -12 6 a 12 12 0 0 1 -14 -6 a 12 12 0 0 1 -8 -8 z');
  canopy.setAttribute('fill', '#7c3aed');
  group.appendChild(canopy);

  // Blossom detail highlighted spots
  const detail = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  detail.setAttribute('cx', '3');
  detail.setAttribute('cy', '-46');
  detail.setAttribute('r', '7');
  detail.setAttribute('fill', '#a78bfa');
  detail.setAttribute('opacity', '0.75');
  group.appendChild(detail);
}

function drawFox(group) {
  // Tail
  const tail = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  tail.setAttribute('cx', '8');
  tail.setAttribute('cy', '-5');
  tail.setAttribute('rx', '6');
  tail.setAttribute('ry', '3');
  tail.setAttribute('fill', '#f97316');
  tail.setAttribute('transform', 'rotate(-30 8 -5)');
  group.appendChild(tail);

  // Body
  const body = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  body.setAttribute('cx', '0');
  body.setAttribute('cy', '-6');
  body.setAttribute('rx', '8');
  body.setAttribute('ry', '5');
  body.setAttribute('fill', '#ea580c');
  group.appendChild(body);

  // Head
  const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  head.setAttribute('cx', '-7');
  head.setAttribute('cy', '-10');
  head.setAttribute('r', '4');
  head.setAttribute('fill', '#ea580c');
  group.appendChild(head);

  // Large Fennec Ears
  const earL = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  earL.setAttribute('points', '-9,-12 -12,-21 -6,-14');
  earL.setAttribute('fill', '#f97316');
  group.appendChild(earL);

  const earR = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  earR.setAttribute('points', '-6,-12 -6,-21 -3,-14');
  earR.setAttribute('fill', '#f97316');
  group.appendChild(earR);

  // White chest
  const chest = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  chest.setAttribute('cx', '-7');
  chest.setAttribute('cy', '-7');
  chest.setAttribute('r', '2.2');
  chest.setAttribute('fill', '#f1f5f9');
  group.appendChild(chest);
}

function drawOwl(group) {
  // Body
  const body = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  body.setAttribute('cx', '0');
  body.setAttribute('cy', '-10');
  body.setAttribute('rx', '5');
  body.setAttribute('ry', '7.5');
  body.setAttribute('fill', '#cbd5e1');
  group.appendChild(body);

  // Face plate
  const face = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  face.setAttribute('cx', '0');
  face.setAttribute('cy', '-14');
  face.setAttribute('r', '3.5');
  face.setAttribute('fill', '#ffffff');
  group.appendChild(face);

  // Eyes
  const eyeL = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  eyeL.setAttribute('cx', '-1.2');
  eyeL.setAttribute('cy', '-14');
  eyeL.setAttribute('r', '0.6');
  eyeL.setAttribute('fill', '#0f172a');
  group.appendChild(eyeL);

  const eyeR = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  eyeR.setAttribute('cx', '1.2');
  eyeR.setAttribute('cy', '-14');
  eyeR.setAttribute('r', '0.6');
  eyeR.setAttribute('fill', '#0f172a');
  group.appendChild(eyeR);

  // Wings
  const wingL = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  wingL.setAttribute('d', 'M -5 -11 Q -7 -5 -4 0 Z');
  wingL.setAttribute('fill', '#94a3b8');
  group.appendChild(wingL);

  const wingR = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  wingR.setAttribute('d', 'M 5 -11 Q 7 -5 4 0 Z');
  wingR.setAttribute('fill', '#94a3b8');
  group.appendChild(wingR);
}

// EXPORTS FOR TESTING
export {
  state,
  COEFFS,
  recalculateEmissions,
  recalculateLiveGauge,
  validateStateSchema
};
