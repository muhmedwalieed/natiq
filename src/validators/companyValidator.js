import Joi from 'joi';

const createCompany = {
  body: Joi.object({
    name: Joi.string().required().trim().min(2).max(100),
    slug: Joi.string().trim().lowercase().pattern(/^[a-z0-9-]+$/),
    industry: Joi.string().valid('telecom', 'banking', 'ecommerce', 'healthcare', 'other'),
    channelsConfig: Joi.object({
      telegram: Joi.object({
        botToken: Joi.string().allow(null, ''),
        webhookSecret: Joi.string().allow(null, ''),
        isActive: Joi.boolean(),
      }),
      whatsapp: Joi.object({
        isActive: Joi.boolean(),
      }),
      webChat: Joi.object({
        isActive: Joi.boolean(),
      }),
    }),
    settings: Joi.object({
      aiEnabled: Joi.boolean(),
      escalationThreshold: Joi.number().min(0).max(1),
      maxSessionMessages: Joi.number().integer().min(1).max(200),
    }),
  }),
};

const updateCompany = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100),
    industry: Joi.string().valid('telecom', 'banking', 'ecommerce', 'healthcare', 'other'),
    channelsConfig: Joi.object({
      telegram: Joi.object({
        botToken: Joi.string().allow(null, ''),
        webhookSecret: Joi.string().allow(null, ''),
        isActive: Joi.boolean(),
      }),
      whatsapp: Joi.object({
        isActive: Joi.boolean(),
      }),
      webChat: Joi.object({
        isActive: Joi.boolean(),
      }),
    }),
    settings: Joi.object({
      aiEnabled: Joi.boolean(),
      escalationThreshold: Joi.number().min(0).max(1),
      maxSessionMessages: Joi.number().integer().min(1).max(200),
    }),
    isActive: Joi.boolean(),
  }),
};

export { createCompany, updateCompany };
