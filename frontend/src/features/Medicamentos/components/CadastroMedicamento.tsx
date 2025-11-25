import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Stack,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import type { Medicamento, TarjaMedicamento } from '../types/medicamento';

interface CadastroMedicamentoProps {
    onCadastrar?: (med: Medicamento) => void;
    medicamentoEditar?: Medicamento | null;
}

const CadastroMedicamento: React.FC<CadastroMedicamentoProps> = ({
    onCadastrar,
    medicamentoEditar,
}) => {
    const navigate = useNavigate();
    const [step, setStep] = useState<number>(1);
    const [form, setForm] = useState<Medicamento>({
        nome: '',
        dosagem: '',
        quantidade: '',
        tarja: 'comum' as TarjaMedicamento,
        dataMedicamento: '',
        dataInicio: '',
        dataFim: '',
        horarioMedicamento: '',
        contatoEmergencia: '',
    });

    useEffect(() => {
        if (medicamentoEditar) {
            setForm(medicamentoEditar);
        } else {
            setForm({
                nome: '',
                dosagem: '',
                quantidade: '',
                tarja: 'comum' as TarjaMedicamento,
                dataMedicamento: '',
                dataInicio: '',
                dataFim: '',
                horarioMedicamento: '',
                contatoEmergencia: '',
            });
        }
        setStep(1);
    }, [medicamentoEditar]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent,
    ) => {
        const { name, value } = e.target as HTMLInputElement | { name?: string; value: string };
        if (!name) return;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => setStep((prev) => prev + 1);
    const handlePrev = () => setStep((prev) => prev - 1);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        onCadastrar?.(form);
        navigate('/medicamentos/lista');
    };

    const isPeriodo = Number(form.quantidade) > 1; // 🔹 define se é tratamento prolongado

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 64px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                py: 4,
            }}
        >
            <Card
                sx={{
                    width: '100%',
                    maxWidth: 600,
                    borderRadius: 3,
                    backgroundColor: 'transparent',
                    border: '2px solid rgba(0,0,0,0.08)',
                    boxShadow: 'none',
                    '&amp;&amp;:hover': {
                        borderColor: 'primary.main',
                    },
                }}
            >
                <CardContent>
                    <Typography
                        variant="h5"
                        align="center"
                        color="primary"
                        fontWeight={700}
                        gutterBottom
                    >
                        {medicamentoEditar ? 'Editar Medicamento' : 'Cadastro de Medicamento'}
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        {/* Passo 1 */}
                        {step === 1 && (
                            <Stack spacing={3}>
                                <TextField
                                    label="Nome do Medicamento"
                                    name="nome"
                                    value={form.nome}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Dosagem"
                                    name="dosagem"
                                    value={form.dosagem}
                                    onChange={handleChange}
                                    placeholder="Ex: 500mg"
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Quantidade (unidades)"
                                    name="quantidade"
                                    value={form.quantidade}
                                    onChange={handleChange}
                                    type="number"
                                    required
                                    fullWidth
                                />
                                <FormControl fullWidth>
                                    <InputLabel id="tarja-label">Tarja</InputLabel>
                                    <Select
                                        labelId="tarja-label"
                                        name="tarja"
                                        value={form.tarja}
                                        onChange={handleChange}
                                        label="Tarja"
                                        required
                                    >
                                        <MenuItem value="comum">Comum</MenuItem>
                                        <MenuItem value="preta">Amarela</MenuItem>
                                        <MenuItem value="vermelha">Vermelha</MenuItem>
                                        <MenuItem value="preta">Preta</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        )}

                        {/* Passo 2 */}
                        {step === 2 && (
                            <Stack spacing={3}>
                                {isPeriodo ? (
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <TextField
                                            label="Data de início"
                                            type="date"
                                            name="dataInicio"
                                            value={form.dataInicio}
                                            onChange={handleChange}
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Data de fim"
                                            type="date"
                                            name="dataFim"
                                            value={form.dataFim}
                                            onChange={handleChange}
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                        />
                                    </Stack>
                                ) : (
                                    <TextField
                                        label="Data para tomar o medicamento"
                                        type="date"
                                        name="dataMedicamento"
                                        value={form.dataMedicamento}
                                        onChange={handleChange}
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                    />
                                )}

                                <TextField
                                    label="Horário"
                                    type="time"
                                    name="horarioMedicamento"
                                    value={form.horarioMedicamento}
                                    onChange={handleChange}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                            </Stack>
                        )}

                        {/* Passo 3 */}
                        {step === 3 && (
                            <Stack spacing={3}>
                                <TextField
                                    label="Contato de Emergência"
                                    name="contatoEmergencia"
                                    value={form.contatoEmergencia}
                                    onChange={handleChange}
                                    placeholder="Ex: (62) 99999-9999 – Maria"
                                    required
                                    fullWidth
                                />
                                <Typography color="text.secondary" variant="body2">
                                    Revise suas informações antes de concluir o cadastro.
                                </Typography>
                            </Stack>
                        )}

                        {/* Botões de navegação */}
                        <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
                            {step > 1 && (
                                <Button variant="outlined" onClick={handlePrev}>
                                    ← Voltar
                                </Button>
                            )}
                            {step < 3 && (
                                <Button variant="contained" onClick={handleNext}>
                                    Próximo →
                                </Button>
                            )}
                            {step === 3 && (
                                <Button type="submit" variant="contained" color="primary">
                                    {medicamentoEditar ? 'Salvar Alterações' : 'Concluir Cadastro'}
                                </Button>
                            )}
                        </Stack>
                    </form>

                    {/* Indicadores */}
                    <Stack direction="row" justifyContent="center" spacing={1} mt={3}>
                        {[1, 2, 3].map((i) => (
                            <Box
                                key={i}
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: i === step ? 'primary.main' : '#bbdefb',
                                }}
                            />
                        ))}
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CadastroMedicamento;
