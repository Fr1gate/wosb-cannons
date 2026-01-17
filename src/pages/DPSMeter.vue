<template>
  <div class="dps-meter">
    <div class="settings-block">
      <div class="armor-input-section">
        <div class="section-heading">{{ t("dps.sections.target") }}</div>
        <div class="armor-input-row">
          <label for="armor-input" class="armor-label">
            {{ t("dps.inputs.targetArmor") }}
          </label>
          <Input
            id="armor-input"
            v-model="targetArmor"
            type="number"
            min="0"
            step="0.1"
            :placeholder="t('dps.placeholders.targetArmor')"
          />
        </div>
        <div class="armor-input-row">
          <label for="hp-input" class="armor-label">
            {{ t("dps.inputs.targetHp") }}
          </label>
          <Input
            id="hp-input"
            v-model="targetHP"
            type="number"
            min="1"
            step="10"
            :placeholder="t('dps.placeholders.targetHp')"
          />
        </div>
        <div class="armor-input-row">
          <label for="cannons-input" class="armor-label">
            {{ t("dps.inputs.cannonsPerSide") }}
          </label>
          <Input
            id="cannons-input"
            v-model="cannonsNumber"
            type="number"
            min="1"
            step="1"
            :placeholder="t('dps.placeholders.cannonsPerSide')"
          />
        </div>
        <div class="checkbox-row">
          <Checkbox v-model="isPhosphorusActive" @change="handlePhosphorusChange">
            {{ t("dps.buffs.phosphorus") }}
          </Checkbox>
        </div>
        <div class="checkbox-row">
          <Checkbox
            v-model="isBlackPowderActive"
            @change="handleBlackPowderChange"
          >
            {{ t("dps.buffs.blackPowder") }}
          </Checkbox>
        </div>
      </div>
      <div class="filters">
        <div class="section-heading">{{ t("dps.sections.filters") }}</div>
        <div class="filter-group">
          <label class="filter-label">{{ t("dps.filters.searchLabel") }}</label>
          <Input
            v-model="searchQuery"
            type="text"
            :placeholder="t('dps.placeholders.search')"
          />
        </div>

        <div class="filter-group">
          <label class="filter-label">{{ t("dps.filters.typeLabel") }}</label>
          <div class="type-filters">
            <label
              v-for="type in availableTypes"
              :key="type.value"
              class="type-filter-label"
            >
              <Checkbox v-model="selectedTypes" :value="type.value">
                {{ type.label }}
              </Checkbox>
            </label>
            <label class="type-filter-label">
              <Checkbox v-model="showBombards">
                {{ t("dps.filters.showBombards") }}
              </Checkbox>
            </label>
          </div>
        </div>

        <div class="filter-group">

          <Checkbox v-model="boardingNoReloadActive">
            {{ t("dps.filters.boardingNoReload") }}
          </Checkbox>
        </div>

        <div class="filter-group">
          <label class="filter-label">{{ t("dps.filters.rangeMin") }}</label>
          <div class="range-inputs">
            <Input
              v-model="rangeMin"
              type="number"
              :placeholder="t('dps.filters.min')"
              step="10"
            />
          </div>
        </div>

        <div class="filter-group">
          <Button @click="resetFilters">
            {{ t("dps.filters.reset") }}
          </Button>
          <span class="results-count">
            {{
              t("dps.results.count", {
                found: filteredDpsData.length,
                total: allDpsData.length,
              })
            }}
          </span>
        </div>
      </div>
    </div>

    <div class="results-section">
      <div v-if="filteredDpsData.length === 0" class="no-results">
        {{ t("dps.results.empty") }}
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
              {{ t("dps.table.bombard") }}
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
            <span v-if="row.boardingCandidate && !row.cannon.isBombard" class="boarding-badge">
              {{ t("dps.table.boardingCandidate") }}
            </span>
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
import { useI18n } from "vue-i18n";
import { cannons } from "../const/cannons.js";
import { formatNumber, formatValue } from "../utils/formatting.js";
import Input from "../components/UI/Input.vue";
import Button from "../components/UI/Button.vue";
import Checkbox from "../components/UI/Checkbox.vue";
import DataTable from "../components/UI/DataTable.vue";
import { useAppStore } from "../stores/app";

const appStore = useAppStore();
appStore.setPageTitle("pages.dps.title");

const { t } = useI18n();

const targetArmor = ref(6.4);
const targetHP = ref(3000);
const cannonsNumber = ref(38);
const isPhosphorusActive = ref(false);
const isBlackPowderActive = ref(false);
const boardingNoReloadActive = ref(false);
const searchQuery = ref("");
const selectedTypes = ref(["light", "medium", "heavy", "special", "mortar"]);
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

