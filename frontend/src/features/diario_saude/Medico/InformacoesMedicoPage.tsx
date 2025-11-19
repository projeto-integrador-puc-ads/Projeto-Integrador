import { useState, useEffect } from "react";
import { Box, Button, Typography, Stack, Divider } from "@mui/material";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import SectionTitle from "../components/SectionTitle";
import RoundedTextField from "../components/RoundedTextField";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";

export default function InformacoesMedicoPage() {
  const navigate = useNavigate();
  const medicoLogado = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
  const token = localStorage.getItem("token");
  const medicoId = medicoLogado?.id_usuario; // no seu localStorage, o id do médico está em id_usuario

  const [medico, setMedico] = useState<any>(null);
  const [editData, setEditData] = useState({ nome: "", local_trabalho: "" });

  useEffect(() => {
    if (!medicoLogado) navigate("/login");
  }, [medicoLogado, navigate]);

  useEffect(() => {
    if (!medicoId || !token) return;

    fetch(`http://localhost:8080/api/diario_saude/medico/${medicoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMedico(data);
        setEditData({ nome: data.nome || "", local_trabalho: data.local_trabalho || "" });
      })
      .catch(console.error);
  }, [medicoId, token]);

  const handleChange = (e: any) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const salvarAlteracoes = async () => {
    try {
      const resp = await fetch("http://localhost:8080/api/diario_saude/medico", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id_medico: medicoId, ...editData }),
      });

      if (resp.ok) {
        alert("Informações do médico atualizadas!");
        
        const atualizado = { ...medicoLogado, ...editData };
        localStorage.setItem("usuarioLogado", JSON.stringify(atualizado));
        setMedico(atualizado);
      } else {
        alert("Erro ao salvar informações.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PageContainer>
      <BackButton to="/home" />
      <PageTitle>Informações do Médico</PageTitle>

      <SectionTitle>Dados do Médico</SectionTitle>
      <Stack spacing={2}>
        <RoundedTextField label="Nome" name="nome" value={editData.nome} onChange={handleChange} />
        <RoundedTextField label="Local de Trabalho" name="local_trabalho" value={editData.local_trabalho} onChange={handleChange} />
      </Stack>
      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={salvarAlteracoes}>
        Salvar Alterações
      </Button>
    </PageContainer>
  );
}
