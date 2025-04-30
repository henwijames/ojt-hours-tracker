import { Badge } from './ui/badge';

const UserStatusBadge = ({ status }: { status: string }) => {
    const getVariant = () => {
        if (status === 'active') return 'default';
        if (status === 'inactive') return 'destructive';
        return 'secondary';
    };

    const isPending = status === 'pending';

    return (
        <Badge variant={getVariant()} className={`text-xs capitalize dark:text-white ${isPending ? 'bg-yellow-500 text-white' : ''}`}>
            {status}
        </Badge>
    );
};

export default UserStatusBadge;
