import React from 'react';
import { Navigate, useLocation, useModel } from 'umi';
import { theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';

export function asc<T> (array:Array<T>,key:(item:T)=>number):Array<T>{
  return array.sort((l: T, r: T): number => {
    return key(l)-key(r);
  });
}

export function desc<T>(array: Array<T>, key: (item: T) => number): Array<T> {
  return array.sort((l: T, r: T):number => {
    return key(r) - key(l);
  });
}

export function max<T>(array: Array<T>, key: (item: T) => number): number{
  return array.map(x=>key(x)).reduce((max,current)=>{
    if(Number.isNaN(max)){
      return current;
    }else{
      return max < current ? current : max;
    }
  }, NaN);
}

export function min<T>(array: Array<T>, key: (item: T) => number): number {
  return array.map(x => key(x)).reduce((min, current) => {
    if (Number.isNaN(min)) {
      return current;
    } else {
      return min > current ? current : min;
    }
  }, NaN);
}

export function withAuth(Component: React.FC): () => React.ReactElement {
  return () => {
    const { initialState } = useModel("@@initialState");
    const location = useLocation();
    console.debug('auth', location, initialState);
    if ((initialState?.user?.length! > 0) && (initialState?.token?.length! > 0)) {
      return <Component />;
    } else {
      return <Navigate to={`/login?redirect=${encodeURIComponent([location.pathname, location.search, location.hash].join(''))}`} />;
    }
  };
}

export const globalConfig = {
  title: 'Tabs',
  theme: {
    default: 'light',
    supports: window.matchMedia('(prefers-color-scheme)').matches ? ['system','light', 'dark']:['light','dark'],
    themes: [{
      name: 'light',
      algorithm: theme.defaultAlgorithm,
      logo: 'rgba(25, 57, 55, 1)',
      header: 'rgba(231, 250, 245, 1)',
      content: 'rgba(255, 255, 255, 1)',
      footer: 'rgba(235, 235, 235, 1)',
    }, {
      name: 'dark',
      algorithm: theme.darkAlgorithm,
      logo: 'rgba(231, 250, 245, 1)',
      header: 'rgba(25, 57, 55, 1)',
      content: 'rgba(20, 20, 20, 1)',
      footer: 'rgba(30, 30, 30, 1)'
    }],
    getTheme: (text: string| null) => {
      if (text === 'system' && window.matchMedia('(prefers-color-scheme)').matches) {
        const name = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const theme = Object.assign({}, globalConfig.theme.themes.find(x => x.name === name) ?? globalConfig.theme.themes.find(x => x.name === globalConfig.theme.default)!);
        theme.name = 'system';
        return theme;
      }else{
        const name = text ?? globalConfig.theme.default;
        const theme = globalConfig.theme.themes.find(x => x.name === name) ?? globalConfig.theme.themes.find(x => x.name === globalConfig.theme.default)!;
        return theme;
      }
    },
    // https://ant.design/docs/react/migrate-less-variables-cn
    antd: {
      colorPrimary: '#39cebf',
    }
  },
  lang:{
    default: 'zh-CN',
    supports: [{
      name:'zh-CN',
      Locale: zhCN
    },{
      name:'en-US',
      Locale: enUS
    }],
    getLang: (text: string | null) => {
      const name = text ?? globalConfig.lang.default;
      return globalConfig.lang.supports.find(x => x.name === name)!;
    }
  },
  tags: [
    { text: 'tabs', color: '#39cebf', url: 'https://github.com/sduo/tabs' },
    { text: 'antd', color: '#1677FF', url: 'https://ant.design/' },
    { text: 'umi', color: '#1890FF', url: 'https://umijs.org/' },
    { text: 'pnpm', color: '#F69220', url: 'https://pnpm.io/' },
    { text: '.net', color: '#9C72D2', url: 'https://dotnet.microsoft.com/' }
  ],
  api: {
    domain: '/api'
  },
  js: `javascript:(function() {window.location.replace(\`${window.location.origin}/add?title=\${encodeURIComponent(document.title??window.location.href)}&url=\${encodeURIComponent(window.location.href)}\`);})();`,
  fmt: {
    date: 'YYYY-MM-DD',
    tiem: 'HH:mm:ss',
    datetime: 'YYYY-MM-DD HH:mm:ss'
  },
  page: {
    default: 10,
    size: [10, 20, 50, 100]
  },
  requestErrorHandler: (error:any)=>{ }
};