// GET permissions-map
const getPermissions = () => {
  return fetch('/api/permissions-map').then((data) => data.json());
};

const permissionsService = {
  getPermissions
};

export default permissionsService;
