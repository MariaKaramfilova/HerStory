export default {
  verbose: true,
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-native"
      + "|react-navigation-tabs"
      + "|react-native-splash-screen"
      + "|react-native-screens"
      + "|react-native-reanimated"
      + "|react-router-dom"
    + ")/)",
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '.+\\.(css|styl|less|sass|scss)$': 'jest-css-modules-transform',
  },
};
