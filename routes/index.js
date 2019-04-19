var express = require('express');
var router = express.Router();

var mysql = require('mysql')
// var conn = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'comp@113',
//   database: 'db_pack'
// });

var db_config = {
  host: 'localhost',
  user: 'root',
  password: 'comp@113',
  database: 'db_pack'
};

var conn;

function handleDisconnect() {
  conn = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  conn.connect(function (err) { // The server is either down
    if (err) { // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  conn.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else { // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}

handleDisconnect();



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'บ้านบรรจุภัณฑ์'
  });
});

router.get('/seller', (req, res) => {
  //res.send("TEST")

  var sql = "SELECT * FROM seller"
  conn.query(sql, (err, result) => {
    //console.log(result);
    res.render('seller', {
      title: 'บ้านบรรจุภัณฑ์',
      titleHead: 'ผู้ขาย',
      data: result
    })
  })

})

router.get('/sellerlist', (req, res) => {
  //res.send("TEST")

  var sql = "SELECT * FROM seller"
  conn.query(sql, (err, result) => {
    //console.log(result);
    res.send(result)
  })
})

router.get('/newproduct/:id', (req, res) => {
  let id = req.params.id
  let sql = "SELECT * FROM new_product WHERE id = " + id
  conn.query(sql, (err, result) => {
    res.send(result)
  })
})


router.get('/rec', (req, res) => {
  res.render('rec', {
    title: 'ใบส่งของ'
  })
})

router.get('/rec/:id', (req, res) => {
  let id = req.params.id
  //var sql = "SELECT * FROM seller where id_seller =" + id
  let sql = "SELECT *, seller.id_seller AS main_id_seller"
  sql += " FROM new_product INNER JOIN seller ON new_product.id_seller = seller.id_seller"
  sql += " WHERE seller.id_seller = " + id
  conn.query(sql, (err, result) => {
    //res.send(result)
    res.render('rec', {
      title: 'บ้านบรรจุภัณฑ์',
      data: result
    })
  })
})

router.get('/recSeller', (req, res) => {
  var sql = "SELECT * FROM seller"
  conn.query(sql, (err, result) => {
    //console.log(result);
    res.render('recSeller', {
      title: 'บ้านบรรจุภัณฑ์',
      titleHead: 'ผู้ขาย',
      data: result
    })
  })
})

router.post('/addStock', (req, res) => {
  let object = req.body
  let nGetId = req.body
  let numGetId = nGetId.getId.length

  let totalUnit = 0;
  let oldAvg = 0
  let newAvg = 0
  let totalAvg = 0
  //let total = 0

  console.log("Loop :" + numGetId);
  //console.log(object[0].getUnit);
  //console.log(object.getId.length);


  let objLoop = 0
  if (numGetId > 1) {
    objLoop = object.getId.length;
  } else {
    objLoop = 1
  }
  console.log("objLoop " + objLoop);
  for (let i = 0; i < objLoop; i++) {
    //for (const key in dataID) {
    //if (dataID.hasOwnProperty(key)) {


    let sql_idStock = "SELECT * FROM new_product WHERE id = " + object.getId[i]
    conn.query(sql_idStock, (err, result) => {
      console.log(result[0].id_stock);
      console.log(result[0].cost);
      // Insert OR Update
      let sql_in_up = "SELECT * FROM new_stock WHERE stock_id_stock = " + result[0].id_stock
      conn.query(sql_in_up, (err, result_in_up) => {
        if (result_in_up != "") {
          let reInUp = result_in_up
          //update
          console.log("update******");
          console.log(reInUp[0].stock_unit);
          console.log(reInUp[0].stock_cost);
          console.log("update-----");

          oldAvg = parseInt(reInUp[0].stock_unit) * parseFloat(reInUp[0].stock_cost)
          console.log("oldAvt = " + oldAvg);
          if (numGetId > 1) {
            newAvg = parseInt(object.getUnit[i]) * result[0].cost
            totalUnit = parseInt(reInUp[0].stock_unit) + parseInt(object.getUnit[i])
          } else {
            newAvg = parseInt(object.getUnit) * result[0].cost
            totalUnit = parseInt(reInUp[0].stock_unit) + parseInt(object.getUnit)
          }

          totalAvg = (oldAvg + newAvg) / totalUnit



          let sql_upd = "UPDATE new_stock SET "
          // Check length Object BUG
          if (numGetId > 1) {
            //totalUnit = parseInt(reInUp[0].stock_unit) + parseInt(object.getUnit[i])
            sql_upd += "stock_unit = '" + totalAvg + "' "
          } else {
            //totalUnit = parseInt(reInUp[0].stock_unit) + parseInt(object.getUnit)
            sql_upd += "stock_unit = '" + totalAvg + "' "
          }

          sql_upd += "WHERE stock_id_stock = " + result[0].id_stock
          console.log(sql_upd);
          conn.query(sql_upd, (err, result_upd) => {
            console.log("update is success");
          })
        } else {
          // insert
          console.log("insert");
          let sql_ins = "INSERT INTO new_stock (stock_id_stock,stock_unit,stock_cost)"
          // Check length Object BUG
          if (numGetId > 1) {
            sql_ins += "VALUES('" + result[0].id_stock + "', '" + object.getUnit[i] + "', '599')"
          } else {
            sql_ins += "VALUES('" + result[0].id_stock + "', '" + object.getUnit + "', '599')"
          }
          console.log(sql_ins);
          conn.query(sql_ins, (err, result_ins) => {
            console.log("insert is success");
          })
        }
      })
    })
    // } // hasOwnProperty
  } // end Loop
  setTimeout(() => {
    res.redirect('Stock')
  }, 1500);
})

