module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("url", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: "user",
          },
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      port: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      webhook: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      timeout: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5 * 1000,
      },
      interval: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10 * 1000 * 60,
      },
      threshold: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      authentication: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      httpHeaders: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      assert: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      ignoreSSL: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
    }),
  down: (queryInterface) => queryInterface.dropTable("url"),
};
