import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Tabs, Button, Input, Switch, InputNumber, Collapse, Select, Card, Space, Typography, Empty, Popconfirm, } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { AttributeType, Timing, StackingType, TargetType, LogicOperator, CardType, TIMING_LABELS, STACKING_LABELS, TARGET_TYPE_LABELS, LOGIC_LABELS, ATTRIBUTE_LABELS, } from "@/atomic";
import { conditionTemplates, costTemplates, effectTemplates, } from "@/templates";
import { generateCardDescription } from "@/utils/exporters";
import { markManager, useCardStore } from "@/store";
import { generateId } from "@/utils/helpers";
const { Text, Title, Paragraph } = Typography;
const TIMING_OPTIONS = Object.values(Timing).map((v) => ({
    value: v,
    label: TIMING_LABELS[v] ?? v,
}));
const STACKING_OPTIONS = Object.values(StackingType).map((v) => ({
    value: v,
    label: STACKING_LABELS[v] ?? v,
}));
const TARGET_OPTIONS = Object.values(TargetType).map((v) => ({
    value: v,
    label: TARGET_TYPE_LABELS[v] ?? v,
}));
const LOGIC_OPTIONS = Object.values(LogicOperator).map((v) => ({
    value: v,
    label: LOGIC_LABELS[v] ?? v,
}));
const ATTRIBUTE_OPTIONS = Object.values(AttributeType).map((v) => ({
    value: v,
    label: ATTRIBUTE_LABELS[v] ?? v,
}));
function getMarkOptions() {
    return markManager.getAllMarks().map((m) => ({
        value: m.id,
        label: m.displayName || m.name,
    }));
}
function renderParamInput(param, value, onChange) {
    const commonProps = {
        style: { width: "100%" },
        placeholder: param.label,
    };
    switch (param.type) {
        case "number":
            return (_jsx(InputNumber, { ...commonProps, min: param.min, max: param.max, value: value, onChange: (v) => onChange(param.key, v) }));
        case "select":
            return (_jsx(Select, { ...commonProps, options: param.options, value: value, onChange: (v) => onChange(param.key, v) }));
        case "boolean":
            return (_jsx(Switch, { checked: !!value, onChange: (v) => onChange(param.key, v) }));
        case "attribute":
            return (_jsx(Select, { ...commonProps, options: ATTRIBUTE_OPTIONS, value: value, onChange: (v) => onChange(param.key, v) }));
        case "mark":
            return (_jsx(Select, { ...commonProps, options: getMarkOptions(), value: value, onChange: (v) => onChange(param.key, v) }));
        case "string":
        default:
            return (_jsx(Input, { ...commonProps, value: value, onChange: (e) => onChange(param.key, e.target.value) }));
    }
}
function Step3_EffectEdit({ onNext, onPrev }) {
    const currentCard = useCardStore((s) => s.currentCard);
    const updateAllSkills = useCardStore((s) => s.updateAllSkills);
    const addSkill = useCardStore((s) => s.addSkill);
    const removeSkill = useCardStore((s) => s.removeSkill);
    const [activeSkillIdx, setActiveSkillIdx] = useState("0");
    const [pendingSkills, setPendingSkills] = useState(currentCard?.skills ? currentCard.skills.map((s) => ({ ...s })) : []);
    const [collapseActiveKeys, setCollapseActiveKeys] = useState([
        "conditions",
        "costs",
        "effects",
    ]);
    const [flashItem, setFlashItem] = useState(null);
    const isBasic = currentCard?.type === CardType.BASIC;
    const maxSkills = isBasic ? 1 : 5;
    const handleSkillChange = useCallback((skillId, partial) => {
        setPendingSkills((prev) => prev.map((s) => (s.id === skillId ? { ...s, ...partial, updatedAt: Date.now() } : s)));
    }, []);
    const handleAddInstance = useCallback((skillId, type, instance) => {
        setPendingSkills((prev) => prev.map((s) => {
            if (s.id !== skillId)
                return s;
            const arr = [...s[type]];
            arr.push(instance);
            return { ...s, [type]: arr, updatedAt: Date.now() };
        }));
        // 自动展开对应面板并高亮新项
        setCollapseActiveKeys((prev) => {
            if (!prev.includes(type))
                return [...prev, type];
            return prev;
        });
        // 延迟设置 flashKey，等待 state 更新后拿到正确的 index
        setPendingSkills((prev) => {
            const skill = prev.find((s) => s.id === skillId);
            if (skill) {
                const newIdx = skill[type].length - 1;
                setTimeout(() => {
                    setFlashItem(`${type}_${newIdx}`);
                    // 滚动到新项
                    const el = document.getElementById(`skill-${skillId}-${type}-${newIdx}`);
                    if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                }, 50);
            }
            return prev;
        });
    }, []);
    const handleRemoveInstance = useCallback((skillId, type, index) => {
        setPendingSkills((prev) => prev.map((s) => {
            if (s.id !== skillId)
                return s;
            const arr = [...s[type]];
            arr.splice(index, 1);
            return { ...s, [type]: arr, updatedAt: Date.now() };
        }));
    }, []);
    // 高亮闪烁自动清除
    useEffect(() => {
        if (!flashItem)
            return;
        const timer = setTimeout(() => setFlashItem(null), 1800);
        return () => clearTimeout(timer);
    }, [flashItem]);
    const handleInstanceParamChange = useCallback((skillId, type, index, key, value) => {
        // 顶层键：不写入 params
        const topLevelKeys = [
            "conditionId", "costId", "effectId", "params",
            "logic", "timing", "stacking", "target",
            "inheritTarget", "saveAsInherit", "limit"
        ];
        const isTopLevel = topLevelKeys.includes(key);
        setPendingSkills((prev) => prev.map((s) => {
            if (s.id !== skillId)
                return s;
            const arr = [...s[type]];
            if (arr[index]) {
                arr[index] = {
                    ...arr[index],
                    [key]: value,
                    ...(isTopLevel
                        ? {}
                        : { params: { ...(arr[index].params || {}), [key]: value } }),
                };
            }
            return { ...s, [type]: arr, updatedAt: Date.now() };
        }));
    }, []);
    const handleApply = useCallback(() => {
        if (!currentCard)
            return;
        updateAllSkills(pendingSkills);
    }, [currentCard, pendingSkills, updateAllSkills]);
    const handleAddSkill = useCallback(() => {
        const now = Date.now();
        const newSkill = {
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
            isPassive: false,
        };
        addSkill(newSkill);
        setPendingSkills((prev) => [...prev, newSkill]);
        setActiveSkillIdx(String(pendingSkills.length));
    }, [addSkill, pendingSkills.length]);
    const handleRemoveSkill = useCallback((skillId) => {
        removeSkill(skillId);
        setPendingSkills((prev) => prev.filter((s) => s.id !== skillId));
        setActiveSkillIdx("0");
    }, [removeSkill]);
    // Build a card-like object for description preview
    const previewCard = useMemo(() => {
        if (!currentCard)
            return null;
        return {
            ...currentCard,
            skills: pendingSkills,
        };
    }, [currentCard, pendingSkills]);
    const description = previewCard ? generateCardDescription(previewCard) : "";
    if (!currentCard) {
        return _jsx(Empty, { description: "\u8BF7\u5148\u9009\u62E9\u5361\u724C\u7C7B\u578B" });
    }
    const tabItems = pendingSkills.map((skill, idx) => ({
        key: String(idx),
        label: (_jsxs("span", { children: [skill.name || `技能 ${idx + 1}`, pendingSkills.length > 1 && (_jsx(Popconfirm, { title: "\u786E\u5B9A\u5220\u9664\u6B64\u6280\u80FD\uFF1F", onConfirm: () => handleRemoveSkill(skill.id), children: _jsx(DeleteOutlined, { style: { marginLeft: 8, color: "#ff4d4f", cursor: "pointer" } }) }))] })),
        children: (_jsxs("div", { style: { padding: "0 4px" }, children: [_jsx(Space, { direction: "vertical", style: { width: "100%", marginBottom: 16 }, children: _jsxs(Space, { wrap: true, children: [_jsxs("div", { children: [_jsx(Text, { style: { marginRight: 8 }, children: "\u6280\u80FD\u540D\u79F0" }), _jsx(Input, { style: { width: 200 }, value: skill.name, onChange: (e) => handleSkillChange(skill.id, { name: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Text, { style: { marginRight: 8 }, children: "\u88AB\u52A8\u6280\u80FD" }), _jsx(Switch, { checked: skill.isPassive, onChange: (v) => handleSkillChange(skill.id, { isPassive: v }) })] }), _jsxs("div", { children: [_jsx(Text, { style: { marginRight: 8 }, children: "\u51B7\u5374" }), _jsx(InputNumber, { min: 0, max: 99, value: skill.cooldown, onChange: (v) => handleSkillChange(skill.id, { cooldown: v ?? 0 }) })] }), _jsxs("div", { children: [_jsx(Text, { style: { marginRight: 8 }, children: "\u4F7F\u7528\u6B21\u6570" }), _jsx(InputNumber, { min: 0, max: 99, value: skill.useLimit, onChange: (v) => handleSkillChange(skill.id, { useLimit: v ?? 0 }) })] })] }) }), _jsx(Collapse, { activeKey: collapseActiveKeys, onChange: (keys) => setCollapseActiveKeys(keys), items: [
                        {
                            key: "conditions",
                            label: `条件（${skill.conditions.length}）`,
                            children: (_jsxs("div", { children: [_jsx(Button, { type: "dashed", icon: _jsx(PlusOutlined, {}), onClick: () => {
                                            const firstId = Object.keys(conditionTemplates)[0] || "";
                                            handleAddInstance(skill.id, "conditions", {
                                                conditionId: firstId,
                                                params: {},
                                                logic: LogicOperator.AND,
                                            });
                                        }, style: { marginBottom: 12 }, children: "\u6DFB\u52A0\u6761\u4EF6" }), skill.conditions.map((cond, cIdx) => (_jsx(Card, { id: `skill-${skill.id}-conditions-${cIdx}`, size: "small", style: {
                                            marginBottom: 8,
                                            ...(flashItem === `conditions_${cIdx}`
                                                ? {
                                                    boxShadow: "0 0 12px rgba(24,144,255,0.6)",
                                                    borderColor: "#1890ff",
                                                    transition: "box-shadow 0.5s, border-color 0.5s",
                                                }
                                                : {
                                                    transition: "box-shadow 0.8s, border-color 0.8s",
                                                }),
                                        }, extra: _jsx(DeleteOutlined, { style: { color: "#ff4d4f", cursor: "pointer" }, onClick: () => handleRemoveInstance(skill.id, "conditions", cIdx) }), children: _jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [_jsxs(Space, { wrap: true, children: [_jsxs("div", { children: [_jsx(Text, { style: { marginRight: 8 }, children: "\u6761\u4EF6\u7C7B\u578B" }), _jsx(Select, { style: { width: 200 }, value: cond.conditionId, options: Object.entries(conditionTemplates).map(([id, tpl]) => ({
                                                                        value: id,
                                                                        label: tpl.name,
                                                                    })), onChange: (v) => handleInstanceParamChange(skill.id, "conditions", cIdx, "conditionId", v) })] }), _jsxs("div", { children: [_jsx(Text, { style: { marginRight: 8 }, children: "\u903B\u8F91" }), _jsx(Select, { style: { width: 100 }, value: cond.logic || LogicOperator.AND, options: LOGIC_OPTIONS, onChange: (v) => handleInstanceParamChange(skill.id, "conditions", cIdx, "logic", v) })] })] }), _jsxs("div", { children: [_jsx(Text, { style: { marginRight: 8, fontSize: 12 }, children: "\u68C0\u5B9A\u76EE\u6807" }), _jsx(Select, { style: { width: 200 }, placeholder: "\u9009\u62E9\u68C0\u5B9A\u76EE\u6807\uFF08\u9ED8\u8BA4\u81EA\u8EAB\uFF09", allowClear: true, value: cond.target || undefined, options: TARGET_OPTIONS, onChange: (v) => handleInstanceParamChange(skill.id, "conditions", cIdx, "target", v) })] }), cond.conditionId &&
                                                    conditionTemplates[cond.conditionId]?.params.map((param) => (_jsxs("div", { children: [_jsx(Text, { style: { marginRight: 8, fontSize: 12 }, children: param.label }), renderParamInput(param, cond.params[param.key], (key, val) => handleInstanceParamChange(skill.id, "conditions", cIdx, key, val))] }, param.key)))] }) }, cIdx)))] })),
                        },
                        {
                            key: "costs",
                            label: `消耗（${skill.costs.length}）`,
                            children: (_jsxs("div", { children: [_jsx(Button, { type: "dashed", icon: _jsx(PlusOutlined, {}), onClick: () => {
                                            const firstId = Object.keys(costTemplates)[0] || "";
                                            handleAddInstance(skill.id, "costs", {
                                                costId: firstId,
                                                params: {},
                                            });
                                        }, style: { marginBottom: 12 }, children: "\u6DFB\u52A0\u6D88\u8017" }), skill.costs.map((cost, cIdx) => (_jsx(Card, { id: `skill-${skill.id}-costs-${cIdx}`, size: "small", style: {
                                            marginBottom: 8,
                                            ...(flashItem === `costs_${cIdx}`
                                                ? {
                                                    boxShadow: "0 0 12px rgba(24,144,255,0.6)",
                                                    borderColor: "#1890ff",
                                                    transition: "box-shadow 0.5s, border-color 0.5s",
                                                }
                                                : {
                                                    transition: "box-shadow 0.8s, border-color 0.8s",
                                                }),
                                        }, extra: _jsx(DeleteOutlined, { style: { color: "#ff4d4f", cursor: "pointer" }, onClick: () => handleRemoveInstance(skill.id, "costs", cIdx) }), children: _jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [_jsxs("div", { children: [_jsx(Text, { style: { marginRight: 8 }, children: "\u6D88\u8017\u7C7B\u578B" }), _jsx(Select, { style: { width: 200 }, value: cost.costId, options: Object.entries(costTemplates).map(([id, tpl]) => ({
                                                                value: id,
                                                                label: tpl.name,
                                                            })), onChange: (v) => handleInstanceParamChange(skill.id, "costs", cIdx, "costId", v) })] }), cost.costId &&
                                                    costTemplates[cost.costId]?.params.map((param) => (_jsxs("div", { children: [_jsx(Text, { style: { marginRight: 8, fontSize: 12 }, children: param.label }), renderParamInput(param, cost.params[param.key], (key, val) => handleInstanceParamChange(skill.id, "costs", cIdx, key, val))] }, param.key)))] }) }, cIdx)))] })),
                        },
                        {
                            key: "effects",
                            label: `效果（${skill.effects.length}）`,
                            children: (_jsxs("div", { children: [_jsx(Button, { type: "dashed", icon: _jsx(PlusOutlined, {}), onClick: () => {
                                            const firstId = Object.keys(effectTemplates)[0] || "";
                                            handleAddInstance(skill.id, "effects", {
                                                effectId: firstId,
                                                params: {},
                                                timing: Timing.IMMEDIATE,
                                                stacking: StackingType.REPLACE,
                                                target: TargetType.SELF,
                                            });
                                        }, style: { marginBottom: 12 }, children: "\u6DFB\u52A0\u6548\u679C" }), skill.effects.map((eff, eIdx) => (_jsx(Card, { id: `skill-${skill.id}-effects-${eIdx}`, size: "small", style: {
                                            marginBottom: 8,
                                            ...(flashItem === `effects_${eIdx}`
                                                ? {
                                                    boxShadow: "0 0 12px rgba(24,144,255,0.6)",
                                                    borderColor: "#1890ff",
                                                    transition: "box-shadow 0.5s, border-color 0.5s",
                                                }
                                                : {
                                                    transition: "box-shadow 0.8s, border-color 0.8s",
                                                }),
                                        }, extra: _jsx(DeleteOutlined, { style: { color: "#ff4d4f", cursor: "pointer" }, onClick: () => handleRemoveInstance(skill.id, "effects", eIdx) }), children: _jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [_jsxs(Space, { wrap: true, children: [_jsxs("div", { children: [_jsx(Text, { style: { marginRight: 8 }, children: "\u6548\u679C\u7C7B\u578B" }), _jsx(Select, { style: { width: 200 }, value: eff.effectId, options: Object.entries(effectTemplates).map(([id, tpl]) => ({
                                                                        value: id,
                                                                        label: tpl.name,
                                                                    })), onChange: (v) => handleInstanceParamChange(skill.id, "effects", eIdx, "effectId", v) })] }), _jsxs("div", { children: [_jsx(Text, { style: { marginRight: 8 }, children: "\u65F6\u673A" }), _jsx(Select, { style: { width: 160 }, value: eff.timing, options: TIMING_OPTIONS, onChange: (v) => handleInstanceParamChange(skill.id, "effects", eIdx, "timing", v) })] }), _jsxs("div", { children: [_jsx(Text, { style: { marginRight: 8 }, children: "\u53E0\u52A0" }), _jsx(Select, { style: { width: 120 }, value: eff.stacking, options: STACKING_OPTIONS, onChange: (v) => handleInstanceParamChange(skill.id, "effects", eIdx, "stacking", v) })] })] }), _jsxs(Space, { wrap: true, children: [_jsxs("div", { children: [_jsx(Text, { style: { marginRight: 8 }, children: "\u76EE\u6807" }), _jsx(Select, { style: { width: 200 }, value: eff.target, options: TARGET_OPTIONS, onChange: (v) => handleInstanceParamChange(skill.id, "effects", eIdx, "target", v) })] }), _jsxs("div", { children: [_jsx(Text, { style: { marginRight: 8 }, children: "\u627F\u63A5\u4E3B\u4F53" }), _jsx(Input, { style: { width: 150 }, placeholder: "\u627F\u63A5\u4E3B\u4F53 key", value: eff.inheritTarget || "", onChange: (e) => handleInstanceParamChange(skill.id, "effects", eIdx, "inheritTarget", e.target.value || undefined) })] }), _jsxs("div", { children: [_jsx(Text, { style: { marginRight: 8 }, children: "\u4FDD\u5B58\u4E3A\u627F\u63A5" }), _jsx(Input, { style: { width: 150 }, placeholder: "\u4FDD\u5B58\u4E3A\u627F\u63A5\u4E3B\u4F53 key", value: eff.saveAsInherit || "", onChange: (e) => handleInstanceParamChange(skill.id, "effects", eIdx, "saveAsInherit", e.target.value || undefined) })] })] }), eff.effectId &&
                                                    effectTemplates[eff.effectId]?.params.map((param) => (_jsxs("div", { children: [_jsx(Text, { style: { marginRight: 8, fontSize: 12 }, children: param.label }), renderParamInput(param, eff.params[param.key], (key, val) => handleInstanceParamChange(skill.id, "effects", eIdx, key, val))] }, param.key)))] }) }, eIdx)))] })),
                        },
                    ] })] })),
    }));
    // Add tab for adding new skill
    if (pendingSkills.length < maxSkills) {
        tabItems.push({
            key: "__add__",
            label: _jsx(PlusOutlined, { style: { cursor: "pointer" } }),
            children: _jsx(_Fragment, {}),
        });
    }
    return (_jsxs("div", { children: [_jsx(Title, { level: 3, style: { textAlign: "center", marginBottom: 24 }, children: "\u914D\u7F6E\u6280\u80FD\u6548\u679C" }), _jsx(Tabs, { activeKey: activeSkillIdx, onChange: (key) => {
                    if (key === "__add__") {
                        handleAddSkill();
                    }
                    else {
                        setActiveSkillIdx(key);
                    }
                }, items: tabItems, tabBarExtraContent: _jsx(Button, { type: "primary", onClick: handleApply, children: "\u5E94\u7528" }) }), description && (_jsx(Card, { size: "small", title: "\u6548\u679C\u63CF\u8FF0\u9884\u89C8", style: { marginTop: 16, background: "#f6ffed" }, children: _jsx(Paragraph, { style: { whiteSpace: "pre-line", margin: 0, fontSize: 13 }, children: description }) })), _jsx("div", { style: { textAlign: "center", marginTop: 32 }, children: _jsxs(Space, { children: [_jsx(Button, { size: "large", onClick: onPrev, children: "\u4E0A\u4E00\u6B65" }), _jsx(Button, { type: "primary", size: "large", onClick: onNext, children: "\u4E0B\u4E00\u6B65" })] }) })] }));
}
export default Step3_EffectEdit;
