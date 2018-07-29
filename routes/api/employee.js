var express = require('express');
var mysql = require('mysql');
var async = require("async");
var router = express.Router();
var dbConfig = require('../../db/dbConfig/dbConfig');
var dbAction = require('../../db/dbAction/dbSql');
var pool = mysql.createPool(dbConfig);

//返回数据格式顶定义
var resData = {
    code: 200,
    result: [],
    message: ""
};
//未知错误返回
var res500 = {
    code: 500,
    result: [],
    message: "后台服务错误"
};

/*
 * 获取员工列表
 * method:get
 * */
router.get('/', function (req, res) {
    pool.getConnection(function (err, conn) {
        if (err) {
            res.json(res500);
            throw err;
        }
        conn.query(dbAction.employee.getEmployeeList, function (err, results) {
            if (err) {
                res.json(res500);
                throw err;
            }
            resData = {
                code: 200,
                result: results,
                message: ''
            };
            res.json(resData);
            conn.release();
        })
    })
});
/*
 * 添加员工信息
 * method:post
 * 同时向工资表添加信息，前端调用接口注册
 * */
router.post('/', function (req, res) {
    var reqData = req.body;
    console.log(reqData.employeeDepartmentCode);
    pool.getConnection(function (err, conn) {
        if (err) {
            res.json(res500);
            throw err;
        }
        conn.query(dbAction.employee.getOne,[reqData.employeeCode], function (err, results) {
            if (err) {
                res.json(res500);
                throw err;
            }
            if (results && results.length > 0) {
                resData = {
                    code: 401,
                    result: results,
                    message: '员工' + reqData.employeeCode + '已存在！'
                }
                res.json(reqData);
            } else {
                var date = new Date();
                conn.query(dbAction.employee.insertOne, [reqData.employeeCode, reqData.employeeName, reqData.employeePhone,
                    reqData.employeeDepartmentCode, reqData.employeePositionCode, date], function (err, results) {
                    if (err) {
                        res.json(res500);
                        throw err;
                    }
                    console.log(results);
                    conn.query(dbAction.wages.insertOne, [reqData.employeeCode, reqData.basicMoney, reqData.bonusMoney, reqData.deleteMoney,
                        reqData.addMoney], function (err, results) {
                        if (err) {
                            res.json(res500);
                            throw err;
                        }
                        resData = {
                            code: 200,
                            result: results,
                            message: ''
                        };
                        res.json(resData);
                    });

                })
            }
            conn.release();
        })

    })
});

/*
 * 修改员工信息
 * method:put
 * 管理员使用
 * 备注：同时更新用户表用户状态信息以及工资表记录信息
 * */
router.put('/', function (req, res) {
    var reqData = req.body;
    pool.getConnection(function (err, conn) {
        if (err) {
            res.json(res500);
            throw err;
        }
        conn.query(dbAction.employee.updateOneAdmin, [reqData.employeeName, reqData.employeePhone, reqData.employeeDepartmentCode,
            reqData.employeePositionCode, reqData.employeeCode], function (err, results) {
            if (err) {
                console.log("修改基本信息是啊比");
                res.json(res500);
                throw err;
            } else if (results.affectedRows > 0) {
                conn.query(dbAction.user.changeStatusAndRole, [reqData.status, reqData.role, reqData.employeeCode], function (err, results) {
                    if (err) {
                        console.log("修改用户失败");
                        res.json(res500);
                        throw err;
                    } else if (results.affectedRows > 0) {
                        conn.query(dbAction.wages.updateOne, [reqData.basicMoney, reqData.bonusMoney, reqData.deleteMoney, reqData.addMoney, reqData.employeeCode]
                            , function (err, results) {
                                if (err) {
                                    console.log("修改工资四百");
                                    res.json(res500);
                                    throw err;
                                }
                                resData = {
                                    code: 200,
                                    result: results,
                                    message: ''
                                };
                                res.json(resData);
                            })
                    } else {
                        resData = {
                            code: 405,
                            result: results,
                            message: '修改认证失败'
                        };
                        res.json(resData);
                    }
                })
            } else {
                resData = {
                    code: 405,
                    result: results,
                    message: '修改信息失败'
                };
                res.json(resData);
            }
            conn.release();
        })
    })
});
/*
 * 修改员工信息
 * method:put
 * 普通用户使用
 * */
router.put('/updateOne', function (req, res) {
    var reqData = req.body;
    pool.getConnection(function (err, conn) {
        if (err) {
            res.json(res500);
            throw err;
        }
        var brothDate = new Date(reqData.brothDate);
        conn.query(dbAction.employee.updateOneUser, [reqData.employee_phone, reqData.sex, reqData.age, reqData.marry, reqData.graduate,
            reqData.nation, brothDate, reqData.faith, reqData.identity, reqData.politice, reqData.QQ, reqData.weChat, reqData.jiguan,
            reqData.employee_code], function (err, results) {
            if (err) {
                res.json(res500);
                throw err;
            }
            resData = {
                code: 200,
                result: results,
                message: ''
            };
            res.json(resData);
            conn.release();
        })
    })
});

/*
 * 删除员工信息
 * method：delete
 * 备注：数据表设计已经级联删除用户表以及工资表相关信息
 * */
router.delete('/', function (req, res) {
    var param = req.query || req.params;
    pool.getConnection(function (err, conn) {
        if (err) {
            res.json(res500);
            throw err;
        }
        conn.query(dbAction.employee.deleteOne, [param.employeeCode], function (err, results) {
            if (err) {
                res.json(res500);
                throw err;
            }
            if (results.affectedRows > 0){
                resData = {
                    code: 200,
                    result: results,
                    message: 'success'
                };
                res.json(resData);
            }else {
                resData = {
                    code: 401,
                    result: results,
                    message: '删除失败'
                };
                res.json(resData);
            }

            conn.release();
        })
    })
})
module.exports = router;