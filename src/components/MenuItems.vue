<script setup lang="ts" generic="T extends NewItem">
import { NewItem } from "../types/interfaces";

const props = defineProps<{
    filteredItems: T[];
    openChildMenu?: (event: MouseEvent) => void;
    closeMenu?: (event: MouseEvent) => void;
  }>();
</script>
<template>
  <v-list lines="one">
    <v-list-item
    class="primary"
      v-for="(item, index) in props.filteredItems"
      :style="{ paddingLeft: 20 * item.level + 'px',
       backgroundColor: item.parent_id === null ? 'grey' : (index % 2 ? 'white' : 'rgba(108, 198, 201, 0.404)')
       }"
    >
      <v-btn
        v-if="!item.isDeepest"
        @click="
          (event: MouseEvent): void => (!item.isClicked ? openChildMenu(event) : closeMenu(event))
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
    </v-list-item>
  </v-list>
</template>
