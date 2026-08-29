import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  queryPosts,
 
} from "../controller/postController.mjs";

export const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.get("/", queryPosts);
router.post("/", createPost);
router.patch("/:updateId", updatePost);
router.delete("/:deleteId", deletePost);
