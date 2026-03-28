import Joi from 'joi';

export class ContactDataValidator {
    static validateUpdateContact(data) {
        const contactUpdateSchema = Joi.object({
            phone_number: Joi.string().pattern(/^[0-9]{10,15}$/),
            email: Joi.string().email(),
            address: Joi.object({
                street: Joi.string(),
                city: Joi.string(),
                state: Joi.string(),
                zip_code: Joi.string(),
                country: Joi.string()
                    .valid('USA', 'Canada', 'UK', 'Australia', 'Nigeria')
            }),
        });

        return contactUpdateSchema.validate(data);
    }
}