// src/components/utils.js

export const validate = {
  required: (value) => !!value?.toString().trim(),
  email: (value) => /\S+@\S+\.\S+/.test(value),
  telefone: (value) => /^\d{10,11}$/.test(value.replace(/\D/g, '')),
  range: (value, min = 0.1, max = 20) => {
    const n = parseFloat(value);
    return !isNaN(n) && n >= min && n <= max;
  }
};

export const format = {
  numero: (value, casas = 2) =>
    typeof value === 'number' ? value.toFixed(casas) : parseFloat(value).toFixed(casas)
};

export const logDev = (...args) => {
  if (import.meta.env.DEV) console.log('[LOG]:', ...args);
};
