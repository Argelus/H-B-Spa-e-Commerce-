package com.spa;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

     public void enviarcorreo(String para, String asunto, String mensaje){

         SimpleMailMessage email = new SimpleMailMessage();
         email.setTo(para);
         email.setSubject(asunto);
         email.setText(mensaje);

         email.setFrom("cuartodeunvago@gmail.com");

         mailSender.send(email);

         System.out.println("Correo enviado :D " + para);
     }
}
