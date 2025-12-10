export const environment = {
  production: true,
  apis: {
    base: "https://api.attendancer.hu",
    login: "https://api.attendancer.hu/api/User/login",
    register: "https://api.attendancer.hu/api/User/register",
    getUser: 'https://api.attendancer.hu/api/User',
    getUserMe: 'https://api.attendancer.hu/api/User/me',
    updateUser: "https://api.attendancer.hu/api/User",
    changePassword: "https://api.attendancer.hu/api/User/{id}/password",
    deleteAccount: 'https://api.attendancer.hu/api/User',
    postEvent: "https://api.attendancer.hu/api/Event",
    postEventGroup: "https://api.attendancer.hu/api/EventGroup",
    updateEvent: "https://api.attendancer.hu/api/Event/{id}",
    updateEventGroup: "https://api.attendancer.hu/api/EventGroup/{id}",
    eventGroupView: "https://api.attendancer.hu/api/EventGroup/{eventGroupId}/matrix",
    eventGroupByUserId: "https://api.attendancer.hu/api/EventGroup/ByUserId",
    eventsByUser: 'https://api.attendancer.hu/GetEventsByUserId',
    deleteEvent: 'https://api.attendancer.hu/api/Event/{id}',
    deleteEventGroup: 'https://api.attendancer.hu/api/EventGroup/{id}',
    eventsByGroupId: 'https://api.attendancer.hu/api/Event/group/{id}'
  },
  tokenKey: 'attendancer-jwt-token',
};
