/*
author: kevin 2019
*/
var express = require('express');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());


var config = require(`./libs/config.default`);

var DingTalk = require('./libs/dingtalk');
var dt = new DingTalk(config);

var CryptoLib = require('./libs/cryptolib');
var cpt = new CryptoLib(config);

var Activity = require('./libs/activity');
var act = new Activity(config);

var MQLib = require('./libs/mqlib');
var mq = new MQLib(cfg.mq.connstr);

// 对队列中的发起消息进行消费
mq.receive(true, (msg) => {
    // 调用钉钉接口发起流程实例
    if (msg) dt.create_instance(msg, (body) => {
        // 成功后回写实例Id
        act.set_instance_id(msg.guid, body.process_instance_id);
    });
});

// 向队列发送待发起流程的数据消息
app.use('/send', function (req, res) {
    var data = req.body;
    var msg = {
        guid: data.guid,
        agent_id: data['AgentId'] || config.op.agentId,
        process_code: data['ProcessCode'],
        originator_user_id: data['DingtalkUserId'],
        dept_id: parseInt(data['DingtalkDeptId']),
        form_component_values: JSON.parse(data["ProcessInstanceFormValues"] || '[]'),
    };
    mq.send(msg);
});


// 默认请求
app.use(function (req, res, next) {
    res.send(`DINGTALK API SERVICE FOR ${process.env.NODE_ENV}`)
});

// 注册回调Url
app.use('/registercallback', function (req, res) {
    dt.register_callback(req, res);
});
// 删除回调Url
app.use('/deletecallback', function (req, res) {
    dt.delete_callback(req, res);
});
// 查询回调Url
app.use('/getcallback', function (req, res) {
    dt.get_callback(req, res);
});
// 接收来自钉钉接口服务的回调数据
app.use('/callback', function (req, res) {

    if (!cpt.validate(req.query.signature, req.query.timestamp, req.query.nonce, req.body.encrypt)) {
        console.log('the request sign validated fail');
        res.send(cpt.encrypt_response('fail'));
        return;
    }

    var data = cpt.decrypt(req.body.encrypt);
    if (!data) {
        console.log('the body content decrypted fail');
        res.send(cpt.encrypt_response('fail'));
        return;
    }

    console.log('inbound event =>', data.EventType);

    if (data.EventType == 'bpms_task_change' || data.EventType == 'bpms_instance_change') {
        dt.get_instance_detail(data.processInstanceId, (res2) => {
            if (res2.errcode == 0) {
                console.log('the instance detail loaded from dingtalk api');
                act.status_change(data.processInstanceId, res2);
            }
        })
    }

    res.send(cpt.encrypt_response('success'));
});

module.exports = app;