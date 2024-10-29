import Joi from "joi";

// Inloggning 
const loginSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
});

// Registrering
const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
});

// Användarnamn
const usernameSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
});

// Radering
const deleteSchema = Joi.object({
    id: Joi.string().required(),
});


// meddelande
const messageSchema = Joi.object({
    senderName: Joi.string().required(),
    recipientName: Joi.string().allow(null, '').optional(),
    channelName: Joi.string().allow(null, '').optional(),
    content: Joi.string().min(1).max(500).required() 
});


export { loginSchema, registerSchema, usernameSchema, deleteSchema, messageSchema };
