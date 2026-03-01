import { Identifier } from '../utils/identifier.js';

export class UsersRepository {
  constructor(userDB = []) {
    this.users = userDB;
  }

    async findByEmail(email) {
        return this.users.find(user => user.email === email) || null;
    }

    async createUser(user) {
        // Generate a unique identifier for the new user
        user.id = Identifier.generate();

        // Add createdAt and updatedAt timestamps
        const timestamp = new Date().toISOString();
        user.created_at = timestamp;
        user.updated_at = timestamp;

        // Save the new user to the in-memory json database
        this.users.push(user);

        // Return the created user
        return user;
    }

    async findById(id) {
        return this.users.find(user => user.id === id) || null;
    }

    async getAllUsers() {
        return this.users;
    }

    async updateUser(id, updatedFields) {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return null;
        }

        // Update the updatedAt timestamp
        updatedFields.updated_at = new Date().toISOString();

        this.users[userIndex] = { ...this.users[userIndex], ...updatedFields };
        return this.users[userIndex];
    }
    
    async deleteUser(id) { 
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return false;
        }

        this.users.splice(userIndex, 1);
        return true;
    }
}