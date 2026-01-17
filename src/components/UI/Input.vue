<template>
  <input
    :id="id"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :min="min"
    :max="max"
    :step="step"
    :class="['ui-input', { 'ui-input--number': type === 'number' }]"
    @input="handleInput"
    @blur="handleBlur"
  />
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: "text",
    validator: (value) => ["text", "number", "email", "password"].includes(value),
  },
  id: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  min: {
    type: [Number, String],
    default: undefined,
  },
  max: {
    type: [Number, String],
    default: undefined,
  },
  step: {
    type: [Number, String],
    default: undefined,
  },
});

const emit = defineEmits(["update:modelValue", "blur"]);

const handleInput = (event) => {
  const value = props.type === "number" 
    ? (event.target.value === "" ? null : Number(event.target.value))
    : event.target.value;
  emit("update:modelValue", value);
};

const handleBlur = (event) => {
  emit("blur", event);
};
</script>

<style lang="scss" scoped>
.ui-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  transition: border-color 0.2s;
  width: 100%;

  &:focus {
    outline: none;
    border-color: var(--color-border-hover);
  }

  &::placeholder {
    color: var(--color-text-muted, rgba(255, 255, 255, 0.5));
  }

  &--number {
    // Remove arrows for number inputs
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[type="number"] {
      -moz-appearance: textfield;
      appearance: textfield;
    }
  }
}
</style>

