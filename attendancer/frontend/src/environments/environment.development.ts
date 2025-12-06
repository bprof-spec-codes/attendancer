export const environment = {
  apis: {
    login: "https://localhost:7198/api/User/login",
    register: "https://localhost:7198/api/User/register",
    getUser: 'https://localhost:7198/api/User',
    getUserMe: 'https://localhost:7198/api/User/me',
    updateUser: "https://localhost:7198/api/User/{id}",
    changePassword: "https://localhost:7198/api/User/{id}/password",
    eventGroupView: "https://localhost:7198/api/EventGroup/{eventGroupId}/matrix",
    eventGroupByUserId: "https://localhost:7198/api/EventGroup/ByUserId"
    deleteAccount: 'https://localhost:7198/api/User'
  },
  tokenKey: "attendancer-jwt-token"
};
