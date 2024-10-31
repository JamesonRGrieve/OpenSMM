const jrgComponentsConfig = require('jrgcomponents/tailwind.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...jrgComponentsConfig,
  extend: {
    ...jrgComponentsConfig.extend,
    backgroundImage: {
      'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
    },
    animation: {
      ...jrgComponentsConfig.extend.animation,
      in: 'in 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      out: 'out 150ms ease-in-out',
    },
    keyframes: {
      ...jrgComponentsConfig.extend.keyframes,
      in: {
        from: { transform: 'translateY(100%)', opacity: '0' },
        to: { transform: 'translateY(0)', opacity: '1' },
      },
      out: {
        from: { transform: 'translateY(0)', opacity: '1' },
        to: { transform: 'translateY(100%)', opacity: '0' },
      },
    },
  },
};
