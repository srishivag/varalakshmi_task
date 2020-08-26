require('dotenv').config();
const CryptoJS = require('crypto-js');
const ENCRYPTION_KEY = `${process.env.SECURITY_KEY}`; // Must be 256 bytes (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16
// const jwtDecode = require('jwt-decode');
const { raw } = require('objection');
const fs = require('fs');
const request = require('request');
const nodemailer = require('nodemailer');
const path = require('path');
const dateFormat = require('dateformat');

// this function is used to encrypt the data.
// encryption key is the const key which will remain same for all the users.
// if you want more security you can pass the clientname was encryption key.
let encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

// this function is used to decrypt the data
let decrypt = (text) => {
  var words = CryptoJS.enc.Base64.parse(text);
  return CryptoJS.AES.decrypt(text, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
}

// Only Insert function for any model dynamically
let insertTable = (Model, data) => {
  const que = Model.query().insert(data).toString();
  return Model.raw(que);
}

// Only Insert function for any model dynamically
let insertTableAwait = (Model, data) => {
  return new Promise((resolve, reject) => {
    resolve(Model.query().insert(data));
  });
}

// Only Insert function for any model dynamically with transaction
let insertTabletrx = (Model, data, trx) => {
  console.log(Model.query().insert(data).toString());
  return Model.query().insert(data).transacting(trx);
}

// Insert or update function for any model
// eg: data => [{}] or {}
let insertOrUpdate = async (Model, data) => {
  const firstData = data[0] ? data[0] : data;
  const insertQuery = await Model.query().insert(data).toString()
  const onConflict = await Object.getOwnPropertyNames(firstData).map(c => c === Model.idColumn ? ',' : `${c} = VALUES(${c})`).join(',').replace(',,', '')
  const que = await `${insertQuery} ON DUPLICATE KEY UPDATE ${onConflict}`
  // console.log('que', que.toString())
  return Model.raw(que);
}

// common function to track crud operations on all tables
// in this function arguments are
// operation - I/U/D, I - Insert, U - Update, D - Delete
// table_name - crud operation table name
// done_by - emp_id, emp_id from employees table
// operation time is datetime - yyyy-mm-dd HH:ii:ss
// details are like more details of the operation
let trackAudit = async (operation, table_name, done_by, operation_time, details) => {
  const track = await Application_audit.query()
    .insert({
      operation,
      table_name,
      done_by,
      operation_time,
      details
    });
  // console.log(track.operationDetails());
  return track.operationDetails();
}

// insert or Update function using transaction
// eg: data => [{}] or {}
let insertOrUpdateTransaction = async (Model, data, trx) => {
  const firstData = data[0] ? data[0] : data;
  const insertQuery = await Model.query().insert(data).toString()
  const onConflict = await Object.getOwnPropertyNames(firstData).map(c => c === Model.idColumn ? ',' : `${c} = VALUES(${c})`).join(',').replace(',,', '')
  const que = await `${insertQuery} ON DUPLICATE KEY UPDATE ${onConflict}`
  // console.log(Model.raw(que).toString(),data);
  return Model.raw(que).transacting(trx);
}

// common function to track crud operations on all tables
// in this function arguments are
// operation - I/U/D, I - Insert, U - Update, D - Delete
// table_name - crud operation table name
// done_by - emp_id, emp_id from employees table
// operation time is datetime - yyyy-mm-dd HH:ii:ss
// details are like more details of the operation
// trx - to be send from transaction
let trackAuditTransaction = async (operation, table_name, done_by, operation_time, details, trx) => {
  const track = await Application_audit.query(trx)
    .insert({
      operation,
      table_name,
      done_by,
      operation_time,
      details
    });
  // console.log(track.operationDetails());
  return track.operationDetails();
}
let trackCronAuditTransaction = async (operation, table_name, done_by, operation_time, details, trx) => {
  const track = await Application_audit_cron.query(trx)
    .insert({
      operation,
      table_name,
      done_by,
      operation_time,
      details
    });
  // console.log(track.operationDetails());
  return track.operationDetails();
}

// syntax
// data to update
// data = {
// status: 3,
// value : raw(`value + 1`)
// }

// where conditions
// conditions = {
//   id: 1
// }
// or
// conditions = `id in (1,2,3,4,5) and ...`
// or
// conditions = null

// limit
// limit = 1 or limit = null
// commonUpdate('Model', data, conditions, limit,'transaction')

// common update function
let commonUpdate = (Model, data, condition, limit, trx) => {
  let query;
  return new Promise((resolve, reject) => {
    try {
      let upData
      // if update data is in string then aplly raw
      if (typeof data === 'string') {
        upData = raw(data);
      } else { // else direct object
        upData = data;
      }
      // query preparation
      query = Model.query(trx).update(upData);
      if (condition) query = query.whereRaw(condition);
      if (limit) query = query.limit(limit);
      //console.log(query.toString(), "FINALLL Update Query");
      resolve(query)
    } catch (error) {
      console.log(error, "$$error in common function");
      trx.rollback()
      reject(error)
    }
  })
}

// syntax
// commonSelectQuery('Model', 'ModelAlias / null', {
//   selectList: `h.id, h.name, sum(h.age)`,
//   joins: [
//     { type: 'inner', tableName: '', alias: '', onConditions: `h.id = p.id and p.status = 1` },
// { type: 'relation', tableName: 'zone', alias: 'zo' }
//   ],
// where: null, // null / string
// having: null, // null / string
// groupBy: null, // null / string
// orderBy: null, // null / string
// limit: 1 // null / number
// })

// common select function for retreive all types of select queries
// not suported union, custom joins
let commonSelectQuery = (Model, ModelAlias, allData) => {
  let query;
  return new Promise((resolve, reject) => {
    try {
      // 1 model
      query = Model.query();
      // 2 alias
      if (ModelAlias) query = query.alias(ModelAlias);
      // 3 select list
      query = query.select(raw(allData.selectList));
      // 4 joins
      if (allData.joins) {
        for (const row of allData.joins) {
          switch (row.type) {
            case 'left':
              query = query.leftJoin(`${row.tableName} as ${row.alias}`, raw(row.onConditions));
              break;
            case 'right':
              query = query.rightJoin(`${row.tableName} as ${row.alias}`, raw(row.onConditions));
              break;
            case 'inner':
              query = query.innerJoin(`${row.tableName} as ${row.alias}`, raw(row.onConditions));
              break;
            case 'full':
              query = query.fullOuterJoin(`${row.tableName} as ${row.alias}`, raw(row.onConditions));
              break;
            case 'relation':
              query = query.joinRelation(`${row.tableName} as ${row.alias}`);
              break;
            case 'inner-relation':
              query = query.innerJoinRelation(`${row.tableName}`);
              break;
            case 'left-relation':
              query = query.leftJoinRelation(`${row.tableName}`);
              break;
            case 'right-relation':
              query = query.rightJoinRelation(`${row.tableName}`);
              break;
            default:
              break;
          }
        }
      }
      // 5 where
      if (allData.where) query = query.whereRaw(allData.where);
      // 6 having
      if (allData.having) query = query.havingRaw(allData.having);
      // 7 group by
      if (allData.groupBy) query = query.groupByRaw(allData.groupBy);
      // 8 order by
      if (allData.orderBy) query = query.orderByRaw(allData.orderBy);
      // 9 limit
      if (allData.limit) query = query.limit(allData.limit);

      // console.log(query.toString(), "FINAL Select Query ***");
      resolve(query)
    } catch (error) {
      // console.log(error, "$$error in common function");
      reject(error)
    }
  })
}

/**
 * method to read Data from JWT Token
 */
// export async function decodeJwtToken(token) {
//   var decoded = jwtDecode(token);

//   return decoded.role;
// }


// let returnresult = async (reply, data) => {
//   return await reply({
//     statusCode: data.statusCode,
//     success: data.sucess,
//     error: data.errmsg,
//     message: data.message,
//     data: data.result
//   });
// }
/*
let commonconnection =async() =>{
  const connection2 = require('knex')({
    client: 'mysql',
    connection: {
      host: '192.168.2.7',
      user: 'root',
      password: 'EnMontoR',
      database: 'adhrs_product',
      charset: 'utf8'
    },
    pool: {
      min: 1,
      max: 10
    }
  });

  return  connection2;
}
*/
// function to encode file data to base64 encoded string
let base64_encode = async (filePath) => {
  // read binary data
  var bitmap = fs.readFileSync(filePath);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}

// function to create file from base64 encoded string
let base64_decode = async (base64str, file) => {
  // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
  var bitmap = new Buffer(base64str, 'base64');
  // write buffer to file
  fs.writeFileSync(file, bitmap);
  // console.log('******** File created from base64 encoded string ********');
}


let mail = async (message, tomail, ccmail, sub, html, emp_id) => {

  return new Promise((resolve, reject) => {
    // resolve(true);
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: process.env.MAIL_SECURE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: process.env.FROM_EMAIL, // sender address
      to: tomail, // list of receivers
      subject: sub,
      text: message, // plain text body
      html
    };

    if (ccmail) {
      mailOptions.cc = ccmail;
    }

    if (message) {
      console.log(`message ok`);
      transporter.sendMail(mailOptions, error => {
        if (error) {
          console.log(`error is`, error);
          reject(error);
        } else {
          const data = {
            emp_id,
            message,
            code: 'mail',
            type: 'email'
          };
          insertTable(sms_messages_logs, data).then(async (data) => {
            console.log(data);
          }).catch(err => {
            console.log(err);
          });
        }
        console.log(`no error`);
        resolve({
          success: true,
          message: 'Mail sent'
        });
      });
    }
  });
}

