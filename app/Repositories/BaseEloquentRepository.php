<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BaseEloquentRepository
{
    /**
     * Eloquent model instance.
     */
    protected $model;
    protected $with = [];

    /**
     * load default class dependencies.
     * 
     * @param Model $model Illuminate\Database\Eloquent\Model
     */
    public function __construct(Model $model, $with = [])
    {
        $this->model = $model;
        $this->with = $with;
    }

    public function getData($perPage, $page, $search = '', $searchField = []): LengthAwarePaginator
    {
        $data = $this->model;
        if ($search) {
            $data = $data->where(function ($query) use ($search, $searchField) {
                foreach ($searchField as $field) {
                    $query->orWhere($field, 'like', '%' . $search . '%');
                }
            });
        }
        if (count($this->with) > 0) {
            $data = $data->with($this->with);
        }
        $data = $data->paginate($perPage, ['*'], 'page', $page);
        // $this->logActivity('retrieved');
        return $data;
    }

    /**
     * create new record in database.
     * 
     * @param array $request 
     * @return Model
     */
    public function store($request): Model
    {
        DB::beginTransaction();
        try {
            $item = $this->model;
            // check if has slug field
            if (isset($request['slug'])) {
                $checkSlug = $this->model->where('slug', $request['slug'])->first();
                if ($checkSlug) {
                    $request['slug'] = $request['slug'] . '-' . rand(1, 100);
                }
            }
            $item = $item->create($request);
            DB::commit();
            return $item;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        // activity log
        // try {
        //   activity('created')
        //     ->performedOn($item)
        //     ->causedBy(Auth::user());
        // } catch (\Exception $e) {
        //   return $e;
        // }
    }

    /**
     * update existing item.
     * 
     * @param  Integer $id integer item primary key.
     * @param Request $request Illuminate\Http\Request
     * @return send updated item object.
     */
    public function update($id, $request): Model
    {
        DB::beginTransaction();
        try {
            $item = $this->model->findOrFail($id);
            if (isset($request['slug'])) {
                $checkSlug = $this->model->where('slug', $request['slug'])->first();
                if ($checkSlug && $checkSlug->id != $id) {
                    $request['slug'] = $request['slug'] . '-' . rand(1, 100);
                }
            }
            $item->update($request);
            DB::commit();
            return $item;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        // activity log
        // try {
        //   activity('updated')
        //     ->performedOn($item)
        //     ->causedBy(Auth::user());
        // } catch (\Exception $e) {
        //   return $e;
        // }

    }

    /**
     * get requested item and send back.
     * 
     * @param  Integer $id: integer primary key value.
     * @return send requested item data.
     */
    public function findById($id): Model
    {
        try {
            return $this->model->findOrFail($id);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Delete item by primary key id.
     * 
     * @param  Integer $id integer of primary key id.
     * @return boolean
     */
    public function destroy($id): Model
    {
        DB::beginTransaction();
        try {
            $item = $this->model->findOrFail($id);
            $item->delete();
            DB::commit();
            return $item;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        // activity log
        // activity('deleted')
        //   ->performedOn($item)
        //   ->causedBy(Auth::user());
    }
    /**
     * Delete item by primary key id.
     * 
     * @param  Integer $id integer of primary key id.
     * @return boolean
     */
    public function softDelete($id)
    {
        DB::beginTransaction();
        try {

            $item = $this->model->findOrFail($id);
            $item->deleted_by = auth()->user()->id;
            $item->delete();
            $item->save();
            // activity log
            // activity('soft-deleted')
            //   ->performedOn($item)
            //   ->causedBy(Auth::user());
            DB::commit();
            return $item;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function with($relations)
    {
        return $this->model->with($relations);
    }

    public function appendRelation($model, $data)
    {
        foreach ($data as $key => $value) {
            $model->$key()->sync($value);
        }
        return $model;
    }

    public function removeAllRelation($model, $relation)
    {
        $model->$relation()->detach();
        return $model;
    }
    protected function logActivity($type, $model = null)
    {
        activity($type)->performedOn($model ?? $this->model)->causedBy(auth()->user());
    }
}
