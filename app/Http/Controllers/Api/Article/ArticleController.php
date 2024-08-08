<?php

namespace App\Http\Controllers\Api\Article;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Repositories\BaseEloquentRepository;
use App\Traits\BaseCrudTrait;
use App\Services\BaseService;

class ArticleController extends Controller
{
    protected $storeFields;
    protected $updateFields;
    protected $with;
    use BaseCrudTrait;
    public function __construct()
    {
        $storeFields = ['title','content','category_id'];
        $updateFields = ['title','content','category_id'];
        $appendRelation = ['tags'];
        $this->with = ['category', 'tags'];
        $repository = new BaseEloquentRepository(new Article(), $this->with, $appendRelation);
        $this->resourceClass = ArticleResource::class;
        $options = [
            'service' => 'Article',
            'slug' =>'title',
            'storeField' => $storeFields,
            'updateField' => $updateFields,
            'appendRelation' => $appendRelation,
        ];
        $this->service = new BaseService($repository, $options);
    }
}
