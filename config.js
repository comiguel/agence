module.exports = {
	port: process.env.PORT || 3001,
	db: {
		user: process.env.DBUSER || 'root',
		password: process.env.DBPASS || '',
		host: process.env.DBHOST || '198.199.77.244',
		database: process.env.DB_SCHEMA || 'agence',
		port: '3306',
	}
}