package com.spa.service;

import org.springframework.stereotype.Service;

@Service
public class WhatsappService {

    // 🧪 Modo de simulación (no se conecta a Meta)
    public void enviarMensaje(String numero, String mensaje) {
        System.out.println("====================================");
        System.out.println("📱 SIMULACIÓN DE MENSAJE WHATSAPP");
        System.out.println("Número destino: " + numero);
        System.out.println("Contenido del mensaje:");
        System.out.println(mensaje);
        System.out.println("✅ Mensaje simulado correctamente.");
        System.out.println("====================================");
    }
}
