<?php

namespace App\Http\Controllers\Api\Article;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Repositories\ArticleEloquentRepository;
use App\Services\ArticleService;
use App\Traits\BaseCrudTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
class ArticleController extends Controller
{
    protected $storeFields;
    protected $updateFields;
    protected $with;
    protected $imageField;
    use BaseCrudTrait;
    public function __construct()
    {
        $storeFields = ['title','content','category_id','image','status'];
        $updateFields = ['title','content','category_id','image','status'];
        $appendRelation = ['tags'];
        $this->with = ['category', 'tags','images'];
        $this->imageField = 'image';
        $fileFields = ['image'];
        $repository = new ArticleEloquentRepository(new Article(), $this->with);
        $this->resourceClass = ArticleResource::class;
        $options = [
            'service' => 'Article',
            'slug' =>'title',
            'upload' => [
                'fields' => $fileFields,
                'path' => 'article',
            ],
            'storeField' => $storeFields,
            'updateField' => $updateFields,
            'appendRelation' => $appendRelation,
            'searchField' => ['title','content'],
        ];
        $this->service = new ArticleService($repository, $options);
    }

    /**
     * store post data to database table.
     *
     * @param $request: App\Http\Requests\Store{ Model }Request
     * @return JsonResponse
     */
    public function storeImage(Request $request, $id): JsonResponse
    {
        try {
            $payload = $this->service->storeImage($request, $this->imageField,$id);

            return $this->successResponse(new $this->resourceClass($payload), 'Image Article has been uploaded successfully.');
        } catch (\Exception $th) {
            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    public function deleteImage($id,$imageId): JsonResponse
    {
        try {
            $payload = $this->service->deleteImage($id,$imageId);
            return $this->successResponse(new $this->resourceClass($payload), 'Image Article has been deleted successfully.');
        } catch (\Exception $th) {
            return $this->errorResponse($th->getMessage(), 500);
        }
    }
}
