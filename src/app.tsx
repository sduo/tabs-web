import { RequestConfig } from 'umi';
import { globalConfig } from './global';


export function getInitialState() {
    const state = {
        theme: globalConfig.theme.getTheme(localStorage.getItem('theme')),
        lang: globalConfig.lang.getLang(localStorage.getItem('lang')),
        user: localStorage.getItem('user:name'),
        token: localStorage.getItem('user:token')
    };
    console.debug('getInitialState', state);
    return Promise.resolve(state) ;
};

export const locale = {
    getLocale() {
        return localStorage.getItem('lang') ?? globalConfig.lang.default;
    },
};

export const request = {
    timeout: 3000,
    errorConfig: {
        errorHandler : (error: any) => { globalConfig?.requestErrorHandler.apply(this,[error]); },
        errorThrower ()  { }
    },
    requestInterceptors: [(request: RequestConfig) => {
        if (globalConfig?.api?.domain?.length! > 0 && request.url?.startsWith('/') === true) {
            request.url = globalConfig!.api.domain + request.url;
        }
        return request;
    }, (request: RequestConfig) => {
        if (!(request?.headers === null)) {
            var user = localStorage.getItem('user:name');
            if (user?.length! > 0) {
                request.headers!['user'] = user!;
            }
            var token = localStorage.getItem('user:token');
            if (token?.length! > 0) {
                request.headers!['token'] = token!;
            }
        }
        return request;
    }],
    responseInterceptors: []
};