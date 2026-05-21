package org.fet.controller;

import org.fet.dto.ProductoRequestDTO;
import org.fet.dto.ProductoResponseDTO;
import org.fet.service.ProductoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    private ProductoService service = new ProductoService();

    // Endpoint para crear producto
    @PostMapping
    public ProductoResponseDTO crear(@RequestBody ProductoRequestDTO dto) {
        return service.crearProducto(dto);
    }
}