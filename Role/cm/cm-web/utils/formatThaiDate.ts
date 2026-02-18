/**
 * Format date to Thai short format: "1 ม.ค. 66"
 * Supports: Date object, YYYY-MM-DD, DD/MM/YYYY, ISO string, "DD/MM/YYYY HH:mm"
 * If already contains Thai text, normalizes to 2-digit year.
 */

const THAI_MONTHS_SHORT = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

const THAI_MONTHS_FULL = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

/**
 * Normalize any Thai date string to use 2-digit year.
 * e.g. "20 ธ.ค. 2558" → "20 ธ.ค. 58", "10 ม.ค. 59" → "10 ม.ค. 59" (already 2-digit)
 */
function normalizeThaiDateTo2DigitYear(input: string): string {
    // Match: day + Thai month + 4-digit year (25xx)
    const m = input.match(/^(\d{1,2}\s+\S+\s+)(25\d{2})$/);
    if (m) {
        return m[1] + m[2].slice(-2);
    }
    return input;
}

export function formatThaiDate(input: string | Date | undefined | null): string {
    if (!input || input === '-') return '-';

    // If already contains Thai characters, normalize to 2-digit year and return
    if (typeof input === 'string' && /[ก-๙]/.test(input)) {
        return normalizeThaiDateTo2DigitYear(input);
    }

    let date: Date | null = null;

    if (input instanceof Date) {
        date = input;
    } else if (typeof input === 'string') {
        const trimmed = input.trim();

        // Handle "DD/MM/YYYY" or "DD/MM/YYYY HH:mm"
        const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (slashMatch) {
            const [, dd, mm, yyyy] = slashMatch;
            let year = parseInt(yyyy);
            // If year > 2400, it's already Buddhist era
            if (year > 2400) year -= 543;
            date = new Date(year, parseInt(mm) - 1, parseInt(dd));
        }

        // Handle "YYYY-MM-DD" or ISO format
        if (!date) {
            const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
            if (isoMatch) {
                const [, yyyy, mm, dd] = isoMatch;
                let year = parseInt(yyyy);
                if (year > 2400) year -= 543;
                date = new Date(year, parseInt(mm) - 1, parseInt(dd));
            }
        }

        // Fallback: try native Date parsing
        if (!date) {
            const parsed = new Date(trimmed);
            if (!isNaN(parsed.getTime())) {
                date = parsed;
            }
        }
    }

    if (!date || isNaN(date.getTime())) {
        return typeof input === 'string' ? input : '-';
    }

    const day = date.getDate();
    const month = THAI_MONTHS_SHORT[date.getMonth()];
    const buddhistYear = date.getFullYear() + 543;
    const shortYear = String(buddhistYear).slice(-2);

    return `${day} ${month} ${shortYear}`;
}

/**
 * Format date to Thai full format: "1 มกราคม 2566"
 */
export function formatThaiDateFull(input: string | Date | undefined | null): string {
    if (!input || input === '-') return '-';
    if (typeof input === 'string' && /[ก-๙]/.test(input)) return input;

    let date: Date | null = null;

    if (input instanceof Date) {
        date = input;
    } else if (typeof input === 'string') {
        const trimmed = input.trim();
        const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (slashMatch) {
            const [, dd, mm, yyyy] = slashMatch;
            let year = parseInt(yyyy);
            if (year > 2400) year -= 543;
            date = new Date(year, parseInt(mm) - 1, parseInt(dd));
        }
        if (!date) {
            const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
            if (isoMatch) {
                const [, yyyy, mm, dd] = isoMatch;
                let year = parseInt(yyyy);
                if (year > 2400) year -= 543;
                date = new Date(year, parseInt(mm) - 1, parseInt(dd));
            }
        }
        if (!date) {
            const parsed = new Date(trimmed);
            if (!isNaN(parsed.getTime())) date = parsed;
        }
    }

    if (!date || isNaN(date.getTime())) {
        return typeof input === 'string' ? input : '-';
    }

    const day = date.getDate();
    const month = THAI_MONTHS_FULL[date.getMonth()];
    const buddhistYear = date.getFullYear() + 543;

    return `${day} ${month} ${buddhistYear}`;
}