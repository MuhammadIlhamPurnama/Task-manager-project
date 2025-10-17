'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Projects', [
      {
        name: 'Website Redesign',
        description: 'Membuat ulang tampilan web utama',
        startDate: new Date('2025-10-10'),
        endDate: new Date('2025-10-15'),
        status: 'Active',
        createdAt: new Date('2025-10-10 07:00:00'),
        updatedAt: new Date('2025-10-21 07:00:00')
      },
      {
        name: 'Project IKN',
        description: 'Membuat website IKN',
        startDate: new Date('2025-10-17'),
        endDate: null,
        status: 'On Hold',
        createdAt: new Date('2025-10-17 07:00:00'),
        updatedAt: new Date('2025-10-17 09:29:00')
      },
      {
        name: 'Project Data Organizer',
        description: 'App for data organizer',
        startDate: new Date('2025-10-17'),
        endDate: null,
        status: 'Active',
        createdAt: new Date('2025-10-17 07:00:00'),
        updatedAt: new Date('2025-10-17 12:42:00')
      },
      {
        name: 'Project Obito',
        description: 'Course subscription project',
        startDate: new Date('2025-10-17'),
        endDate: null,
        status: 'Active',
        createdAt: new Date('2025-10-17 07:00:00'),
        updatedAt: new Date('2025-10-17 12:45:00')
      },
      {
        name: 'Project ujianlah',
        description: 'tryout website',
        startDate: new Date('2025-10-17'),
        endDate: null,
        status: 'Active',
        createdAt: new Date('2025-10-17 07:00:00'),
        updatedAt: new Date('2025-10-17 12:47:00')
      },
      {
        name: 'Project Lashodia',
        description: 'e-commerce website',
        startDate: new Date('2025-10-17'),
        endDate: null,
        status: 'Active',
        createdAt: new Date('2025-10-17 07:00:00'),
        updatedAt: new Date('2025-10-17 12:48:00')
      },
      {
        name: 'Mockup X',
        description: 'Mockup X',
        startDate: new Date('2025-10-17'),
        endDate: null,
        status: 'Active',
        createdAt: new Date('2025-10-17 07:00:00'),
        updatedAt: new Date('2025-10-17 12:49:00')
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Projects', null, {
    });
  }
};