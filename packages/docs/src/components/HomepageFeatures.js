import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Простое подключение',
    Svg: require('../../static/img/rocket.svg').default,
    description: (
      <>
        Для запуска не требуется никакой специальной сборки проекта или подключения
        дополнительных скриптов.
      </>
    ),
  },
  {
    title: 'Привычный синтаксис',
    Svg: (
      () => <svg
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
        className={styles.cssFeatureSvg}>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10">
          <path d="M1.5.5L2.684 14 8 15.5l5.314-1.499L14.5.5z"/>
          <path d="M4.5 3.5h7L11 11l-3 1-3-1v-1M11.23 7.5H4.62"/>
        </g>
      </svg>
    ),
    description: (
      <>
        Селекторы по дереву React-компонентов построены на базе привычного синтаксиса
        css-селекторов.
      </>
    ),
  },
  {
    title: 'Инстурментарий',
    Svg: require('../../static/img/tools-box.svg').default,
    description: (
      <>
        Расширение инструментов разрабочика для Google Chrome для упрощения отладки и написания селекторов.
        <br/>
        <br/>
        <a href="https://chrome.google.com/webstore/detail/react-test-selectors-exte/idkhibimkohnbdblccblmbjooacpbieg"
           target="_blank">Открыть в chrome web store</a>.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title}/>
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
