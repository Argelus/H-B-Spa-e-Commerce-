package com.spa;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/enviar")
    public ResponseEntity<String> enviarcorreo(
            @RequestParam String para,
            @RequestParam String asunto,
            @RequestParam String mensaje) {

        try {
            emailService.enviarcorreo(para, asunto, mensaje);
            return ResponseEntity.ok("Correo enviado con exito a: " + para);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al enviar al correo: " + e.getMessage());
        }
    }
}
