/*
author: kevin 2019
*/
var amqp = require('amqplib/callback_api');

module.exports = class MessageQueue {
    constructor(connstr) {
        this.connstr = connstr;
        this.queueName = 'Process_Instance_Status_Change_Message_Queue';
    }

    receive(json = false, callback = null) {
        let that = this;
        amqp.connect(that.connstr, function (err, connection) {
            if (err) {
                console.error(err);
                return;
            }
            connection.createChannel(function (err1, channel) {
                if (err1) {
                    console.error(err1);
                    return;
                }

                channel.assertQueue(that.queueName, {
                    durable: false
                });

                channel.consume(that.queueName, function (msg) {
                    var res = msg.content.toString();
                    if (callback) callback(json ? JSON.parse(res) : res);
                }, {
                    noAck: true
                });
            });
        });
    }

    send(msg, json = false) {
        if (!msg) return;
        let that = this;
        amqp.connect(that.connstr, function (err, connection) {
            if (err) {
                console.error(err);
                return;
            }
            connection.createChannel(function (err1, channel) {
                if (err1) {
                    console.error(err1);
                    return;
                }

                channel.assertQueue(that.queueName, {
                    durable: false
                });

                var res = json ? JSON.stringify(msg) : msg.toString();
                channel.sendToQueue(that.queueName, Buffer.from(res), {
                    persistent: true
                });

                setTimeout(function () { channel.close(() => { connection.close(); }); }, 1000);
            });
        });
    }
}

