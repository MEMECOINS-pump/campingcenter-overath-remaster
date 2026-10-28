import { describe, expect, it } from 'vitest';
import { company } from '@/data/company';
import { formatFinderLead } from '@/lib/finder-lead';

describe('formatFinderLead', () => {
  it('writes a German e-mail instead of raw answer codes', () => {
    const mail = formatFinderLead({
      name: 'Ada Camping',
      email: 'ada@example.com',
      phone: '0221 123456',
      answers: { persons: '2', sleeps: '2', bedLength: 'min195', budget: '50-80', style: 'komfort' },
      recommendedVehicleIds: ['mobile.de:1'],
    });

    expect(mail.to).toBe(company.emails.finderReport);
    expect(mail.subject).toBe('Camper-Finder – neue Anfrage');
    expect(mail.subject).not.toMatch(/Camping Finder/i);
    expect(mail.body).toContain('Anfrage aus dem Camper-Finder');
    expect(mail.body).toContain('Bettlänge: mindestens 195 cm');
    expect(mail.body).toContain('Budget: 50.000–80.000 €');
    expect(mail.body).toContain('Reiseart: längere Reisen');
    expect(mail.body).not.toContain('min195');
    expect(mail.body).not.toContain('{');
  });
});
