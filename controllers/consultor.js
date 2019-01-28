const mysql = require('mysql');
const config = require('../config');
const connection = mysql.createConnection(config.db);
// connection.query('USE agence');
connection.connect(function(error){
  if(error){
    throw error;
  } else {
    console.log('Conexion correcta.');
  }
});

function getConsultors(req, res) {
	const query = connection.query(
    "SELECT * FROM `cao_usuario` u left join permissao_sistema p ON u.co_usuario = p.co_usuario where p.co_sistema = 1 and p.in_ativo = 'S' and p.co_tipo_usuario in (0,1,2)",
    function selectConsultors(err, results, fields) {
    if (err) {
      console.log("Error: " + err.message);
      throw err;
    }
    // console.log("Number of rows: "+results.length);
    // console.log(results);
    res.status(200).send({results});
    // connection.end();
	});
  // console.log(query);
}

function getRelatorio(req, res) {
  // console.log(req.body);
  const sql = `SELECT DATE_FORMAT(f.data_emissao, "%M of %Y") as label_date, f.*, os.co_usuario, s.brut_salario as salario
              FROM cao_fatura f
              LEFT JOIN cao_os os ON os.co_os = f.co_os
              LEFT JOIN cao_salario s ON os.co_usuario = s.co_usuario
              WHERE f.data_emissao BETWEEN CAST('${req.body.fromDate}' AS DATE)
              AND LAST_DAY(CAST('${req.body.toDate}' AS DATE))
              AND os.co_usuario IN ('${req.body.selected.join("','")}')`;
  // res.status(200).send({status: sql});
  // console.log(sql);
  const query = connection.query(
    sql,
    function calculateRelatorio(err, results, fields) {
    if (err) {
      console.log("Error: " + err.message);
      throw err;
    }
    var proccessedData = {};
    results.forEach(function(el) {
      // console.log(el);
      let receita = calculateReceita(el.valor, el.total_imp_inc);
      let currentData = {
        receita: round(receita, 2),
        custo_fixo: el.salario,
        comissao: round(receita * (el.comissao_cn/100), 2),
      };
      let lucro = round(currentData.receita - currentData.custo_fixo - currentData.comissao, 2);
      if (el.co_usuario in proccessedData) {
        if (el.label_date in proccessedData[el.co_usuario]) {
          proccessedData[el.co_usuario][el.label_date]['receita'] += currentData.receita;
          proccessedData[el.co_usuario][el.label_date]['custo_fixo'] += currentData.custo_fixo;
          proccessedData[el.co_usuario][el.label_date]['comissao'] += currentData.comissao;
          proccessedData[el.co_usuario][el.label_date]['lucro'] += lucro;
        } else {
          proccessedData[el.co_usuario][el.label_date] = {
            receita,
            custo_fixo: currentData.custo_fixo,
            comissao: currentData.comissao,
            lucro,
          };
        }
      } else {
        proccessedData[el.co_usuario] = {};
        proccessedData[el.co_usuario][el.label_date] = {};
        proccessedData[el.co_usuario][el.label_date]['receita'] = currentData.receita;
        proccessedData[el.co_usuario][el.label_date]['custo_fixo'] = currentData.custo_fixo;
        proccessedData[el.co_usuario][el.label_date]['comissao'] = currentData.comissao;
        proccessedData[el.co_usuario][el.label_date]['lucro'] = lucro;
        /*proccessedData[el.co_usuario][el.label_date] = {
          receita,
          custo_fixo: currentData.custo_fixo,
          comissao: currentData.comissao,
          lucro,
        };*/
      }
    });
    console.log(proccessedData);
    res.status(200).send(proccessedData);
    // connection.end();
  });
}

function calculateReceita(value, tax) {
  return value - (value*(tax/100));
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

module.exports = {
	getConsultors,
  getRelatorio
}