import { CreateForm, FormSettings, FormSettingsSchema } from "@formhook/types";
import { PrismaClient } from "@prisma/client";

interface FormResult {
  settings: string;
  [key: string]: any;
}

function parseForm(result: FormResult) {
  if (!result) return null;

  try {
    return {
      ...result,
      settings: JSON.parse(result.settings) as FormSettings,
    };
  } catch {
    return {
      ...result,
      settings: FormSettingsSchema.parse({}),
    };
  }
}

function parseForms(results: FormResult[]) {
  return results.map((form) => parseForm(form));
}

export async function findMany<T extends keyof PrismaClient>(
  prisma: PrismaClient,
  model: T,
  params: {
    where?: any;
    include?: any;
    orderBy?: any;
  } = {
    orderBy: { createdAt: "desc" },
  }
) {
  const results = await (prisma[model] as any).findMany(params);

  if (model === "form") {
    return parseForms(results);
  }
  return results;
}

export async function findOne<T extends keyof PrismaClient>(
  prisma: PrismaClient,
  model: T,
  params: {
    where: any;
    include?: any;
  }
) {
  const result = await (prisma[model] as any).findFirst(params);

  if (model === "form") {
    return parseForm(result);
  }
  return result;
}

export async function findUnique<T extends keyof PrismaClient>(
  prisma: PrismaClient,
  model: T,
  params: {
    where: any;
    include?: any;
  }
) {
  const result = await (prisma[model] as any).findUnique(params);

  if (model === "form") {
    return parseForm(result);
  }
  return result;
}

export async function create<T extends keyof PrismaClient>(
  prisma: PrismaClient,
  model: T,
  data: T extends "form" ? CreateForm & { id: string; userId: string } : any
) {
  if (model === "form") {
    const user = await findUnique(prisma, "user", { where: { id: data.userId } });

    if (!user) {
      throw new Error("User not found");
    }

    const defaultSettings = FormSettingsSchema.parse({
      ...data.settings,
      emailSettings: {
        ...data.settings?.emailSettings,
        to: [user?.email || ""],
      },
    });

    return await prisma.form.create({
      data: {
        ...data,
        settings: JSON.stringify(defaultSettings),
      },
    });
  }
  return await (prisma[model] as any).create({ data });
}

export async function update<T extends keyof PrismaClient>(
  prisma: PrismaClient,
  model: T,
  params: {
    where: any;
    data: any;
  }
) {
  const result = await (prisma[model] as any).update({
    ...params,
    data: {
      ...params.data,
      updatedAt: new Date(),
    },
  });

  if (model === "form") {
    return parseForm(result);
  }
  return result;
}

export async function remove<T extends keyof PrismaClient>(prisma: PrismaClient, model: T, where: any) {
  return await (prisma[model] as any).delete({
    where,
  });
}

export async function secureFind<T extends keyof PrismaClient>(
  prisma: PrismaClient,
  model: T,
  userId: string,
  id: string,
  params: { include?: any } = {}
) {
  return findOne(prisma, model, {
    where: { id, userId },
    include: params.include,
  });
}

export async function secureFindMany<T extends keyof PrismaClient>(
  prisma: PrismaClient,
  model: T,
  userId: string,
  params: { where?: any; include?: any; orderBy?: any } = {}
) {
  return findMany(prisma, model, {
    ...params,
    where: { ...params.where, userId },
  });
}

export async function secureUpdate<T extends keyof PrismaClient>(
  prisma: PrismaClient,
  model: T,
  userId: string,
  id: string,
  data: any
) {
  return await update(prisma, model, {
    where: { id, userId },
    data,
  });
}

export async function secureDelete<T extends keyof PrismaClient>(
  prisma: PrismaClient,
  model: T,
  userId: string,
  id: string
) {
  return await remove(prisma, model, { id, userId });
}
