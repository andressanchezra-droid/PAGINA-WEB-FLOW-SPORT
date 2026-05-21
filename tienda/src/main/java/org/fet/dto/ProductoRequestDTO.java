package org.fet.dto;

// Este DTO representa lo que el cliente envía
public class ProductoRequestDTO {

    private String nombre;
    private double precio;

    // Getter para nombre
    public String getNombre() {
        return nombre;
    }

    // Getter para precio
    public double getPrecio() {
        return precio;
    }
}