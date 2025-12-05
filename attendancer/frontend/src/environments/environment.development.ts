export const environment = {
  apis: {
    login: "https://localhost:7198/api/User/login",
    register: "https://localhost:7198/api/User/register",
    getUser: 'https://localhost:7198/api/User',
    getUserMe: 'https://localhost:7198/api/User/me',
    updateUser: "https://localhost:7198/api/User/{id}",
    changePassword: "https://localhost:7198/api/User/{id}/password",
    postEvent: "https://localhost:7198/api/Event",
    postEventGroup: "https://localhost:7198/api/EventGroup",
    updateEvent: "https://localhost:7198/api/Event/{id}",
    updateEventGroup: "https://localhost:7198/api/EventGroup/{id}"
  },
  tokenKey: "attendancer-jwt-token"
};
