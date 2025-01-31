import { PrismaClient } from "@prisma/client";

export async function create<T extends keyof PrismaClient>(prisma: PrismaClient, model: T, data: any) {
  return await (prisma[model] as any).create({
    data,
  });
}

export async function findMany<T extends keyof PrismaClient>(
  prisma: PrismaClient,
  model: T,
  params: {
    where?: any;
    include?: any;
    orderBy?: any;
  } = {}
) {
  return await (prisma[model] as any).findMany(params);
}

export async function findOne<T extends keyof PrismaClient>(
  prisma: PrismaClient,
  model: T,
  params: {
    where: any;
    include?: any;
  }
) {
  return await (prisma[model] as any).findFirst(params);
}

export async function update<T extends keyof PrismaClient>(
  prisma: PrismaClient,
  model: T,
  params: {
    where: any;
    data: any;
  }
) {
  return await (prisma[model] as any).update(params);
}

export async function remove<T extends keyof PrismaClient>(prisma: PrismaClient, model: T, where: any) {
  return await (prisma[model] as any).delete({
    where,
  });
}

export async function secureFind<T extends keyof PrismaClient>(prisma: PrismaClient, model: T, userId: string, id: string) {
  return await (prisma[model] as any).findFirst({
    where: {
      id,
      userId,
    },
  });
}

export async function secureUpdate<T extends keyof PrismaClient>(prisma: PrismaClient, model: T, userId: string, id: string, data: any) {
  return await (prisma[model] as any).update({
    where: {
      id,
      userId,
    },
    data,
  });
}

export async function secureDelete<T extends keyof PrismaClient>(prisma: PrismaClient, model: T, userId: string, id: string) {
  return await (prisma[model] as any).delete({
    where: {
      id,
      userId,
    },
  });
}

// export async function getUserForms(c: Context, userId: string) {
//   const prisma = db(c.env);
//   return await findMany(prisma, "form", {
//     where: { userId },
//   });
// }

// export async function updateForm(c: Context, userId: string, formId: string, data: any) {
//   const prisma = db(c.env);
//   return await secureUpdate(prisma, "form", userId, formId, data);
// }
