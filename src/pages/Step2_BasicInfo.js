import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { Form, Input, Select, InputNumber, Button, Space, Typography, } from "antd";
import { CardType, Rarity, RARITY_LABELS, MAX_TAGS_PER_CARD, MAX_NAME_LENGTH } from "@/atomic";
import { useCardStore } from "@/store";
const { Title } = Typography;
const RARITY_OPTIONS = Object.values(Rarity).map((r) => ({
    value: r,
    label: RARITY_LABELS[r],
}));
function Step2_BasicInfo({ onNext, onPrev }) {
    const currentCard = useCardStore((s) => s.currentCard);
    const updateBasicInfo = useCardStore((s) => s.updateBasicInfo);
    const [form] = Form.useForm();
    const isBasic = currentCard?.type === CardType.BASIC;
    useEffect(() => {
        if (currentCard) {
            form.setFieldsValue({
                name: currentCard.name || "",
                displayName: currentCard.displayName || "",
                rarity: currentCard.rarity || Rarity.WHITE,
                tags: currentCard.tags || [],
                flavorText: currentCard.flavorText || "",
                description: currentCard.description || "",
                coolDown: currentCard.coolDown ?? 0,
                useLimit: currentCard.useLimit ?? 0,
            });
        }
    }, [currentCard, form]);
    const handleValuesChange = (_changedValues, allValues) => {
        updateBasicInfo(allValues);
    };
    const handleNext = () => {
        form.validateFields().then(() => {
            onNext();
        });
    };
    return (_jsxs("div", { children: [_jsx(Title, { level: 3, style: { textAlign: "center", marginBottom: 24 }, children: "\u57FA\u672C\u4FE1\u606F" }), _jsxs(Form, { form: form, layout: "vertical", style: { maxWidth: 500, margin: "0 auto" }, onValuesChange: handleValuesChange, children: [_jsx(Form.Item, { name: "name", label: "\u5361\u724C\u5185\u90E8\u540D\u79F0", rules: [
                            { required: true, message: "请输入卡牌内部名称" },
                            { max: MAX_NAME_LENGTH, message: `最多 ${MAX_NAME_LENGTH} 个字符` },
                        ], children: _jsx(Input, { placeholder: "\u5361\u724C\u5185\u90E8\u540D\u79F0", maxLength: MAX_NAME_LENGTH }) }), _jsx(Form.Item, { name: "displayName", label: "\u5361\u724C\u663E\u793A\u540D\u79F0", rules: [
                            { required: true, message: "请输入卡牌显示名称" },
                            { max: MAX_NAME_LENGTH, message: `最多 ${MAX_NAME_LENGTH} 个字符` },
                        ], children: _jsx(Input, { placeholder: "\u5361\u724C\u663E\u793A\u540D\u79F0", maxLength: MAX_NAME_LENGTH }) }), isBasic && (_jsx(Form.Item, { name: "rarity", label: "\u54C1\u8D28", rules: [{ required: true, message: "请选择品质" }], children: _jsx(Select, { options: RARITY_OPTIONS }) })), _jsx(Form.Item, { name: "tags", label: "\u6807\u7B7E", rules: [
                            {
                                validator: (_, value) => {
                                    if (value && value.length > MAX_TAGS_PER_CARD) {
                                        return Promise.reject(`最多 ${MAX_TAGS_PER_CARD} 个标签`);
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ], children: _jsx(Select, { mode: "tags", placeholder: "\u8F93\u5165\u6807\u7B7E\u540E\u56DE\u8F66", maxCount: MAX_TAGS_PER_CARD }) }), isBasic && (_jsxs(_Fragment, { children: [_jsx(Form.Item, { name: "flavorText", label: "\u98CE\u5473\u6587\u672C", children: _jsx(Input, { placeholder: "\u98CE\u5473\u6587\u672C" }) }), _jsx(Form.Item, { name: "description", label: "\u63CF\u8FF0\u6587\u672C", children: _jsx(Input, { placeholder: "\u63CF\u8FF0\u6587\u672C" }) })] })), !isBasic && (_jsxs(_Fragment, { children: [_jsx(Form.Item, { name: "coolDown", label: "\u51B7\u5374\u56DE\u5408", children: _jsx(InputNumber, { min: 0, max: 99, placeholder: "\u51B7\u5374\u56DE\u5408", style: { width: "100%" } }) }), _jsx(Form.Item, { name: "useLimit", label: "\u4F7F\u7528\u6B21\u6570", extra: "0 \u8868\u793A\u65E0\u9650", children: _jsx(InputNumber, { min: 0, max: 99, placeholder: "\u4F7F\u7528\u6B21\u6570", style: { width: "100%" } }) })] }))] }), _jsx("div", { style: { textAlign: "center", marginTop: 32 }, children: _jsxs(Space, { children: [_jsx(Button, { size: "large", onClick: onPrev, children: "\u4E0A\u4E00\u6B65" }), _jsx(Button, { type: "primary", size: "large", onClick: handleNext, children: "\u4E0B\u4E00\u6B65" })] }) })] }));
}
export default Step2_BasicInfo;
