<template>
  <div class="cannons-table">
    <div class="filters">
      <div class="filter-group">
        <label class="filter-label">Поиск по названию:</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Введите название орудия..."
          class="search-input"
        />
      </div>

      <div class="filter-group">
        <label class="filter-label">Тип орудия:</label>
        <div class="type-filters">
          <label
            v-for="type in availableTypes"
            :key="type.value"
            class="type-filter-label"
          >
            <input
              v-model="selectedTypes"
              type="checkbox"
              :value="type.value"
              class="type-checkbox"
            />
            <span>{{ type.label }}</span>
          </label>
        </div>
      </div>

      <div class="filter-group">
        <label class="filter-label">Пробитие:</label>
        <div class="range-inputs">
          <input
            v-model.number="penetrationMin"
            type="number"
            placeholder="Мин"
            class="range-input"
          />
          <span>—</span>
          <input
            v-model.number="penetrationMax"
            type="number"
            placeholder="Макс"
            class="range-input"
          />
        </div>
      </div>

      <div class="filter-group">
        <label class="filter-label">Перезарядка (сек):</label>
        <div class="range-inputs">
          <input
            v-model.number="reloadMin"
            type="number"
            placeholder="Мин"
            class="range-input"
          />
          <span>—</span>
          <input
            v-model.number="reloadMax"
            type="number"
            placeholder="Макс"
            class="range-input"
          />
        </div>
      </div>

      <div class="filter-group">
        <button @click="resetFilters" class="reset-button">
          Сбросить фильтры
        </button>
        <span class="results-count">
          Найдено: {{ filteredCannons.length }} из {{ cannons.length }}
        </span>
      </div>
    </div>

    <div v-if="filteredCannons.length === 0" class="no-results">
      Нет результатов, соответствующих фильтрам
    </div>

    <table v-else>
      <thead>
        <tr>
          <th>Тип</th>
          <th>Название</th>
          <th>Пробитие</th>
          <th>Перезарядка (сек)</th>
          <th>Дальность</th>
          <th>Макс. угол (°)</th>
          <th>Разброс</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(cannon, index) in filteredCannons"
          :key="index"
          :class="`type-${cannon.type}`"
        >
          <td class="type-cell">{{ getTypeLabel(cannon.type) }}</td>
          <td class="name-cell">{{ cannon.name }}</td>
          <td>{{ formatValue(cannon.penetration) }}</td>
          <td>{{ cannon.reloadTimeSeconds }}</td>
          <td>{{ formatValue(cannon.range) }}</td>
          <td>{{ formatValue(cannon.maxAngleDeg) }}</td>
          <td>{{ formatValue(cannon.scatter) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { cannons } from "../const/cannons.js";

const searchQuery = ref("");
const selectedTypes = ref(["light", "medium", "heavy", "special", "mortar"]);
const penetrationMin = ref(null);
const penetrationMax = ref(null);
const reloadMin = ref(null);
const reloadMax = ref(null);

const availableTypes = [
  { value: "light", label: "Легкие" },
  { value: "medium", label: "Средние" },
  { value: "heavy", label: "Тяжелые" },
  // { value: "special", label: "Специальные" },
  // { value: "mortar", label: "Мортиры" },
];

const getTypeLabel = (type) => {
  const labels = {
    light: "Легкие",
    medium: "Средние",
    heavy: "Тяжелые",
    special: "Специальные",
    mortar: "Мортиры",
  };
  return labels[type] || type;
};

const formatValue = (value) => {
  if (value === null || value === undefined) {
    return "—";
  }
  return value;
};

const filteredCannons = computed(() => {
  return cannons.filter((cannon) => {
    // Filter by type
    if (!selectedTypes.value.includes(cannon.type)) {
      return false;
    }

    // Filter by search query
    if (
      searchQuery.value &&
      !cannon.name
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase().trim())
    ) {
      return false;
    }

    // Filter by penetration range
    if (cannon.penetration !== null) {
      if (
        penetrationMin.value !== null &&
        cannon.penetration < penetrationMin.value
      ) {
        return false;
      }
      if (
        penetrationMax.value !== null &&
        cannon.penetration > penetrationMax.value
      ) {
        return false;
      }
    }

    // Filter by reload time range
    if (
      reloadMin.value !== null &&
      cannon.reloadTimeSeconds < reloadMin.value
    ) {
      return false;
    }
    if (
      reloadMax.value !== null &&
      cannon.reloadTimeSeconds > reloadMax.value
    ) {
      return false;
    }

    return true;
  });
});

const resetFilters = () => {
  searchQuery.value = "";
  selectedTypes.value = ["light", "medium", "heavy", "special", "mortar"];
  penetrationMin.value = null;
  penetrationMax.value = null;
  reloadMin.value = null;
  reloadMax.value = null;
};
</script>

<style lang="scss" scoped>
.cannons-table {
  width: 100%;
  overflow-x: auto;
  margin: 2rem 0;

  .filters {
    background: var(--color-background-soft);
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border: 1px solid var(--color-border);

    .filter-group {
      margin-bottom: 1.5rem;

      &:last-child {
        margin-bottom: 0;
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .filter-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--color-heading);
        font-size: 0.9rem;
      }

      .search-input {
        width: 100%;
        max-width: 400px;
        padding: 0.75rem;
        border: 1px solid var(--color-border);
        border-radius: 4px;
        background: var(--color-background);
        color: var(--color-text);
        font-size: 1rem;
        transition: border-color 0.2s;

        &:focus {
          outline: none;
          border-color: var(--color-border-hover);
        }
      }

      .type-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;

        .type-filter-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          transition: background-color 0.2s;

          &:hover {
            background: var(--color-background-mute);
          }

          .type-checkbox {
            cursor: pointer;
            width: 1.2rem;
            height: 1.2rem;
          }

          span {
            user-select: none;
            color: var(--color-text);
          }
        }
      }

      .range-inputs {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;

        .range-input {
          width: 100px;
          padding: 0.5rem;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          background: var(--color-background);
          color: var(--color-text);
          font-size: 0.9rem;
          transition: border-color 0.2s;

          &:focus {
            outline: none;
            border-color: var(--color-border-hover);
          }
        }

        span {
          color: var(--color-text);
        }
      }

      .reset-button {
        padding: 0.75rem 1.5rem;
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: 4px;
        color: var(--color-text);
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s;

        &:hover {
          background: var(--color-background-mute);
          border-color: var(--color-border-hover);
        }

        &:active {
          transform: scale(0.98);
        }
      }

      .results-count {
        color: var(--color-text);
        font-size: 0.9rem;
        font-weight: 500;
      }
    }
  }

  .no-results {
    text-align: center;
    padding: 3rem;
    color: var(--color-text);
    font-size: 1.1rem;
    background: var(--color-background-soft);
    border-radius: 8px;
    border: 1px solid var(--color-border);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: var(--color-background);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  thead {
    background: var(--color-background-soft);
    border-bottom: 2px solid var(--color-border);

    th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: var(--color-heading);
      white-space: nowrap;
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

      &.type-light {
        border-left: 3px solid #4caf50;
      }

      &.type-medium {
        border-left: 3px solid #2196f3;
      }

      &.type-heavy {
        border-left: 3px solid #f44336;
      }

      &.type-special {
        border-left: 3px solid #ff9800;
      }

      &.type-mortar {
        border-left: 3px solid #9c27b0;
      }
    }

    td {
      padding: 0.75rem 1rem;
      color: var(--color-text);

      &.type-cell {
        font-weight: 500;
        color: var(--color-heading);
      }

      &.name-cell {
        font-weight: 500;
      }
    }
  }

  @media (max-width: 768px) {
    .filters {
      padding: 1rem;

      .filter-group {
        .type-filters {
          flex-direction: column;
          gap: 0.5rem;
        }

        .range-inputs {
          .range-input {
            width: 80px;
          }
        }
      }
    }

    table {
      font-size: 0.875rem;
    }

    thead th,
    tbody td {
      padding: 0.5rem;
    }
  }
}
</style>
