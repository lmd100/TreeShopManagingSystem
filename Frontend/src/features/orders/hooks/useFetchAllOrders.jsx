import { useCallback, useEffect, useState } from 'react';

const FILTER_TO_STATUSES = {
    ALL: [],
    PENDING: ['PENDING'],
    PROCESSING: ['PROCESSING'],
    DELIVERING: ['DELIVERING'],
    COMPLETED: ['RECEIVED', 'ARRIVED'],
    FAILED: ['FAILED', 'RETURN_PENDING', 'RETURNING'],
};

const DEBOUNCE_MS = 400;

export default function useFetchAllOrders() {
    const [orders, setOrders] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchOrders = useCallback(async () => {
        const statuses = FILTER_TO_STATUSES[selectedFilter] || [];

        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            statuses.forEach((s) => params.append('statusList', s));
            if (searchQuery.trim()) {
                params.append('query', searchQuery.trim());
            }

            const queryString = params.toString();
            const url = queryString ? `/api/orders?${queryString}` : '/api/orders';

            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error("UNAUTHORIZED");
                }
                throw new Error(`Failed to fetch orders (Status: ${response.status})`);
            }

            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, selectedFilter]);

    useEffect(() => {
        const timer = setTimeout(fetchOrders, searchQuery ? DEBOUNCE_MS : 0);
        return () => {
            clearTimeout(timer);
        };
    }, [fetchOrders, searchQuery]);

    return {
        orders,
        isLoading,
        error,
        selectedFilter,
        setSelectedFilter,
        searchQuery,
        setSearchQuery,
        fetchOrders,
    };
}
