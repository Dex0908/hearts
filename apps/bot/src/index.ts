import 'dotenv/config';
import { Telegraf, Markup, session } from 'telegraf';
import { prisma } from '@skyhearts/db';
import { calculateRemainingETA } from '@skyhearts/shared';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface SessionData {
  awaitingLinkToken?: boolean;
}

// ─── Bot Setup ──────────────────────────────────────────────────────────────────
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is required');
}

const ADMIN_TELEGRAM_ID = process.env.ADMIN_TELEGRAM_ID;

const bot = new Telegraf<{ session: SessionData }>(BOT_TOKEN);
bot.use(session());

// ─── Helpers ────────────────────────────────────────────────────────────────────
function isAdmin(telegramId: string): boolean {
  return ADMIN_TELEGRAM_ID ? telegramId === ADMIN_TELEGRAM_ID : false;
}

async function findUserByTelegramId(telegramId: string) {
  return prisma.user.findUnique({ where: { telegramId } });
}

function formatHeartBar(delivered: number, total: number, width = 10): string {
  const filled = Math.round((delivered / total) * width);
  return '❤️'.repeat(filled) + '🤍'.repeat(width - filled);
}

function formatOrderStatus(order: {
  id: string;
  hearts: number;
  heartsDelivered: number;
  status: string;
  skyFriendCode: string;
}) {
  const pct = Math.round((order.heartsDelivered / order.hearts) * 100);
  const remaining = calculateRemainingETA(order.hearts, order.heartsDelivered);

  return `
🌟 *Order #${order.id.slice(-8)}*
━━━━━━━━━━━━━━━━━━
❤️ Hearts: ${order.heartsDelivered}/${order.hearts} (${pct}%)
${formatHeartBar(order.heartsDelivered, order.hearts)}

📊 Status: ${order.status.replace('_', ' ')}
🕹️ Sky Code: \`${order.skyFriendCode}\`
⏳ ETA: ~${remaining} day${remaining !== 1 ? 's' : ''} remaining
━━━━━━━━━━━━━━━━━━`.trim();
}

// ─── /start ────────────────────────────────────────────────────────────────────
bot.start(async (ctx) => {
  const telegramId = String(ctx.from.id);
  const username = ctx.from.username || ctx.from.first_name;

  // Check if already linked
  const user = await findUserByTelegramId(telegramId);

  if (user) {
    await ctx.reply(
      `✨ *Welcome back, ${user.name || user.email}!*\n\nYou're connected to SkyHearts. Use the menu below:`,
      {
        parse_mode: 'Markdown',
        ...Markup.keyboard([
          ['❤️ My Orders', '📊 Order Status'],
          ['🔔 Notifications', '👤 My Profile'],
          ['ℹ️ Help'],
        ]).resize(),
      }
    );
    return;
  }

  await ctx.reply(
    `🕯️ *Welcome to SkyHearts Bot!*\n\n` +
    `I'll send you real-time updates about your heart deliveries for *Sky: Children of the Light*.\n\n` +
    `To get started, link your SkyHearts account:\n` +
    `1️⃣ Go to your dashboard\n` +
    `2️⃣ Click "Link Telegram"\n` +
    `3️⃣ Enter the code you receive here\n\n` +
    `Or send your link token directly:`,
    {
      parse_mode: 'Markdown',
      ...Markup.keyboard([['🔗 Link Account'], ['ℹ️ Help']]).resize(),
    }
  );
});

// ─── Link Account ──────────────────────────────────────────────────────────────
bot.hears('🔗 Link Account', async (ctx) => {
  ctx.session.awaitingLinkToken = true;
  await ctx.reply(
    '🔗 *Link Your Account*\n\nPlease send your link token from the SkyHearts dashboard:',
    { parse_mode: 'Markdown' }
  );
});

