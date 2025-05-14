<?php

namespace App\Services;

use App\Http\Requests\StoreRequestRequest;
use App\Http\Requests\UpdateRequestStatusRequest;
use App\Models\Request;

class RequestService
{
    public function createRequest(StoreRequestRequest $request)
    {
        return Request::create($request->validated());
    }

    public function updateRequestStatus(UpdateRequestStatusRequest $request, $id)
    {
        $requestItem = Request::findOrFail($id);
        return $requestItem->update($request->validated());
    }

    public function deleteRequest($id)
    {
        $request = Request::findOrFail($id);

        return $request->delete();
    }

    public function getAllRequests()
    {
        return Request::all();
    }
}
