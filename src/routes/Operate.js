import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import { Button, Modal } from 'antd';
import throttle from 'lodash.throttle';

import GenForm from 'components/GenForm';

import styles from './Operate.css';

const antStyles = {
  btn: {
    width: '120px',
    height: '30px'
  }
};

const scrollDown = throttle(() => {
  document.getElementById('op-content').scrollTop = 10000;
}, 200);

class Operate extends PureComponent {
  static propTypes = {};

  static defaultProps = {};

  static contextTypes = {
    router: PropTypes.any
  };

  state = {
    list: [],
    title: '',
    type: '',
    visible: false,
    randomKey: 'modal',
    dev: 'start'
  };

  componentDidMount() {
    const config = this.props.location.query;
    if (config && config.dest) {
      window.addConsoleListener(output => {
        this.onAddList(output);
      });

      this.onAddList(`${config.dest}/${config.name}`);
    }
  }

  componentWillUnmount() {
    window.rmConsoleListener();

    this.rundev('stop');
  }

  onAddList = output => {
    const news = {
      timestamp: `${new Date().valueOf()} ${Math.floor(
        Math.random() * 100000
      )}`,
      val: output.trim()
    };

    this.setState(
      {
        list: [...this.state.list, news]
      },
      scrollDown
    );
  };

  onOpenFolder = () => {
    const config = this.props.location.query;
    if (config && config.dest) {
      window.handleOpenDirectory(config.dest);
    }
  };

  onCreate = data => {
    const config = this.props.location.query;
    if (config && config.dest) {
      window.generateFile({
        ...data,
        config
      });
    }
  };

  handleCancel = () => {
    this.setState({
      title: '',
      type: '',
      visible: false
    });
  };

  create = type => {
    this.setState({
      title: `generate ${type}`,
      type,
      visible: true,
      randomKey: `modal_${new Date().valueOf()}`
    });
  };

  runnpm = type => {
    const config = this.props.location.query;
    if (config && config.dest) {
      window.runNPM({
        type,
        dest: config.dest,
        name: config.name
      });
    }
  };

  rundev = type => {
    const config = this.props.location.query;
    if (config && config.dest) {
      window.runDev({
        type,
        dest: config.dest,
        name: config.name
      });

      const next = type === 'start' ? 'stop' : 'start';

      this.setState({
        dev: next
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

    return (
      <div className={styles.root}>
        <div className={styles.title}>{config.name}</div>
        <div className={styles.action}>
          <Link to="/">
            <Button style={antStyles.btn} icon="home">
              首页
            </Button>
          </Link>
          <Button
            type="primary"
            style={antStyles.btn}
            icon="folder-open"
            onClick={this.onOpenFolder}
          >
            打开目录
          </Button>
        </div>
        <div className={styles.action}>
          <Button
            style={antStyles.btn}
            className={styles.btn_green}
            icon="file-add"
            onClick={() => this.create('component')}
          >
            component
          </Button>
          <Button
            style={antStyles.btn}
            className={styles.btn_green}
            icon="file-add"
            onClick={() => this.create('model')}
          >
            model
          </Button>
        </div>
        <div className={styles.action}>
          <Button
            style={antStyles.btn}
            className={styles.btn_green}
            icon="file-add"
            onClick={() => this.create('service')}
          >
            service
          </Button>
          <Button
            style={antStyles.btn}
            className={styles.btn_green}
            icon="file-add"
            onClick={() => this.create('route')}
          >
            route
          </Button>
        </div>
        <div className={styles.action}>
          <Button
            style={antStyles.btn}
            className={styles.btn_yellow}
            icon="tool"
            onClick={() => this.runnpm('lint')}
          >
            lint
          </Button>
          <Button
            style={antStyles.btn}
            className={styles.btn_yellow}
            icon="tool"
            onClick={() => this.runnpm('format')}
          >
            format
          </Button>
        </div>
        <div className={styles.action}>
          <Button
            style={antStyles.btn}
            className={styles.btn_red}
            icon={
              this.state.dev === 'start' ? 'play-circle-o' : 'pause-circle-o'
            }
            onClick={() => this.rundev(this.state.dev)}
          >
            {this.state.dev}
          </Button>
          <Button
            style={antStyles.btn}
            className={styles.btn_red}
            icon="gift"
            onClick={() => this.runnpm('build')}
          >
            build
          </Button>
        </div>
        <Modal
          width={300}
          title={this.state.title}
          visible={this.state.visible}
          footer={null}
          onCancel={this.handleCancel}
          key={this.state.randomKey}
        >
          <GenForm
            type={this.state.type}
            onCancel={this.handleCancel}
            onSubmit={this.onCreate}
          />
        </Modal>
        <div className={styles.content} id="op-content">
          {this.state.list.map(t => (
            <pre key={t.timestamp} className={styles.line}>{`${t.val}`}</pre>
          ))}
        </div>
      </div>
    );
  }
}

export default Operate;
