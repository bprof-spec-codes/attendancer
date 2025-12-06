export const environment = {
  apis: {
    login: "https://localhost:7198/api/User/login",
    register: "https://localhost:7198/api/User/register",
    getUser: 'https://localhost:7198/api/User',
    getUserMe: 'https://localhost:7198/api/User/me',
    updateUser: "https://localhost:7198/api/User/{id}",
    changePassword: "https://localhost:7198/api/User/{id}/password",
    deleteAccount: 'https://localhost:7198/api/User'
  },
  tokenKey: "attendancer-jwt-token"
};
