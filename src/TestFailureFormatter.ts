/**
 * A simple formatter that formats only test failures for use by Danger.
 */
export class TestFailureFormatter {
  constructor(private results: any) {}

  public format(): string {
    return this.results.testResults
      .filter((r: any) => r.failureMessage)
      .map((r: any) => r.failureMessage)
      .join('\n')
  }
}
