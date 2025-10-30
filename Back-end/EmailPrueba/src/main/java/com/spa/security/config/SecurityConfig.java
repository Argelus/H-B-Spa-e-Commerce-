package com.spa.security.config;

import com.spa.security.jwt.JwtUtil;
import com.spa.security.service.UsuarioDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UsuarioDetailsServiceImpl userDetailsService;
    private final JwtRequestFilter jwtRequestFilter;

    public SecurityConfig(UsuarioDetailsServiceImpl userDetailsService, JwtUtil jwtUtil) {
        this.userDetailsService = userDetailsService;
        this.jwtRequestFilter = new JwtRequestFilter(jwtUtil, userDetailsService);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(org.springframework.security.config.annotation.web.builders.HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 🔓 Permisos públicos
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/products/**",
                                "/api/categories/**",
                                "/api/services/**",
                                "/api/service-categories/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/email/enviar").permitAll()

                        // ✅ Permitir crear reservas a usuarios autenticados
                        .requestMatchers(HttpMethod.POST, "/api/reservas/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        // 🔒 Consultar reservas también solo si está logueado
                        .requestMatchers(HttpMethod.GET, "/api/reservas/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        // 🔒 Lo mismo para órdenes
                        .requestMatchers("/api/orders/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        // 🧠 Subida de imágenes solo para admin
                        .requestMatchers(HttpMethod.POST, "/api/images/upload").hasAuthority("ROLE_ADMIN")

                        // 🔐 Solo ADMIN puede crear/editar/eliminar productos, categorías y servicios
                        .requestMatchers(HttpMethod.POST,
                                "/api/products/**",
                                "/api/categories/**",
                                "/api/services/**",
                                "/api/service-categories/**").hasAuthority("ROLE_ADMIN")

                        .requestMatchers(HttpMethod.PUT,
                                "/api/products/**",
                                "/api/categories/**",
                                "/api/services/**",
                                "/api/service-categories/**").hasAuthority("ROLE_ADMIN")

                        .requestMatchers(HttpMethod.DELETE,
                                "/api/products/**",
                                "/api/categories/**",
                                "/api/services/**",
                                "/api/service-categories/**").hasAuthority("ROLE_ADMIN")

                        // ✅ Consultar órdenes o historial
                        .requestMatchers(HttpMethod.GET, "/api/orders/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/usuarios/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        // ⚠️ Cualquier otra petición requiere autenticación
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
