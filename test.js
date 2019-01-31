const url = require('url');
const myURL =
  url.parse('mysql://bfa58de255832f:e1743829@us-cdbr-iron-east-03.cleardb.net/heroku_eaed489549d556d?reconnect=true');

  // console.log(myURL);
  console.error({
		user: myURL.auth.split(":")[0] || 'root',
		password: myURL.auth.split(":")[1] || '',
		host: myURL.hostname || '127.0.0.1',
		database: myURL.pathname || 'agence',
		port: myURL.port || '3306',
	});