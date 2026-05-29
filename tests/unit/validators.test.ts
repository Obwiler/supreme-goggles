import { describe, it, expect } from "vitest";
import { validateCard, validateSkill } from "../../src/utils/validators";

describe("validateCard", () => {
  const createBaseCard = (overrides: Record<string, unknown> = {}) => ({
    id: "test_card",
    version: "1.0",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    name: "test_card",
    displayName: "测试卡牌",
    type: "camp",
    rarity: "blue",
    skills: [],
    tags: [],
    mutuallyExclusive: [],
    baseStats: { life: 0, armor: 0, energy: 0, attack: 0 },
    maxCount: 2,
    priority: 80,
    description: "测试描述",
    ...overrides,
  });

  describe("属性上限校验", () => {
    it("生命值超过上限时应报错", () => {
      const card = createBaseCard({ baseStats: { life: 20, armor: 0, energy: 0 } });
      const result = validateCard(card);
      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.message.includes("生命"))).toBe(true);
    });

    it("护甲值超过上限时应报错", () => {
      const card = createBaseCard({ baseStats: { life: 0, armor: 15, energy: 0 } });
      const result = validateCard(card);
      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.message.includes("护甲"))).toBe(true);
    });

    it("能量值超过上限时应报错", () => {
      const card = createBaseCard({ baseStats: { life: 0, armor: 0, energy: 12 } });
      const result = validateCard(card);
      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.message.includes("能量") || e.message.includes("技力"))).toBe(true);
    });

    it("属性值在合法范围内应通过", () => {
      const card = createBaseCard({ baseStats: { life: 10, armor: 8, energy: 6 } });
      const result = validateCard(card);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("技能数量限制", () => {
    it("技能数量超过上限时应报错", () => {
      const skills = Array.from({ length: 6 }, (_, i) => ({
        id: `skill_${i}`,
        version: "1.0",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        name: `技能 ${i}`,
        description: "",
        conditions: [],
        costs: [],
        effects: [],
        cooldown: 0,
        useLimit: 0,
        isPassive: false,
      }));
      const card = createBaseCard({ skills });
      const result = validateCard(card);
      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.message.includes("技能"))).toBe(true);
    });

    it("技能数量在合法范围内应通过", () => {
      const card = createBaseCard({ skills: [] });
      const result = validateCard(card);
      expect(result.success).toBe(true);
    });
  });

  describe("名称长度校验", () => {
    it("名称为空时应报错", () => {
      const card = createBaseCard({ name: "", displayName: "" });
      const result = validateCard(card);
      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.message.includes("名称"))).toBe(true);
    });

    it("名称过长时应报错", () => {
      const longName = "x".repeat(51);
      const card = createBaseCard({ name: longName, displayName: longName });
      const result = validateCard(card);
      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.message.includes("名称") || e.message.includes("长度"))).toBe(true);
    });

    it("名称在合法范围内应通过", () => {
      const card = createBaseCard({ name: "valid_name", displayName: "合法名称" });
      const result = validateCard(card);
      expect(result.success).toBe(true);
    });
  });
});

describe("validateSkill", () => {
  const createSkill = (overrides: Record<string, unknown> = {}) => ({
    id: "skill_test",
    version: "1.0",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    name: "测试技能",
    description: "",
    conditions: [],
    costs: [],
    effects: [],
    cooldown: 0,
    useLimit: 0,
    isPassive: false,
    ...overrides,
  });

  describe("冷却范围", () => {
    it("冷却时间为负数时应报错", () => {
      const skill = createSkill({ cooldown: -1 });
      const result = validateSkill(skill);
      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.message.includes("冷却"))).toBe(true);
    });

    it("冷却时间超过上限时应报错", () => {
      const skill = createSkill({ cooldown: 100 });
      const result = validateSkill(skill);
      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.message.includes("冷却"))).toBe(true);
    });

    it("冷却时间在合法范围内应通过", () => {
      const skill = createSkill({ cooldown: 3 });
      const result = validateSkill(skill);
      expect(result.success).toBe(true);
    });

    it("冷却时间为 0 应通过", () => {
      const skill = createSkill({ cooldown: 0 });
      const result = validateSkill(skill);
      expect(result.success).toBe(true);
    });
  });

  describe("使用次数范围", () => {
    it("使用次数为负数时应报错", () => {
      const skill = createSkill({ useLimit: -5 });
      const result = validateSkill(skill);
      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.message.includes("使用次数") || e.message.includes("上限"))).toBe(true);
    });

    it("使用次数超过上限时应报错", () => {
      const skill = createSkill({ useLimit: 100 });
      const result = validateSkill(skill);
      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.message.includes("使用次数") || e.message.includes("上限"))).toBe(true);
    });

    it("使用次数为 0（无限）应通过", () => {
      const skill = createSkill({ useLimit: 0 });
      const result = validateSkill(skill);
      expect(result.success).toBe(true);
    });
  });
});
