package org.fet.exception;

// Error cuando el cliente manda datos incorrectos
public class BadRequestException extends RuntimeException {

    public BadRequestException(String mensaje) {
        super(mensaje);
    }
}