<template>
  <button
    :type="type"
    :class="['ui-button', `ui-button--${variant}`, { 'ui-button--full-width': fullWidth }]"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: "button",
    validator: (value) => ["button", "submit", "reset"].includes(value),
  },
  variant: {
    type: String,
    default: "default",
    validator: (value) => ["default", "primary", "secondary", "danger"].includes(value),
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

const handleClick = (event) => {
  emit("click", event);
};
</script>

<style lang="scss" scoped>
.ui-button {
  padding: 0.75rem 1.5rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: var(--color-background-mute);
    border-color: var(--color-border-hover);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--full-width {
    width: 100%;
  }

  &--primary {
    background: var(--color-primary, #2196f3);
    border-color: var(--color-primary, #2196f3);
    color: white;

    &:hover {
      background: var(--color-primary-hover, #1976d2);
      border-color: var(--color-primary-hover, #1976d2);
    }
  }

  &--secondary {
    background: var(--color-background-soft);
    border-color: var(--color-border);

    &:hover {
      background: var(--color-background-mute);
    }
  }

  &--danger {
    background: var(--color-danger, #f44336);
    border-color: var(--color-danger, #f44336);
    color: white;

    &:hover {
      background: var(--color-danger-hover, #d32f2f);
      border-color: var(--color-danger-hover, #d32f2f);
    }
  }
}
</style>

