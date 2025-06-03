package com.example.demo.repository;

import com.example.demo.model.Medication;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;


@Repository
public class FirebaseMedicationRepository {

    private static final String COLLECTION_NAME = "medications";
    private final Firestore firestore;

    public FirebaseMedicationRepository(Firestore firestore) {
        this.firestore = firestore;
    }


    public Medication save(Medication medication) {
        try {
            DocumentReference docRef = firestore
                    .collection(COLLECTION_NAME)
                    .document(medication.getId());

            ApiFuture<WriteResult> writeResult = docRef.set(medication);
            writeResult.get(); // aguarda confirmação da escrita
            return medication;
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Erro ao salvar Medication no Firestore", e);
        }
    }


    public Optional<Medication> findById(String id) {
        try {
            DocumentReference docRef = firestore
                    .collection(COLLECTION_NAME)
                    .document(id);

            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot snapshot = future.get();

            if (snapshot.exists()) {
                Medication med = snapshot.toObject(Medication.class);
                return Optional.ofNullable(med);
            } else {
                return Optional.empty();
            }
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Erro ao buscar Medication por ID no Firestore", e);
        }
    }


    public List<Medication> findAll() {
        try {
            ApiFuture<QuerySnapshot> future = firestore
                    .collection(COLLECTION_NAME)
                    .get();

            List<QueryDocumentSnapshot> documents = future.get().getDocuments();
            List<Medication> resultados = new ArrayList<>();

            for (QueryDocumentSnapshot doc : documents) {
                resultados.add(doc.toObject(Medication.class));
            }
            return List.copyOf(resultados);
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Erro ao listar todos os Medication no Firestore", e);
        }
    }


    public void deleteById(String id) {
        try {
            DocumentReference docRef = firestore
                    .collection(COLLECTION_NAME)
                    .document(id);

            ApiFuture<WriteResult> writeResult = docRef.delete();
            writeResult.get(); // confirma exclusão
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Erro ao deletar Medication no Firestore", e);
        }
    }


    public Optional<Medication> findByName(String name) {
        try {
            ApiFuture<QuerySnapshot> future = firestore
                    .collection(COLLECTION_NAME)
                    .whereEqualTo("name", name.trim())
                    .get();

            List<QueryDocumentSnapshot> documents = future.get().getDocuments();
            if (documents.isEmpty()) {
                return Optional.empty();
            }
            Medication med = documents.get(0).toObject(Medication.class);
            return Optional.ofNullable(med);
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Erro ao buscar Medication por nome no Firestore", e);
        }
    }
}
