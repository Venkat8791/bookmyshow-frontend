'use client';

import { useState, FormEvent } from 'react';

interface MovieSearchProps {
    onSearch: (query: string) => void;
}

export default function MovieSearch({ onSearch }: MovieSearchProps) {
    const [query, setQuery] = useState<string>('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit}
            className="flex gap-3 max-w-xl mx-auto">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies..."
                className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-red-500 transition"
            />
            <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition">
                Search
            </button>
        </form>
    );
}