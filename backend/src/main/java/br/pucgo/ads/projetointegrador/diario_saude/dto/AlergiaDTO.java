package br.pucgo.ads.projetointegrador.diario_saude.dto;

import java.util.List;
import java.util.Objects;

public class AlergiaDTO {

    private String code;
    private String display;
    private List<PropertyDTO> property;

    public AlergiaDTO() {
    }

    public AlergiaDTO(String code, String display, List<PropertyDTO> property) {
        this.code = code;
        this.display = display;
        this.property = property;
    }

    public String getCode() { 
        return code; 
    }

    public void setCode(String code) { 
        this.code = code; 
    }

    public String getDisplay() { 
        return display; 
    }

    public void setDisplay(String display) { 
        this.display = display; 
    }

    public List<PropertyDTO> getProperty() { 
        return property; 
    }

    public void setProperty(List<PropertyDTO> property) { 
        this.property = property; 
    }

    @Override
    public String toString() {
        return "AlergiaDTO{" +
                "code='" + code + '\'' +
                ", display='" + display + '\'' +
                ", property=" + property +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AlergiaDTO)) return false;
        AlergiaDTO that = (AlergiaDTO) o;
        return Objects.equals(code, that.code);
    }

    @Override
    public int hashCode() {
        return Objects.hash(code);
    }

    public static class PropertyDTO {

        private String code;
        private String valueCode;

        public PropertyDTO() {
        }

        public PropertyDTO(String code, String valueCode) {
            this.code = code;
            this.valueCode = valueCode;
        }

        public String getCode() { 
            return code; 
        }

        public void setCode(String code) { 
            this.code = code; 
        }

        public String getValueCode() { 
            return valueCode; 
        }

        public void setValueCode(String valueCode) { 
            this.valueCode = valueCode; 
        }

        @Override
        public String toString() {
            return "PropertyDTO{" +
                    "code='" + code + '\'' +
                    ", valueCode='" + valueCode + '\'' +
                    '}';
        }
    }
}
