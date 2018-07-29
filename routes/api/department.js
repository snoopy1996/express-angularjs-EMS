var express = require('express');
var mysql = require('mysql');
var async = require("async");
var router = express.Router();
var dbConfig = require('../../db/dbConfig/dbConfig');
var dbAction = require('../../db/dbAction/dbSql');
var pool = mysql.createPool(dbConfig);
// var dbUtils = require('../../db/dbUtils/dbUtils')

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
    GET departmentList
    无参
*/
router.get('/', function(req, res, next) {
    console.log("获取部门列表");
    pool.getConnection(function (err,connection) {
        if (!err){
            connection.query(dbAction.department.getDepartmentList,function (err,result) {
                if (err){
                    res.json(res500);
                    throw err;
                }else {
                    if (result.length>0){
                        console.log('数据量',result.length);
                        var data = [];
                        async.each(result, function (item, callback) {
                            connection.query(dbAction.employee.getEmployeeName,['manager',item.departmentCode],function (err,resultName) {
                                if (err){
                                    res.json(res500);
                                    throw err;
                                }
                                if (resultName[0] && resultName[0].managerName !==''){
                                    item.managerName = resultName[0].managerName || '';
                                }
                                data.push(item);
                                callback(null,item);
                            })
                        },function (err) {
                            if (err){
                                res.json(res500);
                                throw err;
                            }
                            res.json({code:200,result:data,message:''});
                        });
                    }else res.json({code:200,result:[],message:'空数据'});
                }
                connection.release();
            })
        }else {
            res.json(res500);
            throw err;
        }
    })
});
/*
* 添加部门信息
* Method：POST
* 参数：JSON数据
* */
router.post('/',function (req,res) {
    resData.result = [];
    var data = req.body;
    pool.getConnection(function (err,conn) {
        if (err)
            throw err;
        conn.query(dbAction.department.queryDepartmentByCode, [data.departmentCode], function (err, results) {
            if (err){
                res.json(res500);
                throw err;
            }
            if (results && results.length>0){
                resData.code=401;
                resData.message="部门编号已存在";
                res.json(resData);
            }else {
                conn.query(dbAction.department.addDepartment,[data.departmentCode,data.departmentName,data.departmentPhone,data.departmentDesc],function (err,results) {
                    if (err){
                        res.json(res500);
                        throw err;
                    }

                    resData.message="添加成功";
                    res.json(resData);
                })


            }
            conn.release();
        })
    })
});
/*
* 删除部门
* Method: DELETE
* 参数：departmentCode
* */
router.delete('/',function (req,res) {
    resData.result = [];
    pool.getConnection(function (err,conn) {
        if (err){
            res.json(res500);
            throw err;
        }

        var params = req.query || req.params;
        conn.query(dbAction.department.deleteDepartment,[params.departmentCode],function (err,results) {
            if (err){
                res.json(res500);
                throw err;
            }
            console.log(results);
            resData.code = 200;
            resData.message = "success,删除"+results.affectedRows;
            res.json(resData)
            conn.release();
        })
    })
});
/*
* 修改部门信息
* Method: PUT
* 参数：部门JSON
* */
router.put('/',function (req,res) {
    resData.result = [];
    pool.getConnection(function (err,conn) {
        var data = req.body;
        conn.query(dbAction.department.updateDepartment,[data.departmentName,data.departmentPhone,data.departmentDesc,data.departmentCode],function (err,results) {
            if (err){
                res.json(res500);
                throw err;
            }
            resData.code = 200;
            resData.message = "成功修改"+results.affectedRows;
            res.json(resData);
            conn.release();
        })
    })
});
/*
* 获取部门下职位
* Method: GET
* 参数：code
* */
router.get('/positionList',function (req,res) {
    resData.result = [];
    pool.getConnection(function (err,conn) {
        if (err){
            res.json(res500);
            throw err;
        }
        var params = req.query || req.params;
        conn.query(dbAction.posi_depar.queryPositionByD,[params.departmentCode],function (err,results) {
            if (err){
                res.json(res500);
                throw err;
            }
            resData.result = results;
            resData.code = 200;
            res.json(resData);
            conn.release();
        })
    })
});
/*
* 更改部门下所有职位
* Method: POST
* 返回：list*/
router.post('/positionList',function (req,res) {
    var reqData = req.body;
    var params = req.query || req.params;
    pool.getConnection(function (err,conn) {
        if (err){
            res.json(res500);
            throw err;
        }
        if (params.departmentCode){
            console.log(dbAction.posi_depar.deleteAll);
            conn.query(dbAction.posi_depar.deleteAll,[params.departmentCode],function (err,results) {
                if (err){
                    res.json(res500);
                    throw err;
                }
                console.log('已删除部门-职位记录：'+results.affectedRows+'条');
                async.each(reqData, function (item,callback) {
                    console.log(item.positionCode, item.departmentCode);
                    conn.query(dbAction.posi_depar.insertOne,[item.positionCode, item.departmentCode],function (err,results) {
                        if (err){
                            res.json(res500);
                            throw err;
                        }
                        console.log('已添加部门-职位记录：'+results.affectedRows+'条');
                        callback(err,results);
                    })
                }, function (err) {
                    if (err){
                        res.json(res500);
                        throw err;
                    }
                    console.log('添加完毕');
                    resData.code = 200;
                    resData.result = [];
                    resData.message = "success";
                    res.json(resData);
                });
                conn.release();
            })
        }
    })
})
module.exports = router;