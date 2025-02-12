import prettier from "../../config/prettier-entry.js";
import jestPathSerializer from "../path-serializer.js";

expect.addSnapshotSerializer(jestPathSerializer);

describe("stdin no path and no parser", () => {
  describe("logs error and exits with 2", () => {
    runCli("cli/infer-parser/", [], { input: "foo" }).test({
      status: 2,
      stdout: "",
      write: [],
    });
  });

  describe("--check logs error but exits with 0", () => {
    runCli("cli/infer-parser/", ["--check"], {
      input: "foo",
    }).test({
      status: 0,
      stdout: "",
      write: [],
    });
  });

  describe("--list-different logs error but exits with 0", () => {
    runCli("cli/infer-parser/", ["--list-different"], {
      input: "foo",
    }).test({
      status: 0,
      stdout: "",
      write: [],
    });
  });
});

describe("stdin with unknown path and no parser", () => {
  describe("logs error and exits with 2", () => {
    runCli("cli/infer-parser/", ["--stdin-filepath", "foo"], {
      input: "foo",
    }).test({
      status: 2,
      stdout: "",
      write: [],
    });
  });

  describe("--check logs error but exits with 0", () => {
    runCli("cli/infer-parser/", ["--check", "--stdin-filepath", "foo"], {
      input: "foo",
    }).test({
      status: 0,
      stdout: "",
      write: [],
    });
  });

  describe("--list-different logs error but exits with 0", () => {
    runCli(
      "cli/infer-parser/",
      ["--list-different", "--stdin-filepath", "foo"],
      { input: "foo" }
    ).test({
      status: 0,
      stdout: "",
      write: [],
    });
  });
});

describe("unknown path and no parser", () => {
  describe("specific file", () => {
    runCli("cli/infer-parser/", ["--end-of-line", "lf", "FOO"]).test({
      status: 2,
      stdout: "",
      write: [],
    });
  });

  describe("multiple files", () => {
    runCli("cli/infer-parser/", ["--end-of-line", "lf", "*"]).test({
      status: 2,
      write: [],
    });
  });
});

describe("--check with unknown path and no parser", () => {
  describe("specific file", () => {
    runCli("cli/infer-parser/", ["--check", "FOO"]).test({
      status: 0,
      write: [],
    });
  });

  describe("multiple files", () => {
    runCli("cli/infer-parser/", ["--check", "*"]).test({
      status: 1,
      write: [],
    });
  });
});

describe("--list-different with unknown path and no parser", () => {
  describe("specific file", () => {
    runCli("cli/infer-parser/", ["--list-different", "FOO"]).test({
      status: 0,
      stdout: "",
      write: [],
    });
  });

  describe("multiple files", () => {
    runCli("cli/infer-parser/", ["--list-different", "*"]).test({
      status: 1,
      stdout: "foo.js",
      write: [],
    });
  });
});

describe("--write with unknown path and no parser", () => {
  describe("specific file", () => {
    runCli("cli/infer-parser/", ["--write", "FOO"]).test({
      status: 2,
      stdout: "",
      write: [],
    });
  });

  describe("multiple files", () => {
    runCli("cli/infer-parser/", ["--write", "*"]).test({
      status: 2,
    });
  });
});

describe("--write and --check with unknown path and no parser", () => {
  describe("specific file", () => {
    runCli("cli/infer-parser/", ["--check", "--write", "FOO"]).test({
      status: 0,
      write: [],
    });
  });

  describe("multiple files", () => {
    runCli("cli/infer-parser/", ["--check", "--write", "*"]).test({
      status: 0,
    });
  });
});

describe("--write and --list-different with unknown path and no parser", () => {
  describe("specific file", () => {
    runCli("cli/infer-parser/", ["--list-different", "--write", "FOO"]).test({
      status: 0,
      stdout: "",
      write: [],
    });
  });

  describe("multiple files", () => {
    runCli("cli/infer-parser/", ["--list-different", "--write", "*"]).test({
      status: 0,
    });
  });
});

describe("API with no path and no parser", () => {
  const _console = global.console;
  const result = { called: 0, arguments: [] };

  beforeEach(() => {
    global.console = {
      warn(...args) {
        result.called += 1;
        result.arguments = args;
      },
    };
  });

  afterEach(() => {
    result.called = 0;
    result.arguments = [];
    global.console = _console;
  });

  test("prettier.format", async () => {
    expect(await prettier.format(" foo  (  )")).toBe("foo();\n");
    expect(result.called).toBe(1);
    expect(result.arguments).toMatchSnapshot();
  });

  test("prettier.check", async () => {
    expect(await prettier.check(" foo (  )")).toBe(false);
    expect(result.called).toBe(1);
    expect(result.arguments).toMatchSnapshot();
  });
});

describe("Known/Unknown", () => {
  runCli("cli/infer-parser/known-unknown", [
    "--end-of-line",
    "lf",
    "--list-different",
    ".",
  ]).test({
    status: 1,
    stderr: "",
    write: [],
  });
});

describe("Interpreters", () => {
  runCli("cli/infer-parser/interpreters", ["--file-info", "zx-script"]).test({
    status: 0,
    stderr: "",
    write: [],
  });
});
