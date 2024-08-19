<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ArticleEloquentRepository extends BaseEloquentRepository
{
    public function __construct(Model $model, $with = [])
    {
        parent::__construct($model, $with);
    }

    public function getDataBySlug($slug)
    {
        return $this->model->where('slug', $slug)->firstOrFail();
    }


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
            $image = '';
            if (isset($request['image'])) {
                $image = $request['image'];
                unset($request['image']);
            }

           

            $item = $item->create($request);
            if ($image) {
                $item->images()->create(['image' => $image]);
                $item->save();
            }
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
            $image = '';
            $deleteImage = '';

            if (isset($request['image'])) {
                $image = $request['image'];
                unset($request['image']);
            }

            $item->update($request);
            if ($image != '') {
                $deleteImage = $item->images()->first()?->image;
                $item->images()?->delete();
                $item->images()->create(['image' => $image]);
                $item->save();
            }

            DB::commit();
            $item->deleteImage = $deleteImage;
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
}
