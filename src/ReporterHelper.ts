import * as path from 'path'

const ReporterHelper = {
  lineOfError: (msg: string, filePath: string): number | null => {
    const filename = path.basename(filePath)
    const restOfTrace = msg.split(filename, 2)[1]
    return restOfTrace ? parseInt(restOfTrace.split(':')[1], 10) : null
  },
  sanitizeShortErrorMessage: (msg: string): string => {
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
  },
}

export default ReporterHelper
