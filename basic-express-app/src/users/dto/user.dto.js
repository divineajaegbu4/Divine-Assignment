import Joi from 'joi';

export class UserDataValidator {
    static validateNewUser(data) {
        /*
        *  {
        *       first_name: jsjsjs,
        *       last_name: kdkdk,
        *       date_of_birth: 2008-08-21,
        *       username: emiboy,
        *       gender: male,
        *       role: user,
        *       status: active,
        *       marital_status: married,
        *       password: "kdkdksk",
        *       contacts: [
        *           {
        *               phone_number: 08083298429,
        *               email: emyboy@gmail.com,
        *               address: {
        *                   street: No 1 whathehah, streeet abubakar,
        *                   city: Lagos,
        *                   state: Lagos,
        *                   zip_code: 110115,
        *                   country: Nigeria
        *               }
        *           }
        *       ],
        *       created_at: 1999992,
        *       updated_at: 1223884
        *  }
        * */
        const userCreateSchema = Joi.object({
            first_name: Joi.string()
                .alphanum()
                .trim()
                .min(3)
                .max(30)
                .required(),
            last_name: Joi.string()
                .alphanum()
                .trim()
                .min(3)
                .max(30)
                .required(),
            date_of_birth: Joi.date()
                .min('2008-01-01') // User must be at least 18 years old
                .required(),
                // .message("date_of_birth is a required field; and you must be 18 years or above to use the todo service."),
            username: Joi.string()
                .alphanum()
                .trim()
                .lowercase()
                .min(3)
                .max(30)
                .required(),
            gender: Joi.string()
                .valid('male', 'female')
                .lowercase()
                .required(),
            role: Joi.string()
                .valid('user', 'admin')
                .lowercase()
                .default('user'),
            status: Joi.string()
                .valid('active', 'inactive', 'suspended')
                .lowercase()
                .default('active'),
            marital_status: Joi.string()
                .valid('single', 'married', 'divorced', 'widowed')
                .lowercase()
                .required(),
            password: Joi.string()
                .min(8)
                .max(100)
                .required(),
            contacts: Joi.array()
                .items(
                    Joi.object({
                        phone_number: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
                        email: Joi.string().email().required(),
                        address: Joi.object({
                            street: Joi.string().required(),
                            city: Joi.string().required(),
                            state: Joi.string().required(),
                            zip_code: Joi.string(),
                            country: Joi.string()
                                .valid('USA', 'Canada', 'UK', 'Australia', 'Nigeria')
                                .required()
                        }).required()
                    }).required()
                ),
            created_at: Joi.date().iso().default(() => new Date()),
            updated_at: Joi.date().iso().default(() => new Date())

        });

        return userCreateSchema.validate(data);
    }

    static validateUpdateUser(data) {
        const userUpdateSchema = Joi.object({
            first_name: Joi.string()
                .alphanum()
                .trim()
                .min(3)
                .max(30),
            last_name: Joi.string()
                .alphanum()
                .trim()
                .min(3)
                .max(30),
            date_of_birth: Joi.date()
                .iso()
                .min('2008-01-01'), // User must be at least 18 years old
            marital_status: Joi.string()
                .valid('single', 'married', 'divorced', 'widowed')
                .lowercase(),
            password: Joi.string()
                .min(8)
                .max(100),
        });

        return userUpdateSchema.validate(data);
    }
}