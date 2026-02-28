import { cn } from '@/lib/utils';
import { formatDate, formatDistanceToNowStrict } from '@/lib/utils';

describe('Utils', () => {
  describe('cn (className merger)', () => {
    it('merges class names correctly', () => {
      expect(cn('px-2 py-1', 'bg-blue-500')).toContain('px-2');
      expect(cn('px-2 py-1', 'bg-blue-500')).toContain('bg-blue-500');
    });

    it('handles conditional classes', () => {
      expect(cn('base', false && 'hidden', 'show')).not.toContain('hidden');
      expect(cn('base', false && 'hidden', 'show')).toContain('show');
    });

    it('handles undefined and null values', () => {
      expect(cn('base', undefined, null, 'show')).toContain('base');
      expect(cn('base', undefined, null, 'show')).toContain('show');
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2026-01-15T10:30:00Z');
      const formatted = formatDate(date);
      expect(formatted).toContain('2026');
      expect(formatted).toContain('Jan');
    });

    it('handles string input', () => {
      const formatted = formatDate('2026-01-15T10:30:00Z');
      expect(formatted).toContain('2026');
    });
  });
});

