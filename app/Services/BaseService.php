<?php

namespace App\Services;

use Illuminate\Http\Request;
use InvalidArgumentException;
use Illuminate\Support\Facades\Log;

class BaseService
{

    protected $repository;
    protected $perPage = 10;
    protected $page = 1;
    protected $search = null;
    protected $storeFields = [];
    protected $updateFields = [];

    public function __construct($repository, $storeFields = [], $updateFields = [])
    {
        $this->repository = $repository;
        $this->perPage = request('per_page');
        $this->page = request('page');
        $this->search = request('search');
        $this->storeFields = $storeFields;
        $this->updateFields = $updateFields;
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
            $request = $this->settingPayload($request, 'store');
            $data = $this->repository->store($request);
            return $data;
        } catch (\Throwable $th) {
            Log::warning($th->getMessage());
            throw $th;
        }
    }

    public function update($id, $request)
    {
        try {
            $request = $this->settingPayload($request, 'update');
            $data = $this->repository->update($id, $request);
            return $data;
        } catch (\Throwable $th) {
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
        $data = $request->all();
        $setFields = $type == 'update' ? $this->updateFields : $this->storeFields;
        $data = array_filter($data, function ($key) use ($setFields) {
            return in_array($key, $setFields);
        }, ARRAY_FILTER_USE_KEY);
        return $data;
    }
}
