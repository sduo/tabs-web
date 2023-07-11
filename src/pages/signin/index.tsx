import React, { useState } from 'react';
import { useIntl,history } from 'umi';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import { Button, Form, Input, Space, App, Typography } from 'antd';
import styles from './index.less';
import TextArea from 'antd/es/input/TextArea';

const Index: React.FC = () => {
  console.debug('signin');
  const [form] = Form.useForm();
  const [token, setToken] = useState('');

  const i18n = useIntl();
  const { message } = App.useApp();

  // 复制
  const onCopyClick = (text: string, ok: boolean) => {
    if (ok) {
      message.success(i18n.formatMessage({ id: 'message.action.success' }, { action: i18n.formatMessage({ id:'action.copy'}) }));
    } else {
      message.error(i18n.formatMessage({ id: 'message.action.error' }, { action: i18n.formatMessage({ id: 'action.copy' }) }));
    }
  };

  // 计算
  const onConfirmClick = ({ name, salt }: { name: string, salt:string}) => {
    setToken(hmacSHA256(name, salt).toString().toUpperCase());
  };

  // 重置
  const onResetClick = () => {
    form.resetFields();
    setToken('');
  };

  // 登录
  const onLoginClick = () => {
    history.push('/login');
  };

  return (
    <Space direction="vertical" className={styles.signin}>
      <Form form={form} onFinish={onConfirmClick} labelAlign="right" >
        <Form.Item label={i18n.formatMessage({id:'user'})} name="name" rules={[{ required: true, message: i18n.formatMessage({id:'error.required'}) }]}>
          <Input placeholder={i18n.formatMessage({ id: 'placeholder.input' }, { name: i18n.formatMessage({ id: 'user' }) })} />
        </Form.Item>
        <Form.Item label={i18n.formatMessage({ id: 'salt' })} name="salt" rules={[{ required: true, message: i18n.formatMessage({id:'error.required'}) }]}>
          <Input placeholder={i18n.formatMessage({ id: 'placeholder.input' }, { name: i18n.formatMessage({ id: 'salt' }) })} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" ghost htmlType="submit">{i18n.formatMessage({id:'action.confirm'})}</Button>
            <Button htmlType="button" onClick={onResetClick}>{i18n.formatMessage({ id:'action.reset'})}</Button>
          </Space>
        </Form.Item>
      </Form>
      <Typography.Paragraph>{i18n.formatMessage({id:'token'})}</Typography.Paragraph>
      <TextArea style={{resize:'none'}} readOnly={true} value={token} className={styles.token} />
      <Space>
        <CopyToClipboard text={token} onCopy={onCopyClick}><Button disabled={token.length === 0} type='primary' ghost>{i18n.formatMessage({ id: 'action.copy' })}</Button></CopyToClipboard>
        <Button type="link" onClick={onLoginClick}>{i18n.formatMessage({ id: 'action.login' })}</Button>
      </Space>

    </Space>
  );
}

export default Index;

