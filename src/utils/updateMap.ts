import { PrismaService } from 'src/prisma.service';

export default async function updateMap(
  mapId: string,
  mappedResponse: any[],
  prismaService: PrismaService,
) {
  return await prismaService.mapData.upsert({
    where: {
      id: mapId,
    },
    update: {
      map: JSON.stringify({ map: mappedResponse }),
    },
    create: {
      id: mapId,
      map: JSON.stringify({ map: mappedResponse }),
    },
  });
}
