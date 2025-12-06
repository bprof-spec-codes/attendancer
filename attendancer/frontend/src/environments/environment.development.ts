export const environment = {
  apis: {
    login: "https://localhost:7198/api/User/login",
    register: "https://localhost:7198/api/User/register",
    getUser: "https://localhost:7198/api/User/{id}",
    getUserMe: 'https://localhost:7198/api/User/me',
    updateUser: "https://localhost:7198/api/User",
    changePassword: "https://localhost:7198/password"
  },
  tokenKey: "attendancer-jwt-token"
};
