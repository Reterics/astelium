<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ChatMessage;
use App\Services\OpenAIService;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    protected $openAI;

    public function __construct(OpenAIService $openAI)
    {
        $this->openAI = $openAI;
    }

    public function index()
    {
        return response()->json(ChatMessage::latest()->get());
    }

    public function store(Request $request)
    {
        $userMessage = ChatMessage::create([
            'author' => Auth::user()->name,
            'text' => $request->text,
        ]);

        // Generate AI response
        $aiResponse = $this->openAI->generateResponse($request->text);

        if ($aiResponse === false) {
            return response(500);
        }

        $botMessage = ChatMessage::create([
            'author' => 'AI Bot',
            'text' => $aiResponse,
        ]);

        return response()->json([$userMessage, $botMessage]);
    }
}
