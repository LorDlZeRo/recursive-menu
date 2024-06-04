<script setup lang="ts">
import { Ref, ref, onMounted } from "vue";
import axios from "axios";
import { NewItem } from "../types/interfaces";
import {
  deleteRelatedElementsById,
  getDataById,
  setHasChildrenTrue,
  setLevel,
  setClickedTrue,
} from "../helpers/helpers";

const url: string = "https://64b4c8450efb99d862694609.mockapi.io/tree/items";
const loading: Ref<boolean> = ref(true);
const items: Ref<NewItem[]> = ref([]);
const error: Ref<string | null> = ref(null);
const filteredItems: Ref<NewItem[]> = ref([]);

const fetchItems = async (url: string): Promise<NewItem[] | undefined> => {
  try {
    const response = await axios.get<NewItem[]>(url);

    const newData = response.data.map((element) => ({
      ...element,
      isOpened: !element.parent_id,
      isClicked: false,
      isDeepest: false,
      level: 1,
    }));

    return newData as NewItem[];
  } catch (err) {
    error.value = "Ошибка при загрузке данных";
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  items.value = await fetchItems(url);
  filteredItems.value = getDataById(items.value, null);
});

const openChildMenu = (event: MouseEvent): void => {
  const target = event.currentTarget as HTMLButtonElement;
  const { id } = target;
  const dataIndex = target.getAttribute("data-index") || "0";
  const dataLevel = parseInt(target.getAttribute("data-level") ?? "0");

  const data = getDataById(items.value, id);
  const hasChildren = setHasChildrenTrue(data, items.value);
  const dataWithLevel = setLevel(hasChildren, dataLevel);

  filteredItems.value.splice(parseInt(dataIndex) + 1, 0, ...dataWithLevel);
  filteredItems.value = setClickedTrue(filteredItems.value, id);
};

const closeMenu = (event: MouseEvent): void => {
  const target = event.currentTarget as HTMLButtonElement;
  const { id } = target;
  filteredItems.value = deleteRelatedElementsById(filteredItems.value, id);
  filteredItems.value = setClickedTrue(filteredItems.value, id);
};
</script>
<template>
  <v-toolbar color="cyan-lighten-1">
      <v-btn icon="mdi-menu" variant="text"></v-btn>
      <v-toolbar-title>List OF titiles</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-magnify" variant="text"></v-btn>
    </v-toolbar>
    <template v-if="loading">
      <v-progress-circular class="mx-10 py-10" indeterminate></v-progress-circular>
    </template>
    <template v-else>
      <MenuItems :openChildMenu="openChildMenu" :closeMenu="closeMenu" :filteredItems="filteredItems" :loading="loading" />
    </template>
</template>
