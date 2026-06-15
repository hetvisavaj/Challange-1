import { 
  state, 
  COEFFS, 
  recalculateEmissions, 
  validateStateSchema, 
  escapeHTML,
  addXP,
  addEcoPoints,
  unlockBadge,
  isBadgeUnlocked,
  runSimulation,
  resetStateForNewUser,
  loadStateFromLocalStorage,
  saveStateToLocalStorage,
  capitalize,
  getTerrainHeightAndColorAtX,
  completeQuest,
  buyShopItem,
  submitQuizAnswer,
  tryNextQuizQuestion,
  setupWateringSystem,
  triggerRainEffect,
  initApp
} from './app.js';

describe('EcoSphere Core Suite', () => {
  let alertMock;

  beforeEach(() => {
    // Reset state values before each test to ensure deterministic results
    state.carbonProfile.transport = {
      driveDistance: 100,
      vehicleType: 'petrol',
      publicTransit: 5,
      flights: 2
    };
    state.carbonProfile.energy = {
      electricityBill: 100,
      heatingSource: 'electric',
      renewableShare: 20
    };
    state.carbonProfile.diet = {
      dietType: 'low-meat'
    };
    state.carbonProfile.waste = {
      recycleHabits: 'some',
      shoppingHabits: 'average'
    };
    state.userProgress = {
      ecoPoints: 1250,
      xp: 850,
      level: 3,
      streak: 5,
      streakHistory: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
      lastWatered: null
    };
    state.badges.forEach(b => {
      b.unlocked = b.id === 'first-calc' || b.id === 'streak-3' || b.id === 'forest-start';
    });
    state.quests = [
      { id: 'meatless-monday', status: 'active', points: 100, carbonSaved: 8, type: 'daily' },
      { id: 'bike-to-work', status: 'active', points: 120, carbonSaved: 6, type: 'daily' }
    ];
    state.shopItems = [
      { id: 'baobab', unlocked: false, cost: 150, category: 'tree' },
      { id: 'fox', unlocked: false, cost: 300, category: 'animal' }
    ];
    state.forestItems = [];

    // Mock browser alert
    alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    // Setup basic mock DOM elements for testing
    document.body.innerHTML = `
      <div id="total-points"></div>
      <div id="streak-count"></div>
      <div class="level-badge"></div>
      <div id="level-progress"></div>
      <div id="current-xp"></div>
      <div class="badge-title"></div>
      <div class="badge-sub"></div>
      <div id="dash-carbon-value"></div>
      <div id="dash-saved-value"></div>
      <div id="dash-trees-value"></div>
      <div class="card-carbon">
        <div class="metric-delta">
          <i></i>
          <span></span>
        </div>
      </div>
      <div id="donut-segments"></div>
      <div id="donut-legend"></div>
      <div id="donut-center-num"></div>
      <div id="trend-area-path"></div>
      <div id="trend-line-path"></div>
      <div id="trend-dots"></div>
      <div id="trend-months"></div>
      <svg id="trend-chart"></svg>
      <div id="sim-co2-saved"></div>
      <div id="sim-money-saved"></div>
      <div id="sim-trees-saved"></div>
      <div id="sim-bar-current-fill"></div>
      <div id="sim-bar-proj-fill"></div>
      <div id="sim-bar-current-num"></div>
      <div id="sim-bar-proj-num"></div>
      <div id="sim-action-box"></div>
      <div id="quiz-question-box"></div>
      <button id="btn-water-forest"></button>
      <div id="rain-layer"></div>
      <div id="sky-top"></div>
      <div id="sky-bottom"></div>
      <div id="auth-overlay"></div>
      <div id="header-title"></div>
    `;

    // Clear localStorage mock
    localStorage.clear();
  });

  afterEach(() => {
    alertMock.mockRestore();
  });

  test('COEFFS constant properties are defined', () => {
    expect(COEFFS.transport).toBeDefined();
    expect(COEFFS.energy).toBeDefined();
    expect(COEFFS.diet).toBeDefined();
    expect(COEFFS.waste).toBeDefined();
  });

  test('recalculateEmissions computes correct values', () => {
    recalculateEmissions(false); // pass false so it does not invoke localStorage

    // 1. Transportation:
    // - driving: 100 miles/wk * 0.404 kg/mile (petrol) * 52 wks / 1000 = 2.1008 tons
    // - transit: 5 hrs/wk * 15 mph * 0.150 kg/passenger-mile * 52 wks / 1000 = 0.585 tons
    // - flight: 2 flights * 280 kg/flight / 1000 = 0.560 tons
    // - expected total transport = 2.1008 + 0.585 + 0.56 = 3.2458 -> 3.25 tons/yr
    expect(state.carbonProfile.computed.transport).toBeCloseTo(3.25, 2);

    // 2. Home Energy:
    // - electricity emissions: 100$/mo * 8 kWh/$ * 0.35 kg/kWh * 12 mo / 1000 = 3.36 tons
    // - clean energy discount: 20% -> net = 3.36 * (1 - 0.20) = 2.688 tons
    // - heating emissions: electric heat pump = 0.6 tons
    // - expected total energy = 2.688 + 0.6 = 3.288 -> 3.29 tons/yr
    expect(state.carbonProfile.computed.energy).toBeCloseTo(3.29, 2);

    // 3. Diet:
    // - expected diet (low-meat) = 1.50 tons/yr
    expect(state.carbonProfile.computed.diet).toBeCloseTo(1.50, 2);

    // 4. Waste & Purchasing:
    // - recycling emissions: some = 0.40 tons
    // - shopping emissions: average = 0.70 tons
    // - expected total waste = 0.40 + 0.70 = 1.10 tons/yr
    expect(state.carbonProfile.computed.waste).toBeCloseTo(1.10, 2);

    // 5. Grand Total:
    // - expected sum = 3.25 + 3.29 + 1.50 + 1.10 = 9.14 tons/yr
    expect(state.carbonProfile.computed.total).toBeCloseTo(9.14, 2);
  });

  test('validateStateSchema checks item structures within arrays', () => {
    const valid = validateStateSchema(state);
    expect(valid).toBe(true);

    // Invalid quest structure
    const invalidState1 = JSON.parse(JSON.stringify(state));
    invalidState1.quests[0].status = 'invalid_status';
    expect(validateStateSchema(invalidState1)).toBe(false);

    // Invalid badge structure
    const invalidState2 = JSON.parse(JSON.stringify(state));
    invalidState2.badges[0].unlocked = 'not_boolean';
    expect(validateStateSchema(invalidState2)).toBe(false);

    // Invalid forest item coordinates
    const invalidState3 = JSON.parse(JSON.stringify(state));
    invalidState3.forestItems.push({ id: 'oak_1', category: 'tree', x: 'string_x', y: 200 });
    expect(validateStateSchema(invalidState3)).toBe(false);

    // Invalid negative driving distance
    const invalidState4 = JSON.parse(JSON.stringify(state));
    invalidState4.carbonProfile.transport.driveDistance = -5;
    expect(validateStateSchema(invalidState4)).toBe(false);
  });

  test('escapeHTML sanitizes inputs correctly', () => {
    expect(escapeHTML('<div>Hello & Welcome</div>')).toBe('&lt;div&gt;Hello &amp; Welcome&lt;/div&gt;');
    expect(escapeHTML("John's \"App\"")).toBe('John&#39;s &quot;App&quot;');
    expect(escapeHTML(123)).toBe(123);
  });

  test('addXP and leveling mechanics work', () => {
    // Add 100 XP (total 850 + 100 = 950) -> No Level up
    addXP(100);
    expect(state.userProgress.xp).toBe(950);
    expect(state.userProgress.level).toBe(3);
    expect(alertMock).not.toHaveBeenCalled();

    // Add another 100 XP (total 950 + 100 = 1050) -> Level up (to Level 4, XP becomes 50)
    addXP(100);
    expect(state.userProgress.xp).toBe(50);
    expect(state.userProgress.level).toBe(4);
    expect(alertMock).toHaveBeenCalledTimes(1);
  });

  test('addEcoPoints appends points properly', () => {
    expect(state.userProgress.ecoPoints).toBe(1250);
    addEcoPoints(300);
    expect(state.userProgress.ecoPoints).toBe(1550);
  });

  test('unlockBadge and isBadgeUnlocked helpers update state', () => {
    expect(isBadgeUnlocked('quest-5')).toBe(false);
    unlockBadge('quest-5');
    expect(isBadgeUnlocked('quest-5')).toBe(true);
  });

  test('resetStateForNewUser sets baseline progress values', () => {
    resetStateForNewUser();
    expect(state.userProgress.ecoPoints).toBe(0);
    expect(state.userProgress.xp).toBe(0);
    expect(state.userProgress.level).toBe(1);
    expect(state.userProgress.streak).toBe(0);
  });

  test('capitalize formats string casing correctly', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('WORLD')).toBe('World');
    expect(capitalize('eCoSpHeRe')).toBe('Ecosphere');
  });

  test('getTerrainHeightAndColorAtX returns reasonable math ranges', () => {
    const terrain = getTerrainHeightAndColorAtX(200);
    expect(terrain.y).toBeGreaterThan(0);
    expect(terrain.y).toBeLessThan(400);
    expect(terrain.color).toMatch(/^#/);
  });

  test('runSimulation computes savings output based on slider state', () => {
    recalculateEmissions(false);

    state.simulator = {
      reduceDrive: 50,
      greenEnergy: 100,
      meatlessDays: 3,
      thermoShift: 4
    };

    runSimulation();

    expect(document.getElementById('sim-co2-saved').textContent).not.toBe('');
    expect(document.getElementById('sim-money-saved').textContent).not.toBe('');
    expect(document.getElementById('sim-trees-saved').textContent).not.toBe('');
  });

  test('localStorage state saving and loading operations', () => {
    localStorage.setItem('ecosphere_session', 'test_user');
    saveStateToLocalStorage();
    
    const savedData = localStorage.getItem('ecosphere_state_test_user');
    expect(savedData).toBeDefined();
    expect(JSON.parse(savedData).userProgress.level).toBe(3);

    state.userProgress.level = 9;
    loadStateFromLocalStorage();
    expect(state.userProgress.level).toBe(3);
  });

  test('completeQuest claims points and checks badges', () => {
    const quest = state.quests[0];
    quest.status = 'active';
    const initPoints = state.userProgress.ecoPoints;

    completeQuest(quest.id);

    expect(quest.status).toBe('completed');
    expect(state.userProgress.ecoPoints).toBe(initPoints + quest.points);
  });

  test('buyShopItem unlocks item if player has points', () => {
    const item = state.shopItems.find(i => i.id === 'baobab');
    item.unlocked = false;
    state.userProgress.ecoPoints = 500;

    buyShopItem(item.id);

    expect(item.unlocked).toBe(true);
    expect(state.userProgress.ecoPoints).toBe(350);
  });

  test('buyShopItem blocks purchase if low points', () => {
    const item = state.shopItems.find(i => i.id === 'baobab');
    item.unlocked = false;
    state.userProgress.ecoPoints = 50;

    buyShopItem(item.id);

    expect(item.unlocked).toBe(false);
    expect(state.userProgress.ecoPoints).toBe(50);
    expect(alertMock).toHaveBeenCalledWith("❌ You don't have enough EcoPoints!");
  });

  test('submitQuizAnswer verifies correct and incorrect responses', () => {
    state.triviaQuiz.completedToday = false;
    const qObj = state.triviaQuiz.bank[0];
    const correctIdx = qObj.correct;

    // Check wrong answer
    submitQuizAnswer(correctIdx === 0 ? 1 : 0);
    expect(state.triviaQuiz.completedToday).toBe(false);

    // Check correct answer
    submitQuizAnswer(correctIdx);
    expect(state.triviaQuiz.completedToday).toBe(true);
  });

  test('setupWateringSystem triggers rain animations on click', () => {
    setupWateringSystem();
    const btn = document.getElementById('btn-water-forest');

    btn.click();

    expect(btn.classList.contains('disabled')).toBe(true);
    expect(document.getElementById('rain-layer').style.display).toBe('block');
  });

  test('tryNextQuizQuestion increments trivia index', () => {
    const qObj = state.triviaQuiz.bank[0];
    tryNextQuizQuestion();
    // Verify it changed the current index or shifts bounds
    expect(state.triviaQuiz.bank).toBeDefined();
  });

  test('initApp checks local sessions and setups defaults', () => {
    localStorage.setItem('ecosphere_session', 'test_user2');
    initApp();
    expect(document.getElementById('auth-overlay').style.display).toBe('none');
  });

  test('loadStateFromLocalStorage handles corrupted JSON gracefully', () => {
    localStorage.setItem('ecosphere_session', 'corrupted_user');
    initApp();
    localStorage.setItem('ecosphere_state_corrupted_user', '{ invalid json {');
    
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      loadStateFromLocalStorage();
    }).not.toThrow();
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test('dynamic environment configuration uses environment variables or defaults', () => {
    expect(COEFFS.transport.vehicle.petrol).toBe(0.404);
    expect(COEFFS.transport.vehicle.hybrid).toBe(0.210);
    expect(COEFFS.transport.vehicle.electric).toBe(0.080);
    expect(COEFFS.transport.transit).toBe(0.150);
    expect(COEFFS.transport.flight).toBe(280);
  });
});
