<?php
namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\Client;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_projects' => Project::count(),
            'total_tasks' => Task::count(),
            'total_clients' => Client::count(),
            'tasks_by_status' => Task::groupBy('status')->selectRaw('status, COUNT(*) as count')->get(),
            'projects_by_status' => Project::groupBy('status')->selectRaw('status, COUNT(*) as count')->get(),
        ]);
    }
}
