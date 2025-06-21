/**
 * @swagger
 * tags:
 *   name: User
 *   description: Endpoints for user management
 */

/**
 * @swagger
 * /user/register-user:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 example: testuser
 *                 description: Must be between 3 and 30 characters
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: Must be a valid email address
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: userPassword123
 *                 description: Must be at least 6 characters long
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       example: User
 *       400:
 *         description: Username or email already taken
 *       500:
 *         description: Internal server error
 */
