import { Validator } from "../utils/validator.js";
import { UserDataValidator } from "./dto/user.dto.js";
import { BadRequestException } from "../exceptions/badrequest.exception.js";
import { ConflictException } from "../exceptions/conflict.exception.js";
import { ServerException } from "../exceptions/server.exception.js";
import { NotFoundException } from "../exceptions/notfound.exception.js";

export class UserService {
  constructor(userRepository, contactService, passwordService) {
    this.userRepository = userRepository;
    this.contactService = contactService;
    this.passwordService = passwordService;
  }

  async findByEmail(email) {
    const userContacts = await this.contactService.findByEmail(email);
    if (!userContacts) {
      throw new NotFoundException(`User not found. Invalid email: ${email}`);
    }

    const user = structuredClone(
      await this.userRepository.findById(userContacts.user_id),
    );
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async createUser(user) {
    const { error } = UserDataValidator.validateNewUser(user);

    if (error) {
      throw new BadRequestException(
        Validator.joiValidationErrorToString(error),
      );
    }

    // Phone number and email verification for uniqueness.
    let existingUserContact = await this.contactService.findByPhone(
      user.contacts[0].phone_number,
    );
    if (existingUserContact) {
      throw new ConflictException("Phone number already exists");
    }
    existingUserContact = await this.contactService.findByEmail(
      user.contacts[0].email,
    );
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

    if (!user.status) {
      user.status = "active";
    }

    if (!user.role) {
      user.role = "user";
    }

    // Save the user's data.
    const createdUser = structuredClone(
      await this.userRepository.createUser(user),
    );

    // Delete user's password from the response.
    delete createdUser.password;

    contacts = contacts.map((contact) => {
      contact.user_id = createdUser.id;

      return contact;
    });

    let createdContacts = [];
    try {
      createdContacts = await this.contactService.createNewContact(contacts);
    } catch (error) {
      this.userRepository.deleteUser(createdUser.id);

      throw new ServerException(
        "User creation failed: " + error.message + "\n" + error,
      );
    }

    // Return the new user details.
    return { ...createdUser, contacts: createdContacts };
  }

  async findById(id) {
    const user = structuredClone(await this.userRepository.findById(id));
    if (!user) {
      throw new NotFoundException(`User not found. Invalid user id: ${id}`);
    }

    delete user.password;

    return user;
  }

  async getUserContacts(userID) {
    try {
      const userContacts = await this.contactService.findByUserId(userID);

      if (!userContacts || userContacts.length === 0) {
        throw new NotFoundException(
          `User contacts not found. Invalid user id: ${userID} or no contacts found`,
        );
      }

      return userContacts;
    } catch (error) {
      throw new ServerException(
        "Failed to retrieve user contacts: " + error.message,
      );
    }
  }

  async updateUserContact(contactID, updatedFields) {
    return this.contactService.updateContact(contactID, updatedFields);
  }

  async getAllUsers(queryFilter = {}) {
    try {
      let response = structuredClone(
        await this.userRepository.getAllUsers(queryFilter),
      );

      response.users = response.users.map((user) => {
        delete user.password;
        return user;
      });

      return response;
    } catch (error) {
      throw new ServerException("Failed to retrieve users: " + error.message);
    }
  }

  async updateUser(id, updatedFields) {
    const { error } = UserDataValidator.validateUpdateUser(updatedFields);
    if (error) {
      throw new BadRequestException(
        Validator.joiValidationErrorToString(error),
      );
    }

    if (updatedFields.password) {
      updatedFields.password = await this.passwordService.hash(
        updatedFields.password,
      );
    }

    const updatedUser = structuredClone(
      await this.userRepository.updateUser(id, updatedFields),
    );
    if (!updatedUser) {
      throw new NotFoundException(`User Update failed. Invalid user id: ${id}`);
    }

    delete updatedUser.password;
    return updatedUser;
  }

  async deleteUser(id) {
    const isUserDeleted = await this.userRepository.deleteUser(id);
    if (!isUserDeleted) {
      throw new NotFoundException(
        `User deletion failed. Invalid user id: ${id}`,
      );
    }
  }
}
