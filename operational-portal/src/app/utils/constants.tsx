import { APPROVAL, USERSEARCH } from '@svgs';

export const API_URIS = {
  CLIENT_SEARCH: '/api/v1/client-search',
  CLIENT_DETAILS: '/api/v1/client/',
  PERMISSION_MAP: '/api/v1/permissions-map',
  DEPOSIT_ACCOUNT: '/api/v1/deposit-account/',
  TASKS: '/api/v1/tasks'
};

export const SEARCH_BY_LIST = [
  { value: 'mobile_number', label: 'Mobile Number' },
  { value: 'account_id', label: 'Account ID' },
  { value: 'name', label: 'Account Holder Name' },
  { value: 'email_id', label: 'Email' },
  { value: 'customer_id', label: 'Customer ID' }
];
export const SEARCH_VALUE_NAME = {
  mobile_number: 'Mobile Number',
  account_id: 'Account ID',
  name: 'Account Holder Name',
  email_id: 'Email',
  customer_id: 'Customer ID'
};
export const SIDE_MENU = [
  { slug: '/', title: 'User Search', image: USERSEARCH, active: true },
  { slug: '/approvals', title: 'Approvals', image: APPROVAL, active: true }
];

export const ID_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImtXYmthYTZxczh3c1RuQndpaU5ZT2hIYm5BdyJ9.eyJhdWQiOiI3NWJmZmUwYi1hNTk5LTQ2MjgtOTFkNC1jZTk1ZjczZTUxNWMiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vM2Y0YzBlZDgtYzk1My00MDU3LWFlNjEtZmYxM2M1MWUxY2M2L3YyLjAiLCJpYXQiOjE3MDc4ODQxNTIsIm5iZiI6MTcwNzg4NDE1MiwiZXhwIjoxNzA3ODg4MDUyLCJhaW8iOiJBWFFBaS84VkFBQUFMcFoxNjdhSzFxUDhnYlpIRDB0YVlpRE11bzhTTEEveXhXMDN5WHVHa3pNUFIrRlE4WS8rUDJ2NGZqV2hoU2ZBaUs1azlEaDV6VCtpVVhyRmlCRlNXZ0FySldLUThXMjFPTzNma1gwYytyRkQzMU8yQXo2UEg4RVBtb0hLYU9BVTFTZlRlNVo0eGJPVFF2OWQrcU1KdkE9PSIsImVtYWlsIjoic3VyYWouazMwQGRoYW5pLmNvbSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzI4NDIxZjM2LWU1YWItNGRjOC04OGM4LTk2Zjk5MmZhMmQ5Ny8iLCJuYW1lIjoiU3VyYWogS3VtYXIiLCJub25jZSI6ImUyOTU2ZmJkZmYzODRiMDJhYjcwZjJhYjBmODEwNmY3XzIwMjQwMjE0MDMzNDQ1Iiwib2lkIjoiYzY2YTBlZTctNGQyYy00NmIwLWJiYWItNjMxZjRmNmJlNGY3IiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3VyYWouazMwQGRoYW5pLmNvbSIsInJoIjoiMC5BUzhBMkE1TVAxUEpWMEN1WWY4VHhSNGN4Z3YtdjNXWnBTaEdrZFRPbGZjLVVWeXdBQ0UuIiwicm9sZXMiOlsiQ1VTVE9NRVJfU0VSVklDRV9BRFZJU09SIl0sInNpZCI6ImY2MTg5Njc5LTljMjUtNGQ3My04NmNiLTI5NDc1MmMxNGUzNyIsInN1YiI6IjhOcXhvNVVOclpXdnV1Vk5CUHBCUWw2SlZNYnNVOFlyaTctdVc2Tm82VzAiLCJ0aWQiOiIzZjRjMGVkOC1jOTUzLTQwNTctYWU2MS1mZjEzYzUxZTFjYzYiLCJ1dGkiOiJUcms3N1JEd0lFS0ZkVWRZLWtyU0FBIiwidmVyIjoiMi4wIn0.gjSag80kff-kSBUlqgEz5_cQ-HoSsfzM0vdqQ0z8fbxt8WJUQBV5LTEMDuIKrkd7x35CPEWemxLa35WLI8Ag8eqajBItVJVCxTChz45f73QCxRtAiW3dwxNHFWgG79vHVuQT_HKHZUo6j96Yc22utst9JHh46FtvlAtcVuiXQYv6KQ4K4V3OWWgD1WJF90BTzbQCYisP6mchxPdCUkozgrh0-QUJiHNsfvXyfAno9WfkT4AwuuTLnFhtGAqdvH31vcykaO-URD_7vbve7lGi2dZHgGOi4CrVMm4FXCkyQvRzspUZ-M4IUCoEZiMRQajNchsPgEPKDeN5GSXsxwxKRA';
