import React, { useState, useEffect, useRef } from "react";
import { request, useIntl } from 'umi';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/plugin/updateLocale';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { App, Space, Input, Button, Typography, QRCode, DatePicker, Select, Card, Divider, Empty } from 'antd';
import { QrcodeOutlined, DeleteOutlined, LinkOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { desc, asc, max, globalConfig, withAuth } from '../../global';
import styles from './index.less';
import Page from "./models/page";
import Url from "./models/url";

const Index : React.FC = () => {
  const [data, setData] = useState<Array<Url>>([]);
  const [previous, setPrevious] = useState<boolean>(true);
  const [next, setNext] = useState<boolean>(true);

  const page = useRef<Page>({
    cursor: NaN,
    previous: NaN,
    next: NaN,
    size: globalConfig.page.default,
    search:'',
    range : [],
    rows: [],
  });

  console.debug('index',page,data);

  const i18n = useIntl();
  const { message, modal } = App.useApp();

  // 初始化
  useEffect(() => {
    onQuery();
  }, []);

  // 加载数据
  const loadPage = () => {
    if (Number.isNaN(page.current.cursor)) { page.current.cursor=0;}
    const query = [`cursor=${page.current.cursor}`, `size=${page.current.size}`];
    if (page.current.search.length > 0){
      query.push(`search=${encodeURIComponent(page.current.search)}`);
    }
    if(page.current.range.length == 2){
      const [from, to] = page.current.range;
      query.push(`from=${from.startOf('day').valueOf()}`);
      query.push(`to=${to.endOf('day').valueOf()}`);
    }

    request(`/page?${query.join('&')}`)
      .then((result: Array<Url>) => { return desc(result,x=>x.id); })
    .then((result)=>{
      page.current.rows = result;
      fillPage();
    });
  };

  // 填充数据
  const fillPage = (replenish : boolean = false) => {
    const empty = page.current.rows.length === 0;
    const initial = Number.isNaN(page.current.cursor) || page.current.cursor === 0;

    const idx = (empty || initial) ? 0 : page.current.rows.findIndex(x => x.id === page.current.cursor);
    if( idx < 0 ){return;}
    if (!empty && idx >= page.current.rows.length){return;}

    const previous = page.current.rows.slice(0,idx);
    const current = page.current.rows.slice(idx, idx + page.current.size);
    const next = page.current.rows.slice(idx + page.current.size, idx + page.current.size * 2);

    page.current.previous = max(previous, x => x.id);
    page.current.next = max(next, x => x.id);
    if (initial) { page.current.cursor = max(current, x => x.id); }

    console.debug([previous, current, next, page.current, replenish]);

    if (replenish && next.length === 1 && !Number.isNaN(page.current.next)) {
      loadPage();
      return;
    }

    setPrevious(Number.isNaN(page.current.previous));
    setNext(Number.isNaN(page.current.next));
    setData(current);
  };

  // 二维码
  const onQrcodeClick = (row: Url) => {
    if(row === null){ return; }
    if(row.url){
      modal.info({
        width: 210,
        icon: null,
        closable:true,
        maskClosable:true,
        footer: null,
        centered:true,
        className:'qrcode',
        content: <QRCode size={160} value={row.url} />,
      });
    }
  };

  // 复制
  const onCopyClick = (text:string,ok:boolean) => {
    if(ok){
      message.success(i18n.formatMessage({ id: 'message.action.success' }, { action: i18n.formatMessage({ id:'action.copy' })}));
    }else{
      message.error(i18n.formatMessage({ id: 'message.action.error' }, { action: i18n.formatMessage({ id: 'action.copy' }) }));
    }
  };

  // 撤销
  const onRevokeClick = (row:Url)=>{
    row.revoked = true;
    message.destroy(row.id);
  };

  // 删除
  const onDeleteClick = (row: Url) => {
    console.log(row);
    const idx = page.current.rows.findIndex(x=>x.id === row.id);
    if (idx < 0){return;}
    row.current = page.current.cursor === row.id;
    message.success({
      key: row.id,
      content: <Space><Typography.Text>{i18n.formatMessage({ id: 'message.action.success' }, { action: i18n.formatMessage({ id:'action.delete'}) })}</Typography.Text><Typography.Link onClick={onRevokeClick.bind(this, row)}>{i18n.formatMessage({ id: 'action.revoke' })}</Typography.Link></Space >,
      duration: 3,
      onClose : () => {
        if (row.revoked === true) {
          page.current.rows.splice(idx, 0, row);
          if (row.current === true) {
            page.current.cursor = row.id;
          }
          fillPage();
          return;
        }
        const query = [`id=${row.id}`];
        const url = `/del?${query.join('&')}`;
        request(url);
      }
    });
    page.current.rows.splice(idx, 1);
    if (row.current === true){
      page.current.cursor = idx < page.current.rows.length ? page.current.rows[idx].id : page.current.previous;
    }
    fillPage(true);
  };

  // 搜索
  const onQuery = () => {
    page.current.cursor = NaN;
    page.current.next = NaN;
    page.current.previous = NaN;
    loadPage();
  };

  // 下一页
  const onNextClick =() => {
    if (Number.isNaN(page.current.next)){return;}
    page.current.cursor = page.current.next;
    loadPage();
  };

  // 上一页
  const onPreviousClick = () => {
    if (Number.isNaN(page.current.previous)) { return; }
    page.current.cursor = page.current.previous;
    loadPage();
  };

  // 页码变化
  const onSizeChange = (size:number) => {
    page.current.size = size;
    onQuery();
  };

  // 点击打开
  const onClick = (row:Url) => {
    window.open(row.url,'_blank');
    onDeleteClick(row);
  };

  // 列表渲染
  const onRender = (row: Url, index: number) => {
    return (<Card key={index} className={styles.item}>
      <Space direction="vertical">
        <Typography.Link onClick={onClick.bind(this, row)} >
          <Typography.Paragraph strong={true} className={styles.title}>{row.title}</Typography.Paragraph>        
          <Typography.Text>{row.url}</Typography.Text>
        </Typography.Link>
        <Space className={styles.actions}>
          <QrcodeOutlined onClick={onQrcodeClick.bind(this, row)} />
          <Divider type="vertical" />
          <CopyToClipboard text={row.url} onCopy={onCopyClick}><LinkOutlined /></CopyToClipboard>
          <Divider type="vertical" />
          <Typography.Text type="secondary">{dayjs(row.timestamp).format(globalConfig.fmt.datetime)}</Typography.Text>
          <Divider type="vertical" />
          <DeleteOutlined onClick={onDeleteClick.bind(this, row)} />
        </Space>
      </Space>
    </Card>);
  };

  return (
    <>
      <Space className={styles.filter}>
        <Select onSelect={onSizeChange} defaultValue={page.current.size} options={asc(globalConfig.page.size, x => x).map((x) => { return { value: x }; })} />
        <Input onChange={e => page.current.search = e.target.value} placeholder={i18n.formatMessage({ id: "placeholder.input" }, { name: i18n.formatMessage({ id:'title.or.url'})})} className={styles.item} allowClear={true} />
        <DatePicker.RangePicker onCalendarChange={e => page.current.range = e?.filter(x => dayjs.isDayjs(x)).map(x => x!) ?? []} className={styles.item} />
        <Button type='primary' className={styles.item} onClick={onQuery}>{i18n.formatMessage({id:"action.search"})}</Button>
      </Space>
      <Space className={styles.main} direction="vertical">
        {data.length === 0 ? <Empty /> : data.map(onRender)}
      </Space>
      <Space className={styles.pagination}>
        <Button disabled={previous} icon={<LeftOutlined />} onClick={onPreviousClick}/>
        <Button disabled={next} icon={<RightOutlined />} onClick={onNextClick} />
      </Space>
    </>
  );
};

export default withAuth(Index);