const Sequelize = require('sequelize');

module.exports = class EmissionFactor extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        category: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        factor_value: {
          type: Sequelize.DOUBLE,
          allowNull: false,
        },
        gas_type: Sequelize.STRING(20),
        unit: Sequelize.STRING(20),
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'EmissionFactor',
        tableName: 'emission_factors',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {}
};