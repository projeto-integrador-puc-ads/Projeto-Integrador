package com.dosecerta.medicamentosapp

import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import android.os.Bundle
import android.provider.MediaStore
import android.widget.*
import androidx.appcompat.app.AppCompatActivity

class DetalhesMedicamentoActivity : AppCompatActivity() {

    private lateinit var imgIlustracao: ImageView
    private val REQUEST_IMAGE_CAPTURE = 1

    private lateinit var tvTitulo: TextView
    private lateinit var tvQuantidade: TextView
    private lateinit var switchLembrete: Switch
    private lateinit var timePicker: TimePicker

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_detalhes_medicamento)

        tvTitulo = findViewById(R.id.tvTituloMedicamento)
        tvQuantidade = findViewById(R.id.tvQuantidade)
        switchLembrete = findViewById(R.id.switchLembrete)
        timePicker = findViewById(R.id.timePicker)
        imgIlustracao = findViewById(R.id.imgIlustracao)

        // Dados simulados recebidos da lista
        val nome = intent.getStringExtra("medicamento") ?: "Medicamento"
        tvTitulo.text = nome
        tvQuantidade.text = "1 comprimido(s)"

        switchLembrete.setOnCheckedChangeListener { _, isChecked ->
            val mensagem = if (isChecked) "Lembrete ativado" else "Lembrete desativado"
            Toast.makeText(this, mensagem, Toast.LENGTH_SHORT).show()
        }

        // Clique para abrir a câmera
        imgIlustracao.setOnClickListener {
            val takePictureIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
            if (takePictureIntent.resolveActivity(packageManager) != null) {
                startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE)
            }
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == REQUEST_IMAGE_CAPTURE && resultCode == Activity.RESULT_OK) {
            val imageBitmap = data?.extras?.get("data") as? Bitmap
            imageBitmap?.let {
                imgIlustracao.setImageBitmap(it)
            }
        }
    }
}
