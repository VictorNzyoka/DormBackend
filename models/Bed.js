const { Model, DataTypes } = require('sequelize');

class Bed extends Model {
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
            bedName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            dormitoryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Dormitory',
                    key: 'id',
                },
            },
            status: {
                type: DataTypes.ENUM('available', 'assigned'),
                defaultValue: 'available',
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'Bed',
            timestamps: true,
        });
    }

    static associate(models) {
        this.belongsTo(models.Dormitory, {
            foreignKey: 'dormitoryId',
            as: 'dormitory',
        });
        this.hasOne(models.Student, { 
            foreignKey: 'bedId',
            as: 'student'
        });
    }
}

module.exports = Bed;