import { CreateForm, FormSettings, FormSettingsSchema, Log, SubmissionSent } from "@formhook/types";
import { PrismaClient } from "@prisma/client";

interface FormResult {
  settings: string;
  [key: string]: any;
}

function parseForm(result: FormResult) {
  if (!result) return null;

  try {
    const settings = JSON.parse(result.settings) as FormSettings;
    const submissions = result.submissions?.map((submission: SubmissionSent) => ({
      ...submission,
      data: JSON.parse(submission.data),
    }));

    return {
      ...result,
      settings,
      submissions,
    };
  } catch (error) {
    return {
      ...result,
      settings: FormSettingsSchema.parse({}),
    };
  }
}

function parseLog(result: Log) {
  if (!result) return null;

  try {
    const data = typeof result.data === "string" ? JSON.parse(result.data) : result.data;

    return {
      ...result,
      data,
    };
  } catch (error) {
    return {
      ...result,
      data: {},
    };
  }
}

function parseForms(results: FormResult[]) {
  return results.map((form) => parseForm(form));
}

function parseLogs(results: Log[]) {
  return results.map((log) => parseLog(log));
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
  } else if (model === "log") {
    return parseLogs(results);
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
  } else if (model === "log") {
    return parseLog(result);
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
  } else if (model === "log") {
    return parseLog(result);
  }
  return result;
}

export async function create<T extends keyof PrismaClient>(
  prisma: PrismaClient,
  model: T,
  data: T extends "form" ? CreateForm & { id: string; userId: string; development: boolean } : any
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
    include?: any;
  }
) {
  const result = await (prisma[model] as any).update(params);

  if (model === "form") {
    return parseForm(result);
  } else if (model === "log") {
    return parseLog(result);
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
  params: { include?: any; where?: any } = {}
) {
  return findOne(prisma, model, {
    where: { id, userId, ...params.where },
    ...params,
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
  data: any,
  params: { include?: any } = {}
) {
  return await update(prisma, model, {
    where: { id, userId },
    data,
    ...params,
  });
}

export async function secureDelete<T extends keyof PrismaClient>(
  prisma: PrismaClient,
  model: T,
  userId: string,
  id: string
) {
  const record = await findUnique(prisma, model, { where: { id, userId } });
  if (!record) throw new Error(`${String(model)} not found or you don't have permission to delete it`);

  if (model === "form") {
    const submissions = await prisma.submission.findMany({ where: { formId: id } });

    for (const submission of submissions) {
      await prisma.log.deleteMany({ where: { submissionId: submission.id } });
    }

    await prisma.submission.deleteMany({ where: { formId: id } });
  }

  return await remove(prisma, model, { id, userId });
}

export async function secureDeleteLinked<T extends keyof PrismaClient, P extends keyof PrismaClient>(
  prisma: PrismaClient,
  childModel: T,
  parentModel: P,
  userId: string,
  id: string,
  parentIdField: string = `${String(parentModel)}Id`
) {
  const child = await findUnique(prisma, childModel, { where: { id } });
  if (!child) throw new Error(`${String(childModel)} not found`);

  const parentId = child[parentIdField];
  if (!parentId || !(await secureFind(prisma, parentModel, userId, parentId))) {
    throw new Error(`Permission denied for this ${String(childModel)}`);
  }

  if (childModel === "submission") {
    await prisma.log.deleteMany({ where: { submissionId: id } });
  }

  return await remove(prisma, childModel, { id });
}
