import { PrismaService } from 'src/prisma.service';
import { CacheKeys } from './enums';

export default async function dbUpdateMap(
  mapId: CacheKeys,
  mappedResponse: any[],
  prismaService: PrismaService,
) {
  return await prismaService.mapData.upsert({
    where: {
      id: mapId,
    },
    update: {
      map: JSON.stringify(mappedResponse),
    },
    create: {
      id: mapId,
      map: JSON.stringify(mappedResponse),
    },
  });
}
