export const likeKeys = {
  all: ['likeLists'] as const,
  details: () => [...likeKeys.all, 'detail'] as const,
  detail: (id: string) => [...likeKeys.details(), id] as const,
};

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: ({ sort, categoryId }: { sort: string; categoryId: string }) =>
    [...productKeys.lists(), sort, categoryId] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export const productsFromProviderKeys = {
  all: ['products', 'provider'] as const,
  lists: () => [...productsFromProviderKeys.all, 'list'] as const,
  list: ({ sort }: { sort: string }) => [...productsFromProviderKeys.lists(), sort] as const,
  details: () => [...productsFromProviderKeys.all, 'detail'] as const,
  detail: (id: string) => [...productsFromProviderKeys.details(), id] as const,
};

export const ordersFromConsumer = {
  all: ['orders', 'consumer'] as const,
  lists: () => [...ordersFromConsumer.all, 'list'] as const,
  list: ({ consumerId }: { consumerId: string }) => [...ordersFromConsumer.lists(), consumerId] as const,
  details: () => [...ordersFromConsumer.all, 'detail'] as const,
  detail: (orderId: string) => [...ordersFromConsumer.details(), orderId] as const,
};

export const ordersFromProvider = {
  all: ['orders', 'provider'] as const,
  lists: () => [...ordersFromProvider.all, 'list'] as const,
  list: ({ providerId }: { providerId: string }) => [...ordersFromProvider.lists(), providerId] as const,
  details: () => [...ordersFromProvider.all, 'detail'] as const,
  detail: (orderId: string) => [...ordersFromProvider.details(), orderId] as const,
};

export const refundsFromConsumer = {
  all: ['refunds', 'consumer'] as const,
  lists: () => [...refundsFromConsumer.all, 'list'] as const,
  list: ({ consumerId }: { consumerId: string }) => [...refundsFromConsumer.lists(), consumerId] as const,
  details: () => [...refundsFromConsumer.all, 'detail'] as const,
  detail: (orderId: string) => [...refundsFromConsumer.details(), orderId] as const,
};

export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: ({ page, productId }: { page?: number; productId: string }) =>
    [...reviewKeys.lists(), productId, page] as const,
  details: () => [...reviewKeys.all, 'detail'] as const,
  detail: (id: string) => [...reviewKeys.details(), id] as const,
};
