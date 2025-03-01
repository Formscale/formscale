import db from "@/db";
import { LogType } from "@formhook/types";
import { create } from "../db/crud";

interface LoggerProps {
  env: Env;
  submissionId: string;
  message: string;
  type?: LogType;
  code?: number;
  data?: Record<string, any>;
}

export default async function logger({
  env,
  submissionId,
  message,
  type = "submission",
  code = 200,
  data = {},
}: LoggerProps) {
  if (!submissionId) {
    throw new Error("Log error: submissionId is required");
  }

  try {
    const log = await create(db(env), "log", {
      submissionId,
      type,
      message,
      code,
      data: JSON.stringify(data),
    });

    console.log(log);

    return log;
  } catch (error) {
    throw new Error("Log error: failed to create log");
  }
}
