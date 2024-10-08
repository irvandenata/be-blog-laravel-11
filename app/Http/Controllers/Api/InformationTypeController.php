<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InformationType;
use App\Repositories\BaseEloquentRepository;
use App\Traits\BaseCrudTrait;
use App\Services\BaseService;

class InformationTypeController extends Controller
{
    protected $storeFields;
    protected $updateFields;
    use BaseCrudTrait;
    public function __construct()
    {
        $storeFields = ['name'];
        $updateFields = ['name'];
        $fileFields = [];
        $repository = new BaseEloquentRepository(new InformationType);
        $options = [
            'service' => 'CustomInformation',
            'storeField' => $storeFields,
            'updateField' => $updateFields,
            'searchField' => ['name'],
        ];
        $this->service = new BaseService($repository, $options);
    }
}
