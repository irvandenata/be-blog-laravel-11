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

    /**
     * load default class dependencies.
     * 
     * @param Model $model Illuminate\Database\Eloquent\Model
     */
    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function getData($perPage, $page): LengthAwarePaginator
    {
        $data = $this->model->paginate($perPage);
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
            $item = $item->create($request);
            DB::commit();
            return $item;
        }
        catch (\Exception $e) {
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
    public function update($id,$request): Model
    {
        DB::beginTransaction();
        try {
            $item = $this->model->findOrFail($id);
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
    protected function logActivity($type, $model = null)
    {
        activity($type)->performedOn($model ?? $this->model)->causedBy(auth()->user());
    }
}
