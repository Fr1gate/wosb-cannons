import { createI18n } from "vue-i18n";

const messages = {
  ru: {
    pages: {
      dps: {
        title: "Калькулятор DPS",
      },
    },
    dps: {
      inputs: {
        targetArmor: "Броня цели:",
        targetHp: "HP цели:",
        cannonsPerSide: "Пушек с борта:",
      },
      placeholders: {
        targetArmor: "Введите броню цели",
        targetHp: "Введите HP цели",
        cannonsPerSide: "Введите кол-во пушек",
        search: "Введите название орудия...",
      },
      buffs: {
        phosphorus: "Фосфор (+2 пробития)",
        blackPowder: "Черный двойной порох (+2.5 пробития)",
      },
      filters: {
        searchLabel: "Поиск по названию:",
        typeLabel: "Тип орудия:",
        showBombards: "Бомбарды",
        rangeMin: "Минимальная дальность:",
        min: "Мин",
        max: "Макс",
        reset: "Сбросить фильтры",
        boardingNoReload: "Абордаж без перезарядки",
      },
      results: {
        empty: "Нет результатов, соответствующих фильтрам",
        count: "Найдено: {found} из {total}",
      },
      table: {
        type: "Тип",
        name: "Название",
        guns: "Cтволы",
        penetration: "Пробитие",
        damagePerShot: "Урон за выстрел",
        reloadSeconds: "Перезарядка (сек)",
        dps: "Урон в минуту",
        range: "Дальность",
        broadsideDamage: "Урон за залп",
        broadsidesNeeded: "Кол-во залпов",
        bombard: "Бомбарда",
        boardingCandidate: "☠️",
      },
      types: {
        light: "Легкие",
        medium: "Средние",
        heavy: "Тяжелые",
        special: "Специальные",
        mortar: "Мортиры",
        lightSingle: "Легкая",
        mediumSingle: "Средняя",
        heavySingle: "Тяжелая",
        specialSingle: "Специальная",
        mortarSingle: "Мортира",
      },
      sections: {
        target: "Цель",
        filters: "Фильтры",
      },
    },
    menu: {
      dps: "Калькулятор DPS",
      boardingSim: "Симулятор абордажа",
    },
    language: {
      ru: "RU",
      en: "EN",
    },
  },
  en: {
    pages: {
      dps: {
        title: "DPS Calculator",
      },
    },
    dps: {
      inputs: {
        targetArmor: "Target armor:",
        targetHp: "Target HP:",
        cannonsPerSide: "Guns per side:",
      },
      placeholders: {
        targetArmor: "Enter target armor",
        targetHp: "Enter target HP",
        cannonsPerSide: "Enter guns count",
        search: "Enter cannon name...",
      },
      buffs: {
        phosphorus: "Phosphorus (+2 penetration)",
        blackPowder: "Double black powder (+2.5 penetration)",
      },
      filters: {
        searchLabel: "Search by name:",
        typeLabel: "Cannon type:",
        showBombards: "Bombards",
        rangeMin: "Minimum range:",
        min: "Min",
        max: "Max",
        reset: "Reset filters",
        boardingNoReload: "Boarding without reload",
      },
      results: {
        empty: "No results matching filters",
        count: "Found: {found} of {total}",
      },
      table: {
        type: "Type",
        name: "Name",
        guns: "Guns",
        penetration: "Penetration",
        damagePerShot: "Damage per shot",
        reloadSeconds: "Reload (sec)",
        dps: "DPS",
        range: "Range",
        broadsideDamage: "Broadside damage",
        broadsidesNeeded: "Broadsides needed",
        bombard: "Bombard",
        boardingCandidate: "☠️",
      },
      types: {
        light: "Light",
        medium: "Medium",
        heavy: "Heavy",
        special: "Special",
        mortar: "Mortars",
        lightSingle: "Light",
        mediumSingle: "Medium",
        heavySingle: "Heavy",
        specialSingle: "Special",
        mortarSingle: "Mortar",
      },
      sections: {
        target: "Target",
        filters: "Filters",
      },
    },
    menu: {
      dps: "DPS Calculator",
      boardingSim: "Boarding Simulator",
    },
    language: {
      ru: "RU",
      en: "EN",
    },
  },
};

export const i18n = createI18n({
  legacy: false,
  locale: "ru",
  fallbackLocale: "ru",
  messages,
});
