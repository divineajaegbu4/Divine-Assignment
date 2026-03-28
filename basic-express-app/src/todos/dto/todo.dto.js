import Joi from "joi";

export class TodoDataValidator {
  static validateTodo(data) {
    const todoUpdateSchema = Joi.object({
      name: Joi.string().trim().min(3).max(30),
      description: Joi.string().trim().min(3).max(100),
      due_date: Joi.date(),
      priority: Joi.string().alphanum().trim(),
      status: Joi.string().alphanum().trim(),
    });

    return todoUpdateSchema.validate(data);
  }
}
