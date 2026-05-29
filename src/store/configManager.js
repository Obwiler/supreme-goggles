import { DEFAULT_CONFIG } from "@/atomic";
class ConfigManager {
    configs;
    constructor() {
        this.configs = { ...DEFAULT_CONFIG };
    }
    get(key) {
        return this.configs[key];
    }
    getAttributeMax(attribute) {
        const maxValues = this.configs["maxAttributeValues"];
        if (!maxValues)
            return 999;
        return maxValues[attribute] ?? 999;
    }
    getMaxDeckSize() {
        return this.configs["max_deck_size"] ?? 30;
    }
    getCooldownRange() {
        return {
            min: this.configs["min_cooldown"] ?? 0,
            max: this.configs["max_cooldown"] ?? 99
        };
    }
    set(key, value) {
        this.configs[key] = value;
    }
    getAll() {
        return { ...this.configs };
    }
    reset() {
        this.configs = { ...DEFAULT_CONFIG };
    }
    exportConfigs() {
        return JSON.stringify(this.configs, null, 2);
    }
    importConfigs(json) {
        try {
            const parsed = JSON.parse(json);
            if (typeof parsed !== "object" || parsed === null) {
                throw new Error("配置数据格式无效");
            }
            this.configs = { ...parsed };
        }
        catch (e) {
            throw new Error(`导入配置失败：${e instanceof Error ? e.message : "JSON 格式无效"}`);
        }
    }
}
const configManager = new ConfigManager();
export { ConfigManager, configManager };
