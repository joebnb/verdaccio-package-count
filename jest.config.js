module.exports = {
  name: 'verdaccio-<%= name %>',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  verbose: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: ['node_modules'],
};
