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
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, UsersRound, Workflow, 
    LayoutList, ShoppingCart, List, House, MonitorOff, TicketPercent, DollarSign } from 'lucide-react';
import AppLogo from './app-logo';

const rawNavItems: Array<NavItem & { permission?: string }> = [
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
    {
        title: 'Ofertas',
        href: '/offers',
        icon: TicketPercent,
    },
    {
        title: 'Caja',
        href: '/cash-movements',
        icon: DollarSign,
        permission: 'cash.view',
    },
];

// the list will be filtered inside the component where hooks can be used
// (avoids invalid hook call by running can() outside of a React component)


const footerNavItems: NavItem[] = [
    {
        title: 'Documentación',
        href: '',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    // access page props inside component (hook allowed)
    const { auth } = usePage().props as unknown as {
        auth: { permissions: string[] };
    };

    const mainNavItems: NavItem[] = rawNavItems.filter((item) => {
        if (item.permission) {
            return auth.permissions.includes(item.permission as string);
        }
        return true;
    });

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
