<?php

namespace App\Http\Controllers\Api\CustomInformation;

use App\Http\Controllers\Controller;
use App\Models\InformationType;
use App\Repositories\BaseEloquentRepository;
use App\Traits\BaseCrudTrait;
use App\Services\BaseService;
use Illuminate\Http\Request;

class InformationTypeController extends Controller
{
    protected $storeFields;
    protected $updateFields;
    use BaseCrudTrait;
    public function __construct()
    {
        $storeFields = ['name'];
        $updateFields = ['name'];
        $repository = new BaseEloquentRepository(new InformationType);
        $this->service = new BaseService($repository, $storeFields, $updateFields);
    }
}
