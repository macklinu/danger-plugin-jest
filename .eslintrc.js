module.exports = {
  extends: ['macklinu', 'macklinu/typescript'],
  overrides: [
    {
      files: ['src/**/*.test.ts'],
      extends: ['macklinu/jest'],
    },
  ],
}