// ─── My Orders ────────────────────────────────────────────────────────────────
bot.hears('❤️ My Orders', async (ctx) => {
  const telegramId = String(ctx.from.id);
  const user = await findUserByTelegramId(telegramId);

  if (!user) {
    await ctx.reply('❌ Please link your account first!');
    return;
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
      status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (orders.length === 0) {
    await ctx.reply(
      '📭 *No active orders*\n\nVisit skyhearts.app to place a new order!',
      { parse_mode: 'Markdown' }
    );
    return;
  }

  for (const order of orders) {
    await ctx.reply(formatOrderStatus(order), { parse_mode: 'Markdown' });
  }
});

// ─── Order Status ─────────────────────────────────────────────────────────────
bot.hears('📊 Order Status', async (ctx) => {
  const telegramId = String(ctx.from.id);
  const user = await findUserByTelegramId(telegramId);

  if (!user) {
    await ctx.reply('❌ Please link your account first!');
    return;
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  if (orders.length === 0) {
    await ctx.reply('📭 No orders found. Visit skyhearts.app to order!');
    return;
  }

  const summary = orders
    .map((o) => {
      const pct = Math.round((o.heartsDelivered / o.hearts) * 100);
      return `• #${o.id.slice(-8)} — ${o.hearts}❤️ (${pct}%) — ${o.status.replace('_', ' ')}`;
    })
    .join('\n');

  await ctx.reply(`📊 *Your Orders:*\n\n${summary}`, { parse_mode: 'Markdown' });
});

// ─── Notifications ────────────────────────────────────────────────────────────
bot.hears('🔔 Notifications', async (ctx) => {
  const telegramId = String(ctx.from.id);
  const user = await findUserByTelegramId(telegramId);

  if (!user) {
    await ctx.reply('❌ Please link your account first!');
    return;
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id, read: false },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  if (notifications.length === 0) {
    await ctx.reply('✅ No new notifications!');
    return;
  }

  for (const n of notifications) {
    await ctx.reply(`🔔 *${n.title}*\n${n.message}`, { parse_mode: 'Markdown' });
  }

  // Mark as read
  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });
});

