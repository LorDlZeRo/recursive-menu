<script setup lang="ts">
import { withDefaults } from "vue";
import { NewItem } from "../types/interfaces";

const props = withDefaults(
  defineProps<{
    filteredItems: NewItem[];
    openChildMenu?: (event: MouseEvent) => void;
    closeMenu?: (event: MouseEvent) => void;
  }>(),
  {}
);
</script>
<template>
  <ul>
    <li
      v-for="(item, index) in props.filteredItems"
      :style="{ paddingLeft: 20 * item.level + 'px',
       backgroundColor: item.parent_id === null ? 'grey' : (index % 2 ? 'rgba(108, 198, 201, 0.404)' : 'white')
       }"
    >
      <v-btn
        v-if="!item.isDeepest"
        @click="
          (event) => (!item.isClicked ? openChildMenu(event) : closeMenu(event))
        "
        density="compact"
        :id="item.id"
        :data-index="index"
        :data-level="item.level"
        icon="mdi-plus"
        size="small"
        class="mr-2"
      >
        <span v-if="item.isClicked">-</span>
        <span v-else>+</span>
      </v-btn>
      <v-btn
        v-else
        :disabled="true"
        density="compact"
        class="mr-2"
        icon="mdi-minus"
        size="small"
      >
        <span>-</span>
      </v-btn>
      <span :class="item.parent_id === null && 'text-white'">{{ item.title }}</span>
    </li>
  </ul>
</template>
