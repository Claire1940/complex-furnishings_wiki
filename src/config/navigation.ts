import type { LucideIcon } from 'lucide-react'
import {
	BookOpen,
	Gift,
	Rocket,
	Gamepad2,
	DoorOpen,
	Ghost,
	Package,
	MonitorSmartphone,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'codes', path: '/codes', icon: Gift, isContentType: true },
	{ key: 'release', path: '/release', icon: Rocket, isContentType: true },
	{ key: 'gameplay', path: '/gameplay', icon: Gamepad2, isContentType: true },
	{ key: 'backrooms', path: '/backrooms', icon: DoorOpen, isContentType: true },
	{ key: 'entities', path: '/entities', icon: Ghost, isContentType: true },
	{ key: 'items', path: '/items', icon: Package, isContentType: true },
	{ key: 'platform', path: '/platform', icon: MonitorSmartphone, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['guide', 'codes', 'release', 'gameplay', 'backrooms', 'entities', 'items', 'platform']

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
