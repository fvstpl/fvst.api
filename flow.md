# Registration API Endpoints

## Register User
> POST /register

Initiates the user registration process by creating a temporary user record.

### Request Body
```json
{
    "mail": "user@example.com",
    "personal": { // optional, "null" if not presented
        "firstName": "John",
        "lastName": "Doe"
    },
    "security": {
        "password": "userPassword123"
    }
}
```

### Process Flow
1. Validates email format and password strength
2. Checks if email is already registered
3. Generates:
   - UUID for user
   - Authorization token
   - 6-digit verification code
4. Store temporary user data 
   - `code:123ABC` => user data
   - `mail:user@example.com` => "1" // Avoid creating user with same mail as account is neither verified nor activated
5. Send verification code to user's email

### Response
```cpp
STATUS 200
```

## Confirm Registration
> POST /register/confirm

Completes the registration process by validating the verification code.

### Request Body
```json
{
    "code": "ABC123"
}
```

### Process Flow
1. Check if code is presented in Redis
2. Create permanent user record in MongoDB
3. Clean up Redis temporary data
4. Creates user cache (12 hour expiry)

### Response
```json
STATUS 200
```

### Error Responses
Both endpoints may return:
```json
{
    "error": "Invalid input: <error>"
}
```
Common errors:
- Invalid input
- Invalid email or password
- Email already exists
- Invalid code
- Invalid user data