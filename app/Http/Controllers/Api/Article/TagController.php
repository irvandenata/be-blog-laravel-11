<?php

namespace App\Http\Controllers\Api\Article;

use App\Http\Controllers\Controller;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use App\Repositories\BaseEloquentRepository;
use App\Traits\BaseCrudTrait;
use App\Services\BaseService;

class TagController extends Controller
{
    protected $storeFields;
    protected $updateFields;
    use BaseCrudTrait;
    public function __construct()
    {
        $storeFields = ['name'];
        $updateFields = ['name'];
        $repository = new BaseEloquentRepository(new Tag());
        $this->resourceClass = TagResource::class;
        $options = [
            'service' => 'ArticleTag',
            'slug' =>'name',
            'storeField' => $storeFields,
            'updateField' => $updateFields,
        ];
        $this->service = new BaseService($repository, $options);
    }
}
