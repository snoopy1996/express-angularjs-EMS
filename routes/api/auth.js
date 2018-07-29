var express = require('express');
var mysql = require('mysql');
var async = require("async");
var crypto = require('crypto');
var router = express.Router();
var dbConfig = require('../../db/dbConfig/dbConfig');
var dbAction = require('../../db/dbAction/dbSql');
var pool = mysql.createPool(dbConfig);


//返回数据格式顶定义
var resData = {
    code:200,
    result:[],
    message:""
};
//未知错误返回
var res500 = {
    code:500,
    result:[],
    message:"后台服务错误"
};
/*
* 用户注册
* 注：不直接暴露到页面
* */
router.post('/register',function (req,res) {
    var newUser = req.body;
    pool.getConnection(function (err,conn) {
        if (err){
            res.json(res500);
            throw err;
        }
        conn.query(dbAction.user.queryUser,[newUser.userName],function (err,results) {
            if (err){
                res.json(res500);
                throw err;
            }
            if (results.length>0){
                resData.code = 401;
                resData.message = "用户名已存在！";
                res.json(resData);
            }else {
                var md5 = crypto.createHash('md5');
                md5.update(newUser.password);
                var password = md5.digest('hex');
                console.log(newUser.userName,newUser.role,newUser.status);
                conn.query(dbAction.user.insertOne,[newUser.userName,password,newUser.role,newUser.status],function (err,results) {
                    if (err){
                        res.json(res500);
                        throw err;
                    }
                    console.log("新注册用户"+results.affectedRows);
                    resData.code = 200;
                    resData.message = "success";
                    res.json(resData);
                })
            }
            conn.release();
        })
    })
});
/*
* 用户登录
* Method: POST
* */
router.post('/login', function(req, res, next) {
    var user = req.body;
    pool.getConnection(function (err,conn) {
        if (err){
            res.json(res500);
            throw err;
        }
        conn.query(dbAction.user.queryUser,[user.userName],function (err,results) {
            if (err){
                res.json(res500);
                throw err;
            }
            if (results.length > 0){
                if (results[0].status === '是'){
                    var md5 = crypto.createHash('md5');
                    md5.update(user.password);
                    var password = md5.digest('hex');
                    if (password === results[0].password){
                        var dateNumber = new Date().getTime();
                        var context = user.userName + dateNumber;
                        console.log(context);
                        var shasum = crypto.createHash('sha1');
                        shasum.update(context);
                        var token = shasum.digest('hex');
                        conn.query(dbAction.user.setUserToken,[token,user.userName],function (err,results) {
                            if (err){
                                res.json(res500);
                                throw err;
                            }
                            resData.code = 200;
                            resData.result = [{token:token}];
                            resData.message = "success！";
                            res.json(resData);
                        })
                    }else {
                        resData.code = 408;
                        resData.result = [];
                        resData.message = "密码错误！";
                        res.json(resData);
                    }
                }else {
                    resData.code = 409;
                    resData.result = [];
                    resData.message = "无登录权限！";
                    res.json(resData);
                }

            }else {
                resData.code = 407;
                resData.result = [];
                resData.message = "用户名不存在！";
                res.json(resData);
            }
            conn.release();
        })
    })
});
/*
* 修改密码
* method: PUT
* */
router.put('/updatePwd',function (req,res) {
    console.log("修改密码");
    var token = req.header('token');
    var reqData = req.body;
    pool.getConnection(function (err,conn) {
        if (err){
            res.json(res500);
            throw err;
        }
        conn.query(dbAction.user.queryUserByT,[token],function (err,results) {
            if (err){
                res.json(res500);
                throw err;
            }
            var md5 = crypto.createHash('md5');
            md5.update(reqData.oldPassword);
            var password = md5.digest('hex');
            if (password === results[0].password){
                console.log("密码验证正确");
                var userName = results[0].userName;
                md5 = crypto.createHash('md5');
                md5.update(reqData.newPassword);
                var newPwd = md5.digest('hex');
                conn.query(dbAction.user.setUserPass,[newPwd,userName],function (err,results) {
                    if (err){
                        res.json(res500);
                        throw err;
                    }
                    console.log("已修改数据库行数："+results.affectedRows);
                    resData.code = 202;
                    resData.result = [];
                    resData.message = "密码已变更，请重新登录";
                    res.json(resData);

                })
            }else {
                resData.code = 400;
                resData.result = [];
                resData.message = "密码错误，修改失败";
                res.json(resData);
            }
            conn.release();
        })
    })
});
/*
* 退出登录
* method: GET*/
router.get('/logout',function (req,res) {
    var token = req.header('token');
    pool.getConnection(function (err,conn) {
        if (err){
            res.json(res500);
            throw err;
        }
        conn.query(dbAction.user.clearToken,[token],function (err,results) {
            if (err){
                res.json(res500);
                throw err;
            }
            resData.code = 200;
            resData.result = [];
            resData.message = "已成功退出";
            res.json(resData);
            conn.release();
        })
    })
});
/*
* 禁止登录权限
* method: PUT
* */
router.put('/changeStatus',function (req,res) {
    var reqData = req.body;
    pool.getConnection(function (err,conn) {
        if (err){
            res.json(res500);
            throw err;
        }
        conn.query(dbAction.user.changeStatus,[reqData.status,reqData.userName],function (err,results) {
            if (err){
                res.json(res500);
                throw err;
            }
            resData.code = 200;
            resData.result = [];
            resData.message = "success";
            res.json(resData);
            conn.release();
        })
    })
});
/*
* 根据token返回当前用户全部信息
* method： GET*/
router.get('/testToken',function (req,res) {
    var token = req.header('token');
    pool.getConnection(function (err,conn) {
        if (err){
            res.json(res500);
            throw err;
        }
        console.log(token);
        conn.query(dbAction.employee.getOne,[token],function (err,results) {
            if (err){
                res.json(res500);
                throw err;
            }
            console.log(results);
            resData.code = 200;
            resData.result = results;
            resData.message = "success";
            res.json(resData);
            conn.release();
        })
    })
})
module.exports = router;