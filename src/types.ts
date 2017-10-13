export interface ISnapshot {
  added: number
  didUpdate: boolean
  failure: boolean
  filesAdded: number
  filesRemoved: number
  filesUnmatched: number
  filesUpdated: number
  matched: number
  total: number
  unchecked: number
  unmatched: number
  updated: number
}

export interface IPerfStats {
  end: any
  start: any
}

export interface ISnapshot2 {
  added: number
  fileDeleted: boolean
  matched: number
  unchecked: number
  unmatched: number
  updated: number
}

export interface IInsideFileTestResults {
  ancestorTitles: string[]
  duration: number
  failureMessages: string[]
  fullName: string
  numPassingAsserts: number
  status: string
  title: string
}

export interface IFileTestResult {
  console?: any
  failureMessage: string
  numFailingTests: number
  numPassingTests: number
  numPendingTests: number
  perfStats: IPerfStats
  snapshot: ISnapshot2
  testFilePath: string
  testResults: IInsideFileTestResults[]
  sourceMaps: {}
  skipped: boolean
  // These are from IAssertionResult
  status?: string
  title?: string
}

export interface IJestTestResults {
  numFailedTestSuites: number
  numFailedTests: number
  numPassedTestSuites: number
  numPassedTests: number
  numPendingTestSuites: number
  numPendingTests: number
  numRuntimeErrorTestSuites: number
  numTotalTestSuites: number
  numTotalTests: number
  snapshot: ISnapshot
  startTime: number
  success: boolean
  testResults: IFileTestResult[]
  wasInterrupted: boolean
}

export interface IAssertionResult {
  failureMessages: string[]
  status: string
  title: string
}

export interface ITestResult {
  assertionResults: IAssertionResult[]
  endTime: any
  message: string
  name: string
  startTime: any
  status: string
  summary: string
}

export interface IJestTestOldResults {
  numFailedTestSuites: number
  numFailedTests: number
  numPassedTestSuites: number
  numPassedTests: number
  numPendingTestSuites: number
  numPendingTests: number
  numRuntimeErrorTestSuites: number
  numTotalTestSuites: number
  numTotalTests: number
  snapshot: ISnapshot
  startTime: number
  success: boolean
  testResults: ITestResult[]
  wasInterrupted: boolean
}
