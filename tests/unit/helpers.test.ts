import { describe, it, expect } from "vitest";
import { compareValues, deepClone, generateId } from "../../src/utils/helpers";

describe("compareValues", () => {
  it("相等数值应返回 0", () => {
    expect(compareValues(5, 5)).toBe(0);
  });

  it("a < b 应返回负数", () => {
    expect(compareValues(3, 10)).toBeLessThan(0);
  });

  it("a > b 应返回正数", () => {
    expect(compareValues(20, 5)).toBeGreaterThan(0);
  });

  it("等值字符串应返回 0", () => {
    expect(compareValues("abc", "abc")).toBe(0);
  });

  it("按字典序比较字符串", () => {
    expect(compareValues("abc", "xyz")).toBeLessThan(0);
    expect(compareValues("xyz", "abc")).toBeGreaterThan(0);
  });

  it("undefined 值应有序处理", () => {
    // undefined 通常排在最前面或最后面，具体取决于实现
    const result = compareValues(undefined as unknown as number, 0);
    expect(typeof result).toBe("number");
  });
});

describe("deepClone", () => {
  it("应深拷贝简单对象", () => {
    const original = { a: 1, b: "hello", c: true };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
  });

  it("修改拷贝不应影响原对象", () => {
    const original = { a: 1, b: { c: 2 } };
    const cloned = deepClone(original);

    cloned.b.c = 999;

    expect(original.b.c).toBe(2);
  });

  it("应深拷贝数组", () => {
    const original = [1, 2, { x: 10 }];
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);

    (cloned[2] as Record<string, number>).x = 999;
    expect((original[2] as Record<string, number>).x).toBe(10);
  });

  it("应处理嵌套对象", () => {
    const original = {
      level1: {
        level2: {
          level3: { value: 42, items: [1, 2, 3] },
        },
      },
    };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    cloned.level1.level2.level3.value = 100;
    expect(original.level1.level2.level3.value).toBe(42);
  });

  it("应处理 null", () => {
    expect(deepClone(null)).toBeNull();
  });

  it("应处理 undefined", () => {
    expect(deepClone(undefined)).toBeUndefined();
  });

  it("应处理基本类型", () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone("string")).toBe("string");
    expect(deepClone(true)).toBe(true);
  });
});

describe("generateId", () => {
  it("应返回字符串", () => {
    const id = generateId();
    expect(typeof id).toBe("string");
  });

  it("每次调用应生成不同的 ID", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateId());
    }
    expect(ids.size).toBe(100);
  });

  it("应返回非空字符串", () => {
    const id = generateId();
    expect(id.length).toBeGreaterThan(0);
  });

  it("带前缀参数应在前缀后追加 ID", () => {
    const id = generateId("card");
    expect(id.startsWith("card_")).toBe(true);
  });
});
