import md_home from '../../../../assets/help_pages/home.md?raw';
import md_basics from '../../../../assets/help_pages/basics.md?raw';
import md_about from '../../../../assets/help_pages/about.md?raw';
import md_credits from '../../../../assets/help_pages/about/credits.md?raw';
import md_programs from '../../../../assets/help_pages/programs.md?raw';
import md_dlab from '../../../../assets/help_pages/program/ditherLab.md?raw';
import md_dlab_ui from '../../../../assets/help_pages/program/ditherLab/ui.md?raw';
import md_dlab_settings from '../../../../assets/help_pages/program/ditherLab/settings.md?raw';
import md_dlab_palettes from '../../../../assets/help_pages/program/ditherLab/settings/palettes.md?raw';
import md_dlab_process from '../../../../assets/help_pages/program/ditherLab/process.md?raw';
import md_dlab_error from '../../../../assets/help_pages/program/ditherLab/process/error.md?raw';
import md_dlab_cpo from '../../../../assets/help_pages/program/ditherLab/process/bayer.md?raw';
import md_dlab_pattern from '../../../../assets/help_pages/program/ditherLab/process/pattern.md?raw';
import md_how from '../../../../assets/help_pages/how.md?raw';
import md_how_font from '../../../../assets/help_pages/how/font.md?raw';

export interface HelpItem {
  id: string;
  name: string;
  content: string;
  children?: HelpItem[];
}

export const flattenPages = (root: HelpItem): HelpItem[] => {
  let flat = [root];
  root.children?.forEach(child =>
    flat = flat.concat(flattenPages(child)));

  return flat.map(i => ({ ...i, content: '' }));
};

const helpPages: HelpItem = {
  id: 'help',
  name: 'Help Pages',
  content: md_home,
  children: [
    {
      id: 'help/about',
      name: 'About DitherOS',
      content: md_about,
      children: [
        {
          id: 'help/about/credits',
          name: 'Credits',
          content: md_credits
        }
      ]
    },
    {
      id: 'help/basics',
      name: 'DitherOS Basics',
      content: md_basics
    },
    {
      id: 'help/programs',
      name: 'Programs',
      content: md_programs,
      children: [
        {
          id: 'help/programs/dlab',
          name: 'DitherLab',
          content: md_dlab,
          children: [
            {
              id: 'help/programs/dlab/ui',
              name: 'User Interface',
              content: md_dlab_ui
            },
            {
              id: 'help/programs/dlab/settings',
              name: 'Settings',
              content: md_dlab_settings,
              children: [
                {
                  id: 'help/programs/dlab/settings/palettes',
                  name: 'Palette Editor',
                  content: md_dlab_palettes
                }
              ]
            },
            {
              id: 'help/programs/dlab/process',
              name: 'Programs',
              content: md_dlab_process,
              children: [
                {
                  id: 'help/programs/dlab/process/errord',
                  name: 'Error Diffusion',
                  content: md_dlab_error
                },
                {
                  id: 'help/programs/dlab/process/cpo',
                  name: 'Color Pair Ordered',
                  content: md_dlab_cpo
                },
                {
                  id: 'help/programs/dlab/process/pattern',
                  name: 'Pattern Dithering',
                  content: md_dlab_pattern
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'help/how',
      name: 'How it works',
      content: md_how,
      children: [
        {
          id: 'help/how/font',
          name: 'Pixel perfect fonts',
          content: md_how_font
        }
      ]
    }
  ]
};

export default helpPages;