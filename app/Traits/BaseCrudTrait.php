<?php

namespace App\Traits;

use App\Http\Resources\BaseResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Resources\Resource;
use Illuminate\Http\Resources\Json\JsonResource;

trait BaseCrudTrait
{
    use ApiResponseTrait;
    private
    $service,
    $storeRequest,
    $updateRequest,
    $softDelete = false,
    $slug,
    $resourceClass = BaseResource::class;



    /**
     * get all data from database table.
     * @param $request: Illuminate\Http\Request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResource
    {
        $query = $this->service->getData($request);
        return new Resource(true, 'Data retrieved successfully', $query);
    }

    /**
     * store post data to database table.
     *
     * @param $request: App\Http\Requests\Store{ Model }Request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            if ($this->storeRequest) {
                $validation = $this->storeRequest;
                $validated = $request->validate($validation->rules(), $validation->messages());
            }
            $payload = $this->service->store($request);
            return $this->successResponse(new $this->resourceClass($payload), 'Data has been created successfully.');
        } catch (\Exception $th) {
            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        $payload = $this->service->find($id);
        return $this->successResponse(new $this->resourceClass($payload), 'Data found.');
    }

    /**
     * update post data to database table.
     *
     * @param $request: App\Http\Requests\Update{ Model }Request
     * @return JsonResponse
     */
    public function update(Request $request, $id): JsonResponse
    {
        if ($this->updateRequest) {
            $validation = $this->updateRequest;
            $validated = $request->validate($validation->rules(), $validation->messages());
        }
        $payload = $this->service->update($id, $request);
        return $this->successResponse(new $this->resourceClass($payload), 'Changes has been successfully saved.');
    }

    /**
     * delete post by id.
     *
     * @param integer $id: integer post id.
     * @return json response.
     */
    public function destroy($id): JsonResponse
    {
        try {
        $query = $this->softDelete ? $this->service->softDelete($id) : $this->service->delete($id);
        return $this->successResponse(new $this->resourceClass($query), 'Data has been deleted successfully.');
        } catch (\Exception $th) {
            return $this->errorResponse($th->getMessage(), 500);
        }
    }
}
