package com.rockepilates.gerenciador.service;

import com.rockepilates.gerenciador.dto.MediaUploadResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Set;
import java.util.UUID;

@Service
public class MediaStorageService {

    private static final String UPLOAD_DIR = "uploads";
    private static final long MAX_FILE_SIZE = 200L * 1024 * 1024; // 200MB

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/avif",
            "image/gif",
            "video/mp4",
            "video/webm",
            "video/quicktime"
    );

    public MediaUploadResponse upload(MultipartFile file) {
        validarArquivo(file);

        try {
            Files.createDirectories(Path.of(UPLOAD_DIR));

            String originalFilename = file.getOriginalFilename();
            String extension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String filename = UUID.randomUUID() + extension;
            Path destination = Path.of(UPLOAD_DIR, filename);

            file.transferTo(destination);

            return new MediaUploadResponse("/uploads/" + filename);
        } catch (IOException exception) {
            throw new RuntimeException("Erro ao fazer upload do arquivo", exception);
        }
    }

    private void validarArquivo(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Arquivo não enviado");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Arquivo excede o limite de 200MB");
        }

        String contentType = file.getContentType();

        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Tipo de arquivo não permitido");
        }
    }
}