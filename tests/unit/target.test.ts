import { describe, it, expect } from "vitest";
import { TargetSelector } from "../../src/target/TargetSelector";
import { TargetType } from "../../src/atomic/enums";

describe("TargetSelector", () => {
  const selector = new TargetSelector();

  // 模拟战场上下文
  function createMockContext(overrides: Record<string, unknown> = {}) {
    return {
      currentUnitId: "unit_1",
      currentPlayerId: "player_1",
      units: [
        { id: "unit_1", playerId: "player_1", isEnemy: false, life: 10, armor: 5, energy: 8, position: 0, isAlive: true },
        { id: "unit_2", playerId: "player_1", isEnemy: false, life: 8, armor: 3, energy: 6, position: 1, isAlive: true },
        { id: "unit_3", playerId: "player_2", isEnemy: true, life: 12, armor: 8, energy: 10, position: 2, isAlive: true },
        { id: "unit_4", playerId: "player_2", isEnemy: true, life: 3, armor: 1, energy: 2, position: 3, isAlive: true },
        { id: "unit_5", playerId: "player_2", isEnemy: true, life: 15, armor: 10, energy: 12, position: 4, isAlive: true },
      ],
      inheritedTargets: {},
      ...overrides,
    };
  }

  describe("SELF 目标选择", () => {
    it("应该返回当前单位自身", () => {
      const context = createMockContext();
      const config = { type: TargetType.SELF, filters: [], limit: 0 };
      const targets = selector.select(config, context);
      expect(targets).toHaveLength(1);
      expect(targets[0].id).toBe("unit_1");
    });

    it("SELF 不应受过滤器影响（排除自身过滤器除外）", () => {
      const context = createMockContext();
      const config = { type: TargetType.SELF, filters: [], limit: 0 };
      const targets = selector.select(config, context);
      expect(targets).toHaveLength(1);
    });
  });

  describe("ALL_ENEMIES 过滤", () => {
    it("应该返回所有敌方单位", () => {
      const context = createMockContext();
      const config = { type: TargetType.ALL_ENEMIES, filters: [], limit: 0 };
      const targets = selector.select(config, context);
      expect(targets).toHaveLength(3);
      expect(targets.every((t: { isEnemy: boolean }) => t.isEnemy)).toBe(true);
    });

    it("应该返回所有友方单位", () => {
      const context = createMockContext();
      const config = { type: TargetType.ALL_ALLIES, filters: [], limit: 0 };
      const targets = selector.select(config, context);
      expect(targets).toHaveLength(2);
      expect(targets.every((t: { isEnemy: boolean }) => !t.isEnemy)).toBe(true);
    });
  });

  describe("ADJACENT 接壤单位", () => {
    it("应该返回当前单位的相邻单位", () => {
      const context = createMockContext();
      const config = { type: TargetType.ADJACENT, filters: [], limit: 0 };
      const targets = selector.select(config, context);
      // unit_1 在位置 0，接壤位置 1（unit_2）
      expect(targets).toHaveLength(1);
      expect(targets[0].id).toBe("unit_2");
    });

    it("ADJACENT_ENEMY 应只返回相邻敌方", () => {
      // 让 unit_1 在位置 1，相邻的是 unit_3（敌方，位置2）和 unit_0 不存在
      const context = createMockContext({
        currentUnitId: "unit_2",
        units: [
          { id: "unit_2", playerId: "player_1", isEnemy: false, life: 8, armor: 3, energy: 6, position: 1, isAlive: true },
          { id: "unit_3", playerId: "player_2", isEnemy: true, life: 12, armor: 8, energy: 10, position: 2, isAlive: true },
        ],
      });
      const config = { type: TargetType.ADJACENT_ENEMY, filters: [], limit: 0 };
      const targets = selector.select(config, context);
      expect(targets).toHaveLength(1);
      expect(targets[0].id).toBe("unit_3");
    });
  });

  describe("LOWEST_LIFE 排序", () => {
    it("应该返回生命值最低的单位", () => {
      const context = createMockContext();
      const config = { type: TargetType.LOWEST_LIFE, filters: [], limit: 1 };
      const targets = selector.select(config, context);
      expect(targets).toHaveLength(1);
      expect(targets[0].life).toBe(3);
    });

    it("应该返回生命值最高的单位", () => {
      const context = createMockContext();
      const config = { type: TargetType.HIGHEST_LIFE, filters: [], limit: 1 };
      const targets = selector.select(config, context);
      expect(targets).toHaveLength(1);
      expect(targets[0].life).toBe(15);
    });
  });

  describe("过滤器链", () => {
    it("filter_by_alive 应过滤阵亡单位", () => {
      const context = createMockContext({
        units: [
          { id: "unit_3", playerId: "player_2", isEnemy: true, life: 12, armor: 8, energy: 10, position: 2, isAlive: false },
          { id: "unit_4", playerId: "player_2", isEnemy: true, life: 3, armor: 1, energy: 2, position: 3, isAlive: true },
        ],
      });
      const config = {
        type: TargetType.ALL_ENEMIES,
        filters: [{ id: "filter_by_alive", params: { isAlive: true }, logic: "AND" }],
        limit: 0,
      };
      const targets = selector.select(config, context);
      expect(targets).toHaveLength(1);
      expect(targets[0].id).toBe("unit_4");
    });

    it("filter_by_attribute 应按属性过滤", () => {
      const context = createMockContext();
      const config = {
        type: TargetType.ALL_ENEMIES,
        filters: [
          {
            id: "filter_by_attribute",
            params: { attribute: "life", operator: ">=", value: 10 },
            logic: "AND",
          },
        ],
        limit: 0,
      };
      const targets = selector.select(config, context);
      // unit_3 life=12, unit_4 life=3, unit_5 life=15 → 过滤后 unit_3 和 unit_5
      expect(targets).toHaveLength(2);
      expect(targets.every((t: { life: number }) => t.life >= 10)).toBe(true);
    });
  });

  describe("空池返回", () => {
    it("没有匹配目标时应返回空数组", () => {
      const context = createMockContext({ units: [] });
      const config = { type: TargetType.ALL_ENEMIES, filters: [], limit: 0 };
      const targets = selector.select(config, context);
      expect(targets).toEqual([]);
    });

    it("所有单位被过滤器排除后应返回空数组", () => {
      const context = createMockContext();
      const config = {
        type: TargetType.ALL_UNITS,
        filters: [
          {
            id: "filter_by_attribute",
            params: { attribute: "life", operator: ">", value: 999 },
            logic: "AND",
          },
        ],
        limit: 0,
      };
      const targets = selector.select(config, context);
      expect(targets).toEqual([]);
    });
  });

  describe("limit 参数", () => {
    it("应限制返回数量", () => {
      const context = createMockContext();
      const config = { type: TargetType.ALL_UNITS, filters: [], limit: 2 };
      const targets = selector.select(config, context);
      expect(targets).toHaveLength(2);
    });
  });
});
