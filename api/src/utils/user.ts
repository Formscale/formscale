import { SafeUser } from "@formscale/types";
import { Context } from "hono";
import db from "../db";
import { findUnique } from "../db/crud";

export const getUser = (ctx: Context) => {
  const payload = ctx.get("jwtPayload") as { data: SafeUser };
  if (!payload?.data) {
    throw new Error("Unauthorized");
  }

  return payload.data;
};

export const getUserFromId = async (ctx: Context, id: string) => {
  const user = await findUnique(db(ctx.env), "user", { where: { id } });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
