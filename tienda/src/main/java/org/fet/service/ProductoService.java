package org.fet.service;

import org.fet.dto.ProductoRequestDTO;
import org.fet.dto.ProductoResponseDTO;
import org.fet.model.Producto;
import org.fet.repository.ProductoRepository;
import org.fet.exception.BadRequestException;
import org.fet.exception.RecursoNoEncontradoException;

public class ProductoService {

    private ProductoRepository repository = new ProductoRepository();

    // 🔹 Crear producto
    public ProductoResponseDTO crearProducto(ProductoRequestDTO dto) {

        // VALIDACIÓN
        if (dto.getPrecio() < 0) {
            throw new BadRequestException("El precio no puede ser negativo");
        }

        // DTO → MODEL (sin id todavía)
        Producto producto = new Producto(null, dto.getNombre(), dto.getPrecio());

        // GUARDAR (aquí se genera el ID)
        producto = repository.guardar(producto);

        // MODEL → RESPONSE DTO
        return new ProductoResponseDTO(
                producto.getId(),
                producto.getNombre(),
                producto.getPrecio()
        );
    }

    // 🔹 Obtener producto por ID
    public ProductoResponseDTO obtenerPorId(Long id) {

        Producto producto = repository.obtenerPorId(id);

        // SI NO EXISTE → ERROR 404
        if (producto == null) {
            throw new RecursoNoEncontradoException("Producto no encontrado");
        }

        return new ProductoResponseDTO(
                producto.getId(),
                producto.getNombre(),
                producto.getPrecio()
        );
    }
}