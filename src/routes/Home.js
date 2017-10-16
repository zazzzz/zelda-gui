import React from 'react';
import { Link } from 'dva/router';
import { Button } from 'antd';

import pkg from '../../package.json';
import styles from './Home.css';

const antStyles = {
  btn: {
    width: '100px',
    height: '30px'
  }
};

function Home() {
  return (
    <div className={styles.root}>
      <div className={styles.pic} />
      <h1 className={styles.title}>Zelda GUI</h1>
      <div className={styles.action}>
        <Link to="/zelda">
          <Button style={antStyles.btn}>创建应用</Button>
        </Link>
        <Link to="/project">
          <Button style={antStyles.btn}>应用管理</Button>
        </Link>
      </div>
      <div className={styles.version}>
        <span className={styles.ver}>
          zelda-cli:
          <em className={styles.highlight}>
            {pkg.dependencies['zelda-cli'].slice(1)}
          </em>
        </span>
        <span className={styles.ver}>
          roadhogx:
          <em className={styles.highlight}>
            {pkg.devDependencies.roadhogx.slice(1)}
          </em>
        </span>
      </div>
    </div>
  );
}

export default Home;
