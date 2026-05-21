package org.fet.dto;

// Este DTO representa lo que el sistema responde
public class ProductoResponseDTO {

    private Long id;
    private String nombre;
    private double precio;

    // Constructor
    public ProductoResponseDTO(Long id, String nombre, double precio) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public double getPrecio() {
        return precio;
    }
}