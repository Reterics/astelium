<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Models\ContactMessage;

class ContactController extends Controller
{
    public function store(StoreContactRequest $request)
    {
        $data = $request->validated();

        // Save to DB
        ContactMessage::create($data);


        return response()->json(['message' => 'Thanks for contacting us!'], 200);
    }
}
