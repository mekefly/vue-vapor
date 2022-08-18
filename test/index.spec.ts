import { add } from "../src";
test("first test", () => {
  expect(1 + 1).toBe(2);
});
//按F5调试错误
test("add", () => {
  expect(add(1, 1)).toBe(2);
});
