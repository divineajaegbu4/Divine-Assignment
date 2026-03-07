import {Identifier} from '../utils/identifier.js';
import {Pagination} from "../utils/pagination.js";

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

    async getAllUsers(queryFilter = {}) {
        let {page, limit, role, status, search} = queryFilter;
        let queryResults = this.users;

        if (role) {
            queryResults = queryResults.filter(user => user.role === role);
        }
        if (status) {
            queryResults = queryResults.filter(user => user.status === status);
        }
        if (search) {
            queryResults = queryResults.filter(
                user =>
                    user.first_name.toLowerCase().includes(search.toLowerCase()) ||
                    user.last_name.toLowerCase().includes(search.toLowerCase()) ||
                    user.username.toLowerCase().includes(search.toLowerCase())
            );
        }

        return new Pagination(page, limit, queryResults, 'users').paginate()
    }

    async updateUser(id, updatedFields) {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return null;
        }

        // Update the updatedAt timestamp
        updatedFields.updated_at = new Date().toISOString();

        this.users[userIndex] = {...this.users[userIndex], ...updatedFields};
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