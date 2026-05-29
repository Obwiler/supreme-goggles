export const buildDesc = (template, params, inherited) => {
    let desc = template.desc;
    Object.keys(params).forEach(key => {
        if (!desc.includes(`{${key}}`))
            return;
        let val = params[key];
        if (key === "target" && val === "承接" && inherited) {
            val = inherited;
        }
        desc = desc.replace(new RegExp(`\\{${key}\\}`, "g"), String(val));
    });
    if (params.timing && params.timing !== "立即") {
        desc += ` (${params.timing})`;
    }
    if (params.stacking && params.stacking !== "替换") {
        desc += ` [${params.stacking}]`;
    }
    return desc;
};
