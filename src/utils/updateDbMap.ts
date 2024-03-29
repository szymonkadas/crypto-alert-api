import { AxiosResponse } from 'axios';
import { PrismaService } from 'src/prisma.service';
import { PrismaMapModels } from './enums';
import mapData from './mapData';

export type DBData = {
  id: number;
  [key: string]: any;
};

export type ResponseMapFunc<T> = (subdata: any) => T;

export type PrismaServiceMethodDelete = (param?: any) => any;
export type PrismaServiceMethodCreate = (param: {
  data: DBData | DBData[];
}) => any;

export async function updateDbMap<T extends DBData>(
  response: AxiosResponse,
  mapFunction: ResponseMapFunc<T>,
  prismaService: PrismaService,
  model: PrismaMapModels,
) {
  const responseData = response.data.data;
  const processedData = mapData(responseData, mapFunction);
  await prismaService[model].deleteMany({});
  await prismaService[model].createMany({ data: processedData });
}