const availableTypes = computed(() => [
  { value: "light", label: t("dps.types.light") },
  { value: "medium", label: t("dps.types.medium") },
  { value: "heavy", label: t("dps.types.heavy") },
  // { value: "special", label: t("dps.types.special") },
  // { value: "mortar", label: t("dps.types.mortar") },
]);

const getTypeLabel = (type) => {
  const labels = {
    light: t("dps.types.lightSingle"),
    medium: t("dps.types.mediumSingle"),
    heavy: t("dps.types.heavySingle"),
    special: t("dps.types.specialSingle"),
    mortar: t("dps.types.mortarSingle"),
  };
  return labels[type] || type;
};

const tableFields = computed(() => {
  const fields = [
    { name: t("dps.table.type"), key: "cannon.type", cellClass: "type-cell" },
    {
      name: t("dps.table.name"),
      key: "cannon.name",
      cellClass: "name-cell",
    },
    { name: t("dps.table.guns"), key: "cannon.shotsPerLoad", sortable: true },
    {
      name: t("dps.table.penetration"),
      key: "cannon.penetration",
      cellClass: "penetration-cell",
      sortable: true,
    },
    {
      name: t("dps.table.damagePerShot"),
      key: "damagePerShot",
      cellClass: "damage-cell",
      sortable: true,
    },
    {
      name: t("dps.table.reloadSeconds"),
      key: "cannon.reloadTimeSeconds",
      sortable: true,
    },
    {
      name: t("dps.table.dps"),
      key: "dps",
      cellClass: "dps-cell",
      sortable: true,
    },
    { name: t("dps.table.range"), key: "cannon.range", sortable: true },
  ];

  if (cannonsNumber.value !== null) {
    fields.push({
      name: t("dps.table.broadsideDamage"),
      key: "broadsideDamage",
      sortable: true,
    });
  }

  if (targetHP.value !== null && cannonsNumber.value !== null) {
    fields.push({
      name: t("dps.table.broadsidesNeeded"),
      key: "broadsidesNeeded",
      sortable: true,
    });
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
      const boardingCandidate =
        targetHP.value !== null &&
        broadsideDamage !== null &&
        broadsideDamage > 0 &&
        broadsideDamage * 2 > targetHP.value / 2;
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
        boardingCandidate,
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
    if (boardingNoReloadActive.value && item.cannon.isBombard) {
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

    if (boardingNoReloadActive.value) {
      if (targetHP.value === null || cannonsNumber.value === null) {
        return false;
      }
      if (!item.boardingCandidate) {
        return false;
      }
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
  boardingNoReloadActive.value = false;
  dpsMin.value = null;
  dpsMax.value = null;
  rangeMin.value = null;
};
</script>

<style lang="scss" scoped>
.dps-meter {
  display: grid;
  grid-template-columns: minmax(260px, 320px) 1fr;
  gap: 1rem;
  align-items: start;

  .settings-block {
    display: grid;
    gap: 0.75rem;
    min-width: 0;
  }

  .armor-input-section,
  .filters {
    background: var(--color-background-soft);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 0.75rem;
    display: grid;
    gap: 0.75rem;
    min-width: 0;
  }

  .section-heading {
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--color-heading);
    opacity: 0.85;
    padding-bottom: 0.15rem;
    border-bottom: 1px solid var(--color-border);
  }

  .armor-input-row,
  .filter-group {
    display: grid;
    gap: 0.4rem;
    min-width: 0;
  }

  .armor-label,
  .filter-label {
    font-weight: 600;
    color: var(--color-heading);
    font-size: 0.9rem;
  }

  :deep(.ui-input) {
    width: 100%;
    min-width: 0;
  }

  .checkbox-row {
    display: flex;
    align-items: center;
  }

  .type-filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.4rem;

    .type-filter-label {
      padding: 0.2rem 0.35rem;
      border-radius: 4px;
      transition: background-color 0.2s;

      &:hover {
        background: var(--color-background-mute);
      }
    }
  }

  .range-inputs {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 0.4rem;

    span {
      color: var(--color-text);
      text-align: center;
    }
  }

  .filter-group:last-child {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .results-count {
    color: var(--color-text);
    font-size: 0.85rem;
    font-weight: 500;
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

      :deep(.ui-table td) .boarding-badge {
        display: inline-block;
        margin-left: 0.5rem;
        padding: 0.1rem 0.35rem;
        background: rgba(76, 175, 80, 0.15);
        border: 1px solid rgba(76, 175, 80, 0.35);
        border-radius: 3px;
        color: #6bcf7a;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.3px;
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
    grid-template-columns: 1fr;
    padding: 0.75rem;

    .results-section {
      .filters {
        padding: 1rem;

        .filter-group {
          .type-filters {
            grid-template-columns: 1fr;
          }

          .range-inputs {
            grid-template-columns: 1fr;
          }
        }
      }
    }

  }
}
</style>
