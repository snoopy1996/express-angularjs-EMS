var express = require('express');
var mysql = require('mysql');
var async = require("async");
var crypto = require('crypto');
var router = express.Router();
var dbConfig = require('../../db/dbConfig/dbConfig');
var dbAction = require('../../db/dbAction/dbSql');
var pool = mysql.createPool(dbConfig);

var i=0;
router.use(function(req, res, next) {
    if (req.path.indexOf('/api')>=0){
        i++;
        console.log('aop.js/api拦截,第'+i+'次：'+req.url);
        if (req.path.indexOf('/login')>0){
            next();
        }else {
            console.log("非登录请求，验证token");
            var token = req.header('token');
            if (token && token !== ''){
                console.log("token是："+req.header('token'));
                pool.getConnection(function (err,conn) {
                    if (err){
                        throw err;
                    }
                    conn.query(dbAction.user.queryUserByT,[token],function (err,results) {
                        if (err)
                            throw err;
                        if (results.length > 0){
                            console.log('results',results);
                            if (results[0].status === '是'){
                                if (req.path.indexOf('/testToken') > 0 || req.path.indexOf('/updatePwd') > 0){
                                    console.log("验证token返回用户情请求");
                                    next();
                                }else if (results[0].role === 'admin'){
                                    console.log('验证管理员');
                                    next();
                                }else {
                                    console.log(results[0]);
                                    resData = {
                                        code : 444,
                                        result : [],
                                        message : '当前登录人无此权限！'
                                    };
                                    res.json(resData);
                                }
                            }else {
                                resData = {
                                    code : 444,
                                    result : [],
                                    message : '当前登录人已禁止登录系统！'
                                };
                                res.json(resData);
                            }

                        }else {
                            var resData = {
                                code : 444,
                                result : [],
                                message : 'token不合法！'
                            };
                            res.json(resData);
                        }
                        conn.release();
                    })
                })
            }else {
                var resData = {
                    code : 444,
                    result : [],
                    message : '用户未登录'
                };
                res.json(resData);
            }
        }
    }else {
        res.sendfile('public/app/index.html');
    }
});

module.exports = router;