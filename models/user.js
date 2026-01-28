const Sequelize = require('sequelize');

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init({
      // 1. 이메일 (카카오 로그인의 경우 없을 수도 있어서 allowNull: true)
      email: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      },
      // 2. 닉네임
      nick: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      // 3. 비밀번호 (카카오 로그인은 비밀번호가 없으니 allowNull: true)
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      // 4. 가입 경로 (직접 가입인지, 카카오인지 구분)
      provider: {
        type: Sequelize.ENUM('local', 'kakao'),
        allowNull: false,
        defaultValue: 'local',
      },
      // 5. SNS 로그인 시 고유 아이디
      snsId: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,    // 생성일, 수정일 자동 기록
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,      // 삭제일 기록 (복구용)
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    // 나중에 다른 테이블(옷차림 등)과의 관계를 여기서 설정
  }
};

module.exports = User;