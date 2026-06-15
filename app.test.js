import { state, COEFFS, recalculateEmissions, validateStateSchema, escapeHTML } from './app.js';

describe('EcoSphere Carbon Calculations', () => {
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
});
