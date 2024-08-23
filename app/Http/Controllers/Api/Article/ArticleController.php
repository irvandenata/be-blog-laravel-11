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
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
class ArticleController extends Controller
{
    protected $storeFields;
    protected $updateFields;
    protected $with;
    protected $imageField;
    use BaseCrudTrait;
    public function __construct()
    {
        $storeFields = ['title', 'content', 'category_id', 'image', 'status'];
        $updateFields = ['title', 'content', 'category_id', 'image', 'status'];
        $appendRelation = ['tags'];
        $this->with = ['category', 'tags', 'images'];
        $this->imageField = 'image';
        $fileFields = ['image'];
        $repository = new ArticleEloquentRepository(new Article(), $this->with);
        $this->resourceClass = ArticleResource::class;
        $options = [
            'service' => 'Article',
            'slug' => 'title',
            'upload' => [
                'fields' => $fileFields,
                'path' => 'article',
            ],
            'storeField' => $storeFields,
            'updateField' => $updateFields,
            'appendRelation' => $appendRelation,
            'searchField' => ['title', 'content'],
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
            $payload = $this->service->storeImage($request, $this->imageField, $id);

            return $this->successResponse(new $this->resourceClass($payload), 'Image Article has been uploaded successfully.');
        } catch (\Exception $th) {
            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    public function deleteImage($id, $imageId): JsonResponse
    {
        try {
            $payload = $this->service->deleteImage($id, $imageId);
            return $this->successResponse(new $this->resourceClass($payload), 'Image Article has been deleted successfully.');
        } catch (\Exception $th) {
            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    public function getDataBySlug(string $slug): JsonResponse
    {
        try {
            $payload = $this->service->getDataBySlug($slug);
            return $this->successResponse(new $this->resourceClass($payload), 'Data has been retrieved successfully.');
        } catch (\Exception $th) {
            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    public function createComment(Request $request): JsonResponse
    {
        try {
            // validate username not include space
            $request->validate([
                'username' => 'required|string|regex:/^\S*$/u',
                'password' => 'required',
                'comment' => 'required',
                'article_id' => 'required',
            ]);
            $payload = $this->service->createComment($request);
            return $this->successResponse($payload, 'Comment has been created successfully.');
        } catch (NotFoundHttpException $th) {
            return $this->errorResponse($th->getMessage(), 404);
        } catch (\Exception $th) {
            if (isset($th->validator)) {
                return $this->errorResponse($th->validator->errors(), 422);
            }
            return $this->errorResponse($th->getMessage(), 500);
        }
    }
}
