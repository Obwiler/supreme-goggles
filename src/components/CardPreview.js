import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Tag, Empty, Space, Typography, Descriptions } from "antd";
import { RARITY_COLORS, RARITY_LABELS, CARD_TYPE_LABELS, ATTRIBUTE_LABELS, } from "@/atomic";
import { getEffectTemplate } from "@/templates";
const { Text, Title } = Typography;
function renderEffectDescription(effect) {
    const template = getEffectTemplate(effect.effectId);
    if (!template)
        return effect.effectId;
    const parts = [template.name];
    for (const param of template.params) {
        const val = effect.params[param.key];
        if (val !== undefined && val !== null) {
            parts.push(`${param.label}:${val}`);
        }
    }
    return parts.join(" ");
}
function CardPreview({ card }) {
    if (!card) {
        return (_jsx(Card, { style: { width: 360, height: 500, display: "flex", alignItems: "center", justifyContent: "center" }, styles: { body: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" } }, children: _jsx(Empty, { description: "\u6682\u65E0\u5361\u724C\u6570\u636E" }) }));
    }
    const rarityColor = card.rarity
        ? RARITY_COLORS[card.rarity]
        : RARITY_COLORS.white;
    const nonZeroStats = Object.entries(card.baseStats || {}).filter(([, v]) => v !== 0 && v !== undefined);
    return (_jsxs(Card, { style: {
            width: 360,
            height: 500,
            background: rarityColor.background,
            borderColor: rarityColor.border,
            borderWidth: 2,
            borderRadius: 16,
            overflow: "hidden",
        }, styles: {
            body: {
                height: "100%",
                display: "flex",
                flexDirection: "column",
                padding: 16,
                color: rarityColor.text,
            },
        }, children: [_jsx("div", { style: { marginBottom: 8 }, children: _jsx(Tag, { color: "blue", children: CARD_TYPE_LABELS[card.type] }) }), _jsx(Title, { level: 4, style: { margin: 0, color: rarityColor.text }, children: card.displayName || card.name || "未命名" }), _jsx("div", { style: { marginBottom: 8 }, children: _jsx(Tag, { color: card.rarity, style: { color: rarityColor.text, borderColor: rarityColor.border }, children: RARITY_LABELS[card.rarity] }) }), _jsx("div", { style: { flex: 1, overflow: "auto", marginBottom: 8 }, children: card.skills.length > 0 ? (_jsx(Space, { direction: "vertical", size: 4, style: { width: "100%" }, children: card.skills.map((skill, idx) => (_jsxs("div", { children: [_jsxs(Text, { strong: true, style: { color: rarityColor.text, fontSize: 13 }, children: [skill.name || `技能 ${idx + 1}`, skill.cooldown > 0 && (_jsxs(Text, { type: "secondary", style: { fontSize: 11 }, children: [" ", "\u51B7\u5374", skill.cooldown] })), skill.useLimit > 0 && (_jsxs(Text, { type: "secondary", style: { fontSize: 11 }, children: [" ", skill.useLimit, "\u6B21"] }))] }), skill.effects.map((eff, eIdx) => (_jsx("div", { style: { fontSize: 11, paddingLeft: 8, color: rarityColor.text, opacity: 0.85 }, children: renderEffectDescription(eff) }, eIdx)))] }, skill.id || idx))) })) : (_jsx(Text, { type: "secondary", style: { fontSize: 12 }, children: "\u6682\u65E0\u6280\u80FD" })) }), nonZeroStats.length > 0 && (_jsx(Descriptions, { size: "small", column: 2, colon: false, children: nonZeroStats.map(([key, val]) => (_jsx(Descriptions.Item, { label: ATTRIBUTE_LABELS[key] ?? key, labelStyle: { color: rarityColor.text, fontSize: 11 }, children: _jsx(Text, { style: { color: rarityColor.text, fontSize: 11 }, children: val }) }, key))) })), card.tags.length > 0 && (_jsx("div", { style: { marginTop: 4 }, children: card.tags.map((t) => (_jsx(Tag, { style: { fontSize: 10, marginBottom: 2 }, children: t }, t))) }))] }));
}
export default CardPreview;
