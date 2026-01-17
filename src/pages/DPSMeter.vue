<template>
  <div class="dps-meter">
    <div class="settings-block">
      <div class="armor-input-section">
        <div class="armor-input-row">
          <label for="armor-input" class="armor-label"> Броня цели: </label>
          <Input
            id="armor-input"
            v-model="targetArmor"
            type="number"
            min="0"
            step="0.1"
            placeholder="Введите броню цели"
          />
        </div>
        <div class="armor-input-row">
          <label for="hp-input" class="armor-label"> HP цели: </label>
          <Input
            id="hp-input"
            v-model="targetHP"
            type="number"
            min="1"
            step="10"
            placeholder="Введите HP цели"
          />
        </div>
        <div class="armor-input-row">
          <label for="cannons-input" class="armor-label">
            Количество пушек с борта:
          </label>
          <Input
            id="cannons-input"
            v-model="cannonsNumber"
            type="number"
            min="1"
            step="1"
            placeholder="Введите количество пушек"
          />
        </div>
        <div>
          <label class="phosphorus-checkbox-label">
            <input
              v-model="isPhosphorusActive"
              type="checkbox"
              class="phosphorus-checkbox"
              @change="handlePhosphorusChange"
            />
            <span>Фосфор (+2 пробития)</span>
          </label>
        </div>
        <div>
          <label class="phosphorus-checkbox-label">
            <input
              v-model="isBlackPowderActive"
              type="checkbox"
              class="phosphorus-checkbox"
              @change="handleBlackPowderChange"
            />
            <span>Черный двойной порох (+2.5 пробития)</span>
          </label>
        </div>
      </div>
      <div class="filters">
        <div class="filter-group">
          <label class="filter-label">Поиск по названию:</label>
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Введите название орудия..."
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
            <label class="type-filter-label">
              <input
                v-model="showBombards"
                type="checkbox"
                class="type-checkbox"
              />
              <span>Показывать бомбарды</span>
            </label>
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">Пробитие:</label>
          <div class="range-inputs">
            <Input v-model="penetrationMin" type="number" placeholder="Мин" />
            <span>—</span>
            <Input v-model="penetrationMax" type="number" placeholder="Макс" />
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">Перезарядка (сек):</label>
          <div class="range-inputs">
            <Input v-model="reloadMin" type="number" placeholder="Мин" />
            <span>—</span>
            <Input v-model="reloadMax" type="number" placeholder="Макс" />
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">Минимальная дальность:</label>
          <div class="range-inputs">
            <Input
              v-model="rangeMin"
              type="number"
              placeholder="Мин"
              step="10"
            />
          </div>
        </div>

        <div class="filter-group">
          <Button @click="resetFilters"> Сбросить фильтры </Button>
          <span class="results-count">
            Найдено: {{ filteredDpsData.length }} из {{ allDpsData.length }}
          </span>
        </div>
      </div>
    </div>

    <div class="results-section">
      <div v-if="filteredDpsData.length === 0" class="no-results">
        Нет результатов, соответствующих фильтрам
      </div>

      <div v-else class="table-container">
        <DataTable
          :data="filteredDpsData"
          :fields="tableFields"
          :row-class="getRowClass"
          default-sort-key="dps"
          default-sort-direction="desc"
        >
          <template #["cannon.type"]="{ row }">
            {{ getTypeLabel(row.cannon.type) }}
            <span v-if="row.cannon.isBombard" class="bombard-badge">
              Бомбарда
            </span>
          </template>
          <template #["cannon.name"]="{ row }">
            {{ row.cannon.name }}
          </template>
          <template #["cannon.shotsPerLoad"]="{ row }">
            {{ formatValue(row.cannon.shotsPerLoad) }}
          </template>
          <template #["cannon.penetration"]="{ row }">
            {{ formatNumber(row.cannon.penetration) }}
            <span
              v-if="isPhosphorusActive && row.cannon.penetration !== null"
              class="phosphorus-bonus"
            >
              +2
            </span>
            <span
              v-if="isBlackPowderActive && row.cannon.penetration !== null"
              class="phosphorus-bonus"
            >
              +2.5
            </span>
          </template>
          <template #["damagePerShot"]="{ row }">
            {{ formatNumber(row.damagePerShot) }}
          </template>
          <template #["cannon.reloadTimeSeconds"]="{ row }">
            {{ formatNumber(row.cannon.reloadTimeSeconds) }}
          </template>
          <template #["dps"]="{ row }">
            {{ formatNumber(row.dps) }}
          </template>
          <template #["cannon.range"]="{ row }">
            {{ formatValue(row.cannon.range) }}
          </template>
          <template #["broadsideDamage"]="{ row }">
            {{ formatNumber(row.broadsideDamage) }}
          </template>
          <template #["broadsidesNeeded"]="{ row }">
            {{ formatValue(row.broadsidesNeeded) }}
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { cannons } from "../const/cannons.js";
import { formatNumber, formatValue } from "../utils/formatting.js";
import Input from "../components/UI/Input.vue";
import Button from "../components/UI/Button.vue";
import DataTable from "../components/UI/DataTable.vue";
import { useAppStore } from "../stores/app";

