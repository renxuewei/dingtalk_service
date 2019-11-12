/*
author: kevin 2019
*/
var request = require('request');

function Http(domain) {
    this.domain = domain;
}

function _build_url(domain, path, params) {
    var url = domain + path;
    if (Object.keys(params).length > 0) {
        url = url + "?";
        for (var key in params) {
            url = url + key + "=" + params[key] + "&";
        }
        var length = url.length;
        if (url[length - 1] == '&') {
            url = url.substring(0, length - 1);
        }
    }
    return url;
}

function _request(domain, path, params, data, method, callback) {
    var obj = {
        method: method,
        url: _build_url(domain, path, params),
        json: true
    };
    if (data) obj.body = data;
    console.log(method, ' ===> ', url, JSON.stringify(obj, null, 4), '<===');
    request(obj, function (err, response, body) {
        callback && callback(err, body);
    });
}

Http.prototype.get = function (path, params, callback) {
    _request(this.domain, path, params, null, 'GET', callback);
}

Http.prototype.post = function (path, params, data, callback) {
    _request(this.domain, path, params, data, 'POST', callback);
}

module.exports = Http;