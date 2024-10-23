const { Model, DataTypes } = require('sequelize');

class User extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                unique: true,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'User',
            timestamps: true,
        });
    }

    static associate(models) {
        // Define associations if needed
        // Example: this.hasMany(models.Post, { foreignKey: 'userId', as: 'posts' });
    }

    // You can add instance methods here
    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    // You can add class methods here
    static async findByEmail(email) {
        return await this.findOne({ where: { email } });
    }
}

module.exports = User;