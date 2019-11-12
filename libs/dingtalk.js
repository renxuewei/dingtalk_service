/*
author: kevin 2019
*/
var redis = require('./redis');
var HttpUtil = require('./http');

function DingTalk(cfg) {
    this.cfg = cfg;
    this.DD_TOKEN_KEY = `DD_TOKEN_${cfg.op.appkey}`;
    this.http = new HttpUtil(cfg.op.oapiHost);
    redis.init(cfg);
}

DingTalk.prototype._exec_action = function (action) {
    let that = this;
    redis.get(that.DD_TOKEN_KEY, function (err, result) {
        if (err) console.error(err);
        if (!result) {
            that.http.get("/gettoken", {
                "appkey": that.cfg.op.appkey,
                "appsecret": that.cfg.op.appsecret,
            }, function (err1, body) {
                if (err1) console.error(err1);
                redis.set(that.DD_TOKEN_KEY, body.access_token, 7200);
                action(body.access_token);
            });
            return;
        }
        action(result);
    });
};

// 删除回调URL
DingTalk.prototype.delete_callback = function (req, res) {
    let that = this;
    that._exec_action((access_token) => {
        that.http.get(`/call_back/delete_call_back`, { "access_token": access_token }, function (err, body) {
            if (err) console.error(err);
            res.send(body);
        });
    })
}

// 注册回调URL
DingTalk.prototype.register_callback = function (req, res) {
    let that = this;
    that._exec_action((access_token) => {
        that.http.post(`/call_back/register_call_back`, { "access_token": access_token }, {
            url: that.cfg.op.callback_url,
            token: that.cfg.op.token,
            aes_key: that.cfg.op.encoding_aes_key,//len=43
            call_back_tag: ['bpms_task_change', 'bpms_instance_change'],//events
        }, function (err, body) {
            if (err) console.error(err);
            res.send(body);
        });
    });
}

// 查询事件回调接口URL
DingTalk.prototype.get_callback = function (req, res) {
    let that = this;
    that._exec_action((access_token) => {
        that.http.get(`/call_back/get_call_back`, { "access_token": access_token }, function (err, body) {
            if (err) console.error(err);
            res.send(body);
        });
    })
}

// 业务系统发起审批
DingTalk.prototype.create_instance = function (data, callback) {
    let that = this;
    if (!data.form_component_values || data.form_component_values.length == 0) {
        console.error('form_component_values is null or empty.');
        return;
    }
    that._exec_action((access_token) => {
        that.http.post(`/topapi/processinstance/create`, { "access_token": access_token }, data, function (err, body) {
            if (err) console.error(err);
            callback(body);
        });
    });
}

// 获取审批实例详情
DingTalk.prototype.get_instance_detail = function (processInstanceId, callback) {
    let that = this;
    that._exec_action((access_token) => {
        that.http.post(`/topapi/processinstance/get`, { "access_token": access_token }, { process_instance_id: processInstanceId }, function (err, body) {
            if (err) console.error(err);
            callback(body);
        });
    });
}

module.exports = DingTalk;