<script setup lang="ts" generic="T extends NewItem, U extends Item">
import { Ref, ref, onMounted } from "vue";
import axios from "axios";
import { NewItem, Item } from "../types/interfaces";
import {
  addAdditionalProperties,
  deleteRelatedElementsById,
  filterDataById,
  setIsDeepest,
  setLevel,
  setIsClicked,
} from "../helpers/helpers";

const url: string = "https://64b4c8450efb99d862694609.mockapi.io/tree/items";
const loading: Ref<boolean> = ref(true);
const items: Ref<T[]> = ref([]);
const error: Ref<string | null> = ref(null);
const filteredItems: Ref<T[] | []> = ref([]);

const fetchItems = async (url: string): Promise<U[] | undefined> => {
  try {
    return (await axios.get<U[]>(url)).data;
  } catch (err) {
    error.value = "Ошибка при загрузке данных";
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  const responseData = await fetchItems(url);  
  if (responseData) {
    items.value = addAdditionalProperties(responseData);
    filteredItems.value = filterDataById(items.value, null);
  }
});

const openChildMenu = (event: MouseEvent): void => {
  const target = event.currentTarget as HTMLButtonElement;
  const { id } = target;
  const dataIndex = target.getAttribute("data-index") || "0";
  const dataLevel = parseInt(target.getAttribute("data-level") ?? "0");

  const fileteredData = filterDataById(items.value, id);
  const dataWithIsDeepestFlag = setIsDeepest(fileteredData, items.value);
  const dataWithLevel = setLevel(dataWithIsDeepestFlag, dataLevel);

  filteredItems.value.splice(parseInt(dataIndex) + 1, 0, ...dataWithLevel);
  filteredItems.value = setIsClicked(filteredItems.value, id);
};

const closeMenu = (event: MouseEvent): void => {
  const target = event.currentTarget as HTMLButtonElement;
  const { id } = target;
  filteredItems.value = deleteRelatedElementsById(filteredItems.value, id);
  filteredItems.value = setIsClicked(filteredItems.value, id);
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
