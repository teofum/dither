export interface Item {
  id: string;
  name: string;
  checkIf?: { prop: string, value: string };
}

export interface Menu {
  id: string;
  name: string;
  items: MenuItem[];
}

type Divider = '---'
type MenuItem = Item | Menu | Divider;

interface MenuProps {
  root: string;
  items: MenuItem[];
  data?: { [key: string]: string };
  onSelect: (id: string) => void;
};

export default MenuProps;

export const isMenu = (item: MenuItem): item is Menu =>
  (item as Menu).items !== undefined;

export const isItem = (item: MenuItem): item is Item =>
  (item as Item).id !== undefined && (item as Menu).items === undefined;