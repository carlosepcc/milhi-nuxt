<template>
    <u-button size="xl" class="fixed bottom-24 right-4  active:scale-95 active:translate-y-1 active:shadow-primary-200 transition-transform shadow-lg" :icon="icon"></u-button>
</template>
<script setup lang="ts">
interface ButtonFabProps {
    icon?: string
}
withDefaults(defineProps<ButtonFabProps>(), {
    icon: 'material-symbols:add',
})
</script>