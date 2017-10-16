import React, { PureComponent } from 'react';
import { Form, Input, Switch, Button } from 'antd';

const FormItem = Form.Item;

class GenForm extends PureComponent {
  static propTypes = {};

  static defaultProps = {};

  componentDidMount = () => {
    window.setTimeout(() => {
      this.inputRef.focus();
    }, 100);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
        this.props.onCancel();
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const type = this.props.type;

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 }
    };

    const tailFormItemLayout = {
      wrapperCol: { span: 20, offset: 2 }
    };

    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit} hideRequiredMark>
        <FormItem style={{ display: 'none' }}>
          {getFieldDecorator('type', {
            initialValue: type
          })(<Input type="hidden" />)}
        </FormItem>
        <FormItem {...formItemLayout} label={type} colon={false}>
          {getFieldDecorator('name', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: 'enter name'
              }
            ]
          })(
            <Input
              ref={ref => {
                this.inputRef = ref;
              }}
              placeholder="enter name"
              autoComplete="off"
            />
          )}
        </FormItem>
        {(type === 'component' || type === 'route') && (
          <FormItem {...formItemLayout} label={'no-css'} colon={false}>
            {getFieldDecorator('noCss', {
              valuePropName: 'checked',
              initialValue: false
            })(<Switch />)}
          </FormItem>
        )}
        {type === 'model' && (
          <FormItem {...formItemLayout} label={'no-tpl'} colon={false}>
            {getFieldDecorator('noTpl', {
              valuePropName: 'checked',
              initialValue: false
            })(<Switch />)}
          </FormItem>
        )}
        <FormItem {...tailFormItemLayout}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around'
            }}
          >
            <Button size="default" onClick={this.props.onCancel}>
              取消
            </Button>
            <Button size="default" type="primary" htmlType="submit">
              确认
            </Button>
          </div>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(GenForm);
