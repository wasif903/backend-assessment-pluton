import Joi from "joi";

const blogSchema = Joi.object({
  title: Joi.string().min(5).max(50).required(),
  description: Joi.string().min(10).max(1000).required(),
  tags: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string().min(1).max(30)),
      Joi.string().min(1).max(30)
    )
    .optional()
});


export { blogSchema };
