package com.dosecerta.medicamentosapp.data

import com.dosecerta.medicamentosapp.model.Medicamento
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ListenerRegistration

class MedicamentosRepository {
    private val db = FirebaseFirestore.getInstance()
    private val userId: String?
        get() = FirebaseAuth.getInstance().currentUser?.uid

    fun adicionarMedicamento(
        medicamento: Medicamento,
        onSuccess: () -> Unit,
        onFailure: (Exception) -> Unit
    ) {
        userId?.let { uid ->
            db.collection("usuarios")
                .document(uid)
                .collection("medicamentos")
                .add(medicamento)
                .addOnSuccessListener { onSuccess() }
                .addOnFailureListener { e -> onFailure(e) }
        } ?: onFailure(Exception("Usuário não autenticado"))
    }

    fun listarMedicamentos(
        onMedicamentosChanged: (List<Medicamento>) -> Unit,
        onError: (Exception) -> Unit
    ): ListenerRegistration? {
        return userId?.let { uid ->
            db.collection("usuarios")
                .document(uid)
                .collection("medicamentos")
                .addSnapshotListener { snapshots, e ->
                    if (e != null) {
                        onError(e)
                    } else if (snapshots != null) {
                        val lista = snapshots.documents.mapNotNull { doc ->
                            val medicamento = doc.toObject(Medicamento::class.java)
                            medicamento?.id = doc.id
                            medicamento
                        }
                        onMedicamentosChanged(lista)
                    }
                }
        }
    }
}