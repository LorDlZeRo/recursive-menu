import { NewItem } from "../types/interfaces";

export const deleteRelatedElementsById = (
  data: NewItem[],
  id: string | number
): NewItem[] => {
  const deleteRecursive = (dataArray: NewItem[], parentId: string | number) => {
    const filteredArray = dataArray.filter((element) => {
      if (element.parent_id === parentId) {
        deleteRecursive(dataArray, element.id);
        return false;
      }
      return true;
    });
    return filteredArray;
  };

  const markedForDeletion: (string | number)[] = [];
  const findDescendants = (dataArray: NewItem[], parentId: string | number) => {
    const children = dataArray.filter(
      (element) => element.parent_id === parentId
    );
    children.forEach((child) => {
      markedForDeletion.push(child.id);
      findDescendants(dataArray, child.id);
    });
  };
  findDescendants(data, id);

  const filteredData = data.filter(
    (element) => !markedForDeletion.includes(element.id)
  );

  return filteredData;
};

export const getDataById = (
  data: NewItem[],
  id: string | number | null
): NewItem[] => data.filter((element) => element.parent_id === id);

export const setHasChildrenTrue = (data, items) => {
  return data.map((element) => {
    const children = getDataById(items, element.id);
    if (children.length > 0) {
      return { ...element, isDeepest: false };
    }
    return { ...element, isDeepest: true };
  });
}

export const setLevel = (data, level) => {
  const dataWithLevel = data.map((element) => ({
    ...element,
    level: level + 1,
  }));
  return dataWithLevel
}

export const setClickedTrue = (data, id) => {
  const dataWithClickedTrue = data.map((item) => {
  if (item.id === id) {
    return { ...item, isClicked: !item.isClicked };
  }
  return item;
});
return dataWithClickedTrue
}