import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, UsersRound, Workflow, 
    LayoutList, ShoppingCart, List, House, MonitorOff} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Panel',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Usuarios',
        href: '/users',
        icon: UsersRound,
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: Workflow,
    },
    {
        title: 'Permisos',
        href: '/permissions',
        icon: MonitorOff,
    },
    {
        title: 'Productos',
        href: '/products',
        icon: LayoutList,
    },
    {
        title: 'Ventas',
        href: '/sales',
        icon: ShoppingCart,
    },
    {
        title: 'Categorias',
        href: '/categories',
        icon: List,
    },
    {
        title: 'Locales',
        href: '/locals',
        icon: House,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: '',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
