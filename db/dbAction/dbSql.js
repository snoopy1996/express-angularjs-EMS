var allTable = {
    department:{
        getDepartmentList: 'select d.department_code departmentCode,d.department_name departmentName, d.department_phone ' +
            'departmentPhone,d.department_desc departmentDesc,count(e.employee_code) peopleCount from' +
            ' department d left join' +
            ' employee e' +
            ' on d.department_code = e.employee_department_code' +
            ' group by d.department_code',
        addDepartment: 'insert into department (department_code,department_name,department_phone,department_desc) values (?,?,?,?)',
        queryDepartmentByCode: 'select department_code departmentCode from department where department_code = ?',
        deleteDepartment: 'delete from department where department_code = ?',
        updateDepartment: 'update department set department_Name = ?,department_phone = ?,department_desc = ? where department_code = ?'
    },
    posi_depar:{
        queryPositionByD: 'select p.position_code positionCode,p.position_name positionName,p.position_basic_money basicMoney ' +
        'from my_position p,posi_depar dp ' +
        'where p.position_code = dp.position_code and dp.department_code = ?',
        deleteAll: 'delete from posi_depar where department_code = ?',
        insertOne: 'insert into posi_depar (position_code,department_code) values (?,?)'
    },
    employee:{
        getEmployeeName: "select employee_name managerName from employee where employee_position_code = ? and employee_department_code = ?",
        getEmployeeList: "select e.employee_code employeeCode,e.employee_name employeeName,e.employee_phone employeePhone,d.department_name departmentName," +
        "p.position_name positionName,e.employee_indate employeeIndate,u.status,e.employee_department_code employeeDepartmentCode,e.employee_position_code employeePositionCode, " +
        "w.basic_money basicMoney,w.bonus_money bonusMoney,w.delete_money deleteMoney,w.add_money addMoney, " +
        "u.role role,u.status status " +
        "from " +
        "employee as e " +
        "left join department as d on e.employee_department_code = d.department_code " +
        "left join my_position as p on e.employee_position_code = p.position_code " +
        "left join wages as w on e.employee_code = w.employee_code " +
        "left join user as u on e.employee_code = u.user_name " +
        "where e.employee_code != 'admin'",
        getOne: "select e.*,p.position_name positionName,e.employee_indate employeeIndate,e.employee_department_code employeeDepartmentCode,d.department_name departmentName," +
        "e.employee_position_code employeePositionCode, w.basic_money basicMoney,w.bonus_money bonusMoney,w.delete_money deleteMoney,w.add_money addMoney, " +
        "u.role role,u.user_name userName " +
        "from " +
        "employee as e " +
        "left join department as d on e.employee_department_code = d.department_code " +
        "left join my_position as p on e.employee_position_code = p.position_code " +
        "left join wages as w on e.employee_code = w.employee_code " +
        "left join user as u on e.employee_code = u.user_name " +
        "where u.token = ?",
        updateOneAdmin: "update employee set employee_name = ?,employee_phone = ?,employee_department_code = ?, " +
        "employee_position_code = ? where employee_code = ?",
        updateOneUser: "update employee set employee_phone = ?,sex = ?, age = ?, " +
        "marry = ?, graduate = ?,nation = ?,brothDate = ?,faith = ?,identity = ?,politice = ?,QQ = ?,weChat = ?," +
        "jiguan = ? where employee_code = ?",
        insertOne: "insert into employee (employee_code,employee_name,employee_phone,employee_department_code,employee_position_code,employee_indate) values (?,?,?,?,?,?)",
        deleteOne: "delete from employee where employee_code = ?"
    },
    position:{
        queryPositionList: 'select position_code positionCode,position_name positionName,position_remark positionRemark,position_basic_money positionBasicMoney ' +
        'from my_position',
        insertOne: 'insert into my_position (position_code, position_name, position_remark, position_basic_money) values (?,?,?,?)',
        updateOne: 'update my_position set position_name = ?,position_remark = ?, position_basic_money = ? where position_code = ?',
        deleteOne: 'delete from my_position where position_code = ?'
    },
    wages:{
        insertOne: 'insert into wages (employee_code,basic_money,bonus_money,delete_money,add_money) values (?,?,?,?,?)',
        updateOne: 'update wages set basic_money = ?,bonus_money = ?,delete_money = ?,add_money = ? where employee_code = ?',
        queryOne: 'select basic_money basicMoney,bonus_money bonusMoney,delete_money deleteMoney,add_money addMoney where employee_code = ?'
    },
    user:{
        queryUser: 'select user_name userName,password,role,token,status from user where user_name = ?',
        setUserToken: 'update user set token = ? where user_name = ?',
        setUserPass: 'update user set password = ? where user_name = ?',
        clearToken: "update user set token = '' where token = ?",
        insertOne: 'insert into user (user_name,password,role,status) values (?,?,?,?)',
        queryUserByT: 'select user_name userName,password,role,status from user where token = ?',
        changeStatusAndRole: 'update user set status = ?,role = ? where user_name = ?',
        deleteUser: 'delete from user where user_name = ?'
    }
};
module.exports = allTable;