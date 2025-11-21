package br.pucgo.ads.projetointegrador.diario_saude.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ds_doenca")
public class DoencasEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false, length = 1000)
    private String nome;

    @Column(name = "nome_abreviado", length = 500)
    private String nomeAbreviado;

    @Column(name = "categoria", length = 500)
    private String categoria;

    @Column(name = "causa_obito", length = 500)
    private String causaObito;

    @Column(name = "codigo", length = 50)
    private String codigo;

    @Column(name = "restricao_sexo", length = 50)
    private String restricaoSexo;

    public DoencasEntity() {}

    public Long getId() {
        return id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getRestricaoSexo() {
        return restricaoSexo;
    }

    public void setRestricaoSexo(String restricaoSexo) {
        this.restricaoSexo = restricaoSexo;
    }

    public String getCausaObito() {
        return causaObito;
    }

    public void setCausaObito(String causaObito) {
        this.causaObito = causaObito;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNomeAbreviado() {
        return nomeAbreviado;
    }

    public void setNomeAbreviado(String nomeAbreviado) {
        this.nomeAbreviado = nomeAbreviado;
    }
}
