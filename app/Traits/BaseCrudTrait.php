<?php

namespace App\Traits;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;
use App\Http\Resources\Resource;

trait BaseCrudTrait
{
    use ApiResponseTrait;

    private
        $service,
        $storeRequest,
        $updateRequest,
        $softDelete = true,
        $resourceClass = BaseResource::class;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = $this->service->getData($request);
        return new Resource(true, 'Data retrieved successfully', $query);
    }

    /**
     * store post data to database table.
     *
     * @param $request: App\Http\Requests\Store{ Model }Request
     * @return json response
     */
    public function store(Request $request)
    {
        try {
            $validation = ($this->storeRequest ?? request());
            $validated = $request->validate($validation->rules(), $validation->messages());
            $payload = $this->service->store($request);
            return $this->successResponse(new $this->resourceClass($payload), 'Data has been created successfully.');
        } catch (\Exception $th) {
            return $this->errorResponse($th->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $payload = $this->service->find($id);
        return $this->successResponse(new $this->resourceClass($payload), 'Data found.');
    }

    /**
     * update post data to database table.
     *
     * @param $request: App\Http\Requests\Update{ Model }Request
     * @return json response
     */
    public function update(Request $request, $id)
    {
        $validation = $this->updateRequest ?? request();
        $validated = $request->validate($validation->rules(), $validation->messages());
        $payload = $this->service->update($id, $request);
        return $this->successResponse(new $this->resourceClass($payload), 'Changes has been successfully saved.');
    }

    /**
     * delete post by id.
     *
     * @param integer $id: integer post id.
     * @return json response.
     */
    public function destroy($id)
    {
        $query = $this->softDelete ? $this->service->softDelete($id) : $this->service->delete($id);
        return $this->successResponse(new $this->resourceClass($query), 'Data has been deleted successfully.');
    }
}
