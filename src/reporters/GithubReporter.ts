import {
  ITestResultReporter,
  IJestTestResults,
  IJestTestOldResults,
  IInsideFileTestResults,
} from '../types'

import { DangerDSLType } from '../../node_modules/danger/distribution/dsl/DangerDSL'
import * as path from 'path'
import * as stripANSI from 'strip-ansi'
import ReporterHelper from '../ReporterHelper'

declare var danger: DangerDSLType
declare function fail(message?: string): void
declare function message(message?: string): void

const GithubReporter: ITestResultReporter = {
  jestSuccessFeedback: (
    jsonResults: IJestTestResults,
    showSuccessMessage: boolean
  ) => {
    if (!showSuccessMessage) {
      // tslint:disable-next-line:no-console
      console.log(':+1: Jest tests passed')
    } else {
      message(
        `:+1: Jest tests passed: ${jsonResults.numPassedTests}/${jsonResults.numTotalTests} (${jsonResults.numPendingTests} skipped)`
      )
    }
  },
  presentErrorsForOldStyleResults: (jsonResults: IJestTestOldResults) => {
    const failing = jsonResults.testResults.filter(tr => tr.status === 'failed')

    failing.forEach(results => {
      const relativeFilePath = path.relative(process.cwd(), results.name)
      const failedAssertions = results.assertionResults.filter(
        r => r.status === 'failed'
      )
      const failMessage = fileToFailString(
        relativeFilePath,
        failedAssertions as any
      )
      fail(failMessage)
    })
  },
  presentErrorsForNewStyleResults: (jsonResults: IJestTestResults) => {
    const failing = jsonResults.testResults.filter(tr => tr.numFailingTests > 0)

    failing.forEach(results => {
      const relativeFilePath = path.relative(
        process.cwd(),
        results.testFilePath
      )
      const failedAssertions = results.testResults.filter(
        r => r.status === 'failed'
      )
      const failMessage = fileToFailString(relativeFilePath, failedAssertions)
      fail(failMessage)
    })
  },
}

// e.g. https://github.com/orta/danger-plugin-jest/blob/master/src/__tests__/fails.test.ts
const linkToTest = (file: string, msg: string, title: string) => {
  const line = ReporterHelper.lineOfError(msg, file)
  const githubRoot = danger.github.pr.head.repo.html_url.split(
    danger.github.pr.head.repo.owner.login
  )[0]
  const repo = danger.github.pr.head.repo
  const url = `${githubRoot}${repo.full_name}/blob/${
    danger.github.pr.head.ref
  }/${file}${line ? `#L${line}` : ''}`
  return `<a href='${url}'>${title}</a>`
}

const assertionFailString = (
  file: string,
  status: IInsideFileTestResults
): string => `
  <li>
  ${linkToTest(
    file,
    status.failureMessages && status.failureMessages[0],
    status.title
  )}
  <br/>
  ${ReporterHelper.sanitizeShortErrorMessage(
    status.failureMessages && stripANSI(status.failureMessages[0])
  )}
  
  <details>
  <summary>Full message</summary>
  <pre><code>
  ${status.failureMessages && stripANSI(status.failureMessages.join('\n'))}
  </code></pre>
  </details>
  </li>
  <br/>
  `

const fileToFailString = (
  // tslint:disable-next-line:no-shadowed-variable
  path: string,
  failedAssertions: IInsideFileTestResults[]
): string => `
  <b>🃏 FAIL</b> in ${danger.github.utils.fileLinks([path])}
  
  ${failedAssertions.map(a => assertionFailString(path, a)).join('\n\n')}
  `

export default GithubReporter
