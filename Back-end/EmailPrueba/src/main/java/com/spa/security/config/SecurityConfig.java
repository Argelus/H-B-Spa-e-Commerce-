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
                        // 🔓 Públicos
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/products", "/api/products/**",
                                "/api/categories", "/api/categories/**",
                                "/api/spa-services", "/api/spa-services/**",
                                "/api/service-categories", "/api/service-categories/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/email/enviar").permitAll()

                        // ✅ Reservas
                        .requestMatchers(HttpMethod.POST, "/api/reservas/**").hasAnyAuthority("ROLE_USER","ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET,  "/api/reservas/**").hasAnyAuthority("ROLE_USER","ROLE_ADMIN")

                        // ✅ Órdenes
                        .requestMatchers("/api/orders/**").hasAnyAuthority("ROLE_USER","ROLE_ADMIN")

                        // ✅ Usuarios (perfil/historial)
                        .requestMatchers(HttpMethod.GET, "/api/usuarios/**").hasAnyAuthority("ROLE_USER","ROLE_ADMIN")

                        // 🧠 Admin
                        .requestMatchers(HttpMethod.POST, "/api/images/upload").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST,
                                "/api/products/**","/api/categories/**",
                                "/api/services/**","/api/service-categories/**"
                        ).hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT,
                                "/api/products/**","/api/categories/**",
                                "/api/services/**","/api/service-categories/**"
                        ).hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE,
                                "/api/products/**","/api/categories/**",
                                "/api/services/**","/api/service-categories/**"
                        ).hasAuthority("ROLE_ADMIN")

                        // ⚠️ Resto autenticado
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
