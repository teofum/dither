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
        name: 'Easy'
      },
      {
        id: 'medium',
        name: 'Medium'
      },
      {
        id: 'hard',
        name: 'Hard'
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