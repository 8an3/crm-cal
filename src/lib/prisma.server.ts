/* eslint-disable no-var */

/** import { PrismaClient } from "@prisma/client";
const { DATABASE_URL } = require('../configs/database'); // Adjust the path as needed

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient;
}

const prismaOptions = {
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'production' ? ['query'] : [],
};

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient(prismaOptions);
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient(prismaOptions);
  }
  prisma = global.__db__;
  prisma.$connect();
}

export { prisma };
 */
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: ['query'],
  });
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient({
      // log: ['query'],
    });
  }
  prisma = global.__db__;
  prisma.$connect();
}

export { prisma };

