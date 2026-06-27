export async function sendOpsAlert({ title, message, details = [] }) {
  const lines = [title, message, ...details].filter(Boolean);
  const text = lines.join("\n");
  const webhookUrl = process.env.OPS_ALERT_WEBHOOK_URL || process.env.WEND_ALERT_WEBHOOK_URL;
  const telegramToken = process.env.OPS_ALERT_TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.OPS_ALERT_TELEGRAM_CHAT_ID;
  const failures = [];

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      if (!response.ok) failures.push(`webhook returned ${response.status}`);
    } catch (error) {
      failures.push(`webhook failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (telegramToken && telegramChatId) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          disable_web_page_preview: true,
          text,
        }),
      });
      if (!response.ok) failures.push(`telegram returned ${response.status}`);
    } catch (error) {
      failures.push(`telegram failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (!webhookUrl && (!telegramToken || !telegramChatId)) {
    console.warn("No ops alert channel configured. Set OPS_ALERT_WEBHOOK_URL or Telegram bot/chat secrets.");
    return;
  }

  if (failures.length) {
    console.warn(`Ops alert delivery issue: ${failures.join("; ")}`);
  }
}
