<?php

namespace App\Services;
use Illuminate\Http\Request;

class ArticleService extends BaseService
{
    public function __construct($repository, $options)
    {
        // get $this from BaseService
        parent::__construct($repository, $options);
    }

    public function getData(Request $request)
    {
        try {
            $allData = $request->all_data ? true : false;
            $filters = [];

            if ($request->search_latest) {
                $filters = array_merge($filters, [
                    [
                        'column' => "created_at",
                        "type" => "latest",
                        'value' => $request->search_latest,
                    ]
                ]);
            }

            if ($request->search_category_id) {
                $filters = array_merge($filters, [
                    [
                        'column' => "category_id",
                        "type" => "single",
                        'value' => $request->search_category_id,
                    ]
                ]);
            }
            $data = $this->repository->getData($this->perPage, $this->page, $request->search, $this->searchField, $allData, $filters);
            return $data;
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function store($request)
    {
        try {
            $dataAppend = [];
            foreach ($this->fileFields as $field) {
                if ($request->hasFile($field)) {
                    $request[$field] = $this->storeFile($request, $field);
                }
            }
            if (count($this->appendRelation) > 0) {
                foreach ($this->appendRelation as $relation) {
                    $dataAppend[$relation] = $request[$relation];
                    unset($request[$relation]);
                }
            }
            $request = $this->settingPayload($request, 'store');
            if ($this->slug) {
                $request['slug'] = \Str::slug($request[$this->slug]);
            }

            $data = $this->repository->store($request);
            if ($dataAppend) {
                $data = $this->repository->appendRelation($data, $dataAppend);
            }
            return $data;
        } catch (\Throwable $th) {
            foreach ($this->fileFields as $field) {
                $this->deleteFile($request[$field]);
            }
            Log::warning($th->getMessage());
            throw $th;
        }
    }


    public function update($id, $request)
    {
        try {
            $dataAppend = [];
            foreach ($this->fileFields as $field) {
                if ($request->hasFile($field)) {
                    $imagePath = $this->find($id)?->image ?? '';
                    $request[$field] = $this->storeFile($request, $field, $imagePath);
                }
            }

            if (count($this->appendRelation) > 0) {
                foreach ($this->appendRelation as $relation) {
                    $dataAppend[$relation] = $request[$relation];
                    unset($request[$relation]);
                }
            }

            $request = $this->settingPayload($request, 'update');
            if ($this->slug) {
                $request['slug'] = \Str::slug($request[$this->slug]);
            }


            $data = $this->repository->update($id, $request);
            if ($dataAppend) {
                $data = $this->repository->appendRelation($data, $dataAppend);
            }
            if($data->deletedImage){
                $this->deleteFile($data->deletedImage->image);
            }
            return $data;
        } catch (\Throwable $th) {
            foreach ($this->fileFields as $field) {
                $this->deleteFile($request[$field]);
            }
            Log::warning($th->getMessage());
            throw $th;
        }
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
