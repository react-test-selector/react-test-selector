require("dotenv")
// @ts-check
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'React Test Selector',
  tagline: 'Инструмент E2E-тестирования для поиска React-компонентов',

  url: 'https://react-test-selector.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'react-test-selector',
  projectName: 'react-test-selector.github.io',

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/react-test-selector/react-test-selector/tree/main/packages/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'React Test Selector',
        logo: {
          alt: 'React Test Selector Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'GettingStarted',
            position: 'left',
            label: 'Документация',
          },
          {
            href: 'https://www.npmjs.com/package/react-test-selector',
            label: 'npm',
            position: 'right',
          },
          {
            href: 'https://github.com/react-test-selector/react-test-selector/tree/main/packages/react-test-selector',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Документация',
            items: [
              {
                label: 'Быстрый старт',
                to: '/docs/GettingStarted',
              },
              {
                label: 'Примеры',
                to: '/docs/Examples/Examples',
              },
              {
                label: 'Справочник API',
                to: '/docs/ApiReference/QuerySelector',
              },
            ],
          },
          {
            title: 'Поддержка',
            items: [
              {
                label: 'Slack',
                href: 'https://join.slack.com/t/react-test-selector/shared_invite/zt-yespj9v8-vjWI45lJ7ln4iHMgJQE3rw',
              },
              {
                label: 'Telegram',
                href: 'https://t.me/joinchat/KzF8Y4ds2i5kMDU6',
              },
            ],
          },
          {
            title: 'Код',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/react-test-selector',
              },
              {
                label: 'npm',
                href: 'https://www.npmjs.com/package/react-test-selector',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()}. Eugene Tihonov`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
