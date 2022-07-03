'use strict'
const bcrypt = require('bcryptjs')
const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const userId = await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: SEED_USER.name,
          email: SEED_USER.email,
          password: bcrypt.hashSync(
            SEED_USER.password,
            bcrypt.genSaltSync(10),
            null
          ),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
    await queryInterface.bulkInsert(
      'Todos',
      Array.from({ length: 10 }).map(
        (_, i) => ({
          name: `name-${i}`,
          UserId: userId,
          isDone: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }),
        {}
      )
    )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Todos', null, {})
    await queryInterface.bulkDelete('Users', null, {})
  }
}
