/*
author: kevin 2019
*/
const randomstring = require("randomstring");
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const clearEncoding = 'utf-8';
const cipherEncoding = 'base64';

function htonl(n) {
    let buf = Buffer.alloc(4);
    buf[0] = (n & 0xFF000000) >> 24;
    buf[1] = (n & 0x00FF0000) >> 16;
    buf[2] = (n & 0x0000FF00) >> 8;
    buf[3] = (n & 0x000000FF) >> 0;
    return buf;
};

module.exports = class CryptoLib {
    constructor(cfg) {
        this.op = cfg.op;
    }
    encrypt_response(msg) {
        var msg_encrypt = this.encrypt(msg);
        var nonce = randomstring.generate(8);
        var ts = Math.floor(Date.now() / 1000);
        var res = {
            "msg_signature": this.genSign(ts, nonce, msg_encrypt),
            "encrypt": msg_encrypt,
            "timeStamp": ts,
            "nonce": nonce
        };
        return res;
    }
    encrypt(msg) {
        var seskey = Buffer.from(this.op.encoding_aes_key + "=", cipherEncoding);
        var iv = seskey.slice(0, 16);
        var preBuf = Buffer.from(randomstring.generate(16), clearEncoding);
        var msgBuf = Buffer.from(msg, clearEncoding);
        var netBuf = htonl(msgBuf.length);
        var corpBuf = Buffer.from(this.op.corpId, clearEncoding);
        var cipher = crypto.createCipheriv(algorithm, seskey, iv);
        var result = Buffer.concat([cipher.update(Buffer.concat([preBuf, netBuf, msgBuf, corpBuf])), cipher.final()]);
        res = result.toString(cipherEncoding);
        return res;
    }
    decrypt(msg_encrypt) {
        var msgBuf = Buffer.from(msg_encrypt, cipherEncoding);
        var seskey = Buffer.from(this.op.encoding_aes_key + "=", cipherEncoding);
        var iv = seskey.slice(0, 16);
        var decipher = crypto.createDecipheriv(algorithm, seskey, iv);
        decipher.write(msgBuf);
        var result = decipher.read();
        var netBuf = result.slice(16, 20);
        var msg_length = netBuf.readInt32BE();
        var msg_buffer = result.slice(20, 20 + msg_length);
        var msg = msg_buffer.toString(clearEncoding);
        var res = JSON.parse(msg);
        res.corpId = result.slice(20 + msg_length).toString(clearEncoding);
        return res;
    }
    validate(signature, timestamp, nonce, msg_encrypt) {
        return signature == this.gen_sign(timestamp, nonce, msg_encrypt);
    }
    gen_sign(timestamp, nonce, msg_encrypt) {
        var arr = [this.op.token, timestamp, nonce, msg_encrypt].sort();
        var str = arr.join('');
        let hash = crypto.createHash('sha1');
        hash.update(str);
        var res = hash.digest('hex');
        return res.toString();
    }
}