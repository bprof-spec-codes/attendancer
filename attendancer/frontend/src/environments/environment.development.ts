export const environment = {
  apis: {
    login: "https://localhost:7198/api/User/login",
    register: "https://localhost:7198/api/User/register",
    getUser: 'https://localhost:7198/api/User',
    getUserMe: 'https://localhost:7198/api/User/me',
    updateUser: "https://localhost:7198/api/User/{id}",
    changePassword: "https://localhost:7198/api/User/{id}/password",
    deleteAccount: 'https://localhost:7198/api/User',
    postEvent: "https://localhost:7198/api/Event",
    postEventGroup: "https://localhost:7198/api/EventGroup",
    updateEvent: "https://localhost:7198/api/Event/{id}",
    updateEventGroup: "https://localhost:7198/api/EventGroup/{id}",
    eventGroupView: "https://localhost:7198/api/EventGroup/{eventGroupId}/matrix",
    eventGroupByUserId: "https://localhost:7198/api/EventGroup/ByUserId"
  },
  tokenKey: "attendancer-jwt-token"
};
