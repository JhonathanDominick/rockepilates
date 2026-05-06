package com.rockepilates.gerenciador.controller;

import com.rockepilates.gerenciador.dto.MediaUploadResponse;
import com.rockepilates.gerenciador.service.storage.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/media")
@RequiredArgsConstructor
public class MediaController {

    private final StorageService storageService;

    @PostMapping("/upload")
    public MediaUploadResponse upload(@RequestParam("file") MultipartFile file) {
        return storageService.upload(file);
    }
}