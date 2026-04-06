import {AuthToken} from "../security/auth.token.js";
import {Password} from "../security/password.js";
import {BadRequestException} from "../exceptions/badrequest.exception.js";
import {AuthenticationException} from "../exceptions/authentication.exception.js";

export class AuthService {
    constructor(userService) {
        this.userService = userService;
    }

    async signup(signupData) {
        let user;
        try {
            user = await this.userService.createUser(signupData);
        } catch (error) {
            throw new BadRequestException(`Signup failed: ${error.message}`);
        }

        console.log(user);
        
        user.auth_token = AuthToken.sign({
            id: user.id,
            role: user.role,
            status: user.status
        });

        return user;
    }

    async login (loginData) {
        const user = structuredClone(await this.userService.findByEmail(loginData.email));
        if (!user) {
            throw new AuthenticationException("Invalid email or password");
        }

        const isPasswordValid = await new Password().verify(loginData.password, user.password);
        if (!isPasswordValid) {
            throw new AuthenticationException("Invalid email or password");
        }

        delete user.password;

        user.auth_token = AuthToken.sign({
            id: user.id,
            role: user.role,
            status: user.status
        });

        return user;
    }
}