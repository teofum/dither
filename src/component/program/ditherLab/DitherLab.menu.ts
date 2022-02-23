import { Menu } from '../../ui/menu/Menu.props';

const dlabMenus: Menu[] = [
  {
    id: 'file',
    name: 'File',
    items: [
      {
        id: 'open',
        name: 'Open Image...'
      },
      {
        id: 'save',
        name: 'Save Render'
      },
      {
        id: 'exit',
        name: 'Exit'
      }
    ]
  },
  {
    id: 'view',
    name: 'View',
    items: [
      {
        id: 'zoom',
        name: 'Zoom',
        items: [
          {
            id: 'in',
            name: 'Zoom In'
          },
          {
            id: 'out',
            name: 'Zoom Out'
          },
          {
            id: 'reset',
            name: 'Actual Size'
          }
        ]
      },
      {
        id: 'togglePaletteEditor',
        name: 'Palette Editor',
        checkIf: { prop: 'view/editor', value: 'true' }
      }
    ]
  },
  {
    id: 'help',
    name: 'Help',
    items: [
      {
        id: 'help',
        name: 'Open Help Pages'
      },
      /* {
        id: 'about',
        name: 'About DitherLab'
      } */
    ]
  }
];

export default dlabMenus;