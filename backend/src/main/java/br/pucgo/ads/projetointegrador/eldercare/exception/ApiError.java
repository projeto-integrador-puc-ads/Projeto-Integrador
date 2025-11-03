package br.pucgo.ads.projetointegrador.eldercare.exception;
import java.time.Instant;
public record ApiError(Instant timestamp, int status, String error, String message, String path) {}
