import { RARITY_LABELS, ATTRIBUTE_LABELS, TARGET_TYPE_LABELS, TIMING_LABELS, STACKING_LABELS, LOGIC_LABELS } from "@/atomic";
import { conditionTemplates, costTemplates, effectTemplates } from "@/templates";
/**
 * 将卡牌序列化为 JSON 字符串
 */
function exportToJSON(card) {
    return JSON.stringify(card, null, 2);
}
/**
 * 导出一个实例的 params 为可读字符串
 */
function formatParams(params, templateParams) {
    return templateParams
        .map((p) => {
        const val = params[p.key];
        if (val === undefined || val === null || val === "")
            return "";
        if (p.type === "attribute")
            return ATTRIBUTE_LABELS[val] ?? String(val);
        if (p.type === "select") {
            const opt = p.options?.find((o) => String(o.value) === String(val));
            return opt?.label ?? String(val);
        }
        return String(val);
    })
        .filter(Boolean)
        .join(" ");
}
/**
 * 格式化单个条件实例
 */
function formatCondition(cond) {
    const tpl = conditionTemplates[cond.conditionId];
    if (!tpl)
        return "未知条件";
    const params = formatParams(cond.params, tpl.params);
    const target = cond.target ? `对${TARGET_TYPE_LABELS[cond.target] ?? cond.target}` : "";
    return `${target}${tpl.name}${params ? "：" + params : ""}`;
}
/**
 * 格式化单个消耗实例
 */
function formatCost(cost) {
    const tpl = costTemplates[cost.costId];
    if (!tpl)
        return "未知消耗";
    const params = formatParams(cost.params, tpl.params);
    return `${tpl.name}${params ? "：" + params : ""}`;
}
/**
 * 格式化单个效果实例
 */
function formatEffect(eff) {
    const tpl = effectTemplates[eff.effectId];
    if (!tpl)
        return "未知效果";
    const params = formatParams(eff.params, tpl.params);
    const target = eff.target ? `对${TARGET_TYPE_LABELS[eff.target] ?? eff.target}` : "";
    const timing = eff.timing ? `（${TIMING_LABELS[eff.timing] ?? eff.timing}）` : "";
    const stacking = eff.stacking ? `${STACKING_LABELS[eff.stacking] ?? eff.stacking}` : "";
    return `${target}${tpl.name}${params ? "：" + params : ""}${timing}${stacking ? " " + stacking : ""}`;
}
/**
 * 生成卡牌文字描述
 * @param card 卡牌数据
 * @returns 多行文字描述
 */
function generateCardDescription(card) {
    const lines = [];
    lines.push(`【${card.displayName || card.name || "未命名卡牌"}】`);
    if (card.rarity) {
        lines.push(`品质: ${RARITY_LABELS[card.rarity] ?? card.rarity}`);
    }
    if (card.description) {
        lines.push("");
        lines.push(card.description);
    }
    if (card.skills.length > 0) {
        lines.push("");
        lines.push("技能：");
        for (const skill of card.skills) {
            const cd = skill.cooldown > 0 ? `冷却 ${skill.cooldown}` : "";
            const limit = skill.useLimit > 0 ? `可用 ${skill.useLimit} 次` : "";
            const passive = skill.isPassive ? "[被动]" : "[主动]";
            lines.push(`  ${passive} ${skill.name} ${cd}${limit ? "，" + limit : ""}`);
            if (skill.description) {
                lines.push(`    ${skill.description}`);
            }
            if (skill.conditions.length > 0) {
                const condTexts = skill.conditions.map(formatCondition);
                const logic = skill.conditions.length > 1
                    ? `（${skill.conditions.map((c) => LOGIC_LABELS[c.logic ?? "AND"] ?? "且").join(" ")}）`
                    : "";
                lines.push(`    条件${logic}：`);
                condTexts.forEach((t) => lines.push(`      - ${t}`));
            }
            if (skill.costs.length > 0) {
                lines.push(`    消耗：`);
                skill.costs.forEach((c) => lines.push(`      - ${formatCost(c)}`));
            }
            if (skill.effects.length > 0) {
                lines.push(`    效果：`);
                skill.effects.forEach((e) => lines.push(`      - ${formatEffect(e)}`));
            }
        }
    }
    if (card.flavorText) {
        lines.push("");
        lines.push(`"${card.flavorText}"`);
    }
    return lines.join("\n");
}
export { exportToJSON, generateCardDescription };
