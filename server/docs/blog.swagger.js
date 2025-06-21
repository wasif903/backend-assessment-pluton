/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog-related APIs
 */

/**
 * @swagger
 * /blog/{userID}/create-blog:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: userID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user creating the blog
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - featuredImage
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 50
 *                 example: How to Learn JavaScript
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 example: JavaScript is a versatile language used for both frontend and backend development...
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   minLength: 1
 *                   maxLength: 30
 *                 example: [ "JavaScript", "WebDev" ]
 *               featuredImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Blog Created Successfully
 *                 blog:
 *                   $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Validation error or missing image
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /blog/{userID}/edit-blog/{blogID}:
 *   patch:
 *     summary: Edit an existing blog post
 *     tags: [Blog]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user editing the blog
 *       - in: path
 *         name: blogID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog to edit
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Blog Title
 *               description:
 *                 type: string
 *                 example: Updated description of the blog.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["javascript", "node"]
 *               featuredImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Blog updated successfully
 *                 blog:
 *                   type: object
 *       400:
 *         description: Invalid input or missing image
 *       404:
 *         description: User or blog not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /blog/{userID}/delete-blog/{blogID}:
 *   delete:
 *     summary: Delete a blog post
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user deleting the blog
 *       - in: path
 *         name: blogID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog to be deleted
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Blog deleted successfully
 *       404:
 *         description: Blog not found or unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /blog/get-all:
 *   get:
 *     summary: Get all blogs with pagination and optional search
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of blogs per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Optional search query (by title, tags, etc.)
 *     responses:
 *       200:
 *         description: Blogs fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blogs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       featuredImage:
 *                         type: string
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       createdBy:
 *                         type: string
 *                       createdByUsername:
 *                         type: string
 *                       createdByEmail:
 *                         type: string
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       500:
 *         description: Internal server error
 */
