/*
author: kevin 2019
*/
var SQLLib = require('./mssqllib');

function Activity(cfg) {
    var that = this;
    that.cfg = cfg;

    // 根据实际需要启用对应的数据库引擎，这里使用的是mssql
    that.db = new SQLLib(cfg);
}

// 成功发起钉钉审批流程后，将钉钉的流程实例的Id值回写入业务实例表中对应的实例
Activity.prototype.set_instance_id = function (guid, instance_id) {
    that.db.update({ ProcessInstanceId: instance_id }, { guid: guid }, 'ProcessActivity', (err, result) => {
        if (err) console.error(err);
    });
}

// 钉钉客户端审批后，发起的状态变更通知，用以处理业务逻辑
Activity.prototype.status_change = async function (processInstanceId, res) {
    that.db.update({ Result: res.process_instance.result }, { ProcessInstanceId: processInstanceId }, 'ProcessActivity', (err, result) => {
        if (err) console.error(err);
        //TODO: 处理更多的业务逻辑
    });
}

module.exports = Activity; 
