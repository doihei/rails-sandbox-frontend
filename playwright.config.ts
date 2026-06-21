import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
  },
  projects: [
    {
      name: 'a11y',
      testMatch: 'tests/a11y/**/*.spec.ts',
      use: { browserName: 'chromium' },
    },
    {
      name: 'vrt',
      testMatch: 'tests/vrt/**/*.spec.ts',
      use: {
        browserName: 'chromium',
        // ビューポートを固定（サイズが変わると差分が出るため必須）
        viewport: { width: 1280, height: 720 },
        // アニメーションを無効化（動きがあると差分が出るため必須）
        launchOptions: {
          args: ['--force-prefers-reduced-motion', ],
        },
      },
    },
  ],
  // スクリーンショットの保存先（プロジェクト・OS 別に管理してクロスプラットフォームの差分を防ぐ）
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}-{projectName}-{platform}{ext}',
})
