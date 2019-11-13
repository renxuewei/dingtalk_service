/*
author: kevin 2019
*/
module.exports = {
    op: {
        oapiHost: 'https://oapi.dingtalk.com',
        corpId: '[yourcorpid]',
        agentId: 0,// 设置正确的值
        appkey: '[yourdingdingappkey]',
        appsecret: '[yourdingdingappsecret]',
        encoding_aes_key: '[putyour43charsorivkey]',
        token: '[putyourrandstring]',
        callback_url: 'https://yourdomain.vaiwan.com:8081/callback',// 钉钉不支持同一个企业（corpId）对应多个回调地址
    },

    mq: {
        connstr: 'amqp://guest:guest@localhost:5672',
    },

    redis: {
        host: '127.0.0.1',
        port: '6379',
        password: '',
        database: 0,
    },
}