router.post('/newAddStock', (req, res) => {
  let obj = req.body
  //res.send('new add 2')
  console.log(obj);
  console.log(typeof (obj));
  console.log("-------------");


  let arr1 = {}
  for (var key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      vKey = key
      vVal = req.body[key]
      arr1[vKey] = vVal
    }
  }
  //let jj = JSON.parse(arr1.getId);
  console.log(typeof (arr1.getId));
  let chkTpye = typeof (arr1.getId);

  console.log("chkType =" + chkTpye);
  console.log("-------------");
  //let valUnit = ''

  let valId = new Array()
  let valUnit = new Array()
  let valIdSeller = new Array()
  let valDo = new Array()
  let valDate = new Array()

  let arrLenght = 0
  if (chkTpye === "string") {
    //jj = JSON.parse(arr1.getId);
    valId[0] = arr1.getId
    valUnit[0] = arr1.getUnit
    valIdSeller[0] = arr1.getIdSeller
    valDo[0] = arr1.getDo
    valDate[0] = arr1.getDate
    arrLenght = 1

    console.log("valDo = " + valDo[0]);
    console.log("valDate = " + valDate[0]);


    let sql_idStock = "SELECT * FROM new_product WHERE id = " + valId[0]
    conn.query(sql_idStock, (err, result) => {
      console.log("id_stock = " + result[0].id_stock);
      console.log("cost = " + result[0].cost);
      console.log("--------------");


      let sql_in_up = "SELECT * FROM new_stock WHERE stock_id_stock = " + result[0].id_stock
      console.log(sql_in_up);

      conn.query(sql_in_up, (err, result_in_up) => {
        if (result_in_up != "") {
          let dataId = result_in_up[0].id
          let dataUnit = parseInt(result_in_up[0].stock_unit) + parseInt(valUnit[0])

          let dataCostNew = result[0].cost * valUnit[0]
          console.log("dataCostNew = " + dataCostNew);

          let dataCostOld = result_in_up[0].stock_cost * result_in_up[0].stock_unit
          console.log("dataCostOld = " + dataCostOld);

          let plusDataNewOld = parseFloat(dataCostNew) + parseFloat(dataCostOld)
          let dataCost = plusDataNewOld / dataUnit

          console.log("update");
          console.log("dataId = " + dataId);
          console.log("dataUnit = " + dataUnit);
          console.log("dataCost = " + dataCost);

          let sqlUpdate = "UPDATE new_stock SET "
          sqlUpdate += "stock_unit = " + dataUnit
          sqlUpdate += ",stock_cost = " + dataCost
          sqlUpdate += " WHERE id = " + dataId

          console.log("sqlUpdate = " + sqlUpdate);

          conn.query(sqlUpdate, (err, resultUpdate) => {
            console.log("update Ok");
            res.redirect('stock')
          })

        } else {
          console.log("insert");
        }
      })

    })
  } else {
    console.log("######## More 1 list ###########");

    arrLenght = arr1.getId.length // Check Loop

    for (let i = 0; i < arrLenght; i++) {
      valId[i] = arr1.getId[i]
      valUnit[i] = arr1.getUnit[i]
      valIdSeller[i] = arr1.getIdSeller
      valDo[i] = arr1.getDo
      valDate[i] = arr1.getDate

      console.log("valDo = " + valDo[i]);
      console.log("valDate = " + valDate[i]);

      let sql_idStock = "SELECT * FROM new_product WHERE id = " + valId[i]
      conn.query(sql_idStock, (err, result) => {
        console.log("id_stock = " + result[0].id_stock);
        console.log("cost = " + result[0].cost);
        console.log("--------------");

        let sql_in_up = "SELECT * FROM new_stock WHERE stock_id_stock = " + result[0].id_stock
        console.log(sql_in_up);
        conn.query(sql_in_up, (err, result_in_up) => {
          if (result_in_up != "") {
            console.log("update multi");
            let dataId = result_in_up[0].id
            let dataUnit = parseInt(result_in_up[0].stock_unit) + parseInt(valUnit[0])

            let dataCostNew = result[0].cost * valUnit[0]
            console.log("dataCostNew = " + dataCostNew);

            let dataCostOld = result_in_up[0].stock_cost * result_in_up[0].stock_unit
            console.log("dataCostOld = " + dataCostOld);

            let plusDataNewOld = parseFloat(dataCostNew) + parseFloat(dataCostOld)
            let dataCost = plusDataNewOld / dataUnit

            console.log("update");
            console.log("dataId = " + dataId);
            console.log("dataUnit = " + dataUnit);
            console.log("dataCost = " + dataCost);

            let sqlUpdate = "UPDATE new_stock SET "
            sqlUpdate += "stock_unit = " + dataUnit
            sqlUpdate += ",stock_cost = " + dataCost
            sqlUpdate += " WHERE id = " + dataId

            console.log("sqlUpdate = " + sqlUpdate);

            conn.query(sqlUpdate, (err, resultUpdate) => {
              console.log("Multi update Ok");
            })
          } else {
            console.log("insert multi");
          }
        })

        console.log("------sql_in_up--------");
      })
    }
  }
  // ใช้งานชุดนี้
  /*
  console.log("valId = " + valId[0]);
  console.log("valUnit = " + valUnit[0]);
  console.log("valSeller = " + valIdSeller[0]);
  console.log("valId = " + valId[1]);
  console.log("valUnit = " + valUnit[1]);
  console.log("valSeller = " + valIdSeller[1]);
  console.log("arrLength = " + arrLenght); // number Loop
  */
  //
})




///###########
/*
router.post('/addStock', (req, res) => {
  let object = req.body
  console.log(object.getId.length);

  res.send(req.body)
})
*/
////##############


router.get('/stock', (req, res) => {
  let sql = "SELECT * FROM new_stock "
  sql += "INNER JOIN new_product ON new_stock.stock_id_stock = new_product.id_stock "
  sql += "GROUP BY new_product.id_stock"

  conn.query(sql, (err, result) => {
    res.render('stock', {
      title: 'บ้านบรรจุภัณฑ์',
      titleName: 'สินค้า/สต็อกสินค้า',
      data: result
    })
    //console.log(result);
  })

})


router.get('/setting', (req, res) => {
  let sql = "SELECT *,seller.id_seller as main_id_seller FROM new_stock "
  sql += "INNER JOIN new_product ON new_stock.stock_id_stock = new_product.id_stock "
  sql += "INNER JOIN seller ON new_product.id_seller = seller.id_seller "
  sql += "GROUP BY new_product.id_stock"



  conn.query(sql, (err, result) => {
    res.render('setting', {
      title: 'บ้านบรรจุภัณฑ์',
      data: result
    })
    //console.log(result);

  })

})

module.exports = router;