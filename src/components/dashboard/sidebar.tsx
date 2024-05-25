import classNames from 'classnames';
import Link from 'next/link';
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { IconType } from 'react-icons';

import { FaHome, FaUser, FaCog, FaFolder, FaFile, FaChartLine, FaShoppingCart, FaInfoCircle, FaPhone, FaEnvelope, FaArrowDown } from 'react-icons/fa';
import { MdKeyboardArrowRight, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import Resizable from '../animations/resizable';
import Fade from '../animations/fade';

interface Link {
    name: ReactNode;
    href?: string;
    Icon?: IconType | FC;
    children: Link[];
}

const links: Link[] = [
    {
        name: <div className='border mb-4 bg-gray-900 text-white p-2 rounded-md'>
            Add Logo.
        </div>,
        children: []
    },
    {
        name: 'Home',
        href: '/',
        Icon: FaHome,
        children: []
    },
    {
        name: 'User',
        href: '/user',
        Icon: FaUser,
        children: [
            {
                name: 'Profile',
                href: '/user/profile',
                Icon: FaUser,
                children: []
            },
            {
                name: 'Settings',
                href: '/user/settings',
                Icon: FaCog,
                children: [
                    {
                        name: 'Privacy',
                        href: '/user/settings/privacy',
                        Icon: FaCog,
                        children: []
                    },
                    {
                        name: 'Notifications',
                        href: '/user/settings/notifications',
                        Icon: FaCog,
                        children: []
                    }
                ]
            }
        ]
    },
    {
        name: 'Files',
        href: '/files',
        Icon: FaFolder,
        children: [
            {
                name: 'Documents',
                href: '/files/documents',
                Icon: FaFile,
                children: [
                    {
                        name: 'Reports',
                        href: '/files/documents/reports',
                        Icon: FaFile,
                        children: []
                    },
                    {
                        name: 'Invoices',
                        href: '/files/documents/invoices',
                        Icon: FaFile,
                        children: []
                    }
                ]
            },
            {
                name: 'Media',
                href: '/files/media',
                Icon: FaFolder,
                children: [
                    {
                        name: 'Images',
                        href: '/files/media/images',
                        Icon: FaFile,
                        children: []
                    },
                    {
                        name: 'Videos',
                        href: '/files/media/videos',
                        Icon: FaFile,
                        children: []
                    }
                ]
            }
        ]
    },
    {
        name: 'Analytics',
        href: '/analytics',
        Icon: FaChartLine,
        children: [
            {
                name: 'Sales',
                href: '/analytics/sales',
                Icon: FaChartLine,
                children: []
            },
            {
                name: 'Traffic',
                href: '/analytics/traffic',
                Icon: FaChartLine,
                children: []
            },
            {
                name: 'Engagement',
                href: '/analytics/engagement',
                Icon: FaChartLine,
                children: [
                    {
                        name: 'Social Media',
                        href: '/analytics/engagement/social-media',
                        Icon: FaChartLine,
                        children: [
                            {
                                name: 'ABC',
                                href: '/analytics/engagement/social-mediaasasasa',
                                Icon: FaChartLine,
                                children: [
                                    {
                                        name: 'XYZ',
                                        href: '/analytics/engagement/social-asasas',
                                        Icon: FaChartLine,
                                        children: []
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        name: 'Website',
                        href: '/analytics/engagement/website',
                        Icon: FaChartLine,
                        children: []
                    }
                ]
            }
        ]
    },
    {
        name: 'Shop',
        href: '/shop',
        Icon: FaShoppingCart,
        children: [
            {
                name: 'Products',
                href: '/shop/products',
                Icon: FaShoppingCart,
                children: [
                    {
                        name: 'Electronics',
                        href: '/shop/products/electronics',
                        Icon: FaShoppingCart,
                        children: []
                    },
                    {
                        name: 'Clothing',
                        href: '/shop/products/clothing',
                        Icon: FaShoppingCart,
                        children: []
                    }
                ]
            },
            {
                name: 'Orders',
                href: '/shop/orders',
                Icon: FaShoppingCart,
                children: [
                    {
                        name: 'Pending',
                        href: '/shop/orders/pending',
                        Icon: FaShoppingCart,
                        children: []
                    },
                    {
                        name: 'Completed',
                        href: '/shop/orders/completed',
                        Icon: FaShoppingCart,
                        children: []
                    }
                ]
            }
        ]
    },
    {
        name: 'Support',
        href: '/support',
        Icon: FaInfoCircle,
        children: [
            {
                name: 'FAQ',
                href: '/support/faq',
                Icon: FaInfoCircle,
                children: []
            },
            {
                name: 'Contact Us',
                href: '/support/contact',
                Icon: FaPhone,
                children: [
                    {
                        name: 'Email',
                        href: '/support/contact/email',
                        Icon: FaEnvelope,
                        children: []
                    },
                    {
                        name: 'Phone',
                        href: '/support/contact/phone',
                        Icon: FaPhone,
                        children: []
                    }
                ]
            }
        ]
    },
    {
        name: <div className='border mt-4  bg-gray-900 text-white p-2 rounded-md'>
            ENJOI MFs
        </div>,
        children: []
    }
];



// ? HEHEHE i am LAZY SORRIE :)

export default function Sidebar() {
    return (
            <RenderMenu links={links} />
    )
}

function RenderMenu({ links, treeLevel = 0 }: { links: Link[], treeLevel?: number }) {

    const [keys, setkeys] = useState<string[]>([])

    function hanldeKeys(link: Link) {
        if (!link.children.length) return
        const href = link?.href ?? undefined
        if (!href) return
        setkeys(old => {
            if (old.includes(href)) {
                return old.filter(o => o !== href)
            }
            return [...old, href]
        })
    }

    const renderName = useCallback(function (link: Link) {
        const Icon = link?.Icon ?? (function () { return null });
        const areChildrenPresent = link.children?.length > 0

        if (!link.href) {
            return link.name
        }
        // I was using the strick mapping for href inNext link have to figured out the type 
        // If you want to use that just research your own hahahahaha :)
        return <a onClick={() => hanldeKeys(link)} href={"#"} className='flex justify-between items-center gap-2 group hover:text-black hover:underline '>
            <span className='flex gap-2 items-center text-lg'>
                <Icon className='text-opacity-30 group-hover:text-opacity-100 text-slate-700' />
                {link.name}
            </span>
            {areChildrenPresent && keys.includes(link.href) ? <MdOutlineKeyboardArrowDown /> : areChildrenPresent ? <MdKeyboardArrowRight /> : null}
        </a>
    }, [keys])


    return links.map((link, idx) => {
        return <ul key={link.href} className={classNames(
            treeLevel > 0 && "pl-4 border-l border-dashed",
            "py-1"
        )}>
            <li key={link.href ?? idx} className='min-h-[20px]'>{renderName(link)}</li>
            {keys.includes(link.href!) && <Fade >
                <RenderMenu links={link.children} treeLevel={treeLevel + 1} />
            </Fade>}
        </ul >
    })
}