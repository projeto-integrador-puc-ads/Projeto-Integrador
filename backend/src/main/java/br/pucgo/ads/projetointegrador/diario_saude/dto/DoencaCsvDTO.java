package br.pucgo.ads.projetointegrador.diario_saude.dto;

public class DoencaCsvDTO {

    private String subcategoria;
    private String categoria;
    private String restricaoSexo;
    private String causaObito;
    private String descricao;
    private String descricaoAbrev;

    public String getSubcategoria() {
        return subcategoria;
    }

    public void setSubcategoria(String subcategoria) {
        this.subcategoria = subcategoria;
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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricaoAbrev() {
        return descricaoAbrev;
    }

    public void setDescricaoAbrev(String descricaoAbrev) {
        this.descricaoAbrev = descricaoAbrev;
    }
}
