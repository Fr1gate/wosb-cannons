<template>
  <h1>Калькулятор урона в минуту (DPS)</h1>
  <div class="dps-meter">
    <div class="settings-block">
      <div class="armor-input-section">
        <div>
          <label for="armor-input" class="armor-label"> Броня цели: </label>
          <input
            id="armor-input"
            v-model.number="targetArmor"
            type="number"
            min="0"
            step="0.1"
            placeholder="Введите броню цели"
            class="armor-input"
          />
        </div>
        <div>
          <label for="armor-input" class="armor-label"> HP цели: </label>
          <input
            id="armor-input"
            v-model.number="targetHP"
            type="number"
            min="1"
            step="10"
            placeholder="Введите HP цели"
            class="armor-input"
          />
        </div>
        <div>
          <label for="armor-input" class="armor-label">
            Количество пушек с борта:
          </label>
          <input
            id="armor-input"
            v-model.number="cannonsNumber"
            type="number"
            min="1"
            step="1"
            placeholder="Введите количество пушек"
            class="armor-input"
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
          <label class="filter-label">Минимальная дальность:</label>
          <div class="range-inputs">
            <input
              v-model.number="rangeMin"
              type="number"
              placeholder="Мин"
              step="10"
              class="range-input"
            />
          </div>
        </div>

        <div class="filter-group">
          <button @click="resetFilters" class="reset-button">
            Сбросить фильтры
          </button>
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
        <table>
          <thead>
            <tr>
              <th>Тип</th>
              <th>Название</th>
              <th>Пробитие</th>
              <th>Урон за выстрел</th>
              <th>Перезарядка (сек)</th>
              <th>Урон в минуту</th>
              <th>Дальность</th>
              <!-- <th>Макс. угол (°)</th> -->
              <!-- <th>Разброс</th> -->
              <th>Cтволы</th>
              <th v-if="cannonsNumber !== null">Урон за залп</th>
              <th v-if="targetHP !== null && cannonsNumber !== null">
                Кол-во залпов
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in filteredDpsData"
              :key="index"
              :class="[
                `type-${item.cannon.type}`,
                { 'is-bombard': item.cannon.isBombard },
              ]"
            >
              <td class="type-cell">
                {{ getTypeLabel(item.cannon.type) }}
                <span v-if="item.cannon.isBombard" class="bombard-badge">
                  Бомбарда
                </span>
              </td>
              <td class="name-cell">
                {{ item.cannon.name }}
              </td>
              <td class="penetration-cell">
                {{ formatValue(item.cannon.penetration) }}
                <span
                  v-if="isPhosphorusActive && item.cannon.penetration !== null"
                  class="phosphorus-bonus"
                >
                  +2
                </span>
              </td>
              <td class="damage-cell">
                {{ formatDamage(item.damagePerShot) }}
              </td>
              <td>{{ item.cannon.reloadTimeSeconds }}</td>
              <td class="dps-cell">{{ formatDPS(item.dps) }}</td>
              <td>{{ formatValue(item.cannon.range) }}</td>
              <!-- <td>{{ formatValue(item.cannon.maxAngleDeg) }}</td> -->
              <!-- <td>{{ formatValue(item.cannon.scatter) }}</td> -->
              <td>
                {{ formatValue(item.cannon.shotsPerLoad) }}
              </td>
              <td v-if="cannonsNumber !== null">
                {{ formatValue(item.broadsideDamage) }}
              </td>
              <td v-if="targetHP !== null && cannonsNumber !== null">
                {{ formatValue(item.broadsidesNeeded) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { cannons } from "../const/cannons.js";

const targetArmor = ref(0);
const targetHP = ref(1000);
const cannonsNumber = ref(1);
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

const formatValue = (value) => {
  if (value === null || value === undefined) {
    return "—";
  }
  return value;
};

const formatDamage = (damage) => {
  if (damage === null || damage === undefined) {
    return "—";
  }
  return damage.toFixed(1);
};

const formatDPS = (dps) => {
  if (dps === null || dps === undefined || isNaN(dps)) {
    return "—";
  }
  return dps.toFixed(1);
};

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
    .filter((item) => item.cannon.penetration !== null) // Filter out cannons without penetration
    .sort((a, b) => {
      // Sort by DPS descending
      if (a.dps === null || isNaN(a.dps)) return 1;
      if (b.dps === null || isNaN(b.dps)) return -1;
      return b.dps - a.dps;
    });
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
// delete arrows
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

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

    .armor-input {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      background: var(--color-background);
      color: var(--color-text);
      font-size: 1rem;
      width: 100px;
      transition: border-color 0.2s;

      &:focus {
        outline: none;
        border-color: var(--color-border-hover);
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

      .search-input {
        width: 250px;
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

  .results-section {
    max-height: calc(100vh - 6rem);
    flex-grow: 1;
    overflow: auto;

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

        &.is-bombard {
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
      }

      td {
        padding: 0.75rem 1rem;
        color: var(--color-text);

        &.type-cell {
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

        &.name-cell {
          font-weight: 500;
        }

        &.penetration-cell {
          position: relative;

          .phosphorus-bonus {
            color: #4caf50;
            font-weight: 700;
            margin-left: 0.25rem;
            font-size: 0.9em;
          }
        }

        &.damage-cell {
          font-weight: 600;
          color: var(--color-heading);
        }

        &.dps-cell {
          font-weight: 700;
          color: #2196f3;
          font-size: 1.05em;
        }
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

      .armor-input {
        width: 100%;
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
            .range-input {
              width: 80px;
            }
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
