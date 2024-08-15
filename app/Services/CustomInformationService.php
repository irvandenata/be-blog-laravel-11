<?php

namespace App\Services;

use Illuminate\Http\Request;

class CustomInformationService extends BaseService
{
    public function __construct($repository, $options)
    {
        // get $this from BaseService
        parent::__construct($repository, $options);
    }


    public function getData(Request $request)
    {
        try {
            $allData = $request->all_data ? true : false;
            $filters = [];
            if ($request->search_subtitles) {
                $filters = [
                    [
                        'column' => "subtitle",
                        "type" => "array_text",
                        'value' => $request->search_subtitles,
                    ]
                ];
            }
            if ($request->search_type_id) {
                $filters = array_merge($filters, [
                    [
                        'column' => "information_type_id",
                        "type" => "single",
                        'value' => $request->search_type_id,
                    ]
                ]);
            }
            $data = $this->repository->getData($this->perPage, $this->page, $request->search, $this->searchField, $allData, $filters);
            return $data;
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
