import { Menu } from '../menu/Menu.props';

interface MenuBarProps {
  menus: Menu[];
  onSelect: (id: string) => void;
}

export default MenuBarProps;