package org.fet.repository;

import org.fet.model.Producto;
import java.util.*;

// Esta clase simula una base de datos en memoria
public class ProductoRepository {

    // Aquí guardamos
    private Map<Long, Producto> productos = new HashMap<>();

    // Este contador genera IDs automáticamente
    private Long contador = 1L;

    // Método para guardar producto
    public Producto guardar(Producto producto) {

        //Generar ID
        producto = new Producto(contador, producto.getNombre(), producto.getPrecio());

        // Guarda en el Map
        productos.put(contador, producto);

        // Incrementar contador
        contador++;

        return producto;
    }

    // Método para obtener todos los productos
    public List<Producto> obtenerTodos() {
        return new ArrayList<>(productos.values());
    }
}