import { describe, it, expect, beforeEach } from "vitest";
import { useCardStore } from "../../src/store/cardStore";

describe("useCardStore", () => {
  beforeEach(() => {
    // 重置 store 到初始状态
    const store = useCardStore.getState();
    store.resetCard();
  });

  describe("setCardType 创建默认卡牌", () => {
    it("选择基本牌类型应自动创建默认卡牌数据", () => {
      const store = useCardStore.getState();
      store.setCardType("basic");

      const state = useCardStore.getState();
      expect(state.currentCard).not.toBeNull();
      expect(state.currentCard?.type).toBe("basic");
    });

    it("基本牌应自动添加 1 个默认技能", () => {
      const store = useCardStore.getState();
      store.setCardType("basic");

      const state = useCardStore.getState();
      expect(state.currentCard?.skills).toHaveLength(1);
    });

    it("选择非基本牌类型不应自动添加技能", () => {
      const store = useCardStore.getState();
      store.setCardType("camp");

      const state = useCardStore.getState();
      expect(state.currentCard?.skills).toHaveLength(0);
    });

    it("选择阵营牌类型应正确设置", () => {
      const store = useCardStore.getState();
      store.setCardType("camp");

      const state = useCardStore.getState();
      expect(state.currentCard?.type).toBe("camp");
      expect(state.currentCard?.rarity).toBeFalsy();
    });

    it("切换卡牌类型应更新 currentCard", () => {
      const store = useCardStore.getState();
      store.setCardType("camp");

      let state = useCardStore.getState();
      expect(state.currentCard?.type).toBe("camp");

      state.setCardType("career");
      state = useCardStore.getState();
      expect(state.currentCard?.type).toBe("career");
    });
  });

  describe("updateBasicInfo", () => {
    it("应更新卡牌名称", () => {
      const store = useCardStore.getState();
      store.setCardType("camp");
      store.updateBasicInfo({ name: "sword_master", displayName: "剑圣" });

      const state = useCardStore.getState();
      expect(state.currentCard?.name).toBe("sword_master");
      expect(state.currentCard?.displayName).toBe("剑圣");
    });

    it("应更新冷却和使用次数", () => {
      const store = useCardStore.getState();
      store.setCardType("camp");
      store.updateBasicInfo({ coolDown: 3, useLimit: 2 });

      const state = useCardStore.getState();
      expect(state.currentCard?.coolDown).toBe(3);
      expect(state.currentCard?.useLimit).toBe(2);
    });

    it("应更新标签", () => {
      const store = useCardStore.getState();
      store.setCardType("camp");
      store.updateBasicInfo({ tags: ["物理", "近战"] });

      const state = useCardStore.getState();
      expect(state.currentCard?.tags).toEqual(["物理", "近战"]);
    });

    it("基本牌应更新品质", () => {
      const store = useCardStore.getState();
      store.setCardType("basic");
      store.updateBasicInfo({ rarity: "purple" });

      const state = useCardStore.getState();
      expect(state.currentCard?.rarity).toBe("purple");
    });
  });

  describe("addSkill / removeSkill", () => {
    it("应添加新技能到技能列表", () => {
      const store = useCardStore.getState();
      store.setCardType("camp");
      store.addSkill();

      const state = useCardStore.getState();
      expect(state.currentCard?.skills).toHaveLength(1);
      expect(state.currentCard?.skills[0].name).toBe("新技能");
    });

    it("基本牌添加第二个技能应被阻止", () => {
      const store = useCardStore.getState();
      store.setCardType("basic");
      // 基本牌已有 1 个默认技能，再添加应被阻止或静默忽略
      store.addSkill();

      const state = useCardStore.getState();
      expect(state.currentCard?.skills.length).toBeLessThanOrEqual(1);
    });

    it("应正确移除指定技能", () => {
      const store = useCardStore.getState();
      store.setCardType("camp");
      store.addSkill();
      store.addSkill();

      let state = useCardStore.getState();
      const skillId = state.currentCard!.skills[0].id;
      expect(state.currentCard?.skills).toHaveLength(2);

      store.removeSkill(skillId);
      state = useCardStore.getState();
      expect(state.currentCard?.skills).toHaveLength(1);
      expect(state.currentCard?.skills[0].id).not.toBe(skillId);
    });

    it("移除最后一个技能后技能列表应为空", () => {
      const store = useCardStore.getState();
      store.setCardType("camp");
      store.addSkill();

      let state = useCardStore.getState();
      const skillId = state.currentCard!.skills[0].id;

      store.removeSkill(skillId);
      state = useCardStore.getState();
      expect(state.currentCard?.skills).toHaveLength(0);
    });
  });

  describe("resetCard", () => {
    it("应重置所有卡牌数据到初始状态", () => {
      const store = useCardStore.getState();
      store.setCardType("camp");
      store.updateBasicInfo({ name: "test", displayName: "测试", coolDown: 3, useLimit: 2 });
      store.addSkill();

      store.resetCard();

      const state = useCardStore.getState();
      expect(state.currentCard).toBeNull();
      expect(state.currentStep).toBe(0);
    });
  });

  describe("步骤导航", () => {
    it("nextStep 应推进步骤", () => {
      const store = useCardStore.getState();
      expect(store.currentStep).toBe(0);
      store.nextStep();
      expect(useCardStore.getState().currentStep).toBe(1);
    });

    it("prevStep 应回退步骤", () => {
      const store = useCardStore.getState();
      store.nextStep();
      store.nextStep();
      expect(useCardStore.getState().currentStep).toBe(2);

      useCardStore.getState().prevStep();
      expect(useCardStore.getState().currentStep).toBe(1);
    });

    it("步骤 0 时 prevStep 不应回退到负数", () => {
      const store = useCardStore.getState();
      store.prevStep();
      expect(useCardStore.getState().currentStep).toBe(0);
    });

    it("步骤 3 时 nextStep 不应超出", () => {
      const store = useCardStore.getState();
      store.nextStep(); // 1
      store.nextStep(); // 2
      store.nextStep(); // 3
      store.nextStep(); // 不应超出
      expect(useCardStore.getState().currentStep).toBe(3);
    });
  });
});
