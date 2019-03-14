import * as path from "path";

import jestResults from "..";

// tslint:disable:no-string-literal

describe("jestResults", () => {
  beforeEach(() => {
    global["message"] = jest.fn();
    global["fail"] = jest.fn();
    global["warn"] = jest.fn();
    global["danger"] = {
      github: {
        pr: {
          head: {
            ref: "branch",
            repo: {
              full_name: "repo/slug"
            }
          }
        },
        utils: {
          fileLinks: <T>(a: T) => a
        }
      }
    };
  });

  it("messages with passing test results", () => {
    jestResults({
      testResultsJsonPath: fixture("passing-tests.json")
    });
    expect(global["fail"]).not.toHaveBeenCalled();
  });

  it("fails with failing test results", () => {
    jestResults({
      testResultsJsonPath: fixture("failing-tests.json")
    });
    expect(global["fail"]).toHaveBeenCalledWith(expect.stringMatching(/FAIL/));
  });

  it("fails with failing test results from jest 20", () => {
    jestResults({
      testResultsJsonPath: fixture("failed-tests-j20.json")
    });
    expect(global["fail"]).toHaveBeenCalledWith(expect.stringMatching(/FAIL/));
  });

  it("warns when test results JSON file cannot be read", () => {
    jestResults({
      testResultsJsonPath: fixture("nonexistent.json")
    });
    expect(global["fail"]).toHaveBeenCalled();
  });

  it.skip("Fails 6", () => {
    expect({ v: "asda" }).toContain("s");
  });

  const fixture = (filename: string) =>
    path.resolve(__dirname, "__fixtures__", filename);
});
