const Sequelize = require('sequelize');

class Action extends Sequelize.Model {
  static initiate(sequelize) {
    Action.init({
      // 어떤 활동을 했는지
      content: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      // 탄소 배출 계수(0.4173)를 활용해 계산된 감축량
      reduction: {
        type: Sequelize.DECIMAL(10, 4), // 소수점 4자리까지 저장
        allowNull: false,
      },
      // 활동 당시의 위치
      location: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true, // createdAt, updatedAt 자동 생성(언제 했는지 기록됨)
      underscored: false,
      modelName: 'Action',
      tableName: 'actions',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    // 어떤 유저가 한 행동인지 연결(User 모델과 1:N 관계)
    db.Action.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
  }
};

module.exports = Action;