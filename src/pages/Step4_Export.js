import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { Button, Space, Typography, message, Input, Row, Col, } from "antd";
import { CopyOutlined, ExportOutlined, FileImageOutlined, FileAddOutlined } from "@ant-design/icons";
import { toPng } from "html-to-image";
import { CardPreview } from "@/components";
import { useCardStore } from "@/store";
import { exportToJSON } from "@/utils/exporters";
import { invoke } from "@tauri-apps/api/core";
import { save } from "@tauri-apps/plugin-dialog";
const { Text, Title } = Typography;
function Step4_Export({ onPrev }) {
    const currentCard = useCardStore((s) => s.currentCard);
    const resetCard = useCardStore((s) => s.resetCard);
    const previewRef = useRef(null);
    const [exporting, setExporting] = useState(false);
    const jsonStr = currentCard ? exportToJSON(currentCard) : "{}";
    const jsonLines = jsonStr.split("\n");
    const jsonPreview = jsonLines.slice(0, 20).join("\n");
    /** 使用 Tauri 原生保存对话框写入 JSON 文件 */
    const handleExportJSON = async () => {
        if (!currentCard)
            return;
        try {
            const filePath = await save({
                defaultPath: `${currentCard.name || "card"}.json`,
                filters: [{ name: "JSON 文件", extensions: ["json"] }],
                title: "保存卡牌 JSON",
            });
            if (!filePath)
                return; // 用户取消
            await invoke("save_card_data", { path: filePath, content: jsonStr });
            message.success("JSON 已保存");
        }
        catch (e) {
            message.error(`保存失败：${e?.message || e}`);
        }
    };
    const handleCopyJSON = async () => {
        try {
            await navigator.clipboard.writeText(jsonStr);
            message.success("JSON 已复制到剪贴板");
        }
        catch {
            message.error("复制失败");
        }
    };
    const handleExportPNG = async () => {
        if (!previewRef.current)
            return;
        setExporting(true);
        try {
            const dataUrl = await toPng(previewRef.current, {
                quality: 1,
                pixelRatio: 3,
            });
            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = `${currentCard?.name || "card"}.png`;
            a.click();
            message.success("PNG 已导出");
        }
        catch {
            message.error("PNG 导出失败");
        }
        finally {
            setExporting(false);
        }
    };
    const handleNewCard = () => {
        resetCard();
        message.success("已重置，可以创建新卡牌");
    };
    return (_jsxs("div", { children: [_jsx(Title, { level: 3, style: { textAlign: "center", marginBottom: 24 }, children: "\u9884\u89C8\u4E0E\u5BFC\u51FA" }), _jsxs(Row, { gutter: 24, children: [_jsx(Col, { xs: 24, md: 14, children: _jsx("div", { ref: previewRef, children: _jsx(CardPreview, { card: currentCard }) }) }), _jsx(Col, { xs: 24, md: 10, children: _jsxs(Space, { direction: "vertical", size: "middle", style: { width: "100%" }, children: [_jsx(Button, { type: "primary", icon: _jsx(ExportOutlined, {}), block: true, size: "large", onClick: handleExportJSON, disabled: !currentCard, children: "\u4FDD\u5B58 JSON \u5230\u6587\u4EF6" }), _jsx(Button, { icon: _jsx(CopyOutlined, {}), block: true, onClick: handleCopyJSON, disabled: !currentCard, children: "\u590D\u5236 JSON" }), _jsxs("div", { children: [_jsx(Text, { strong: true, children: "JSON \u9884\u89C8\uFF08\u524D 20 \u884C\uFF09" }), _jsx(Input.TextArea, { value: jsonPreview, readOnly: true, rows: 12, style: { fontFamily: "monospace", fontSize: 11, marginTop: 8 } })] }), _jsx(Button, { icon: _jsx(FileImageOutlined, {}), block: true, loading: exporting, onClick: handleExportPNG, disabled: !currentCard, children: "\u5BFC\u51FA PNG \u56FE\u7247" }), _jsx(Button, { icon: _jsx(FileAddOutlined, {}), block: true, type: "dashed", onClick: handleNewCard, children: "\u65B0\u5EFA\u5361\u724C" })] }) })] }), _jsx("div", { style: { textAlign: "center", marginTop: 32 }, children: _jsx(Button, { size: "large", onClick: onPrev, children: "\u4E0A\u4E00\u6B65" }) })] }));
}
export default Step4_Export;
