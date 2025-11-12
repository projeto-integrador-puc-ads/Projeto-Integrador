CREATE TABLE midia (
  id_midia BIGSERIAL PRIMARY KEY,
  id_lembranca BIGINT,
  id_diario BIGINT,
  url_arquivo VARCHAR(512) NOT NULL,
  data_upload TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE INDEX ix_midia_id_lembranca ON midia (id_lembranca);
CREATE INDEX ix_midia_id_diario ON midia (id_diario);

ALTER TABLE midia
  ADD CONSTRAINT fk_midia_lembranca FOREIGN KEY (id_lembranca) REFERENCES lembranca (id_lembranca) ON DELETE CASCADE;

ALTER TABLE midia
  ADD CONSTRAINT fk_midia_diario FOREIGN KEY (id_diario) REFERENCES diario (id_diario) ON DELETE CASCADE;