import * as fs from 'fs'
import * as path from 'path'

import * as stripANSI from 'strip-ansi'

import { DangerDSLType } from '../node_modules/danger/distribution/dsl/DangerDSL'
import { IInsideFileTestResults, IJestTestOldResults, IJestTestResults } from './types'
declare var danger: DangerDSLType

export interface IPluginConfig {
  testResultsJsonPath: string
}

export default function jest(config: Partial<IPluginConfig> = {}) {
  const { testResultsJsonPath = 'test-results.json' } = config
  try {
    const jsonFileContents = fs.readFileSync(testResultsJsonPath, 'utf8')
    const jsonResults: IJestTestResults = JSON.parse(jsonFileContents)
    // console.log(jsonResults)
    if (jsonResults.success) {
      // tslint:disable-next-line:no-console
      console.log('Jest tests passed :+1:')
      return
    }
    // console.log(1)

    const isModernFormatResults = jsonResults.testResults[0].testResults
    if (isModernFormatResults) {
      presentErrorsForNewStyleResults(jsonResults)
    } else {
      presentErrorsForOldStyleResults(jsonResults as any)
    }
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e)
    fail('[danger-plugin-jest] Could not read test results. Danger cannot pass or fail the build.')
  }
}

const presentErrorsForOldStyleResults = (jsonResults: IJestTestOldResults) => {
  const failing = jsonResults.testResults.filter((tr) => tr.status === 'failed')

  failing.forEach((results) => {
    const relativeFilePath = path.relative(process.cwd(), results.name)
    const failedAssertions = results.assertionResults.filter((r) => r.status === 'failed')
    const failMessage = fileToFailString(relativeFilePath, failedAssertions as any)
    fail(failMessage)
  })
}

const presentErrorsForNewStyleResults = (jsonResults: IJestTestResults) => {
  const failing = jsonResults.testResults.filter((tr) => tr.numFailingTests > 0)

  failing.forEach((results) => {
    const relativeFilePath = path.relative(process.cwd(), results.testFilePath)
    const failedAssertions = results.testResults.filter((r) => r.status === 'failed')
    const failMessage = fileToFailString(relativeFilePath, failedAssertions)
    fail(failMessage)
  })
}

// e.g. https://github.com/orta/danger-plugin-jest/blob/master/src/__tests__/fails.test.ts
const linkToTest = (file: string, msg: string, title: string) => {
  const line = lineOfError(msg, file)
  const repo = danger.github.pr.head.repo
  const urlParts = [
    'https://github.com',
    repo.full_name,
    'blob',
    danger.github.pr.head.ref,
    `${file}${'line' ? '#L' + line : ''}`,
  ]
  return `<a href='${urlParts.join('/')}'>${title}</a>`
}

const assertionFailString = (file: string, status: IInsideFileTestResults): string => `
<li>
${linkToTest(file, status.failureMessages && status.failureMessages[0], status.title)}
<br/>
${sanitizeShortErrorMessage(status.failureMessages && stripANSI(status.failureMessages[0]))}

<details>
<summary>Full message</summary>
<pre><code>
${status.failureMessages && stripANSI(status.failureMessages.join('\n'))}
</code></pre>
</details>
</li>
<br/>
`

const fileToFailString = (path: string, failedAssertions: IInsideFileTestResults[]): string => `
<b>🃏 FAIL</b> in ${danger.github.utils.fileLinks([path])}

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
    .replace('Received:', ', received:')
    .replace('., received', ', received')
    .split('Difference:')[0]
}
