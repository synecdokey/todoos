import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

// Example router with queries that can only be hit if the user requesting is signed in
export const protectedExampleRouter = createProtectedRouter()
  .query("getSession", {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
  .query("getSecretMessage", {
    resolve({ ctx }) {
      return "He who asks a question is a fool for five minutes; he who does not ask a question remains a fool forever.";
    },
  })
  .mutation("addTodo", {
    input: z.object({ text: z.string() }),
    resolve({ ctx, input }) {
      return ctx.prisma.todo.create({
        data: { userId: ctx.session.user.id!, text: input.text },
      });
    },
  })
  .mutation("removeTodo", {
    input: z.object({ id: z.string() }),
    resolve({ ctx, input }) {
      return ctx.prisma.todo.delete({ where: input });
    },
  })
  .query("getTodos", {
    resolve({ ctx }) {
      return ctx.prisma.todo.findMany({
        where: { userId: ctx.session.user.id },
      });
    },
  });
