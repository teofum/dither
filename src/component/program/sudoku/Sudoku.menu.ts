import { Menu } from '../../ui/menu/Menu.props';

const sudokuMenus: Menu[] = [
  {
    id: 'game',
    name: 'Game',
    items: [
      {
        id: 'new',
        name: 'New'
      },

      '---',
      
      {
        id: 'easy',
        name: 'Easy',
        checkIf: { prop: 'game/difficulty', value: 'easy' }
      },
      {
        id: 'medium',
        name: 'Medium',
        checkIf: { prop: 'game/difficulty', value: 'medium' }
      },
      {
        id: 'hard',
        name: 'Hard',
        checkIf: { prop: 'game/difficulty', value: 'hard' }
      },

      '---',
      
      {
        id: 'mouse',
        name: 'Mouse Controls',
        checkIf: { prop: 'game/mouse', value: 'true' }
      },

      '---',
      
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
        id: 'annotations',
        name: 'Annotations',
        checkIf: { prop: 'view/annotations', value: 'true' }
      },
      {
        id: 'highlight',
        name: 'Highlight Neighbors',
        checkIf: { prop: 'view/highlight', value: 'true' }
      },
      {
        id: 'warnings',
        name: 'Highlight Conflicts',
        checkIf: { prop: 'view/warnings', value: 'true' }
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
      {
        id: 'controls',
        name: 'Show Controls'
      }
    ]
  }
];

export default sudokuMenus;