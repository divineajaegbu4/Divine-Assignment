import { ApiError } from "../error-handling/class-error.mjs";

let posts = [];

const getAllPosts = (_, res, next) => {
  if (!posts) {
    return next(new ApiError("Posts not found", 400));
  }

  res.status(200).json(posts);
};

const getPostById = (req, res, next) => {
  const postId = Number(req.params.id);

  if (!postId) {
    return next(new ApiError("postId not found", 404));
  }

  if (isNaN(postId)) {
    return next(new ApiError("postId is not a number", 400));
  }

  posts = posts.find((post) => post.id === postId);

  if (!posts) {
    return next(new ApiError("The id is not found", 404));
  }

  res.status(200).json(posts);
};

const queryPosts = (req, res, next) => {
    const userId = Number(req.query.userId);

    console.log(userId);

    if(isNaN(userId)) {
        return next(new ApiError("UserId must be a number", 400))
    }

    const filteredPosts = posts.filter(post => post.userId === userId)

    res.status(200).json(filteredPosts)
}

const createPost = (req, res, next) => {
  const { content, title, userId } = req.body;

  const id = posts.length + 1;

  const postData = {
    id,
    content,
    title,
    userId,
  };

  if (typeof content !== "string" || !content) {
    return next(
      new ApiError(
        "Content is a required field or content must be a string",
        400
      )
    );
  }

  if (typeof title !== "string" || !title) {
    return next(
      new ApiError("Title is a required field or title must be a string", 400)
    );
  }

  if (!userId) {
    return next(new ApiError("UserId not found", 404));
  }

  if (typeof userId !== "number") {
    return next(new ApiError("UserId is not a number", 400));
  }

  posts.push(postData);

  res.status(201).json(posts);
};

const updatePost = (req, res, next) => {
  const updatePostId = Number(req.params.updateId);
  const { content, title } = req.body;

  if (!updatePostId) {
    return next(new ApiError("updatePostId is not found", 404));
  }

  if (isNaN(updatePostId)) {
    return next(new ApiError("updatePostId is not a number", 400));
  }

  if (typeof content !== "string" || !content) {
    return next(
      new ApiError(
        "Content must be a string or content is a required field",
        400
      )
    );
  }

  if (typeof title !== "string" || !title) {
    return next(
      new ApiError("Title must be a string or title is a required field", 400)
    );
  }

  const findPost = posts.find((post) => post.id === updatePostId);

  Object.assign(findPost, { content, title });

  res.status(200).json(findPost);
};

const deletePost = (req, res, next) => {
  const deletePostById = Number(req.params.deleteId);

  if (!deletePostById) {
    return next(new ApiError("deletePostById is not found", 404));
  }

  if (isNaN(deletePostById)) {
    return next(new ApiError("deletePostById is not a number", 400));
  }

  posts = posts.filter((post) => post.id !== deletePostById);

  if (!posts) {
    return next(new ApiError("Unexpected error"));
  }

  res.status(200).json(posts);
};

export { getAllPosts, getPostById, createPost, updatePost, deletePost, queryPosts};
