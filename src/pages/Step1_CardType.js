import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Row, Col, Button, Typography } from "antd";
import { CARD_TYPE_LABELS, CardType } from "@/atomic";
import { useCardStore } from "@/store";
const { Title, Text } = Typography;
const TYPE_DESCRIPTIONS = {
    [CardType.BASIC]: "有品质系统，固定 1 个技能",
    [CardType.CAMP]: "无品质，支持冷却和次数",
    [CardType.CAREER]: "无品质，支持冷却和次数",
    [CardType.BUILD_WEAPON]: "无品质，支持冷却和次数",
    [CardType.BUILD_TREASURE]: "无品质，支持冷却和次数",
    [CardType.BUILD_ARMOR]: "无品质，支持冷却和次数",
    [CardType.BUILD_MARTIAL]: "无品质，支持冷却和次数",
    [CardType.BUILD_SPELL]: "无品质，支持冷却和次数",
};
function Step1_CardType({ onNext }) {
    const currentCard = useCardStore((s) => s.currentCard);
    const setCardType = useCardStore((s) => s.setCardType);
    const selectedType = currentCard?.type ?? null;
    const handleSelect = (type) => {
        setCardType(type);
    };
    const cardTypes = Object.values(CardType);
    return (_jsxs("div", { children: [_jsx(Title, { level: 3, style: { textAlign: "center", marginBottom: 24 }, children: "\u9009\u62E9\u5361\u724C\u7C7B\u578B" }), _jsx(Row, { gutter: [16, 16], children: cardTypes.map((type) => {
                    const isSelected = selectedType === type;
                    return (_jsx(Col, { xs: 24, sm: 12, md: 8, lg: 6, children: _jsxs(Card, { hoverable: true, onClick: () => handleSelect(type), style: {
                                border: isSelected ? "2px solid #1677ff" : undefined,
                                cursor: "pointer",
                                textAlign: "center",
                                height: 120,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }, styles: {
                                body: {
                                    padding: 16,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    width: "100%",
                                },
                            }, children: [_jsx(Title, { level: 5, style: { margin: 0 }, children: CARD_TYPE_LABELS[type] }), _jsx(Text, { type: "secondary", style: { fontSize: 12, marginTop: 4 }, children: TYPE_DESCRIPTIONS[type] })] }) }, type));
                }) }), _jsx("div", { style: { textAlign: "center", marginTop: 32 }, children: _jsx(Button, { type: "primary", size: "large", disabled: !selectedType, onClick: onNext, children: "\u4E0B\u4E00\u6B65" }) })] }));
}
export default Step1_CardType;
