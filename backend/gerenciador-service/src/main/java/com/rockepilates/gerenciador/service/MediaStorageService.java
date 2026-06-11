package com.rockepilates.gerenciador.service;

import com.rockepilates.gerenciador.config.StorageProperties;
import com.rockepilates.gerenciador.dto.MediaUploadResponse;
import com.rockepilates.gerenciador.service.storage.StorageService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@ConditionalOnProperty(name = "storage.provider", havingValue = "local", matchIfMissing = true)
public class MediaStorageService implements StorageService {

    private static final long MAX_FILE_SIZE = 10L * 1024 * 1024;

    private static final Map<String, Set<String>> ALLOWED_EXTENSIONS_BY_CONTENT_TYPE = Map.of(
            "image/jpeg", Set.of(".jpg", ".jpeg"),
            "image/jpg", Set.of(".jpg", ".jpeg"),
            "image/png", Set.of(".png"),
            "image/webp", Set.of(".webp")
    );

    private final StorageProperties storageProperties;

    public MediaStorageService(StorageProperties storageProperties) {
        this.storageProperties = storageProperties;
    }

    @Override
    public MediaUploadResponse upload(MultipartFile file) {
        try {
            String extension = validarArquivo(file);

            String uploadDir = storageProperties.getLocal().getUploadDir();
            String publicUrlPrefix = storageProperties.getLocal().getPublicUrlPrefix();
            Path uploadPath = Path.of(uploadDir).toAbsolutePath().normalize();

            Files.createDirectories(uploadPath);

            String filename = UUID.randomUUID() + extension;
            Path destination = uploadPath.resolve(filename).normalize();

            if (!destination.startsWith(uploadPath)) {
                throw new IllegalArgumentException("Nome de arquivo inválido");
            }

            file.transferTo(destination);

            return new MediaUploadResponse(publicUrlPrefix + "/" + filename);
        } catch (IOException exception) {
            throw new RuntimeException("Erro ao fazer upload do arquivo", exception);
        }
    }

    private String validarArquivo(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Arquivo não enviado");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Arquivo excede o limite de 10MB");
        }

        String contentType = file.getContentType();

        if (contentType == null || !ALLOWED_EXTENSIONS_BY_CONTENT_TYPE.containsKey(contentType)) {
            throw new IllegalArgumentException("Tipo de arquivo não permitido");
        }

        String extension = extrairExtensaoNormalizada(file.getOriginalFilename());

        if (!ALLOWED_EXTENSIONS_BY_CONTENT_TYPE.get(contentType).contains(extension)) {
            throw new IllegalArgumentException("Extensão incompatível com o tipo do arquivo");
        }

        validarAssinatura(file, contentType);

        if (".jpeg".equals(extension)) {
            return ".jpg";
        }

        return extension;
    }

    private String extrairExtensaoNormalizada(String originalFilename) {
        if (originalFilename == null || originalFilename.isBlank() || !originalFilename.contains(".")) {
            throw new IllegalArgumentException("Extensão de arquivo obrigatória");
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf("."))
                .toLowerCase(Locale.ROOT);

        boolean extensaoPermitida = ALLOWED_EXTENSIONS_BY_CONTENT_TYPE.values().stream()
                .anyMatch(extensoes -> extensoes.contains(extension));

        if (!extensaoPermitida) {
            throw new IllegalArgumentException("Extensão de arquivo não permitida");
        }

        return extension;
    }

    private void validarAssinatura(MultipartFile file, String contentType) throws IOException {
        byte[] header;

        try (InputStream inputStream = file.getInputStream()) {
            header = inputStream.readNBytes(12);
        }

        boolean assinaturaValida = switch (contentType) {
            case "image/jpeg", "image/jpg" -> isJpeg(header);
            case "image/png" -> isPng(header);
            case "image/webp" -> isWebp(header);
            default -> false;
        };

        if (!assinaturaValida) {
            throw new IllegalArgumentException("Conteúdo do arquivo não corresponde a uma imagem permitida");
        }
    }

    private boolean isJpeg(byte[] header) {
        return header.length >= 3
                && (header[0] & 0xFF) == 0xFF
                && (header[1] & 0xFF) == 0xD8
                && (header[2] & 0xFF) == 0xFF;
    }

    private boolean isPng(byte[] header) {
        return header.length >= 8
                && (header[0] & 0xFF) == 0x89
                && header[1] == 0x50
                && header[2] == 0x4E
                && header[3] == 0x47
                && header[4] == 0x0D
                && header[5] == 0x0A
                && header[6] == 0x1A
                && header[7] == 0x0A;
    }

    private boolean isWebp(byte[] header) {
        return header.length >= 12
                && header[0] == 0x52
                && header[1] == 0x49
                && header[2] == 0x46
                && header[3] == 0x46
                && header[8] == 0x57
                && header[9] == 0x45
                && header[10] == 0x42
                && header[11] == 0x50;
    }
}
