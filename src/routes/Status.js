import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import { Button } from 'antd';
import throttle from 'lodash.throttle';

import defaultRoadhogrc from 'utils/roadhogrc';

import styles from './Status.css';

const antStyles = {
  btn: {
    width: '100px',
    height: '30px'
  }
};

const scrollDown = throttle(() => {
  document.getElementById('st-content').scrollTop = 10000;
}, 200);

class Status extends PureComponent {
  static propTypes = {};

  static defaultProps = {};

  static contextTypes = {
    router: PropTypes.any
  };

  state = {
    list: []
  };

  componentDidMount() {
    const config = this.props.location.query;
    if (config && config.dest) {
      window.addConsoleListener(output => {
        this.onAddList(output);
      });

      const isZatlas = config.zatlas && config.zcfg;

      if (isZatlas) {
        window.initZatlas(config);
      } else {
        window.initZelda(config);
      }

      if (config.roadhogx) {
        const roadhogrc = Object.assign(defaultRoadhogrc, {
          pwa: config.pwa
        });

        window.setTimeout(() => {
          window.writeFile({
            directory: `${config.dest}/${config.name}`,
            fileName: '.roadhogrc.js',
            data: 'module.exports = ' + JSON.stringify(roadhogrc)
          });
        }, 3000);
      }

      const oldList = window.readStore('plist');

      if (
        oldList.filter(t => t.dest === config.dest && t.name === config.name)
          .length
      ) {
        return false;
      } else {
        const newList = [
          ...oldList,
          {
            name: config.name,
            dest: config.dest,
            type: isZatlas ? 'zatlas' : 'zelda'
          }
        ];

        window.writeStore('plist', newList);
      }
    }
  }

  componentWillUnmount() {
    window.rmConsoleListener();
  }

  onAddList = output => {
    const news = {
      timestamp: `${new Date().valueOf()} ${Math.floor(
        Math.random() * 100000
      )}`,
      val: output
    };

    this.setState(
      {
        list: [...this.state.list, news]
      },
      scrollDown
    );
  };

  onNext = () => {
    const config = this.props.location.query;
    if (config && config.dest) {
      this.context.router.history.push({
        pathname: 'operate',
        query: config
      });
    }
  };

  render() {
    const config = this.props.location.query;

    if (!config || !config.dest) {
      this.context.router.history.push({
        pathname: '/'
      });

      return null;
    }

    const isZatlas = config.zatlas && config.zcfg;

    return (
      <div className={styles.root}>
        <div className={styles.title}>
          Creating a {isZatlas ? 'Zatlas' : 'Zelda'} App
        </div>
        <div className={styles.content} id="st-content">
          {this.state.list.map(t => (
            <pre key={t.timestamp} className={styles.line}>{`${t.val}`}</pre>
          ))}
        </div>
        <div className={styles.action}>
          <Link to="/project">
            <Button style={antStyles.btn}>应用管理</Button>
          </Link>
          <Button type="primary" style={antStyles.btn} onClick={this.onNext}>
            下一步
          </Button>
        </div>
      </div>
    );
  }
}

export default Status;
