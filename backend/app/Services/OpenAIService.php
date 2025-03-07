<?php

namespace App\Services;

use OpenAI;

class OpenAIService
{
    protected $client;

    public function __construct()
    {
        $this->client = OpenAI::client(env('OPENAI_API_KEY'));
    }

    public function generateResponse($message)
    {
        $response = $this->client->chat()->create([
            'model' => 'gpt-4', // Or 'gpt-3.5-turbo'
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful assistant.'],
                ['role' => 'user', 'content' => $message],
            ],
        ]);

        return $response->choices[0]->message->content ?? 'I am unable to respond at the moment.';
    }
}
