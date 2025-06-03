package com.dosecerta.medicamentosapp

import android.app.Activity
import android.content.Intent
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.widget.*
import androidx.appcompat.app.AppCompatActivity

class CadastroMedicamentoActivity : AppCompatActivity() {

    private lateinit var etNome: EditText
    private lateinit var etDosagem: EditText
    private lateinit var etFrequencia: EditText
    private lateinit var etQuantidade: EditText
    private lateinit var ivImagem: ImageView
    private lateinit var btnSelecionarImagem: Button
    private lateinit var btnSalvar: Button

    private var imagemUri: Uri? = null

    companion object {
        private const val PICK_IMAGE_REQUEST = 1
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cadastro_medicamento)

        etNome = findViewById(R.id.etNome)
        etDosagem = findViewById(R.id.etDosagem)
        etFrequencia = findViewById(R.id.etFrequencia)
        etQuantidade = findViewById(R.id.etQuantidade)
        ivImagem = findViewById(R.id.ivImagem)
        btnSelecionarImagem = findViewById(R.id.btnSelecionarImagem)
        btnSalvar = findViewById(R.id.btnSalvar)

        btnSelecionarImagem.setOnClickListener {
            val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            startActivityForResult(intent, PICK_IMAGE_REQUEST)
        }

        btnSalvar.setOnClickListener {
            val nome = etNome.text.toString().trim()
            val dosagem = etDosagem.text.toString().trim()
            val frequencia = etFrequencia.text.toString().trim()
            val quantidade = etQuantidade.text.toString().trim()

            if (nome.isEmpty() || dosagem.isEmpty() || frequencia.isEmpty() || quantidade.isEmpty()) {
                Toast.makeText(this, "Preencha todos os campos", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "Medicamento salvo (simulado)", Toast.LENGTH_LONG).show()
                // Aqui você pode criar um objeto para enviar para o backend futuramente
            }
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == PICK_IMAGE_REQUEST && resultCode == Activity.RESULT_OK && data != null) {
            imagemUri = data.data
            ivImagem.setImageURI(imagemUri)
        }
    }
}
