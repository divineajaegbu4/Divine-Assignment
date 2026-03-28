import Joi from 'joi';

export class TodoDataValidator {
    static validateNewTodo(data) {
        const todoCreateSchema = Joi.object({
            title: Joi.string()
                .trim()
                .min(3)
                .max(30)
                .required(),
            description: Joi.string()
                .trim()
                .min(3)
                .max(150)
                .required(),
            due_date: Joi.date()
                .min('2008-01-01')
                .required(),
            priority: Joi.string()
                .valid('low', 'medium', 'high')
                .lowercase()
                .required(),
            status: Joi.string()
                .valid('pending', 'completed')
                .lowercase()
                .default('pending'),
            user_id: Joi.string()
                .uuid(),
            created_at: Joi.date().iso().default(() => new Date()),
            updated_at: Joi.date().iso().default(() => new Date())

        });

        return todoCreateSchema.validate(data);
    }

    static validateUpdateTodo(data) {
        const todoUpdateSchema = Joi.object({
            title: Joi.string()
                .trim()
                .min(3)
                .max(30),
            description: Joi.string()
                .trim()
                .min(3)
                .max(150),
            due_date: Joi.date()
                .min('2008-01-01'),
            priority: Joi.string()
                .valid('low', 'medium', 'high')
                .lowercase(),
            status: Joi.string()
                .valid('pending', 'completed')
                .lowercase(),
        });

        return todoUpdateSchema.validate(data);
    }
}