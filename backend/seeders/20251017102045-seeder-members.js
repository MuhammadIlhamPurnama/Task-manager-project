'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Members', [
      {
        name: 'Muhammad Ilham',
        role: 'Software Engineer',
        email: 'milhamprnm@gmail.com',
        createdAt: new Date('2025-10-15 20:24:24'),
        updatedAt: new Date('2025-10-17 13:43:10')
      },
      {
        name: 'Rizka ayunda',
        role: 'Software Engineer',
        email: 'rizka@gmail.com',
        createdAt: new Date('2025-10-15 23:23:39'),
        updatedAt: new Date('2025-10-17 11:04:26')
      },
      {
        name: 'Aldo Sjafri',
        role: 'Project Manager',
        email: 'aldo@gmail.com',
        createdAt: new Date('2025-10-17 11:02:32'),
        updatedAt: new Date('2025-10-17 11:02:32')
      },
      {
        name: 'Rayhan A',
        role: 'Software Engineer',
        email: 'rayhan@gmail.com',
        createdAt: new Date('2025-10-17 13:32:11'),
        updatedAt: new Date('2025-10-17 13:32:11')
      },
      {
        name: 'Syahroni A',
        role: 'QA',
        email: 'syahroni@gmail.com',
        createdAt: new Date('2025-10-17 13:32:40'),
        updatedAt: new Date('2025-10-17 13:32:40')
      },
      {
        name: 'Dion',
        role: 'Staff',
        email: 'dion@gmail.com',
        createdAt: new Date('2025-10-17 13:32:58'),
        updatedAt: new Date('2025-10-17 13:32:58')
      },
      {
        name: 'Abrar',
        role: 'Staff',
        email: 'abrar@gmail.com',
        createdAt: new Date('2025-10-17 13:33:18'),
        updatedAt: new Date('2025-10-17 13:33:18')
      },
      {
        name: 'Dina',
        role: 'Staff',
        email: 'dina@gmail.com',
        createdAt: new Date('2025-10-17 13:33:36'),
        updatedAt: new Date('2025-10-17 13:33:36')
      },
      {
        name: 'Nabila',
        role: 'Staff',
        email: 'nabila@gmail.com',
        createdAt: new Date('2025-10-17 13:33:57'),
        updatedAt: new Date('2025-10-17 13:33:57')
      },
      {
        name: 'Bahlil',
        role: 'Staff',
        email: 'bahlil@gmail.com',
        createdAt: new Date('2025-10-17 13:34:17'),
        updatedAt: new Date('2025-10-17 13:34:17')
      },
      {
        name: 'razik',
        role: 'Staff',
        email: 'razik@gmail.com',
        createdAt: new Date('2025-10-17 13:39:03'),
        updatedAt: new Date('2025-10-17 13:39:03')
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Members', null, {
    });
  }
};