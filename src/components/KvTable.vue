<template>
    <div v-if="columns === 2" class="kv-grid">
        <template v-for="row in paddedRows" :key="row.key">
            <span class="kv-label">{{ row.label }}</span>
            <span class="kv-value">
                <code v-if="row.mono" class="font-mono text-xs" :class="row.valueClass">
                    {{ row.value }}
                </code>
                <span v-else :class="row.valueClass">{{ row.value }}</span>
            </span>
        </template>
    </div>
    <el-table
        v-else
        :data="rows"
        row-key="key"
        size="small"
        border
        :show-header="false"
        class="w-full"
        :cell-style="handleCellStyle"
    >
        <el-table-column prop="label" label="名称" width="200" />
        <el-table-column prop="value" label="值" min-width="180" show-overflow-tooltip>
            <template #default="{ row }">
                <code v-if="row.mono" class="font-mono text-xs" :class="row.valueClass">
                    {{ row.value }}
                </code>
                <span v-else :class="row.valueClass">{{ row.value }}</span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

/** 键值表行 */
export interface IKvTableRow {
    key: string
    label: string
    value: string
    /** 值使用等宽字体 */
    mono?: boolean
    /** 值单元格额外样式类 */
    valueClass?: string
}

const props = withDefaults(defineProps<{
    rows: IKvTableRow[]
    /** 2 列网格，两列各占 50% */
    columns?: 1 | 2
}>(), {
    columns: 1,
})

/**
 * 两列网格补齐奇数行，保证最后一行右侧也有完整单元格边框
 */
const paddedRows = computed((): IKvTableRow[] => {
    if (props.columns !== 2 || props.rows.length % 2 === 0)
        return props.rows
    return [...props.rows, { key: '__kv-pad', label: '', value: '' }]
})

const LABEL_CELL_STYLE: CSSProperties = {
    backgroundColor: '#f8fafc',
}

/**
 * 名称列单元格浅灰底
 */
function handleCellStyle({ columnIndex }: { columnIndex: number }): CSSProperties {
    if (columnIndex === 0)
        return LABEL_CELL_STYLE
    return {}
}
</script>

<style scoped>
.kv-grid {
    display: grid;
    grid-template-columns: minmax(96px, 21%) minmax(0, 1fr) minmax(96px, 21%) minmax(0, 1fr);
    gap: 1px;
    padding: 1px;
    overflow: hidden;
    background: #e2e8f0;
    border-radius: 8px;
}

.kv-label,
.kv-value {
    display: flex;
    align-items: center;
    min-width: 0;
    min-height: 36px;
    padding: 8px 12px;
    font-size: 12px;
}

.kv-label {
    color: #64748b;
    background: #f8fafc;
}

.kv-value {
    color: #0f172a;
    overflow-wrap: anywhere;
    background: #fff;
}

.kv-value > * {
    min-width: 0;
    max-width: 100%;
}
</style>
