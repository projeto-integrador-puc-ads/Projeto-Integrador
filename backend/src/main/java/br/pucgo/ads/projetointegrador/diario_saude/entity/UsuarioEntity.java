package br.pucgo.ads.projetointegrador.diario_saude.entity;

import org.springframework.beans.BeanUtils;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.pucgo.ads.projetointegrador.diario_saude.dto.UsuarioDTO;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.List;
import jakarta.persistence.OneToMany;


@Entity
@Table(name = "usuario")
public class UsuarioEntity {

    @Id//chave primária
    @GeneratedValue(strategy = GenerationType.IDENTITY)//auto incremental
    private long id_usuario;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private int idade;

    @Column(nullable = false)
    private float peso;

    @Column(nullable = false)
    private float altura;

    private String alergias;

    @OneToMany(mappedBy = "usuario")
    @JsonIgnore
    private List<PrescricaoMedicaEntity> prescricoesMedicas;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<UsuarioDoencasEntity> usuarioDoencas;


    public UsuarioEntity(UsuarioDTO usuario){
        BeanUtils.copyProperties(usuario, this);
    }
    public UsuarioEntity(){
        
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + (int) (id_usuario ^ (id_usuario >>> 32));
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        UsuarioEntity other = (UsuarioEntity) obj;
        if (id_usuario != other.id_usuario)
            return false;
        return true;
    }

    public long getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(long id_usuario) {
        this.id_usuario = id_usuario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public int getIdade() {
        return idade;
    }

    public void setIdade(int idade) {
        this.idade = idade;
    }

    public float getPeso() {
        return peso;
    }

    public void setPeso(float peso) {
        this.peso = peso;
    }

    public float getAltura() {
        return altura;
    }

    public void setAltura(float altura) {
        this.altura = altura;
    }

    public String getAlergias() {
        return alergias;
    }

    public void setAlergias(String alergias) {
        this.alergias = alergias;
    }
    public List<PrescricaoMedicaEntity> getPrescricoesMedicas() {
        return prescricoesMedicas;
    }
    public void setPrescricoesMedicas(List<PrescricaoMedicaEntity> prescricoesMedicas) {
        this.prescricoesMedicas = prescricoesMedicas;
    }
    public List<UsuarioDoencasEntity> getUsuarioDoencas() {
        return usuarioDoencas;
    }
    public void setUsuarioDoencas(List<UsuarioDoencasEntity> usuarioDoencas) {
        this.usuarioDoencas = usuarioDoencas;
    }
    
}
