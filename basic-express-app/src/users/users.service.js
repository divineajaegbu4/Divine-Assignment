import { Validator } from "../utils/validator.js";
import { UserDataValidator } from "./dto/user.dto.js";
import { UserBadRequestException } from "./exceptions/user.badrequest.js";
import { UserConflictException } from "./exceptions/user.conflict.js";
import { UserServerException } from "./exceptions/user.servererror.js";

export class UserService {
  constructor(userRepository, contactService, todoService, passwordService) {
    this.userRepository = userRepository;
    this.contactService = contactService;
    this.passwordService = passwordService;
    this.todoService = todoService
  }

  async findByEmail(email) {
    return this.userRepository.findByEmail(email);
  }

  async createUser(user) {
    const { error } = UserDataValidator.validateNewUser(user);

    if (error) {
      throw new UserBadRequestException(
        Validator.joiValidationErrorToString(error),
      );
    }

    // Phone number and email verification for uniqueness.
    let existingUserContact = await this.contactService.findByPhone(
      user.contacts[0].phone_number,
    );
    if (existingUserContact) {
      throw new UserConflictException("Phone number already exists");
    }
    existingUserContact = await this.contactService.findByEmail(
      user.contacts[0].email,
    );
    if (existingUserContact) {
      throw new UserConflictException("Email already exists");
    }

    // Pull out contacts to save separately
    let contacts = structuredClone(user.contacts);

    // Pull out todos to save separately
    let todos = structuredClone(user.todos);
    // Remove the contacts property from the user object.
    delete user.contacts;

    // Remove the todos property from the user object.
    delete user.todos;

    // Hash the user password and save only the hashed password.
    // Never save any user's plain password for their security.
    user.password = await this.passwordService.hash(user.password);

    // Set default user status and role
    user.status = "active";
    user.role = "user";

    // Save the user's data.
    const createdUser = await this.userRepository.createUser(user);

    console.log({ createdUser });

    // Delete user's password from the response.
    delete createdUser.password;

    contacts = contacts.map((contact) => {
      contact.user_id = createdUser.id;

      return contact;
    });

    todos = todos.map(todo => {
        todo.user_id = todo.id

        return todo
    })

    let createdContacts = [];

    let createdTodos = []
    try {
      createdContacts = await this.contactService.createNewContact(contacts);

      createdTodos =  await this.todoService.createTodos(todos)
    } catch (error) {
      this.userRepository.deleteUser(createdUser.id);

      throw new UserServerException(
        "User creation failed: " + error.message + "\n" + error,
      );
    }

    // Return the new user details.
    return { ...createdUser, contacts: createdContacts, todos: createdTodos };
  }

  async findById(id) {
    return await this.userRepository.findById(id);
  }

  async getAllUsers() {
    try {
      return await this.userRepository.getAllUsers();
    } catch (error) {
      throw new UserServerException(
        "Failed to retrieve users: " + error.message,
      );
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
