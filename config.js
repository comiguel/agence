module.exports = {
	port: process.env.PORT || 3001,
	db: {
		user: process.env.DBUSER || 'root',
		password: process.env.DBPASSWORD || '',
		host: process.env.DBHOST || '127.0.0.1',
		database: process.env.DBDATABASE || 'agence',
		port: process.env.DBPORT || '3306',
	}
}