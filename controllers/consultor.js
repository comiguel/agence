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
  const sql = `SELECT u.co_usuario, u.no_usuario FROM cao_usuario u
              LEFT JOIN permissao_sistema p ON u.co_usuario = p.co_usuario
              WHERE p.co_sistema = 1 and p.in_ativo = 'S'
              AND p.co_tipo_usuario in (0,1,2)`;
	const query = connection.query(
    sql,
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
  const sql = `SELECT DATE_FORMAT(f.data_emissao, "%M of %Y") as label_date, f.*, os.co_usuario, u.no_usuario, s.brut_salario as salario
              FROM cao_fatura f
              LEFT JOIN cao_os os ON os.co_os = f.co_os
              LEFT JOIN cao_salario s ON os.co_usuario = s.co_usuario
              LEFT JOIN cao_usuario u ON os.co_usuario = u.co_usuario
              WHERE f.data_emissao BETWEEN CAST('${req.body.fromDate}' AS DATE)
              AND LAST_DAY(CAST('${req.body.toDate}' AS DATE))
              AND os.co_usuario IN ('${req.body.selected.join("','")}')
              ORDER BY f.data_emissao`;
  // res.status(200).send({status: sql});
  // console.log(sql);
  const query = connection.query(
    sql,
    function calculateRelatorio(err, results, fields) {
    if (err) {
      console.log("Error: " + err.message);
      throw err;
    }
    var processedData = {};
    var totalByConsultor = {};
    var totalAllConsultor = 0;
    var salaries = {};
    results.forEach(function(el) {
      let receita = calculateReceita(el.valor, el.total_imp_inc);
      let currentData = {
        receita: receita,
        custo_fixo: el.salario || 0,
        // comissao: math.eval(`${receita}*(${el.comissao_cn}/100)`),
        comissao: receita * (el.comissao_cn / 100),
      };
      let lucro = currentData.receita - currentData.custo_fixo - currentData.comissao;
      totalAllConsultor += currentData.receita;
      if (el.no_usuario in processedData) {
        processedData[el.no_usuario]['global']['total_receita'] += currentData.receita;
        totalByConsultor[el.no_usuario]['receita'] += currentData.receita;
        totalByConsultor[el.no_usuario]['comissao'] += currentData.comissao;
        totalByConsultor[el.no_usuario]['lucro'] += lucro;
        if (el.label_date in processedData[el.no_usuario]['data']) {
          // console.log(processedData);
          processedData[el.no_usuario]['data'][el.label_date]['receita'] += currentData.receita;
          // processedData[el.no_usuario]['data'][el.label_date]['custo_fixo'] += currentData.custo_fixo;
          processedData[el.no_usuario]['data'][el.label_date]['comissao'] += currentData.comissao;
          processedData[el.no_usuario]['data'][el.label_date]['lucro'] += lucro;
        } else {
          totalByConsultor[el.no_usuario]['custo_fixo'] += currentData.custo_fixo;
          processedData[el.no_usuario]['data'][el.label_date] = {
            receita: currentData.receita,
            custo_fixo: currentData.custo_fixo,
            comissao: currentData.comissao,
            lucro,
          };
        }
      } else {
        processedData[el.no_usuario] = {};
        processedData[el.no_usuario]['global'] = {total_receita: currentData.receita};
        processedData[el.no_usuario]['data'] = {};
        processedData[el.no_usuario]['data'][el.label_date] = {
          receita: currentData.receita,
          custo_fixo: currentData.custo_fixo,
          comissao: currentData.comissao,
          lucro,
        };
        totalByConsultor[el.no_usuario] = {
          receita: currentData.receita,
          custo_fixo: currentData.custo_fixo,
          comissao: currentData.comissao,
          lucro,
        };
        salaries[el.no_usuario] = currentData.custo_fixo;
      }
    });
    var averageCost = 0;
    var nConsultors = 0;
    var percents = {};
    for (var no_usuario in totalByConsultor) {
      processedData[no_usuario]['global'] = totalByConsultor[no_usuario];
      averageCost += salaries[no_usuario];
      percents[no_usuario] = totalAllConsultor/totalByConsultor[no_usuario]['receita'];
      nConsultors += 1;
    }

    averageCost = averageCost/nConsultors;
    res.status(200).send({processedData, averageCost, percents, totalAllConsultor});
    // connection.end();
  });
}

function calculateReceita(value, tax) {
  return value - (value * (tax / 100));
  // return math.eval(`${value}-(${value}*(${tax}/100))`);
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

module.exports = {
	getConsultors,
  getRelatorio
}