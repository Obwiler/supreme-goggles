import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { Result, Button } from "antd";
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary 捕获到错误：", error, errorInfo);
    }
    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };
    render() {
        if (this.state.hasError) {
            return (_jsx(Result, { status: "error", title: "\u7EC4\u4EF6\u52A0\u8F7D\u5931\u8D25", subTitle: this.state.error?.message || "未知错误", extra: _jsx(Button, { type: "primary", onClick: this.handleRetry, children: "\u91CD\u8BD5" }) }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