const appStore = useAppStore();
appStore.setPageTitle("Калькулятор DPS");

const targetArmor = ref(6.4);
const targetHP = ref(3000);
const cannonsNumber = ref(38);
const isPhosphorusActive = ref(false);
const isBlackPowderActive = ref(false);
const searchQuery = ref("");
const selectedTypes = ref(["light", "medium", "heavy", "special", "mortar"]);
const penetrationMin = ref(null);
const penetrationMax = ref(null);
const reloadMin = ref(null);
const reloadMax = ref(null);
const dpsMin = ref(null);
const dpsMax = ref(null);
const rangeMin = ref(null);
const showBombards = ref(true);

const handlePhosphorusChange = () => {
  if (isPhosphorusActive.value) {
    isBlackPowderActive.value = false;
  }
};

const handleBlackPowderChange = () => {
  if (isBlackPowderActive.value) {
    isPhosphorusActive.value = false;
  }
};

const availableTypes = [
  { value: "light", label: "Легкие" },
  { value: "medium", label: "Средние" },
  { value: "heavy", label: "Тяжелые" },
  // { value: "special", label: "Специальные" },
  // { value: "mortar", label: "Мортиры" },
];

const getTypeLabel = (type) => {
  const labels = {
    light: "Легкая",
    medium: "Средняя",
    heavy: "Тяжелая",
    special: "Специальная",
    mortar: "Мортира",
  };
  return labels[type] || type;
};

const tableFields = computed(() => {
  const fields = [
    { name: "Тип", key: "cannon.type", cellClass: "type-cell" },
    { name: "Название", key: "cannon.name", cellClass: "name-cell" },
    { name: "Cтволы", key: "cannon.shotsPerLoad", sortable: true },
    {
      name: "Пробитие",
      key: "cannon.penetration",
      cellClass: "penetration-cell",
      sortable: true,
    },
    {
      name: "Урон за выстрел",
      key: "damagePerShot",
      cellClass: "damage-cell",
      sortable: true,
    },
    {
      name: "Перезарядка (сек)",
      key: "cannon.reloadTimeSeconds",
      sortable: true,
    },
    { name: "Урон в минуту", key: "dps", cellClass: "dps-cell", sortable: true },
    { name: "Дальность", key: "cannon.range", sortable: true },
  ];

  if (cannonsNumber.value !== null) {
    fields.push({ name: "Урон за залп", key: "broadsideDamage", sortable: true });
  }

  if (targetHP.value !== null && cannonsNumber.value !== null) {
    fields.push({ name: "Кол-во залпов", key: "broadsidesNeeded", sortable: true });
  }

  return fields;
});

const getRowClass = (row) => [
  `type-${row.cannon.type}`,
  { "is-bombard": row.cannon.isBombard },
];

const getEffectivePenetration = (penetration) => {
  if (penetration === null || penetration === undefined) {
    return null;
  }
  // Add +2 penetration if фосфор is active
  if (isPhosphorusActive.value) {
    penetration = penetration + 2;
  }
  if (isBlackPowderActive.value) {
    penetration = penetration + 2.5;
  }
  return penetration;
};

const calculateDamagePerShot = (penetration) => {
  const effectivePenetration = getEffectivePenetration(penetration);
  if (effectivePenetration === null) {
    return null;
  }
  if (targetArmor.value === null || targetArmor.value < 0) {
    return null;
  }
  // Damage = penetration - armor, minimum 0
  return Math.max(0, effectivePenetration - targetArmor.value);
};

