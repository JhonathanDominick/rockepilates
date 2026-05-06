package com.rockepilates.gerenciador.service.storage;

import com.rockepilates.gerenciador.dto.MediaUploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    MediaUploadResponse upload(MultipartFile file);

}