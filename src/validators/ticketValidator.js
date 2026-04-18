import Joi from 'joi';
import { TICKET_STATUS, TICKET_PRIORITY, TICKET_CATEGORY } from '../constants/index.js';

const listTickets = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    status: Joi.string().valid(...Object.values(TICKET_STATUS)),
    priority: Joi.string().valid(...Object.values(TICKET_PRIORITY)),
    category: Joi.string().valid(...Object.values(TICKET_CATEGORY)),
    assignedTo: Joi.string(),
    userId: Joi.string(),
    search: Joi.string().trim(),
  }),
};

const updateTicket = {
  params: Joi.object({
    ticketId: Joi.string().required(),
  }),
  body: Joi.object({
    status: Joi.string().valid(...Object.values(TICKET_STATUS)),
    priority: Joi.string().valid(...Object.values(TICKET_PRIORITY)),
    category: Joi.string().valid(...Object.values(TICKET_CATEGORY)),
    assignedTo: Joi.string().allow(null),
  }),
};

const addNote = {
  params: Joi.object({
    ticketId: Joi.string().required(),
  }),
  body: Joi.object({
    content: Joi.string().required().trim().min(1).max(2000),
  }),
};

const customerReply = {
  params: Joi.object({
    ticketId: Joi.string().required(),
  }),
  body: Joi.object({
    content: Joi.string().required().trim().min(1).max(2000),
  }),
};

const submitFeedback = {
  params: Joi.object({
    ticketId: Joi.string().required(),
  }),
  body: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().allow('', null).trim().max(1000),
  }),
};

export { listTickets, updateTicket, addNote, customerReply, submitFeedback };