const calculateDPS = (cannon) => {
  const damagePerLoad =
    calculateDamagePerShot(cannon.penetration) * cannon.shotsPerLoad;

  if (damagePerLoad === null || damagePerLoad === 0) {
    return 0;
  }

  // DPS = damage per shot * shots per minute
  // Shots per minute = 60 / reloadTimeSeconds
  const shotsPerMinute =
    60 / (cannon.reloadTimeSeconds + (cannon.shotsPerLoad - 1));
  return damagePerLoad * shotsPerMinute;
};

const allDpsData = computed(() => {
  if (targetArmor.value === null || targetArmor.value < 0) {
    return [];
  }

  return cannons
    .map((cannon) => {
      const damagePerShot = calculateDamagePerShot(cannon.penetration);
      const dps = calculateDPS(cannon);
      const damagePerLoad =
        calculateDamagePerShot(cannon.penetration) * cannon.shotsPerLoad;
      const broadsideDamage =
        cannonsNumber.value !== null
          ? damagePerLoad * cannonsNumber.value
          : null;
      const broadsidesNeeded =
        targetHP.value !== null &&
        broadsideDamage !== null &&
        broadsideDamage > 0
          ? Math.ceil(targetHP.value / broadsideDamage)
          : null;

      return {
        cannon,
        damagePerShot,
        dps,
        broadsideDamage,
        broadsidesNeeded,
      };
    })
    .filter((item) => item.cannon.penetration !== null); // Filter out cannons without penetration
});

