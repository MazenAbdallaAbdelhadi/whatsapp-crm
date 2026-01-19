
export type TemplateCategory = 'greeting' | 'follow_up' | 'promotional' | 'reminder' | 'support';

export interface Template {
    id: string;
    name: string;
    content: string;
    category: TemplateCategory;
    createdAt: Date;
    updatedAt: Date;
}

export const TEMPLATE_CATEGORIES: { value: TemplateCategory; label: string; color: string }[] = [
    { value: 'greeting', label: 'Greeting', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { value: 'follow_up', label: 'Follow Up', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { value: 'promotional', label: 'Promotional', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
    { value: 'reminder', label: 'Reminder', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { value: 'support', label: 'Support', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
];

export const MOCK_TEMPLATES: Template[] = [
    {
        id: '1',
        name: 'Welcome Message',
        content: "Hi {{first_name}}, thanks for reaching out to {{company}}! How can we help you today?",
        category: 'greeting',
        createdAt: new Date('2024-01-10T09:00:00'),
        updatedAt: new Date('2024-01-10T09:00:00'),
    },
    {
        id: '2',
        name: 'Catalog Follow-up',
        content: "Hello {{first_name}}, did you get a chance to check our latest catalog? Let me know if you have questions.",
        category: 'follow_up',
        createdAt: new Date('2024-01-12T14:30:00'),
        updatedAt: new Date('2024-01-15T10:15:00'),
    },
    {
        id: '3',
        name: 'Meeting Reminder',
        content: "Hi {{first_name}}, just a reminder about our call scheduled for tomorrow regarding your inquiry.",
        category: 'reminder',
        createdAt: new Date('2024-01-14T11:00:00'),
        updatedAt: new Date('2024-01-14T11:00:00'),
    },
    {
        id: '4',
        name: 'Special Offer',
        content: "Hey {{first_name}}! exclusively for you: Get 20% off your next order with code SAVE20. Valid until Friday!",
        category: 'promotional',
        createdAt: new Date('2024-01-18T16:45:00'),
        updatedAt: new Date('2024-01-18T16:45:00'),
    }
];
