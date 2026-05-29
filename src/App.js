import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ConfigProvider, Steps } from "antd";
import zhCN from "antd/locale/zh_CN";
import { useCardStore } from "@/store";
import Step1_CardType from "@/pages/Step1_CardType";
import Step2_BasicInfo from "@/pages/Step2_BasicInfo";
import Step3_EffectEdit from "@/pages/Step3_EffectEdit";
import Step4_Export from "@/pages/Step4_Export";
import { ErrorBoundary } from "@/components";
function App() {
    const currentStep = useCardStore((s) => s.currentStep);
    const nextStep = useCardStore((s) => s.nextStep);
    const prevStep = useCardStore((s) => s.prevStep);
    const steps = [
        { title: "选择类型" },
        { title: "基本信息" },
        { title: "配置技能" },
        { title: "预览导出" },
    ];
    return (_jsx(ConfigProvider, { locale: zhCN, theme: { token: { colorPrimary: "#1677ff" } }, children: _jsx(ErrorBoundary, { children: _jsxs("div", { style: { maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }, children: [_jsx("h1", { style: { textAlign: "center", marginBottom: 32 }, children: "CardMaker - \u300A\u5BF9\u5CD9\u300B\u5361\u724C\u7F16\u8F91\u5668 v0.6.3" }), _jsx(Steps, { current: currentStep, items: steps, style: { marginBottom: 32 } }), _jsxs("div", { style: { minHeight: 500 }, children: [currentStep === 0 && _jsx(Step1_CardType, { onNext: nextStep }), currentStep === 1 && _jsx(Step2_BasicInfo, { onNext: nextStep, onPrev: prevStep }), currentStep === 2 && _jsx(Step3_EffectEdit, { onNext: nextStep, onPrev: prevStep }), currentStep === 3 && _jsx(Step4_Export, { onPrev: prevStep })] })] }) }) }));
}
export default App;
