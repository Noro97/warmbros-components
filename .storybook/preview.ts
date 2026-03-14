import type { Preview } from '@storybook/react';
import { parameters as docsParams } from '@storybook/addon-docs/preview';

const preview: Preview = {
  parameters: {
    ...docsParams,
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
