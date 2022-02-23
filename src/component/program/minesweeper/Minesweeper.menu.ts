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
        name: 'Beginner',
        checkIf: { prop: 'game/difficulty', value: 'beginner' }
      },
      {
        id: 'intermediate',
        name: 'Intermediate',
        checkIf: { prop: 'game/difficulty', value: 'intermediate' }
      },
      {
        id: 'expert',
        name: 'Expert',
        checkIf: { prop: 'game/difficulty', value: 'expert' }
      },
      {
        id: 'exit',
        name: 'Exit'
      }
    ]
  }
];

export default mineMenus;