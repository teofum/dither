import PaletteGroup from './PaletteGroup';
import PaletteType from './PaletteType';

interface Palette {
  name: string;
  readonly type: PaletteType;
  readonly group: PaletteGroup;
  data: number[];
}

export default Palette;