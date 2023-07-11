import React from 'react';
import { useIntl, history, useSearchParams, useModel } from 'umi';
import { Button, Form, Input, Space } from 'antd';
import styles from './index.less';
import User from '../../models/user';

const Index : React.FC = ()=>{
  const { refresh } = useModel("@@initialState");

  const [search] = useSearchParams();
  console.debug('login',search);
  const [form] = Form.useForm();

  const i18n = useIntl();

  // 登录
  const onLoginClick = ({name,token}:User)=>{
    console.debug('login');
    localStorage.setItem('user:name', name);
    localStorage.setItem('user:token',token);
    refresh().then(()=>{
      console.debug('login.refresh');
      const redirect = search.get('redirect') ?? '/';
      console.debug('redirect', redirect);
      history.push(redirect);
    });
  };

  // 重置
  const onResetClick = ()=>{
    form.resetFields();
  };

  // 注册
  const onSigninClick = ()=>{
    history.push('/signin');
  }

  return (
    <Space direction="vertical" className={styles.login}>
      <Form form={form} onFinish={onLoginClick} >
        <Form.Item label={i18n.formatMessage({id:'user'})} name="name" rules={[{ required: true, message: i18n.formatMessage({id:'error.required'}) }]}>
          <Input placeholder={i18n.formatMessage({ id: 'placeholder.input' }, { name: i18n.formatMessage({ id:'user'})})} />
        </Form.Item>
        <Form.Item label={i18n.formatMessage({ id: 'token' })} name="token" rules={[{ required: true, message: i18n.formatMessage({ id:'error.required'}) }]}>
          <Input placeholder={i18n.formatMessage({ id: 'placeholder.input' }, { name: i18n.formatMessage({ id: 'token' }) })} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">{i18n.formatMessage({id:'action.confirm'})}</Button>
            <Button onClick={onResetClick}>{i18n.formatMessage({ id:'action.reset'})}</Button>
            <Button type="link" onClick={onSigninClick}>{i18n.formatMessage({ id: 'action.signin' })}</Button>
          </Space>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default Index;