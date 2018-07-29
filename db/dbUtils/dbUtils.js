var mysql = require('mysql');
var async = require("async");
var dbConfig = require('../../db/dbConfig/dbConfig');
var dbAction = require('../dbAction/dbSql');
var pool = mysql.createPool(dbConfig);


var dbUtils = {
    department:{
        selectDepartmentByCode: function (departmentCode,callback) {    //查询部门编号是否存在
            var res = {boo: true, message: ""};
            async.series([function (callback) {
                pool.getConnection(function (err, conn) {
                    if (!err) {
                        conn.query(dbAction.department.queryDepartmentByCode, [departmentCode], function (err, results) {
                            if (err) {
                                res.boo = false;
                                res.message = err;
                                callback(null ,res)
                            } else if (results.length > 0) {
                                res.boo = false;
                                res.message = "部门已存在！";
                                console.log("查询结果部门已存在");
                                callback(null ,res)
                            }
                            conn.release();
                        })
                    } else {
                        res.boo = false;
                        res.message = err;
                        callback(null ,res)
                    }
                });

            }],function (err,results) {
                console.log(results);
                callback(results);
            });
        },
        insertDepartment: function (data,callback) {

        }
    }
};
module.exports = dbUtils;