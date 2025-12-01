import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { type AdminUser } from '@/features/admin/api/users.ts';

interface UserFilterSelectProps {
    users: AdminUser[];
    value: AdminUser | null;
    onChange: (value: AdminUser | null) => void;
    disabled?: boolean;
}

export const UserFilterSelect: React.FC<UserFilterSelectProps> = ({
    users,
    value,
    onChange,
    disabled = false,
}) => {
    return (
        <Autocomplete
            options={users}
            getOptionLabel={(option) => option.name}
            value={value ?? null} // garante que nunca seja undefined
            onChange={(_, newValue) => onChange(newValue ?? null)} // retorna null se nada selecionado
            disabled={disabled}
            sx={{ minWidth: 250 }}
            isOptionEqualToValue={(option, val) => option.id === val.id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Filtrar por usuário"
                    size="small"
                />
            )}
            clearOnEscape
        />
    );
};
