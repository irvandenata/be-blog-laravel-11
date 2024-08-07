<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Intervention\Image\Laravel\Facades\Image;
use Storage;

class BaseService
{

    protected $repository;
    protected $perPage = 10;
    protected $page = 1;
    protected $search = null;
    protected $storeFields = [];
    protected $updateFields = [];
    protected $fileFields = [];
    protected $serviceName;

    public function __construct($repository, $storeFields = [], $updateFields = [], $fileFields = [], $serviceName)
    {

        $this->repository = $repository;
        $this->perPage = request('per_page');
        $this->page = request('page');
        $this->search = request('search');
        $this->storeFields = $storeFields;
        $this->updateFields = $updateFields;
        $this->serviceName = $serviceName;
        $this->fileFields = $fileFields;
    }

    public function getData(Request $request)
    {
        try {
            $data = $this->repository->getData($this->perPage, $this->page, $this->search, $request);
            return $data;
        } catch (\Throwable $th) {
            Log::warning($th->getMessage());
            throw $th;
        }
    }

    public function store($request)
    {
        try {
            foreach ($this->fileFields as $field) {
                if ($request->hasFile($field)) {
                    $request[$field] = $this->storeFile($request, $field);
                }
            }
            $request = $this->settingPayload($request, 'store');
            $data = $this->repository->store($request);
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
            foreach ($this->fileFields as $field) {
                if ($request->hasFile($field)) {
                    $imagePath = $this->find($id)?->image ?? '';
                    $request[$field] = $this->storeFile($request, $field, $imagePath);
                }
            }
            $request = $this->settingPayload($request, 'update');
            $data = $this->repository->update($id, $request);
            return $data;
        } catch (\Throwable $th) {
            foreach ($this->fileFields as $field) {
                $this->deleteFile($request[$field]);
            }
            Log::warning($th->getMessage());
            throw $th;
        }
    }

    public function softDelete($id)
    {
        try {
            $data = $this->repository->softDelete($id);
            return $data;
        } catch (\Throwable $th) {
            Log::warning($th->getMessage());
            throw $th;
        }
    }

    public function find(int $id)
    {
        return $this->repository->findById($id);
    }
    public function all()
    {
        return $this->repository->all();
    }

    public function delete(int $id)
    {
        try {
            $data = $this->repository->destroy($id);
            return $data;
        } catch (\Throwable $th) {
            Log::warning($th->getMessage());
            throw $th;
        }
    }

    protected function settingPayload($request, $type)
    {
        $data = $request->request->all();
        $setFields = $type == 'update' ? $this->updateFields : $this->storeFields;
        $data = array_filter($data, function ($key) use ($setFields) {
            return in_array($key, $setFields);
        }, ARRAY_FILTER_USE_KEY);
        return $data;
    }

    protected function storeFile($request, $field, $imagePath = '')
    {
        if ($request->hasFile($field)) {
            $image = Image::read($request->file($field))
                ->toWebp();

            //rand characters and numbers
            $fileName = $this->randomString(10) . '.webp';
            $path = 'images/' . $this->serviceName . "/" . $fileName;
            Storage::disk('public')->put($path, $image);
            if (Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
            return $path;
        }
        return '';
    }

    protected function deleteFile($imagePath)
    {
        if (Storage::disk('public')->exists($imagePath)) {
            Storage::disk('public')->delete($imagePath);
        }
    }


    protected function randomString($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
}
