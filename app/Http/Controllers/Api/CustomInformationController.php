<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomInformationResource;
use App\Models\CustomInformation;
use App\Repositories\BaseEloquentRepository;
use App\Services\CustomInformationService;
use App\Traits\BaseCrudTrait;
use App\Services\BaseService;

class CustomInformationController extends Controller
{
    protected $storeFields;
    protected $updateFields;
    protected $with;

    use BaseCrudTrait;
    public function __construct()
    {
        $storeFields = ['title', 'title_en', 'information_type_id', 'subtitle', 'description', 'description_en', 'image', 'icon', 'link', 'start_date', 'end_date'];
        $updateFields = ['title', 'title_en', 'information_type_id', 'subtitle', 'description', 'description_en', 'image', 'icon', 'link', 'start_date', 'end_date'];
        $fileFields = ['image'];
        $this->with = ['type'];
        $repository = new BaseEloquentRepository(new CustomInformation, $this->with);
        $this->resourceClass = CustomInformationResource::class;
        $options = [
            'service' => 'CustomInformation',
            'upload' => [
                'fields' => $fileFields,
                'path' => 'custom-information',
            ],
            'storeField' => $storeFields,
            'updateField' => $updateFields,
        ];
        $this->service = new CustomInformationService($repository, $options);
    }
}