// ─── Profile ──────────────────────────────────────────────────────────────────
bot.hears('👤 My Profile', async (ctx) => {
  const telegramId = String(ctx.from.id);
  const user = await findUserByTelegramId(telegramId);

  if (!user) {
    await ctx.reply('❌ Please link your account first!');
    return;
  }

  const orderCount = await prisma.order.count({ where: { userId: user.id } });
  const completedCount = await prisma.order.count({
    where: { userId: user.id, status: 'COMPLETED' },
  });

  await ctx.reply(
    `👤 *Your Profile*\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `📧 Email: ${user.email}\n` +
    `👤 Name: ${user.name || 'Not set'}\n` +
    `✈️ Telegram: @${ctx.from.username || 'Linked'}\n` +
    `📦 Total Orders: ${orderCount}\n` +
    `✅ Completed: ${completedCount}\n` +
    `📅 Member since: ${new Date(user.createdAt).toLocaleDateString()}`,
    { parse_mode: 'Markdown' }
  );
});

// ─── Help ─────────────────────────────────────────────────────────────────────
bot.hears('ℹ️ Help', async (ctx) => {
  await ctx.reply(
    `🌟 *SkyHearts Help*\n\n` +
    `*User Commands:*\n` +
    `/start — Start the bot\n` +
    `/orders — View your active orders\n` +
    `/status [order_id] — Check a specific order\n` +
    `/link [token] — Link your account\n` +
    `/unlink — Unlink your account\n\n` +
    `*What we deliver:*\n` +
    `Hearts for Sky: Children of the Light\n` +
    `Max 50 hearts/day + 2 buffer days\n\n` +
    `*Need help?* Visit skyhearts.app`,
    { parse_mode: 'Markdown' }
  );
});

// ─── /orders command ──────────────────────────────────────────────────────────
bot.command('orders', async (ctx) => {
  const telegramId = String(ctx.from.id);
  const user = await findUserByTelegramId(telegramId);

  if (!user) {
    await ctx.reply('❌ Link your account first with /link [token]');
    return;
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id, status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] } },
    orderBy: { createdAt: 'desc' },
  });

  if (orders.length === 0) {
    await ctx.reply('📭 No active orders.');
    return;
  }

  for (const order of orders) {
    await ctx.reply(formatOrderStatus(order), { parse_mode: 'Markdown' });
  }
});

// ─── /status command ──────────────────────────────────────────────────────────
bot.command('status', async (ctx) => {
  const telegramId = String(ctx.from.id);
  const user = await findUserByTelegramId(telegramId);
  if (!user) {
    await ctx.reply('❌ Link your account first!');
    return;
  }

  const args = ctx.message.text.split(' ').slice(1);
  const orderId = args[0];

  if (!orderId) {
    await ctx.reply('Usage: /status [order_id]');
    return;
  }

  const order = await prisma.order.findFirst({
    where: { id: { endsWith: orderId }, userId: user.id },
  });

  if (!order) {
    await ctx.reply('❌ Order not found.');
    return;
  }

  await ctx.reply(formatOrderStatus(order), { parse_mode: 'Markdown' });
});

// ─── /link command ────────────────────────────────────────────────────────────
bot.command('link', async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  const token = args[0];

  if (!token) {
    ctx.session.awaitingLinkToken = true;
    await ctx.reply('Please send your link token from the SkyHearts dashboard:');
    return;
  }

  await linkAccount(ctx, token);
});

// ─── /unlink command ──────────────────────────────────────────────────────────
bot.command('unlink', async (ctx) => {
  const telegramId = String(ctx.from.id);
  const user = await findUserByTelegramId(telegramId);

  if (!user) {
    await ctx.reply('❌ No account linked.');
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      telegramId: null,
      telegramUsername: null,
      telegramLinked: false,
      linkToken: null,
    },
  });

  await ctx.reply('✅ Account unlinked successfully.');
});

// ─── ADMIN COMMANDS ──────────────────────────────────────────────────────────
// /complete_order [order_id]
bot.command('complete_order', async (ctx) => {
  if (!isAdmin(String(ctx.from.id))) {
    await ctx.reply('❌ Admin only.');
    return;
  }

  const args = ctx.message.text.split(' ').slice(1);
  const orderId = args[0];

  if (!orderId) {
    await ctx.reply('Usage: /complete_order [order_id]');
    return;
  }

  const order = await prisma.order.findFirst({
    where: { id: { endsWith: orderId } },
    include: { user: true },
  });

  if (!order) {
    await ctx.reply('❌ Order not found.');
    return;
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: 'COMPLETED', heartsDelivered: order.hearts },
  });

  await prisma.orderUpdate.create({
    data: {
      orderId: order.id,
      message: `Order completed! All ${order.hearts} hearts delivered! 🎉`,
      heartsAdded: order.hearts - order.heartsDelivered,
    },
  });

  // Notify user via Telegram if linked
  if (order.user.telegramId) {
    try {
      await bot.telegram.sendMessage(
        order.user.telegramId,
        `🎉 *Order Complete!*\n\n` +
        `All *${order.hearts} hearts* have been delivered to \`${order.skyFriendCode}\`!\n\n` +
        `Thank you for using SkyHearts! ✨`,
        { parse_mode: 'Markdown' }
      );
    } catch {}
  }

  await ctx.reply(`✅ Order #${orderId} marked as complete.`);
});

