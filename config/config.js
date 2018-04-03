module.exports = {
    database : 'mongodb://' + (process.env.DB_HOST || 'localhost') + '/' + (process.env.DB_NAME || 'lit-tracker'),
};
