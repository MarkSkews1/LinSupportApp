import {
  LayoutDashboard,
  Ticket,
  MessageSquare,
  BookOpen,
  BarChart3,
  Users,
  Settings,
  LucideIcon
} from 'lucide-react';
import { IconName } from './navigation';

/**
 * Icon map for resolving string icon names to Lucide components
 * Used on the client side to convert serializable icon names to actual components
 */
const iconMap: Record<IconName, LucideIcon> = {
  LayoutDashboard,
  Ticket,
  MessageSquare,
  BookOpen,
  BarChart3,
  Users,
  Settings,
};

/**
 * Resolve an icon name to its Lucide component
 * @param iconName - The name of the icon
 * @returns The Lucide icon component
 */
export function getIcon(iconName: IconName): LucideIcon {
  return iconMap[iconName];
}