// /add_hearts [order_id] [amount]
bot.command('add_hearts', async (ctx) => {
  if (!isAdmin(String(ctx.from.id))) {
    await ctx.reply('❌ Admin only.');
    return;
  }

  const args = ctx.message.text.split(' ').slice(1);
  const [orderId, amountStr] = args;
  const amount = parseInt(amountStr, 10);

  if (!orderId || isNaN(amount)) {
    await ctx.reply('Usage: /add_hearts [order_id] [amount]');
    return;
  }

  const order = await prisma.order.findFirst({
    where: { id: { endsWith: orderId } },
    include: { user: true },
  });

  if (!order) {
    await ctx.reply('❌ Order not found.');
    return;
  }

  const newDelivered = Math.min(order.heartsDelivered + amount, order.hearts);
  const newStatus = newDelivered >= order.hearts ? 'COMPLETED' : 'IN_PROGRESS';

  await prisma.order.update({
    where: { id: order.id },
    data: { heartsDelivered: newDelivered, status: newStatus },
  });

  const remaining = calculateRemainingETA(order.hearts, newDelivered);

  await prisma.orderUpdate.create({
    data: {
      orderId: order.id,
      message: `${amount} hearts delivered! Total: ${newDelivered}/${order.hearts}`,
      heartsAdded: amount,
    },
  });

  // Notify user
  if (order.user.telegramId) {
    try {
      const msg =
        newStatus === 'COMPLETED'
          ? `🎉 *Order Complete!*\n\nAll *${order.hearts}* hearts delivered! Thank you! ✨`
          : `❤️ *Order Update*\n\n${newDelivered}/${order.hearts} hearts delivered!\n${formatHeartBar(newDelivered, order.hearts)}\n⏳ ~${remaining} days remaining`;

      await bot.telegram.sendMessage(order.user.telegramId, msg, {
        parse_mode: 'Markdown',
      });
    } catch {}
  }

  await ctx.reply(
    `✅ Added ${amount} hearts to order #${orderId}.\nTotal: ${newDelivered}/${order.hearts}`
  );
});

// /set_status [order_id] [status]
bot.command('set_status', async (ctx) => {
  if (!isAdmin(String(ctx.from.id))) {
    await ctx.reply('❌ Admin only.');
    return;
  }

  const args = ctx.message.text.split(' ').slice(1);
  const [orderId, status] = args;
  const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

  if (!orderId || !status || !validStatuses.includes(status.toUpperCase())) {
    await ctx.reply(
      `Usage: /set_status [order_id] [status]\nStatuses: ${validStatuses.join(', ')}`
    );
    return;
  }

  const order = await prisma.order.findFirst({
    where: { id: { endsWith: orderId } },
    include: { user: true },
  });

  if (!order) {
    await ctx.reply('❌ Order not found.');
    return;
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: status.toUpperCase() as any },
  });

  // Notify user
  if (order.user.telegramId) {
    try {
      await bot.telegram.sendMessage(
        order.user.telegramId,
        `📊 *Order Status Update*\n\nOrder #${orderId} is now: *${status.toUpperCase().replace('_', ' ')}*`,
        { parse_mode: 'Markdown' }
      );
    } catch {}
  }

  await ctx.reply(`✅ Order #${orderId} status set to ${status.toUpperCase()}.`);
});

// /broadcast [message] - Send message to all users with telegram linked
bot.command('broadcast', async (ctx) => {
  if (!isAdmin(String(ctx.from.id))) {
    await ctx.reply('❌ Admin only.');
    return;
  }

  const message = ctx.message.text.split(' ').slice(1).join(' ');
  if (!message) {
    await ctx.reply('Usage: /broadcast [message]');
    return;
  }

  const users = await prisma.user.findMany({
    where: { telegramLinked: true, telegramId: { not: null } },
  });

  let sent = 0;
  let failed = 0;

  for (const user of users) {
    if (!user.telegramId) continue;
    try {
      await bot.telegram.sendMessage(
        user.telegramId,
        `📢 *SkyHearts Announcement*\n\n${message}`,
        { parse_mode: 'Markdown' }
      );
      sent++;
    } catch {
      failed++;
    }
  }

  await ctx.reply(`📢 Broadcast sent: ${sent} success, ${failed} failed.`);
});

