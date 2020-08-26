const { Model } = require('objection');

class Customer extends Model {
    static get tableName() {
        return 'tasks';
    }

    static get idColumn() {
        return 'task_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                c_id: { type: 'integer' },
                c_name: { type:'string' },
                created_at: { type: 'timestamp' },
                updated_at: { type: 'timestamp' }
            }
        }
    }
}

module.exports = Customer;