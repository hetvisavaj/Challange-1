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
  getTerrainHeightAndColorAtX
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

    // Mock browser alert
    alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    // Setup basic mock DOM elements for simulator testing
    document.body.innerHTML = `
      <div id="sim-co2-saved"></div>
      <div id="sim-money-saved"></div>
      <div id="sim-trees-saved"></div>
      <div id="sim-bar-current-fill"></div>
      <div id="sim-bar-proj-fill"></div>
      <div id="sim-bar-current-num"></div>
      <div id="sim-bar-proj-num"></div>
      <div id="sim-action-box"></div>
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

  test('validateStateSchema validates schema correctness', () => {
    // Valid state
    const isValid = validateStateSchema(state);
    expect(isValid).toBe(true);

    // Invalid negative driving distance
    const invalidState1 = JSON.parse(JSON.stringify(state));
    invalidState1.carbonProfile.transport.driveDistance = -5;
    expect(validateStateSchema(invalidState1)).toBe(false);

    // Invalid out-of-bounds renewable energy share
    const invalidState2 = JSON.parse(JSON.stringify(state));
    invalidState2.carbonProfile.energy.renewableShare = 120;
    expect(validateStateSchema(invalidState2)).toBe(false);
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

    // Multi-level recursive level up (50 + 2200 = 2250) -> Levels up twice (to Level 6, XP becomes 250)
    addXP(2200);
    expect(state.userProgress.level).toBe(6);
    expect(state.userProgress.xp).toBe(250);
    expect(alertMock).toHaveBeenCalledTimes(3);
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
    // Pre-calculate baseline emissions
    recalculateEmissions(false);

    // Setup simulator sliders state
    state.simulator = {
      reduceDrive: 50,    // 50% driving reduction
      greenEnergy: 100,   // Switch 100% to renewable energy
      meatlessDays: 3,    // 3 meatless days
      thermoShift: 4      // 4 degrees Fahrenheit shifted
    };

    runSimulation();

    // Verify DOM updates are outputted correctly
    expect(document.getElementById('sim-co2-saved').textContent).not.toBe('');
    expect(document.getElementById('sim-money-saved').textContent).not.toBe('');
    expect(document.getElementById('sim-trees-saved').textContent).not.toBe('');
  });

  test('localStorage state saving and loading operations', () => {
    // Mock user session
    localStorage.setItem('ecosphere_session', 'test_user');
    
    // Save state
    saveStateToLocalStorage();
    
    // Verify it is stringified in localStorage under specific key
    const savedData = localStorage.getItem('ecosphere_state_test_user');
    expect(savedData).toBeDefined();
    expect(JSON.parse(savedData).userProgress.level).toBe(3);

    // Reset current state level
    state.userProgress.level = 9;

    // Load state from localStorage to verify restore
    loadStateFromLocalStorage();
    expect(state.userProgress.level).toBe(3); // restored from previous mock save
  });
});
