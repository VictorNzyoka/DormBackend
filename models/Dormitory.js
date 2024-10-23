const { Model, DataTypes } = require('sequelize');

class Dormitory extends Model {
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
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'Dormitory',
            timestamps: true,
        });
    }

    static associate(models) {
        this.hasMany(models.Bed, {
            foreignKey: 'dormitoryId',
            as: 'beds',
        });
    }
}

module.exports = Dormitory;