const filteredDpsData = computed(() => {
  return allDpsData.value.filter((item) => {
    // Filter by type
    if (!selectedTypes.value.includes(item.cannon.type)) {
      return false;
    }
    if (!showBombards.value && item.cannon.isBombard) {
      return false;
    }

    // Filter by search query
    if (
      searchQuery.value &&
      !item.cannon.name
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase().trim())
    ) {
      return false;
    }

    // Filter by penetration range (use effective penetration)
    const effectivePenetration = getEffectivePenetration(
      item.cannon.penetration
    );
    if (effectivePenetration !== null) {
      if (
        penetrationMin.value !== null &&
        effectivePenetration < penetrationMin.value
      ) {
        return false;
      }
      if (
        penetrationMax.value !== null &&
        effectivePenetration > penetrationMax.value
      ) {
        return false;
      }
    }

    // Filter by reload time range
    if (
      reloadMin.value !== null &&
      item.cannon.reloadTimeSeconds < reloadMin.value
    ) {
      return false;
    }
    if (
      reloadMax.value !== null &&
      item.cannon.reloadTimeSeconds > reloadMax.value
    ) {
      return false;
    }

    // Filter by DPS range
    if (dpsMin.value !== null && item.dps < dpsMin.value) {
      return false;
    }
    if (dpsMax.value !== null && item.dps > dpsMax.value) {
      return false;
    }

    // filter by range
    if (rangeMin.value !== null && item.cannon.range < rangeMin.value) {
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
  dpsMin.value = null;
  dpsMax.value = null;
  rangeMin.value = null;
};
</script>

<style lang="scss" scoped>
h1 {
  color: var(--color-heading);
  margin-block: 1rem;
  text-align: center;
}

.dps-meter {
  padding-inline: 1rem;
  display: flex;
  gap: 2rem;

  .settings-block {
    display: flex;
    flex-direction: column;
  }

  .armor-input-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 0.5rem;
    background: var(--color-background-soft);
    border-radius: 8px;
    border: 1px solid var(--color-border);

    .armor-label {
      font-weight: 600;
      color: var(--color-heading);
      font-size: 1rem;
      white-space: nowrap;
    }

    .armor-input-row {
      :deep(.ui-input) {
        width: 100px;
      }
    }

    .phosphorus-checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      user-select: none;

      .phosphorus-checkbox {
        width: 1.2rem;
        height: 1.2rem;
        cursor: pointer;
      }

      span {
        color: var(--color-text);
        font-size: 1rem;
        font-weight: 500;
      }
    }
  }
  .filters {
    background: var(--color-background-soft);
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border: 1px solid var(--color-border);

    .filter-group {
      margin-bottom: 1rem;

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

      :deep(.ui-input) {
        width: 250px;
        max-width: 400px;
      }

      .type-filters {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;

        .type-filter-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-block: 0.25rem;
          cursor: pointer;
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

        :deep(.ui-input) {
          width: 100px;
        }

        span {
          color: var(--color-text);
        }
      }

      .results-count {
        color: var(--color-text);
        font-size: 0.9rem;
        font-weight: 500;
      }
    }
  }

  .results-section {
    max-height: calc(100vh - 6rem);
    flex-grow: 1;
    overflow: auto;

    /* Chrome / Edge / Safari */
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: var(--color-background);
      border-radius: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--color-border);
      border-radius: 8px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: var(--color-border-hover);
    }

    /* Firefox */
    scrollbar-color: var(--color-border) var(--color-background);
    scrollbar-width: thin;

    .no-results {
      text-align: center;
      padding: 3rem;
      color: var(--color-text);
      font-size: 1.1rem;
      background: var(--color-background-soft);
      border-radius: 8px;
      border: 1px solid var(--color-border);
    }

    .table-container {
      width: 100%;
      overflow-x: auto;

      /* Chrome / Edge / Safari */
      &::-webkit-scrollbar {
        height: 8px;
      }

      &::-webkit-scrollbar-track {
        background: var(--color-background);
        border-radius: 8px;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--color-border);
        border-radius: 8px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: var(--color-border-hover);
      }

      /* Firefox */
      scrollbar-color: var(--color-border) var(--color-background);
      scrollbar-width: thin;

      :deep(.ui-table tbody tr.type-light) {
        border-left: 3px solid #4caf50;
      }

      :deep(.ui-table tbody tr.type-medium) {
        border-left: 3px solid #2196f3;
      }

      :deep(.ui-table tbody tr.type-heavy) {
        border-left: 3px solid #f44336;
      }

      :deep(.ui-table tbody tr.type-special) {
        border-left: 3px solid #ff9800;
      }

      :deep(.ui-table tbody tr.type-mortar) {
        border-left: 3px solid #9c27b0;
      }

      :deep(.ui-table tbody tr.is-bombard) {
        background: linear-gradient(
          90deg,
          rgba(200, 120, 100, 0.02) 0%,
          transparent 100%
        );

        &:hover {
          background: linear-gradient(
            90deg,
            rgba(200, 120, 100, 0.04) 0%,
            var(--color-background-soft) 100%
          );
        }
      }

      :deep(.ui-table td.type-cell) {
        font-weight: 500;
        color: var(--color-heading);

        .bombard-badge {
          display: inline-block;
          margin-left: 0.5rem;
          padding: 0.15rem 0.4rem;
          background: rgba(200, 120, 100, 0.15);
          color: #b8735a;
          border: 1px solid rgba(200, 120, 100, 0.3);
          border-radius: 3px;
          font-size: 0.7rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
      }

      :deep(.ui-table td.name-cell) {
        font-weight: 500;
      }

      :deep(.ui-table td.penetration-cell) {
        position: relative;

        .phosphorus-bonus {
          color: #4caf50;
          font-weight: 700;
          margin-left: 0.25rem;
          font-size: 0.9em;
        }
      }

      :deep(.ui-table td.damage-cell) {
        font-weight: 600;
        color: var(--color-heading);
      }

      :deep(.ui-table td.dps-cell) {
        font-weight: 700;
        color: #2196f3;
        font-size: 1.05em;
      }
    }

  }

  .placeholder {
    text-align: center;
    padding: 3rem;
    color: var(--color-text);
    font-size: 1.1rem;
    background: var(--color-background-soft);
    border-radius: 8px;
    border: 1px solid var(--color-border);
  }

  @media (max-width: 768px) {
    padding: 1rem;

    .armor-input-section {
      flex-direction: column;
      align-items: flex-start;

      .armor-input-row {
        :deep(.ui-input) {
          width: 100%;
        }
      }
    }

    .results-section {
      .filters {
        padding: 1rem;

        .filter-group {
          .type-filters {
            flex-direction: column;
            gap: 0.5rem;
          }

          .range-inputs {
            :deep(.ui-input) {
              width: 80px;
            }
          }
        }
      }
    }

  }
}

.armor-input-row {
  display: flex;
  justify-content: space-between;
}
</style>
