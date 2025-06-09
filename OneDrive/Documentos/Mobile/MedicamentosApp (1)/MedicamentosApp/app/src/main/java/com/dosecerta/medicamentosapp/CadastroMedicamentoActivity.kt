package com.dosecerta.medicamentosapp

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.dosecerta.medicamentosapp.data.MedicamentosRepository
import com.dosecerta.medicamentosapp.model.Medicamento

class CadastroMedicamentoActivity : AppCompatActivity() {
    private lateinit var etNome: EditText
    private lateinit var etDosagem: EditText
    private lateinit var etFrequencia: EditText
    private lateinit var etQuantidade: EditText
    private lateinit var btnSalvar: Button

    private val repo = MedicamentosRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cadastro_medicamento)

        etNome = findViewById(R.id.etNome)
        etDosagem = findViewById(R.id.etDosagem)
        etFrequencia = findViewById(R.id.etFrequencia)
        etQuantidade = findViewById(R.id.etQuantidade)
        btnSalvar = findViewById(R.id.btnSalvar)

        btnSalvar.setOnClickListener {
            val nome = etNome.text.toString().trim()
            val dosagem = etDosagem.text.toString().trim()
            val frequencia = etFrequencia.text.toString().trim()
            val quantidade = etQuantidade.text.toString().trim()

            if (nome.isEmpty() || dosagem.isEmpty() || frequencia.isEmpty() || quantidade.isEmpty()) {
                Toast.makeText(this, "Preencha todos os campos", Toast.LENGTH_SHORT).show()
            } else {
                val med = Medicamento(
                    nome = nome,
                    dosagem = dosagem,
                    frequencia = frequencia,
                    quantidade = quantidade
                )
                repo.adicionarMedicamento(
                    med,
                    onSuccess = {
                        Toast.makeText(this, "Medicamento cadastrado!", Toast.LENGTH_SHORT).show()
                        finish()
                    },
                    onFailure = { e ->
                        Toast.makeText(this, "Erro: ${e.message}", Toast.LENGTH_SHORT).show()
                    }
                )
            }
        }
    }
}