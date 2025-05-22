<?php

namespace App\Repositories;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ArticleEloquentRepository extends BaseEloquentRepository
{
    public function __construct(Model $model, $with = [])
    {

        parent::__construct($model, $with);
    }

    public function getData($perPage, $page, $search = '', $searchField = [], $allData = false, $filter = []): LengthAwarePaginator
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
        if (count($filter) > 0) {
            foreach ($filter as $value) {
                if ($value['type'] == 'array_text') {
                    $data = $data->where(function ($query) use ($value) {
                        foreach ($value['value'] as $val) {
                            $query->orWhere($value['column'], 'like', '%' . $val . '%');
                        }
                    });

                } else if ($value['type'] == 'single') {
                    $data = $data->where($value['column'], $value['value']);
                } else if ($value['type'] == 'latest') {
                    $data = $data->orderBy($value['column'], 'desc');
                }
                if ($value['type'] == 'sort') {
                    $data = $data->orderBy($value['column'], $value['value']);
                }
            }
        }

        if ($allData) {
            $data = $data->paginate($data->count(), ['*'], 'page', $page);
        } else {
            $data = $data->paginate($perPage, ['*'], 'page', $page);
        }

        return $data;
    }


    public function getDataBySlug($slug)
    {
        // get header request value count
        $count = request()->header('count');
        $data = $this->model->where('slug', $slug)->firstOrFail();
        if ($count) {
            $data->increment('views');
        }
        return $data;
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


    public function createComment($request)
    {
        DB::beginTransaction();
        try {
            // find acticle 
            $article = $this->model->findOrFail($request->article_id);
            $comment = Comment::create([
                'article_id' => $request->article_id,
                'user_id' => $request->user_id,
                'comment' => $request->comment,
            ]);
            DB::commit();
            return $comment;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function createUser($request)
    {
        $user = User::create([
            'name' => $request->username,
            'email' => $request->username . rand(1, 100) . '@mail.com',
            'username' => $request->username,
            'password' => \Hash::make($request->password),
        ]);
        return $user;
    }


    public function getComments($slug)
    {
        return $this->model->where('slug', $slug)->firstOrFail()->comments;
    }
}
