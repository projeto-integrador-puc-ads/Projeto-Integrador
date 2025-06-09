package com.dosecerta.medicamentosapp

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.dosecerta.medicamentosapp.data.AuthRepository

class LoginActivity : AppCompatActivity() {
    private val authRepository = AuthRepository()
    private lateinit var etEmail: EditText
    private lateinit var etSenha: EditText
    private lateinit var btnLogin: Button
    private lateinit var tvCadastrar: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        etEmail = findViewById(R.id.etEmail)
        etSenha = findViewById(R.id.etSenha)
        btnLogin = findViewById(R.id.btnLogin)
        tvCadastrar = findViewById(R.id.tvCadastrar)

        btnLogin.setOnClickListener {
            val email = etEmail.text.toString().trim()
            val senha = etSenha.text.toString().trim()
            if (email.isEmpty() || senha.isEmpty()) {
                Toast.makeText(this, "Preencha todos os campos", Toast.LENGTH_SHORT).show()
            } else {
                authRepository.login(email, senha,
                    onSuccess = {
                        Toast.makeText(this, "Login realizado com sucesso!", Toast.LENGTH_SHORT).show()
                        startActivity(Intent(this, MedicamentosActivity::class.java))
                        finish()
                    },
                    onFailure = { e ->
                        Toast.makeText(this, "Erro ao fazer login: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
                    }
                )
            }
        }

        tvCadastrar.setOnClickListener {
            startActivity(Intent(this, CadastroUsuarioActivity::class.java))
        }
    }
}