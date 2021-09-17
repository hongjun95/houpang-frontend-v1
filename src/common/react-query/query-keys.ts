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
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: ({ sort }: { sort: string }) => [...productKeys.lists(), sort] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};
