package com.spa.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class WhatsappService {

    // Se inyectan los valores desde application.properties
    @Value("${whatsapp.api.url}")
    private String whatsappApiUrl;

    @Value("${whatsapp.api.token}")
    private String whatsappToken;

    //Envía un mensaje de texto por WhatsApp
    public void enviarMensaje(String numero, String mensaje) {

        try {
            // Se crea el cuerpo del JSON
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("messaging_product", "whatsapp");
            requestBody.put("to", numero);
            requestBody.put("type", "text");

            Map<String, String> text = new HashMap<>();
            text.put("body", mensaje);
            requestBody.put("text", text);

            // Encabezados HTTP con token de autorización
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(whatsappToken);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Cliente HTTP de Spring
            RestTemplate restTemplate = new RestTemplate();

            // Envío del mensaje
            ResponseEntity<String> response = restTemplate.postForEntity(whatsappApiUrl, entity, String.class);

            // Muestra resultado en consola
            System.out.println("WhatsApp API response: " + response.getBody());

        } catch (Exception e) {
            System.err.println("Error al enviar mensaje de WhatsApp: " + e.getMessage());
        }
    }
}
