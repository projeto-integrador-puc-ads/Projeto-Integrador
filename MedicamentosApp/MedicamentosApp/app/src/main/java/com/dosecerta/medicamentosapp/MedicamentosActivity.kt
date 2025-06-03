package com.dosecerta.medicamentosapp

import android.content.Intent
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.ListView
import androidx.appcompat.app.AppCompatActivity

class MedicamentosActivity : AppCompatActivity() {

    private lateinit var listView: ListView
    private lateinit var btnNovo: Button

    private val medicamentos = mutableListOf(
        "Dipirona 500mg",
        "Ibuprofeno 200mg"
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_medicamentos)

        listView = findViewById(R.id.listViewMedicamentos)
        btnNovo = findViewById(R.id.btnNovoMedicamento)

        val adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, medicamentos)
        listView.adapter = adapter

        listView.setOnItemClickListener { _, _, position, _ ->
            val intent = Intent(this, DetalhesMedicamentoActivity::class.java)
            intent.putExtra("medicamento", medicamentos[position])
            startActivity(intent)
        }

        btnNovo.setOnClickListener {
            startActivity(Intent(this, CadastroMedicamentoActivity::class.java))
        }
    }
}
