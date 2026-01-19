
export type Platform = 'whatsapp' | 'telegram' | 'instagram';

export interface User {
    id: string;
    name: string;
    avatar?: string;
    email: string;
    phone?: string;
    about?: string;
}

export interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: string; // ISO string
    type: 'text' | 'image' | 'voice' | 'note';
}

export interface Conversation {
    id: string;
    user: User;
    platform: Platform;
    unreadCount: number;
    tags: string[];
    lastMessage: Message;
    messages: Message[];
}

export const CURRENT_USER_ID = 'me';

export const SLASH_TEMPLATES = [
    { id: '1', label: 'Greeting', text: 'Hi there! How can I help you today?' },
    { id: '2', label: 'Pricing', text: 'Our pricing plans start at $29/month. You can view full details at example.com/pricing.' },
    { id: '3', label: 'Support', text: 'I am looping in a support agent to assist you further.' },
    { id: '4', label: 'Closing', text: 'Is there anything else I can help you with? If not, have a great day!' },
];

const now = new Date();

export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 'c1',
        platform: 'whatsapp',
        unreadCount: 2,
        tags: ['lead', 'prospect'],
        user: {
            id: 'u1',
            name: 'Sarah Connor',
            email: 'sarah@techcorp.com',
            phone: '+1 (555) 000-0001',
            avatar: 'https://i.pravatar.cc/150?u=u1',
            about: 'Interested in the Enterprise CRM solution.',
        },
        lastMessage: {
            id: 'm1-last',
            senderId: 'u1',
            content: 'Can we schedule a demo for tomorrow?',
            timestamp: new Date(now.getTime() - 1000 * 60 * 5).toISOString(), // 5 mins ago
            type: 'text',
        },
        messages: [
            { id: 'm1-1', senderId: 'u1', content: 'Hi, I found your contact on LinkedIn.', timestamp: new Date(now.getTime() - 1000 * 60 * 60).toISOString(), type: 'text' },
            { id: 'm1-2', senderId: 'me', content: 'Hello Sarah! Thanks for reaching out. How can I help you regarding our CRM?', timestamp: new Date(now.getTime() - 1000 * 60 * 55).toISOString(), type: 'text' },
            { id: 'm1-3', senderId: 'u1', content: 'We are looking for a scalable solution for 50+ agents.', timestamp: new Date(now.getTime() - 1000 * 60 * 10).toISOString(), type: 'text' },
            { id: 'm1-4', senderId: 'u1', content: 'Can we schedule a demo for tomorrow?', timestamp: new Date(now.getTime() - 1000 * 60 * 5).toISOString(), type: 'text' },
        ]
    },
    {
        id: 'c2',
        platform: 'whatsapp',
        unreadCount: 0,
        tags: ['customer', 'support'],
        user: {
            id: 'u2',
            name: 'Michael Chen',
            email: 'mike.chen@startup.io',
            avatar: 'https://i.pravatar.cc/150?u=u2',
            about: 'Long-time customer. Needs help with API integration.',
        },
        lastMessage: {
            id: 'm2-last',
            senderId: 'me',
            content: 'Great, I will send the documentation shortly.',
            timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            type: 'text',
        },
        messages: [
            { id: 'm2-1', senderId: 'u2', content: 'Hey, having some issues with the v2 API key.', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 4).toISOString(), type: 'text' },
            { id: 'm2-note', senderId: 'me', content: 'Checked logs, rate limit exceeded.', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 3.5).toISOString(), type: 'note' },
            { id: 'm2-2', senderId: 'me', content: 'It looks like you hit the rate limit. I can bump it for you.', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 3).toISOString(), type: 'text' },
            { id: 'm2-3', senderId: 'u2', content: 'That would be helpful, thanks!', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2.5).toISOString(), type: 'text' },
            { id: 'm2-4', senderId: 'me', content: 'Great, I will send the documentation shortly.', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(), type: 'text' },
        ]
    },
    {
        id: 'c3',
        platform: 'whatsapp',
        unreadCount: 1,
        tags: ['partner'],
        user: {
            id: 'u3',
            name: 'Alice Johnson',
            email: 'alice@designstudio.com',
            avatar: 'https://i.pravatar.cc/150?u=u3',
            about: 'Design partner for the mobile app project.',
        },
        lastMessage: {
            id: 'm3-last',
            senderId: 'u3',
            content: 'Here are the updated assets.',
            timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            type: 'image',
        },
        messages: [
            { id: 'm3-1', senderId: 'me', content: 'Hi Alice, how is the design coming along?', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 26).toISOString(), type: 'text' },
            { id: 'm3-2', senderId: 'u3', content: 'Almost done! Just exporting the final assets.', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24.5).toISOString(), type: 'text' },
            { id: 'm3-3', senderId: 'u3', content: 'Here are the updated assets.', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(), type: 'image' },
        ]
    }
];
