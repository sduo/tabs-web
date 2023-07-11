import { Layout } from "antd";
import { defineConfig } from "umi";

export default defineConfig({
  title: 'Tabs',
  favicons: ['/images/tabs.svg'],
  metas: [
    { name: "viewport", content: "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" },
    { name: "format-detection", content: "telephone=no, email=no, adress=no" },
    // { name: "apple-mobile-web-app-capable", content: "yes" },
    // { name: "apple-touch-fullscreen", content: "yes" },
    // { name: "apple-mobile-web-app-status-bar-style", content: "black" }
  ],
  links:[
    // { rel: "icon", type: "image/x-icon", href: "/images/tabs.svg" },
    // { rel: "apple-touch-icon-precomposed", size: "57x57", href: "/images/tabs_57.png" },
    // { rel: "apple-touch-icon-precomposed", size: "72x72", href: "/images/tabs_72.png" },
    // { rel: "apple-touch-icon-precomposed", size: "114x114", href: "/images/tabs_114.png" },
    // { rel: "apple-touch-icon-precomposed", size: "144x144", href: "/images/tabs_144.png" }
    // { rel: "apple-touch-icon", size: "57x57", href: "/images/tabs_57.png" },
    // { rel: "apple-touch-icon", size: "72x72", href: "/images/tabs_72.png" },
    // { rel: "apple-touch-icon", size: "114x114", href: "/images/tabs_114.png" },
    // { rel: "apple-touch-icon", size: "144x144", href: "/images/tabs_144.png" }
    // apple-touch-startup-image
  ],
  routes: [
    { exact: true, path: '/', component: 'index/index' },
    { exact: true, path: "/add", component: "add/index" },
    { exact: true,path: "/login", component: "login/index" },
    { exact: true, path: "/signin", component: "signin/index" }
    // { component: '@/pages/404' },
  ],
  plugins: [
    '@umijs/plugins/dist/initial-state',
    '@umijs/plugins/dist/model',
    '@umijs/plugins/dist/access',
    '@umijs/plugins/dist/locale',
    '@umijs/plugins/dist/request'
  ],
  initialState:{},
  model:{},
  access: {
    strictMode: true,
  },
  locale: {
    default: 'zh-CN',
    baseNavigator:false,
    useLocalStorage:false,
  },
  request:{},
  npmClient: 'pnpm',
  hash :false,
  inlineLimit: 4096,
  outputPath: './wwwroot',
  exportStatic: {},
  helmet: false
});
