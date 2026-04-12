import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzeFoodImage } from '../services/geminiService';

global.fetch = vi.fn();

describe('geminiService - analyzeFoodImage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should parse valid AI response', async () => {
    const mockApiResponse = {
      choices: [
        {
          message: {
            content: `\`\`\`json
{
  "item": "Fresh Apples",
  "category": "Produce",
  "expiresIn": "4 days",
  "safeToEat": "Yes",
  "confidence": "95%"
}
\`\`\``,
          },
        },
      ],
    };

    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    const result = await analyzeFoodImage('data:image/jpeg;base64,fakebase64');
    expect(result.item).toBe('Fresh Apples');
    expect(result.category).toBe('Produce');
    expect(result.safeToEat).toBe('Yes');
  });

  it('should handle API errors gracefully', async () => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    });

    await expect(analyzeFoodImage('fakebase64')).rejects.toThrow(
      'API request failed with status 401: Unauthorized'
    );
  });
});
