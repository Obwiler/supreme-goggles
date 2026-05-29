import { create } from "zustand";
import { CardType, Rarity } from "@/atomic";
function generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
function createEmptySkill() {
    const now = Date.now();
    return {
        id: generateId("skill"),
        version: "1.0",
        createdAt: now,
        updatedAt: now,
        name: "新技能",
        description: "",
        conditions: [],
        costs: [],
        effects: [],
        cooldown: 0,
        useLimit: 0,
        isPassive: false
    };
}
function createDefaultCard(type) {
    const now = Date.now();
    const base = {
        id: generateId("card"),
        version: "1.0",
        createdAt: now,
        updatedAt: now,
        name: "",
        displayName: "",
        type,
        rarity: Rarity.WHITE,
        skills: [],
        tags: [],
        mutuallyExclusive: [],
        baseStats: {},
        maxCount: 2,
        priority: 80,
        description: "",
        flavorText: ""
    };
    if (type === CardType.BASIC) {
        base.skills.push(createEmptySkill());
    }
    return base;
}
const useCardStore = create((set, get) => ({
    currentCard: null,
    currentStep: 0,
    setCardType: (type) => {
        set({ currentCard: createDefaultCard(type), currentStep: 1 });
    },
    updateBasicInfo: (info) => {
        set((state) => {
            if (!state.currentCard)
                return state;
            return {
                currentCard: { ...state.currentCard, ...info, updatedAt: Date.now() }
            };
        });
    },
    addSkill: (skill) => {
        set((state) => {
            if (!state.currentCard)
                return state;
            return {
                currentCard: {
                    ...state.currentCard,
                    skills: [...state.currentCard.skills, skill],
                    updatedAt: Date.now()
                }
            };
        });
    },
    removeSkill: (skillId) => {
        set((state) => {
            if (!state.currentCard)
                return state;
            return {
                currentCard: {
                    ...state.currentCard,
                    skills: state.currentCard.skills.filter((s) => s.id !== skillId),
                    updatedAt: Date.now()
                }
            };
        });
    },
    updateSkill: (skillId, partial) => {
        set((state) => {
            if (!state.currentCard)
                return state;
            return {
                currentCard: {
                    ...state.currentCard,
                    skills: state.currentCard.skills.map((s) => s.id === skillId ? { ...s, ...partial, updatedAt: Date.now() } : s),
                    updatedAt: Date.now()
                }
            };
        });
    },
    updateAllSkills: (skills) => {
        set((state) => {
            if (!state.currentCard)
                return state;
            return {
                currentCard: {
                    ...state.currentCard,
                    skills: skills.map((s) => ({ ...s, updatedAt: Date.now() })),
                    updatedAt: Date.now()
                }
            };
        });
    },
    setStep: (step) => set({ currentStep: step }),
    nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 4) })),
    prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
    resetCard: () => set({ currentCard: null, currentStep: 0 }),
    getCardData: () => get().currentCard
}));
export { useCardStore };