// /admin_stats - Quick stats for admin
bot.command('admin_stats', async (ctx) => {
  if (!isAdmin(String(ctx.from.id))) {
    await ctx.reply('❌ Admin only.');
    return;
  }

  const [total, active, completed, clients] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] } } }),
    prisma.order.count({ where: { status: 'COMPLETED' } }),
    prisma.user.count(),
  ]);

  const revenue = await prisma.order.aggregate({ _sum: { price: true } });

  await ctx.reply(
    `📊 *SkyHearts Stats*\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `💰 Revenue: $${Number(revenue._sum.price || 0).toFixed(2)}\n` +
    `📦 Total Orders: ${total}\n` +
    `❤️ Active: ${active}\n` +
    `✅ Completed: ${completed}\n` +
    `👥 Clients: ${clients}`,
    { parse_mode: 'Markdown' }
  );
});

// ─── Link Account Helper ──────────────────────────────────────────────────────
async function linkAccount(ctx: any, token: string) {
  const telegramId = String(ctx.from.id);
  const username = ctx.from.username;

  const user = await prisma.user.findUnique({ where: { linkToken: token } });

  if (!user) {
    await ctx.reply('❌ Invalid or expired link token. Please generate a new one from the dashboard.');
    return;
  }

  // Check if telegram already in use
  const existing = await findUserByTelegramId(telegramId);
  if (existing && existing.id !== user.id) {
    await ctx.reply('❌ This Telegram account is already linked to another SkyHearts account.');
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      telegramId,
      telegramUsername: username,
      telegramLinked: true,
      linkToken: null,
    },
  });

  await ctx.reply(
    `✅ *Account Linked!*\n\n` +
    `Welcome, ${user.name || user.email}! 🎉\n\n` +
    `You'll now receive real-time updates about your heart deliveries here on Telegram.`,
    {
      parse_mode: 'Markdown',
      ...Markup.keyboard([
        ['❤️ My Orders', '📊 Order Status'],
        ['🔔 Notifications', '👤 My Profile'],
        ['ℹ️ Help'],
      ]).resize(),
    }
  );

  // Send notification
  await prisma.notification.create({
    data: {
      userId: user.id,
      title: 'Telegram Linked',
      message: 'Your Telegram account has been successfully linked to SkyHearts!',
    },
  });
}

// ─── Text Handler (for link token flow) ──────────────────────────────────────
bot.on('text', async (ctx) => {
  if (ctx.session?.awaitingLinkToken) {
    ctx.session.awaitingLinkToken = false;
    await linkAccount(ctx, ctx.message.text.trim());
    return;
  }
});

// ─── Error Handler ────────────────────────────────────────────────────────────
bot.catch((err, ctx) => {
  console.error(`Bot error for update ${ctx.updateType}:`, err);
});

// ─── Launch ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('🤖 SkyHearts Bot starting...');

  // Webhook mode for production, polling for development
  if (process.env.WEBHOOK_URL) {
    const webhookUrl = `${process.env.WEBHOOK_URL}/webhook`;
    await bot.telegram.setWebhook(webhookUrl);
    console.log(`✅ Webhook set to: ${webhookUrl}`);

    // Express server for webhook
    const express = require('express');
    const app = express();
    app.use(express.json());
    app.use(bot.webhookCallback('/webhook'));
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => console.log(`✅ Bot webhook server on port ${PORT}`));
  } else {
    // Long polling for development
    await bot.launch();
    console.log('✅ Bot started with long polling');
  }

  // Graceful shutdown
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main().catch(console.error);

// ─── Notification Sender (export for use by other services) ──────────────────
export async function sendOrderUpdate(
  userId: string,
  message: string
): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.telegramId || !user.telegramLinked) return;

  try {
    await bot.telegram.sendMessage(user.telegramId, message, {
      parse_mode: 'Markdown',
    });
  } catch (err) {
    console.error('Failed to send Telegram notification:', err);
  }
}
