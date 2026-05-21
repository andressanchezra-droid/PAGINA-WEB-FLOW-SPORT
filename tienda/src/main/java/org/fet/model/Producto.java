package org.fet.model;
// Representa un producto dentro del sistema
//public class Producto {

    private Long id;        // ID producto
    private String nombre;  // Nombre del producto
    private double precio;  // Precio del producto

    // Constructor
    public Producto(Long id, String nombre, double precio) {
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

    // Setters
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }
}

