package com.rockepilates.bff.controller;

import com.rockepilates.bff.dto.MediaUploadResponse;
import com.rockepilates.bff.service.GerenciadorService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/bff/media")
public class MediaController {

    private final GerenciadorService service;

    public MediaController(GerenciadorService service) {
        this.service = service;
    }

    @PostMapping("/upload")
    public MediaUploadResponse upload(
            HttpServletRequest request,
            @RequestParam("file") MultipartFile file
    ) {
        return service.uploadMedia(request, file);
    }
}