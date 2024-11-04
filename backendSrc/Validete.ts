import Joi from "joi";

// Gemensam validering för användarnamn
const usernameSchema = Joi.string().min(3).max(30).required();

// Lösenordsvalidering
const passwordSchema = Joi.string()
    .min(6)
    .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{6,30}$'))
    .required();

// Inloggning
const loginSchema = Joi.object({
    username: usernameSchema,
    password: passwordSchema,
});

// Registrering
const registerSchema = Joi.object({
    username: usernameSchema,
    password: passwordSchema,
});

const channelSchema = Joi.object({
    name: Joi.string().min(1).required(),
    isPrivate: Joi.boolean().required()
});


// meddelande
const messageSchema = Joi.object({
    senderName: Joi.string().required(),
    recipientName: Joi.string().required(),
    content: Joi.string().min(1).max(500).required() 
});


export { loginSchema, registerSchema, usernameSchema,channelSchema, messageSchema };
