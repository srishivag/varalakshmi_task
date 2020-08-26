const { Model } = require('objection');

class Loginlog extends Model {
    static get tableName() {
        return 'loginlog';
    }

    static get idColumn() {
        return 'logId';
    }

    static get jsonSchema() {
        return {
            type: 'object',

            properties: {
                logId: { type: 'integer' },
                userid: { type: 'string' },
                password: { type: 'string' },
                role: { type: 'string' },
                status: { type: 'string' },
                createdAt: { type: 'date' }
            }
        }
    }
}

module.exports = Loginlog;