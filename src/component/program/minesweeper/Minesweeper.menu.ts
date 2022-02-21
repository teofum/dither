import { Menu } from '../../ui/menu/Menu.props';

const mineMenus: Menu[] = [
  {
    id: 'game',
    name: 'Game',
    items: [
      {
        id: 'new',
        name: 'New'
      },
      {
        id: 'beginner',
        name: 'Beginner'
      },
      {
        id: 'intermediate',
        name: 'Intermediate'
      },
      {
        id: 'expert',
        name: 'Expert'
      },
      {
        id: 'exit',
        name: 'Exit'
      }
    ]
  }
];

export default mineMenus;