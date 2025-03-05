import { MAX_FILE_SIZE } from "@formscale/types";
import { Context } from "hono";
import { nanoid } from "nanoid";

export async function uploadFile(file: File, env: Env, ctx: Context) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds the maximum limit");
  }

  const ext = file.name.split(".").pop() || "";
  const key = `${nanoid(12)}.${ext}`;

  await env.BUCKET.put(key, file);

  const bucketUrl = env.BUCKET_URL;

  if (!bucketUrl) {
    throw new Error("Bucket URL is not set");
  }

  return `${bucketUrl}/${key}`;
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
