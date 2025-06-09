package com.dosecerta.medicamentosapp.model

data class Medicamento(
    var id: String? = null,
    val nome: String = "",
    val dosagem: String = "",
    val frequencia: String = "",
    val quantidade: String = "",
    val horario: String = "",
    val imagemUrl: String = "",
    val contatoEmergencia: String = ""
)