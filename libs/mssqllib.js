const mssql = require("mssql");

function MSSQLLib(cfg) {
  let that = this;
  that.cfg = cfg;
  that.conn = new mssql.ConnectionPool(cfg.db);

  that.conn.on('error', err => {
    if (err) {
      throw err;
    }
  });

  that.conn.connect(err => {
    if (err) {
      console.error(err);
    }
  });
}

MSSQLLib.prototype.querySql = async function (sql, params, callBack) {
  try {
    let ps = new mssql.PreparedStatement(this.conn);
    if (params != "") {
      for (var index in params) {
        if (typeof params[index] == "number") {
          ps.input(index, mssql.Int);
        } else if (typeof params[index] == "string") {
          ps.input(index, mssql.NVarChar);
        }
      }
    }
    ps.prepare(sql, err => {
      if (err)
        console.log(err);
      ps.execute(params, (err, recordset) => {
        callBack(err, recordset);
        ps.unprepare(err => {
          if (err)
            console.log(err);
        });
      });
    });
  } catch (err) {
    console.error('SQL error', err);
  }
};

MSSQLLib.prototype.select = async function (tableName, topNumber, whereSql, params, orderSql, callBack) {
  try {
    var ps = new mssql.PreparedStatement(this.conn);
    var sql = "select * from " + tableName + " ";
    if (topNumber != "") {
      sql = "select top(" + topNumber + ") * from " + tableName + " ";
    }
    sql += whereSql + " ";
    if (params != "") {
      for (var index in params) {
        if (typeof params[index] == "number") {
          ps.input(index, mssql.Int);
        } else if (typeof params[index] == "string") {
          ps.input(index, mssql.NVarChar);
        }
      }
    }
    sql += orderSql;
    console.log(sql);
    ps.prepare(sql, err => {
      if (err)
        console.log(err);
      ps.execute(params, (err, recordset) => {
        callBack(err, recordset);
        ps.unprepare(err => {
          if (err)
            console.log(err);
        });
      });
    });
  } catch (err) {
    console.error('SQL error', err);
  }
};

MSSQLLib.prototype.selectAll = async function (tableName, callBack) {
  try {
    var ps = new mssql.PreparedStatement(this.conn);
    var sql = "select * from " + tableName + " ";
    ps.prepare(sql, err => {
      if (err)
        console.log(err);
      ps.execute("", (err, recordset) => {
        callBack(err, recordset);
        ps.unprepare(err => {
          if (err)
            console.log(err);
        });
      });
    });
  } catch (err) {
    console.error('SQL error', err);
  }
};

MSSQLLib.prototype.add = async function (addObj, tableName, callBack) {
  try {
    var ps = new mssql.PreparedStatement(this.conn);
    var sql = "insert into " + tableName + "(";
    if (addObj != "") {
      for (var index in addObj) {
        if (typeof addObj[index] == "number") {
          ps.input(index, mssql.Int);
        } else if (typeof addObj[index] == "string") {
          ps.input(index, mssql.NVarChar);
        }
        sql += index + ",";
      }
      sql = sql.substring(0, sql.length - 1) + ") values(";
      for (var index in addObj) {
        if (typeof addObj[index] == "number") {
          sql += addObj[index] + ",";
        } else if (typeof addObj[index] == "string") {
          sql += "'" + addObj[index] + "'" + ",";
        }
      }
    }
    sql = sql.substring(0, sql.length - 1) + ")";
    ps.prepare(sql, err => {
      if (err)
        console.log(err);
      ps.execute(addObj, (err, recordset) => {
        callBack(err, recordset);
        ps.unprepare(err => {
          if (err)
            console.log(err);
        });
      });
    });
  } catch (err) {
    console.error('SQL error', err);
  }
};

MSSQLLib.prototype.update = async function (updateObj, whereObj, tableName, callBack) {
  try {
    var ps = new mssql.PreparedStatement(this.conn);
    var sql = "update " + tableName + " set ";
    if (updateObj != "") {
      for (var index in updateObj) {
        if (typeof updateObj[index] == "number") {
          ps.input(index, mssql.Int);
          sql += index + "=" + updateObj[index] + ",";
        } else if (typeof updateObj[index] == "string") {
          ps.input(index, mssql.NVarChar);
          sql += index + "=" + "'" + updateObj[index] + "'" + ",";
        }
      }
    }
    sql = sql.substring(0, sql.length - 1) + " where ";
    if (whereObj != "") {
      for (var index in whereObj) {
        if (typeof whereObj[index] == "number") {
          ps.input(index, mssql.Int);
          sql += index + "=" + whereObj[index] + " and ";
        } else if (typeof whereObj[index] == "string") {
          ps.input(index, mssql.NVarChar);
          sql += index + "=" + "'" + whereObj[index] + "'" + " and ";
        }
      }
    }
    sql = sql.substring(0, sql.length - 5);
    ps.prepare(sql, err => {
      if (err)
        console.log(err);
      ps.execute(updateObj, (err, recordset) => {
        callBack(err, recordset);
        ps.unprepare(err => {
          if (err)
            console.log(err);
        });
      });
    });
  } catch (err) {
    console.error('SQL error', err);
  }
};

MSSQLLib.prototype.del = async function (whereSql, params, tableName, callBack) {
  try {
    var ps = new mssql.PreparedStatement(this.conn);
    var sql = "delete from " + tableName + " ";
    if (params != "") {
      for (var index in params) {
        if (typeof params[index] == "number") {
          ps.input(index, mssql.Int);
        } else if (typeof params[index] == "string") {
          ps.input(index, mssql.NVarChar);
        }
      }
    }
    sql += whereSql;
    ps.prepare(sql, err => {
      if (err)
        console.log(err);
      ps.execute(params, (err, recordset) => {
        callBack(err, recordset);
        ps.unprepare(err => {
          if (err)
            console.log(err);
        });
      });
    });
  } catch (err) {
    console.error('SQL error', err);
  }
};

module.exports = MSSQLLib;