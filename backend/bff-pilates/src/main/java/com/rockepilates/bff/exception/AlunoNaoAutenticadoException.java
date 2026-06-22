package com.rockepilates.bff.exception;

public class AlunoNaoAutenticadoException extends RuntimeException {

    public AlunoNaoAutenticadoException(String message) {
        super(message);
    }
}
