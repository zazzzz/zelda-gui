import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import { Button, Icon, Form, Input, Switch } from 'antd';

import styles from './Zelda.css';

const FormItem = Form.Item;

const antStyles = {
  back: {
    height: '30px',
    padding: '0px',
    border: 'none'
  },
  icon: {
    cursor: 'pointer',
    fontSize: '20px',
    verticalAlign: 'middle'
  },
  lastItem: {
    width: '100%',
    position: 'absolute',
    bottom: -40,
    marginBottom: 0
  },
  btn: {
    width: '100px',
    height: '30px'
  }
};

class Zelda extends PureComponent {
  static propTypes = {};

  static defaultProps = {};

  static contextTypes = {
    router: PropTypes.any
  };

  state = {
    dir: '',
    zcfg: ''
  };

  onFolder = () => {
    const dir = window.handleSelectFolder();
    if (dir && dir.length) {
      this.setState({
        dir: dir[0]
      });
    }
  };

  onFile = () => {
    const file = window.handleSelectFile();
    if (file && file.length) {
      this.setState({
        zcfg: file[0]
      });
    }
  };

  onCreate = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!this.state.dir) {
          this.onFolder();
        }

        window.setTimeout(() => {
          const config = {
            ...values,
            dest: this.state.dir,
            zcfg: this.state.zcfg
          };

          this.context.router.history.push({
            pathname: 'status',
            query: config
          });
        }, 100);
      }
    });
  };

  onReset = () => {
    this.props.form.resetFields();
    this.setState({
      dir: '',
      zcfg: ''
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 14, offset: 1 }
    };

    return (
      <div className={styles.root}>
        <div className={styles.head}>
          <Link className={styles.link} to="/">
            <Button style={antStyles.back}>
              <Icon type="left" />首页
            </Button>
          </Link>
        </div>
        <div className={styles.content}>
          <Form
            className={styles.form}
            onSubmit={this.onCreate}
            hideRequiredMark
          >
            <FormItem {...formItemLayout} label="项目名" colon={false}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入项目名!'
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="项目目录" colon={false}>
              {this.state.dir ? (
                <span className={styles.dir} onClick={this.onFolder}>
                  {this.state.dir}
                </span>
              ) : (
                <Icon
                  style={antStyles.icon}
                  type="folder"
                  onClick={this.onFolder}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="roadhogx" colon={false}>
              {getFieldDecorator('roadhogx', {
                valuePropName: 'checked',
                initialValue: false
              })(<Switch />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="pwa"
              colon={false}
              style={getFieldValue('roadhogx') ? {} : { display: 'none' }}
            >
              {getFieldDecorator('pwa', {
                valuePropName: 'checked',
                initialValue: false
              })(<Switch />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Zatlas" colon={false}>
              {getFieldDecorator('zatlas', {
                valuePropName: 'checked',
                initialValue: false
              })(<Switch />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Zatlas配置"
              colon={false}
              style={getFieldValue('zatlas') ? {} : { display: 'none' }}
            >
              {this.state.zcfg ? (
                <span className={styles.dir} onClick={this.onFile}>
                  {this.state.zcfg}
                </span>
              ) : (
                <Icon
                  style={antStyles.icon}
                  type="file"
                  onClick={this.onFile}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="install" colon={false}>
              {getFieldDecorator('install', {
                valuePropName: 'checked',
                initialValue: true
              })(<Switch />)}
            </FormItem>
            <FormItem style={antStyles.lastItem} wrapperCol={{ span: 24 }}>
              <div className={styles.action}>
                <Button style={antStyles.btn} onClick={this.onReset}>
                  重置
                </Button>
                <Button htmlType="submit" type="primary" style={antStyles.btn}>
                  创建
                </Button>
              </div>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(Zelda);
