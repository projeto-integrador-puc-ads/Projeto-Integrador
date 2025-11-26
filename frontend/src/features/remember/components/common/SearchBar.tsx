// src/components/common/SearchBar.tsx
import React from 'react';

interface Props {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    placeholder?: string;
}

const SearchBar: React.FC<Props> = ({ searchTerm, onSearchChange, placeholder = "Pesquisar..." }) => {
    return (
        <div style={{ marginBottom: '20px' }}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                }}
            />
        </div>
    );
};

export default SearchBar;