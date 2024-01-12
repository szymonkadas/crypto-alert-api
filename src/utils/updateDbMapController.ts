import { AxiosResponse } from 'axios';
import { PrismaService } from 'src/prisma.service';
import { CacheKeys, PrismaMapModels } from './enums';
import { updateDbMap } from './updateDbMap';

export default function updateDbMapController(
  mapId: CacheKeys,
  response: AxiosResponse,
  prismaService: PrismaService,
) {
  switch (mapId) {
    case CacheKeys.Fiat:
      updateDbMap(
        response,
        (subdata) => ({
          id: subdata.id,
          name: subdata.name,
          sign: subdata.sign,
          symbol: subdata.symbol,
        }),
        prismaService,
        PrismaMapModels.Fiat,
      );
      break;
    case CacheKeys.Crypto:
      updateDbMap(
        response,
        (subdata) => ({
          id: subdata.id,
          name: subdata.name,
        }),
        prismaService,
        PrismaMapModels.Crypto,
      );
      break;
    default:
      throw new Error(`There is no such db model: ${mapId}, try: ${CacheKeys}`);
  }
}
