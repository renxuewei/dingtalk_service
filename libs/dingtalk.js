/*
author: kevin 2019
*/
const RedisClient = require('./redis');
const HttpUtil = require('./httputil');

module.exports = class DingTalk {
    constructor(cfg) {
        this.cfg = cfg;
        this.http = new HttpUtil(cfg.op.oapiHost);
        this.redis = new RedisClient(cfg);
    }
    _exec_action(action) {
        let that = this;
        let key = `DINGTALK_TOKEN_${that.cfg.op.appkey}`;
        that.redis.get(key, function (err, result) {
            if (err)
                console.error(err);
            if (!result) {
                that.http.get("/gettoken", {
                    "appkey": that.cfg.op.appkey,
                    "appsecret": that.cfg.op.appsecret,
                }, function (err1, body) {
                    if (err1)
                        console.error(err1);
                    that.redis.set(key, body.access_token, 7200);
                    action(body.access_token);
                });
                return;
            }
            action(result);
        });
    }
    // 删除回调URL
    delete_callback(req, res) {
        let that = this;
        that._exec_action((access_token) => {
            that.http.get(`/call_back/delete_call_back`, { "access_token": access_token }, function (err, body) {
                if (err)
                    console.error(err);
                res.send(body);
            });
        });
    }
    // 注册回调URL
    register_callback(req, res) {
        let that = this;
        that._exec_action((access_token) => {
            that.http.post(`/call_back/register_call_back`, { "access_token": access_token }, {
                url: that.cfg.op.callback_url,
                token: that.cfg.op.token,
                aes_key: that.cfg.op.encoding_aes_key,
                call_back_tag: ['bpms_task_change', 'bpms_instance_change'],
            }, function (err, body) {
                if (err)
                    console.error(err);
                res.send(body);
            });
        });
    }
    // 查询事件回调接口URL
    get_callback(req, res) {
        let that = this;
        that._exec_action((access_token) => {
            that.http.get(`/call_back/get_call_back`, { "access_token": access_token }, function (err, body) {
                if (err)
                    console.error(err);
                res.send(body);
            });
        });
    }
    // 业务系统发起审批
    create_instance(data, callback) {
        let that = this;
        if (!data.form_component_values || data.form_component_values.length == 0) {
            console.error('form_component_values is null or empty.');
            return;
        }
        that._exec_action((access_token) => {
            that.http.post(`/topapi/processinstance/create`, { "access_token": access_token }, data, function (err, body) {
                if (err)
                    console.error(err);
                callback(body);
            });
        });
    }
    // 获取审批实例详情
    get_instance_detail(processInstanceId, callback) {
        let that = this;
        that._exec_action((access_token) => {
            that.http.post(`/topapi/processinstance/get`, { "access_token": access_token }, { process_instance_id: processInstanceId }, function (err, body) {
                if (err)
                    console.error(err);
                callback(body);
            });
        });
    }
}