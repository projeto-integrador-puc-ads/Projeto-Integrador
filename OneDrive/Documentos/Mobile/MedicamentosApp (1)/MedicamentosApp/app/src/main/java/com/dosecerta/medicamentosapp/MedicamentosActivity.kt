package com.dosecerta.medicamentosapp

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.dosecerta.medicamentosapp.data.MedicamentosRepository
import com.dosecerta.medicamentosapp.model.Medicamento

class MedicamentosActivity : AppCompatActivity() {

    private lateinit var listView: ListView
    private lateinit var btnNovo: Button
    private val medicamentosRepo = MedicamentosRepository()
    private val medicamentos = mutableListOf<Medicamento>()
    private lateinit var adapter: ArrayAdapter<String>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_medicamentos)

        listView = findViewById(R.id.listViewMedicamentos)
        btnNovo = findViewById(R.id.btnNovoMedicamento)
        adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, mutableListOf())
        listView.adapter = adapter

        medicamentosRepo.listarMedicamentos(
            onMedicamentosChanged = { lista ->
                medicamentos.clear()
                medicamentos.addAll(lista)
                adapter.clear()
                adapter.addAll(lista.map { it.nome })
                adapter.notifyDataSetChanged()
            },
            onError = { e ->
                Toast.makeText(this, "Erro ao carregar medicamentos: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        )

        btnNovo.setOnClickListener {
            startActivity(Intent(this, CadastroMedicamentoActivity::class.java))
        }
    }
}