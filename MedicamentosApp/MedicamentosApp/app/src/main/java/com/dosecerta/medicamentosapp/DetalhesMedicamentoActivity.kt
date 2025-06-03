package com.dosecerta.medicamentosapp

import android.os.Bundle
import android.widget.Button
import android.widget.CheckBox
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class DetalhesMedicamentoActivity : AppCompatActivity() {

    private lateinit var tvNome: TextView
    private lateinit var tvQuantidade: TextView
    private lateinit var checkTomado: CheckBox
    private lateinit var btnVoltar: Button

    private var quantidadeTotal = 10
    private var quantidadeTomada = 2

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_detalhes_medicamento)

        val nome = intent.getStringExtra("medicamento") ?: "Medicamento"

        tvNome = findViewById(R.id.tvNomeMedicamento)
        tvQuantidade = findViewById(R.id.tvQuantidade)
        checkTomado = findViewById(R.id.checkTomadoHoje)
        btnVoltar = findViewById(R.id.btnVoltar)

        tvNome.text = nome
        atualizarQuantidade()

        checkTomado.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) {
                quantidadeTomada++
                checkTomado.isEnabled = false // impede múltiplos cliques
                atualizarQuantidade()
                Toast.makeText(this, "Medicamento registrado como tomado!", Toast.LENGTH_SHORT).show()
            }
        }

        btnVoltar.setOnClickListener {
            finish()
        }
    }

    private fun atualizarQuantidade() {
        tvQuantidade.text = "Comprimidos tomados: $quantidadeTomada / $quantidadeTotal"
    }
}
