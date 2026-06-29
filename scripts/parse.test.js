import { execFileSync, spawnSync } from "child_process";
import path from "path";

const cliPath = path.resolve(__dirname, "parse.js");

test("parse command prints all parse results as formatted JSON by default", () => {
  const output = execFileSync(
    process.execPath,
    [cliPath, "广东东莞市大朗镇测试路288号测试大厦22楼测试律师事务所"],
    { encoding: "utf8" }
  );

  const result = JSON.parse(output);

  expect(Array.isArray(result)).toBe(true);
  expect(result[0]["code"]).toEqual("441933");
  expect(result[0]["name"]).toEqual("测试律师事务所");
});

test("parse command --first prints only the first parse result", () => {
  const output = execFileSync(
    process.execPath,
    [cliPath, "--first", "广东湛江市开发区测试路88号测试大厦1001室(测试单位)张三收，19900000000"],
    { encoding: "utf8" }
  );

  const result = JSON.parse(output);

  expect(Array.isArray(result)).toBe(false);
  expect(result["code"]).toEqual("440890");
  expect(result["name"]).toEqual("张三");
  expect(result["mobile"]).toEqual("19900000000");
});

test("parse command exits with usage when address is missing", () => {
  const result = spawnSync(process.execPath, [cliPath], { encoding: "utf8" });

  expect(result.status).toEqual(1);
  expect(result.stderr).toContain("Usage: pnpm parse [--first] <address>");
});
