export enum CacheKeys {
  QuotesData = 'latestQuotesData',
  Fiat = 'fiatMap',
  Crypto = 'cryptocurrencyMap',
}

export enum MapEndpoints {
  Fiat = '/v1/fiat/map',
  Crypto = '/v1/cryptocurrency/map',
}

// EnumKeys but without QuotesData, used for MapEndpoints accessing and PrismaModels, so it's db map related data.
export enum DbMapEnumKeys {
  Fiat = 'Fiat',
  Crypto = 'Crypto',
}

export enum PrismaMapModels {
  Fiat = 'FiatData',
  Crypto = 'CryptoData',
}

// default enum keys, can be used to access CacheKeys.
export enum EnumKeys {
  QuotesData = 'QuotesData',
  Fiat = 'Fiat',
  Crypto = 'Crypto',
}
