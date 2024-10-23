const { Model, DataTypes } = require('sequelize');

class Student extends Model {
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
            regNo: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            class: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            bedId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Beds',
                    key: 'id',
                },
            },
        }, {
            sequelize,
            modelName: 'Student',
            timestamps: true,
        });
    }

    static associate(models) {
        this.belongsTo(models.Bed, {
            foreignKey: 'bedId',
            as: 'bed',
        });
    }
}

module.exports = Student;