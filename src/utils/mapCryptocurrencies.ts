import { AxiosResponse } from 'axios';
import { PrismaService } from 'src/prisma.service';
import updateMap from './updateMap';

export default async function mapCryptocurrencies(
  response: AxiosResponse<any, any>,
  prismaService: PrismaService,
) {
  const data = response.data.data;
  const mappedResponse = [];
  // map response
  data.forEach((subdata) => {
    mappedResponse.push([subdata.name, subdata.id]);
  });
  // save in db data
  try {
    await updateMap('cryptocurrency', mappedResponse, prismaService);
  } catch (e) {
    console.error(`cryptocurrency map update failed`, e);
  }
  return mappedResponse;
}
