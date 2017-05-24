import * as fs from 'fs'

import { TestFailureFormatter } from './TestFailureFormatter'

interface IPluginConfig {
  testResultsJsonPath?: string
}

interface IJestTestResults {
  success: boolean
}

export default function jest(config: IPluginConfig = {}) {
  const {
    testResultsJsonPath = 'test-results.json',
  } = config

  try {
    const jsonFileContents = fs.readFileSync(testResultsJsonPath, 'utf8')
    const testResults: IJestTestResults = JSON.parse(jsonFileContents)
    if (testResults.success) {
      message(':white_check_mark: Jest tests passed')
    } else {
      const formattedFailures = new TestFailureFormatter(testResults).format()
      fail(`:no_good_man: Jest tests failed:

\`\`\`
${formattedFailures}
\`\`\``)
    }
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e)
    warn('Could not read test results. Danger cannot pass or fail the build.')
  }
}
