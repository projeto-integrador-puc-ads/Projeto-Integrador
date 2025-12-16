package br.pucgo.ads.projetointegrador.DoseCertaApp.model;


import jakarta.persistence.*;

@Entity
@Table(name = "medicamentos_anvisa")
public class MedicamentoAnvisa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // === COLUNAS DA PLANILHA ===
    @Column(name = "tipo_produto", columnDefinition = "TEXT")
    private String tipoProduto;

    @Column(name = "nome_produto", columnDefinition = "TEXT")
    private String nomeProduto;

    @Column(name = "data_finalizacao_processo", columnDefinition = "TEXT")
    private String dataFinalizacaoProcesso;

    @Column(name = "categoria_regulatoria", columnDefinition = "TEXT")
    private String categoriaRegulatoria;

    @Column(name = "numero_registro_produto", columnDefinition = "TEXT")
    private String numeroRegistroProduto;

    @Column(name = "data_vencimento_registro", columnDefinition = "TEXT")
    private String dataVencimentoRegistro;

    @Column(name = "numero_processo", columnDefinition = "TEXT")
    private String numeroProcesso;

    @Column(name = "classe_terapeutica", columnDefinition = "TEXT")
    private String classeTerapeutica;

    @Column(name = "empresa_detentora_registro", columnDefinition = "TEXT")
    private String empresaDetentoraRegistro;

    @Column(name = "situacao_registro", columnDefinition = "TEXT")
    private String situacaoRegistro;

    @Column(name = "principio_ativo", columnDefinition = "TEXT")
    private String principioAtivo;

    public MedicamentoAnvisa() {}

    public MedicamentoAnvisa(
            String tipoProduto,
            String nomeProduto,
            String dataFinalizacaoProcesso,
            String categoriaRegulatoria,
            String numeroRegistroProduto,
            String dataVencimentoRegistro,
            String numeroProcesso,
            String classeTerapeutica,
            String empresaDetentoraRegistro,
            String situacaoRegistro,
            String principioAtivo
    ) {
        this.tipoProduto = tipoProduto;
        this.nomeProduto = nomeProduto;
        this.dataFinalizacaoProcesso = dataFinalizacaoProcesso;
        this.categoriaRegulatoria = categoriaRegulatoria;
        this.numeroRegistroProduto = numeroRegistroProduto;
        this.dataVencimentoRegistro = dataVencimentoRegistro;
        this.numeroProcesso = numeroProcesso;
        this.classeTerapeutica = classeTerapeutica;
        this.empresaDetentoraRegistro = empresaDetentoraRegistro;
        this.situacaoRegistro = situacaoRegistro;
        this.principioAtivo = principioAtivo;
    }

    // ========= GETTERS & SETTERS =============

    public Long getId() { return id; }

    public String getTipoProduto() { return tipoProduto; }
    public void setTipoProduto(String tipoProduto) { this.tipoProduto = tipoProduto; }

    public String getNomeProduto() { return nomeProduto; }
    public void setNomeProduto(String nomeProduto) { this.nomeProduto = nomeProduto; }

    public String getDataFinalizacaoProcesso() { return dataFinalizacaoProcesso; }
    public void setDataFinalizacaoProcesso(String dataFinalizacaoProcesso) { this.dataFinalizacaoProcesso = dataFinalizacaoProcesso; }

    public String getCategoriaRegulatoria() { return categoriaRegulatoria; }
    public void setCategoriaRegulatoria(String categoriaRegulatoria) { this.categoriaRegulatoria = categoriaRegulatoria; }

    public String getNumeroRegistroProduto() { return numeroRegistroProduto; }
    public void setNumeroRegistroProduto(String numeroRegistroProduto) { this.numeroRegistroProduto = numeroRegistroProduto; }

    public String getDataVencimentoRegistro() { return dataVencimentoRegistro; }
    public void setDataVencimentoRegistro(String dataVencimentoRegistro) { this.dataVencimentoRegistro = dataVencimentoRegistro; }

    public String getNumeroProcesso() { return numeroProcesso; }
    public void setNumeroProcesso(String numeroProcesso) { this.numeroProcesso = numeroProcesso; }

    public String getClasseTerapeutica() { return classeTerapeutica; }
    public void setClasseTerapeutica(String classeTerapeutica) { this.classeTerapeutica = classeTerapeutica; }

    public String getEmpresaDetentoraRegistro() { return empresaDetentoraRegistro; }
    public void setEmpresaDetentoraRegistro(String empresaDetentoraRegistro) { this.empresaDetentoraRegistro = empresaDetentoraRegistro; }

    public String getSituacaoRegistro() { return situacaoRegistro; }
    public void setSituacaoRegistro(String situacaoRegistro) { this.situacaoRegistro = situacaoRegistro; }

    public String getPrincipioAtivo() { return principioAtivo; }
    public void setPrincipioAtivo(String principioAtivo) { this.principioAtivo = principioAtivo; }

}
