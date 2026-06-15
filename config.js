/**
 * EcoSphere - Config Module
 * Dynamic configuration provider parsing environment parameters with safe fallbacks.
 */

export const COEFFS = {
  transport: {
    vehicle: {
      petrol: parseFloat(typeof process !== 'undefined' && process.env?.PETROL_COEFF || 0.404),
      hybrid: parseFloat(typeof process !== 'undefined' && process.env?.HYBRID_COEFF || 0.210),
      electric: parseFloat(typeof process !== 'undefined' && process.env?.ELECTRIC_COEFF || 0.080),
      none: 0
    },
    transit: parseFloat(typeof process !== 'undefined' && process.env?.TRANSIT_COEFF || 0.150),
    flight: parseFloat(typeof process !== 'undefined' && process.env?.FLIGHT_COEFF || 280)
  },
  energy: {
    elecMultiplier: parseInt(typeof process !== 'undefined' && process.env?.ELEC_MULTIPLIER || 8),
    elecEmissionRate: parseFloat(typeof process !== 'undefined' && process.env?.ELEC_EMISSION_RATE || 0.35),
    heating: {
      gas: parseFloat(typeof process !== 'undefined' && process.env?.HEATING_GAS || 1.2),
      electric: parseFloat(typeof process !== 'undefined' && process.env?.HEATING_ELECTRIC || 0.6),
      'coal-oil': parseFloat(typeof process !== 'undefined' && process.env?.HEATING_COAL_OIL || 2.4)
    }
  },
  diet: {
    'heavy-meat': parseFloat(typeof process !== 'undefined' && process.env?.DIET_HEAVY_MEAT || 2.5),
    'low-meat': parseFloat(typeof process !== 'undefined' && process.env?.DIET_LOW_MEAT || 1.5),
    vegetarian: parseFloat(typeof process !== 'undefined' && process.env?.DIET_VEGETARIAN || 0.9),
    vegan: parseFloat(typeof process !== 'undefined' && process.env?.DIET_VEGAN || 0.5)
  },
  waste: {
    recycle: {
      none: parseFloat(typeof process !== 'undefined' && process.env?.RECYCLE_NONE || 0.8),
      some: parseFloat(typeof process !== 'undefined' && process.env?.RECYCLE_SOME || 0.4),
      full: parseFloat(typeof process !== 'undefined' && process.env?.RECYCLE_FULL || 0.1)
    },
    shopping: {
      minimal: parseFloat(typeof process !== 'undefined' && process.env?.SHOPPING_MINIMAL || 0.3),
      average: parseFloat(typeof process !== 'undefined' && process.env?.SHOPPING_AVERAGE || 0.7),
      high: parseFloat(typeof process !== 'undefined' && process.env?.SHOPPING_HIGH || 1.5)
    }
  }
};
