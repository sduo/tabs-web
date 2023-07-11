import React, {  useEffect, useState } from 'react';
import { request, useSearchParams, FormattedMessage, history } from 'umi';
import { Button, Result, ResultProps } from 'antd';
import { LoadingOutlined, FrownOutlined, SmileOutlined, MehOutlined } from '@ant-design/icons';
import { withAuth } from '../../global';
import styles from './index.less';

const Index: React.FC = () => {
  const [search] = useSearchParams();
  console.debug('add',search);
  const [result, setResult] = useState<ResultProps>({
    status: 'info',
    icon: null,
    title: '',
    subTitle: '',
    extra: []
  });

  useEffect(()=>{
    onAdd();
  },[]);

  // 跳转
  const onGoUrl = (url:string) => {
    if(url?.length > 0){
      history.push(url);
    }
  };

  // 添加
  const onAdd = () => {
    const url = search.get('url');
    if (url === null) {
      setResult({
        status: 'error',
        icon: <FrownOutlined />,
        title: <FormattedMessage id="sorry" />,
        subTitle: <FormattedMessage id='agrument.illegal' values={{name:'url'}} />,
        extra: [
          <Button key="home" type='primary' onClick={onGoUrl.bind(this, '/')}>{<FormattedMessage id='action.home' />}</Button>
        ]
      });
      return;
    }
    const query = [`url=${encodeURIComponent(url)}`];
    const title = search.get('title');
    if(title?.length! > 0){
      query.push(`title=${encodeURIComponent(title!)}`);
    }

    setResult({
      status: 'info',
      icon: <LoadingOutlined />,
      title: title,
      subTitle: url,
      extra: []
    });

    request(`/add?${query.join('&')}`,{
      validateStatus: function (status) {
        // default
        if (status >= 200 && status < 300){
          const ok = status === 201;
          setResult({
            status: ok ? 'success' : 'warning',
            icon: ok ? <SmileOutlined /> : <MehOutlined />,
            title: title,
            subTitle: url,
            extra: [
              <Button key="back" onClick={onGoUrl.bind(this, url)}>{<FormattedMessage id='action.back' />}</Button>,
              <Button key="home" type='primary' onClick={onGoUrl.bind(this, '/')}>{<FormattedMessage id='action.home' />}</Button>,
            ]
          });
          return true;
        } else {
          setResult({
            status: 'warning',
            icon: <FrownOutlined />,
            title: title,
            subTitle: url,
            extra: [
              <Button key="retry" onClick={onAdd}>{<FormattedMessage id='action.retry' />}</Button>,
              <Button key="back" type='primary' onClick={onGoUrl.bind(this, url)}>{<FormattedMessage id='action.back' />}</Button>
            ]
          });
          return false;
        }
      }
    });
  };

  return (
    <Result className={styles.add} {...result} />
  );
};

export default withAuth(Index);
