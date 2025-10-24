package com.spa.service;

import com.spa.security.model.Usuario;
import com.spa.security.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Método para guardar el usuario (usado en el registro)
    public Usuario guardarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // Método para verificar si el username ya existe
    public boolean existePorUsername(String username) {
        return usuarioRepository.existsByUsername(username);
    }

    // Método para verificar si el email ya existe
    public boolean existePorEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    // (Aquí puedes agregar más lógica de negocio a futuro)
}