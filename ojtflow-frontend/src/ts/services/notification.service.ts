import { getSession } from '../core/session';
import { academicYearConfig } from '../mocks/notification.mock';
import type { NotificationItem } from '../types/notification.types';

const STORAGE_KEY = 'unisphere_notifications';
type StoredNotification = NotificationItem & { recipientId: string; recipientPortal: 'student'|'coordinator'|'supervisor'; createdAt: string; eventKey: string };
export interface NotificationRecipient { id: string; portal: 'student'|'coordinator'|'supervisor' }

function readAll(): StoredNotification[] {
  try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(value) ? value as StoredNotification[] : []; }
  catch { return []; }
}
function writeAll(items: StoredNotification[]): void { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
function relativeTime(date: string): string {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
  if (minutes < 1) return 'Just now'; if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
export function createNotifications(eventKey: string, recipients: NotificationRecipient[], title: string, detail: string): void {
  if (!eventKey || !recipients.length) return;
  const all = readAll(); const createdAt = new Date().toISOString();
  for (const recipient of recipients) {
    if (!recipient.id) continue;
    const uniqueKey = `${eventKey}:${recipient.portal}:${recipient.id}`;
    if (all.some(item => item.eventKey === uniqueKey)) continue;
    all.unshift({ id: `NTF-${Date.now()}-${Math.random().toString(36).slice(2,8)}`, eventKey: uniqueKey,
      recipientId: recipient.id, recipientPortal: recipient.portal, title, detail, relativeTime: 'Just now', isNew: true, createdAt });
  }
  writeAll(all.slice(0, 500));
  try { localStorage.setItem('unisphere_notifications_updated', String(Date.now())); } catch { /* best effort */ }
  window.dispatchEvent(new Event('unisphere:notifications-updated'));
}
export async function getNotifications(): Promise<NotificationItem[]> {
  const user = getSession()?.user; if (!user) return [];
  return readAll().filter(item => item.recipientId === user.id && item.recipientPortal === user.portal)
    .sort((a,b) => b.createdAt.localeCompare(a.createdAt))
    .map(({id,title,detail,isNew,createdAt}) => ({ id,title,detail,isNew,relativeTime:relativeTime(createdAt) }));
}
export async function getNewNotificationCount(): Promise<number> { return (await getNotifications()).filter(item => item.isNew).length; }
export function markNotificationRead(id: string): void {
  const user = getSession()?.user; if (!user) return;
  const all = readAll(); const item = all.find(row => row.id === id && row.recipientId === user.id && row.recipientPortal === user.portal);
  if (item && item.isNew) { item.isNew = false; writeAll(all); window.dispatchEvent(new Event('unisphere:notifications-updated')); }
}
export function markAllNotificationsRead(): void {
  const user = getSession()?.user; if (!user) return;
  const all = readAll(); let changed = false;
  for (const item of all) if (item.recipientId === user.id && item.recipientPortal === user.portal && item.isNew) { item.isNew = false; changed = true; }
  if (changed) { writeAll(all); window.dispatchEvent(new Event('unisphere:notifications-updated')); }
}
export async function getAcademicYearConfig() { return { ...academicYearConfig }; }
