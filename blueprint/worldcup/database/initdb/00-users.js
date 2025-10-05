const ADMIN_ID = _getEnv('ADMIN_ID')
const ADMIN_PWD = _getEnv('ADMIN_PWD')
const ADMIN_NAME = _getEnv('ADMIN_NAME')

db.users.insertMany([
    {'id':`native-${ADMIN_ID}`,'pwd':ADMIN_PWD,'name':ADMIN_NAME,'isAdmin':true}
])
