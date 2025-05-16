import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export function Pagination({ links }: PaginationProps) {
    return (
        <div className="flex items-center justify-center space-x-2">
            {links.map((link, i) => {
                if (i === 0) {
                    return (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${
                                !link.url
                                    ? 'cursor-not-allowed text-gray-400'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            preserveScroll
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    );
                }

                if (i === links.length - 1) {
                    return (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${
                                !link.url
                                    ? 'cursor-not-allowed text-gray-400'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            preserveScroll
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    );
                }

                return (
                    <Link
                        key={i}
                        href={link.url || '#'}
                        className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${
                            link.active
                                ? 'bg-primary text-primary-foreground'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        preserveScroll
                    >
                        {link.label}
                    </Link>
                );
            })}
        </div>
    );
} 