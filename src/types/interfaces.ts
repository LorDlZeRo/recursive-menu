export interface Item {
  id: number | string;
  parent_id: string | number | null;
  title: string;
}

export interface NewItem extends Item {
  isOpened: boolean;
  isClicked: boolean;
  isDeepest: boolean;
  level: number;
}
