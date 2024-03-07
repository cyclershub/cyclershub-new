import { t } from "../context";
import { createForumProcedure } from "./create";
import { createPostProcedure } from "./createPost";
import { createThreadProcedure } from "./createThread";

export const forumRouter = t.router({
	create: createForumProcedure,
	createThread: createThreadProcedure,
	createPost: createPostProcedure,
})