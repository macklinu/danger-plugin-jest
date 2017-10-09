import * as fs from 'fs'
import * as path from 'path'

import * as stripANSI from 'strip-ansi'

import { DangerDSLType } from '../node_modules/danger/distribution/dsl/DangerDSL'
import { IInsideFileTestResults, IJestTestResults } from './types'
declare var danger: DangerDSLType

export interface IPluginConfig {
  testResultsJsonPath: string
}

export default function jest(config: Partial<IPluginConfig> = {}) {
  const { testResultsJsonPath = 'test-results.json' } = config

  try {
    const jsonFileContents = fs.readFileSync(testResultsJsonPath, 'utf8')
    const jsonResults: IJestTestResults = JSON.parse(jsonFileContents)

    if (jsonResults.success) {
      return
    }

    const failing = jsonResults.testResults.filter((tr) => tr.numFailingTests > 0)

    failing.forEach((results) => {
      const relativeFilePath = path.resolve(__dirname, results.testFilePath)
      const failedAssertions = results.testResults.filter((r) => r.status === 'failed')
      const failMessage = fileToFailString(relativeFilePath, failedAssertions)
      fail(failMessage)
    })

  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e)
    fail('[danger-plugin-jest] Could not read test results. Danger cannot pass or fail the build.')
  }
}

const linkToStatus = (file: string, msg: string) => {
  const line = lineOfError(msg, file)
  return danger.github.utils.fileLinks([file + (line ? '#' + line : '')])
}

const assertionFailString = (file: string, status: IInsideFileTestResults): string => `
<li>
${linkToStatus(file, status.failureMessages && status.failureMessages[0])} - ${status.title}
${sanitizeShortErrorMessage(status.failureMessages && stripANSI(status.failureMessages[0]))}

<details>
<summary>Full message</summary>
<pre><code>
${status.failureMessages && stripANSI(status.failureMessages[0])}
</code></pre>
/details>
</li>
`

const fileToFailString = (path: string, failedAssertions: IInsideFileTestResults[]): string => `
<b>FAIL</b>: ${danger.github.utils.fileLinks([path])}

${failedAssertions.map((a) => assertionFailString(path, a)).join('\n\n')}
`

const lineOfError = (msg: string, filePath: string): number | null => {
  const filename = path.basename(filePath)
  const restOfTrace = msg.split(filename, 2)[1]
  return restOfTrace ? parseInt(restOfTrace.split(':')[1], 10) : null
}

const sanitizeShortErrorMessage = (msg: string): string => {
  if (msg.includes('does not match stored snapshot')) {
    return 'Snapshot has changed'
  }

  return msg
    .split('   at', 1)[0]
    .trim()
    .split('\n')
    .splice(2)
    .join('')
    .replace(/\s\s+/g, ' ')
    .replace('Received:', ', Received:')
    .split('Difference:')[0]
}
