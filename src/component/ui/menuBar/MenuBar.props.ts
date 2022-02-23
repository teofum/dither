import { Menu } from '../menu/Menu.props';

interface MenuBarProps {
  menus: Menu[];
  data?: { [key: string]: string };
  onSelect: (id: string) => void;
}

export default MenuBarProps;