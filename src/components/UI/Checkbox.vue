<template>
  <label class="ui-checkbox" :class="{ 'ui-checkbox--disabled': disabled }">
    <input
      class="ui-checkbox__input"
      type="checkbox"
      :id="id"
      :disabled="disabled"
      :checked="isChecked"
      @change="handleChange"
    />
    <span class="ui-checkbox__label">
      <slot></slot>
    </span>
  </label>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: [Boolean, Array],
    required: true,
  },
  value: {
    type: [String, Number, Boolean],
    default: true,
  },
  id: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value);
  }
  return Boolean(props.modelValue);
});

const handleChange = (event) => {
  if (Array.isArray(props.modelValue)) {
    const next = event.target.checked
      ? [...props.modelValue, props.value]
      : props.modelValue.filter((item) => item !== props.value);
    emit("update:modelValue", next);
    emit("change", event);
    return;
  }

  emit("update:modelValue", event.target.checked);
  emit("change", event);
};
</script>

<style lang="scss" scoped>
.ui-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  cursor: pointer;
  user-select: none;
  color: var(--color-text);

  &__input {
    width: 1.05rem;
    height: 1.05rem;
    cursor: pointer;
    accent-color: var(--color-border-hover);
  }

  &__label {
    font-size: 0.9rem;
    line-height: 1.2;
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;

    .ui-checkbox__input {
      cursor: not-allowed;
    }
  }
}
</style>
