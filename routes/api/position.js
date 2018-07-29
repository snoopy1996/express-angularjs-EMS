var express = require('express');
var mysql = require('mysql');
var async = require("async");
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
* 获取全部职位信息
* Method: GET
* 无参*/
router.get('/', function(req, res) {
    pool.getConnection(function (err,conn) {
        if (err){
            res.json(res500);
            throw err;
        }
        conn.query(dbAction.position.queryPositionList,function (err,results) {
            if (err){
                res.json(res500);
                throw err;
            }
            resData={
                code:200,
                result:results,
                message:""
            };
            res.json(resData);
            conn.release();
        })
    })
});
/*
* 增加职位信息
* Method: POST
* 参数： positionJSON*/
router.post('/',function (req,res) {
    var reqData = req.body;
    pool.getConnection(function (err,conn) {
        if (err){
            res.json(res500);
            throw err;
        }
        console.log(reqData);
        conn.query(dbAction.position.insertOne,[reqData.positionCode,reqData.positionName,reqData.positionRemark,reqData.positionBasicMoney],function (err,results) {
            if (err){
                res.json(res500);
                throw err;
            }
            console.log("已添加职位信息，"+results.affectedRows+'条');
            resData.code = 200;
            resData.message = "success";
            res.json(resData);
            conn.release();
        })
    })
});
/*
* 修改职位信息
* Method: PUT
* 参数：positionJSON*/
router.put('/',function (req,res) {
    var reqData = req.body;
    pool.getConnection(function (err,conn) {
        if (err){
            res.json(res500);
            throw err;
        }
        conn.query(dbAction.position.updateOne,[reqData.positionName,reqData.positionRemark,reqData.positionBasicMoney,reqData.positionCode],
        function (err,results) {
            if (err){
                res.json(res500);
                throw err;
            }
            console.log("已修改职位信息，"+results.affectedRows+'条');
            resData.code = 200;
            resData.result = [];
            resData.message = "success";
            res.json(resData);
            conn.release();
        });
    })
});
/*
* 删除职位信息
* Method：DELETE
* 参数：positionCode*/
router.delete('/',function (req,res) {
    var param = req.query || req.params;
    pool.getConnection(function (err,conn) {
        if (err){
            res.json(res500);
            throw err;
        }
        conn.query(dbAction.position.deleteOne,[param.positionCode],function (err,results) {
            if (err){
                res.json(res500);
                throw err;
            }
            console.log("已删除职位信息"+results.affectedRows+"条");
            resData.code = 200;
            resData.message = "success";
            res.json(resData);
            conn.release();
        })
    })
});
module.exports = router;