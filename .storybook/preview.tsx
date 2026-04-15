import type { Preview } from '@storybook/react';
import { parameters as docsParams } from '@storybook/addon-docs/preview';
import './preview.css';

const preview: Preview = {
  parameters: {
    ...docsParams,
    backgrounds: {
      default: 'warmbros',
      values: [
        { name: 'warmbros', value: '#0a0a1a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="wb-theme wb-story">
        <Story />
      </div>
    ),
  ],
};

export default preview;
