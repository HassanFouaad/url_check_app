module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("urlHistory", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      urlId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: "url",
          },
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      responseTime: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      statusCode: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      passedAssert: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
  down: (queryInterface) => queryInterface.dropTable("urlHistory"),
};
