package com.dosecerta.medicamentosapp

object RepositorioDeMedicamentos {

    private val medicamentos = mutableListOf<String>()

    fun adicionar(medicamento: String) {
        medicamentos.add(medicamento)
    }

    fun listar(): List<String> {
        return medicamentos
    }

    fun getTodos(): List<String> = medicamentos
}
