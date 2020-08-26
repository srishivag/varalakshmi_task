const { Model } = require('objection');

class User extends Model {
    static get tableName() {
        return 'usersinfo';
    }

    static get idColumn() {
        return 'user_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                user_id: { type: 'integer' },
                username: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                role: { type: 'string' },
                status: { type: 'enum' },
                created_at: { type: 'datetime' },
                updated_at: { type: 'datetime' }
            }
        }
    }
}

module.exports = User;