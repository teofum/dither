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
        id: 'exit',
        name: 'Exit'
      }
    ]
  }
];

export default sudokuMenus;