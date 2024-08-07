<?php

namespace App\Http\Controllers\Api\Article;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomInformationResource;
use App\Models\Category;
use App\Models\CustomInformation;
use App\Repositories\BaseEloquentRepository;
use App\Traits\BaseCrudTrait;
use App\Services\BaseService;

class CategoryController extends Controller
{
    protected $storeFields;
    protected $updateFields;
    use BaseCrudTrait;
    public function __construct()
    {
        $storeFields = ['name','image'];
        $updateFields = ['name', 'image'];
        $fileFields = ['image'];
        $repository = new BaseEloquentRepository(new Category());
        // $this->resourceClass = CustomInformationResource::class;
        $options = [
            'service' => 'ArticleCategory',
            'slug' =>'name',
            'upload' => [
                'fields' => $fileFields,
                'path' => 'article-category',
            ],
            'storeField' => $storeFields,
            'updateField' => $updateFields,
        ];
        $this->service = new BaseService($repository, $options);
    }
}
