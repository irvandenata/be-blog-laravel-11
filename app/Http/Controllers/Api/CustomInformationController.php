<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomInformationResource;
use App\Models\CustomInformation;
use App\Repositories\BaseEloquentRepository;
use App\Traits\BaseCrudTrait;
use App\Services\BaseService;

class CustomInformationController extends Controller
{
    protected $storeFields;
    protected $updateFields;
    use BaseCrudTrait;
    public function __construct()
    {
        $storeFields = ['title', 'information_type_id', 'subtitle', 'description', 'image', 'icon', 'link', 'start_date', 'end_date'];
        $updateFields = ['title', 'information_type_id', 'subtitle', 'description', 'image', 'icon', 'link', 'start_date', 'end_date'];
        $fileFields = ['image'];
        $repository = new BaseEloquentRepository(new CustomInformation);
        $this->resourceClass = CustomInformationResource::class;
        $this->service = new BaseService($repository, $storeFields, $updateFields, $fileFields, 'CustomInformation');
    }
}
