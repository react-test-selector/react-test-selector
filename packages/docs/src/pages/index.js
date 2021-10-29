import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="#GetStarted">
            Подключить и начать использовать
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
      <main className={clsx(styles.steps)}>
        <div className={clsx(styles.contentWrapper)}>
          <h2 id="GetStarted">Шаг 1. Добавить библиотеку в браузер</h2>
          <div>
            <p>Библиотека представляет собой скрипт, которые добавляет в глобальное пространство объект rts c функцией querySelector.</p>
            <p>Для этого необходимо выполнит скрипт, которые можно загрузить со <a href="https://github.com/react-test-selector/react-test-selector/releases" target="_blank">страницы релизов на GitHub</a></p>
            <p>Для наглядности содержимое скрипта можно просто скопировать в консоль разработчика и выполнить.</p>
          </div>
        </div>
      </main>
      <main className={clsx(styles.stepsOdd)}>
        <div className={clsx(styles.contentWrapper)}>
          <h2 id="GetStarted">Шаг 2. Вопользовать функцией rts.querySelector</h2>
          <div>
            <p>Например <code>rts.querySelector("TitlePage Input")</code> наёдет все компоненты <code>Input</code> внутри компонента TitlePage.</p>
            <p>
              Функция возвращает объект ReactTestSelectorResult c функциями <code>getDomElement</code>, <code>getDomElements</code>, <code>at</code> и <code>getProps</code>.
            </p>

          </div>
        </div>
      </main>
    </Layout>
  );
}
