/*
author: kevin 2019
*/
module.exports = class Activity {
    constructor(cfg) {
        this.cfg = cfg;
        //this.db = new MySQL(cfg.db);
    }
    // 成功发起钉钉审批流程后，将钉钉的流程实例的Id值回写入业务实例表中对应的实例
    async set_instance_id(guid, instance_id) {
        // that.db.update({ ProcessInstanceId: instance_id }, { guid: guid }, 'ProcessActivity', (err, result) => {
        //     if (err) console.error(err);
        // });
    }
    // 钉钉客户端审批后，发起的状态变更通知，用以处理业务逻辑
    async status_change(processInstanceId, res) {
        // that.db.update({ Result: res.process_instance.result }, { ProcessInstanceId: processInstanceId }, 'ProcessActivity', (err, result) => {
        //     if (err) console.error(err);
        // });
    }
}