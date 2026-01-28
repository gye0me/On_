const Sequelize = require('sequelize');

class ClimateData extends Sequelize.Model {
  static initiate(sequelize) {
    ClimateData.init({
      temp: { // 기온
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      outer: { // 겉옷
        type: Sequelize.STRING(50),
      },
      top: { // 상의
        type: Sequelize.STRING(50),
      },
      bottom: { // 하의
        type: Sequelize.STRING(50),
      },
      carbonIndex: { // 탄소배출계수
        type: Sequelize.FLOAT,
      },
    }, {
      sequelize,
      modelName: 'ClimateData',
      tableName: 'climatedatas',
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  static associate(db) {}
}

module.exports = ClimateData;