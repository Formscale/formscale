import { MAX_FILE_SIZE } from "@formhook/types";
import { Context } from "hono";

export async function uploadFile(file: File, env: Env, ctx: Context) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds the maximum limit");
  }

  const key = `${Date.now()}-${file.name}`;
  await env.BUCKET.put(key, file);
  return `${ctx.env.BUCKET_URL}/${key}`;
}

export async function uploadFiles(formData: FormData, env: Env, ctx: Context) {
  const uploads = [];
  for (const [key, value] of formData.entries()) {
    const file = value as unknown as File;
    if (file instanceof File) {
      const url = await uploadFile(file, env, ctx);
      uploads.push({ field: key, url });
    }
  }

  return uploads;
}
