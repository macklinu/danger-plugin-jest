import * as fs from 'fs'

import { IJestTestResults, ITestResultReporter } from './types'

import GithubTestResultReporter from './reporters/GithubTestResultReporter'

declare function fail(message?: string): void

export interface IPluginConfig {
  testResultsJsonPath: string
  showSuccessMessage: boolean
  reporter?: ITestResultReporter
}

export default function jest(config: Partial<IPluginConfig> = {}) {
  const {
    testResultsJsonPath = 'test-results.json',
    showSuccessMessage = false,
    reporter = GithubTestResultReporter,
  } = config
  try {
    const jsonFileContents = fs.readFileSync(testResultsJsonPath, 'utf8')
    const jsonResults: IJestTestResults = JSON.parse(jsonFileContents)
    if (jsonResults.success) {
      reporter.jestSuccessFeedback(jsonResults, showSuccessMessage)
      return
    }

    const isModernFormatResults = jsonResults.testResults[0].testResults
    if (isModernFormatResults) {
      reporter.presentErrorsForNewStyleResults(jsonResults)
    } else {
      reporter.presentErrorsForOldStyleResults(jsonResults as any)
    }
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e)
    fail(
      '[danger-plugin-jest] Could not read test results. Danger cannot pass or fail the build.'
    )
  }
}
