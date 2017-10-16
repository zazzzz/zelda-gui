import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import { Button, Icon, Modal } from 'antd';

import styles from './Project.css';

const confirm = Modal.confirm;

const antStyles = {
  back: {
    height: '30px',
    padding: '0px',
    border: 'none'
  },
  add: {
    height: '30px',
    float: 'right',
    marginLeft: '10px'
  },
  delete: {
    position: 'absolute',
    right: '10px',
    top: '10px'
  }
};

class Project extends PureComponent {
  static propTypes = {};

  static defaultProps = {};

  static contextTypes = {
    router: PropTypes.any
  };

  state = {
    list: []
  };

  componentDidMount() {
    const plist = window.readStore('plist');
    this.setState({
      list: plist
    });
  }

  openProject = proj => {
    this.context.router.history.push({
      pathname: 'operate',
      query: { ...proj }
    });
  };

  create = () => {
    this.context.router.history.push({
      pathname: 'zelda'
    });
  };

  addProject = () => {
    const dir = window.handleSelectFolder();

    if (dir && dir.length) {
      const pwd = dir[0];
      const idx = pwd.lastIndexOf('/');
      const dest = pwd.slice(0, idx);
      const name = pwd.slice(idx + 1);

      const oldList = window.readStore('plist');

      if (oldList.filter(t => t.dest === dest && t.name === name).length) {
        return false;
      } else {
        const newList = [
          ...oldList,
          {
            name,
            dest
          }
        ];

        window.writeStore('plist', newList);

        this.setState({
          list: newList
        });
      }
    }
  };

  delProject = (e, proj) => {
    e.stopPropagation();

    const storedList = window.readStore('plist');

    const newList = storedList.filter(
      t => t.dest !== proj.dest || t.name !== proj.name
    );

    window.writeStore('plist', newList);

    this.setState({
      list: newList
    });

    this.showDelete(proj);
  };

  showDelete = proj => {
    const path = `${proj.dest}/${proj.name}`;

    confirm({
      title: '是否同时删除对应文件夹',
      content: path,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        window.handleRemovePath(path);
      }
    });
  };

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.head}>
          <Link className={styles.link} to="/">
            <Button style={antStyles.back}>
              <Icon type="left" />首页
            </Button>
          </Link>
          <Button
            type="primary"
            style={antStyles.add}
            onClick={this.addProject}
          >
            添加目录
          </Button>
          <Button type="primary" style={antStyles.add} onClick={this.create}>
            创建应用
          </Button>
        </div>
        <div className={styles.content}>
          {this.state.list.map(t => (
            <div
              key={`${t.dest}/${t.name}`}
              className={styles.project}
              onClick={() => this.openProject(t)}
            >
              <p className={styles.name}>
                {t.name}
                {t.type && <span className={styles.type}>{t.type}</span>}
              </p>
              <p className={styles.dest}>
                {t.dest}/{t.name}
              </p>
              <Button
                shape="circle"
                icon="delete"
                style={antStyles.delete}
                className={styles.delete}
                onClick={e => this.delProject(e, t)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Project;
