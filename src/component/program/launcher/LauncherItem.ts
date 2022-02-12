import { WindowTemplate } from '../../ui/window/Window.props';

interface LauncherItem {
  id: string;
  display: string;
  iconUrl: string;
  template: WindowTemplate;
}

export default LauncherItem;