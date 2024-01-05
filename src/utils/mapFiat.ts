import { AxiosResponse } from 'axios';
import { PrismaService } from 'src/prisma.service';
import updateMap from './updateMap';

export default async function mapFiat(
  response: AxiosResponse<any, any>,
  prismaService: PrismaService,
) {
  const data = response.data.data;
  const mappedResponse = [];
  // map response
  data.forEach((subdata) => {
    mappedResponse.push([
      subdata.symbol,
      { name: subdata.name, sign: subdata.sign, id: subdata.id },
    ]);
  });
  // save in db data
  try {
    updateMap('fiat', mappedResponse, prismaService);
  } catch (e) {
    console.log('fiat map update failed', e);
  }
  return mappedResponse;
}
