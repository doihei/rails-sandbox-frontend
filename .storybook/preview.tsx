import type { Preview } from '@storybook/nextjs-vite'
import { ThemeProvider, IntlProvider, createTheme } from 'smarthr-ui'
import React from 'react'

const theme = createTheme()

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <IntlProvider locale="ja">
          <div style={{ padding: "24px", maxWidth: 720 }}>
            <Story />
          </div>
        </IntlProvider>
      </ThemeProvider>
    ),
  ],
  parameters: {
    a11y: {
      // addon-a11y の設定をここに書く
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
        ],
      },
    },
  },
}

export default preview
