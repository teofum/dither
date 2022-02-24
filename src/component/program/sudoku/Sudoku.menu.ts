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
      {
        id: 'assists',
        name: 'Assists',
        items: [
          {
            id: 'annotations',
            name: 'Allow Annotations',
            checkIf: { prop: 'assists/annotations', value: 'true' }
          },
          {
            id: 'highlight',
            name: 'Highlight Neighbors',
            checkIf: { prop: 'assists/highlight', value: 'true' }
          },
          {
            id: 'warnings',
            name: 'Highlight Conflicts',
            checkIf: { prop: 'assists/warnings', value: 'true' }
          }
        ]
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