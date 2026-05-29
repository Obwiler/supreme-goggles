// ─── 属性类型 ───────────────────────────────────────────
var AttributeType;
(function (AttributeType) {
    AttributeType["LIFE"] = "life";
    AttributeType["ARMOR"] = "armor";
    AttributeType["ENERGY"] = "energy";
    AttributeType["ATTACK"] = "attack";
    AttributeType["DEFENSE"] = "defense";
    AttributeType["SPEED"] = "speed";
    AttributeType["CRIT_RATE"] = "crit_rate";
    AttributeType["UNKNOWN"] = "unknown";
})(AttributeType || (AttributeType = {}));
// ─── 卡牌类型 ───────────────────────────────────────────
var CardType;
(function (CardType) {
    CardType["BASIC"] = "basic";
    CardType["CAMP"] = "camp";
    CardType["CAREER"] = "career";
    CardType["BUILD_WEAPON"] = "build_weapon";
    CardType["BUILD_TREASURE"] = "build_treasure";
    CardType["BUILD_ARMOR"] = "build_armor";
    CardType["BUILD_MARTIAL"] = "build_martial";
    CardType["BUILD_SPELL"] = "build_spell";
})(CardType || (CardType = {}));
// ─── 品质 ───────────────────────────────────────────────
var Rarity;
(function (Rarity) {
    Rarity["WHITE"] = "white";
    Rarity["BLUE"] = "blue";
    Rarity["PURPLE"] = "purple";
    Rarity["ORANGE"] = "orange";
})(Rarity || (Rarity = {}));
// ─── 时机 ───────────────────────────────────────────────
var Timing;
(function (Timing) {
    Timing["IMMEDIATE"] = "immediate";
    Timing["TURN_START"] = "turn_start";
    Timing["TURN_END"] = "turn_end";
    Timing["BIG_TURN_START"] = "big_turn_start";
    Timing["BIG_TURN_END"] = "big_turn_end";
    Timing["ON_DAMAGE_TAKEN"] = "on_damage_taken";
    Timing["ON_DAMAGE_DEALT"] = "on_damage_dealt";
    Timing["ON_CARD_DRAWN"] = "on_card_drawn";
    Timing["ON_CARD_PLAYED"] = "on_card_played";
    Timing["ON_CARD_DISCARDED"] = "on_card_discarded";
    Timing["ON_MARK_ADDED"] = "on_mark_added";
    Timing["ON_MARK_REMOVED"] = "on_mark_removed";
    Timing["PERMANENT"] = "permanent";
    Timing["UNKNOWN"] = "unknown";
})(Timing || (Timing = {}));
// ─── 目标类型 ───────────────────────────────────────────
var TargetType;
(function (TargetType) {
    TargetType["SELF"] = "self";
    TargetType["ONE_ENEMY"] = "one_enemy";
    TargetType["ONE_ALLY"] = "one_ally";
    TargetType["ONE_UNIT"] = "one_unit";
    TargetType["DAMAGE_SOURCE"] = "damage_source";
    TargetType["TRIGGER_UNIT"] = "trigger_unit";
    TargetType["INHERIT"] = "inherit";
    TargetType["ALL_ENEMIES"] = "all_enemies";
    TargetType["ALL_ALLIES"] = "all_allies";
    TargetType["ALL_UNITS"] = "all_units";
    TargetType["ALL_ALIVE"] = "all_alive";
    TargetType["ALL_DEAD"] = "all_dead";
    TargetType["ADJACENT"] = "adjacent";
    TargetType["ADJACENT_ENEMY"] = "adjacent_enemy";
    TargetType["ADJACENT_ALLY"] = "adjacent_ally";
    TargetType["LEFT_ADJACENT"] = "left_adjacent";
    TargetType["RIGHT_ADJACENT"] = "right_adjacent";
    TargetType["RANDOM_ENEMY"] = "random_enemy";
    TargetType["RANDOM_ALLY"] = "random_ally";
    TargetType["RANDOM_UNIT"] = "random_unit";
    TargetType["LOWEST_LIFE"] = "lowest_life";
    TargetType["HIGHEST_LIFE"] = "highest_life";
    TargetType["LOWEST_ARMOR"] = "lowest_armor";
    TargetType["HIGHEST_ARMOR"] = "highest_armor";
    TargetType["LOWEST_ENERGY"] = "lowest_energy";
    TargetType["HIGHEST_ENERGY"] = "highest_energy";
})(TargetType || (TargetType = {}));
// ─── 叠加类型 ───────────────────────────────────────────
var StackingType;
(function (StackingType) {
    StackingType["REPLACE"] = "replace";
    StackingType["ADD_VALUE"] = "add_value";
    StackingType["ADD_PERCENT"] = "add_percent";
    StackingType["ADD_COUNT"] = "add_count";
    StackingType["UNKNOWN"] = "unknown";
})(StackingType || (StackingType = {}));
// ─── 逻辑运算符 ─────────────────────────────────────────
var LogicOperator;
(function (LogicOperator) {
    LogicOperator["AND"] = "AND";
    LogicOperator["OR"] = "OR";
    LogicOperator["NOT"] = "NOT";
    LogicOperator["UNKNOWN"] = "UNKNOWN";
})(LogicOperator || (LogicOperator = {}));
// ─── 比较运算符 ─────────────────────────────────────────
var ComparisonOperator;
(function (ComparisonOperator) {
    ComparisonOperator["LT"] = "<";
    ComparisonOperator["LTE"] = "<=";
    ComparisonOperator["EQ"] = "=";
    ComparisonOperator["GTE"] = ">=";
    ComparisonOperator["GT"] = ">";
    ComparisonOperator["NEQ"] = "!=";
    ComparisonOperator["UNKNOWN"] = "unknown";
})(ComparisonOperator || (ComparisonOperator = {}));
// ─── 标记类型 ───────────────────────────────────────────
var MarkType;
(function (MarkType) {
    MarkType["POSITIVE"] = "positive";
    MarkType["NEGATIVE"] = "negative";
    MarkType["NEUTRAL"] = "neutral";
})(MarkType || (MarkType = {}));
// ─── 标记过期行为 ───────────────────────────────────────
var MarkExpireBehavior;
(function (MarkExpireBehavior) {
    MarkExpireBehavior["REMOVE_ALL"] = "remove_all";
    MarkExpireBehavior["REMOVE_ONE"] = "remove_one";
    MarkExpireBehavior["PERSIST"] = "persist";
})(MarkExpireBehavior || (MarkExpireBehavior = {}));
// ─── 过滤器 ID ──────────────────────────────────────────
var FilterId;
(function (FilterId) {
    FilterId["FILTER_BY_ATTRIBUTE"] = "filter_by_attribute";
    FilterId["FILTER_BY_MARK"] = "filter_by_mark";
    FilterId["FILTER_BY_CARD_COUNT"] = "filter_by_card_count";
    FilterId["FILTER_BY_CARD_TYPE"] = "filter_by_card_type";
    FilterId["FILTER_BY_RELATION"] = "filter_by_relation";
    FilterId["FILTER_BY_DISTANCE"] = "filter_by_distance";
    FilterId["FILTER_BY_ALIVE"] = "filter_by_alive";
    FilterId["FILTER_BY_EQUIPPED"] = "filter_by_equipped";
    FilterId["FILTER_BY_BUFF"] = "filter_by_buff";
    FilterId["FILTER_BY_DEBUFF"] = "filter_by_debuff";
    FilterId["FILTER_EXCLUDE_SELF"] = "filter_exclude_self";
    FilterId["FILTER_EXCLUDE_TARGET"] = "filter_exclude_target";
})(FilterId || (FilterId = {}));
// ─── 排序器 ID ──────────────────────────────────────────
var SorterId;
(function (SorterId) {
    SorterId["SORT_BY_ATTRIBUTE"] = "sort_by_attribute";
    SorterId["SORT_BY_MARK"] = "sort_by_mark";
    SorterId["SORT_BY_DISTANCE"] = "sort_by_distance";
    SorterId["SORT_BY_RANDOM"] = "sort_by_random";
    SorterId["SORT_BY_PLAYER_ORDER"] = "sort_by_player_order";
})(SorterId || (SorterId = {}));
// ─── 效果类型 ───────────────────────────────────────────
var EffectType;
(function (EffectType) {
    EffectType["DEAL_DAMAGE"] = "deal_damage";
    EffectType["RESTORE_LIFE"] = "restore_life";
    EffectType["GAIN_ARMOR"] = "gain_armor";
    EffectType["LOSE_ARMOR"] = "lose_armor";
    EffectType["GAIN_ENERGY"] = "gain_energy";
    EffectType["LOSE_ENERGY"] = "lose_energy";
    EffectType["DRAW_CARD"] = "draw_card";
    EffectType["DISCARD_CARD"] = "discard_card";
    EffectType["ADD_MARK"] = "add_mark";
    EffectType["REMOVE_MARK"] = "remove_mark";
    EffectType["MODIFY_ATTRIBUTE"] = "modify_attribute";
    EffectType["MOVE_POSITION"] = "move_position";
    EffectType["SWITCH_POSITION"] = "switch_position";
    EffectType["SUMMON"] = "summon";
    EffectType["DESTROY"] = "destroy";
    EffectType["STUN"] = "stun";
    EffectType["SILENCE"] = "silence";
    EffectType["TAUNT"] = "taunt";
    EffectType["STEALTH"] = "stealth";
    EffectType["COPY_CARD"] = "copy_card";
    EffectType["TRANSFORM"] = "transform";
    EffectType["DISCOVER"] = "discover";
    EffectType["RECYCLE"] = "recycle";
    EffectType["DELAYED_EFFECT"] = "delayed_effect";
})(EffectType || (EffectType = {}));
// ─── 条件类型 ───────────────────────────────────────────
var ConditionType;
(function (ConditionType) {
    ConditionType["HAS_MARK"] = "has_mark";
    ConditionType["ATTRIBUTE_CHECK"] = "attribute_check";
    ConditionType["CARD_IN_HAND"] = "card_in_hand";
    ConditionType["UNIT_COUNT"] = "unit_count";
    ConditionType["POSITION_CHECK"] = "position_check";
    ConditionType["TURN_CHECK"] = "turn_check";
    ConditionType["RANDOM_CHANCE"] = "random_chance";
    ConditionType["COMBO_CHECK"] = "combo_check";
    ConditionType["EQUIPMENT_CHECK"] = "equipment_check";
    ConditionType["ALIVE_CHECK"] = "alive_check";
    ConditionType["DISTANCE_CHECK"] = "distance_check";
    ConditionType["ENERGY_CHECK"] = "energy_check";
})(ConditionType || (ConditionType = {}));
// ─── 消耗类型 ───────────────────────────────────────────
var CostType;
(function (CostType) {
    CostType["PAY_LIFE"] = "pay_life";
    CostType["PAY_ENERGY"] = "pay_energy";
    CostType["PAY_ARMOR"] = "pay_armor";
    CostType["DISCARD_CARD"] = "discard_card";
    CostType["DESTROY_EQUIPMENT"] = "destroy_equipment";
    CostType["CONSUME_MARK"] = "consume_mark";
    CostType["SKIP_DRAW"] = "skip_draw";
    CostType["SACRIFICE_UNIT"] = "sacrifice_unit";
})(CostType || (CostType = {}));
// ─── 校验级别 ───────────────────────────────────────────
var ValidationLevel;
(function (ValidationLevel) {
    ValidationLevel["ERROR"] = "error";
    ValidationLevel["WARNING"] = "warning";
    ValidationLevel["INFO"] = "info";
})(ValidationLevel || (ValidationLevel = {}));
// ─── 排序方向 ───────────────────────────────────────────
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "asc";
    SortOrder["DESC"] = "desc";
})(SortOrder || (SortOrder = {}));
// ─── 关系类型 ───────────────────────────────────────────
var RelationType;
(function (RelationType) {
    RelationType["ENEMY"] = "enemy";
    RelationType["ALLY"] = "ally";
    RelationType["NEUTRAL"] = "neutral";
})(RelationType || (RelationType = {}));
// ─── 卡牌品类 ───────────────────────────────────────────
var CardCategory;
(function (CardCategory) {
    CardCategory["WEAPON"] = "weapon";
    CardCategory["TREASURE"] = "treasure";
    CardCategory["ARMOR"] = "armor";
    CardCategory["MARTIAL"] = "martial";
    CardCategory["SPELL"] = "spell";
})(CardCategory || (CardCategory = {}));
// ─── 参数类型 ───────────────────────────────────────────
var ParamType;
(function (ParamType) {
    ParamType["NUMBER"] = "number";
    ParamType["STRING"] = "string";
    ParamType["SELECT"] = "select";
    ParamType["BOOLEAN"] = "boolean";
    ParamType["MARK"] = "mark";
    ParamType["ATTRIBUTE"] = "attribute";
})(ParamType || (ParamType = {}));
export { AttributeType, CardType, Rarity, Timing, TargetType, StackingType, LogicOperator, ComparisonOperator, MarkType, MarkExpireBehavior, FilterId, SorterId, EffectType, ConditionType, CostType, ValidationLevel, SortOrder, RelationType, CardCategory, ParamType };
