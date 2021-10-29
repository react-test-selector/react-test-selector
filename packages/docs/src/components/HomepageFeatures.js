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
    title: 'Привычный синтаксис и обратная совемстимость',
    Svg: require('../../static/img/css.svg').default,
    description: (
      <>
        Селекторы по дереву React-компонентов можно писать в привычном виде с синтаксисом
        css-селекторов. Дерево react-компонентов является надмножеством dom-дерева, поэтому
        будут работать старые селекторы.
      </>
    ),
  },
  {
    title: 'Инстурментарий',
    Svg: require('../../static/img/tools-box.svg').default,
    description: (
      <>
        Расширение инструментов разрабочика для Google Chrome для упрощения отладки и написания селекторов.
        <br />
        <br />
        Coming soon.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
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
