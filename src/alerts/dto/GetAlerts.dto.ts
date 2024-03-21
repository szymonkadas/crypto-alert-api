import { Prisma } from '@prisma/client';

export type GetUserAlertsDto = {
  email: string;
  id: string;
  crypto: string;
  price: number;
  currency: string;
  createdAt: Date;
};

export const convertPrismaAlertToDto = (
  alert: Prisma.AlertGetPayload<{
    include: {
      user: true;
      cryptoData: true;
      currencyData: true;
    };
  }>,
): GetUserAlertsDto => ({
  email: alert.user.email,
  id: alert.id,
  crypto: alert.cryptoData.name,
  price: alert.price,
  currency: alert.currencyData.symbol,
  createdAt: alert.createdAt,
});

export function convertDeletedAlertToDto(
  alert: Prisma.AlertGetPayload<{
    include: {
      cryptoData: {
        select: {
          name: true;
        };
      };
      currencyData: {
        select: {
          symbol: true;
        };
      };
    };
  }>,
): GetUserAlertsDto {
  const xd = alert;
  return {
    id: alert.id,
    email: alert.userEmail,
    crypto: alert.cryptoData.name,
    price: alert.price,
    currency: alert.currencyData.symbol,
    createdAt: alert.createdAt,
  };
}
