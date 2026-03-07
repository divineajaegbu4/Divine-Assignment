import { Validator } from "../utils/validator.js";
import {UserDataValidator} from "./dto/user.dto.js";
import {BadRequestException} from "../exceptions/badrequest.exception.js";
import {ConflictException} from "../exceptions/conflict.exception.js";
import {ServerException} from "../exceptions/server.exception.js";

export class UserService {
    constructor(userRepository, contactService, passwordService) {
        this.userRepository = userRepository;
        this.contactService = contactService;
        this.passwordService = passwordService;
    }

    async findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }

    async createUser(user) {
        const { error } = UserDataValidator.validateNewUser(user);
        
        if (error) {
            throw new BadRequestException(Validator.joiValidationErrorToString(error));
        }

        // Phone number and email verification for uniqueness.
        let existingUserContact = await this.contactService.findByPhone(user.contacts[0].phone_number);
        if (existingUserContact) {
            throw new ConflictException("Phone number already exists");
        }
        existingUserContact = await this.contactService.findByEmail(user.contacts[0].email);
        if (existingUserContact) {
            throw new ConflictException("Email already exists");
        }

        // Pull out contacts to save separately
        let contacts = structuredClone(user.contacts);
        // Remove the contacts property from the user object.
        delete user.contacts;

        // Hash the user password and save only the hashed password.
        // Never save any user's plain password for their security.
        user.password = await this.passwordService.hash(user.password);

        // Set default user status and role
        user.status = "active";
        user.role = "user";

        // Save the user's data.
        const createdUser = await this.userRepository.createUser(user);

        console.log({createdUser})

        // Delete user's password from the response.
        delete createdUser.password;

        contacts = contacts.map(contact => {
            contact.user_id = createdUser.id;

            return contact;
        });

        let createdContacts = [];
        try {
            createdContacts = await this.contactService.createNewContact(contacts);
        } catch (error) {
            this.userRepository.deleteUser(createdUser.id);

            throw new ServerException("User creation failed: " + error.message + "\n" + error);
        }

        // Return the new user details.
        return {...createdUser, contacts: createdContacts};
    }

    async findById(id) {
        return await this.userRepository.findById(id);
    }

    async getAllUsers(queryFilter = {}) {
        try {
            return await this.userRepository.getAllUsers(queryFilter);
        } catch (error) {
            throw new ServerException("Failed to retrieve users: " + error.message);
        }
    }

    async updateUser(id, updatedFields) {
            const { error } = UserDataValidator.validateUpdateUser(updatedFields);
            if (error) {
                throw new Error(Validator.joiValidationErrorToString(error));
            }
            
        return await this.userRepository.updateUser(id, updatedFields);
    }

    async deleteUser(id) {
        return await this.userRepository.deleteUser(id);
    }
}