import * as path from 'path'

import jestResults from '..'

// tslint:disable:no-string-literal

beforeEach(() => {
  global['message'] = jest.fn()
  global['fail'] = jest.fn()
  global['warn'] = jest.fn()
})

test('messages with passing test results', () => {
  jestResults({
    testResultsJsonPath: fixture('passing-tests.json'),
  })
  expect(global['message']).toHaveBeenCalled()
})

test('fails with failing test results', () => {
  jestResults({
    testResultsJsonPath: fixture('failing-tests.json'),
  })
  expect(global['fail']).toHaveBeenCalledWith(expect.stringMatching(/Jest tests failed/))
})

test('warns when test results JSON file cannot be read', () => {
  jestResults({
    testResultsJsonPath: fixture('nonexistent.json'),
  })
  expect(global['warn']).toHaveBeenCalled()
})

const fixture = (filename: string) => path.resolve(__dirname, '__fixtures__', filename)
