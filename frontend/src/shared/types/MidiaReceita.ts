// Este tipo não depende de nada, apenas define a mídia.
export interface MidiaReceita {
  id: number;
  tipoMidia: 'foto' | 'video';
  caminhoArquivo: string;
}