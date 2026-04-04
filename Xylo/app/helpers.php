<?php

if (!function_exists('cloudinary_upload')) {
    /**
     * Upload a file to Cloudinary
     *
     * @param mixed $file
     * @param array $options
     * @return array|null
     */
    function cloudinary_upload($file, array $options = []): ?array
    {
        try {
            $cloudinary = new \Cloudinary\Cloudinary([
                'cloud' => [
                    'cloud_name' => config('cloudinary.cloud_name'),
                    'api_key' => config('cloudinary.api_key'),
                    'api_secret' => config('cloudinary.api_secret'),
                ],
            ]);

            $uploadApi = $cloudinary->uploadApi();
            $filePath = $file instanceof \Illuminate\Http\UploadedFile ? $file->getRealPath() : $file;

            $uploadOptions = array_merge([
                'folder' => config('cloudinary.defaults.folder', 'xylo-apparel'),
                'resource_type' => 'auto',
                'quality' => 'auto',
            ], $options);

            $result = $uploadApi->upload($filePath, $uploadOptions);

            return [
                'public_id' => $result['public_id'],
                'url' => $result['secure_url'],
                'width' => $result['width'] ?? null,
                'height' => $result['height'] ?? null,
                'format' => $result['format'] ?? null,
                'resource_type' => $result['resource_type'] ?? null,
                'bytes' => $result['bytes'] ?? null,
            ];
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Cloudinary upload failed: ' . $e->getMessage());
            return null;
        }
    }
}

if (!function_exists('cloudinary_delete')) {
    /**
     * Delete a file from Cloudinary
     *
     * @param string $publicId
     * @return bool
     */
    function cloudinary_delete(string $publicId): bool
    {
        try {
            $cloudinary = new \Cloudinary\Cloudinary([
                'cloud' => [
                    'cloud_name' => config('cloudinary.cloud_name'),
                    'api_key' => config('cloudinary.api_key'),
                    'api_secret' => config('cloudinary.api_secret'),
                ],
            ]);

            $cloudinary->uploadApi()->destroy($publicId);
            return true;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Cloudinary delete failed: ' . $e->getMessage());
            return false;
        }
    }
}

if (!function_exists('cloudinary_url')) {
    /**
     * Get a transformed image URL from Cloudinary
     *
     * @param string $publicId
     * @param string|array|null $transformation
     * @return string
     */
    function cloudinary_url(string $publicId, $transformation = null): string
    {
        if (is_string($transformation)) {
            $transformation = config("cloudinary.transformations.{$transformation}", []);
        }

        return cloudinary()->image($publicId)
            ->addTransformation($transformation ?? [])
            ->toUrl();
    }
}
