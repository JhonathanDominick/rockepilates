package com.rockepilates.gerenciador.service;

import com.rockepilates.gerenciador.config.StorageProperties;
import com.rockepilates.gerenciador.dto.MediaUploadResponse;
import com.rockepilates.gerenciador.service.storage.StorageService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Set;
import java.util.UUID;

@Service
@ConditionalOnProperty(name = "storage.provider", havingValue = "local", matchIfMissing = true)
public class MediaStorageService implements StorageService {

    private static final long MAX_FILE_SIZE = 200L * 1024 * 1024;

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

    private final StorageProperties storageProperties;

    public MediaStorageService(StorageProperties storageProperties) {
        this.storageProperties = storageProperties;
    }

    @Override
    public MediaUploadResponse upload(MultipartFile file) {
        validarArquivo(file);

        try {
            String uploadDir = storageProperties.getLocal().getUploadDir();
            String publicUrlPrefix = storageProperties.getLocal().getPublicUrlPrefix();

            Files.createDirectories(Path.of(uploadDir));

            String originalFilename = file.getOriginalFilename();
            String extension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String filename = UUID.randomUUID() + extension;
            Path destination = Path.of(uploadDir, filename);

            file.transferTo(destination);

            return new MediaUploadResponse(publicUrlPrefix + "/" + filename);
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