import { NewItem, Item } from "../types/interfaces";

export const addAdditionalProperties = <T extends Item[], U extends NewItem[]>  (data: T): U => {
    const newData = data.map((element) => ({
      ...element,
      isOpened: !element.parent_id,
      isClicked: false,
      isDeepest: false,
      level: 1,
    }));

return newData as U
}

export const deleteRelatedElementsById = <T extends NewItem, U extends string | number> (
  data: T[],
  id: U
): T[] => {
  const markedForDeletion: (string | number)[] = [];
  const findDescendants = <Z extends string | number> (dataArray: T[], parentId: Z): void => {
    const children = dataArray.filter(element => element.parent_id === parentId);

    children.forEach(child => {
      markedForDeletion.push(child.id);
      findDescendants(dataArray, child.id);
    });
  };
  findDescendants(data, id);
  const filteredData = data.filter(element => !markedForDeletion.includes(element.id));
  return filteredData as T[];
};

export const filterDataById = <
  T extends NewItem[],
  U extends string | number | null
>(
  data: T,
  id: U
): T => data.filter((element) => element.parent_id === id) as T;

export const setIsDeepest = <T extends NewItem[]>(
  filteredItems: T,
  allItems: T
): T => {
  return filteredItems.map((element) => {
    const children = filterDataById(allItems, element.id);
    if (children.length > 0) {
      return { ...element, isDeepest: false };
    }
    return { ...element, isDeepest: true };
  }) as T;
};

export const setLevel = <T extends NewItem[]>(data: T, level: number): T => {
  const dataWithLevel = data.map((element) => ({
    ...element,
    level: level + 1,
  }));
  return dataWithLevel as T;
};

export const setClicked = <T extends NewItem[], U extends string | number>(
  data: T,
  id: U
): T => {
  const dataWithClickedTrue = data.map((item) => {
    if (item.id === id) {
      return { ...item, isClicked: !item.isClicked };
    }
    return item;
  });
  return dataWithClickedTrue as T;
};
