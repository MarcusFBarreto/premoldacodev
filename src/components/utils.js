export const validate = {
  required: (v) => !!v?.trim(),
  email: (v) => /\S+@\S+\.\S+/.test(v),
  telefone: (v) => /^\d{10,11}$/.test(v?.replace(/\D/g, '')),
  range: (v, min, max) => parseFloat(v) >= min && parseFloat(v) <= max
};
