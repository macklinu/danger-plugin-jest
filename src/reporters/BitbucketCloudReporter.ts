import {
  ITestResultReporter,
  IJestTestOldResults,
  IJestTestResults,
  IInsideFileTestResults,
} from '../types'

import { DangerDSLType } from '../../node_modules/danger/distribution/dsl/DangerDSL'
import * as path from 'path'
import * as stripANSI from 'strip-ansi'
import ReporterHelper from '../ReporterHelper'

declare var danger: DangerDSLType
declare function fail(message?: string): void
declare function message(message?: string): void
declare function markdown(message?: string): void

const BitbucketCloudReporter: ITestResultReporter = {
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
    initialFailingMessage()
    const failing = jsonResults.testResults.filter(tr => tr.status === 'failed')

    failing.forEach(results => {
      var relativeFilePath = path.relative(process.cwd(), results.name)
      var failedAssertions = results.assertionResults.filter(
        r => r.status === 'failed'
      )
      var failMessage = fileToFailString(
        relativeFilePath,
        failedAssertions as any
      )
      markdown(failMessage)
    })
  },
  presentErrorsForNewStyleResults: (jsonResults: IJestTestResults) => {
    initialFailingMessage()
    const failing = jsonResults.testResults.filter(tr => tr.numFailingTests > 0)

    failing.forEach(results => {
      var relativeFilePath = path.relative(process.cwd(), results.testFilePath)
      var failedAssertions = results.testResults.filter(
        r => r.status === 'failed'
      )
      var failMessage = fileToFailString(relativeFilePath, failedAssertions)
      markdown(failMessage)
    })
  },
}

const initialFailingMessage = () => {
  fail('[danger-plugin-jest] Found some issues below.')
  markdown(
    `
→

#### ❗️[danger-plugin-jest] Error Messages ️❗️
---
`
  )
}

const linkToTest = (file: string, msg: string, title: string) => {
  var line = ReporterHelper.lineOfError(msg, file)
  return `Case: [${title}](https://bitbucket.org/${
    danger.bitbucket_cloud.pr.source.repository.full_name
  }/src/${danger.bitbucket_cloud.pr.source.commit.hash}/${file}${
    line ? `#lines-${line}` : ''
  })`
}

const assertionFailString = (
  file: string,
  status: IInsideFileTestResults
): string => `
  ${linkToTest(
    file,
    status.failureMessages && status.failureMessages[0],
    status.title
  )}


  > ${ReporterHelper.sanitizeShortErrorMessage(
    status.failureMessages && stripANSI(status.failureMessages[0])
  )}


  ##### Full message
  \`\`\`
  ${status.failureMessages && stripANSI(status.failureMessages.join('\n'))}
  \`\`\`
  `

const fileToFailString = (
  path: string,
  failedAssertions: IInsideFileTestResults[]
): string => `
❌ **Fail** in \`${path}\`
${failedAssertions
  .map(function(a) {
    return assertionFailString(path, a)
  })
  .join('\n\n')}
---

`

export default BitbucketCloudReporter
