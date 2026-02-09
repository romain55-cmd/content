'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create PromoCodes table
    await queryInterface.createTable('PromoCodes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      discountType: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['percentage', 'fixed_amount']],
        },
      },
      discountValue: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          isFloat: true,
          min: 0,
        },
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create Products table
    await queryInterface.createTable('Products', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sku: {
        type: Sequelize.STRING,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create Users table
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      googleId: {
        type: Sequelize.STRING,
      },
      vkId: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      industry: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      core_message: {
        type: Sequelize.TEXT,
        defaultValue: '',
      },
      brand_voice_tone: {
        type: Sequelize.STRING,
        defaultValue: 'professional',
      },
      writing_style_description: {
        type: Sequelize.TEXT,
        defaultValue: '',
      },
      monthly_content_goal: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      target_audiences: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      content_pillars: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      goals_primary_goal: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      preferred_platforms: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'manager',
      },
      freeGenerationsLeft: {
        type: Sequelize.INTEGER,
        defaultValue: 5,
        allowNull: false,
      },
      has_unlimited_generations: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      subscription_provider: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      subscription_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      subscription_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      subscriptionStartDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      subscriptionEndDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      promoCodeId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'PromoCodes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create Content table
    await queryInterface.createTable('Contents', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      platform: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hashtags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      target_audience: {
        type: Sequelize.STRING,
      },
      generation_prompt: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'draft',
      },
      scheduled_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Drop in reverse order of creation
    await queryInterface.dropTable('Contents');
    await queryInterface.dropTable('Users');
    await queryInterface.dropTable('Products');
    await queryInterface.dropTable('PromoCodes');
  }
};