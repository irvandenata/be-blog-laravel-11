<?php

namespace App\Services;

class ArticleService extends BaseService
{
    public function __construct($repository, $options)
    {
        // get $this from BaseService
        parent::__construct($repository, $options);
    }

    public function storeImage($request, $field, $id)
    {
        $model = $this->repository->findById($id);
        $image = $this->storeFile($request, $field);
        $model = $model->images()->create(['image' => $image]);
        return $model;
    }

    public function deleteImage($id, $imageId)
    {
        $model = $this->repository->findById($id);
        $image = $model->images()->findOrFail($imageId);
        $this->deleteFile($image->image);
        $image->delete();
        return $model;
    }
}
