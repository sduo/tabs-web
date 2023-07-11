import React, { useEffect, useState } from 'react';
import { useModel, Outlet, Access, useAccess, useIntl, setLocale ,history,getAllLocales, getLocale } from 'umi';
import { App, ConfigProvider, Layout, Space, Select, Tag, Button, Typography, QRCode, ThemeConfig } from 'antd';
import { Locale } from 'antd/lib/locale';
import { LogoutOutlined, QrcodeOutlined } from '@ant-design/icons';
import {globalConfig} from '../global';
import styles from './index.less';
import LinkTag from '../models/link-tag';

const Tabs: React.FC<{ state: any, onThemeChange: (value: ThemeConfig) => void, onLocaleChange: (value: Locale) => void }> = ({ state, onThemeChange, onLocaleChange }) => {
  const { refresh } = useModel("@@initialState");
  const access = useAccess();
  console.debug('layout.tabs', access);
  const i18n = useIntl();
  const { modal } = App.useApp();
  const [theme, setTheme] = useState(state?.theme!);
  const [lang, setLang] = useState(state?.lang!);

  // 注销
  const onLogoutClick = () => {
    console.debug('logout');
    localStorage.clear();
    refresh().then(()=>{
      console.debug('logout.refresh');
      history.push('/login');
    });
  };

  // 二维码
  const onQrcodeClick = () => {
    modal.info({
      width: 210,
      icon: null,
      closable: true,
      maskClosable: true,
      footer: null,
      centered: true,
      className: 'qrcode',
      content: <QRCode size={160} value={ window.location.origin } />,
    });
  };

  // 首页
  const onHomeClick = () => {
     history.push('/');
  };

  // 主题切换
  const onThemeSelect = (value:string) => {
    const theme = globalConfig.theme.getTheme(value);
    setTheme(theme);
  };

  useEffect(() => {
    localStorage.setItem('theme', theme.name);
    onThemeChange({ token: globalConfig.theme.antd, algorithm: theme.algorithm });
  }, [theme])

  // 语言切换
  const onLocaleSelect = (value: string) => {
    const lang = globalConfig.lang.getLang(value);
    setLang(lang);
  };

  useEffect(() => {
    setLocale(lang.name, false);
    localStorage.setItem('lang', lang.name);
    onLocaleChange(lang.Locale);
  }, [lang]);

  // 友情链接
  const onLinkTagRender = (row: LinkTag, index: number) => {
    return (<Typography.Link key={index} href={row.url ?? 'javascript:;'} target='_blank'><Tag color={row.color}>{row.text}</Tag></Typography.Link>);
  };

  return (
    <Layout className={styles.layout}>
      <Layout.Header className={styles.header} style={{ backgroundColor: theme.header }}>
        <Space className={styles.logo} style={{ color: theme.logo }}>
          <Typography.Link onClick={onHomeClick}><img src='/images/tabs.svg' /></Typography.Link>
          {/* <Typography.Text onClick={onHomeClick}>{global.title}</Typography.Text> */}
          <Typography.Text onClick={onQrcodeClick} ><QrcodeOutlined /></Typography.Text>
        </Space>
        <Space>
          {/* {globalConfig.js.length === 0 ? <></> : <Typography.Link href={globalConfig.js} ><Tag>Tabs-JS</Tag></Typography.Link>} */}
          <Select defaultValue={lang.name} options={globalConfig.lang.supports.map((x) => { return { label: i18n.formatMessage({ id: `lang.${x.name}` }), value: x.name }; })} onSelect={onLocaleSelect} />
          <Select defaultValue={theme.name} options={globalConfig.theme.supports.map((x) => { return { label: i18n.formatMessage({ id: `theme.${x}` }), value: x }; })} onSelect={onThemeSelect} />
          <Access accessible={access.isLogined}>
            <Button type="primary" icon={<LogoutOutlined />} onClick={onLogoutClick} >{access.user}</Button>
          </Access>
        </Space>
      </Layout.Header>
      <Layout.Content className={styles.content} style={{ backgroundColor: theme.content }} >
        <Outlet />
      </Layout.Content>
      <Layout.Footer className={styles.footer} style={{ backgroundColor: theme.footer }}>
        <Space direction="vertical">
          <Space>{globalConfig.tags.map(onLinkTagRender)}</Space>
        </Space>
      </Layout.Footer>
    </Layout>
  );
};

const Index  : React.FC = () => {
  const { initialState } = useModel("@@initialState");

  const [theme, setTheme] = useState<ThemeConfig>({ token: globalConfig.theme.antd, algorithm: initialState?.theme.algorithm });
  const [locale, setLocale] = useState(initialState?.lang!.Locale);

  console.debug('layout.index', initialState);

  const { formatMessage } = useIntl();
  const { notification } = App.useApp();

  // useEffect(()=>{

  //   globalConfig.requestErrorHandler = (error) => {
  //     notification.error({
  //       message: `[${error.response.status}]${i18n.formatMessage({ id: `HTTP.${error.response.status}` })})}`,
  //       description: <><Typography.Paragraph>{error.response.data}</Typography.Paragraph><Typography.Text type="secondary">{error.config.url}</Typography.Text></>,
  //       duration: 10
  //     });
  //   };
  // },[]);

  return (
    <ConfigProvider locale={locale} theme={theme}>
      <App>
        <Tabs state={initialState} onThemeChange={setTheme} onLocaleChange={setLocale} />
      </App>
    </ConfigProvider>
  );
};

export default Index;