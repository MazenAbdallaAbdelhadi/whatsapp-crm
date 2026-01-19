
export const AVAILABLE_VARIABLES = [
    { id: 'first_name', label: 'First Name', sample: 'Sarah' },
    { id: 'last_name', label: 'Last Name', sample: 'Connor' },
    { id: 'full_name', label: 'Full Name', sample: 'Sarah Connor' },
    { id: 'company', label: 'Company', sample: 'TechCorp' },
    { id: 'phone', label: 'Phone', sample: '+1 555 0199' },
];

export function interpolateTemplate(content: string, sampleData: Record<string, string> = {}): string {
    let result = content;

    // First pass: replace known variables with samples if available
    AVAILABLE_VARIABLES.forEach(v => {
        const regex = new RegExp(`{{${v.id}}}`, 'g');
        const replacement = sampleData[v.id] || v.sample;
        result = result.replace(regex, replacement);
    });

    // Second pass: catch generic {{...}} that might be unmatched and leave them or bold them? 
    // For now, let's just leave unknown variables as is for clarity, or mock them.
    // simpler regex for any remaining {{key}}
    return result.replace(/{{([\w_]+)}}/g, (match, key) => {
        return sampleData[key] || `[${key}]`;
    });
}
