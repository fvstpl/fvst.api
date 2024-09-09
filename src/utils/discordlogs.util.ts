import fetch from 'node-fetch';

export async function sendWebhook(url: string, title: string, content: any): Promise<void> {
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [
          {
            title: title,
            description: JSON.stringify(content, null, 2),
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
  } catch (error) {
    console.error('Failed to send Discord webhook', error);
  }
}
