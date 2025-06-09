package com.dosecerta.medicamentosapp.data

import android.net.Uri
import com.google.firebase.storage.FirebaseStorage

class StorageRepository {
    private val storage = FirebaseStorage.getInstance()

    fun uploadImagemMedicamento(
        uri: Uri,
        onSuccess: (String) -> Unit,
        onFailure: (Exception) -> Unit
    ) {
        val ref = storage.reference.child("imagens_medicamentos/${System.currentTimeMillis()}.jpg")
        ref.putFile(uri)
            .addOnSuccessListener {
                ref.downloadUrl.addOnSuccessListener { downloadUri ->
                    onSuccess(downloadUri.toString())
                }.addOnFailureListener { e -> onFailure(e) }
            }
            .addOnFailureListener { e -> onFailure(e) }
    }
}