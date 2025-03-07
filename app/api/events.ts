import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return getEvents(req, res);
  }

  if (req.method === "POST") {
    return createEvent(req, res);
  }

  return res.status(405).json({ message: "Method not allowed" });
}

async function getEvents(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { year, month } = req.query;
    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: new Date(`${year}-${month}-01`),
          lt: new Date(`${year}-${Number(month) + 1}-01`),
        },
      },
    });
    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류" });
  }
}

async function createEvent(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, date } = req.body;
    const newEvent = await prisma.event.create({ data: { title, date } });
    return res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류" });
  }
}