let sms = async (to, message, emp_id) => {
  // return;
  console.log('sms', to, message)
  return new Promise(async resolve => {
    // resolve(true);
    if (to && message) {
      const url = process.env.SMS_URL;
      const body = {
        username: process.env.SMS_USER,
        password: process.env.SMS_PASSWORD,
        from: process.env.SMS_FROM,
        to,
        msg: message,
        type: '1',
        dnd_check: '0'
      };
      console.log(body, url);
      await request.post(
        url, {
          form: body
        },
        (error, response) => {
          if (!error && parseInt(response.statusCode, 10) === 200) {
            console.log(response.body.trim());
            const data = {
              emp_id,
              message,
              code: response.body.trim(),
              type: 'sms'
            };

            insertTable(sms_messages_logs, data).then(async (data) => {}).catch(err => {
              console.log(err);
            });
            console.log('testing data')
            resolve({
              success: true,
              data: 'SMS sent successfully'
            });
          } else {
            console.log(`SMS failed`);
            resolve({
              success: false,
              message: 'SMS failed'
            });
          }
        }
      );
    } else {
      return {
        success: false,
        message: 'To or Message missing'
      };
    }
  });
}


// update based on condition in employee table
let updatelastlogin = (tablemap, colname, condkey, condvalue) => {
  return new Promise((resolve, reject) => {
      tablemap.query()
          .update(colname)
          .where(condkey, `${condvalue}`)
          .then(result => {
              resolve(result);
          }).catch(error => {
              reject(error);
          })
  })
};

module.exports = {
  encrypt,
  decrypt,
  insertTable,
  insertTabletrx,
  insertOrUpdate,
  trackAudit,
  insertOrUpdateTransaction,
  trackAuditTransaction,
  commonUpdate,
  commonSelectQuery,
  base64_encode,
  base64_decode,
  mail,
  sms,
  insertTableAwait,
  trackCronAuditTransaction,
  updatelastlogin
}