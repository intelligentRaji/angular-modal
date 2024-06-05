export default {
  // enforce or disallow variable initializations at definition
  'init-declarations': 'off',

  // disallow the catch clause parameter name being the same as a variable in the outer scope
  'no-catch-shadow': 'off',

  // disallow labels that share a name with a variable
  'no-label-var': 'error',

  // disallow specific globals
  'no-restricted-globals': [
    'error',
    {
      name: 'isFinite',
      message:
        'Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite',
    },
    {
      name: 'isNaN',
      message:
        'Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan',
    },
  ],

  // disallow use of undefined when initializing variables
  'no-undef-init': 'error',

  // disallow use of undefined variable
  'no-undefined': 'error',

  // disallow use of variables before they are defined
  'no-use-before-define': 'error',
};

// verified
