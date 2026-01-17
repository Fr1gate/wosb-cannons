<template>
  <table class="ui-table">
    <thead>
      <tr>
        <th
          v-for="field in fields"
          :key="field.key"
          :class="[
            field.headerClass,
            {
              'is-sortable': field.sortable,
              'is-sorted': sortKey === field.key,
            },
          ]"
          @click="handleSort(field)"
        >
          {{ field.name }}
          <span v-if="field.sortable" class="sort-indicator">
            {{
              sortKey === field.key
                ? sortDirection === "asc"
                  ? "▲"
                  : "▼"
                : "↕"
            }}
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, rowIndex) in sortedData"
        :key="rowIndex"
        :class="getRowClass(row)"
      >
        <td v-for="field in fields" :key="field.key" :class="field.cellClass">
          <slot :name="field.key" :row="row">
            {{ getCellValue(row, field.key) }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { computed, ref } from "vue";
import get from "lodash/get";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  fields: {
    type: Array,
    required: true,
  },
  rowClass: {
    type: Function,
    default: null,
  },
  defaultSortKey: {
    type: String,
    default: null,
  },
  defaultSortDirection: {
    type: String,
    default: "asc",
  },
});

const sortKey = ref(props.defaultSortKey);
const sortDirection = ref(props.defaultSortDirection);

const getCellValue = (row, key) => {
  const value = get(row, key);
  if (value === null || value === undefined) {
    return "—";
  }
  return value;
};

const getRowClass = (row) => (props.rowClass ? props.rowClass(row) : null);

const isSortable = (field) => field && field.sortable;

const handleSort = (field) => {
  if (!isSortable(field)) {
    return;
  }
  if (sortKey.value === field.key) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
    return;
  }
  sortKey.value = field.key;
  sortDirection.value = "asc";
};

const compareValues = (aValue, bValue) => {
  const aIsNull = aValue === null || aValue === undefined;
  const bIsNull = bValue === null || bValue === undefined;

  if (aIsNull && bIsNull) return 0;
  if (aIsNull) return 1;
  if (bIsNull) return -1;

  if (typeof aValue === "number" && typeof bValue === "number") {
    return aValue - bValue;
  }

  return String(aValue).localeCompare(String(bValue), "ru");
};

const sortedData = computed(() => {
  if (!sortKey.value) {
    return props.data;
  }

  const field = props.fields.find((item) => item.key === sortKey.value);
  if (!field || !isSortable(field)) {
    return props.data;
  }

  const multiplier = sortDirection.value === "asc" ? 1 : -1;

  return [...props.data].sort((a, b) => {
    const aValue = get(a, sortKey.value);
    const bValue = get(b, sortKey.value);
    return compareValues(aValue, bValue) * multiplier;
  });
});
</script>

<style lang="scss" scoped>
.ui-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-background);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  thead {
    background: var(--color-background-soft);
    border-bottom: 2px solid var(--color-border);

    th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: var(--color-heading);
      white-space: nowrap;

      &.is-sortable {
        cursor: pointer;
        user-select: none;
      }

      .sort-indicator {
        margin-left: 0.4rem;
        font-size: 0.75rem;
        opacity: 0;
        transition: opacity 0.15s ease-in-out;
      }

      &.is-sortable:hover .sort-indicator {
        opacity: 0.6;
      }

      &.is-sorted .sort-indicator {
        opacity: 1;
      }
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid var(--color-border);
      transition: background-color 0.2s;

      &:hover {
        background: var(--color-background-soft);
      }

      &:last-child {
        border-bottom: none;
      }
    }

    td {
      padding: 0.75rem 1rem;
      color: var(--color-text);
    }
  }
}

@media (max-width: 768px) {
  .ui-table {
    font-size: 0.875rem;
  }

  .ui-table thead th,
  .ui-table tbody td {
    padding: 0.5rem;
  }
}
</style>
