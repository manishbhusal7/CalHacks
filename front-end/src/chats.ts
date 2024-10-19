import { ChatProps, UserProps} from "./messages/types";

let users:UserProps[] = [{
    name: 'bot',
    username: '@medbot',
    avatar: '/static/images/avatar/2.jpg',
    online: true,
}]

export const chats: ChatProps[] = [
    {
      id: '1',
      sender: users[0],
      messages: [
        {
          id: '1',
          content: 'How can i assist you today?',
          timestamp: 'Wednesday 9:00am',
          sender: users[0],
        },
        ]
    }
  ];