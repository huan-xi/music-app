// 域名
// const baseUrl = 'https://music.chengfeng8.top/api';
const baseUrl = "/api";

const callbackUrl = 'https://tb.xqcrm.com/api/open/auth'
const authUrl = `https://oauth.taobao.com/authorize?response_type=code&client_id=12686282&redirect_uri=${callbackUrl}&view=web&state=short`

export default {
    baseUrl: baseUrl,
    authUrl
}
