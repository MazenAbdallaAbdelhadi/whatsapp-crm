
export type LeadStatus = 'New' | 'Replied' | 'Awaiting Reply' | 'Interested' | 'Not Interested' | 'Converted' | 'Blocked';
export type LeadSource = 'WhatsApp Chat' | 'Catalog Inquiry' | 'Broadcast Reply' | 'Facebook Ad' | 'Website Widget' | 'Referral';

export interface Lead {
    id: string;
    name: string;
    phone: string; // WhatsApp number
    avatar: string;
    company: string; // Optional for B2C
    role: string;
    status: LeadStatus;
    source: LeadSource;
    value: number; // Potential deal value
    lastMessage: string;
    unreadCount: number;
    lastContacted: Date;
    owner: {
        name: string;
        avatar: string;
    };
    tags: string[];
}

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Replied', 'Awaiting Reply', 'Interested', 'Not Interested', 'Converted', 'Blocked'];
export const LEAD_SOURCES: LeadSource[] = ['WhatsApp Chat', 'Catalog Inquiry', 'Broadcast Reply', 'Facebook Ad', 'Website Widget', 'Referral'];

const OWNERS = [
    { name: 'Michael Scott', avatar: 'https://i.pravatar.cc/150?u=michael' },
    { name: 'Pam Beesly', avatar: 'https://i.pravatar.cc/150?u=pam' },
    { name: 'Jim Halpert', avatar: 'https://i.pravatar.cc/150?u=jim' },
    { name: 'Dwight Schrute', avatar: 'https://i.pravatar.cc/150?u=dwight' },
];

const FIRST_NAMES = ['John', 'Jane', 'Michael', 'Emily', 'Chris', 'Sarah', 'David', 'Laura', 'Robert', 'Jessica', 'William', 'Ashley', 'James', 'Amanda', 'John', 'Jennifer'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'];
const COMPANIES = ['Acme Corp', 'Globex', 'Soylent Corp', 'Initech', 'Umbrella Corp', 'Stark Ind', 'Wayne Ent', 'Cyberdyne', 'Massive Dynamic', 'Hooli', 'StartUp Inc', 'Freelance'];
const ROLES = ['CTO', 'CEO', 'VP Sales', 'Director', 'Manager', 'Engineer', 'Designer', 'Product Owner', 'Founder', 'Customer'];
// WhatsApp-like messages
const MESSAGES = [
    "Hey, I'm interested in your pricing plan.",
    "Can you send me the catalog?",
    "Is this available in bulk?",
    "Thanks for the info!",
    "I'll get back to you next week.",
    "Do you offer support?",
    "Where are you located?",
    "Just checking in.",
    "Order received, thanks.",
    "Call me please."
];

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePhoneNumber() {
    return `+${getRandomInt(1, 99)} ${getRandomInt(100, 999)} ${getRandomInt(100, 999)} ${getRandomInt(1000, 9999)}`;
}

function generateMockLeads(count: number): Lead[] {
    return Array.from({ length: count }).map((_, i) => {
        const firstName = getRandomElement(FIRST_NAMES);
        const lastName = getRandomElement(LAST_NAMES);
        const name = `${firstName} ${lastName}`;
        const company = Math.random() > 0.3 ? getRandomElement(COMPANIES) : 'Individual';

        return {
            id: `lead-${i + 1}`,
            name,
            phone: generatePhoneNumber(),
            avatar: `https://i.pravatar.cc/150?u=${i + 200}`, // Offset to get different avatars from owners
            company,
            role: getRandomElement(ROLES),
            status: getRandomElement(LEAD_STATUSES),
            source: getRandomElement(LEAD_SOURCES),
            value: getRandomInt(100, 20000), // Lower value for WhatsApp commerce feels
            lastMessage: getRandomElement(MESSAGES),
            unreadCount: Math.random() > 0.7 ? getRandomInt(1, 5) : 0,
            lastContacted: new Date(Date.now() - getRandomInt(0, 7 * 24 * 60 * 60 * 1000)), // More recent
            owner: getRandomElement(OWNERS),
            tags: Array.from({ length: getRandomInt(0, 3) }).map(() => getRandomElement(['VIP', 'New Customer', 'Returning', 'Pending Payment', 'Urgent', 'Inquiry'])),
        };
    });
}

export const MOCK_LEADS = generateMockLeads(64);
